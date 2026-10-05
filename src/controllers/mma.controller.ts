import type { Request, Response } from 'express'
import { z } from 'zod'

import { startStillGeneration } from '../services/mma.service.js'

const stillBody = z.object({
  studioSessionId: z.uuid(),
  platform: z.enum(['tiktok', 'instagram-post', 'print', 'square']),
  isCreative: z.boolean(),
})

export async function postStillGeneration(req: Request, res: Response) {
  const body = stillBody.parse(req.body)

  // requireUser has already resolved this from the verified bearer token.
  res.json(
    await startStillGeneration(req.userId!, {
      ...body,
      ip: req.ip ?? '',
      userAgent: req.get('user-agent') ?? '',
    }),
  )
}
