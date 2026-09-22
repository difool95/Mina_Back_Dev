import { createApp } from './app.js'
import { env } from './config/env.js'
import { scheduleAutoRefill } from './jobs/autoRefill.job.js'
import { scheduleCreditExpiry } from './jobs/credits.job.js'

createApp().listen(env.PORT, () => {
  console.log(`Mina API listening on http://localhost:${env.PORT}`)
})

// Here rather than in app.ts, so importing the app still starts no timers.
scheduleCreditExpiry()
scheduleAutoRefill()
