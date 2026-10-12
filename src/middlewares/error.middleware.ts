import type { NextFunction, Request, Response } from 'express'

import { logMmaError } from '../services/mma/mmaErrorLogger.service.js'

/** Logs an error of an `/api/mma` request where it came from, then leaves the response to `errorHandler`. */
export function mmaErrorLogger(error: Error, _req: Request, _res: Response, next: NextFunction) {
  logMmaError(error)
  next(error)
}

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
