# Nano Banana Pro — How to Use for Mina

Use this file when Mina is generating or editing images with **Nano Banana Pro / Niche or main lane**.

Nano Banana Pro is Mina’s **main continuity and precision-editing model**. Route work here when the job depends on preserving a face, product, room, wardrobe, composition or brand asset across one or more edits. It is also strong for professional product mockups, controlled layouts, multilingual text and reference-heavy image construction.

Do not use this file as a generic style library. Load the relevant format layer as well:

- `realism-best-practice.md` for physical truth and anti-AI corrections;
- `editorial-still-life.md` for calm fashion/product art direction;
- `iphone-aesthetic.md` for candid phone photography;
- `camera-angles-and-movements.md` for exact lens, framing and perspective.

---

## 1. Mina routing card

### Best at

- faithful image edits;
- carrying the same face across iterative edits;
- carrying a product, package or garment across iterations;
- preserving the existing room, framing, light and perspective while changing one element;
- combining several role-specific references;
- product mockups and brand consistency;
- legible text and multilingual layouts;
- professional image production that benefits from reasoning before rendering.

### Watch out for

- quiet beautification: smoother skin, cleaner surfaces, tidier hair, more symmetrical faces;
- quiet re-composition: subject recentred, horizon corrected, visual clutter removed;
- brand bleed: the product logo or lettering appears on walls, cups, fabric or secondary objects;
- product duplication when the object is named repeatedly;
- over-designed output when the prompt includes too many style adjectives;
- identity drift when several face references compete instead of sharing one clear role;
- a “premium campaign” look replacing a candid or documentary brief.

### The one extra move

> Keep all prohibitions inline, keep logos small, and explicitly preserve the original imperfections.

Nano Banana Pro does not need a separate negative-prompt field for this workflow. State constraints inside the main instruction at the point where they matter.

---

## 2. The shared laws for both image models

These rules override ordinary long-form prompting whenever one or more reference images are attached.

### Law 1 — The golden rule of edit mode

**Name the ONE change, then lock everything else.**

Correct:

> Place the product bottle in the woman’s right hand at natural chest height. Keep her face, expression, hair, body, wardrobe, pose, room, furniture, lighting direction, shadows, colour grade, depth of field, grain, crop and framing exactly as in the scene image. Preserve the original skin texture and asymmetry. Do not retouch, recast, re-centre or redesign anything else.

Wrong:

> A woman in a bedroom holding a perfume bottle, with warm daylight, grey bedding, soft skin and a cinematic look…

The second prompt re-describes the image, so the model has permission to regenerate it.

### Law 2 — Reference by role, never by number

Both models receive a flat group of images. Mina must describe each reference by what it contributes:

- **the scene image** — composition, room, pose and light;
- **the face reference** — identity only;
- **the product reference** — exact geometry, material, colour and label;
- **the wardrobe reference** — garment construction and fabric;
- **the style reference** — tonal treatment or visual language only.

Never write “use image 2 for the face” or “copy image 4.” Numbering can be ambiguous after upload order changes.

Use a role declaration near the beginning:

> Reference roles: the scene image controls framing, pose, room and lighting; the face reference controls identity only; the product reference controls the bottle only. Do not transfer the face-reference background, wardrobe or lighting. Do not transfer product branding onto any other surface.

### Law 3 — Anti-duplication is the first safety check

Mention each object, prop and body part only once whenever possible.

Risky:

> Her right hand wraps around the jar, her fingers grip the jar, the jar sits between her fingers near her face.

Better:

> The woman holds the single jar naturally near her right cheek.

Risky repetition can cause:

- a second product;
- a third hand;
- duplicated jewellery;
- extra straps, collars or sleeves;
- multiple logos;
- repeated background props.

Describe the **relationship as one complete action**, not as a parts inventory.

### Law 4 — Preserve imperfection on purpose

Both models beautify and clean by default. Use this lock line whenever realism matters:

> Keep the original grain, skin texture, facial asymmetry, flyaway hairs, fabric creases, fingerprints, surface wear and imperfect framing. Do not smooth, retouch, clean, reshape, re-centre or beautify the image.

