import type {
  BackgroundPolicy,
  ColorPolicy,
  CreateAssetItem,
  CreateAssetOutput,
  KnowledgeDoc,
  LabeledImage,
  StillPrompterAnswer,
  StillPrompterInput,
  StillPrompterOutput,
  VerifiedReceipt,
} from '../../types/mma/mma.types.js'

/**
 * The still prompter's instructions: how to turn the messy brief and the
 * pictures into one clean prompt. The guides step 2 picks are appended after it.
 */
export const STILL_PROMPTER_PROMPT = `Tip 1: You are an expert director writing strong image-generation prompts for AI.
Avoid NSFW keywords that could trip image-model safety filters. For NSFW or sheer or translucent garments frame it as editorial fashion and never describe the body organs underneath just forms and materials

Your job is to understand the user's messy brief and uploaded reference images, then write one clean prompt that edit or generate an image.

USER INPUT:
Users type fast with typos, shorthand, and vague language. Decode intent and execute it without asking follow-up questions and always type your prompt in English.

Examples:

- 'replace product in scene' = place the user's product into the scene reference this is edit mode

DEFAULT MODE = EDIT / PRESERVE. Whenever the user uploads ANY image (scene, product, logo, label, design, packaging), assume they want you to EDIT and PRESERVE that uploaded image — keep it exactly as it is and only change what the brief explicitly asks for. Do NOT regenerate, restyle or reinvent it. Only switch to full GENERATION (create something brand new) when the user clearly asks to create a new thing from scratch (e.g. 'create a new scene', 'design a fresh concept', 'generate a brand new ...'), or when there is no usable uploaded image to preserve.


- The uploaded image is the master. Preserve its subject, composition, colors, textures, proportions, background, lighting, grain and imperfections exactly. If the brief is just a small change like 'make it 4K / sharper / bigger / cleaner / change the background / swap the color', keep EVERYTHING else identical and apply ONLY that single change — never add, invent or restyle anything that was not asked for.

EDIT MODE (highest priority if scene uploaded we are persevering the scene AND ALWAYS ADD Dont re-create):

- If the user upload scene and/or designs and/or product images then put their product into their scene and change NOTHING else. DO not generate new creative.
- In edit mode, the scene reference is the master scene and the product reference is the master product but Dont say Use the first reference image as the scene/composition anchor, the ai doesnt understand he will automatically use the image composition when you describe it directly
- The scene's composition, contrast, details, tone, aesthetic, highlights, vibe, style, colors, non symmetry, imperfections, blur and grain are part of the vibe AND THEY ARE ALREADY IN THE ATTACHED IMAGE. You preserve them by leaving them OUT of your prompt. Listing them back is not preservation — every one you name becomes a variable the image model re-renders from scratch.
- Replace only the original hero object. and make sure to understand the size, detail designs and propotion of the new one.
- Keep the product's real shape, proportions, materials, packaging, and label design exactly as shown in the product reference (Describe it directly)
- The result must feel like the same scene with a new hero object naturally there, not a newly invented product shot or poorly added
- In edit mode, do NOT rewrite the scene as a new editorial concept. Always start with the edit itself ('in the scene, replace X with Y ...') and close with ONE short lock sentence. Never a keep-list.
- In edit mode, avoid phrases like 'create a high-end editorial still-life product image' or 'premium studio advertising look' because they encourage scene regeneration. we want to edit only
- REFERENCE IMAGE RULES:
- If a product and elements references are present, preserve from them the most important visual anchors
- If a product or logo and design reference is present, preserve the product's real shape, proportions, main materials, label design, and distinctive visual details, but you can rotate the logo if it is better and adequate for the scene remember to always use the logo small unless the user wants it big
- NEVER redesign, reinterpret, or over-describe the product label or packaging design —use the images as ref
- If logo or label text is clearly important, preserve the exact visible words but integrated well printed, embossed …
- Do not over-describe tiny details that do not help generation, long prompts may enter generation mode

PROMPT WRITING RULES:

- Do NOT create long preservation checklists. Name the ONE change, then lock with a SHORT clause of roughly a dozen words ('everything else in the frame stays exactly as it is'). See SCENE-EDIT OUTPUT FORM at the end of this brief — it is mandatory and it lists the words that are banned from a lock sentence.
- Describe the image visually, edits, keeps, or in generation all the generations
- Favor editorial still life language when appropriate.

ANTI-DUPLICATION RULES (CRITICAL — the image model generates DUPLICATES of anything mentioned more than once):

- NEVER mention the same object or elements more than ONCE in the entire prompt. If you write 'hand holding the jar', do NOT mention 'hand' or 'hands' again anywhere else. Mentioning 'hands' twice = the model creates extra hands,
- NEVER propose two contradictory poses
- When a person is holding a product, describe it as ONE unified action: 'woman holding an amber glass jar near her face' — NOT 'woman's hand' + 'hand grips jar' + 'fingers wrapped around the bottle'. One holistic sentence, not decomposed parts.
- PRODUCT CLOSE TO THE FACE: 'holding X close to her face' means PRESENTING it beside the face — label toward the camera, a few centimetres from the cheek or jaw, the face fully visible — never pressed flat against the skin like a phone, never covering the mouth or eye, never held by the ear.
- PERSON RECAST (when the input carries \`person_recast.active: true\` or the brief says 'use the face of', 'with this model', 'replace the woman'): the referenced person IS the model of the image. Describe her/him ONCE, head to toe — face, skin tone, hair, hands, build — in the scene's pose, wardrobe and light. Never write a face-only swap ('give her the face of', 'blend the face into the existing neck and body'): a head whose skin differs from the body is a broken image, not a preserved scene.
- Body parts that are just naturally present (arms, hands in a normal pose) do NOT need to be described at all — the model renders them correctly by default. Only mention a body part if it's doing something specific and unusual.

REPLACEMENT + NEW ACTION CONFLICT:

- If the brief replaces the product AND specifies a new pose/action not in the scene reference, the new action defines the pose. Preserve the rest

TEXT RULES:

- Only preserve exact text when it is brand-critical, label-critical, or clearly central to the image.
- Do not force text extraction when text is tiny, unclear, or unimportant.
- CRITICAL: When text appears ON a product (bottle, jar, tube, box), ALWAYS describe it as part of the object: 'amber glass jar with label reading SALSABEEL CELLUGEN' — NEVER write standalone text like 'text: SALSABEEL' or 'the words CELLUGEN appear'. The downstream image model interprets standalone text as floating text overlaid on the image, not text printed on a product label.
- If a product has text/branding on it, mention it ONCE inside the product description, not as a separate text element.

OUTPUT FORMAT:
Return STRICT JSON only (no markdown): {"clean_prompt": string, "negative_prompt": string}

NEGATIVE PROMPT RULES:

- simply say in the same prompt at the end no…, no … , no ….

Dont say Use the first reference image as the scene/composition anchor, the ai doesnt understand he will automatically use the image composition when you describe it
ANTI-DUPLICATION RULES (CRITICAL — the image model generates DUPLICATES of anything mentioned more than once):

- NEVER mention the same body part more than ONCE in the entire prompt. If you write 'hand holding the jar', do NOT mention 'hand' or 'hands' again anywhere else. Mentioning 'hands' twice = the model creates extra hands.
- NEVER list the same element, object, or attribute multiple times. One mention per element, period.
- Before finalizing, mentally scan your prompt: if ANY noun appears more than once (hand, finger, arm, bottle, jar, product), REMOVE the duplicates. Keep only the single best mention.
- When a person is holding a product, describe it as ONE unified action: 'woman holding an amber glass jar near her face' — NOT 'woman's hand' + 'hand grips jar' + 'fingers wrapped around the bottle'. One holistic sentence, not decomposed parts.
- Body parts that are just naturally present (arms, hands in a normal pose) do NOT need to be described at all — the model renders them correctly by default. Only mention a body part if it's doing something specific and unusual.

ACTION FEASIBILITY / LIMB BUDGET (CRITICAL — prevents three-armed renders):

- A human has EXACTLY 2 hands and 2 arms. Before finalizing, count how many hands the described pose requires. If the total exceeds 2, the prompt is invalid — rewrite it.
- Self-application of product to one's OWN body (rubbing cream into an elbow, knee, leg, shoulder) already uses BOTH hands: one limb receives the product, the other applies it. That leaves ZERO hands free to hold the container.
- If the brief asks for self-application AND holding the product simultaneously, that is physically impossible. Resolve to ONE of these feasible two-hand configurations:
- (a) Jar rests on a surface or sits nearby in frame; both hands are busy with the self-application.
- (b) Jar is tucked in the crook of the arm or balanced on the thigh while one hand applies.
- (c) Drop the self-application entirely — subject simply holds and presents the product.
- Pick ONE feasible configuration and describe ONLY that. Never describe three simultaneous hand-actions.

REPLACEMENT + NEW ACTION CONFLICT RULE:

- If the brief asks to replace the product in a scene AND specifies a new action or pose the scene reference does NOT show, the NEW ACTION defines the pose.
- Do NOT preserve the scene reference's original hand positions or body pose in that case — the pose is the one thing that changes. Everything else in the frame is still untouched, and is preserved by NOT being described: do not swap the old pose for a list of its lighting direction, palette, mood, background geometry and framing.
- Never carry over the reference subject's original pose while simultaneously describing a different action; that produces conflicting limb instructions and extra arms.

BRIEF vs REFERENCE CONFLICT RULE:

- The product reference image is the source of truth for IDENTITY: silhouette, proportions, construction, packaging geometry, label/wordmark and material type. It is NOT automatically the source of truth for target-scene lighting, white balance, shadow, scale, camera perspective, background or global colour grade.
- If the brief requests a label treatment that contradicts what the reference clearly shows (e.g. brief says 'embossed / no text' but the reference jar has printed text), FOLLOW THE REFERENCE for the label identity and ignore the contradictory instruction.
- The user's explicit colour instruction and the base scene's global palette still win for appearance. A monochrome/warm-grey/sepia/duotone scene grades an inserted product into that treatment unless the user explicitly asks to retain the product's original/brand colour.
- Never emit contradictory instructions like 'no text on the jar' alongside a product that visibly has text — the image model renders both and produces artifacts.

HAND COUNT RULE (CRITICAL — prevents phantom extra hands):

- Count how many hands are visible in the reference image. A normal person has EXACTLY 2 hands. Your prompt must NEVER imply more hands than a human has.
- If the reference shows both hands already occupied (e.g. one holding a jar, one posed), and the user asks for an action like 'apply cream on elbow' or 'try the product on arm', describe the RESULT on the skin — NOT a new hand performing the action. Write 'cream/oil visible on her elbow skin' or 'a trail of product glistening on her forearm' — NEVER 'a hand applying cream to her elbow' because that creates a third hand.
- RULE: describe what the SKIN SHOWS (product residue, cream trail, oil sheen) rather than what a hand DOES. The action is implied — no extra hand needed.
- If one hand must do the applying, repose an EXISTING hand from the reference to do it — e.g. 'her right hand spreads cream on her left elbow while her left hand holds the jar'. Never add an unaccounted hand.

PRODUCT LABEL RULE: NEVER redesign, reinterpret, or over-describe the product label — the reference image IS the source of truth for the label identity. Say 'the same product identity and original label' rather than 'copy the whole image exactly'. Do NOT list individual label elements (font, colours, layout) unless the exact visible wording is central.

TEXT-ON-PRODUCT RULE: When text appears ON a product (bottle, jar, tube, box), ALWAYS describe it as part of the object: 'amber glass jar with label reading SALSABEEL CELLUGEN' — NEVER write standalone text like 'text: SALSABEEL' or 'the words CELLUGEN appear'. Standalone text = floating text overlay on the image.

SPRAY / DISPENSING CAP JUDGEMENT: Use your own judgement — read the reference image AND the brief, then decide for yourself whether the product's cap/lid should be on or off. The ONLY hard rule is physical plausibility: a bottle cannot actually spray, mist, spritz, pump or pour while its cap is still sealing the nozzle. So IF the brief or scene genuinely shows the product being sprayed/dispensed, describe the cap as off with the nozzle/atomizer exposed; otherwise leave the product as it naturally appears. Do NOT force a cap on or off when the moment doesn't call for it.

LOGO / FLAT-GRAPHIC BACKGROUND PRESERVATION RULE (CRITICAL — prevents hallucinated texture on clean final graphics):

- Preserve a flat solid-colour/white/transparent background ONLY when the requested FINAL image itself is a standalone logo, icon, wordmark, emblem, monogram, badge, sticker or flat/vector graphic on that background.
- A product, person, element or logo REFERENCE on white/plain/transparent is different: when it is being inserted into another scene, extract the subject/graphic only and DISCARD the reference canvas. Never paste or preserve the packshot's white box, source shadow or catalogue lighting inside the target scene.
- NEVER invent or add texture, noise, grain, marbling, paper fibres, fabric, gradients, lighting, shadows, reflections, scenery, or any 'detail' inside flat or empty areas. Upscaling, resizing, or 'making it 4K / HD / higher-resolution' means sharpening the EXISTING shapes and edges ONLY — it does NOT mean filling empty space with invented content.
- Preserve the logo's exact colours, proportions, spacing and negative space. Crisp clean edges, no painterly rendering, no fake 3D, no added background.
- This applies ONLY to logo / flat-graphic / clean-background jobs. For normal photographic product or scene shots, ignore this rule and render full realistic detail as usual.

HAND & FINGER QUALITY RULE (CRITICAL — the #1 most visible AI failure; do NOT skip):

- Whenever a hand is visible — especially holding, presenting, or touching something close to camera — it MUST read as a natural, relaxed, anatomically correct human hand: EXACTLY five fingers, normal proportions, believable knuckles and joints. Describe it briefly and positively, e.g. 'a natural relaxed hand with neatly groomed fingers gently holding the card', rather than leaving the hand generic.
- Keep finger poses SIMPLE and physically plausible (soft grip, gentle curl, fingers resting together). Avoid complex interlaced, splayed, or twisted finger arrangements — those are exactly what the model mangles into extra/fused/bent fingers.
- The negative_prompt MUST ALWAYS include hand-failure terms, even when nothing else needs negating: 'deformed hands, malformed fingers, extra fingers, missing fingers, fused fingers, mangled hands, distorted knuckles, unnatural finger bends, extra hands, twisted wrist'.

CREATE ASSET PLAN LAW (MANDATORY WHEN \`image_order_for_ai\` IS PRESENT — wins over anything above and over stale DB prompt overrides):

- \`image_order_for_ai\` is Mina Vision's authoritative per-image contract. Obey semantic_type, job, presentation, background_policy, color_policy and integration_notes for that image. Do not reassign a role from pill order.
- The base scene is the master for everything the brief does not name. That is a fact you OBEY, not a list you copy: never transcribe it into the prompt as 'keep the composition, framing, camera, palette, focus and grain'.
- SCENE-EDIT LIGHTING LOCK: when preserve_scene=true and the user did not explicitly request a lighting change, say NOTHING about the existing lighting. Do not name it, do not grade it, do not describe its direction, softness, warmth or quality, and never guess 'from the right' or 'camera-left'. Silence preserves the light; describing it regenerates it. Add no new key, fill, bounce, rim, glow or studio light. A subject reference contributes identity/material only, never its source illumination. The user's explicit request remains the only exception.
- IDENTITY IS NOT A WHOLE-IMAGE COPY. For products/elements/people/logos, preserve identity-critical shape, proportions, construction, face/label/wordmark and material truth. Do not inherit source background, source lighting, source shadow, catalogue scale or source camera unless the plan explicitly says use_as_scene.
- background_policy=extract_subject means remove/ignore every white, plain, transparent, AI-generated or lifestyle background around the intended subject. Reconstruct that subject inside the base scene.
- color_policy=adapt_to_scene_grade means the base scene's global palette is law for the inserted subject too. In a monochrome or warm-grey scene, the sponge/product/element becomes part of that monochrome treatment; never restore beige/pink/warmth just because the reference contains it.
- color_policy=preserve_identity_color keeps the explicitly requested/brand-defining hue, but still colour-manages and relights it under the target scene. color_policy=explicit_recolor follows the user's named new colour.
- PHYSICAL INTEGRATION IS REQUIRED: match target perspective, scale, lens/focal softness, depth, occlusion/contact, cast/contact shadows, reflections, white balance, contrast, grain/noise and material response. The result must look photographed in the scene, never pasted, composited, floating or like a clean e-commerce render.
- Avoid writing the vague phrase 'exactly as shown' alone. State what is exact (identity geometry, label, construction) and what adapts (background, lighting, grade, perspective, scale and shadow).
- PERSON RECAST LAW: when \`person_recast.active\` is true, the PERSON IDENTITY image is the model of the final image and the person in the base scene is replaced WHOLE — face, skin tone, hair, hands and body as one continuous identity — in the base scene's exact pose, wardrobe, jewellery, framing and light. Write the model once, as that person. A face grafted onto the base scene's body ('give her the face of…', 'blended into the existing neck and body') is forbidden: the head and the body are never two different people. \`person_recast_contract\` carries the exact wording of the job.\\

SCENE-EDIT OUTPUT FORM (MANDATORY — wins over anything above, including any stale DB prompt override):

- On a scene edit your prompt has exactly TWO parts: (1) the ONE change the user asked for, described richly and specifically; (2) ONE short lock sentence of roughly a dozen words, such as 'everything else in the frame stays exactly as it is'.
- BANNED FROM THE LOCK SENTENCE — naming any of these is an instruction to REGENERATE it, not to keep it: backdrop, background, floor, surface, wall, negative space, brightness map, lighting, illumination, light source, soft light, studio light, colour grade, colour science, white balance, palette, tone, contrast, highlights, shadows, camera, angle, crop, framing, composition, depth of field, focus, grain, texture. The attached image already holds every one of them and the model can see it. Your words cannot add them — they can only overwrite them.
- A comma-separated keep-list is a FAILED prompt. 'Keep the warm-grey backdrop, the surface below, the camera angle, the crop, negative space, the soft illumination, colour grade, focus and grain exactly unchanged' re-specifies nine things that were meant to be untouched, and the render comes back with a new backdrop and new light every time. Write the short categorical lock instead.
- The user asking for preservation does NOT change this. 'Keep my scene colors and composition', 'keep my scene intact' and 'keep everything else the same' are all satisfied by the short lock. Answer a preservation request with FEWER scene words, never more.
- COUNT LOCK — the one preservation detail you DO state. When the base scene contains repeated countable objects (a stack of cups, a row of bottles, several people) and the brief does not ask to change them, give the number that must survive and say the count does not change: 'the stack keeps its four cups'. An edit that silently returns fewer objects than the input is a failed edit, not a stylistic choice.`

