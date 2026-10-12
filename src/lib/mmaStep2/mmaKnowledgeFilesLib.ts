import type {
  CreateAssetOutput,
  FactEvidence,
  FactSource,
  GateEvidence,
  KnowledgeCandidate,
  KnowledgeCatalog,
  KnowledgeCondition,
  KnowledgeDoc,
  KnowledgeFacts,
  KnowledgeReasonCode,
  KnowledgeRoute,
} from '../../types/mma/mma.types.js'
import { KNOWLEDGE_CATALOG_FILE } from '../constants.js'

/** How step 2 picks its guides: structured facts checked against the catalog. */
export const KNOWLEDGE_ROUTER = 'facts_catalog_v1'

const FACTS_SCHEMA = 'mina.knowledge.facts.v1'
const ROUTE_SCHEMA = 'mina.knowledge.route-receipt.v1'

/** Entries of `human_safety_scope` that state no scope, and so can never unlock a guide. */
const NO_SAFETY_SCOPE = ['none', 'unknown']

/** What a guide costs Claude, estimated as four characters a token. */
export const estimateTokens = (chars: number) => Math.ceil(chars / 4)

/** The facts of a still image prompt, read off step 1's asset plan. */
export function knowledgeFacts(plan: CreateAssetOutput, engine: string): KnowledgeFacts {
  const profile = plan.production_profile

  return {
    media: 'image',
    phase: 'image_prompt',
    engine,
    audio_mode: 'muted',
    camera_plan: false,
    target_format: profile.format,
    source_faithful: plan.preserve_scene,
    target_subjects: profile.subjects,
    human_safety_scope: profile.human_safety_scope,
    target_audio_nature: 'unknown',
    target_output_medium: plan.target_output_medium,
    target_capture_device: profile.capture_device,
    target_visual_register: profile.visual_register,
    requires_physical_realism: profile.physical_realism === 'unknown' ? null : profile.physical_realism === 'required',
  }
}

function holds({ op, value }: KnowledgeCondition, actual: unknown) {
  const expected = value as unknown[]
  if (op === 'eq') return actual === value
  if (op === 'in') return expected.includes(actual)

  return (actual as unknown[]).some((entry) => expected.includes(entry))
}

/** The first check a guide fails decides why it was left out; it is included when it fails none. */
function verdict(doc: KnowledgeDoc, evidence: KnowledgeCandidate['evidence']): [KnowledgeReasonCode, string] {
  const { media, phase, any_of, required } = evidence

  if (!media.matched) return ['media_gate_failed', `Hard media gate: ${media.actual} is not one of ${media.expected.join(', ')}.`]
  if (!phase.matched) return ['phase_gate_failed', `Hard phase gate: ${phase.actual} is not one of ${phase.expected.join(', ')}.`]
  if (required.some((entry) => !entry.matched)) {
    return ['required_fact_mismatch', 'One or more required structured facts did not match.']
  }
  if (any_of.length && !any_of.some((branch) => branch.matched)) {
    return ['no_positive_target_match', 'No positive structured target-fact branch matched.']
  }

  return ['included', doc.include_reason]
}

