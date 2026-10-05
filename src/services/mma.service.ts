import { randomUUID } from 'node:crypto'

import { STILL_GENERATION_COST } from '../lib/constants.js'
import type { StillGenerationRequest, StillGenerationResult } from '../types/mma.types.js'
import { recordTransaction } from './credits.service.js'
import { supabase } from './supabase.client.js'

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
    {
      ...owned,
      mg_id: `mma_step:${generationId}:1`,
      mg_record_type: 'mma_step',
      mg_generation_id: generationId,
      mg_parent_id: `generation:${generationId}`,
      mg_step_no: 1,
      mg_step_type: 'create_asset_intelligence',
      mg_payload: {},
    },
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

  return { generationId, credits: creditsAfter }
}