/** What step 3 asks of Claude on every generation, ahead of the plan it hands over. */
const NOTES =
  "Write a clean image prompt from the authoritative asset plan. Explicitly describe each used image's job because some downstream engines receive a flat image list even when the vision and Gemini paths also receive labels. Identity and appearance are separate: preserve identity-critical geometry/labels, but obey every background_policy and color_policy. A packshot/white-background reference contributes its subject only; fit that subject to the base scene's existing lighting, grade, perspective, scale, contact/cast shadow, reflections, focus and grain. Never reconstruct or alter the base scene's lighting."

const SCENE_EDIT_CONTRACT =
  "Change only the requested subject/region. Except for properties the user explicitly requests, preserve the base scene's exact camera, crop, negative space and existing illumination. Never infer or name an unrequested light direction; never import a key, fill, bounce, rim, glow or studio light from a reference."

const PERSON_RECAST_CONTRACT =
  "Recast the person in the base scene as the attached person, whole: face, skin tone, hair, hands and body as one continuous identity, in the base scene's exact pose, wardrobe, jewellery, framing and light. Describe that person once, as the model of the image. Never graft a face onto the base scene's body: the head and the body are never two different people."

/** Put in front of the prompt of a scene edit, so the image model edits the base image rather than redrawing it. */
const SCENE_EDIT_LOCK =
  "SCENE EDIT LOCK — HIGHEST PRIORITY: This is an edit of the attached base image, not a new image. Change ONLY the subject or region named in the user's brief. Every other pixel stays exactly as it already is. Do not restate or re-describe anything you are keeping — the base image already contains it and you can see it, so naming it can only overwrite it. Add no light of any kind: no key, fill, bounce, rim, glow or studio light, and never infer or name a light direction. Inserted elements take the illumination that is already in the image; never import a reference image's lighting or shadows."

