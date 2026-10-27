import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'

import type { UploadKind } from '../types/mma/mma.types.js'
import type { PromptFileInputs, PromptFileVars } from '../types/promptFile.types.js'
import { PROMPT_FILE_CIPHER, PROMPT_FILE_PREFIX } from './constants.js'
import { PILLS, plainImage } from './mmaStep1/mmaCreateAssetsLib.js'

/** GCM's nonce and tag lengths, in bytes; both lead the sealed bytes, in that order. */
const IV_BYTES = 12
const TAG_BYTES = 16

/** The studio pill each of MMA's pill hints stands for. */
const KIND_BY_HINT = Object.fromEntries(
  Object.entries(PILLS).map(([kind, { hint }]) => [hint, kind as UploadKind]),
)


export function promptFileInputs(vars: PromptFileVars): PromptFileInputs {
  return {
    brief: vars.inputs?.brief ?? '',
    lane: vars.inputs?.still_lane ?? 'niche',
    platform: vars.inputs?.platform ?? 'tiktok',
    aspectRatio: vars.inputs?.aspect_ratio ?? '9:16',
    uploads: (vars.meta?.create_asset_plan?.items ?? []).map((item) => ({
      kind: KIND_BY_HINT[item.slot_hint]!,
      url: plainImage(item.url),
      origin: item.origin,
    })),
  }
}

/** The text of a `.mina` file: the inputs encrypted under `key`, behind the format's prefix. */
export function sealPromptFile(inputs: PromptFileInputs, key: Buffer) {
  const iv = randomBytes(IV_BYTES)
  const cipher = createCipheriv(PROMPT_FILE_CIPHER, key, iv)
  const sealed = Buffer.concat([cipher.update(JSON.stringify(inputs), 'utf8'), cipher.final()])

  return PROMPT_FILE_PREFIX + Buffer.concat([iv, cipher.getAuthTag(), sealed]).toString('base64')
}

/**
 * The inputs back out of a `.mina` file. Throws on anything this key did not
 * seal, an edited file included: GCM checks the tag before giving anything up,
 * so what comes out is exactly what `sealPromptFile` put in.
 */
export function openPromptFile(file: string, key: Buffer): PromptFileInputs {
  if (!file.startsWith(PROMPT_FILE_PREFIX)) throw new Error('Not a Mina prompt file')

  const bytes = Buffer.from(file.slice(PROMPT_FILE_PREFIX.length), 'base64')
  const decipher = createDecipheriv(PROMPT_FILE_CIPHER, key, bytes.subarray(0, IV_BYTES))
  decipher.setAuthTag(bytes.subarray(IV_BYTES, IV_BYTES + TAG_BYTES))

  return JSON.parse(
    Buffer.concat([decipher.update(bytes.subarray(IV_BYTES + TAG_BYTES)), decipher.final()]).toString('utf8'),
  )
}
