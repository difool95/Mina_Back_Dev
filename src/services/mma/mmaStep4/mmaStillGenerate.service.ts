import { randomBytes } from 'node:crypto'

import { env } from '../../../config/env.js'
import { R2_STILLS_PREFIX, UPLOAD_EXTENSIONS } from '../../../lib/constants.js'
import { stepTiming } from '../../../lib/date.js'
import { embedXmp, xmpPacket } from '../../../lib/mmaSeo/mmaSeoLib.js'
import { gptImageInput, nanoBananaInput, stillPrompt } from '../../../lib/mmaStep4/mmaStillGenerateLib.js'
import type {
  AspectRatio,
  GptImagePayload,
  ImageFile,
  MmaProvenance,
  MmaSeo,
  MmaSpend,
  NanoBananaPayload,
} from '../../../types/mma/mma.types.js'
import { putObject } from '../../r2.service.js'
import { geminiImage } from '../../thirdPartyClients/gemini.client.js'
import { openAiImage } from '../../thirdPartyClients/openai.client.js'
import { logMmaError } from '../mmaErrorLogger.service.js'

/** A picture the engines take as bytes: unlike Claude, neither reads a URL itself. */
async function readImage(url: string): Promise<ImageFile> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Could not read ${url} (${response.status})`)

  return { bytes: Buffer.from(await response.arrayBuffer()), contentType: response.headers.get('content-type') ?? '' }
}

/**
 * Puts a generated picture on R2, with its SEO and Mina's credit written into
 * the file first, and returns its public URL and how the writing went. The
 * engines answer with the picture's bytes, never a link, so it can only go
 * through here. The name is picked before the upload because the metadata
 * carries the picture's own URL. A picture whose metadata cannot be written
 * is still stored, without it.
 */
async function storeStill({ bytes, contentType }: ImageFile, seo: MmaSeo) {
  const extension = UPLOAD_EXTENSIONS[contentType]
  if (!extension) throw new Error(`Cannot store a generated ${contentType || 'picture of unknown type'}`)

  const key = `${R2_STILLS_PREFIX}/${Date.now()}_${randomBytes(6).toString('hex')}.${extension}`
  const url = `${env.R2_PUBLIC_BASE_URL}/${key}`
  const attemptedAt = new Date().toISOString()

  let stored = bytes
  let provenance: MmaProvenance = { url, reason: 'embedded', embedded: true, attempted_at: attemptedAt }
  try {
    stored = embedXmp(bytes, contentType, xmpPacket(seo, url))
  } catch (error) {
    logMmaError(error)
    provenance = { url, reason: 'embed_failed', embedded: false, attempted_at: attemptedAt }
  }

  await putObject(key, stored, contentType)

  return { url, provenance }
}

/**
 * MMA step 4 on the Niche lane: NanoBanana Pro renders step 3's prompt in 4K,
 * from the pictures step 1 kept, and the result goes to R2, its SEO written in.
 *
 * Returns the step's `mg_payload`, how the metadata went into the file, and
 * the tokens the engine spent (even when the step failed after it). A failure
 * is written to the payload's `error` rather than thrown, and leaves `output` null.
 */
export async function runNanoBanana(cleanPrompt: string, imageUrls: string[], ratio: AspectRatio, seo: MmaSeo) {
  const startedAt = new Date()
  const input = nanoBananaInput(stillPrompt(cleanPrompt), imageUrls, ratio)
  const payload: Omit<NanoBananaPayload, 'timing'> = {
    error: null,
    input,
    output: null,
    provider: { gemini: { model: input.model } },
  }
  let provenance: MmaProvenance | null = null
  let spend: MmaSpend['image'] = null

  try {
    const { image, usage } = await geminiImage(input, await Promise.all(imageUrls.map(readImage)))
    spend = { engine: 'nanobanana', model: input.model, usage }
    const stored = await storeStill(image, seo)
    payload.output = stored.url
    provenance = stored.provenance
  } catch (error) {
    payload.error = (error as Error).message
    logMmaError(error)
  }

  return { payload: { ...payload, timing: stepTiming(startedAt) } satisfies NanoBananaPayload, provenance, spend }
}

/**
 * MMA step 4 on the Creative lane: GPT Image renders step 3's prompt at about
 * 2K, from the pictures step 1 kept, and the result goes to R2, its SEO written in.
 *
 * Returns the step's `mg_payload`, how the metadata went into the file, and
 * the tokens the engine spent (even when the step failed after it). A failure
 * is written to the payload's `error` rather than thrown, and leaves `output` null.
 */
export async function runGptImage(cleanPrompt: string, imageUrls: string[], ratio: AspectRatio, seo: MmaSeo) {
  const startedAt = new Date()
  const input = gptImageInput(stillPrompt(cleanPrompt), imageUrls, ratio)
  const payload: Omit<GptImagePayload, 'timing'> = {
    error: null,
    input,
    output: null,
    provider: { openai: { size: input.size, model: input.model, quality: input.quality, usage: null } },
  }
  let provenance: MmaProvenance | null = null
  let spend: MmaSpend['image'] = null

  try {
    const { image, usage } = await openAiImage(input, await Promise.all(imageUrls.map(readImage)))
    payload.provider.openai.usage = usage
    if (usage) spend = { engine: 'openai', model: input.model, size: input.size, usage }
    const stored = await storeStill(image, seo)
    payload.output = stored.url
    provenance = stored.provenance
  } catch (error) {
    payload.error = (error as Error).message
    logMmaError(error)
  }

  return { payload: { ...payload, timing: stepTiming(startedAt) } satisfies GptImagePayload, provenance, spend }
}
