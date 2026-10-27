import type { AspectRatio, CreateAssetItem, MmaPlatform, StillLane, StudioUpload } from './mma/mma.types.js'

/**
 * What a `.mina` prompt file carries, sealed: the studio as it stood when the
 * generation was made, so anyone who drops it on their studio gets it back.
 */
export interface PromptFileInputs {
  brief: string
  lane: StillLane
  platform: MmaPlatform
  aspectRatio: AspectRatio
  uploads: StudioUpload[]
}

/** The slice of a generation's `mg_mma_vars` a prompt file is made from. Older rows may lack any of it. */
export interface PromptFileVars {
  inputs?: {
    brief?: string
    still_lane?: StillLane
    platform?: MmaPlatform
    aspect_ratio?: AspectRatio
  }
  meta?: {
    create_asset_plan?: { items?: Pick<CreateAssetItem, 'url' | 'slot_hint' | 'origin'>[] }
  }
}
