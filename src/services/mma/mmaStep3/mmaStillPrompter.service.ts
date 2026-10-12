import type Anthropic from '@anthropic-ai/sdk'

import { STILL_PROMPTER } from '../../../lib/constants.js'
import { stepTiming } from '../../../lib/date.js'
import {
  contextPreview,
  imageCaption,
  isSceneEdit,
  labeledImages,
  prompterInput,
  prompterOutput,
  prompterSystem,
} from '../../../lib/mmaStep3/mmaStillPrompterLib.js'
import type {
  CreateAssetOutput,
  KnowledgeDoc,
  StillPrompterAnswer,
  StillPrompterPayload,
} from '../../../types/mma/mma.types.js'
import { askClaude } from '../../thirdPartyClients/anthropic.client.js'

/**
 * MMA step 3, the still prompter: asks Claude for the clean prompt the image
 * engine renders, from the brief, step 1's asset plan, every picture it kept,
 * and the guides step 2 picked, which ride in the system prompt.
 *
 * Returns the step's `mg_payload`. A failure is written to its `error` rather
 * than thrown, next to whatever had been gathered by then, and leaves `output` null.
 */
export async function runStillPrompter(
  brief: string,
  assetPlan: CreateAssetOutput,
  docs: KnowledgeDoc[],
): Promise<StillPrompterPayload> {
  const startedAt = new Date()
  const input = prompterInput(brief, assetPlan, docs)
  const labeled = labeledImages(assetPlan)
  const payload: Omit<StillPrompterPayload, 'timing'> = {
    ctx: contextPreview(),
    raw: null,
    error: null,
    input,
    usage: null,
    output: null,
    request: null,
    provider: null,
    labeledImages: labeled,
  }

  try {
    const request: Anthropic.MessageCreateParamsNonStreaming = {
      model: STILL_PROMPTER.model,
      //THE SYSTEM IS BUILT FROM THE DOCS AND THE CONTEXT
      system: [{ type: 'text', text: prompterSystem(docs), cache_control: { type: 'ephemeral' } }],
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: JSON.stringify(input, null, 2) },
            // Claude fetches each picture from its public CDN URL itself.
            ...labeled.flatMap((image, i) => [
              { type: 'text' as const, text: imageCaption(image, i + 1) },
              { type: 'image' as const, source: { type: 'url' as const, url: image.url } },
            ]),
          ],
        },
      ],
      max_tokens: STILL_PROMPTER.maxTokens,
      output_config: { effort: STILL_PROMPTER.effort },
    }

    payload.request = { ...request, agent_key: STILL_PROMPTER.key, configured_model: request.model }

    const { message, routing, usage, provider } = await askClaude(
      request,
      docs.map((doc) => doc.title),
    )

    payload.request = { ...payload.request, ...routing }
    payload.usage = usage
    payload.provider = provider

    const text = message.content.find((block) => block.type === 'text')?.text
    if (!text) throw new Error(`The still prompter answered without a prompt (${message.stop_reason})`)

    payload.raw = text

    // Asked for bare JSON; anything Claude puts around the object is dropped.
    const answer: StillPrompterAnswer = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1))
    payload.output = prompterOutput(answer, docs, isSceneEdit(assetPlan))
  } catch (error) {
    payload.error = (error as Error).message
  }

  return { ...payload, timing: stepTiming(startedAt) }
}
