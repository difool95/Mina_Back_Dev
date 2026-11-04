import { DAY_SECONDS, DELETED_STATUS, GENERATION_PURGE_DAYS } from '../lib/constants.js'
import { supabase } from './thirdPartyClients/supabase.client.js'

/** The moment before which a deleted generation can no longer be restored. */
const purgeCutoff = () => new Date(Date.now() - GENERATION_PURGE_DAYS * DAY_SECONDS * 1000).toISOString()

/** Deletes every `mega_generations` row matching `filters`. */
async function deleteRows(filters: Record<string, string>) {
  const { error } = await supabase.from('mega_generations').delete().match(filters)
  if (error) throw new Error(error.message)
}

//This method is used to purge all deleted generations that have been deleted for more than GENERATION_PURGE_DAYS. It is called every day at GENERATION_PURGE_HOUR, Dubai time.
export async function purgeDeletedGenerations() {
  const { data, error } = await supabase
    .from('mega_generations')
    .select('mg_id, mg_generation_id, mg_session_id')
    .eq('mg_record_type', 'generation')
    .eq('mg_status', DELETED_STATUS)
    .eq('mg_mma_status', DELETED_STATUS)
    .lt('deleted_since', purgeCutoff())
  if (error) throw new Error(error.message)

  const deleted = (data ?? []) as { mg_id: string; mg_generation_id: string; mg_session_id: string | null }[]
  for (const generation of deleted) {
    const id = generation.mg_generation_id

    await deleteRows({ mg_record_type: 'mma_step', mg_generation_id: id })
    await deleteRows({ mg_record_type: 'mma_event', mg_generation_id: id })
    await deleteRows({ mg_record_type: 'credit_transaction', mg_ref_id: `mma:${id}` })
    if (generation.mg_session_id) await deleteRows({ mg_id: `session:${generation.mg_session_id}` })
    await deleteRows({ mg_id: generation.mg_id })
  }

  return { purged: deleted.length }
}

//This method is used to restore a generation that was deleted by the user, but can still be restored. It checks if the generation is deleted and if it was deleted
//within the allowed time frame. If so, it updates the status of the generation to "done" and removes the deletion timestamp.
export async function restoreGeneration(generationId: string) {
  const mgId = `generation:${generationId}`

  const { data, error } = await supabase
    .from('mega_generations')
    .select('mg_status, mg_mma_status, deleted_since')
    .eq('mg_id', mgId)
    .maybeSingle()
  if (error) throw new Error(error.message)

  if (!data) throw new Error(`No generation ${generationId}`)
  if (data.mg_status !== DELETED_STATUS || data.mg_mma_status !== DELETED_STATUS) {
    throw new Error(`Generation ${generationId} is not deleted`)
  }
  // Compared as dates: Postgres writes a timestamptz as "+00:00", not the "Z" of toISOString().
  if (!data.deleted_since || Date.parse(data.deleted_since) < Date.parse(purgeCutoff())) {
    throw new Error(`Generation ${generationId} was deleted more than ${GENERATION_PURGE_DAYS} days ago`)
  }

  const { error: updateError } = await supabase
    .from('mega_generations')
    .update({ mg_status: 'done', mg_mma_status: 'done', deleted_since: null, mg_updated_at: new Date().toISOString() })
    .eq('mg_id', mgId)
  if (updateError) throw new Error(updateError.message)

  return { restored: generationId }
}
