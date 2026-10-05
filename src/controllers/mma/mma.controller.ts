import type { Request, Response } from 'express'
import { z } from 'zod'

import { env } from '../../config/env.js'
import { startStillGeneration } from '../../services/mma/mma.service.js'

const stillBody = z.object({
  studioSessionId: z.uuid(),
  platform: z.enum(['tiktok', 'instagram-post', 'print', 'square']),
  isCreative: z.boolean(),
  brief: z.string(),
  uploads: z.array(
    z.object({
      kind: z.enum(['scene', 'logo', 'product']),
      // A picture fresh from the file picker, in a format Claude reads, or one
      // already on our R2 — never a URL of the browser's choosing, which the
      // API would otherwise go and fetch.
      url: z
        .string()
        .refine(
          (url) => /^data:image\/(png|jpeg|webp|gif);base64,/.test(url) || url.startsWith(`${env.R2_PUBLIC_BASE_URL}/`),
          'Expected a PNG, JPEG, WebP or GIF data URL, or a Mina asset URL',
        ),
    }),
  ),
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
