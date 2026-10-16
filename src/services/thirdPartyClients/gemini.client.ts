import { env } from '../../config/env.js'
import type { GeminiUsage, ImageFile, NanoBananaPayload } from '../../types/mma/mma.types.js'

const GEMINI_MODELS_URL = 'https://generativelanguage.googleapis.com/v1beta/models'

interface GeminiResponse {
  candidates?: { finishReason?: string; content?: { parts?: { inlineData?: { mimeType: string; data: string } }[] } }[]
  promptFeedback?: { blockReason?: string }
  usageMetadata?: GeminiUsage
  error?: { message: string }
}

/**
 * Asks NanoBanana Pro for one picture, and returns it with the tokens Gemini
 * reports. Gemini takes the reference pictures as base64 and answers with the
 * generated one the same way.
 */
export async function geminiImage(input: NanoBananaPayload['input'], images: ImageFile[]) {
  const response = await fetch(`${GEMINI_MODELS_URL}/${input.model}:generateContent`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            { text: input.prompt },
            ...images.map((image) => ({ inlineData: { mimeType: image.contentType, data: image.bytes.toString('base64') } })),
          ],
        },
      ],
      // No google_search / image_search tool: both are off for a still.
      generationConfig: {
        responseModalities: input.response_modalities,
        imageConfig: { aspectRatio: input.aspect_ratio, imageSize: input.resolution },
      },
    }),
  })

  const body = (await response.json()) as GeminiResponse
  if (!response.ok) throw new Error(`Gemini ${response.status}: ${body.error?.message ?? 'no message'}`)

  const candidate = body.candidates?.[0]
  const image = candidate?.content?.parts?.find((part) => part.inlineData)?.inlineData
  if (!image) {
    throw new Error(`Gemini returned no image (${candidate?.finishReason ?? body.promptFeedback?.blockReason ?? 'no candidate'})`)
  }
  const generated: ImageFile = { bytes: Buffer.from(image.data, 'base64'), contentType: image.mimeType }

  return { image: generated, usage: body.usageMetadata ?? {} }
}
