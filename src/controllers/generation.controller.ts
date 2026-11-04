import type { Request, Response } from 'express'
import { z } from 'zod'

import { restoreGeneration } from '../services/generations.service.js'

/** Brings back a generation a user deleted, while it can still be restored. */
export async function postRestoreGeneration(req: Request, res: Response) {
  const { generationId } = z.object({ generationId: z.uuid() }).parse(req.params)

  res.json(await restoreGeneration(generationId))
}
