import { Router } from 'express'

import { postSignupBonus } from '../controllers/credits.controller.js'
import { requireUser } from '../middlewares/auth.middleware.js'

export const creditsRouter = Router()

creditsRouter.post('/signup-bonus', requireUser, postSignupBonus)
