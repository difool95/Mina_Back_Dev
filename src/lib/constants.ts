import type { StillLane } from '../types/mma/mma.types.js'

/** What one Create (still image) generation costs, in matchas. */
export const STILL_GENERATION_COST = 1

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
} as const

/** MMA step 4 on the Creative lane: GPT Image, at about 2K. */
export const GPT_IMAGE = {
  model: 'gpt-image-2.5-flare',
  quality: 'max',
  background: 'auto',
  moderation: 'low',
  /** Its "2K": as many pixels as 1536×1536, so the long side of a 9:16 picture is 2048. */
  pixelBudget: 1536 * 1536,
} as const

/** Writes a generation's search text (mg_meta.seo) from step 3's prompt. */
export const SEO_WRITER = { model: 'gpt-4o-mini' } as const

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
export const STILL_ENGINES: Record<StillLane, string> = { niche: 'nano_banana', creative: 'gpt_image' }

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

/** How often the auto-refill cron looks for customers to charge. */
export const AUTO_REFILL_INTERVAL_MS = 10 * 60 * 1000

/** Customers fetched per page while scanning for auto-refill candidates. */
export const AUTO_REFILL_PAGE_SIZE = 200
