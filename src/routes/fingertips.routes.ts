import { Router } from 'express'

import { postTweak } from '../controllers/fingertips.controller.js'
import { requireUser } from '../middlewares/auth.middleware.js'
import { mmaErrorLogger } from '../middlewares/error.middleware.js'

/** The studio's edit tools, one route each. */
export const fingertipsRouter = Router()

fingertipsRouter.post('/tweak', requireUser, postTweak)

// Last, so it sees the error of every edit route above.
fingertipsRouter.use(mmaErrorLogger)
