import { randomUUID } from 'node:crypto'

import { STILL_GENERATION_COST } from '../../lib/constants.js'
import { costData } from '../../lib/mmaCost/mmaCostLib.js'
import { stillMmaVars } from '../../lib/mmaVars/mmaVarsLib.js'
import type {
  MmaSpend,
  MmaStatus,
  StepTiming,
  StillGenerationRequest,
  StillGenerationResult,
} from '../../types/mma/mma.types.js'
import { recordTransaction, refundMmaCharge } from '../../services/credits.service.js'
import { costRates } from './mmaCostRates.service.js'
import { logMmaError } from './mmaErrorLogger.service.js'
import { writeSeo } from './mmaSeo.service.js'
import { runCreateAssetIntelligence } from './mmaStep1/mmaCreateAssets.service.js'
import { runKnowledgeFiles } from './mmaStep2/mmaKnowledgeFiles.service.js'
import { runStillPrompter } from './mmaStep3/mmaStillPrompter.service.js'
import { runGptImage, runNanoBanana } from './mmaStep4/mmaStillGenerate.service.js'
import { supabase } from '../../services/thirdPartyClients/supabase.client.js'

/** The `mma_step` row holding one step's `mg_payload`, under its generation. */
function stepRow(passId: string, generationId: string, stepNo: number, stepType: string, payload: object, at: string) {
  return {
    mg_pass_id: passId,
    mg_created_at: at,
    mg_updated_at: at,
    mg_id: `mma_step:${generationId}:${stepNo}`,
    mg_record_type: 'mma_step',
    mg_generation_id: generationId,
    mg_parent_id: `generation:${generationId}`,
    mg_step_no: stepNo,
    mg_step_type: stepType,
    mg_payload: payload,
  }
}

/** Writes a finished step's row, dated when the step ended. */
async function insertStep(
  passId: string,
  generationId: string,
  stepNo: number,
  stepType: string,
  payload: { timing: StepTiming },
) {
  const { error } = await supabase
    .from('mega_generations')
    .insert(stepRow(passId, generationId, stepNo, stepType, payload, payload.timing.ended_at), { defaultToNull: false })

  if (error) throw new Error(error.message)
}

/** Updates the generation row the steps belong to. */
async function updateGeneration(generationId: string, fields: object) {
  const { error } = await supabase
    .from('mega_generations')
    .update({ ...fields, mg_updated_at: new Date().toISOString() })
    .eq('mg_id', `generation:${generationId}`)

  if (error) throw new Error(error.message)
}

/**
 * Marks the step the pipeline is starting, for the studio to choose what Mina
 * types meanwhile. Only logged when it fails: the picture matters more.
 */
const markStatus = (generationId: string, status: MmaStatus) =>
  updateGeneration(generationId, { mg_mma_status: status }).catch(logMmaError)

/** The lane a still renders on: Creative is GPT Image, Niche is NanoBanana. */
const laneOf = (request: StillGenerationRequest) => (request.isCreative ? 'creative' : 'niche')

/**
 * Gives the customer their matcha back, then marks the generation as failed
 * with why in `mg_error`, and what the calls that did run cost, sold for
 * nothing, in `mg_cost_data`. The refund goes first: it is what the customer
 * cannot do without.
 */
async function failGeneration(
  passId: string,
  generationId: string,
  request: StillGenerationRequest,
  spend: MmaSpend,
  code: string,
  message: string,
) {
  await refundMmaCharge(passId, generationId)
  await updateGeneration(generationId, {
    mg_status: 'error',
    mg_mma_status: 'error',
    mg_error: { code, message },
    mg_cost_data: costData(laneOf(request), spend, false, costRates()),
  })
}

/**
 * The MMA steps of a still, each fed by the one before. Nobody waits on them:
 * a step that fails says why in its payload's `error`, the steps after it do
 * not run, and the generation fails with that step's code and message.
 * Every paid call is added to `spend` as it returns, so `mg_cost_data` can be
 * priced whether the generation ends done or failed.
 */
