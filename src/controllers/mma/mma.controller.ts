import type { Request, Response } from 'express'
import { z } from 'zod'

import { env } from '../../config/env.js'
import { startStillGeneration } from '../../services/mma/mma.service.js'
import { deleteStudioImage, storeStudioImage } from '../../services/mma/mmaUploads.service.js'

/** One of our R2 files — never a URL of the browser's choosing, which the API would go and fetch. */
const assetUrl = z.string().startsWith(`${env.R2_PUBLIC_BASE_URL}/`)

const stillBody = z.object({
  studioSessionId: z.uuid(),
  platform: z.enum(['tiktok', 'instagram-post', 'print', 'square']),
  isCreative: z.boolean(),
  brief: z.string(),
  uploads: z.array(
    z.object({
      kind: z.enum(['scene', 'logo', 'product']),
      url: assetUrl,
      origin: z.enum(['upload', 'scene_library']),
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

/** The raw bytes of one picture; `express.raw` leaves the body unset when its type is not one we store. */
const uploadBody = z.instanceof(Buffer, { error: 'Expected a JPEG, PNG or WebP picture' })

export async function postUpload(req: Request, res: Response) {
  const body = uploadBody.parse(req.body)

  res.json({ url: await storeStudioImage(req.userId!, body, req.get('content-type') ?? '') })
}

export async function deleteUpload(req: Request, res: Response) {
  await deleteStudioImage(req.userId!, z.object({ url: assetUrl }).parse(req.body).url)

  res.json({ ok: true })
}
