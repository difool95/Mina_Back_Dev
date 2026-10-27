import type { Request, Response } from 'express'
import { z } from 'zod'

import { exportPromptFile, importPromptFile } from '../services/promptFile.service.js'

export async function postPromptFileExport(req: Request, res: Response) {
  const { generationId } = z.object({ generationId: z.uuid() }).parse(req.body)

  // requireUser has already resolved this from the verified bearer token.
  res.json({ file: await exportPromptFile(req.userId!, generationId) })
}

export function postPromptFileImport(req: Request, res: Response) {
  const { file } = z.object({ file: z.string() }).parse(req.body)

  res.json(importPromptFile(file))
}
