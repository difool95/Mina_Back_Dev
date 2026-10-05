import { createClient } from '@supabase/supabase-js'

import { env } from '../config/env.js'

/**
 * Holds the service_role key, so it bypasses RLS entirely — never expose a
 * query built from unvalidated input through it.
 *
 * Sessions are pointless on a server that authenticates every request from the
 * bearer token it was handed, and persisting them would leak one caller's
 * identity into the next request.
 */
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})
