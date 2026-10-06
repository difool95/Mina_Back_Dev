import type Anthropic from '@anthropic-ai/sdk'

import { env } from '../../../config/env.js'
import { CREATE_ASSET_DIRECTOR } from '../../../lib/constants.js'
import {
  CREATE_ASSET_DIRECTOR_PROMPT,
  CREATE_ASSET_PLAN_TOOL,
  CREATE_ASSET_PROMPT_CACHE,
  PILLS,
  SCENE_LIBRARY_NAME,
  briefMessage,
  cdnImage,
  imageNote,
  planOutput,
} from '../../../lib/mmaStep1/mmaCreateAssetsLib.js'
import type { CreateAssetPayload, CreateAssetPlan, InventoryItem, StudioUpload } from '../../../types/mma/mma.types.js'
import { anthropic } from '../../thirdPartyClients/anthropic.client.js'
import { supabase } from '../../thirdPartyClients/supabase.client.js'

//this method is for converting a StudioUpload object into an InventoryItem object. It takes a StudioUpload object and an index as parameters and returns
//an InventoryItem object with the appropriate properties set.
function toInventoryItem(upload: StudioUpload, index: number): InventoryItem {
  return {
    url: cdnImage(env.R2_PUBLIC_BASE_URL, upload.url, upload.kind),
    name: upload.origin === 'upload' ? PILLS[upload.kind].uploadName : SCENE_LIBRARY_NAME,
    index,
    origin: upload.origin,
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
 * MMA step 1, Create Asset Intelligence: asks the Create Asset Director what
 * each picture is for in this generation. The studio has already put every
 * picture on R2, when the user picked it.
 * Claude is asked even when there is no picture: the brief alone tells it the
 * production profile (register, capture device, subjects, safety scope) that
 * step 2 picks its knowledge files by.
 *
 * Fills the `mg_payload` that `startStillGeneration` left empty on the step's
 * row. Nobody waits on this, so a failure is written to the payload's `error`
 * rather than thrown, next to whatever had been gathered by then.
 */
export async function runCreateAssetIntelligence(
  generationId: string,
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
    //this line is for creating the inventory of the uploads. It maps over the uploads and creates an inventory item for each upload using the toInventoryItem function.
    const inventory = uploads.map((upload, i) => toInventoryItem(upload, i + 1))
    payload.input.inventory = inventory

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