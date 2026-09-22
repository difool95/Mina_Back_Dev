import type { Request, Response } from 'express'
import { z } from 'zod'

import { createCheckoutSession, fulfillWebhookEvent } from '../services/stripe.service.js'

const sessionBody = z.object({
  matchas: z.number().int().positive(),
  currency: z.enum(['GBP', 'EUR', 'AED', 'USD']),
})

export async function postCheckoutSession(req: Request, res: Response) {
  const { matchas, currency } = sessionBody.parse(req.body)

  // requireUser has already resolved this from the verified bearer token.
  res.json(await createCheckoutSession(req.userId!, matchas, currency))
}

export async function postCheckoutWebhook(req: Request, res: Response) {
  const signature = req.get('stripe-signature')
  console.log('signature', signature);
  if (!signature) {
    res.status(400).json({ error: 'Missing stripe-signature header' })
    return
  }

  // `req.body` is the raw `Buffer` express.raw() left it as — Stripe verifies
  // the signature against those exact bytes.
  await fulfillWebhookEvent(req.body, signature)
  res.json({ received: true })
}
