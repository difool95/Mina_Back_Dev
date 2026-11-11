import { env } from '../../config/env.js'
import { NO_BACKGROUND } from '../../lib/constants.js'
import { fingertipsResizedImageUrl } from '../../lib/fingertips/fingertipsLib.js'
import type { FingertipsRequest } from '../../types/fingertips.types.js'
import { markStatus } from '../mma/mma.service.js'
import { writeSeo } from '../mma/mmaSeo.service.js'
import { readImage, storeStill } from '../mma/mmaStep4/mmaStillGenerate.service.js'
import { briaEdit } from '../thirdPartyClients/bria.client.js'
import { startFingertips } from './fingertips.service.js'

//This method starts a Remove BG, which is a single call to Bria's remove_background: it cuts the subject out on a transparent background.
//Same flow as Remove Subject: the SEO is written by the SEO writer, and the PNG is copied to R2 with the SEO and Mina's tag written in.
export function startNoBackground(userId: string, request: FingertipsRequest) {
  return startFingertips(userId, 'no_background', request, async (run) => {
    markStatus(run.generationId, 'generating')
    const resultUrl = await briaEdit('image/edit/remove_background', {
      image: fingertipsResizedImageUrl(env.R2_PUBLIC_BASE_URL, request.imageUrl),
      preserve_alpha: true,
    })
    run.spend.image = { engine: 'bria', tool: 'no_background', model: NO_BACKGROUND.model, usd: NO_BACKGROUND.usd }

    // The SEO is written by the same SEO writer as a still's (gpt-4o-mini), from Remove BG's text.
    const { seo, spend: seoSpend } = await writeSeo(run.passId, run.generationId, NO_BACKGROUND.seoText, request)
    run.spend.seo = seoSpend
    // Bria's file is a PNG (with its transparency); its type is set here rather than trusted from its storage's header.
    const picture = { ...(await readImage(resultUrl)), contentType: 'image/png' }
    const { url, provenance } = await storeStill(picture, seo, run.outputPath)

    return { url, seo, provenance }
  })
}

//Remove all BG: the same Remove BG on every picture of the carousel, each with its own charge and generation row.
//One after another rather than all at once, so each charge reads the balance the previous one wrote.
export async function startNoBackgroundAll(
  userId: string,
  { imageUrls, ...request }: Omit<FingertipsRequest, 'imageUrl'> & { imageUrls: string[] },
) {
  const generationIds: string[] = []
  let credits = 0

  for (const imageUrl of imageUrls) {
    const started = await startNoBackground(userId, { ...request, imageUrl })
    generationIds.push(started.generationId)
    credits = started.credits
  }

  return { generationIds, credits }
}
