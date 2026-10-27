import type Anthropic from '@anthropic-ai/sdk'

import type {
  AssetJob,
  BackgroundPolicy,
  ColorPolicy,
  CreateAssetItem,
  CreateAssetOutput,
  CreateAssetPlan,
  InventoryItem,
  PillHint,
  UploadKind,
} from '../../types/mma/mma.types.js'
import { MMA_IMAGE_WIDTH } from '../constants.js'

/** The version of the asset plan step 1 writes, which the steps after it read. */
export const CREATE_ASSET_PLAN_SCHEMA = 'mina.create.asset-plan.v3'

/** How MMA names each studio pill, and what an upload under it is called. */
export const PILLS: Record<UploadKind, { hint: PillHint; uploadName: string }> = {
  scene: { hint: 'scene', uploadName: 'Scene / base upload' },
  logo: { hint: 'logo', uploadName: 'Logo / design upload' },
  product: { hint: 'featured_asset', uploadName: 'Featured product or model' },
}

/** The semantic type each pill suggests, before Claude has looked at the picture. */
const SEMANTIC_HINTS: Record<PillHint, string> = { scene: 'scene', logo: 'logo', featured_asset: 'product' }

/** The name of any picture picked from the scene library; the prompt refers to it by this name. */
export const SCENE_LIBRARY_NAME = 'Mina Scene Library template'

const SCENE_LIBRARY_DESCRIPTION =
  "A scene from Mina's own library, not the customer's photo: its setting, camera, pose, wardrobe, light and grade are the reference. Anyone in it is a placeholder model."

