import { createApp } from './app.js'

// Move env reading into src/config/env.ts (zod-validated) once there is more
// than a port to handle.
const port = Number(process.env.PORT ?? 3000)

createApp().listen(port, () => {
  console.log(`Mina API listening on http://localhost:${port}`)
})
