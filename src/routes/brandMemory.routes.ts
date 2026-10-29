import { Router } from 'express'

import { postBrandMemory } from '../controllers/brandMemory.controller.js'
import { requireUser } from '../middlewares/auth.middleware.js'

export const brandMemoryRouter = Router()

brandMemoryRouter.post('/', requireUser, postBrandMemory)