/** The Create Asset Director's instructions: how to read the brief and every picture. */
export const CREATE_ASSET_DIRECTOR_PROMPT = `You are Mina's Create Asset Director. Read the user's brief AND every image.
Your job is to decide what each image means for this generation. Upload-pill
placement is only a hint and can be wrong.

Mina supports three production strategies:
1. scene_edit — one image is the base scene. Keep its composition, camera,
lighting, colour science and untouched regions intact while inserting,
replacing or editing products, people, logos, designs or elements.
2. reference_synthesis — several images are references and no image is the
literal base. Create a new image inspired by their relevant composition,
style, materials or identities without accidentally copying unrelated content.
3. prompt_composition — the brief creates a new image; attached products,
people, logos, designs and elements supply exact identities to combine.

Classify the requested FINAL output separately from the source images:
- target_output_medium=flat_graphic ONLY when the result itself must be
  standalone two-dimensional artwork: a logo, monogram, icon, wordmark or
  other flat graphic with no photographed/physical scene, dimensional render,
  material mockup, lighting, depth or camera.
- target_output_medium=photographic for every photo, photoreal image, 3D or
  dimensional render, physical sign/object, packaging mockup, person, product,
  material surface or scene — even when the source/reference is a flat logo.
- target_output_medium=unknown when the requested final medium is genuinely
  ambiguous. Describe SOURCE presentation only in each item's presentation;
  never infer the FINAL medium from a source being a flat graphic.

Also return production_profile: structured production FACTS for the requested
FINAL image and the request's safety-relevant inputs. These are facts, never
knowledge-guide names, file keys or routing choices.
- visual_register: flat_graphic, phone_native, naturalistic, editorial,
  cinematic or unknown. This is the requested finish, not the source image's.
- format: standalone_artwork, portrait, product_image, scene_image, image_edit,
  other or unknown.
- capture_device: phone, consumer_camera, professional_camera, virtual_camera,
  not_applicable or unknown. Use not_applicable only for truly flat artwork.
- subjects: every requested final subject type that is confidently present:
  person, body_part, product, logo_or_design, scene_or_location,
  material_or_element, text, abstract_graphic, other. Use ["unknown"] when the
  target subjects cannot be established; never turn missing evidence into an
  empty list.
- physical_realism: required when the final result depicts a physical person,
  object, material or scene even if stylized; not_applicable only for flat
  artwork; otherwise unknown.
- safety_scope describes the ENTIRE provider request, including used source
  images as well as the intended result. Each field is present, absent or
  unknown. A hand, arm, leg, torso or any other real-human portion makes
  real_person=present; when no face is visible it also makes
  body_part_without_face=present. Do not use absent merely because evidence is
  missing. sensitive_context is a factual visual/content scope, not a policy
  verdict and never rewrites the user's request.
- human_safety_scope is the narrower provider-wording fact: include person only
  for a real-person identity/replacement/edit where provider-safe human wording
  is directly relevant, skin for a skin/body-area treatment or exposed-skin
  request, and wardrobe for potentially moderation-sensitive wardrobe such as
  swimwear/underwear/revealing fit. Use ["none"] for an ordinary human image
  with no such wording need, and ["unknown"] when ambiguous. Never add a
  positive scope merely because an unrelated reference happens to show a
  person; unknown/ordinary must not unlock provider-safe substitutions.
- confidence is 0..1 and rationale briefly cites the brief/visual evidence.
- Use unknown whenever the evidence is genuinely ambiguous. Do not infer one
  production fact from a pill label or from a guide you think might be useful.

Allowed semantic_type values:
scene, person, product, logo, other_design, element, reference.

Allowed job values:
base_scene, identity_reference, brand_overlay, insert_element,
composition_reference, aesthetic_reference, ignore.

Rules:
- Use visual evidence plus the brief. Never classify by pill name alone.
- Pick at most one base_scene.
- Separate IDENTITY from SCENE-DEPENDENT APPEARANCE. A product/person/logo
  identity reference supplies silhouette, proportions, construction, label,
  face or graphic identity. Its source background, source lighting, cast
  shadow, camera, scale, white balance and catalogue-render look are NOT part
  of the identity unless the user explicitly says they are.
- presentation says how the source image is presented:
  in_scene, isolated_packshot, transparent_cutout, flat_graphic,
  material_detail, style_reference or unknown.
- background_policy:
  use_as_scene only for the literal base scene; extract_subject for products,
  people, logos or elements inserted into another scene; ignore_background for
  composition/style cues; preserve_flat_background only when the requested
  FINAL image itself is a standalone flat logo/graphic on that background.
- color_policy:
  preserve_identity_color when the user explicitly asks for the asset's
  original/brand colour; explicit_recolor when the user names a new asset
  colour; adapt_to_scene_grade when the scene's global palette/grade controls
  the inserted asset. A global monochrome, grayscale, warm-grey, sepia or
  duotone direction applies to inserted products and elements too unless the
  user explicitly asks that asset to remain coloured. "Natural" describes
  authenticity/material unless it clearly modifies colour.
- "exactly as shown" for a product means identity-critical geometry, label,
  construction and material truth. It NEVER means copy a white/plain source
  background, source shadow, source perspective or catalogue lighting into the
  target scene.
- For every inserted subject specify physical integration: target-scene
  perspective and scale, occlusion/contact, cast/contact shadows, reflections,
  white balance, focal softness/sharpness, grain/noise and colour grade.
- "this", "that", "use the attached image" can refer to an image even when its
  product name is absent from the brief.
- A manually selected Memory asset is not automatically relevant. Mark it
  ignore only when the brief and the other references provide no credible role
  for it. Be conservative: if intent is plausible, keep it.
- If a scene is being edited, preserve it unless the user explicitly requests
  a new scene or broad restyling.
- SMALLEST-EDIT RULE FOR A MISSPELLED OR AMBIGUOUS TARGET. Users type fast and
  misspell the thing they want changed ("replace the caps" on a stack of glass
  cups — caps? cups? the lids?). Decode the intent, but when the reading is
  genuinely ambiguous, resolve it to the SMALLEST edit that satisfies the brief.
  Never resolve a misspelling into REMOVING or MERGING a structural object of
  the base scene. Swapping a lid is a smaller edit than deleting a whole cup, so
  the lid reading wins; if the user wanted the cup gone they will say so next
  turn. State the ambiguity in the reason field so the choice is auditable.
- PRESERVE MEANS THE INVENTORY HOLDS. When preserve_scene is true, the base
  scene's countable objects stay at the same count and in the same places except
  for the single element the brief names. Do not drop, merge, add or re-stack
  anything else, and never let an inserted element consume a neighbour.
- MINA SCENE LIBRARY TEMPLATE. An item named "Mina Scene Library template" is
  Mina's own stock scene, not the customer's photo. It is still the base_scene
  for composition, camera, pose, wardrobe, light and grade — but any person in
  it is a PLACEHOLDER MODEL. When a PERSON reference is attached, the
  placeholder is recast as that person; when only products are attached, the
  placeholder stays.
- A PERSON IS NEVER A PART. Set base_scene_person to present/absent/unknown for
  the base scene. Set person_recast=true when the base scene contains a person
  AND a separate PERSON reference is meant to be the model of the image: "use
  the face of the woman joined here", "with this model", "replace the woman
  with her", "make her look like this", a person attached to a scene-library
  template. A recast replaces the WHOLE person — face, skin tone, hair, hands,
  body — as one continuous identity in the base scene's pose, wardrobe, framing
  and light. Never plan a face grafted onto another person's body: a head whose
  skin differs from the body is a failed image, not a preserved scene. Write
  "recast" in the summary and in that person's reason. person_recast=false when
  the base scene has no person (the person is then inserted) or when the brief
  keeps the person already in the scene.
- Return one item for every numbered image and JSON only.`