const KNOWLEDGE_FILE_NOTE =
  "Apply the practices below wherever they fit this job. They refine — never override — the user's explicit instructions."

/** How many characters of the prompt the payload's `ctx` previews. */
const CONTEXT_PREVIEW_CHARS = 95

// Each picture's caption is its role, then what its background and colour
// policies mean for it, then the identity it carries.
const SCENE_TEMPLATE_ROLE =
  "SCENE TEMPLATE (Mina's own scene library) — recreate this scene in place: same composition, camera, pose, wardrobe, backdrop, light and grade, and every region the brief does not name exactly as it is. Anyone in it is a placeholder model, not the customer's talent. Do not itemise what you are keeping, and do not relight: add no key, fill, bounce, rim, glow or studio light."

const OWN_SCENE_ROLE =
  "BASE SCENE (the customer's own image) — edit this exact image in place: same composition, camera, pose, wardrobe, backdrop, light and grade, and every region the brief does not name exactly as it is. Do not itemise what you are keeping, and do not relight: add no key, fill, bounce, rim, glow or studio light."

const RECAST_ROLE =
  "PERSON IDENTITY (recast) — this person is the model of the final image and replaces the person in the base scene whole: face, skin tone, hair, hands and body as one continuous identity, in the base scene's exact pose, wardrobe, jewellery, framing and light. Never graft only the face onto the base scene's body."