async function runStillPipeline(
  passId: string,
  generationId: string,
  imageSessionId: string,
  request: StillGenerationRequest,
  spend: MmaSpend,
) {
  const fail = (code: string, message: string | null) =>
    failGeneration(passId, generationId, request, spend, code, message ?? '')

  await markStatus(generationId, 'scanning')
  const assets = await runCreateAssetIntelligence(request.brief, request.uploads)
  if (assets.usage) spend.claude.push(assets.usage)

  const { error } = await supabase
    .from('mega_generations')
    .update({ mg_payload: assets, mg_updated_at: assets.timing.ended_at })
    .eq('mg_id', `mma_step:${generationId}:1`)

  if (error) throw new Error(error.message)
  if (!assets.output) return fail('create_asset_intelligence_failed', assets.error)

  await markStatus(generationId, 'prompting')
  const knowledge = runKnowledgeFiles(laneOf(request), assets.output)
  await insertStep(passId, generationId, 2, 'knowledge_files', knowledge.payload)

  const prompt = await runStillPrompter(request.brief, assets.output, knowledge.docs)
  if (prompt.usage) spend.claude.push(prompt.usage)
  await insertStep(passId, generationId, 3, 'gpt_still_one_shot', prompt)
  if (!prompt.output) return fail('gpt_still_one_shot_failed', prompt.error)

  await markStatus(generationId, 'generating')

  // Written before the picture exists, from Claude's own prompt (no lock, no "Avoid:" list),
  // so step 4 can write it into the file before the upload.
  const { seo, spend: seoSpend } = await writeSeo(passId, generationId, prompt.output.debug.clean_prompt, request)
  spend.seo = seoSpend

  // The pictures step 3 sent Claude are the ones the image engine works from.
  const images = prompt.labeledImages.map((image) => image.url)
  const stepType = request.isCreative ? 'gpt_image_2_generate' : 'nanobanana_generate'
  const generated = request.isCreative
    ? await runGptImage(prompt.output.clean_prompt, images, request.aspectRatio, seo)
    : await runNanoBanana(prompt.output.clean_prompt, images, request.aspectRatio, seo)
  spend.image = generated.spend
  const still = generated.payload
  await insertStep(passId, generationId, 4, stepType, still)
  if (!still.output) return fail(`${stepType}_failed`, still.error)

  //The picture exists by now, so a failed update here is only logged: no refund, and the generation is not marked as failed.
  //it's catched by logMmaError so that it doesn't reach the top level and trigger a refund, since the picture is already stored and the generation is done.
  await updateGeneration(generationId, {
    mg_status: 'done',
    mg_mma_status: 'done',
    mg_prompt: prompt.output.clean_prompt,
    mg_output_url: still.output,
    mg_meta: { seo, provenance: generated.provenance },
    mg_cost_data: costData(laneOf(request), spend, true, costRates()),
    mg_mma_vars: stillMmaVars({
      passId,
      generationId,
      imageSessionId,
      request,
      assetPlan: assets.output,
      knowledgeRoute: knowledge.payload.output.route,
      cleanPrompt: prompt.output.clean_prompt,
      outputUrl: still.output,
    }),
  }).catch(logMmaError)
}

/**
 * Starts a Create (still image) generation: the rows that frame it, then the
 * matcha it costs.
 *
 * Written to `mega_generations`, in this order:
 * - a "Mina Studio session" row, only the first time this browser tab's studio
 *   session is seen — a closed tab comes back with a new one;
 * - an "Image session" row, new for every generation;
 * - the `generation` row and its MMA step 1, both skeletons the pipeline fills in;
 * - the `credit_transaction` charging for it, with the balance on `mega_customers`.
 *
 * Then starts the MMA steps: step 1 fills its row in, steps 2, 3 and 4 add theirs.
 */
