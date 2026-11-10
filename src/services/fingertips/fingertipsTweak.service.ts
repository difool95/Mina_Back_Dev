import type Anthropic from '@anthropic-ai/sdk'

import { env } from '../../config/env.js'
import { TWEAK_PROMPTER } from '../../lib/constants.js'
import { TWEAK_PROMPTER_PROMPT, fingertipsResizedImageUrl } from '../../lib/fingertips/fingertipsLib.js'
import type { TweakPrompterAnswer, TweakRequest } from '../../types/fingertips.types.js'
import { markStatus } from '../mma/mma.service.js'
import { writeSeo } from '../mma/mmaSeo.service.js'
import { askClaude } from '../thirdPartyClients/anthropic.client.js'
import { generateAndStoreEditedPicture, startFingertips } from './fingertips.service.js'

/**
 * Tweak (the edit menu's Prompt): Claude reads the picture and the user's
 * note and writes the edit prompt, the SEO is written from it, then the
 * lane's engine renders the edit on the picture.
 */
export function startTweak(userId: string, request: TweakRequest) {
  return startFingertips(userId, 'tweak', request, async (run) => {
    const image = fingertipsResizedImageUrl(env.R2_PUBLIC_BASE_URL, request.imageUrl)
    //Setup the generation status to prompting, then call the tweak prompter to get the prompt and negative prompt for the edit.
    markStatus(run.generationId, 'prompting')
    const claudeRequest: Anthropic.MessageCreateParamsNonStreaming = {
      model: TWEAK_PROMPTER.model,
      system: [{ type: 'text', text: TWEAK_PROMPTER_PROMPT, cache_control: { type: 'ephemeral' } }],
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: `Tweak request: ${request.brief}` },
            // Claude fetches the picture from its public CDN URL itself.
            { type: 'image', source: { type: 'url', url: image } },
          ],
        },
      ],
      max_tokens: TWEAK_PROMPTER.maxTokens,
      output_config: { effort: TWEAK_PROMPTER.effort },
    }
    const { message, usage } = await askClaude(claudeRequest, [])
    run.spend.claude.push(usage)

    const text = message.content.find((block) => block.type === 'text')?.text
    if (!text) throw new Error(`The tweak prompter answered without a prompt (${message.stop_reason})`)

    // We just get the JSON from the text in the type TweakPrompterAnswer, ignoring any other text Claude may have added.
    const answer: TweakPrompterAnswer = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1))

    const { seo, spend: seoSpend } = await writeSeo(run.passId, run.generationId, answer.clean_prompt, request)
    run.spend.seo = seoSpend

    markStatus(run.generationId, 'generating')
    const prompt = `${answer.clean_prompt}\n\nAvoid: ${answer.negative_prompt}`
    const { url, provenance } = await generateAndStoreEditedPicture(request.lane, prompt, image, seo, run)

    return { url, seo, provenance }
  })
}
