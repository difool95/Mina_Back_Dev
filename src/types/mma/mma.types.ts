/** Where the output is meant to go, read off the ratio the user picked in the studio. */
export type MmaPlatform = 'tiktok' | 'instagram-post' | 'print' | 'square'

/** The "+" pill a picture was added under. Same as the frontend's. */
export type UploadKind = 'scene' | 'logo' | 'product'

/**
 * One picture from the studio, in the order it was added, already on R2:
 * uploaded when the user picked it, or a scene library pick. The frontend's
 * type adds its upload progress on top.
 */
export interface StudioUpload {
  kind: UploadKind
  url: string
  origin: 'upload' | 'scene_library'
}

export interface StillGenerationRequest {
  /** The browser tab's studio session; a new one means a new "Mina Studio session" row. */
  studioSessionId: string
  platform: MmaPlatform
  isCreative: boolean
  /** What the user typed, the locked strip on its last line. */
  brief: string
  uploads: StudioUpload[]
  ip: string
  userAgent: string
}

export interface StillGenerationResult {
  generationId: string
  credits: number
}

/** How MMA names the pill a picture came in under; the product pill is `featured_asset`. */
export type PillHint = 'scene' | 'logo' | 'featured_asset'

export type Presence = 'present' | 'absent' | 'unknown'

export type CreateStrategy = 'scene_edit' | 'reference_synthesis' | 'prompt_composition'

export type AssetJob =
  | 'base_scene'
  | 'identity_reference'
  | 'brand_overlay'
  | 'insert_element'
  | 'composition_reference'
  | 'aesthetic_reference'
  | 'ignore'

export type BackgroundPolicy = 'use_as_scene' | 'extract_subject' | 'ignore_background' | 'preserve_flat_background'

export type ColorPolicy = 'preserve_identity_color' | 'adapt_to_scene_grade' | 'explicit_recolor'

/** One picture as MMA step 1 receives it, stored with its R2 URL. */
export interface InventoryItem {
  url: string
  name: string
  /** 1-based, in the order the pictures were added. */
  index: number
  origin: 'scene_library' | 'upload'
  memory_id: null
  pill_hint: PillHint
}

/** Production facts about the requested final image, as the Create Asset Director reads them. */
export interface ProductionProfile {
  visual_register: string
  format: string
  capture_device: string
  subjects: string[]
  physical_realism: string
  safety_scope: {
    real_person: Presence
    visible_face: Presence
    body_part_without_face: Presence
    sensitive_context: Presence
  }
  human_safety_scope: string[]
  confidence: number
  rationale: string
}

//THIS IS THE CONTENT OF THE RAW IN THE MG_PAYLOAD COLUMN OF THE MEGA_GENERATIONS TABLE. IT IS THE RAW RESPONSE FROM CLAUDE.
export interface CreateAssetPlan {
  strategy: CreateStrategy
  summary: string
  preserve_scene: boolean
  base_scene_person: Presence
  person_recast: boolean
  target_output_medium: string
  production_profile: ProductionProfile
  items: {
    index: number
    semantic_type: string
    job: AssetJob
    use_in_generation: boolean
    confidence: number
    presentation: string
    background_policy: BackgroundPolicy
    color_policy: ColorPolicy
    integration_notes: string
    reason: string
  }[]
}

/** One picture in step 1's output: its inventory entry merged with the Director's reading of it. */
export interface CreateAssetItem {
  job: AssetJob
  url: string
  name: string
  index: number
  origin: InventoryItem['origin']
  reason: string
  asset_id: string
  /** Only on a scene library picture. */
  template?: true
  memory_id: null
  slot_hint: PillHint
  confidence: number
  default_job: AssetJob
  description: string
  color_policy: ColorPolicy
  presentation: string
  semantic_hint: string
  semantic_type: string
  selection_source: null
  background_policy: BackgroundPolicy
  integration_notes: string
  use_in_generation: boolean
}

/** The asset plan step 1 hands to the steps after it. */
export interface CreateAssetOutput {
  items: CreateAssetItem[]
  model: string
  schema: string
  source: 'no_assets' | 'vision_intent_classifier'
  summary: string
  strategy: CreateStrategy
  color_intent: { global_scene_grade: boolean; explicit_asset_color: boolean }
  person_recast: { active: boolean; reason: string }
  preserve_scene: boolean
  used_memory_ids: string[]
  unused_memory_ids: string[]
  production_profile: ProductionProfile
  target_output_medium: string
  uncertain_memory_ids: string[]
}

/** `mg_payload` of MMA step 1 (`create_asset_intelligence`). */
export interface CreateAssetPayload {
  /** The tool input exactly as Claude returned it, serialised. */
  raw: string | null
  error: string | null
  input: { inventory: InventoryItem[]; user_brief: string }
  usage: {
    model: string
    stop_reason: string | null
    input_tokens: number
    output_tokens: number
    cache_read_input_tokens: number
    cache_creation_input_tokens: number
  } | null
  output: CreateAssetOutput | null
  timing: { started_at: string; ended_at: string; duration_ms: number }
  /** What was sent to Claude, images included, plus how it was routed and cached. */
  request: Record<string, unknown> | null
  provider: { name: 'anthropic'; stop_reason: string | null } | null
}
