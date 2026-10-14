import { randomBytes } from 'node:crypto'

import { R2_STILLS_PREFIX, UPLOAD_EXTENSIONS } from '../../../lib/constants.js'
import { stepTiming } from '../../../lib/date.js'
import { gptImageInput, nanoBananaInput, stillPrompt } from '../../../lib/mmaStep4/mmaStillGenerateLib.js'
import type { AspectRatio, GptImagePayload, ImageFile, NanoBananaPayload } from '../../../types/mma/mma.types.js'
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
 * Puts a generated picture on R2 and returns its public URL. The engines
 * answer with the picture's bytes, never a link, so it can only go through here.
 */
function storeStill({ bytes, contentType }: ImageFile) {
  const extension = UPLOAD_EXTENSIONS[contentType]
  if (!extension) throw new Error(`Cannot store a generated ${contentType || 'picture of unknown type'}`)

  return putObject(`${R2_STILLS_PREFIX}/${Date.now()}_${randomBytes(6).toString('hex')}.${extension}`, bytes, contentType)
}

/**
 * MMA step 4 on the Niche lane: NanoBanana Pro renders step 3's prompt in 4K,
 * from the pictures step 1 kept, and the result goes to R2.
 *
 * Returns the step's `mg_payload`. A failure is written to its `error` rather
 * than thrown, and leaves `output` null.
 */
export async function runNanoBanana(cleanPrompt: string, imageUrls: string[], ratio: AspectRatio): Promise<NanoBananaPayload> {
  const startedAt = new Date()
  const input = nanoBananaInput(stillPrompt(cleanPrompt), imageUrls, ratio)
  const payload: Omit<NanoBananaPayload, 'timing'> = {
    error: null,
    input,
    output: null,
    provider: { gemini: { model: input.model } },
  }

  try {
    const image = await geminiImage(input, await Promise.all(imageUrls.map(readImage)))
    payload.output = await storeStill(image)
  } catch (error) {
    payload.error = (error as Error).message
    logMmaError(error)
  }

  return { ...payload, timing: stepTiming(startedAt) }
}

/**
 * MMA step 4 on the Creative lane: GPT Image renders step 3's prompt at about
 * 2K, from the pictures step 1 kept, and the result goes to R2.
 *
 * Returns the step's `mg_payload`. A failure is written to its `error` rather
 * than thrown, and leaves `output` null.
 */
export async function runGptImage(cleanPrompt: string, imageUrls: string[], ratio: AspectRatio): Promise<GptImagePayload> {
  const startedAt = new Date()
  const input = gptImageInput(stillPrompt(cleanPrompt), imageUrls, ratio)
  const payload: Omit<GptImagePayload, 'timing'> = {
    error: null,
    input,
    output: null,
    provider: { openai: { size: input.size, model: input.model, quality: input.quality, usage: null } },
  }

  try {
    const { image, usage } = await openAiImage(input, await Promise.all(imageUrls.map(readImage)))
    payload.provider.openai.usage = usage
    payload.output = await storeStill(image)
  } catch (error) {
    payload.error = (error as Error).message
    logMmaError(error)
  }

  return { ...payload, timing: stepTiming(startedAt) }
}