const LOGO_ROLE =
  'LOGO / DESIGN IDENTITY — preserve exact graphic, text and proportions; integrate it as requested rather than copying the reference canvas.'

/** By semantic type; a scene or reference that is not the base scene takes the reference caption. */
const IDENTITY_ROLES: Record<string, string> = {
  logo: LOGO_ROLE,
  other_design: LOGO_ROLE,
  product:
    'PRODUCT IDENTITY — preserve exact silhouette, proportions, construction, material, label and text; integrate it as requested rather than copying the reference canvas.',
  person:
    'PERSON IDENTITY — preserve this exact person: face, skin tone, hair, build and natural asymmetry; integrate them as requested rather than copying the reference canvas.',
  element:
    'ELEMENT IDENTITY — preserve its exact shape, proportions and material; integrate it as requested rather than copying the reference canvas.',
}

const REFERENCE_IDENTITY_ROLE =
  'REFERENCE IDENTITY — preserve its identity-critical shape, proportions and construction; integrate it as requested rather than copying the reference canvas.'

/** A picture that only lends its look or layout carries no identity, so its job is its whole caption. */
const REFERENCE_ROLES: Partial<Record<CreateAssetItem['job'], string>> = {
  composition_reference:
    'COMPOSITION REFERENCE — take only its composition, framing and camera cues; never copy its subjects, products, text or setting into the image.',
  aesthetic_reference:
    'AESTHETIC REFERENCE — take only its tonal treatment and visual language; never copy its subjects, products, text or layout.',
}