//THIS METHOD IS USED TO WEIGH EVERY CATALOG GUIDE AGAINST THE FACTS, IN CATALOG ORDER, AND KEEPS THOSE THAT APPLY.
function candidate(doc: KnowledgeDoc, facts: Record<string, unknown>, sources: Record<string, FactSource>): KnowledgeCandidate {
  const gate = (fact: GateEvidence['fact'], expected: string[]): GateEvidence => ({
    fact,
    actual: facts[fact],
    source: sources[fact]!,
    matched: expected.includes(facts[fact] as string),
    expected,
  })
  const check =
    (group: string) =>
    (condition: KnowledgeCondition): FactEvidence => ({
      fact: condition.fact,
      group,
      actual: facts[condition.fact],
      source: sources[condition.fact]!,
      matched: holds(condition, facts[condition.fact]),
      expected: condition.value,
      operator: condition.op,
    })

  // Every check is recorded, even past the one that decides, so the receipt shows the whole picture.
  const evidence = {
    media: gate('media', doc.media),
    phase: gate('phase', doc.phases),
    any_of: (doc.match.any_of ?? []).map((branch, index) => {
      const branchEvidence = branch.all.map(check(`any_of_${index}`))

      return { index, matched: branchEvidence.every((entry) => entry.matched), evidence: branchEvidence }
    }),
    required: (doc.match.all ?? []).map(check('all')),
  }
  const [reasonCode, reason] = verdict(doc, evidence)
  const included = reasonCode === 'included'

  return {
    key: doc.key,
    kind: doc.kind,
    chars: doc.chars,
    title: doc.title,
    reason,
    status: included ? 'included' : 'excluded',
    tokens: doc.tokens,
    decision: included ? 'include' : 'exclude',
    evidence,
    included,
    sent_ready: included,
    reason_code: reasonCode,
    specialized: doc.specialized,
    token_count: doc.tokens,
    content_hash: doc.content_hash,
    token_estimate_method: 'ceil_chars_div_4',
  }
}

/** Weighs every catalog guide against the facts, in catalog order, and keeps those that apply. */
export function knowledgeRoute(
  catalog: KnowledgeCatalog,
  catalogHash: string,
  docs: KnowledgeDoc[],
  facts: KnowledgeFacts,
): KnowledgeRoute {
  const given: Record<string, unknown> = { ...facts }
  //This line is for creating a record of the sources of the facts, which indicates whether each fact was provided by the input or is missing.
  //It creates an object with keys for each fact and values indicating the source of the fact.
  const used = catalog.guides.flatMap((guide) => [
    ...(guide.match.all ?? []),
    ...(guide.match.any_of ?? []).flatMap((branch) => branch.all),
  ])

  // A fact the catalog tests but the input does not carry (audio_engine, engine_version on a still) reads as unknown.
  const sources: Record<string, FactSource> = Object.fromEntries(
    [...Object.keys(given), ...used.map((condition) => condition.fact)].map((fact) => [
      fact,
      fact in given ? 'facts' : 'missing',
    ]),
  )
  const normalized: Record<string, unknown> = {
    schema: FACTS_SCHEMA,
    ...Object.fromEntries(Object.keys(sources).map((fact) => [fact, fact in given ? given[fact] : 'unknown'])),
    human_safety_scope: facts.human_safety_scope.filter((scope) => !NO_SAFETY_SCOPE.includes(scope)),
  }

  const candidates = docs.map((doc) => candidate(doc, normalized, sources))
  const selected = docs.filter((_, i) => candidates[i]!.included)
  const keys = selected.map((doc) => doc.key)

  return {
    facts: normalized,
    method: KNOWLEDGE_ROUTER,
    schema: ROUTE_SCHEMA,
    catalog: { file: KNOWLEDGE_CATALOG_FILE, hash: catalogHash, schema: catalog.schema, version: catalog.version },
    sent_keys: keys,
    candidates,
    catalog_hash: catalogHash,
    fact_sources: sources,
    selected_keys: keys,
    router_version: KNOWLEDGE_ROUTER,
    sent_ready_docs: selected.map(({ key, chars, title, tokens, content_hash }) => ({
      key,
      chars,
      title,
      tokens,
      sent_ready: true,
      token_count: tokens,
      content_hash,
    })),
    normalized_facts: normalized,
    // Step 1's tool schema already holds every fact to its enum, so no value goes unrecognised.
    unrecognized_values: {},
    selected_token_count: selected.reduce((sum, doc) => sum + doc.tokens, 0),
    total_context_tokens: estimateTokens(selected.reduce((sum, doc) => sum + doc.chars, 0)),
    // Step 2 is handed facts only, so none of the old router's legacy inputs was there to ignore.
    ignored_legacy_inputs: { brief: false, format: false, frame_url: false, video_type: false },
  }
}
