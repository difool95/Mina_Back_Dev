import { randomUUID } from 'node:crypto'

import { env } from '../../config/env.js'
import { ERASE, FINGERTIPS_MASK_FOLDER, R2_FINGERTIPS_PREFIX } from '../../lib/constants.js'
import { fingertipsResizedImageUrl } from '../../lib/fingertips/fingertipsLib.js'
import type { EraseRequest } from '../../types/fingertips.types.js'
import { markStatus } from '../mma/mma.service.js'
import { writeSeo } from '../mma/mmaSeo.service.js'
import { readImage, storeStill } from '../mma/mmaStep4/mmaStillGenerate.service.js'
import { putObject } from '../r2.service.js'
import { briaEdit } from '../thirdPartyClients/bria.client.js'
import { startFingertips } from './fingertips.service.js'

//This method starts an Erase, which is a single call to Bria's erase: it erases what the mask's white covers and fills its place.
//The mask, drawn in the browser from the user's areas, goes on R2 first, so Bria can read it and the generation row can point to it (`inputs.mask_image`).
//Then the same flow as Remove BG: SEO by the SEO writer, PNG copied to R2 with the SEO and Mina's tag.
export async function startErase(userId: string, { mask, ...request }: EraseRequest) {
  const maskUrl = await putObject(
    `${R2_FINGERTIPS_PREFIX}/${FINGERTIPS_MASK_FOLDER}/${randomUUID()}_mask_image.png`,
    // The data URL's base64, after its "data:image/png;base64," head.
    Buffer.from(mask.slice(mask.indexOf(',') + 1), 'base64'),
    'image/png',
  )

  return startFingertips(userId, 'eraser', { ...request, maskUrl }, async (run) => {
    markStatus(run.generationId, 'generating')
    const resultUrl = await briaEdit('image/edit/erase', {
      image: fingertipsResizedImageUrl(env.R2_PUBLIC_BASE_URL, request.imageUrl),
      mask: maskUrl,
    })
    run.spend.image = { engine: 'bria', tool: 'eraser', model: ERASE.model, usd: ERASE.usd }

    // The SEO is written by the same SEO writer as a still's (gpt-4o-mini), from Erase's text.
    const { seo, spend: seoSpend } = await writeSeo(run.passId, run.generationId, ERASE.seoText, request)
    run.spend.seo = seoSpend
    // Bria's file is a PNG; its type is set here rather than trusted from its storage's header.
    const picture = { ...(await readImage(resultUrl)), contentType: 'image/png' }
    const { url, provenance } = await storeStill(picture, seo, run.outputPath)

    return { url, seo, provenance }
  })
}