/** The only way the Create Asset Director may answer: its plan for every picture, as JSON. */
export const CREATE_ASSET_PLAN_TOOL: Anthropic.Tool = {
  name: 'create_asset_plan',
  description:
    'Emit the create_asset_plan output as structured JSON. This is the only way to respond — do not answer with prose.',
  // Without it the schema is only a suggestion: Claude once answered without `items`, and planOutput broke on it.
  strict: true,
  input_schema: {
    type: 'object',
    required: [
      'strategy',
      'summary',
      'preserve_scene',
      'base_scene_person',
      'person_recast',
      'target_output_medium',
      'production_profile',
      'items'
    ],
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          required: [
            'index',
            'semantic_type',
            'job',
            'use_in_generation',
            'confidence',
            'presentation',
            'background_policy',
            'color_policy',
            'integration_notes',
            'reason'
          ],
          properties: {
            job: {
              enum: [
                'base_scene',
                'identity_reference',
                'brand_overlay',
                'insert_element',
                'composition_reference',
                'aesthetic_reference',
                'ignore'
              ],
              type: 'string'
            },
            name: {
              type: 'string'
            },
            index: {
              type: 'integer'
            },
            reason: {
              type: 'string'
            },
            confidence: {
              type: 'number'
            },
            description: {
              type: 'string'
            },
            color_policy: {
              enum: [
                'preserve_identity_color',
                'adapt_to_scene_grade',
                'explicit_recolor'
              ],
              type: 'string'
            },
            presentation: {
              enum: [
                'in_scene',
                'isolated_packshot',
                'transparent_cutout',
                'flat_graphic',
                'material_detail',
                'style_reference',
                'unknown'
              ],
              type: 'string'
            },
            semantic_type: {
              enum: [
                'scene',
                'person',
                'product',
                'logo',
                'other_design',
                'element',
                'reference'
              ],
              type: 'string'
            },
            background_policy: {
              enum: [
                'use_as_scene',
                'extract_subject',
                'ignore_background',
                'preserve_flat_background'
              ],
              type: 'string'
            },
            integration_notes: {
              type: 'string'
            },
            use_in_generation: {
              type: 'boolean'
            }
          },
          additionalProperties: false
        }
      },
      summary: {
        type: 'string'
      },
      strategy: {
        enum: [
          'scene_edit',
          'reference_synthesis',
          'prompt_composition'
        ],
        type: 'string'
      },
      person_recast: {
        type: 'boolean'
      },
      preserve_scene: {
        type: 'boolean'
      },
      base_scene_person: {
        enum: [
          'present',
          'absent',
          'unknown'
        ],
        type: 'string'
      },
      production_profile: {
        type: 'object',
        required: [
          'visual_register',
          'format',
          'capture_device',
          'subjects',
          'physical_realism',
          'safety_scope',
          'human_safety_scope',
          'confidence',
          'rationale'
        ],
        properties: {
          format: {
            enum: [
              'standalone_artwork',
              'portrait',
              'product_image',
              'scene_image',
              'image_edit',
              'other',
              'unknown'
            ],
            type: 'string'
          },
          subjects: {
            type: 'array',
            items: {
              enum: [
                'person',
                'body_part',
                'product',
                'logo_or_design',
                'scene_or_location',
                'material_or_element',
                'text',
                'abstract_graphic',
                'other',
                'unknown'
              ],
              type: 'string'
            }
          },
          rationale: {
            type: 'string'
          },
          confidence: {
            type: 'number'
          },
          safety_scope: {
            type: 'object',
            required: [
              'real_person',
              'visible_face',
              'body_part_without_face',
              'sensitive_context'
            ],
            properties: {
              real_person: {
                enum: [
                  'present',
                  'absent',
                  'unknown'
                ],
                type: 'string'
              },
              visible_face: {
                enum: [
                  'present',
                  'absent',
                  'unknown'
                ],
                type: 'string'
              },
              sensitive_context: {
                enum: [
                  'present',
                  'absent',
                  'unknown'
                ],
                type: 'string'
              },
              body_part_without_face: {
                enum: [
                  'present',
                  'absent',
                  'unknown'
                ],
                type: 'string'
              }
            },
            additionalProperties: false
          },
          capture_device: {
            enum: [
              'phone',
              'consumer_camera',
              'professional_camera',
              'virtual_camera',
              'not_applicable',
              'unknown'
            ],
            type: 'string'
          },
          visual_register: {
            enum: [
              'flat_graphic',
              'phone_native',
              'naturalistic',
              'editorial',
              'cinematic',
              'unknown'
            ],
            type: 'string'
          },
          physical_realism: {
            enum: [
              'required',
              'not_applicable',
              'unknown'
            ],
            type: 'string'
          },
          human_safety_scope: {
            type: 'array',
            items: {
              enum: [
                'person',
                'skin',
                'wardrobe',
                'none',
                'unknown'
              ],
              type: 'string'
            }
          }
        },
        additionalProperties: false
      },
      target_output_medium: {
        enum: [
          'flat_graphic',
          'photographic',
          'unknown'
        ],
        type: 'string'
      }
    },
    additionalProperties: false,
  },
}

