import express, { Router } from 'express'

import { deleteUpload, postStillGeneration, postUpload } from '../controllers/mma/mma.controller.js'
import { UPLOAD_EXTENSIONS, UPLOAD_MAX_SIZE } from '../lib/constants.js'
import { requireUser } from '../middlewares/auth.middleware.js'
import { mmaErrorLogger } from '../middlewares/error.middleware.js'

export const mmaRouter = Router()

mmaRouter.post('/still', requireUser, postStillGeneration)

//This route is used to upload files to the server. It requires the user to be authenticated and checks that the uploaded file is of a valid type and size.
//The uploaded file is then processed by the postUpload controller function.
mmaRouter.post(
  '/uploads',
  requireUser,
  express.raw({ type: Object.keys(UPLOAD_EXTENSIONS), limit: UPLOAD_MAX_SIZE }),
  postUpload,
)
mmaRouter.delete('/uploads', requireUser, deleteUpload)

// Last, so it sees the error of every MMA route above.
mmaRouter.use(mmaErrorLogger)
