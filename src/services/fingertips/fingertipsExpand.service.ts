import { env } from '../../config/env.js'
import { EXPAND } from '../../lib/constants.js'
import { fingertipsFullSizeImageUrl } from '../../lib/fingertips/fingertipsLib.js'
import type { FingertipsRequest } from '../../types/fingertips.types.js'
import { markStatus } from '../mma/mma.service.js'
import { writeSeo } from '../mma/mmaSeo.service.js'
import { readImage, storeStill } from '../mma/mmaStep4/mmaStillGenerate.service.js'
import { briaEdit } from '../thirdPartyClients/bria.client.js'
import { startFingertips } from './fingertips.service.js'

//This method starts an Expand, which is a single call to Bria's expand: it centers the picture and grows it to the ratio picked in the Expand bar
//(`request.aspectRatio`), generating what was outside it. Same flow as Remove BG: SEO by the SEO writer, PNG copied to R2 with the SEO and Mina's tag.
export function startExpand(userId: string, request: FingertipsRequest) {
  return startFingertips(userId, 'expand', request, async (run) => {
    markStatus(run.generationId, 'generating')
    const resultUrl = await briaEdit('image/edit/expand', {
      // The original size rather than the 2048 px copy, so the expanded picture is as big as Bria allows.
      image: fingertipsFullSizeImageUrl(env.R2_PUBLIC_BASE_URL, request.imageUrl),
      aspect_ratio: request.aspectRatio,
    })
    run.spend.image = { engine: 'bria', tool: 'expand', model: EXPAND.model, usd: EXPAND.usd }

    // The SEO is written by the same SEO writer as a still's (gpt-4o-mini), from Expand's text.
    const { seo, spend: seoSpend } = await writeSeo(run.passId, run.generationId, EXPAND.seoText, request)
    run.spend.seo = seoSpend
    // Bria's file is a PNG; its type is set here rather than trusted from its storage's header.
    const picture = { ...(await readImage(resultUrl)), contentType: 'image/png' }
    const { url, provenance } = await storeStill(picture, seo, run.outputPath)

    return { url, seo, provenance }
  })
}