/**
 * The Cloudflare resize of an R2 picture, which Claude reads and the later
 * steps use. Scenes go as JPEG; logos and products as PNG, so a cutout keeps
 * its transparency.
 */
export function cdnImage(publicBaseUrl: string, url: string, kind: UploadKind) {
  const format = kind === 'scene' ? 'quality=85,format=jpeg' : 'quality=90,format=png'
  const path = url.slice(publicBaseUrl.length + 1)

  return `${publicBaseUrl}/cdn-cgi/image/width=${MMA_IMAGE_WIDTH},fit=scale-down,${format}/${path}`
}

/** `cdnImage` undone: the plain R2 URL the studio sent. */
export const plainImage = (url: string) => url.replace(/\/cdn-cgi\/image\/[^/]+/, '')

const descriptionOf =(item: InventoryItem) => (item.origin === 'scene_library' ? SCENE_LIBRARY_DESCRIPTION : '')

//THIS IS THE FIRST BLOCK OF THE USER SENT TO CLAUDE IN THE MMA STEP 1 (CREATE MODEL) AND IT REGROUPS THE UPLOADS AND THE BRIEF
export function briefMessage(brief: string, inventory: InventoryItem[]) {
  const hints = inventory.map((item) => ({
    index: item.index,
    slot_hint: item.pill_hint,
    semantic_hint: SEMANTIC_HINTS[item.pill_hint],
    origin: item.origin,
    memory_id: item.memory_id,
    selection_source: null,
    name: item.name,
    description: descriptionOf(item),
  }))

  return `USER BRIEF:\n${brief}\n\nCURRENT INVENTORY (slot hints can be wrong):\n\n${JSON.stringify(hints, null, 2)}`
}

/** The caption sent just ahead of each picture. */
export function imageNote(item: InventoryItem) {
  return `IMAGE ROLE ${item.index}: UNVERIFIED CREATE INPUT ${item.index} · pill hint: ${item.pill_hint}\nIMAGE NOTE ${item.index}: Current name: ${item.name}`
}

