import { Router } from 'express'

import { postExpireCredits, postSignupBonus } from '../controllers/credits.controller.js'
import { requireCronSecret, requireUser } from '../middlewares/auth.middleware.js'

export const creditsRouter = Router()

creditsRouter.post('/signup-bonus', requireUser, postSignupBonus)
creditsRouter.post('/expire', requireCronSecret, postExpireCredits)
