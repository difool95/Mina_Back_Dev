import type { Request, Response } from 'express'

import { grantSignupBonus, sweepExpiredCredits } from '../services/credits.service.js'

export async function postSignupBonus(req: Request, res: Response) {
  // requireUser has already resolved this from the verified bearer token.
  res.json(await grantSignupBonus(req.userId!))
}

export async function postExpireCredits(_req: Request, res: Response) {
  res.json(await sweepExpiredCredits())
}
