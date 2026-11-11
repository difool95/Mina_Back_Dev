import { setTimeout as sleep } from 'node:timers/promises'

import { env } from '../../config/env.js'
import { REPLICATE_API_URL, REPLICATE_POLL_MS } from '../../lib/constants.js'

interface ReplicatePrediction {
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled'
  output?: string | string[] | null
  error?: string | null
  urls: { get: string }
}

//This method runs a Replicate model with the given input, waits for it to finish, and returns its output. It throws if the model fails or is canceled.
export async function replicateRun(model: string, input: Record<string, unknown>) {
  const headers = { authorization: `Bearer ${env.REPLICATE_API_TOKEN}`, 'content-type': 'application/json' }

  const response = await fetch(`${REPLICATE_API_URL}/models/${model}/predictions`, {
    method: 'POST',
    headers: { ...headers, prefer: 'wait' },
    body: JSON.stringify({ input }),
  })
  let prediction = (await response.json()) as ReplicatePrediction
  if (!response.ok) throw new Error(`Replicate ${response.status}: ${prediction.error ?? 'no message'}`)

  while (prediction.status === 'starting' || prediction.status === 'processing') {
    await sleep(REPLICATE_POLL_MS)
    prediction = (await (await fetch(prediction.urls.get, { headers })).json()) as ReplicatePrediction
  }

  const output = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output
  if (prediction.status !== 'succeeded' || !output) {
    throw new Error(`Replicate ${model} ${prediction.status}: ${prediction.error ?? 'no output'}`)
  }

  return output
}
