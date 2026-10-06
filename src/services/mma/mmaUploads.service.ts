import { createHash, randomUUID } from 'node:crypto'

import { env } from '../../config/env.js'
import { R2_UPLOADS_PREFIX, UPLOAD_EXTENSIONS } from '../../lib/constants.js'
import { deleteObject, putObject } from '../r2.service.js'

/** The customer's own R2 folder, named by a hash so their id stays out of public URLs. */
function ownerFolder(userId: string) {
  return `${R2_UPLOADS_PREFIX}/owner_${createHash('md5').update(`pass:user:${userId}`).digest('hex')}`
}

//This method is for storing a picture the user uploaded to the studio. It takes the userId, the raw bytes of the picture, and its content type (MIME type) as parameters.
export function storeStudioImage(userId: string, body: Buffer, contentType: string) {
  const extension = UPLOAD_EXTENSIONS[contentType]
  if (!extension) throw new Error(`Cannot store ${contentType}`)

  return putObject(`${ownerFolder(userId)}/${randomUUID()}.${extension}`, body, contentType)
}

//This method is for deleting a picture the user uploaded to the studio. It takes the userId and the URL of the picture as parameters.
export function deleteStudioImage(userId: string, url: string) {
  const key = url.slice(env.R2_PUBLIC_BASE_URL.length + 1)

  // The whole key, matched exactly: a looser check could be walked out of the
  // user's folder with `..` and delete someone else's file.
  const folder = ownerFolder(userId)
  if (!url.startsWith(`${env.R2_PUBLIC_BASE_URL}/`) || !new RegExp(`^${folder}/[0-9a-f-]{36}\\.(jpg|png|webp)$`).test(key)) {
    throw new Error('Not one of your uploads')
  }

  return deleteObject(key)
}
