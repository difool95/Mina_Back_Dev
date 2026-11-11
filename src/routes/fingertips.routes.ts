import { Router } from 'express'

import { postNoBackground, postNoSubject, postNoSubjectAll, postTweak, postVectorize, postVectorizeAll } from '../controllers/fingertips.controller.js'
import { requireUser } from '../middlewares/auth.middleware.js'
import { mmaErrorLogger } from '../middlewares/error.middleware.js'

/** The studio's edit tools, one route each. */
export const fingertipsRouter = Router()

fingertipsRouter.post('/tweak', requireUser, postTweak)
fingertipsRouter.post('/vectorize', requireUser, postVectorize)
fingertipsRouter.post('/vectorize-all', requireUser, postVectorizeAll)
fingertipsRouter.post('/no-subject', requireUser, postNoSubject)
fingertipsRouter.post('/no-subject-all', requireUser, postNoSubjectAll)
fingertipsRouter.post('/no-background', requireUser, postNoBackground)

// Last, so it sees the error of every edit route above.
fingertipsRouter.use(mmaErrorLogger)