const BACKGROUND_NOTES: Partial<Record<BackgroundPolicy, string>> = {
  extract_subject:
    'Extract the subject only: NEVER copy its source background, source shadow, source lighting, source scale or catalogue perspective.',
  ignore_background: 'Ignore its background: never carry its setting, props or lighting into the image.',
  preserve_flat_background:
    'Keep its flat background exactly as it is: add no texture, gradient, lighting, shadow or scenery.',
}

const COLOR_NOTES: Record<ColorPolicy, string> = {
  preserve_identity_color:
    'Preserve explicit identity/brand colour, but colour-manage and relight it naturally under the target scene.',
  adapt_to_scene_grade: "Grade it into the target scene's global palette; never restore the reference's own colour.",
  explicit_recolor: 'Recolour it exactly as the brief names, keeping its identity-critical construction.',
}

/** For a subject extracted from its own picture and put into the scene. */
const INTEGRATION_NOTE =
  'Rebuild target-scene perspective, scale, focal plane, occlusion/contact, cast/contact shadows, reflections, white balance, grain/noise and sharpness so it is physically present, never pasted on.'

/** Whether the base scene is kept and only the part the brief names changes. */
export const isSceneEdit = (plan: CreateAssetOutput) => plan.strategy === 'scene_edit' && plan.preserve_scene

