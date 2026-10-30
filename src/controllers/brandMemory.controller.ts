import type { Request, Response } from 'express'
import { z } from 'zod'

import { env } from '../config/env.js'
import { createBrandMemory } from '../services/brandMemory.service.js'

export async function postBrandMemory(req: Request, res: Response) {
  const { url, sort_order } = z
    .object({ url: z.string().startsWith(`${env.R2_PUBLIC_BASE_URL}/`), sort_order: z.number() })
    .parse(req.body)

  res.json(await createBrandMemory(req.userId!, url, sort_order))
}
