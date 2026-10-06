import { createHash, createHmac } from 'node:crypto'

import { env } from '../config/env.js'

const sha256 = (data: string | Buffer) => createHash('sha256').update(data).digest('hex')
const hmac = (key: string | Buffer, data: string) => createHmac('sha256', key).update(data).digest()

//This method is for making requests to the R2 storage service. It takes the HTTP method (PUT or DELETE), the key of the object to be stored or deleted,
// and an optional file object containing the body and content type of the file to be stored, and signs the request with the appropriate AWS signature.
async function r2Request(method: 'PUT' | 'DELETE', key: string, file?: { body: Buffer; contentType: string }) {
  const host = `${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
  const path = `/${env.R2_BUCKET}/${key}`
  const amzDate = new Date().toISOString().replace(/[-:]|\.\d{3}/g, '')
  const scope = `${amzDate.slice(0, 8)}/auto/s3/aws4_request`
  const payloadHash = sha256(file?.body ?? '')

  // Sorted by name, as the signature requires. fetch sends Host itself.
  const sent = {
    ...(file && { 'content-type': file.contentType }),
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': amzDate,
  }
  const signed = Object.entries({ ...sent, host }).sort(([a], [b]) => a.localeCompare(b))
  const signedHeaders = signed.map(([name]) => name).join(';')
  const canonicalRequest = [
    method,
    path,
    '',
    ...signed.map(([name, value]) => `${name}:${value}`),
    '',
    signedHeaders,
    payloadHash,
  ].join('\n')
  const signingKey = ['auto', 's3', 'aws4_request'].reduce(
    hmac,
    hmac(`AWS4${env.R2_SECRET_ACCESS_KEY}`, amzDate.slice(0, 8)),
  )
  const signature = createHmac('sha256', signingKey)
    .update(['AWS4-HMAC-SHA256', amzDate, scope, sha256(canonicalRequest)].join('\n'))
    .digest('hex')

  const response = await fetch(`https://${host}${path}`, {
    method,
    headers: {
      ...sent,
      authorization: `AWS4-HMAC-SHA256 Credential=${env.R2_ACCESS_KEY_ID}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
    },
    ...(file && { body: file.body }),
  })

  if (!response.ok) throw new Error(`R2 ${method} failed (${response.status}): ${await response.text()}`)
}

/** Stores a file in the R2 bucket and returns its public URL. */
export async function putObject(key: string, body: Buffer, contentType: string) {
  await r2Request('PUT', key, { body, contentType })

  return `${env.R2_PUBLIC_BASE_URL}/${key}`
}

export function deleteObject(key: string) {
  return r2Request('DELETE', key)
}