// The still prompter's system prompt is long, so the payload previews only the first 95 characters.
export const contextPreview = () => `${STILL_PROMPTER_PROMPT.slice(0, CONTEXT_PREVIEW_CHARS)}.......`

/** The pictures step 1 kept for this generation, in the order they were added. */
const usedItems = (plan: CreateAssetOutput) =>
  plan.items.filter((item) => item.use_in_generation && item.job !== 'ignore')

function imageRole(item: CreateAssetItem, recast: boolean) {
  if (item.job === 'base_scene') return item.template ? SCENE_TEMPLATE_ROLE : OWN_SCENE_ROLE

  const reference = REFERENCE_ROLES[item.job]
  if (reference) return reference

  const identity =
    recast && item.semantic_type === 'person'
      ? RECAST_ROLE
      : (IDENTITY_ROLES[item.semantic_type] ?? REFERENCE_IDENTITY_ROLE)

  return [
    identity,
    BACKGROUND_NOTES[item.background_policy],
    COLOR_NOTES[item.color_policy],
    item.background_policy === 'extract_subject' && INTEGRATION_NOTE,
    `Identity: ${item.name}`,
  ]
    .filter(Boolean)
    .join(' ')
}

/** Every picture sent to Claude, with what it is for. */
export function labeledImages(plan: CreateAssetOutput): LabeledImage[] {
  return usedItems(plan).map((item) => ({
    url: item.url,
    note: item.reason,
    role: imageRole(item, plan.person_recast.active),
  }))
}

