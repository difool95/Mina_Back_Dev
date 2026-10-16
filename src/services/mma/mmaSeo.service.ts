import { SEO_WRITER } from '../../lib/constants.js'
import { SEO_WRITER_PROMPT, buildSeo } from '../../lib/mmaSeo/mmaSeoLib.js'
import type { MmaSpend, SeoReading, StillGenerationRequest } from '../../types/mma/mma.types.js'
import { openAiJson } from '../thirdPartyClients/openai.client.js'
import { logMmaError } from './mmaErrorLogger.service.js'

/**
 * gpt-4o-mini's sentence and keywords for the prompt, and the tokens they
 * cost. The reading is null when the call fails, and the SEO then falls back
 * to the prompt; the spend is null only when there was no answer to pay for.
 */
async function readPrompt(prompt: string): Promise<{ reading: SeoReading | null; spend: MmaSpend['seo'] }> {
  try {
    const { answer, usage } = await openAiJson(SEO_WRITER.model, SEO_WRITER_PROMPT, prompt)
    const { sentence: rawSentence, keywords: rawKeywords } = answer as Partial<SeoReading>
    const sentence = String(rawSentence ?? '').trim()
    const keywords = Array.isArray(rawKeywords) ? rawKeywords.map((keyword) => String(keyword).trim()).filter(Boolean) : []

    return { reading: sentence || keywords.length ? { sentence, keywords } : null, spend: { model: SEO_WRITER.model, usage } }
  } catch (error) {
    logMmaError(error)
    return { reading: null, spend: null }
  }
}

/**
 * The generation's `mg_meta.seo`, written from step 3's prompt, and what
 * writing it cost. Never fails: without gpt-4o-mini's reading, it is built
 * from the cleaned prompt.
 */
export async function writeSeo(
  passId: string,
  generationId: string,
  prompt: string,
  { aspectRatio, platform }: Pick<StillGenerationRequest, 'aspectRatio' | 'platform'>,
) {
  const { reading, spend } = await readPrompt(prompt)

  return { seo: buildSeo({ reading, prompt, passId, generationId, ratio: aspectRatio, platform }), spend }
}
