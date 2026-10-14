import type { AspectRatio, GptImagePayload, NanoBananaPayload } from '../../types/mma/mma.types.js'
import { GPT_IMAGE, NANOBANANA } from '../constants.js'

/** Appended to every prompt step 4 renders: both engines like to add star-shaped highlights to shiny products. */
const SPARKLE_SUPPRESSION =
  'no starburst, no star sparkle, no sparkle, no twinkle, no glint burst, no cross star effect, no screen star filter, no anime sparkle, no diamond shine.'

/** GPT Image wants every side a multiple of this. */
const SIZE_STEP = 16

export const stillPrompt = (cleanPrompt: string) => `${cleanPrompt}\n\n${SPARKLE_SUPPRESSION}`

/**
 * GPT Image's `WIDTHxHEIGHT` for a ratio, inside its pixel budget: the short
 * side as large as the budget allows, the long side rounded to keep the ratio.
 * 3:4 → 1328x1776, 9:16 → 1152x2048, 1:1 → 1536x1536.
 */
export function gptImageSize(ratio: AspectRatio) {
  const [width, height] = ratio.split(':').map(Number) as [number, number]
  const short = Math.min(width, height)
  const long = Math.max(width, height)

  const shortPx = Math.floor(Math.sqrt((GPT_IMAGE.pixelBudget * short) / long) / SIZE_STEP) * SIZE_STEP
  const longPx = Math.round((shortPx * long) / short / SIZE_STEP) * SIZE_STEP

  return width <= height ? `${shortPx}x${longPx}` : `${longPx}x${shortPx}`
}

export function nanoBananaInput(prompt: string, images: string[], ratio: AspectRatio): NanoBananaPayload['input'] {
  return {
    model: NANOBANANA.model,
    prompt,
    provider: 'gemini',
    resolution: NANOBANANA.resolution,
    image_input: images,
    aspect_ratio: ratio,
    image_search: false,
    google_search: false,
    output_format: 'png',
    response_modalities: ['IMAGE'],
  }
}

export function gptImageInput(prompt: string, images: string[], ratio: AspectRatio): GptImagePayload['input'] {
  return {
    size: gptImageSize(ratio),
    model: GPT_IMAGE.model,
    prompt,
    quality: GPT_IMAGE.quality,
    provider: 'openai',
    background: GPT_IMAGE.background,
    moderation: GPT_IMAGE.moderation,
    image_input: images,
    aspect_ratio: ratio,
    output_format: 'png',
  }
}
