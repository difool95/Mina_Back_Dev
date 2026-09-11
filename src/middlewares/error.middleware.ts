import type { NextFunction, Request, Response } from 'express'

/**
 * Turns anything a service throws into one JSON shape.
 *
 * Express only recognises a four-argument function as an error handler, so
 * `next` has to stay in the signature even though nothing calls it.
 */
export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error(error)

  res.status(500).json({ error: error.message })
}
