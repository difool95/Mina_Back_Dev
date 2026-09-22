import cors from 'cors'
import express from 'express'

import { env } from './config/env.js'
import { errorHandler } from './middlewares/error.middleware.js'
import { checkoutRouter } from './routes/checkout.routes.js'
import { creditsRouter } from './routes/credits.routes.js'

// Assembles the Express app. Kept separate from server.ts so tests can import
// the app without opening a port.
export function createApp() {
  const app = express()

  app.use(cors({ origin: env.CORS_ORIGIN }))

  // Ahead of express.json(): its webhook route needs the raw request body,
  // which a global JSON parser would have already consumed.
  app.use('/api/checkout', checkoutRouter)

  app.use(express.json())

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  app.use('/api/credits', creditsRouter)

  // Must stay last, after every route it is meant to catch.
  app.use(errorHandler)

  return app
}
