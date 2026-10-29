import type { BrandMemoryScan, BrandMemoryVars } from '../../types/brandMemory.types.js'

export const BRAND_MEMORY_SCANNER_PROMPT =
  'You are a product & design cataloguer for a beauty / fashion / perfumery brand studio. ' +
  'First decide which of THREE kinds the hero subject is: (A) a physical PRODUCT or its packaging, (B) a human MODEL, or ' +
  '(C) a flat DESIGN / ARTWORK — a logo, wordmark, label design, packaging design, fashion illustration, print or pattern, ' +
  'poster, or typographic lockup (a 2D graphic, NOT a photograph of a 3D object). ' +
  'Answer through the save_brand_memory tool. ' +
  'kind: "product" for (A), "model" for (B), "design" for (C). ' +
  'name: a SHORT name, 1-3 words. For a PRODUCT, read the label / wordmark if visible (e.g. "Aurora Serum"). ' +
  'For a MODEL, a first name if a nameplate is visible, otherwise 1-2 words (e.g. "Red-coat model"). ' +
  'For a DESIGN, name it by the NATURE of the design, LEADING with its type — e.g. "Label design", "Logotype", ' +
  '"Fashion illustration", "Packaging design", "Poster design", "Seamless pattern", "Typographic lockup" — and prepend the ' +
  'brand wordmark or subject when legible (e.g. "Aurora label design", "Floral pattern"). NEVER label a flat design generically as "product". ' +
  'description: a rich identity paragraph that ANSWERS, in order: ' +
  '(1) what it overall looks like (form/shape, silhouette, packaging type — or, for a design, its medium, layout and composition); ' +
  '(2) its name and any text / label / logo on it — quote it verbatim if legible — or, for a model, what they are wearing; ' +
  '(3) what it is made of (glass, plastic, metal, fabric…) — or, for a model, apparent race, age range, gender and overall vibe — ' +
  'or, for a design, its colour palette, art style and technique; ' +
  '(4) the key distinguishing visual details (colours, finish, cap, typography, distinctive marks); ' +
  '(5) what it is for / its use / what it does. Be specific and factual, no marketing fluff. ' +
  'tags: 4-10 lowercase search keywords (type, colour, material, category). ' +
  'category: "logo" for a logo, wordmark or typographic lockup; "illustration" for any other design or artwork; ' +
  '"model" for a person; "product" for a physical product or its packaging. ' +
  'aliases: 2-4 short alternate names a user might actually TYPE for this exact item — nicknames, shortened forms, ' +
  'the no-space form of the name (e.g. "reef33"), a distinctive visual handle (e.g. "black reef bottle"). Each alias must be ' +
  'DISTINCTIVE to this item; NEVER a bare generic type word like "perfume", "logo", "product" or "model".'

/** The one tool the scanner answers through, so its reading always comes back in this shape. */
export const BRAND_MEMORY_SCAN_TOOL = {
  type: 'function',
  function: {
    name: 'save_brand_memory',
    strict: true,
    parameters: {
      type: 'object',
      additionalProperties: false,
      required: ['kind', 'name', 'description', 'tags', 'aliases', 'category'],
      properties: {
        kind: { type: 'string', enum: ['product', 'model', 'design'] },
        name: { type: 'string' },
        description: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        aliases: { type: 'array', items: { type: 'string' } },
        category: { type: 'string', enum: ['logo', 'illustration', 'model', 'product'] },
      },
    },
  },
} as const

/**
 * A new brand memory's `mg_mma_vars`, holding its one picture. Without a
 * scan the reading is left empty, and `scanning` says so.
 */
export function brandMemoryVars(scan: BrandMemoryScan | null, url: string, sortOrder: number): BrandMemoryVars {
  const reading = scan ?? { kind: 'product', name: '', description: '', tags: [], aliases: [], category: 'product' }

  return {
    ...reading,
    images: [url],
    origin: 'upload',
    scanning: scan !== null,
    thumb_url: url,
    use_count: 0,
    sort_order: sortOrder,
    asset_items: [
      {
        url,
        roles: [reading.category, 'frame_reference'],
        origin: 'upload',
        aliases: [url],
        has_face: false,
        has_person: false,
      },
    ],
    source_urls: [url],
    last_used_at: '',
    memory_enabled: true,
  }
}
