import type { Request, Response } from 'express'
import { z } from 'zod'

import {
  createBillingPortalSession,
  createCheckoutSession,
  fulfillWebhookEvent,
} from '../services/stripe.service.js'

const sessionBody = z.object({
  matchas: z.number().int().positive(),
  currency: z.enum(['GBP', 'EUR', 'AED', 'USD']),
})

export async function postCheckoutSession(req: Request, res: Response) {
  const { matchas, currency } = sessionBody.parse(req.body)

  // requireUser has already resolved this from the verified bearer token.
  res.json(await createCheckoutSession(req.userId!, matchas, currency))
}

export async function postBillingPortal(req: Request, res: Response) {
  res.json(await createBillingPortalSession(req.userId!))
}

export async function postCheckoutWebhook(req: Request, res: Response) {
  const signature = req.get('stripe-signature')
  if (!signature) {
    res.status(400).json({ error: 'Missing stripe-signature header' })
    return
  }

// The webhook is the only route that needs the raw body, so it can verify the signature. The rest of the app uses express.json().
  await fulfillWebhookEvent(req.body, signature)
  res.json({ received: true })
}
