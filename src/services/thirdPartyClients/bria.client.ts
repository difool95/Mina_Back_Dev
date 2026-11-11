import { env } from '../../config/env.js'
import { BRIA_API_URL } from '../../lib/constants.js'

interface BriaResponse {
  result?: { image_url?: string }
  error?: { message?: string }
}

//This method calls Bria's API to edit a picture, e.g. to remove the subject. It is called by the service, which has already resolved the userId
export async function briaEdit(endpoint: string, input: Record<string, unknown>) {
  const response = await fetch(`${BRIA_API_URL}/${endpoint}`, {
    method: 'POST',
    headers: { api_token: env.BRIAKEY, 'content-type': 'application/json' },
    body: JSON.stringify({ ...input, sync: true }),
  })
  const body = (await response.json()) as BriaResponse

  const imageUrl = body.result?.image_url
  if (!response.ok || !imageUrl) throw new Error(`Bria ${endpoint} ${response.status}: ${body.error?.message ?? 'no image'}`)

  return imageUrl
}