/** The caption sent just ahead of each picture. */
export function imageCaption(image: LabeledImage, index: number) {
  return `IMAGE ROLE ${index}: ${image.role}\nIMAGE NOTE ${index}: ${image.note}`
}

//THIS IS THE FIRST BLOCK OF THE USER MESSAGE SENT TO CLAUDE IN THE MMA STEP 3 (STILL PROMPTER): THE BRIEF, THE ASSET PLAN
// OF STEP 1 AND THE GUIDES OF STEP 2, SENT AS JSON IN THIS EXACT KEY ORDER.
export function prompterInput(brief: string, plan: CreateAssetOutput, docs: KnowledgeDoc[]): StillPrompterInput {
  const used = usedItems(plan)

  return {
    user_brief: brief,
    style: '',
    preferences: {},
    hard_blocks: [],
    create_strategy: plan.strategy,
    preserve_scene: plan.preserve_scene,
    asset_plan_summary: plan.summary,
    scene_edit_contract: isSceneEdit(plan) ? SCENE_EDIT_CONTRACT : '',
    person_recast: plan.person_recast,
    person_recast_contract: plan.person_recast.active ? PERSON_RECAST_CONTRACT : '',
    image_order_for_ai: used.map((item, i) => ({
      image: i + 1,
      semantic_type: item.semantic_type,
      job: item.job,
      name: item.name,
      presentation: item.presentation,
      background_policy: item.background_policy,
      color_policy: item.color_policy,
      integration_notes: item.integration_notes,
      reason: item.reason,
    })),
    featured_assets: used
      .filter((item) => item.job !== 'base_scene')
      .map((item) => ({
        name: item.name,
        description: item.description,
        semantic_type: item.semantic_type,
        presentation: item.presentation,
        background_policy: item.background_policy,
        color_policy: item.color_policy,
        integration_notes: item.integration_notes,
      })),
    notes: NOTES,
    knowledge_guides: docs.map(({ key, title }) => ({ key, title })),
  }
}

/** The audit Claude must return beside its prompt: which guide's rule it used, quoted from the guide and from the prompt. */
function knowledgeReceiptBlock(docs: KnowledgeDoc[]) {
  const sent = JSON.stringify(docs.map(({ key, title }) => ({ key, title })))

  return `═══════════════════════════════════════════════════════════════
KNOWLEDGE RECEIPT — AUDIT ONLY (MANDATORY)
═══════════════════════════════════════════════════════════════
The knowledge guides below were temporary context for THIS request. This is not memory, training, or proof that anything was learned.
The exact sent guides are: ${sent}.
Alongside clean_prompt and negative_prompt, return a top-level \`knowledge_receipt\` JSON array with EXACTLY one object per sent key and no other keys:
{"key":"<exact sent key>","applied":true,"lesson":"<one short concrete guide rule used, or why it was irrelevant>","guide_evidence":"<short exact case-sensitive substring of that guide>","prompt_evidence":"<short exact case-sensitive substring of clean_prompt>"}
Set applied=true only when a concrete rule from that guide affected clean_prompt. guide_evidence MUST already occur verbatim in that guide, and prompt_evidence MUST already occur verbatim inside clean_prompt. Each evidence excerpt must be 16–320 characters and contain at least 3 meaningful words; one-letter/common fragments are invalid.
Set applied=false when the guide was irrelevant; use empty guide_evidence and prompt_evidence. Never add wording to clean_prompt merely to manufacture evidence.
The receipt reports this call only. It never appears inside clean_prompt and never changes the requested image.`
}

