import { createHash, createHmac } from 'node:crypto'

import { env } from '../config/env.js'

const sha256 = (data: string | Buffer) => createHash('sha256').update(data).digest('hex')
const hmac = (key: string | Buffer, data: string) => createHmac('sha256', key).update(data).digest()

/**
 * Stores a file in the R2 bucket and returns its public URL.
 *
 * R2 speaks the S3 API, which wants every request signed with AWS Signature
 * V4. That is the dozen lines below rather than the whole AWS SDK, for the
 * one call this API makes.
 */
export async function putObject(key: string, body: Buffer, contentType: string) {
  const host = `${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
  const path = `/${env.R2_BUCKET}/${key}`
  const amzDate = new Date().toISOString().replace(/[-:]|\.\d{3}/g, '')
  const scope = `${amzDate.slice(0, 8)}/auto/s3/aws4_request`
  const payloadHash = sha256(body)

  // Sorted by name, as the signature requires. fetch sends Host itself.
  const signed = { 'content-type': contentType, host, 'x-amz-content-sha256': payloadHash, 'x-amz-date': amzDate }
  const signedHeaders = Object.keys(signed).join(';')
  const canonicalRequest = [
    'PUT',
    path,
    '',
    ...Object.entries(signed).map(([name, value]) => `${name}:${value}`),
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
    method: 'PUT',
    headers: {
      'content-type': contentType,
      'x-amz-content-sha256': payloadHash,
      'x-amz-date': amzDate,
      authorization: `AWS4-HMAC-SHA256 Credential=${env.R2_ACCESS_KEY_ID}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
    },
    body,
  })

  if (!response.ok) throw new Error(`R2 upload failed (${response.status}): ${await response.text()}`)

  return `${env.R2_PUBLIC_BASE_URL}/${key}`
}
