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