Only preserve imperfections that already exist or that belong physically in the scene. Do not add random dirt, grain, blur and scratches as a “realism filter.”

### Law 5 — One real light source

Name one motivated source before adding fills:

> Daylight from the window on camera-left is the only dominant source; weak neutral room bounce lifts the opposite cheek.

**Scene-edit exception:** when the user supplies a base scene and asks to keep it, do not design, infer, name, move or add lighting. Preserve the base image's exact brightness map, highlights, shadows and falloff. The inserted subject receives only that existing illumination; never import a reference image's key, fill, bounce, rim, glow or studio light.

This is stronger than:

> cinematic lighting, soft studio light, beautiful glow, rim light, volumetric light.

Every highlight, shadow, reflection and catchlight should point back to the same lighting plan.

### Law 6 — Negatives belong inline

Attach the constraint to the thing it protects:

> Preserve visible pores and faint under-eye texture; no plastic skin, no airbrushed smoothing and no beauty-filter glow.

> Keep the composition slightly off-centre with the original headroom; do not re-centre, crop tighter or correct the asymmetry.

> The product is the only branded object; no logo, label, lettering or readable symbol appears on the cup, wall, clothing, furniture or background.

A detached paragraph containing fifty generic negatives is weaker than a few precise locks placed beside the relevant instruction.

---

## 3. Start every prompt with an operation verb

Nano Banana Pro responds well when the first words define the task.

Use:

- **Create** — text-to-image from a blank canvas;
- **Edit** — change an existing scene;
- **Replace** — substitute one element;
- **Add** — introduce one object while preserving the scene;
- **Remove** — delete one element and reconstruct the background;
- **Combine** — merge role-specific references;
- **Restyle** — preserve content while changing visual treatment;
- **Localize** — preserve layout while changing language or cultural details;
- **Extend** — outpaint beyond the original frame.

Do not open an edit with an essay about the desired mood. The model needs the operation before the art direction.

---

## 4. Model-specific prompt structures

## A. Text-to-image generation without references

Use a narrative visual brief, not keyword soup.

### Formula

> **Create** + subject + action/pose + environment + composition + one lighting plan + material/texture truth + colour treatment + capture register + realism locks.

### Recommended order

1. Output format and aspect ratio.
2. Main subject and single readable action.
3. Location and relevant background activity.
4. Composition and perspective.
5. Lighting source and direction.
6. Material, skin, hair and wardrobe texture.
7. Colour grade and contrast hierarchy.
8. Capture device or photographic register.
9. Inline anti-beautify and anti-duplication constraints.

### Do not over-specify fake camera metadata

Terms such as “8K RAW, ISO 100, f/2, full-frame, 85mm” can help communicate a photographic register, but they are not magic quality tokens. Use only the details that produce visible consequences:

- 85mm → compressed portrait perspective;
- f/2 → shallow depth and narrow focus plane;
- direct phone flash → hard frontal shadow and rapid falloff;
- wide phone lens → near-field distortion and expanded background;
- medium-format editorial → controlled detail and smoother tonal separation.

Avoid stacking contradictory devices: “85mm intimate selfie, wide-angle distortion, deep focus and f/1.2.”

---

## B. Generation with references

Nano Banana Pro can work with multiple references, but Mina should use the **smallest sufficient set**. More images do not automatically create more fidelity; they can introduce competing instructions.

### Role declaration template

> Reference roles: the scene image controls composition, body pose, room and lighting. The face reference controls the woman’s identity only. The product reference controls the single bottle’s exact silhouette, proportions, cap, material, colour and label. The styling reference contributes only the muted cream-and-oxblood colour language; do not copy its person, room, props or layout.

### Relationship instruction

State how the assets meet:

> Combine the woman from the face reference with the pose and environment of the scene image, wearing the garment from the wardrobe reference and holding the single product from the product reference.

Then add boundaries:

> Preserve the scene image’s camera position and perspective. Do not blend facial features between references. Do not alter the product geometry to match the scene. Do not transfer the product logo to any secondary object.

### Reference budget

Although current Gemini 3 image workflows can accept a large reference set, prefer:

