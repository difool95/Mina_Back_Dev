import type { Request, Response } from 'express'
import { z } from 'zod'

import { env } from '../config/env.js'
import { BRAND_MEMORY_MAX_IMAGES } from '../lib/constants.js'
import { createBrandMemory } from '../services/brandMemory.service.js'

export async function postBrandMemory(req: Request, res: Response) {
  const { urls, sort_order } = z
    .object({
      urls: z.array(z.string().startsWith(`${env.R2_PUBLIC_BASE_URL}/`)).min(1).max(BRAND_MEMORY_MAX_IMAGES),
      sort_order: z.number(),
    })
    .parse(req.body)

  res.json(await createBrandMemory(req.userId!, urls, sort_order))
}
