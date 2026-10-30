import type { StillLane } from '../types/mma/mma.types.js'

/** What one Create (still image) generation costs, in matchas, on each lane. */
export const STILL_GENERATION_COSTS: Record<StillLane, number> = { niche: 1, creative: 1, creative_plus: 2 }

/** The largest picture the studio uploads, the same limit as its file picker. */
export const UPLOAD_MAX_SIZE = '48mb'

/**
 * The picture types the studio uploads, and the extension each is stored
 * under. The studio converts everything else (HEIC, AVIF, GIF…) before sending.
 */
export const UPLOAD_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

//THIS IS THE AGENT OF THE CREATE ASSET DIRECTOR, WHICH IS THE AGENT THAT WILL BE USED TO GENERATE MMA STEP 1 OF CREATE MODE. 
// IT IS A LOW EFFORT AGENT THAT USES THE CLAUDE-SONNET-5 MODEL.
export const CREATE_ASSET_DIRECTOR = {
  key: 'create_asset_director',
  model: 'claude-sonnet-5',
  maxTokens: 3000,
  effort: 'low',
} as const

//THIS IS THE AGENT OF THE STILL PROMPTER, WHICH WRITES THE CLEAN PROMPT OF MMA STEP 3 OF CREATE MODE FROM THE BRIEF,
// THE ASSET PLAN OF STEP 1 AND THE KNOWLEDGE GUIDES OF STEP 2. IT IS A HIGH EFFORT AGENT THAT USES THE CLAUDE-OPUS-5-5 MODEL.
export const STILL_PROMPTER = {
  key: 'still_create_prompter',
  model: 'claude-opus-5-5',
  maxTokens: 8000,
  effort: 'high',
} as const

/** MMA step 4 on the Niche lane: NanoBanana Pro, rendering in 4K. */
export const NANOBANANA = {
  model: 'gemini-3-pro-image-preview',
  resolution: '4K',
  /** Its name in `mg_mma_vars.meta.still_engine`. */
  stillEngine: 'gemini_3_pro_image_preview',
} as const

/** MMA step 4 on the Creative lane: GPT Image, at about 2K. */
export const GPT_IMAGE = {
  model: 'gpt-image-2.5-flare',
  quality: 'max',
  background: 'auto',
  moderation: 'low',
  /** Its "2K": as many pixels as 1536×1536, so the long side of a 9:16 picture is 2048. */
  pixelBudget: 1536 * 1536,
  resolution: '2K',
  /** Its name in `mg_mma_vars.meta.still_engine`. */
  stillEngine: 'gpt_image_2.5_flare',
} as const

/** MMA step 4 on the Creative+ lane: GPT Image Sunburst, at about 4K. */
export const GPT_IMAGE_PLUS = {
  ...GPT_IMAGE,
  model: 'gpt-image-2.5-sunburst',
  /**
   * Its 4K: as many pixels as UHD 3840×2160, so a 9:16 picture is 2160×3840.
   * OpenAI refuses any edge over 3840, which this keeps every ratio under
   * (1:1 → 2880×2880, 3:4 → 2480×3312, 2:3 → 2336×3504).
   */
  pixelBudget: 3840 * 2160,
  resolution: '4K',
  stillEngine: 'gpt_image_25_sunburst',
} as const

/** The image engine each Create lane renders with in step 4. */
export const STILL_RENDERERS = { niche: NANOBANANA, creative: GPT_IMAGE, creative_plus: GPT_IMAGE_PLUS } as const

/** The `version` every `mg_mma_vars` carries. */
export const MMA_VARS_VERSION = '2025-12-23'

/** Writes a generation's search text (mg_meta.seo) from step 3's prompt. */
export const SEO_WRITER = { model: 'gpt-4o-mini' } as const

/** Reads a brand memory's picture into its name, description, tags and category. */
export const BRAND_MEMORY_SCANNER = { model: 'gpt-4o-mini' } as const

/** The most brand memories one user can keep. */
export const BRAND_MEMORY_MAX = 1000

/** The most pictures one brand memory holds. */
export const BRAND_MEMORY_MAX_IMAGES = 5

// Prices in USD per million tokens.Checked on 2026-10-16 against each provider's pricing page.
/** Claude: cache writes are the 5-minute kind (1.25× input), cache reads 0.1× input. */
export const CLAUDE_PRICES: Record<string, { input: number; output: number; cacheWrite: number; cacheRead: number }> = {
  'claude-opus-5-5': { input: 4, output: 20, cacheWrite: 5, cacheRead: 0.2 },
  'claude-sonnet-5': { input: 2, output: 10, cacheWrite: 2.5, cacheRead: 0.2 },
}

export const OPENAI_CHAT_PRICES: Record<string, { input: number; cachedInput: number; output: number }> = {
  'gpt-4o-mini': { input: 0.15, cachedInput: 0.075, output: 0.6 },
}

