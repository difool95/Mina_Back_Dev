import { env } from '../../config/env.js'
import type { GptImagePayload, GptImageUsage, ImageFile, OpenAiChatUsage } from '../../types/mma/mma.types.js'

const OPENAI_IMAGES_URL = 'https://api.openai.com/v1/images'

interface OpenAiImageResponse {
  data?: { b64_json?: string }[]
  usage?: GptImageUsage
  error?: { message: string }
}

/**
 * Asks GPT Image for one picture, and returns it with the usage OpenAI
 * reports. With reference pictures it is an edit, sent as multipart files;
 * without any, a plain generation. Either way the picture comes back as base64.
 */
export async function openAiImage(input: GptImagePayload['input'], images: ImageFile[]) {
  const fields = {
    model: input.model,
    prompt: input.prompt,
    size: input.size,
    quality: input.quality,
    background: input.background,
    moderation: input.moderation,
    output_format: input.output_format,
  }

  const authorization = `Bearer ${env.OPENAI_API_KEY}`
  let response: Response

  if (images.length) {
    const form = new FormData()
    for (const [name, value] of Object.entries(fields)) form.append(name, value)
    images.forEach((image, i) =>
      form.append('image[]', new Blob([new Uint8Array(image.bytes)], { type: image.contentType }), `reference-${i + 1}`),
    )
    // fetch writes the multipart content-type, with its boundary, itself.
    response = await fetch(`${OPENAI_IMAGES_URL}/edits`, { method: 'POST', headers: { authorization }, body: form })
  } else {
    response = await fetch(`${OPENAI_IMAGES_URL}/generations`, {
      method: 'POST',
      headers: { authorization, 'content-type': 'application/json' },
      body: JSON.stringify(fields),
    })
  }

  const body = (await response.json()) as OpenAiImageResponse
  if (!response.ok) throw new Error(`OpenAI ${response.status}: ${body.error?.message ?? 'no message'}`)

  const data = body.data?.[0]?.b64_json
  if (!data) throw new Error('OpenAI returned no image')

  //This line converts the base64 string returned by OpenAI into a Buffer and constructs an ImageFile object with the appropriate content type.
  const image: ImageFile = { bytes: Buffer.from(data, 'base64'), contentType: `image/${input.output_format}` }

  return { image, usage: body.usage ?? null }
}

/** One chat completion: the model's message, and the tokens the call spent. */
async function openAiChat(request: Record<string, unknown>) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.OPENAI_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify(request),
  })

  const body = (await response.json()) as {
    choices?: { message?: { content?: string; tool_calls?: { function: { arguments: string } }[] } }[]
    usage?: OpenAiChatUsage
    error?: { message: string }
  }
  if (!response.ok) throw new Error(`OpenAI ${response.status}: ${body.error?.message ?? 'no message'}`)

  return { message: body.choices?.[0]?.message, usage: body.usage ?? { prompt_tokens: 0, completion_tokens: 0 } }
}

/** Asks an OpenAI chat model for a JSON object, and returns it parsed with the tokens the call spent. */
export async function openAiJson(model: string, system: string, user: string) {
  const { message, usage } = await openAiChat({
    model,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  })

  return { answer: JSON.parse(message?.content ?? '{}') as unknown, usage }
}

/**
 * Shows an OpenAI chat model one picture and makes it answer through `tool`,
 * and returns the tool's arguments parsed with the tokens the call spent.
 */
export async function openAiImageTool(
  model: string,
  system: string,
  imageUrl: string,
  tool: { type: 'function'; function: { name: string } },
) {
  const { message, usage } = await openAiChat({
    model,
    tools: [tool],
    tool_choice: { type: 'function', function: { name: tool.function.name } },
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: [{ type: 'image_url', image_url: { url: imageUrl } }] },
    ],
  })

  const call = message?.tool_calls?.[0]
  if (!call) throw new Error('OpenAI answered without the tool')

  return { answer: JSON.parse(call.function.arguments) as unknown, usage }
}
