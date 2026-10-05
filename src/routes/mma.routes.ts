import { Router } from 'express'

import { postStillGeneration } from '../controllers/mma.controller.js'
import { requireUser } from '../middlewares/auth.middleware.js'

export const mmaRouter = Router()

mmaRouter.post('/still', requireUser, postStillGeneration)
