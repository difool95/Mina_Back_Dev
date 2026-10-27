import { env } from '../config/env.js'
import { openPromptFile, promptFileInputs, sealPromptFile } from '../lib/promptFile.js'
import type { PromptFileVars } from '../types/promptFile.types.js'
import { supabase } from './thirdPartyClients/supabase.client.js'

const key = Buffer.from(env.PROMPT_FILE_KEY, 'hex')

/**
 * A `.mina` prompt file for one of the user's own generations. Read from the
 * row rather than taken from the browser, so a file only ever holds what a
 * generation was really made from.
 */
export async function exportPromptFile(userId: string, generationId: string) {
  const { data, error } = await supabase
    .from('mega_generations')
    .select('mg_mma_vars')
    .eq('mg_id', `generation:${generationId}`)
    .eq('mg_pass_id', `pass:user:${userId}`)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) throw new Error(`No generation ${generationId} for this user`)

  return sealPromptFile(promptFileInputs(data.mg_mma_vars as PromptFileVars), key)
}

/** What a `.mina` file holds, for any signed-in user who drops it on their studio. */
export function importPromptFile(file: string) {
  return openPromptFile(file, key)
}