/** GPT Image never outputs text, so only its image output is billed. */
export const GPT_IMAGE_PRICES: Record<string, { textInput: number; imageInput: number; imageOutput: number }> = {
  'gpt-image-2.5-flare': { textInput: 5, imageInput: 8, imageOutput: 30 },
  // Not checked yet: flare's prices until sunburst's are known.
  'gpt-image-2.5-sunburst': { textInput: 5, imageInput: 8, imageOutput: 30 },
}

/** NanoBanana Pro: a 4K picture is 2,000 output tokens, so $0.24 of image output. Thinking bills as text output. */
export const GEMINI_IMAGE_PRICES: Record<string, { input: number; textOutput: number; imageOutput: number }> = {
  'gemini-3-pro-image-preview': { input: 2, textOutput: 12, imageOutput: 120 },
}

/** What `mg_cost_data` is computed with, besides the per-token prices. */
export const MMA_COSTS = {
  schemaVersion: 'mma-cost-v3-2026-07-24',
  //This is the fixed monthly cost of all MINA External third parties, in USD, we change this value manually.
  fixedMonthlyTotalUsd: 2350,
  // The default number of generations per month, used until the cost-rates job has read last month's count, or when it fails.
  defaultGenerationsPerMonth: 1000,
  // The default exchange rate, used until the exchange-rate job has read today's rate, or when it fails.
  defaultUsdPerGbp: 1.27,
} as const

//This is the hour in dubai where the exchange rate job runs, it is set to 20:00 Dubai time, which is 16:00 UTC.
export const EXCHANGE_RATE_HOUR = 20

//This is the hour in dubai where the generations count job runs, it is set to 8:00 Dubai time, which is 4:00 UTC.
export const GENERATIONS_COUNT_HOUR = 8

//This is the endpoint of the API that returns the current exchange rate of GBP to USD, it is used by the exchange rate job to get the current exchange rate.
export const EXCHANGE_RATES_URL = 'https://open.er-api.com/v6/latest/GBP'

/** The R2 folder MMA's generated stills go in. */
export const R2_STILLS_PREFIX = 'mma/still'

/** How every MMA call caches its prompt, stored beside the request. The token counts come from the response. */
export const MMA_PROMPT_CACHE = {
  ttl: '5m',
  mode: 'explicit',
  type: 'ephemeral',
  scope: 'tools_and_system_prefix',
  provider: 'anthropic',
}

/** The image engine each Create lane renders with, which decides the engine guide step 2 picks. */
export const STILL_ENGINES: Record<StillLane, string> = {
  niche: 'nano_banana',
  creative: 'gpt_image',
  creative_plus: 'gpt_image',
}

/**
 * The knowledge guides and their router catalog, from the project root: `tsc`
 * does not copy them into `dist`, so they are read where they sit in `src`.
 */
export const KNOWLEDGE_DIR = 'src/server/mma/knowledge'

export const KNOWLEDGE_CATALOG_FILE = 'knowledge-router-catalog.json'

/** The width Cloudflare resizes every picture to before Claude reads it. */
export const MMA_IMAGE_WIDTH = 1080

/** The R2 folder customers' uploads go in, one `owner_` folder each. */
export const R2_UPLOADS_PREFIX = 'mina-assets'

/** Matchas handed to a user the first time they sign in. */
export const SIGNUP_BONUS = 3

/** How long a lot of matchas stays spendable. */
export const LOT_LIFETIME_MONTHS = 1

/**
 * The clock every scheduled job is set by. Dubai holds UTC+4 all year, so
 * there is no DST step to schedule around.
 */
export const TIME_ZONE = 'Asia/Dubai'

/** The hour of that day the expiry sweep runs at. */
export const CREDIT_EXPIRY_HOUR = 8

export const DAY_SECONDS = 86_400

/**
 * The matcha packs a customer can buy, priced in GBP. Kept in step with
 * `Mina_Front_Dev/src/lib/constants.ts`
 */
export const MATCHA_PACKS = [
  { matchas: 100, gbp: 60 },
  { matchas: 500, gbp: 300 },
  { matchas: 1500, gbp: 900 },
  { matchas: 5000, gbp: 2500 },
] as const

/**
 * What every `.mina` prompt file starts with, ahead of its sealed inputs. The
 * number is the format's version: a new one can be read beside the old.
 */
export const PROMPT_FILE_PREFIX = 'MINA-PROMPT-FILE-1:'

/** Authenticated encryption, so a file edited by hand fails to open rather than opening wrong. */
export const PROMPT_FILE_CIPHER = 'aes-256-gcm'

/** How often the auto-refill cron looks for customers to charge. */
export const AUTO_REFILL_INTERVAL_MS = 10 * 60 * 1000

/** Customers fetched per page while scanning for auto-refill candidates. */
export const AUTO_REFILL_PAGE_SIZE = 200
