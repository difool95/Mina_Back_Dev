import type {
  ClaudeUsage,
  CostProvider,
  CostRates,
  GeminiUsage,
  GptImageUsage,
  MmaCostData,
  MmaSpend,
  OpenAiChatUsage,
  StillLane,
} from '../../types/mma/mma.types.js'
import {
  CLAUDE_PRICES,
  GEMINI_IMAGE_PRICES,
  GPT_IMAGE_PRICES,
  MATCHA_PACKS,
  MMA_COSTS,
  OPENAI_CHAT_PRICES,
  STILL_GENERATION_COSTS,
} from '../constants.js'

const PER_MILLION = 1_000_000

/** Dollars to five decimals, as `mg_cost_data` stores them. */
const round = (usd: number) => Math.round(usd * 100_000) / 100_000

/** A ratio with nothing to divide by (nothing sold, nothing spent) is no ratio at all. */
const ratio = (part: number, whole: number) => (whole ? round(part / whole) : null)

/** The matcha's price in pounds: the smallest pack's, and the 5,000 pack's for bulk buyers. */
const MATCHA_GBP = MATCHA_PACKS[0].gbp / MATCHA_PACKS[0].matchas
const MATCHA_BULK_GBP = MATCHA_PACKS[MATCHA_PACKS.length - 1]!.gbp / MATCHA_PACKS[MATCHA_PACKS.length - 1]!.matchas

//This method returns the cost of a Claude call in USD, based on the usage and the model's pricing.
function claudeUsd(usage: ClaudeUsage) {
  const price = CLAUDE_PRICES[usage.model]!

  return (
    (usage.input_tokens * price.input +
      usage.output_tokens * price.output +
      usage.cache_creation_input_tokens * price.cacheWrite +
      usage.cache_read_input_tokens * price.cacheRead) /
    PER_MILLION
  )
}

//This method returns the cost of an OpenAI chat call in USD, based on the usage and the model's pricing.
function openAiChatUsd(model: string, usage: OpenAiChatUsage) {
  const price = OPENAI_CHAT_PRICES[model]!
  const cached = usage.prompt_tokens_details?.cached_tokens ?? 0

  return (
    ((usage.prompt_tokens - cached) * price.input + cached * price.cachedInput + usage.completion_tokens * price.output) /
    PER_MILLION
  )
}

//This method returns the cost of a GPT Image call in USD, based on the usage and the model's pricing.
function gptImageUsd(model: string, usage: GptImageUsage) {
  const price = GPT_IMAGE_PRICES[model]!
  const imageInput = usage.input_tokens_details?.image_tokens ?? 0
  const textInput = usage.input_tokens_details?.text_tokens ?? usage.input_tokens - imageInput

  return (textInput * price.textInput + imageInput * price.imageInput + usage.output_tokens * price.imageOutput) / PER_MILLION
}

//This method returns the cost of a Gemini Image call in USD, based on the usage and the model's pricing.
function geminiImageUsd(model: string, usage: GeminiUsage) {
  const price = GEMINI_IMAGE_PRICES[model]!
  const output = usage.candidatesTokenCount ?? 0
  const imageOutput = usage.candidatesTokensDetails?.find((detail) => detail.modality === 'IMAGE')?.tokenCount ?? output
  const textOutput = output - imageOutput + (usage.thoughtsTokenCount ?? 0)

  return ((usage.promptTokenCount ?? 0) * price.input + imageOutput * price.imageOutput + textOutput * price.textOutput) / PER_MILLION
}

const calls = (count: number) => `${count} call${count === 1 ? '' : 's'} (real usage)`

//This method is returning the providers array that will be included in the `mg_cost_data` field of a generation. It calculates the cost of each provider 
//and returns an array of providers with their respective costs.
function costProviders(spend: MmaSpend): CostProvider[] {
  const providers: CostProvider[] = []
  const { image } = spend

  if (image?.engine === 'nanobanana') {
    providers.push({ usd: round(geminiImageUsd(image.model, image.usage)), label: `NanoBanana Pro (${image.model})`, detail: '4K still', provider: 'nanobanana' })
  } else if (image?.engine === 'openai') {
    providers.push({ usd: round(gptImageUsd(image.model, image.usage)), label: `GPT Image (${image.model})`, detail: `${image.size} still`, provider: 'openai' })
  }

  const byModel = new Map<string, { usd: number; count: number }>()
  for (const usage of spend.claude) {
    const entry = byModel.get(usage.model) ?? { usd: 0, count: 0 }
    byModel.set(usage.model, { usd: entry.usd + claudeUsd(usage), count: entry.count + 1 })
  }
  for (const [model, { usd, count }] of byModel) {
    providers.push({ usd: round(usd), label: `Claude (${model})`, detail: calls(count), provider: 'claude' })
  }

  if (spend.seo) {
    providers.push({ usd: round(openAiChatUsd(spend.seo.model, spend.seo.usage)), label: `GPT (${spend.seo.model})`, detail: calls(1), provider: 'openai' })
  }

  return providers
}

//This method is Creating the field `mg_cost_data` for a generation, which calculates the cost of a generation the profit of a generation and many other things.
export function costData(lane: StillLane, spend: MmaSpend, isCharged: boolean, rates: CostRates): MmaCostData {
  const providers = costProviders(spend)
  const imageProvider = spend.image ? providers[0] : undefined

  const modelCost = imageProvider?.usd ?? 0
  const mmaCost = round(providers.filter((entry) => entry !== imageProvider).reduce((sum, entry) => sum + entry.usd, 0))
  const apiCost = round(modelCost + mmaCost)

  const matchas = isCharged ? STILL_GENERATION_COSTS[lane] : 0
  const unitPrice = round(MATCHA_GBP * rates.usdPerGbp)
  const bulkUnitPrice = round(MATCHA_BULK_GBP * rates.usdPerGbp)
  const sellPrice = round(unitPrice * matchas)
  const sellPriceBulk = round(bulkUnitPrice * matchas)
  const profit = round(sellPrice - apiCost)
  const profitBulk = round(sellPriceBulk - apiCost)
  const fixedOverhead = round(MMA_COSTS.fixedMonthlyTotalUsd / rates.generationsPerMonth)

  return {
    provider: lane === 'niche' ? 'nanobanana' : 'openai',
    fallbacks: [],
    providers,
    margin_pct: ratio(profit, sellPrice),
    markup_pct: ratio(profit, apiCost),
    profit_usd: profit,
    api_cost_usd: apiCost,
    mma_cost_usd: mmaCost,
    model_cost_usd: modelCost,
    sell_price_usd: sellPrice,
    total_cost_usd: round(fixedOverhead + apiCost),
    margin_bulk_pct: ratio(profitBulk, sellPriceBulk),
    markup_bulk_pct: ratio(profitBulk, apiCost),
    matchas_charged: matchas,
    profit_bulk_usd: profitBulk,
    fixed_overhead_usd: fixedOverhead,
    cost_schema_version: MMA_COSTS.schemaVersion,
    sell_price_bulk_usd: sellPriceBulk,
    matcha_unit_price_usd: unitPrice,
    profit_after_fixed_usd: round(profit - fixedOverhead),
    fixed_monthly_total_usd: MMA_COSTS.fixedMonthlyTotalUsd,
    est_generations_per_month: rates.generationsPerMonth,
    matcha_unit_price_bulk_usd: bulkUnitPrice,
    profit_after_fixed_bulk_usd: round(profitBulk - fixedOverhead),
  }
}
