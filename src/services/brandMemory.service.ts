import { randomUUID } from 'node:crypto'

import { env } from '../config/env.js'
import { BRAND_MEMORY_MAX, BRAND_MEMORY_SCANNER } from '../lib/constants.js'
import { BRAND_MEMORY_SCAN_TOOL, BRAND_MEMORY_SCANNER_PROMPT, brandMemoryVars } from '../lib/brandMemory/brandMemoryLib.js'
import { cdnImage } from '../lib/mmaStep1/mmaCreateAssetsLib.js'
import type { BrandMemoryScan } from '../types/brandMemory.types.js'
import { logMmaError } from './mma/mmaErrorLogger.service.js'
import { openAiImageTool } from './thirdPartyClients/openai.client.js'
import { supabase } from './thirdPartyClients/supabase.client.js'

/** gpt-4o-mini's reading of the picture, resized the way MMA reads one. Null when the call fails. */
async function scanPicture(url: string) {
  try {
    const { answer } = await openAiImageTool(
      BRAND_MEMORY_SCANNER.model,
      BRAND_MEMORY_SCANNER_PROMPT,
      cdnImage(env.R2_PUBLIC_BASE_URL, url, 'product'),
      BRAND_MEMORY_SCAN_TOOL,
    )
    return answer as BrandMemoryScan
  } catch (error) {
    logMmaError(error)
    return null
  }
}

/**
 * Saves a picture the user already put on R2 as a new brand memory. A failed
 * scan still writes the row, as `error`, which the profile never lists.
 *
 * The frontend numbers `sortOrder` before uploading, so pictures added
 * together each get their own place however their scans finish.
 */
export async function createBrandMemory(userId: string, url: string, sortOrder: number) {
  const passId = `pass:user:${userId}`

  const { count, error: countError } = await supabase
    .from('mega_generations')
    .select('mg_id', { count: 'exact', head: true })
    .eq('mg_pass_id', passId)
    .eq('mg_record_type', 'product')
  if (countError) throw new Error(countError.message)
  // Checked if we reached the cap of brand memories for the user
  if ((count ?? 0) >= BRAND_MEMORY_MAX) throw new Error(`Brand memory is limited to ${BRAND_MEMORY_MAX} assets`)

  const scan = await scanPicture(url)

  const id = randomUUID()
  const status = scan ? 'done' : 'error'
  const at = new Date().toISOString()
  const { error } = await supabase.from('mega_generations').insert(
    {
      mg_id: `product:${id}`,
      mg_record_type: 'product',
      mg_pass_id: passId,
      mg_generation_id: id,
      mg_mma_mode: 'product',
      mg_mma_status: status,
      mg_status: status,
      mg_type: 'image',
      mg_content_type: 'image',
      mg_output_url: url,
      mg_prompt: scan?.name ?? '',
      mg_mma_vars: brandMemoryVars(scan, url, sortOrder),
      mg_created_at: at,
      mg_updated_at: at,
    },
    { defaultToNull: false },
  )
  if (error) throw new Error(error.message)

  return { id }
}