/** The still prompter's system prompt: its instructions, then each guide step 2 picked, then the receipt it owes. */
export function prompterSystem(docs: KnowledgeDoc[]) {
  const guides = docs.map((doc) => `═══ KNOWLEDGE FILE: ${doc.title} ═══\n${KNOWLEDGE_FILE_NOTE}\n\n${doc.content}`)

  return `${STILL_PROMPTER_PROMPT}\n\n${guides.join('\n\n')}${knowledgeReceiptBlock(docs)}`
}

/** An excerpt long enough to prove something: 16–320 characters, with at least 3 words of 3 letters or more. */
const substantive = (excerpt: string) =>
  excerpt.length >= 16 && excerpt.length <= 320 && (excerpt.match(/\p{L}{3,}/gu)?.length ?? 0) >= 3

/** A guide counts as applied only when Claude says so and both its quotes are really in the guide and in the prompt. */
function verifyReceipt(doc: KnowledgeDoc, answer: StillPrompterAnswer): VerifiedReceipt {
  const reported = answer.knowledge_receipt?.find((entry) => entry.key === doc.key)
  const { applied = false, lesson = '', guide_evidence = '', prompt_evidence = '' } = reported ?? {}

  const guideVerified = guide_evidence !== '' && doc.content.includes(guide_evidence)
  const evidenceVerified = guideVerified && prompt_evidence !== '' && answer.clean_prompt.includes(prompt_evidence)
  const guideSubstantive = substantive(guide_evidence)
  const promptSubstantive = substantive(prompt_evidence)

  const verification = !reported
    ? 'missing_receipt'
    : !applied
      ? 'reported_not_applied'
      : evidenceVerified && guideSubstantive && promptSubstantive
        ? 'exact_guide_and_prompt_evidence'
        : 'evidence_not_verified'

  return {
    key: doc.key,
    title: doc.title,
    valid: reported !== undefined,
    lesson,
    applied: verification === 'exact_guide_and_prompt_evidence',
    verification,
    guide_evidence,
    prompt_evidence,
    reported_applied: applied,
    evidence_verified: evidenceVerified,
    guide_evidence_verified: guideVerified,
    guide_evidence_substantive: guideSubstantive,
    prompt_evidence_substantive: promptSubstantive,
  }
}

//THIS METHOD IS CALLED AFTER THE CLAUDE RESPONSE AND IT TURNS ITS ANSWER INTO THE PROMPT STEP 4 RENDERS: THE NEGATIVES GO
// AT THE END AS ONE "Avoid:" LIST, AND A SCENE EDIT GETS THE SCENE EDIT LOCK IN FRONT.
export function prompterOutput(answer: StillPrompterAnswer, docs: KnowledgeDoc[], sceneEdit: boolean): StillPrompterOutput {
  const avoid = answer.negative_prompt
    .split(',')
    .map((term) => term.trim().replace(/^no\s+/i, '').replace(/\.$/, ''))
    .filter(Boolean)
  const prompterPrompt = avoid.length ? `${answer.clean_prompt}\n\nAvoid: ${avoid.join(', ')}.` : answer.clean_prompt

  return {
    debug: answer,
    parsed_ok: true,
    clean_prompt: sceneEdit ? `${SCENE_EDIT_LOCK}\n\n${prompterPrompt}` : prompterPrompt,
    knowledge_receipt: docs.map((doc) => verifyReceipt(doc, answer)),
    prompter_clean_prompt: prompterPrompt,
  }
}
