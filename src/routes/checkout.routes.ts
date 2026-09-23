import express, { Router } from 'express'

import { postBillingPortal, postCheckoutSession, postCheckoutWebhook } from '../controllers/checkout.controller.js'
import { requireUser } from '../middlewares/auth.middleware.js'

export const checkoutRouter = Router()

// Stripe signs the exact request bytes, so this route needs the raw body
// rather than the app-wide express.json() — that's also why this whole
// router is mounted ahead of that global parser in app.ts.
checkoutRouter.post('/webhook', express.raw({ type: 'application/json' }), postCheckoutWebhook)
checkoutRouter.post('/session', express.json(), requireUser, postCheckoutSession)
checkoutRouter.post('/portal', requireUser, postBillingPortal)
