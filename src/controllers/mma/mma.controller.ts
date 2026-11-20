import type { Request, Response } from 'express'
import { z } from 'zod'

import { env } from '../../config/env.js'
import { ANIMATE_DURATION_RANGE } from '../../lib/constants.js'
import { startAnimateGeneration, startStillGeneration } from '../../services/mma/mma.service.js'
import { deleteStudioImage, storeStudioImage } from '../../services/mma/mmaUploads.service.js'

/** One of our R2 files — never a URL of the browser's choosing, which the API would go and fetch. */
const assetUrl = z.string().startsWith(`${env.R2_PUBLIC_BASE_URL}/`)

const stillBody = z.object({
  studioSessionId: z.uuid(),
  platform: z.enum(['tiktok', 'instagram-post', 'print', 'square']),
  aspectRatio: z.enum(['9:16', '16:9', '3:4', '4:3', '2:3', '3:2', '1:1']),
  lane: z.enum(['niche', 'creative', 'creative_plus']),
  brief: z.string(),
  uploads: z.array(
    z.object({
      kind: z.enum(['scene', 'logo', 'product']),
      url: assetUrl,
      origin: z.enum(['upload', 'scene_library']),
    }),
  ),
  brandMemories: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      category: z.enum(['logo', 'illustration', 'model', 'product']),
      images: z.array(assetUrl).min(1),
    }),
  ),
})

//THIS METHOD IS USED TO START THE STILL GENERATION PROCESS. IT TAKES THE REQUEST AND RESPONSE OBJECTS AS PARAMETERS AND RETURNS A JSON RESPONSE WITH THE RESULT OF THE STILL GENERATION.
export async function postStillGeneration(req: Request, res: Response) {
  const body = stillBody.parse(req.body)

      console.log("starting still generation of " + req.userId!);
  // requireUser has already resolved this from the verified bearer token.
  res.json(
    await startStillGeneration(req.userId!, {
      ...body,
      ip: req.ip ?? '',
      userAgent: req.get('user-agent') ?? '',
    }),
  )
}

/** A video or a sound from Animate's upload row, with its length once fitted in the studio. */
const timedUpload = z.object({ url: assetUrl, seconds: z.number().positive() })

const animateBody = z.object({
  studioSessionId: z.uuid(),
  platform: z.enum(['tiktok', 'instagram-post', 'print', 'square']),
  aspectRatio: z.enum(['9:16', '16:9', '3:4', '4:3', '2:3', '3:2', '1:1']),
  lane: z.enum(['director']),
  brief: z.string(),
  isSoundOn: z.boolean(),
  resolution: z.enum(['720p', '1080p']),
  // Whole seconds within the studio's range: the price is worked out from it here, never taken from the browser.
  durationSeconds: z.int().min(ANIMATE_DURATION_RANGE.min).max(ANIMATE_DURATION_RANGE.max),
  images: z.array(assetUrl),
  videos: z.array(timedUpload),
  audios: z.array(timedUpload),
})

//THIS METHOD IS USED TO START AN ANIMATE (VIDEO) GENERATION. IT RETURNS THE GENERATION ID AND THE BALANCE LEFT ONCE IT IS PAID FOR.
export async function postAnimateGeneration(req: Request, res: Response) {
  const body = animateBody.parse(req.body)
  res.json(
    await startAnimateGeneration(req.userId!, {
      ...body,
      ip: req.ip ?? '',
      userAgent: req.get('user-agent') ?? '',
    }),
  )
}

/** The raw bytes of one picture; `express.raw` leaves the body unset when its type is not one we store. */
const uploadBody = z.instanceof(Buffer, { error: 'Expected a JPEG, PNG or WebP picture, an MP4 video or an MP3 or WAV sound' })

//THIS METHOD IS USED TO UPLOAD FILES TO THE SERVER. IT REQUIRES THE USER TO BE AUTHENTICATED AND CHECKS THAT THE UPLOADED FILE IS OF A VALID TYPE AND SIZE.
export async function postUpload(req: Request, res: Response) {
  const body = uploadBody.parse(req.body)

  res.json({ url: await storeStudioImage(req.userId!, body, req.get('content-type') ?? '') })
}

//THIS METHOD IS USED TO DELETE A PICTURE THE USER UPLOADED TO THE R2 CLOUDFLARE. IT TAKES THE USERID AND THE URL OF THE PICTURE AS PARAMETERS.
export async function deleteUpload(req: Request, res: Response) {
  await deleteStudioImage(req.userId!, z.object({ url: assetUrl }).parse(req.body).url)

  res.json({ ok: true })
}
