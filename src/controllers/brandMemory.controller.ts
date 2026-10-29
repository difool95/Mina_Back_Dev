import type { Request, Response } from 'express'
import { z } from 'zod'

import { env } from '../config/env.js'
import { createBrandMemory } from '../services/brandMemory.service.js'

export async function postBrandMemory(req: Request, res: Response) {
  const { url } = z.object({ url: z.string().startsWith(`${env.R2_PUBLIC_BASE_URL}/`) }).parse(req.body)

  res.json(await createBrandMemory(req.userId!, url))
}