- 1 scene anchor;
- 1 face/identity anchor;
- 1 product anchor;
- 1 wardrobe anchor when necessary;
- 1 style anchor only when language cannot define the treatment.

Use additional references only when each has a unique named role.

---

## C. Edit mode

### The edit formula

> **Edit the scene image:** [one change]. [Integration instruction]. Keep [locked elements] exactly unchanged. Preserve [imperfections]. [Inline failure prevention].

### Minimal edit template

> Edit the scene image: replace the plain ceramic cup with the single perfume bottle from the product reference, standing upright in the same position and casting a shadow consistent with the window light. Keep the woman, her face, hands, pose, wardrobe, table, room, camera angle, crop, depth of field, colour grade and grain exactly unchanged. Preserve the original pores, flyaways, fabric creases and off-centre composition. The perfume bottle is the only branded item; no lettering or logo appears anywhere else. Do not add another bottle, hand or prop.

### Why short edit prompts win

An edit prompt is not a new art-direction brief. Every repeated scene detail becomes a variable the model may reinterpret. If an edit changes too much:

1. return to the last correct image;
2. reduce the instruction to one physical change;
3. strengthen the lock list;
4. remove all style synonyms;
5. make a second edit afterward rather than combining two changes.

---

## D. Text and typography

Nano Banana Pro is suitable for layouts, posters, packaging and localization, but text still requires discipline.

### Text rules

- Put required copy inside quotation marks.
- Write the exact hierarchy and line breaks.
- Describe position and relative scale.
- Keep the amount of text realistic for the canvas.
- Generate or approve the copy before asking for the final layout.
- Lock all spelling in follow-up edits.

Example:

> Create a 4:5 editorial poster. Render exactly three text lines: “FALTA” on line one, “OBJECTS OF LIGHT” on line two, and “DUBAI — 2026” on line three. Use uppercase condensed grotesk lettering, small scale, aligned to the lower-left safe margin. Do not add, translate, paraphrase or repeat any text.

### Small-logo rule

Large logos invite distortion and brand bleed. Keep a real logo at a believable printed or embossed scale and specify its single legal surface:

> The small “NYLA” mark appears once on the front medallion of the bottle only. It does not appear on the cap, box, table, wall, clothing or reflection.

---

## 5. Nano Banana Pro’s realism controls

### Skin

Do not request both “flawless porcelain skin” and “ultra-detailed real pores.” Decide whether the brief is polished beauty or documentary realism.

For a premium but real editorial portrait:

> Naturally even fair skin with visible cheek and nose pores, faint tonal variation beside the nostrils, subtle under-eye texture and restrained dewy highlights only where the frontal soft source catches the skin. No waxy surface, pore erasure, face reshaping or uniform glow.

### Hair

> Individual strands at the silhouette, denser grouped waves through the body, a few flyaways crossing the temple, natural root variation and slight asymmetry between both sides. Do not render every strand equally sharp or turn the hair into a smooth helmet.

### Fabric

> The oversized cotton T-shirt hangs from the shoulders with gravity-led folds, slight collar stretch and small compression creases where the necklace rests. Preserve cotton texture; no plastic sheen or impossible symmetrical folds.

### Reflective products

Describe what the object reflects, not “perfect chrome”:

> The chrome bottle carries one broad softbox reflection, a narrow dark studio flag and a faint red-background reflection along its edge. Reflections follow the bottle curvature and do not contain extra logos or duplicate objects.

### Off-centre composition

> Keep the woman slightly right of centre with more negative space on camera-left, imperfect but intentional headroom and one shoulder cropped closer to frame edge. Do not auto-centre or make both shoulders symmetrical.

---

## 6. Failure diagnosis and repair prompts

### Failure: face became prettier but less faithful

Repair:

> Restore the exact identity, facial proportions and asymmetry from the face reference. Keep the current pose, wardrobe, room and light unchanged. Remove beauty-filter smoothing and facial idealization; restore real pores, the original eye spacing, nose shape, jaw width and uneven flyaway pattern. Do not redesign the face.

### Failure: product multiplied

Repair:

> Keep one product bottle only: the single bottle already held by the woman. Remove every duplicate bottle and reconstruct the background naturally. Keep her body, hand position, face, room, framing and lighting unchanged. Do not add any new prop.

