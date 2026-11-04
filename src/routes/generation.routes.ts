import { Router } from 'express'

import { postRestoreGeneration } from '../controllers/generation.controller.js'
import { requireAdmin, requireUser } from '../middlewares/auth.middleware.js'

export const generationRouter = Router()

// Admins only: brings back a generation a user deleted, while it can still be restored.
generationRouter.post('/:generationId/restore', requireUser, requireAdmin, postRestoreGeneration)
