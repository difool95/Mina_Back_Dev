import { env } from '../../config/env.js'
import { VECTORIZE } from '../../lib/constants.js'
import { fingertipsResizedImageUrl } from '../../lib/fingertips/fingertipsLib.js'
import { buildSeo } from '../../lib/mmaSeo/mmaSeoLib.js'
import type { FingertipsRequest } from '../../types/fingertips.types.js'
import { markStatus } from '../mma/mma.service.js'
import { readImage, storeStill } from '../mma/mmaStep4/mmaStillGenerate.service.js'
import { replicateRun } from '../thirdPartyClients/replicate.client.js'
import { startFingertips } from './fingertips.service.js'

//This method starts a vectorization, which is a single call to Replicate's model. It is called by the controller, which has already resolved the userId
//from the verified bearer token. The request has been validated and parsed by the controller, and the userId is known to be valid.
export function startVectorize(userId: string, request: FingertipsRequest) {
  return startFingertips(userId, 'vectorize', request, async (run) => {
    markStatus(run.generationId, 'generating')
    const svgUrl = await replicateRun(VECTORIZE.model, { image: fingertipsResizedImageUrl(env.R2_PUBLIC_BASE_URL, request.imageUrl) })
    run.spend.image = { engine: 'replicate', tool: 'vectorize', model: VECTORIZE.model, usd: VECTORIZE.usd }

    // Replicate's file only lasts an hour: it is copied to R2, with the tag in it.
    const seo = buildSeo({
      reading: null,
      prompt: VECTORIZE.seoText,
      passId: run.passId,
      generationId: run.generationId,
      ratio: request.aspectRatio,
      platform: request.platform,
    })
    // Recraft always answers an SVG; its type is set here rather than trusted from Replicate's
    // header (e.g. "image/svg+xml; charset=utf-8"), which storeStill would not recognise.
    const svg = { ...(await readImage(svgUrl)), contentType: 'image/svg+xml' }
    const { url, provenance } = await storeStill(svg, seo, run.outputPath)

    return { url, seo, provenance }
  })
}

//Vectorize All: the same vectorization on every picture of the carousel, each with its own charge and generation row.
//One after another rather than all at once, so each charge reads the balance the previous one wrote.
export async function startVectorizeAll(
  userId: string,
  { imageUrls, ...request }: Omit<FingertipsRequest, 'imageUrl'> & { imageUrls: string[] },
) {
  const generationIds: string[] = []
  let credits = 0

  for (const imageUrl of imageUrls) {
    const started = await startVectorize(userId, { ...request, imageUrl })
    generationIds.push(started.generationId)
    credits = started.credits
  }

  return { generationIds, credits }
}
