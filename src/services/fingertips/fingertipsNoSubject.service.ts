import { env } from '../../config/env.js'
import { NO_SUBJECT } from '../../lib/constants.js'
import { fingertipsResizedImageUrl } from '../../lib/fingertips/fingertipsLib.js'
import type { FingertipsRequest } from '../../types/fingertips.types.js'
import { markStatus } from '../mma/mma.service.js'
import { writeSeo } from '../mma/mmaSeo.service.js'
import { readImage, storeStill } from '../mma/mmaStep4/mmaStillGenerate.service.js'
import { briaEdit } from '../thirdPartyClients/bria.client.js'
import { startFingertips } from './fingertips.service.js'

//This method starts a Remove Subject, which is a single call to Bria's erase_foreground: it erases the main subject of the picture and fills its place.
//Same flow as Vectorize, except that the SEO is written by the SEO writer; it is copied to R2 with the SEO and Mina's tag written in.
export function startNoSubject(userId: string, request: FingertipsRequest) {
  return startFingertips(userId, 'no_subject', request, async (run) => {
    markStatus(run.generationId, 'generating')
    const resultUrl = await briaEdit('image/edit/erase_foreground', {
      image: fingertipsResizedImageUrl(env.R2_PUBLIC_BASE_URL, request.imageUrl),
      preserve_alpha: true,
    })
    run.spend.image = { engine: 'bria', tool: 'no_subject', model: NO_SUBJECT.model, usd: NO_SUBJECT.usd }

    // The SEO is written by the same SEO writer as a still's (gpt-4o-mini), from Remove Subject's text.
    const { seo, spend: seoSpend } = await writeSeo(run.passId, run.generationId, NO_SUBJECT.seoText, request)
    run.spend.seo = seoSpend
    // Bria's file is a PNG; its type is set here rather than trusted from its storage's header.
    const picture = { ...(await readImage(resultUrl)), contentType: 'image/png' }
    const { url, provenance } = await storeStill(picture, seo, run.outputPath)

    return { url, seo, provenance }
  })
}