### Failure: logo spread to the set

Repair:

> Keep the brand mark once on the bottle’s front medallion only. Remove all text, lettering, logos and symbols from the table, wall, fabric, cup, reflection and background. Preserve all other pixels and the existing composition.

### Failure: image became warm and glossy

Repair:

> Keep the scene and subject unchanged. Correct only the colour treatment to neutral white balance: whites remain clean ivory rather than yellow, skin stays natural, shadows stay neutral greige and highlights roll softly without HDR glow. Remove orange warmth, glossy beauty lighting and global bloom. Preserve the original grain and contrast structure.

### Failure: model re-centred the subject

Repair:

> Restore the previous off-centre crop exactly: subject right of centre, original negative space on camera-left, original headroom and shoulder crop. Change no other element. Do not reframe, straighten or rebalance the composition.

### Failure: hand anatomy broke during product placement

Do not describe fingers individually. Re-run from the last clean image:

> Place the single bottle naturally in her right hand at chest height, with a physically relaxed grip and the wrist aligned to the forearm. Keep the existing hand anatomy and body pose. Do not add or expose extra fingers, hands or duplicated jewellery.

---

## 7. Mina workflow: generate, select, then edit

### Pass 1 — Establish the base

Generate the scene without unnecessary product integration. Get these right first:

- identity;
- pose;
- framing;
- light;
- environment;
- wardrobe;
- overall texture.

### Pass 2 — Lock the base

Select one image and treat it as the new **scene image**. Do not continue regenerating from the original text prompt.

### Pass 3 — Add one asset

Add the product or graphic using one-change edit mode.

### Pass 4 — Correct one failure at a time

Examples:

- correct logo;
- restore pores;
- neutralize warmth;
- remove duplicate object;
- fix text;
- extend canvas.

Never combine five repairs into one follow-up unless all are inseparable parts of one change.

---

## 8. Prompt examples

### Example 1 — Original lifestyle portrait

> Create a 4:5 ultra-realistic lifestyle portrait of a young woman seated outdoors at a modern café, wearing a plain black cap and casual black cotton outfit, holding one clear plastic cup of iced green matcha latte with a straw. Long straight reddish-brown hair, light freckles, natural makeup and a slightly thoughtful pout as she looks beyond camera-right. Contemporary apartment buildings, metal café chairs and large white patio umbrellas behind her in soft daylight. Medium close-up, slightly off-centre composition, realistic 50mm-equivalent perspective, shallow but plausible depth of field. One open-sky daylight source with soft umbrella bounce. Preserve visible pores, flyaways, cup condensation, tiny fingerprints and fabric creases; no airbrushed skin, no HDR glow, no perfect symmetry, no extra cup, no duplicated straw and no readable brands.

### Example 2 — Fashion editorial generation

> Create a full-body fashion portrait in a minimalist studio with a soft limestone-beige background. One young woman wears a loose beige trench jacket over an oversized white shirt dress, one brown necktie layered with one dark green necktie, knee-high cream socks, tan suede boots and a beige newsboy cap. She carries one dark-brown leather handbag with a small heart charm. Relaxed asymmetrical stance, weight settled onto the rear leg, shoulders slightly uneven, gaze just past the lens. Soft daylight-shaped studio source from camera-left with weak neutral fill; warm-ivory highlights, neutral greige shadows and one dark-brown anchor. Slightly off-centre full-body composition with breathing room around the silhouette. Preserve real suede nap, cotton creases, leather grain, natural skin pores and loose hair strands; no plastic skin, no polished CGI materials, no duplicated ties, handbag, limbs or charms, and no invented logos.

### Example 3 — One-change edit

> Edit the scene image: place the single bottle from the product reference naturally in the woman’s right hand near her lower chest, front face readable but not enlarged. Match its scale, perspective, contact shadow and reflections to the existing café light. Keep her exact face, expression, hair, body, left hand, wardrobe, pose, table, background, light, crop, depth of field, colour grade and grain unchanged. Preserve the original pores, flyaways, fabric folds, cup condensation and off-centre framing. Do not retouch, beautify or re-centre. The bottle is the only branded item; no logo or text appears on any other object. Do not add a second bottle, hand, finger, necklace or prop.

