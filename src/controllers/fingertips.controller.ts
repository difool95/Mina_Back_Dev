import type { Request, Response } from 'express'
import { z } from 'zod'

import { env } from '../config/env.js'
import { startNoBackground, startNoBackgroundAll } from '../services/fingertips/fingertipsNoBackground.service.js'
import { startNoSubject, startNoSubjectAll } from '../services/fingertips/fingertipsNoSubject.service.js'
import { startTweak } from '../services/fingertips/fingertipsTweak.service.js'
import { startVectorize, startVectorizeAll } from '../services/fingertips/fingertipsVectorize.service.js'

const fingertipsBody = z.object({
  // One of our R2 files, never a URL of the browser's choosing, which the API would go and fetch.
  imageUrl: z.string().startsWith(`${env.R2_PUBLIC_BASE_URL}/`),
  brief: z.string().trim().min(4),
  lane: z.enum(['niche', 'creative', 'creative_plus']),
  aspectRatio: z.enum(['9:16', '16:9', '3:4', '4:3', '2:3', '3:2', '1:1']),
  platform: z.enum(['tiktok', 'instagram-post', 'print', 'square']),
})

/** Tweak: charges the lane, starts the edit, and answers at once with the generation to poll. */
export async function postTweak(req: Request, res: Response) {
  // requireUser has already resolved this from the verified bearer token.
  res.json(await startTweak(req.userId!, fingertipsBody.parse(req.body)))
}

/** Vectorize: the same body without the note. */
export async function postVectorize(req: Request, res: Response) {
  res.json(await startVectorize(req.userId!, fingertipsBody.omit({ brief: true }).parse(req.body)))
}

/** Vectorize All: the same body, with every picture of the carousel instead of one. */
export async function postVectorizeAll(req: Request, res: Response) {
  const body = fingertipsBody
    .omit({ brief: true, imageUrl: true })
    .extend({ imageUrls: z.array(fingertipsBody.shape.imageUrl).min(1) })

  res.json(await startVectorizeAll(req.userId!, body.parse(req.body)))
}

/** Remove Subject: the same body as Vectorize. */
export async function postNoSubject(req: Request, res: Response) {
  res.json(await startNoSubject(req.userId!, fingertipsBody.omit({ brief: true }).parse(req.body)))
}

/** Remove all Subject: the same body, with every picture of the carousel instead of one. */
export async function postNoSubjectAll(req: Request, res: Response) {
  const body = fingertipsBody
    .omit({ brief: true, imageUrl: true })
    .extend({ imageUrls: z.array(fingertipsBody.shape.imageUrl).min(1) })

  res.json(await startNoSubjectAll(req.userId!, body.parse(req.body)))
}

/** Remove BG: the same body as Remove Subject. */
export async function postNoBackground(req: Request, res: Response) {
  res.json(await startNoBackground(req.userId!, fingertipsBody.omit({ brief: true }).parse(req.body)))
}

/** Remove all BG: the same body, with every picture of the carousel instead of one. */
export async function postNoBackgroundAll(req: Request, res: Response) {
  const body = fingertipsBody
    .omit({ brief: true, imageUrl: true })
    .extend({ imageUrls: z.array(fingertipsBody.shape.imageUrl).min(1) })

  res.json(await startNoBackgroundAll(req.userId!, body.parse(req.body)))
}
