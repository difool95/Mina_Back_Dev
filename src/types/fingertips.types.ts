import type { AspectRatio, MmaPlatform, MmaProvenance, MmaSeo, MmaSpend, StillLane } from './mma/mma.types.js'

/** An edit tool of the studio's right panel, by its `mg_mma_vars.modelKey`. Tweak, Vectorize and Remove Subject so far. */
export type FingertipsTool = 'tweak' | 'vectorize' | 'no_subject' | 'no_background' | 'expand' | 'eraser'

/** What every edit tool is sent: the picture, and the lane that prices and renders it. */
export interface FingertipsRequest {
  /** The picture being edited, on our R2. */
  imageUrl: string
  lane: StillLane
  /** The ratio pill's, for the SEO's `ratio` and `platform` only: the edit keeps the picture's own shape. */
  aspectRatio: AspectRatio
  platform: MmaPlatform
  /** Erase only: its mask on R2, kept in `mg_mma_vars.inputs.mask_image`. */
  maskUrl?: string
}

export interface EraseRequest extends FingertipsRequest {
  /** The mask drawn in the browser, as a PNG data URL: white is erased, black is kept. */
  mask: string
}

export interface TweakRequest extends FingertipsRequest {
  /** What the user asked to change. */
  brief: string
}

/** The `mg_mma_vars` of an edit tool's generation: its input picture, never its output. */
export interface FingertipsMmaVars {
  assets: { product_image_url: string }
  inputs: { image: string; preserve_alpha: boolean; mask_image?: string }
  modelKey: FingertipsTool
}

/** What a tool's own work hands back to the shared code, which finishes the generation row with it. */
export interface FingertipsOutput {
  url: string
  seo: MmaSeo
  provenance: MmaProvenance
}

/** Passed to a tool's work: who it is for, and the paid calls it adds up as they return. */
export interface FingertipsRun {
  passId: string
  generationId: string
  spend: MmaSpend
  /** Where the result goes on R2, without its extension: `fingertips/<tool>/<generationId>`. */
  outputPath: string
}

/** What Tweak's prompter answers. */
export interface TweakPrompterAnswer {
  clean_prompt: string
  negative_prompt: string
}
