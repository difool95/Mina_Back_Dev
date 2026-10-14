import { SEO_WRITER } from '../../lib/constants.js'
import { SEO_WRITER_PROMPT, buildSeo } from '../../lib/mmaSeo/mmaSeoLib.js'
import type { MmaSeo, SeoReading, StillGenerationRequest } from '../../types/mma/mma.types.js'
import { openAiJson } from '../thirdPartyClients/openai.client.js'
import { logMmaError } from './mmaErrorLogger.service.js'

/** gpt-4o-mini's sentence and keywords for the prompt, or null when it fails: the SEO then falls back to the prompt. */
async function readPrompt(prompt: string): Promise<SeoReading | null> {
  try {
    const answer = (await openAiJson(SEO_WRITER.model, SEO_WRITER_PROMPT, prompt)) as Partial<SeoReading>
    const sentence = String(answer.sentence ?? '').trim()
    const keywords = Array.isArray(answer.keywords) ? answer.keywords.map((keyword) => String(keyword).trim()).filter(Boolean) : []

    return sentence || keywords.length ? { sentence, keywords } : null
  } catch (error) {
    logMmaError(error)
    return null
  }
}

/**
 * The generation's `mg_meta.seo`, written from step 3's prompt. Never fails:
 * without gpt-4o-mini's reading, it is built from the cleaned prompt.
 */
export async function writeSeo(
  passId: string,
  generationId: string,
  prompt: string,
  { aspectRatio, platform }: Pick<StillGenerationRequest, 'aspectRatio' | 'platform'>,
): Promise<MmaSeo> {
  return buildSeo({ reading: await readPrompt(prompt), prompt, passId, generationId, ratio: aspectRatio, platform })
}
