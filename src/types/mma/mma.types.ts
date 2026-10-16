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

/** The ratio on the studio's ratio pill, landscape flip included. Same as the frontend's. */
export type AspectRatio = '9:16' | '16:9' | '3:4' | '4:3' | '2:3' | '3:2' | '1:1'

export interface StillGenerationRequest {
  /** The browser tab's studio session; a new one means a new "Mina Studio session" row. */
  studioSessionId: string
  platform: MmaPlatform
  aspectRatio: AspectRatio
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

/** When an MMA step ran, as every step's payload records it. */
export interface StepTiming {
  started_at: string
  ended_at: string
  duration_ms: number
}

/** The tokens one MMA call to Claude spent. */
export interface ClaudeUsage {
  model: string
  stop_reason: string | null
  input_tokens: number
  output_tokens: number
  cache_read_input_tokens: number
  cache_creation_input_tokens: number
}

export interface ClaudeProvider {
  name: 'anthropic'
  stop_reason: string | null
}

/** `mg_payload` of MMA step 1 (`create_asset_intelligence`). */
export interface CreateAssetPayload {
  /** The tool input exactly as Claude returned it, serialised. */
  raw: string | null
  error: string | null
  input: { inventory: InventoryItem[]; user_brief: string }
  usage: ClaudeUsage | null
  output: CreateAssetOutput | null
  timing: StepTiming
  /** What was sent to Claude, images included, plus how it was routed and cached. */
  request: Record<string, unknown> | null
  provider: ClaudeProvider | null
}

/** The studio's Create lane switch: Niche or Creative. */
export type StillLane = 'niche' | 'creative'

/** One structured fact test in the knowledge router catalog. */
export interface KnowledgeCondition {
  fact: string
  op: 'eq' | 'in' | 'includes_any'
  value: unknown
}

/** One guide of `knowledge-router-catalog.json`: its file, and the facts it applies to. */
export interface KnowledgeGuide {
  key: string
  title: string
  file: string
  media: string[]
  phases: string[]
  kind: string
  specialized: boolean
  include_reason: string
  /** Every condition of `all` must hold, and one branch of `any_of` when there is any. */
  match: { all?: KnowledgeCondition[]; any_of?: { all: KnowledgeCondition[] }[] }
}

export interface KnowledgeCatalog {
  schema: string
  version: number
  description: string
  guides: KnowledgeGuide[]
}

/** A catalog guide with its file read in. */
export interface KnowledgeDoc extends KnowledgeGuide {
  content: string
  chars: number
  tokens: number
  content_hash: string
}

/** The production facts MMA step 2 routes on, built from step 1's asset plan. */
export interface KnowledgeFacts {
  media: 'image'
  phase: 'image_prompt'
  engine: string
  audio_mode: 'muted'
  camera_plan: false
  target_format: string
  source_faithful: boolean
  target_subjects: string[]
  human_safety_scope: string[]
  target_audio_nature: 'unknown'
  target_output_medium: string
  target_capture_device: string
  target_visual_register: string
  /** Null when step 1 could not tell. */
  requires_physical_realism: boolean | null
}

/** Whether a fact was given to step 2, or is one the catalog uses and step 2 filled in as `unknown`. */
export type FactSource = 'facts' | 'missing'

/** A guide's media or phase gate, checked against the facts. */
export interface GateEvidence {
  fact: 'media' | 'phase'
  actual: unknown
  source: FactSource
  matched: boolean
  expected: string[]
}

/** One condition of a guide, checked against the facts. */
export interface FactEvidence {
  fact: string
  /** `all`, or `any_of_<n>` for the branch it belongs to. */
  group: string
  actual: unknown
  source: FactSource
  matched: boolean
  expected: unknown
  operator: KnowledgeCondition['op']
}

export type KnowledgeReasonCode =
  | 'included'
  | 'media_gate_failed'
  | 'phase_gate_failed'
  | 'required_fact_mismatch'
  | 'no_positive_target_match'

/** One catalog guide, as step 2 judged it. */
export interface KnowledgeCandidate {
  key: string
  kind: string
  chars: number
  title: string
  reason: string
  status: 'included' | 'excluded'
  tokens: number
  decision: 'include' | 'exclude'
  evidence: {
    media: GateEvidence
    phase: GateEvidence
    any_of: { index: number; matched: boolean; evidence: FactEvidence[] }[]
    required: FactEvidence[]
  }
  included: boolean
  sent_ready: boolean
  reason_code: KnowledgeReasonCode
  specialized: boolean
  token_count: number
  content_hash: string
  token_estimate_method: 'ceil_chars_div_4'
}

/** A guide step 2 picked, as its output lists it. */
export interface KnowledgeSelection {
  key: string
  chars: number
  title: string
  tokens: number
}

/** Step 2's receipt: every guide it weighed, and why each was or was not picked. */
export interface KnowledgeRoute {
  facts: Record<string, unknown>
  method: string
  schema: string
  catalog: { file: string; hash: string; schema: string; version: number }
  sent_keys: string[]
  candidates: KnowledgeCandidate[]
  catalog_hash: string
  fact_sources: Record<string, FactSource>
  selected_keys: string[]
  router_version: string
  sent_ready_docs: (KnowledgeSelection & { sent_ready: true; token_count: number; content_hash: string })[]
  normalized_facts: Record<string, unknown>
  unrecognized_values: Record<string, unknown>
  selected_token_count: number
  total_context_tokens: number
  ignored_legacy_inputs: Record<string, boolean>
}

/** `mg_payload` of MMA step 2 (`knowledge_files`). */
export interface KnowledgeFilesPayload {
  error: null
  input: { lane: StillLane; mode: 'create'; facts: KnowledgeFacts }
  output: { route: KnowledgeRoute; method: string; selected: KnowledgeSelection[] }
  timing: StepTiming
}

/** One picture step 3 sends to Claude, numbered in the order it is sent. */
export type ImageOrderItem = { image: number } & Pick<
  CreateAssetItem,
  'semantic_type' | 'job' | 'name' | 'presentation' | 'background_policy' | 'color_policy' | 'integration_notes' | 'reason'
>

/** A picture that goes into the image, as opposed to the base scene. */
export type FeaturedAsset = Pick<
  CreateAssetItem,
  'name' | 'description' | 'semantic_type' | 'presentation' | 'background_policy' | 'color_policy' | 'integration_notes'
>

/** What step 3 tells Claude about the generation, in the order Claude reads it. */
export interface StillPrompterInput {
  user_brief: string
  style: string
  preferences: Record<string, unknown>
  hard_blocks: string[]
  create_strategy: CreateStrategy
  preserve_scene: boolean
  asset_plan_summary: string
  scene_edit_contract: string
  person_recast: CreateAssetOutput['person_recast']
  person_recast_contract: string
  image_order_for_ai: ImageOrderItem[]
  featured_assets: FeaturedAsset[]
  notes: string
  knowledge_guides: { key: string; title: string }[]
}

/** One guide's line of the knowledge receipt, as Claude reports it. */
export interface ReportedReceipt {
  key: string
  applied: boolean
  lesson: string
  guide_evidence: string
  prompt_evidence: string
}

/** Claude's answer to step 3. */
export interface StillPrompterAnswer {
  clean_prompt: string
  negative_prompt: string
  /** Owed on every answer, but nothing makes Claude send it. */
  knowledge_receipt?: ReportedReceipt[]
}

/** A receipt line once its evidence has been looked for in the guide and in the prompt. */
export interface VerifiedReceipt extends ReportedReceipt {
  title: string
  valid: boolean
  verification: 'exact_guide_and_prompt_evidence' | 'missing_receipt' | 'reported_not_applied' | 'evidence_not_verified'
  reported_applied: boolean
  evidence_verified: boolean
  guide_evidence_verified: boolean
  guide_evidence_substantive: boolean
  prompt_evidence_substantive: boolean
}

export interface StillPrompterOutput {
  debug: StillPrompterAnswer
  parsed_ok: true
  /** The prompt step 4 renders. */
  clean_prompt: string
  knowledge_receipt: VerifiedReceipt[]
  /** Claude's prompt with its negatives appended, before the scene-edit lock goes in front. */
  prompter_clean_prompt: string
}

/** A picture step 3 sent, with the caption Claude read just ahead of it. */
export interface LabeledImage {
  url: string
  note: string
  role: string
}

/** `mg_payload` of MMA step 3 (`gpt_still_one_shot`). */
export interface StillPrompterPayload {
  /** A short preview of the context; the whole of it is in `request.system`. */
  ctx: string
  /** Claude's answer exactly as it came. */
  raw: string | null
  error: string | null
  input: StillPrompterInput
  usage: ClaudeUsage | null
  output: StillPrompterOutput | null
  timing: StepTiming
  request: Record<string, unknown> | null
  provider: ClaudeProvider | null
  labeledImages: LabeledImage[]
}

/** What MMA step 4 sends both image engines, whichever lane renders. */
interface StillGenerateInputBase {
  model: string
  /** Step 3's prompt with the sparkle suppression line appended. */
  prompt: string
  /** The CDN URLs of the pictures step 1 kept, in the order step 3 sent them. */
  image_input: string[]
  aspect_ratio: AspectRatio
  output_format: 'png'
}

/** `mg_payload` of MMA step 4 on the Niche lane (`nanobanana_generate`). */
export interface NanoBananaPayload {
  error: string | null
  input: StillGenerateInputBase & {
    provider: 'gemini'
    resolution: '4K'
    image_search: false
    google_search: false
    response_modalities: ['IMAGE']
  }
  /** The generated picture on R2. */
  output: string | null
  timing: StepTiming
  provider: { gemini: { model: string } }
}

/** `mg_payload` of MMA step 4 on the Creative lane (`gpt_image_2_generate`). */
export interface GptImagePayload {
  error: string | null
  input: StillGenerateInputBase & {
    /** `WIDTHxHEIGHT`, sized for about 2K. */
    size: string
    quality: 'max'
    provider: 'openai'
    background: 'auto'
    moderation: 'low'
  }
  output: string | null
  timing: StepTiming
  provider: { openai: { size: string; model: string; quality: string; usage: GptImageUsage | null } }
}

/** A picture as bytes: an input read off the CDN for an image engine, or the picture an engine generated. */
export interface ImageFile {
  bytes: Buffer
  contentType: string
}
//THIS IS THE RETURNED SENTENCE AND KEYWORDS FROM THE SEO READER USING GPT-4O-MINI. IT IS USED TO BUILD THE MmaSeo OBJECT.
export interface SeoReading {
  sentence: string
  keywords: string[]
}

/** `mg_meta.seo` of a generation: its search text, Mina's credit, and who made it. */
export interface MmaSeo {
  alt: string
  description: string
  keywords: string[]
  source: string
  generator: 'Mina'
  /** `vision` when gpt-4o-mini wrote the sentence, `prompt` when it came from the cleaned prompt instead. */
  decidedBy: 'vision' | 'prompt' | 'template'
  trace: {
    ratio: AspectRatio
    medium: 'image'
    source: string
    account: string
    platform: MmaPlatform
    site_url: string
    generator: 'Mina'
    brand_line: string
    attribution: string
    ai_generated: true
    duration_sec: null
    generation_id: string
    digital_source_type: 'trainedAlgorithmicMedia'
  }
  schema: {
    '@type': 'ImageObject'
    creator: { url: string; name: 'Mina'; '@type': 'Organization' }
    '@context': 'https://schema.org'
    keywords: string
    creditText: string
    description: string
    copyrightNotice: string
    acquireLicensePage: string
  }
}

/** `mg_meta.provenance`: whether the SEO and Mina's credit were written into the picture before it went to R2. */
export interface MmaProvenance {
  url: string
  reason: string
  embedded: boolean
  attempted_at: string
}

/** The tokens one OpenAI chat call spent (the SEO writer's). */
export interface OpenAiChatUsage {
  prompt_tokens: number
  completion_tokens: number
  prompt_tokens_details?: { cached_tokens?: number }
}

/** The tokens one GPT Image call spent, as OpenAI reports them. */
export interface GptImageUsage {
  input_tokens: number
  output_tokens: number
  total_tokens?: number
  input_tokens_details?: { text_tokens?: number; image_tokens?: number }
  output_tokens_details?: { text_tokens?: number; image_tokens?: number }
}

/** The tokens one Gemini call spent, from its `usageMetadata`. */
export interface GeminiUsage {
  promptTokenCount?: number
  candidatesTokenCount?: number
  thoughtsTokenCount?: number
  candidatesTokensDetails?: { modality: string; tokenCount: number }[]
}

/** Every paid call a generation made so far, filled in as the steps run: what `mg_cost_data` is priced from. */
export interface MmaSpend {
  //It has the claude Usage for the step 1 and step 3.
  claude: ClaudeUsage[]
  //It has the seo Usage when we created the field "mg_meta" for the generation.
  seo: { model: string; usage: OpenAiChatUsage } | null
  //It has the image Usage when we created the picture of the generation, it can be from nanobanana or openai.
  image:
    | { engine: 'nanobanana'; model: string; usage: GeminiUsage }
    | { engine: 'openai'; model: string; size: string; usage: GptImageUsage }
    | null
}

/** Today's dollar rate and last month's volume, refreshed by the cost-rates job. */
export interface CostRates {
  usdPerGbp: number
  generationsPerMonth: number
}

/** One paid service of a generation, in `mg_cost_data.providers`. */
export interface CostProvider {
  usd: number
  label: string
  detail: string
  provider: string
}

/** `mg_cost_data` of a generation: what it cost, what it sold for, and the margins. */
export interface MmaCostData {
  provider: 'nanobanana' | 'openai'
  fallbacks: string[]
  providers: CostProvider[]
  /** Null when nothing was sold: the matcha was refunded. */
  margin_pct: number | null
  markup_pct: number | null
  profit_usd: number
  api_cost_usd: number
  mma_cost_usd: number
  model_cost_usd: number
  sell_price_usd: number
  total_cost_usd: number
  margin_bulk_pct: number | null
  markup_bulk_pct: number | null
  matchas_charged: number
  profit_bulk_usd: number
  fixed_overhead_usd: number
  cost_schema_version: string
  sell_price_bulk_usd: number
  matcha_unit_price_usd: number
  profit_after_fixed_usd: number
  fixed_monthly_total_usd: number
  est_generations_per_month: number
  matcha_unit_price_bulk_usd: number
  profit_after_fixed_bulk_usd: number
}
