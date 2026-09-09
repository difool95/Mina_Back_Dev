import cors from 'cors'
import express from 'express'

// Assembles the Express app. Kept separate from server.ts so tests can import
// the app without opening a port.
//
// Wire feature routers here as they are built:
//   import { bookingsRouter } from './routes/bookings.routes.js'
//   app.use('/api/bookings', bookingsRouter)
//
// The global error handler must stay registered last.
export function createApp() {
  const app = express()

  app.use(cors())
  app.use(express.json())

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  return app
}
