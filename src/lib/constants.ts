/** What one Create (still image) generation costs, in matchas. */
export const STILL_GENERATION_COST = 1

/**
 * The largest request body `/api/mma` accepts. A Create carries the pictures
 * fresh from the file picker as data URLs, far past express's 100 KB default.
 */
export const MMA_BODY_LIMIT = '50mb'

//THIS IS THE AGENT OF THE CREATE ASSET DIRECTOR, WHICH IS THE AGENT THAT WILL BE USED TO GENERATE MMA STEP 1 OF CREATE MODE. 
// IT IS A LOW EFFORT AGENT THAT USES THE CLAUDE-SONNET-5 MODEL.
export const CREATE_ASSET_DIRECTOR = {
  key: 'create_asset_director',
  model: 'claude-sonnet-5',
  maxTokens: 3000,
  effort: 'low',
} as const

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
