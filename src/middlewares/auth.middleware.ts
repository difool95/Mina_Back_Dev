import type { NextFunction, Request, Response } from 'express'

import { supabase } from '../services/supabase.client.js'

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
