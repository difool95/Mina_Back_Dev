import type { NextFunction, Request, Response } from 'express'

import { supabase } from '../services/thirdPartyClients/supabase.client.js'

declare global {
  namespace Express {
    interface Request {
      /** Set by `requireUser` from the verified bearer token. */
      userId?: string
    }
  }
}

/**
 * Resolves the caller from their Supabase access token.
 *
 * Credits are money, so the user id has to come from a token Supabase has
 * verified — never from the request body, which the browser controls.
 */
export async function requireUser(req: Request, res: Response, next: NextFunction) {
  const token = req.get('authorization')?.match(/^Bearer (.+)$/)?.[1]

  if (!token) {
    res.status(401).json({ error: 'Missing bearer token' })
    return
  }

  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user) {
    res.status(401).json({ error: 'Invalid token' })
    return
  }

  req.userId = data.user.id
  next()
}

/**
 * Lets through only an admin: the caller's `mega_customers.mg_role`. Runs
 * after `requireUser`, which has already verified who the caller is.
 */
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const { data, error } = await supabase
    .from('mega_customers')
    .select('mg_role')
    .eq('mg_pass_id', `pass:user:${req.userId}`)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (data?.mg_role !== 'admin') {
    res.status(403).json({ error: 'Admins only' })
    return
  }

  next()
}
