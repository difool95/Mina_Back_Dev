import { createHash } from 'node:crypto'

import type Anthropic from '@anthropic-ai/sdk'

import { env } from '../../../config/env.js'
import { CREATE_ASSET_DIRECTOR, R2_UPLOADS_PREFIX } from '../../../lib/constants.js'
import {
  CREATE_ASSET_DIRECTOR_PROMPT,
  CREATE_ASSET_PLAN_TOOL,
  CREATE_ASSET_PROMPT_CACHE,
  NO_ASSETS_OUTPUT,
  PILLS,
  SCENE_LIBRARY_NAME,
  briefMessage,
  cdnImage,
  imageNote,
  planOutput,
} from '../../../lib/mmaStep1/mmaCreateAssetsLib.js'
import type { CreateAssetPayload, CreateAssetPlan, InventoryItem, StudioUpload } from '../../../types/mma/mma.types.js'
import { anthropic } from '../../thirdPartyClients/anthropic.client.js'
import { putObject } from '../../r2.service.js'
import { supabase } from '../../thirdPartyClients/supabase.client.js'

/**
 * Puts a picture fresh from the file picker on R2, in the customer's own
 * folder. Named after its own hash, so the same picture sent again lands on
 * the same key instead of piling up copies.
 */
async function storeUpload(passId: string, dataUrl: string) {
  const contentType = dataUrl.slice('data:'.length, dataUrl.indexOf(';'))
  const body = Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64')
  const owner = createHash('md5').update(passId).digest('hex')
  const name = createHash('sha256').update(body).digest('hex')

  return putObject(`${R2_UPLOADS_PREFIX}/owner_${owner}/${name}.${contentType.split('/')[1]}`, body, contentType)
}

/** A studio upload as step 1's inventory holds it: on R2, at the size Claude reads it. */
async function toInventoryItem(passId: string, upload: StudioUpload, index: number): Promise<InventoryItem> {
  // The controller lets nothing through but a data URL or one of our R2 URLs,
  // and only the scene pill has a library: whatever is not a data URL is a
  // scene library pick, already on R2.
  const isUpload = upload.url.startsWith('data:')
  const url = isUpload ? await storeUpload(passId, upload.url) : upload.url

  return {
    url: cdnImage(env.R2_PUBLIC_BASE_URL, url, upload.kind),
    name: isUpload ? PILLS[upload.kind].uploadName : SCENE_LIBRARY_NAME,
    index,
    origin: isUpload ? 'upload' : 'scene_library',
    memory_id: null,
    pill_hint: PILLS[upload.kind].hint,
  }
}

async function imageBlock(url: string): Promise<Anthropic.ImageBlockParam> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Could not read ${url} (${response.status})`)

  return {
    type: 'image',
    source: {
      type: 'base64',
      media_type: response.headers.get('content-type') as Anthropic.Base64ImageSource['media_type'],
      data: Buffer.from(await response.arrayBuffer()).toString('base64'),
    },
  }
}

/**
 * MMA step 1, Create Asset Intelligence: stores the uploads on R2, then asks
 * the Create Asset Director what each picture is for in this generation. A
 * brief with no picture needs no reading, so Claude is only asked when there
 * is at least one.
 *
 * Fills the `mg_payload` that `startStillGeneration` left empty on the step's
 * row. Nobody waits on this, so a failure is written to the payload's `error`
 * rather than thrown, next to whatever had been gathered by then.
 */
export async function runCreateAssetIntelligence(
  generationId: string,
  passId: string,
  brief: string,
  uploads: StudioUpload[],
) {
  const startedAt = new Date()
  //the payload is the data that will be stored in the mg_payload column of the mega_generations table. It contains the input,
  //output, and other information about the MMA Step 1 of the generation.
  const payload: Omit<CreateAssetPayload, 'timing'> = {
    raw: null,
    error: null,
    input: { inventory: [], user_brief: brief },
    usage: null,
    output: null,
    request: null,
    provider: null,
  }

  try {
    const inventory = await Promise.all(uploads.map((upload, i) => toInventoryItem(passId, upload, i + 1)))
    payload.input.inventory = inventory

    if (!inventory.length) {
      payload.output = NO_ASSETS_OUTPUT
    } else {
      const images = await Promise.all(inventory.map((item) => imageBlock(item.url)))
      const request: Anthropic.MessageCreateParamsNonStreaming = {
        model: CREATE_ASSET_DIRECTOR.model,
        tools: [CREATE_ASSET_PLAN_TOOL],
        // The cache breakpoint sits after the prompt, so tools and prompt are
        // read from cache by every generation within its five minutes.
        system: [{ type: 'text', text: CREATE_ASSET_DIRECTOR_PROMPT, cache_control: { type: 'ephemeral' } }],
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: briefMessage(brief, inventory) },
              ...inventory.flatMap((item, i) => [{ type: 'text' as const, text: imageNote(item) }, images[i]!]),
            ],
          },
        ],
        thinking: { type: 'adaptive' },
        max_tokens: CREATE_ASSET_DIRECTOR.maxTokens,
        //When the tool_choice is auto Claude will answer in tool_use format if it thinks the tool is needed, otherwise it will answer in text format.
        //This is useful for when you want to use a tool but don't want to force the model to use it.
        tool_choice: { type: 'auto' },
        output_config: { effort: CREATE_ASSET_DIRECTOR.effort },
      }

      payload.request = { ...request, agent_key: CREATE_ASSET_DIRECTOR.key, configured_model: request.model }

      //THS IS THE CALL TO CLAUDE. THE REQUEST IS SENT TO CLAUDE AND THE RESPONSE IS STORED IN THE PAYLOAD OBJECT. 
      //THE PAYLOAD OBJECT WILL BE STORED IN THE MG_PAYLOAD COLUMN OF THE MEGA_GENERATIONS TABLE.
      const message = await anthropic.messages.create(request)
      const { usage } = message
      const cacheRead = usage.cache_read_input_tokens ?? 0
      const cacheCreation = usage.cache_creation_input_tokens ?? 0

      payload.request = {
        ...payload.request,
        prompt_cache: {
          ...CREATE_ASSET_PROMPT_CACHE,
          status: cacheRead ? 'read' : 'write',
          cache_read_input_tokens: cacheRead,
          cache_creation_input_tokens: cacheCreation,
        },
        executed_model: message.model,
        routing_status: message.model === request.model ? 'matched' : 'mismatched',
      }
      payload.usage = {
        model: message.model,
        stop_reason: message.stop_reason,
        input_tokens: usage.input_tokens,
        output_tokens: usage.output_tokens,
        cache_read_input_tokens: cacheRead,
        cache_creation_input_tokens: cacheCreation,
      }
      payload.provider = { name: 'anthropic', stop_reason: message.stop_reason }

      const plan = message.content.find((block) => block.type === 'tool_use')?.input as CreateAssetPlan | undefined
      if (!plan) throw new Error(`The Create Asset Director answered without its plan (${message.stop_reason})`)

      payload.raw = JSON.stringify(plan)
      payload.output = planOutput(plan, inventory, message.model)
    }
  } catch (error) {
    payload.error = (error as Error).message
  }

  const endedAt = new Date()
  const timing = {
    started_at: startedAt.toISOString(),
    ended_at: endedAt.toISOString(),
    duration_ms: endedAt.getTime() - startedAt.getTime(),
  }

  const { error } = await supabase
    .from('mega_generations')
    .update({ mg_payload: { ...payload, timing } satisfies CreateAssetPayload, mg_updated_at: timing.ended_at })
    .eq('mg_id', `mma_step:${generationId}:1`)

  if (error) throw new Error(error.message)
}