export async function startStillGeneration(
  userId: string,
  request: StillGenerationRequest,
): Promise<StillGenerationResult> {
  const passId = `pass:user:${userId}`

  const { data: customer, error: customerError } = await supabase
    .from('mega_customers')
    .select('mg_credits')
    .eq('mg_pass_id', passId)
    .maybeSingle()

  if (customerError) throw new Error(customerError.message)
  if (!customer) throw new Error(`No mega_customers row for ${passId}`)

  // Checked before anything is written, so a refused generation leaves no rows behind.
  const creditsBefore = Number(customer.mg_credits ?? 0)
  if (creditsBefore < STILL_GENERATION_COST) throw new Error('Not enough matcha')

  // Check if this studio session has been seen before, so we only write the
  // "Mina Studio session" row once per tab. The image session and generation
  // rows are new every time.
  const { data: studioSession, error: sessionError } = await supabase
    .from('mega_generations')
    .select('mg_id')
    .eq('mg_id', `session:${request.studioSessionId}`)
    .eq('mg_pass_id', passId)
    .maybeSingle()

  if (sessionError) throw new Error(sessionError.message)

  const at = new Date().toISOString()
  const imageSessionId = randomUUID()
  const generationId = randomUUID()
  const owned = { mg_pass_id: passId, mg_created_at: at, mg_updated_at: at }
  const session = (id: string, title: string, meta: object) => ({
    ...owned,
    mg_id: `session:${id}`,
    mg_record_type: 'session',
    mg_status: 'succeeded',
    mg_meta: meta,
    mg_event_at: at,
    mg_session_id: id,
    mg_platform: request.platform,
    mg_title: title,
  })

  // We insert 2 rows if the studio session is new, we always insert the image session, generation, and step 1 rows.
  const rows = [
    ...(studioSession
      ? []
      : [
          session(request.studioSessionId, 'Mina Studio session', {
            ip: request.ip,
            requestId: `sess_${Date.now()}_${randomUUID()}`,
            userAgent: request.userAgent,
          }),
        ]),
    session(imageSessionId, 'Image session', { flow: 'still_create', source: 'mma' }),
    {
      ...owned,
      mg_id: `generation:${generationId}`,
      mg_record_type: 'generation',
      mg_generation_id: generationId,
      mg_mma_mode: 'still',
      mg_mma_status: 'progressing',
      mg_status: 'progressing',
      mg_mma_vars: {},
      mg_prompt: '',
      mg_output_url: '',
      mg_meta: {},
      mg_session_id: imageSessionId,
      mg_platform: request.platform,
      mg_title: 'Image session',
      mg_type: 'image',
      mg_content_type: 'image',
      mg_cost_data: {},
    },
    stepRow(passId, generationId, 1, 'create_asset_intelligence', {}, at),
  ]

  // One insert for every row, each leaving the columns it does not set at the
  // table's default rather than null.
  const { error: insertError } = await supabase.from('mega_generations').insert(rows, { defaultToNull: false })
  if (insertError) throw new Error(insertError.message)

  const creditsAfter = creditsBefore - STILL_GENERATION_COST

  await recordTransaction({
    passId,
    delta: -STILL_GENERATION_COST,
    reason: request.isCreative ? 'mma_still_creative' : 'mma_still_niche',
    refType: 'mma_charge',
    refId: `mma:${generationId}`,
    source: 'mma',
    meta: { expires_at: null, credits_after: creditsAfter, credits_before: creditsBefore },
    at,
  })

  const { error: updateError } = await supabase
    .from('mega_customers')
    .update({ mg_credits: creditsAfter, mg_updated_at: at })
    .eq('mg_pass_id', passId)

  if (updateError) throw new Error(updateError.message)

//This line is for starting the MMA steps asynchronously: Create Asset Intelligence, the knowledge files, the still prompter, then the image engine.
//Any error thrown along the way (a row that could not be written…) is logged, the matcha is refunded and the generation marked as failed.
//The spend object is passed along to collect the usage of every paid call, so the generation's mg_cost_data can be calculated whether it ends done or failed.
  const spend: MmaSpend = { claude: [], seo: null, image: null }
  runStillPipeline(passId, generationId, imageSessionId, request, spend)
    .catch((error) => {
      logMmaError(error)
      return failGeneration(passId, generationId, request, spend, 'mma_pipeline_failed', (error as Error).message)
    })
    .catch(logMmaError)

  return { generationId, credits: creditsAfter }
}
