import { Router } from 'express'

import { postPromptFileExport, postPromptFileImport } from '../controllers/promptFile.controller.js'
import { requireUser } from '../middlewares/auth.middleware.js'

export const promptFileRouter = Router()

// Exporting is for a generation's owner; importing for anyone signed in.
promptFileRouter.post('/export', requireUser, postPromptFileExport)
promptFileRouter.post('/import', requireUser, postPromptFileImport)