function defaultIntegrationNotes({
  job,
  backgroundPolicy,
  colorPolicy,
}: {
  job: AssetJob
  backgroundPolicy: BackgroundPolicy
  colorPolicy: ColorPolicy
}) {
  if (job === 'base_scene') {
    return 'The base scene controls composition, camera, lighting, palette, focus, grain and all untouched pixels.'
  }

  const background =
    backgroundPolicy === 'extract_subject'
      ? 'Extract the intended subject only; discard its source background, source shadow and catalogue lighting.'
      : 'Use only the requested information from this reference; do not transplant its unrelated scene.'
  const color =
    colorPolicy === 'adapt_to_scene_grade'
      ? "Apply the target scene's global palette and grade to the inserted subject."
      : colorPolicy === 'explicit_recolor'
        ? "Follow the user's explicit target colour while preserving identity-critical construction."
        : "Preserve explicit identity/brand colour, colour-managed under the target scene's light."

  return `${background} ${color} Rebuild perspective, scale, occlusion, contact/cast shadows, reflections, white balance, focus, grain and texture so it belongs in the target scene.`
}

/** Why the person in the base scene is, or is not, recast as an attached person. */
function recastReason(plan: CreateAssetPlan, items: CreateAssetItem[], inserted: CreateAssetItem[]) {
  if (!items.some((item) => item.job === 'base_scene')) return 'no_base_scene'
  if (!inserted.some((item) => item.semantic_type === 'person')) return 'no_person_reference'
  if (plan.person_recast) return 'recast'

  return plan.base_scene_person === 'present' ? 'scene_person_kept' : 'no_base_scene_person'
}

//THIS METHOD IS CALLED AFTER THE CLAUDE RESPONSE AND IT TRANSFORMS THE PLAN INTO A STRUCTURE THAT WILL BE STORED IN THE DATABASE AND USED IN THE MG_PAYLOAD COLUMN 
// OF THE MMA STEP1 IN MEGA_GENERATIONS TABLE
export function planOutput(plan: CreateAssetPlan, inventory: InventoryItem[], model: string): CreateAssetOutput {
  const items = inventory.map((entry): CreateAssetItem => {
    const reading = plan.items.find((item) => item.index === entry.index)
    if (!reading) throw new Error(`The Create Asset Director returned nothing for image ${entry.index}`)

    // The base scene keeps its own colours: only what goes into it follows a colour policy.
    const colorPolicy = reading.job === 'base_scene' ? 'preserve_identity_color' : reading.color_policy

    return {
      job: reading.job,
      url: entry.url,
      name: entry.name,
      index: entry.index,
      origin: entry.origin,
      reason: reading.reason,
      asset_id: `create_asset_${entry.index}`,
      ...(entry.origin === 'scene_library' && { template: true as const }),
      memory_id: null,
      slot_hint: entry.pill_hint,
      confidence: reading.confidence,
      default_job: reading.job,
      description: descriptionOf(entry),
      color_policy: colorPolicy,
      presentation: reading.presentation,
      semantic_hint: SEMANTIC_HINTS[entry.pill_hint],
      semantic_type: reading.semantic_type,
      selection_source: null,
      background_policy: reading.background_policy,
      integration_notes: defaultIntegrationNotes({
        job: reading.job,
        backgroundPolicy: reading.background_policy,
        colorPolicy,
      }),
      use_in_generation: reading.use_in_generation,
    }
  })

  // What goes into the scene, as opposed to the scene itself.
  const inserted = items.filter((item) => item.use_in_generation && item.job !== 'base_scene')
  const colorPolicies = inserted.map((item) => item.color_policy)
  const reason = recastReason(plan, items, inserted)

  return {
    items,
    model,
    schema: CREATE_ASSET_PLAN_SCHEMA,
    source: inventory.length ? 'vision_intent_classifier' : 'no_assets',
    summary: plan.summary,
    strategy: plan.strategy,
    color_intent: {
      // The scene's grade decides the colour of what goes into it…
      global_scene_grade: colorPolicies.includes('adapt_to_scene_grade'),
      // …unless the user asked for an asset's own colour, or named a new one.
      explicit_asset_color: colorPolicies.some((policy) => policy !== 'adapt_to_scene_grade'),
    },
    person_recast: { active: reason === 'recast', reason },
    preserve_scene: plan.preserve_scene,
    used_memory_ids: [],
    unused_memory_ids: [],
    production_profile: plan.production_profile,
    target_output_medium: plan.target_output_medium,
    uncertain_memory_ids: [],
  }
}
