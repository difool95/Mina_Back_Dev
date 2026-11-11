import { randomUUID } from 'node:crypto'

import { FINGERTIPS_TOOLS, R2_FINGERTIPS_PREFIX, FINGERTIPS_FLAT_TOOLS, STILL_GENERATION_COSTS, STILL_RENDERERS } from '../../lib/constants.js'
import { fingertipsMmaVars } from '../../lib/fingertips/fingertipsLib.js'
import { costData } from '../../lib/mmaCost/mmaCostLib.js'
import { gptImageInput, nanoBananaInput } from '../../lib/mmaStep4/mmaStillGenerateLib.js'
import type {
  FingertipsOutput,
  FingertipsRequest,
  FingertipsRun,
  FingertipsTool,
} from '../../types/fingertips.types.js'
import type { MmaSeo, MmaSpend, StillGenerationResult, StillLane } from '../../types/mma/mma.types.js'
import { recordTransaction, refundMmaCharge } from '../credits.service.js'
import { updateGeneration } from '../mma/mma.service.js'
import { costRates } from '../mma/mmaCostRates.service.js'
import { logMmaError } from '../mma/mmaErrorLogger.service.js'
import { readImage, storeStill } from '../mma/mmaStep4/mmaStillGenerate.service.js'
import { geminiImage } from '../thirdPartyClients/gemini.client.js'
import { openAiImage } from '../thirdPartyClients/openai.client.js'
import { supabase } from '../thirdPartyClients/supabase.client.js'

//This service do these steps:
//1. Check if the user has enough credits to perform the edit, if not throw an error.
//2. Charge the user for the edit and create a new generation row in the database.
//3. Call the run function that will perform the edit and return the output.
//4. If the run function succeeds, update the generation row with the output and mark it as succeeded.
//5. If the run function fails, refund the user and mark the generation row as failed.
export async function startFingertips(
  userId: string,
  tool: FingertipsTool,
  request: FingertipsRequest,
  run: (context: FingertipsRun) => Promise<FingertipsOutput>,
): Promise<StillGenerationResult> {
  const passId = `pass:user:${userId}`

  const { data: customer, error: customerError } = await supabase
    .from('mega_customers')
    .select('mg_credits')
    .eq('mg_pass_id', passId)
    .maybeSingle()

  if (customerError) throw new Error(customerError.message)
  if (!customer) throw new Error(`No mega_customers row for ${passId}`)

  // Checked before anything is written, so a refused edit leaves no rows behind.
  const creditsBefore = Number(customer.mg_credits ?? 0)
  // Vectorize and Remove Subject have their own flat price; Tweak costs what its lane costs.
  const flat = FINGERTIPS_FLAT_TOOLS[tool]
  const cost = flat ? flat.matchas : STILL_GENERATION_COSTS[request.lane]
  if (creditsBefore < cost) throw new Error('Not enough matcha')

  const at = new Date().toISOString()
  const generationId = randomUUID()
  // To the cent, so a 0.1 charge never leaves a balance like 4.8999999.
  const creditsAfter = Math.round((creditsBefore - cost) * 100) / 100

  await recordTransaction({
    passId,
    delta: -cost,
    reason: 'fingertips_pool_draw',
    refType: 'fingertips_charge',
    refId: `fingertips:${generationId}`,
    source: 'fingertips',
    meta: { expires_at: null, credits_after: creditsAfter, credits_before: creditsBefore },
    at,
  })

  const { error: updateError } = await supabase
    .from('mega_customers')
    .update({ mg_credits: creditsAfter, mg_updated_at: at })
    .eq('mg_pass_id', passId)

  if (updateError) throw new Error(updateError.message)

  const { error: insertError } = await supabase.from('mega_generations').insert(
    {
      mg_id: `generation:${generationId}`,
      mg_record_type: 'generation',
      mg_pass_id: passId,
      mg_generation_id: generationId,
      mg_mma_mode: 'fingertips',
      mg_mma_status: 'progressing',
      mg_status: 'progressing',
      mg_provider: flat ? flat.provider : request.lane === 'niche' ? 'gemini' : 'openai',
      mg_model: flat ? flat.model : STILL_RENDERERS[request.lane].model,
      mg_mma_vars: fingertipsMmaVars(request.imageUrl, tool, FINGERTIPS_TOOLS[tool].preserveAlpha, request.maskUrl),
      mg_output_url: '',
      mg_meta: {},
      mg_type: 'image',
      mg_content_type: 'image',
      mg_cost_data: {},
      mg_created_at: at,
      mg_updated_at: at,
    },
    { defaultToNull: false },
  )

  // The matchas are already taken: without a row to work on, they go straight back.
  if (insertError) {
    await refundMmaCharge(passId, generationId, cost, 'fingertips')
    throw new Error(insertError.message)
  }

  const spend: MmaSpend = { claude: [], seo: null, image: null }
  const outputPath = `${R2_FINGERTIPS_PREFIX}/${FINGERTIPS_TOOLS[tool].folder}/${generationId}`

  run({ passId, generationId, spend, outputPath })
    .then(
      //Once the picture exists, we update the generation row with the output URL, SEO, provenance, and mark it as succeeded, if it fails, we refund the user and mark
      //the generation row as failed.
      ({ url, seo, provenance }) =>
        updateGeneration(generationId, {
          mg_status: 'succeeded',
          mg_mma_status: 'done',
          mg_output_url: url,
          mg_meta: { seo, provenance },
          mg_cost_data: costData(request.lane, spend, true, costRates()),
        }).catch(logMmaError),
      async (error) => {
        logMmaError(error)
        await refundMmaCharge(passId, generationId, cost, 'fingertips')
        await updateGeneration(generationId, {
          mg_status: 'error',
          mg_mma_status: 'error',
          mg_error: { code: `fingertips_${tool}_failed`, message: (error as Error).message },
          mg_cost_data: costData(request.lane, spend, false, costRates()),
        })
      },
    )
    .catch(logMmaError)
//we return the generationId and the credits after the charge, so the client can poll for the generation status and update the UI with the new credits,
//we don't wait for the run function to finish, as it can take a long time and we want to return the response as soon as possible.
  return { generationId, credits: creditsAfter }
}

/**
 * Renders `prompt` on the one picture with the lane's engine, keeping the
 * picture's own shape, and stores the result at `outputPath` with its SEO
 * written in. The engine's spend goes into `spend` as soon as it answers.
 */
export async function generateAndStoreEditedPicture(
  lane: StillLane,
  prompt: string,
  imageUrl: string,
  seo: MmaSeo,
  { spend, outputPath }: FingertipsRun,
) {
  const images = [await readImage(imageUrl)]

  if (lane === 'niche') {
    const input = nanoBananaInput(prompt, [imageUrl])
    const { image, usage } = await geminiImage(input, images)
    spend.image = { engine: 'nanobanana', model: input.model, usage }

    return storeStill(image, seo, outputPath)
  }

  const input = gptImageInput(prompt, [imageUrl], undefined, STILL_RENDERERS[lane])
  const { image, usage } = await openAiImage(input, images)
  if (usage) spend.image = { engine: 'openai', model: input.model, size: input.size, usage }

  return storeStill(image, seo, outputPath)
}