---

# Full production-grade Nano Banana Pro example

The following is a complete reference-driven prompt designed for a calm, fashion-forward beauty campaign while retaining believable texture.

> **Create** a vertical 4:5 ultra-realistic luxury beauty editorial using the attached references.
>
> **Reference roles:** the face reference controls the model’s identity, facial proportions, dark-brown shoulder-length wavy hair and natural asymmetry only. The pearl-necklace reference controls the single chunky irregular baroque pearl necklace only. The styling reference contributes only its calm minimalist fashion language and deep-crimson-with-ivory colour relationship; do not copy its person, pose, room, props or text.
>
> **Subject and wardrobe:** one young adult woman with shoulder-length dark-brown wavy hair, thick natural brows, subtly defined eyes, glossy nude lips and naturally fair skin. She wears one oversized plain white heavyweight-cotton crew-neck T-shirt and the single baroque pearl necklace. Calm, self-possessed editorial expression, direct eye contact, slight head tilt and relaxed uneven shoulders. She is posed naturally rather than perfectly symmetrical.
>
> **Composition:** medium close-up from upper chest upward, the woman placed slightly right of centre with controlled negative space on camera-left. Camera at eye level with an 85mm portrait perspective: gentle facial compression, no wide-angle distortion. Focus is sharpest on the nearer eye and pearl edges, with a gradual falloff through the hair and shoulders. Do not crop the necklace awkwardly or centre the face automatically.
>
> **Environment:** seamless deep crimson studio backdrop with no visible horizon, texture, lettering or props. The background is matte and absorbs light rather than glowing digitally.
>
> **Lighting:** one large diffused frontal key positioned slightly camera-left and above eye level, with a weak neutral white bounce from camera-right. No separate rim light. The key creates one coherent pair of catchlights, soft cheek modelling, a gentle shadow under the jaw and luminous but physically plausible pearl reflections. The white T-shirt retains weave and folds in its bright areas; no clipped white patch.
>
> **Skin and hair realism:** preserve visible cheek and nose pores, subtle tonal variation beside the nostrils, faint under-eye texture, a small amount of natural forehead sheen and non-identical left/right facial structure. Hair has grouped waves, realistic root density, several flyaways at the silhouette and slightly more volume on one side. No airbrushed smoothing, pore erasure, waxy skin, face reshaping, perfect symmetry or beauty-filter glow.
>
> **Material realism:** the T-shirt is matte heavyweight cotton with a slightly stretched collar and gravity-led folds. Each baroque pearl has irregular shape, nacre variation and a different highlight orientation; the necklace is one continuous object and appears once. No duplicated pearls floating away from the strand, no extra necklace and no jewellery added elsewhere.
>
> **Colour grade:** neutral white balance with the crimson backdrop remaining deep red rather than orange. Warm-ivory highlight roll-off on skin, cotton and pearls; natural peach-neutral skin midtones; neutral greige micro-shadows; one clean deep-crimson anchor. High editorial contrast but no crushed blacks, orange warmth, HDR local contrast, global bloom or glossy commercial over-polish.
>
> **Capture register:** premium full-frame fashion portrait with restrained editorial finishing, fine natural grain and realistic optical depth. Magazine-quality detail comes from coherent light, material texture and controlled focus—not artificial sharpening or “8K” texture pasted uniformly over the image.
>
> **Hard locks:** one woman, one T-shirt and one necklace only. No logo, text, magazine masthead, earrings, rings, extra jewellery, duplicate body parts or secondary props. Keep the frame calm, minimally styled and slightly imperfect. The result should feel like a real fashion photograph made by a disciplined studio team, not an AI beauty render.

---

## 9. Current capability note

As of July 2026, Google describes Gemini 3 Pro Image / Nano Banana Pro as its premium reasoning-driven image model for professional editing, complex graphic design, product mockups, text rendering, brand consistency and precision creative control. Gemini’s current image guidance supports conversational multi-turn editing and role-specific multi-image workflows. Mina should still prefer a small, clearly assigned reference set rather than using the maximum merely because it is available.
