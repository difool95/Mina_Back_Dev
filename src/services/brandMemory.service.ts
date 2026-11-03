import { randomUUID } from 'node:crypto'

import { env } from '../config/env.js'
import {
  BRAND_MEMORY_EXPIRY_DAYS,
  BRAND_MEMORY_MAX,
  BRAND_MEMORY_SCANNER,
  BRAND_MEMORY_USE_COUNT_RESET_DAYS,
  DAY_SECONDS,
} from '../lib/constants.js'
import { BRAND_MEMORY_SCAN_TOOL, BRAND_MEMORY_SCANNER_PROMPT, brandMemoryVars } from '../lib/brandMemory/brandMemoryLib.js'
import { cdnImage } from '../lib/mmaStep1/mmaCreateAssetsLib.js'
import type { BrandMemoryScan, BrandMemoryVars } from '../types/brandMemory.types.js'
import { logMmaError } from './mma/mmaErrorLogger.service.js'
import { copyStudioImage, deleteStudioImage } from './mma/mmaUploads.service.js'
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
 * Saves pictures the user already put on R2 (up to five, the first being the
 * one scanned and the cover) as a new brand memory. A failed
 * scan still writes the row, as `error`, which the profile never lists.
 *
 * The frontend numbers `sortOrder` before uploading, so pictures added
 * together each get their own place however their scans finish.
 */
export async function createBrandMemory(
  userId: string,
  urls: string[],
  sortOrder: number,
  sourceUploadUrl?: string,
) {
  const passId = `pass:user:${userId}`

  const { count, error: countError } = await supabase
    .from('mega_generations')
    .select('mg_id', { count: 'exact', head: true })
    .eq('mg_pass_id', passId)
    .eq('mg_record_type', 'product')
  if (countError) throw new Error(countError.message)
  // Checked if we reached the cap of brand memories for the user
  if ((count ?? 0) >= BRAND_MEMORY_MAX) throw new Error(`Brand memory is limited to ${BRAND_MEMORY_MAX} assets`)

  // The controller lets no empty list through, so there is always a first picture.
  const cover = urls[0]!
  const scan = await scanPicture(cover)

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
      mg_output_url: cover,
      mg_prompt: scan?.name ?? '',
      mg_mma_vars: brandMemoryVars(scan, urls, sortOrder, at, sourceUploadUrl),
      mg_created_at: at,
      mg_updated_at: at,
    },
    { defaultToNull: false },
  )
  if (error) throw new Error(error.message)

  return { id }
}

//This method saves the uploads used in a generation as brand memories for the user. It checks if the uploads are already saved and if there is room left
//for new brand memories. It then copies the uploads to the user's brand memory and creates a new brand memory entry for each upload.
export async function saveUsedUploadsAsBrandMemories(userId: string, urls: string[]) {
  const { data, error } = await supabase
    .from('mega_generations')
    .select('mg_mma_vars')
    .eq('mg_pass_id', `pass:user:${userId}`)
    .eq('mg_record_type', 'product')
  if (error) throw new Error(error.message)

  // The user's brand memories as they stand before this Create.
  const memories: BrandMemoryVars[] = []
  for (const row of data ?? []) {
    memories.push(row.mg_mma_vars as BrandMemoryVars)
  }

  // we take the source upload urls so that we don't save them twice in brand memory
  // We get the highest sort order in the brand memory list
  const alreadySavedUploads = new Set<string>()
  let lastSortOrder = 0
  for (const memory of memories) {
    if (memory.source_upload_url) alreadySavedUploads.add(memory.source_upload_url)
    if (memory.sort_order > lastSortOrder) lastSortOrder = memory.sort_order
  }

  // This block is for filtering the urls to save, we only save the urls that are not already saved and we only save up to the maximum number of brand memories allowed.
  const roomLeft = BRAND_MEMORY_MAX - memories.length
  const urlsToSave: string[] = []
  for (const url of urls) {
    if (urlsToSave.length >= roomLeft) break
    if (alreadySavedUploads.has(url)) continue
    if (urlsToSave.includes(url)) continue

    urlsToSave.push(url)
  }

  // One upload becomes one memory: its own copy of the picture, then the scan and the row.
  const saveOne = async (url: string, sortOrder: number) => {
    const copyUrl = await copyStudioImage(userId, url)
    await createBrandMemory(userId, [copyUrl], sortOrder, url)
  }

  // All saved at the same time. Each place in the bar is chosen here, before the
  // scans start, so each memory keeps its place whichever scan finishes first.
  const saving = urlsToSave.map((url, i) => saveOne(url, lastSortOrder + i + 1))
  const results = await Promise.allSettled(saving)

  // A failed one is only logged; the others are saved anyway.
  for (const result of results) {
    if (result.status === 'rejected') logMmaError(result.reason)
  }
}

/**
 * Deletes every brand memory not used for BRAND_MEMORY_EXPIRY_DAYS, the way
 * the profile deletes one: the row first, then each of its pictures from R2
 * through `deleteStudioImage`. A picture that fails to go is logged and left;
 * its row is already gone, so the memory never comes back.
 *
 * `last_used_at` is an ISO string, so comparing it as text against the cutoff
 * compares the dates. A memory with no date yet is left alone.
 */
export async function sweepExpiredBrandMemories() {
  const cutoff = new Date(Date.now() - BRAND_MEMORY_EXPIRY_DAYS * DAY_SECONDS * 1000).toISOString()

  const { data, error } = await supabase
    .from('mega_generations')
    .select('mg_id, mg_pass_id, mg_mma_vars')
    .eq('mg_record_type', 'product')
    .neq('mg_mma_vars->>last_used_at', '')
    .lt('mg_mma_vars->>last_used_at', cutoff)
  if (error) throw new Error(error.message)

  const expired = (data ?? []) as { mg_id: string; mg_pass_id: string; mg_mma_vars: { images?: string[] } }[]
  for (const memory of expired) {
    const { error: deleteError } = await supabase.from('mega_generations').delete().eq('mg_id', memory.mg_id)
    if (deleteError) throw new Error(deleteError.message)

    const userId = memory.mg_pass_id.replace(/^pass:user:/, '')
    const results = await Promise.allSettled(
      (memory.mg_mma_vars.images ?? []).map((url) => deleteStudioImage(userId, url)),
    )
    for (const result of results) if (result.status === 'rejected') logMmaError(result.reason)
  }

  return { deleted: expired.length }
}

//This method resets the use_count of brand memories that have not been used for BRAND_MEMORY_USE_COUNT_RESET_DAYS. 
// It sets the use_count back to 0 for those brand memories.
export async function resetIdleUseCounts() {
  const cutoff = new Date(Date.now() - BRAND_MEMORY_USE_COUNT_RESET_DAYS * DAY_SECONDS * 1000).toISOString()

  const { data, error } = await supabase
    .from('mega_generations')
    .select('mg_id, mg_mma_vars')
    .eq('mg_record_type', 'product')
    .neq('mg_mma_vars->>last_used_at', '')
    .lt('mg_mma_vars->>last_used_at', cutoff)
    .neq('mg_mma_vars->>use_count', '0')
  if (error) throw new Error(error.message)

  const idle = (data ?? []) as { mg_id: string; mg_mma_vars: BrandMemoryVars }[]
  for (const memory of idle) {
    const { error: updateError } = await supabase
      .from('mega_generations')
      .update({ mg_mma_vars: { ...memory.mg_mma_vars, use_count: 0 }, mg_updated_at: new Date().toISOString() })
      .eq('mg_id', memory.mg_id)
    if (updateError) throw new Error(updateError.message)
  }

  return { reset: idle.length }
}
