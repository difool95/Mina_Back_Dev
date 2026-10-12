# GPT Image 2 — How to Use for Mina

Use this file when Mina is generating or editing images with **GPT Image 2 / Creative Lane**.

GPT Image 2 is Mina’s **creative construction and precision-compositing model**. Route work here when the task demands unusually strong instruction following, readable text, complex layouts, factual or culturally informed scene construction, several concepts combined coherently, or a tightly localized edit using a selected/masked region.

Use Nano Banana Pro instead when the highest priority is repeated face/product continuity across many quiet edits, or when beauty/fashion wording repeatedly triggers a refusal and a neutral reframe does not resolve it.

Load the relevant Mina layers as needed:

- `realism-best-practice.md` for physical and temporal truth;
- `editorial-still-life.md` for refined fashion/product art direction;
- `iphone-aesthetic.md` for candid smartphone images;
- `camera-angles-and-movements.md` for composition, lens and perspective.

---

## 1. Mina routing card

### Best at

- precise instruction following;
- creative concepts that combine several visual ideas;
- complex compositing and world construction;
- readable typography, posters, diagrams and editorial layouts;
- multilingual text;
- using general/world knowledge to make a scene coherent;
- high-fidelity image inputs;
- localized editing with a selected or masked region;
- flexible image sizes and high-quality final assets;
- converting rough references into a polished art-directed result.

### Watch out for

- strict moderation around sexualized, age-ambiguous, body-focused or fetishized beauty/fashion wording;
- unnecessary warm, glossy, “premium” polish;
- skin smoothing and idealized symmetry;
- over-composed framing when candid imperfection was requested;
- duplicate objects or limbs caused by repeated nouns;
- text being added when the prompt casually mentions a magazine, campaign, cover or poster;
- a mask being treated as guidance rather than a mathematically exact boundary;
- style words overpowering the literal scene.

### The one extra move

> Phrase beauty and fashion as neutral editorial art direction, then explicitly force “neutral white balance, no warm grade, no glossy beauty finish.”

When a safe fashion request is blocked, remove body-evaluative language and rewrite around:

- adult subject;
- garment construction;
- pose and expression;
- camera and composition;
- material texture;
- lighting;
- editorial context.

Do not try to evade legitimate safety boundaries. Reframe the same safe creative intent in professional production language. If the model still refuses a harmless beauty/fashion operation, route the task to Nano Banana Pro.

---

## 2. The shared laws for both image models

These laws are mandatory whenever references or edits are involved.

### Law 1 — One edit, then lock everything else

Correct:

> Place the single bottle in her right hand. Keep her face, expression, hair, body, wardrobe, room, light, shadows, framing, depth of field, grain and colour exactly as in the scene image. Preserve the original imperfections; do not retouch or re-centre.

Wrong:

> Recreate this woman in the same beautiful room, wearing the same outfit and holding a perfume bottle…

The wrong version asks for regeneration, not editing.

### Law 2 — Name references by role

Use:

- the scene image;
- the face reference;
- the product reference;
- the wardrobe reference;
- the layout reference;
- the style reference.

Never depend on upload position or “image 1/image 2.”

Start with:

> Reference roles: the scene image controls composition, pose, environment and light; the face reference controls identity only; the product reference controls the single product only.

### Law 3 — Mention each thing once

GPT Image 2 is a strong instruction follower, which means repeated nouns can be interpreted as repeated requirements.

Bad:

> Her hand holds the bottle; the fingers grip the bottle; the bottle is near her face.

Good:

> The woman holds the single bottle naturally near her right cheek.

Count before sending:

- number of people;
- number of visible hands;
- number of products;
- number of accessories;
- number of text blocks;
- number of light sources.

If the prompt accidentally describes two, the model may render two.

### Law 4 — Lock real imperfections

> Keep the original grain, pores, facial asymmetry, under-eye texture, flyaway hairs, clothing creases, fingerprints, surface wear, imperfect crop and uneven background spacing. Do not smooth, retouch, clean, beautify, straighten or re-centre.

This lock is especially important because GPT Image 2 can turn an ordinary reference into a warm polished campaign unless told not to.

### Law 5 — Negatives are ordinary language

There is no need to write a detached keyword cloud. Use direct sentences:

> The image remains a rushed smartphone snapshot: no studio lighting, no cinematic grade, no clean beauty portrait, no sharp frozen face and no professional retouching.

> The background contains no readable text, logos, signs or invented brands.

### Law 6 — One motivated lighting system

A single dominant light makes the image easier to reason about:

> The phone flash is the only dominant source, firing from near the lens; ambient street light is weak and remains several stops darker.

or:

> Overcast daylight from the café opening is the only dominant source; pale walls provide soft neutral bounce.

Avoid “soft front light, golden backlight, cinematic rim light, window light and flash” unless the scene physically contains all of them.

---

## 3. GPT Image 2 prompting modes

## A. Text-to-image from a blank canvas

### Formula

> **Create** + final medium + subject + readable action + environment + composition + lighting + material/texture + colour pipeline + capture imperfections + hard exclusions.

### What GPT Image 2 responds to well

- clear hierarchy;
- paragraph structure;
- exact spatial relationships;
- explicit counts;
- exact quoted text;
- causal descriptions;
- an explanation of what makes the image belong to its genre.

It does not require every prompt to be extremely long. Length is useful only when each sentence controls a different visible decision.

### Use declarative language

Strong:

> A single adult woman walks past the camera in half-profile while turning her head slightly toward the lens.

Weak:

> Maybe she could be sort of walking, almost candid, possibly turning a little.

### Give blur a physical cause

Strong:

> The photographer pans too late while she continues walking, producing directional blur and a faint trailing ghost along the moving hair and shoulders; the tiled wall stretches horizontally while the flash freezes only small highlight edges.

Weak:

> heavy blur, blurry aesthetic, motion blur everywhere.

---

## B. Reference-driven generation and compositing

### Declare the roles before the scene

> Reference roles: the face reference supplies identity and hairstyle only. The product reference supplies the exact jar, cap, label and colour only. The location reference supplies the tiled Tokyo wall and pavement geometry only. Build a new original photograph combining those roles; do not copy clothing, lighting or pose from references unless assigned.

### Use relationship language

> Place the single product from the product reference on the café table in front of the adult woman from the face reference, photographed with the camera position and daylight logic of the location reference.

### Protect originality when inspiration is broad

When the request uses a person image only for broad aesthetics rather than identity:

> Use the attached portrait only as broad inspiration for hairstyle, facial proportion category and natural styling. Generate an original non-identifiable adult subject; do not copy or closely reproduce the person’s face.

When identity continuity is desired and permitted, say so plainly instead of mixing “same person” and “original person.”

### Compositing checks

The inserted element must inherit:

- scale;
- perspective;
- lens distortion;
- focus depth;
- light direction;
- shadow softness;
- colour contamination;
- reflective environment;
- surface contact;
- grain and compression.

Do not merely say “make it blend naturally.” Name the relevant mechanisms.

---

## C. Edit mode without a mask

Use the same golden-rule structure:

> Edit the scene image: [one change]. Integrate it through [scale/light/contact instruction]. Keep [everything else] exactly unchanged. Preserve [imperfections]. Do not [specific failure].

Example:

> Edit the scene image: change the oversized sweatshirt from charcoal grey to faded forest green while preserving its exact knit texture, folds, fit and shadows. Keep the woman’s face, skin, hair, hands, pose, expression, room, shelves, bottles, light, crop, focus and warm-neutral grade exactly unchanged. Preserve pores, flyaways and fabric wear. Do not alter her body, add accessories or clean the background.

---

## D. True localized/masked editing

GPT Image 2 supports image edits with a mask or selected region. Treat the mask as a strong guide, not an infinitely precise cut path.

### Mask workflow

1. Select only the region that genuinely needs change.
2. Keep the mask slightly inside hard identity-critical edges when possible.
3. Describe the one replacement or repair.
4. Lock the unmasked scene in words as well.
5. Check boundary transitions: hair edges, shadows, reflections, fabric folds and background lines.

### Mask prompt template

> Replace only the selected region with one small clear glass perfume bottle standing upright on the marble tray. Match the existing 50mm perspective, shallow focus, window light from camera-left, contact shadow, warm-ivory highlight roll-off and fine grain. Leave every unselected area exactly unchanged, including the woman, hands, furniture, plant, books, crop and colour grade. The bottle appears once and its small front label appears once; no branding is added elsewhere.

### When a masked edit leaks

Repair with a smaller second selection rather than re-running the whole image:

> Correct only the selected boundary: continue the original hair strands and background blur through this edge. Do not alter the face, hairstyle, shoulder or surrounding light.

---

## E. Text, layouts and posters

GPT Image 2 is a strong choice when typography is central.

### Text-first method

1. Finalize the exact copy.
2. Define the hierarchy.
3. Define line breaks and alignment.
4. Define font category and weight.
5. Define the safe area.
6. Ask for no additional text.

Example:

> Create a vertical 4:5 modernist fashion poster with a cream background, one black-and-white portrait occupying the right two-thirds and exactly three text elements on the left: “FALTA” in large black uppercase neo-grotesk; “OBJECTS OF LIGHT” beneath it in smaller uppercase; “DUBAI 2026” at the bottom-left in tiny monospaced type. Preserve these exact words and spelling. No other letters, captions, logos, pseudo-text or watermark.

### Magazine warning

The phrase “magazine cover quality” may cause invented mastheads and cover lines. For an image without text, write:

> Editorial portrait suitable for a magazine feature, but the image itself contains no masthead, headlines, captions, border or typography.

---

## 4. Neutralizing GPT Image 2’s warm glossy polish

Use this block whenever the brief is candid, documentary, cool, neutral or understated:

> Neutral white balance. Whites remain clean white or restrained ivory rather than yellow. Skin retains natural undertones without orange warmth. Shadows remain neutral or faintly cool. No golden wash, no amber grade, no HDR glow, no global bloom, no glossy beauty finish, no excessive micro-contrast and no commercial skin retouching.

### For fashion editorial rather than beauty-ad gloss

> Calm editorial finishing with controlled texture and a long highlight roll-off. The face is not globally luminous; highlights occur only where the real source catches forehead, cheekbone and lip. Keep visible pores and tonal variation. No ring-light circles, porcelain smoothing or uniform dewy sheen.

### For raw smartphone photography

> Preserve phone noise, clipped flash highlights, deep ambient shadows, imperfect framing, local motion blur and limited dynamic range. Do not rescue shadow detail, create cinematic bokeh or add a polished colour grade.

---

## 5. Moderation-safe professional fashion language

Use adult, neutral, production-oriented descriptions.

### Prefer

- “adult fashion model”;
- “editorial portrait”;
- “tailored silhouette”;
- “relaxed pose”;
- “garment fit and material”;
- “beauty campaign focused on skincare texture”;
- “tasteful luxury-jewellery editorial”;
- “shoulders angled toward camera”; 
- “calm confident expression.”

### Avoid unnecessary body evaluation

- “perfect body”;
- “seductive young girl”;
- “barely legal” or age-ambiguous language;
- fetishized body-part focus;
- explicit undressing instructions when the visual goal can be expressed through wardrobe;
- “sexy” as a substitute for actual art direction.

For a safe luxury portrait, describe the clothes, pose, crop, expression, lighting and material. That produces better images and fewer ambiguous safety signals.

---

## 6. Realism controls for GPT Image 2

### Face

> Adult woman with naturally asymmetrical features, one eyebrow slightly higher, realistic eye moisture, visible pores around the nose and cheeks, faint under-eye darkness and non-uniform lip texture. Do not idealize, symmetrize or smooth the face.

### Candid expression

> The smile begins unevenly at one corner of the mouth, cheeks lift at slightly different heights and the eyes narrow naturally. It is a passing reaction, not a held advertisement smile.

### Motion blur

> Directional blur follows her left-to-right movement. Hair tips and the trailing shoulder blur more than the near eye; flash produces a few sharper highlight edges within the otherwise blurred face. Background tile lines streak in the same direction. No radial zoom blur.

### Flash physics

> Small on-axis phone flash creates hard-edged shadows immediately behind nearby forms, abrupt falloff with distance, bright forehead and T-shirt peaks, red-eye-free catchlights and a dark background beyond flash range.

### Café daylight

> Soft open-shade daylight enters from the street side, with slightly cooler window reflections and warmer skin midtones produced by the café interior. Glassware catches narrow real highlights; the phone screen stays dark unless specified.

### Fabric and products

> The grey sweater has visible knit loops, pilling at the cuff and compressed folds under the supporting elbow. The glass product has a real base thickness, one coherent reflection of the window, a faint fingerprint and a contact shadow. No CGI-perfect surfaces.

---

## 7. Failure diagnosis and repair prompts

### Failure: output became a warm beauty campaign

> Change only the colour and finishing: neutral white balance, no amber cast, no golden skin, no global bloom and no glossy beauty retouching. Restore visible pores, under-eye texture, phone noise and the original imperfect crop. Keep the subject, pose, wardrobe, background and light direction unchanged.

### Failure: model added magazine text

> Remove every masthead, headline, caption, border, logo and pseudo-letter from the image. Reconstruct the background naturally. Keep the portrait, crop, lighting, colour, grain and all physical elements unchanged. The final image contains no text.

### Failure: duplicate product or hand

> Keep the one product already held near her face and the two anatomically correct hands already belonging to the woman. Remove every duplicate product, hand, finger cluster or floating accessory and reconstruct the hidden background. Change nothing else.

Note: In a fresh prompt, avoid saying “hand” repeatedly. The repair prompt may need to identify the defect, but the next clean generation should describe one complete holding action.

### Failure: edit changed the face

> Restore the exact face from the scene image, including eye spacing, nose, jaw, mouth shape, asymmetry, pores and expression. Keep the requested product edit. Do not beautify, reinterpret or blend the identity with any other reference.

### Failure: candid flash image became too sharp

> Preserve the same subject and scene, but restore physically directional motion blur caused by the walking subject and late handheld pan. The face remains recognizable but not cleanly frozen; hair, shoulders and tiled wall trail left-to-right. Keep harsh on-axis flash peaks, deep ambient darkness and strong phone noise. No studio sharpness or cinematic stabilization.

### Failure: mask boundary looks pasted

> Edit only the selected seam so perspective, grain, blur, light falloff and background lines continue naturally across the boundary. Do not alter the inserted object or any unselected region.

---

## 8. Mina workflow for GPT Image 2

### Route here first when

- the concept requires several ideas to coexist;
- typography must be readable;
- a selected region needs replacement;
- a poster, diagram, spread or branded layout is required;
- world knowledge or culturally specific details matter;
- the user gives a dense but internally consistent art-direction brief.

### Build in passes

1. **Concept pass:** establish scene, composition and visual hierarchy.
2. **Identity/product pass:** add role-specific references only after the base works.
3. **Text pass:** insert exact approved copy.
4. **Localized repair pass:** mask one error at a time.
5. **Finishing pass:** neutralize unwanted warmth, restore texture and lock imperfections.

### Route to Nano Banana Pro when

- the same person or product must survive many successive edits and GPT Image 2 keeps recasting it;
- the task is a quiet one-object edit rather than a new creative construction;
- safe fashion/beauty wording remains blocked after a professional neutral rewrite;
- GPT Image 2 keeps replacing the scene instead of preserving it.

---

## 9. Prompt examples

### Example 1 — Calm café portrait

> Create a vertical 4:5 natural lifestyle portrait of one adult woman seated at an outdoor Paris café. Dark hair tied back with sunglasses resting on top of her head, green eyes, minimal makeup, naturally dewy skin and lightly flushed cheeks. She wears one loose grey knit sweater and rests the side of her face on one hand, looking calmly toward the camera. Open-shade daylight from the street is the only dominant source. Reflections of Haussmann-style buildings appear softly in the glass behind her. On the table: one water glass and one dark phone, both partially cropped. Intimate 50mm perspective, shallow but realistic depth, slight foreground blur from the glass rim and an off-centre composition. Neutral white balance with restrained warm skin midtones, no golden-hour wash, no glossy beauty grade. Preserve pores, under-eye texture, flyaways, sweater pilling, glass fingerprints and imperfect table clutter. No extra hands, glassware, phone, sunglasses, text, masthead or logo.

### Example 2 — Wide-lens fashion portrait

> Create a vertical 3:4 modern fashion portrait of one adult woman leaning toward the camera in a clean white corner studio. She wears one brown leather jacket over a pale outfit, white trousers and dark-brown boots; hair in two braids, minimal makeup and a calm direct gaze. Camera very close at approximately 24mm, producing believable near-field enlargement of the face and shoulders while the legs recede. Centred but not perfectly symmetrical, one boot cropped near the lower edge. Large diffused daylight source from camera-left, soft neutral shadows, clean white balance and no warm glossy grade. Preserve leather grain, cotton creases, pores and small flyaways. No extra braids, limbs, boots, jewellery, text or props.

### Example 3 — One-change edit

> Edit the scene image: place the single product from the product reference upright on the empty table area beside the water glass, scaled correctly for the 50mm perspective and softly out of focus because it sits just behind the focal plane. Match the existing open-shade daylight, contact shadow, window reflection, colour balance, grain and compression. Keep the woman, face, hand, expression, hair, sunglasses, sweater, chair, glass, phone, reflections, crop and depth of field exactly unchanged. Preserve pores, flyaways, sweater pilling, fingerprints and imperfect composition. Do not retouch or re-centre. The product appears once and its logo appears only on its front; no text or branding appears elsewhere.

---

# Full production-grade GPT Image 2 example

This example targets the raw candid smartphone register and deliberately resists GPT Image 2’s tendency toward polished warmth.

> **Create** an ultra-realistic vertical 9:16 candid smartphone photograph of one original, non-identifiable adult woman walking at night on a quiet Tokyo sidewalk beside a building faced with small white ceramic tiles.
>
> **Reference role:** use the attached portrait only as broad inspiration for the category of hairstyle, general facial proportions and natural understated styling. Generate an original adult subject; do not copy, closely reproduce or identify the person in the reference. Do not transfer the reference background, clothes, pose or lighting.
>
> **Subject:** one adult woman with long layered chestnut-brown hair, soft curtain bangs, fair natural skin, hazel-green eyes and minimal everyday makeup. She wears one plain fitted white short-sleeve cotton T-shirt with no logo, graphic, jewellery, outerwear or accessories.
>
> **Action and expression:** she continues walking from camera-left toward camera-right, body remaining in half-profile. During the step she turns her head only slightly toward the photographer and gives a brief uneven natural smile, warm but not posed. Her weight is visibly transitioning onto the forward foot; the trailing shoulder and hair continue moving after the head turn. She is not standing still for a portrait.
>
> **Composition:** rushed handheld framing from approximately chest height using a modern phone’s main wide camera. The subject sits too close to the right edge and is nearly leaving the frame. One shoulder is partially cropped; headroom is slightly tight; the vertical tile seams are not perfectly level. Do not centre, straighten, balance or beautify the composition.
>
> **Motion physics:** the subject moves left-to-right while the photographer pans late in the same direction. This creates strong directional motion blur through the hair, jaw, white T-shirt and arms, with a faint trailing ghost behind the moving silhouette. The tiled wall stretches into horizontal light bands in the same direction. The face remains recognizable but is not clean or studio-sharp; the near eye and a few flash highlights are momentarily more defined than the moving hair. No radial zoom blur and no arbitrary blur applied equally to static and moving areas.
>
> **Lighting:** the phone flash close to the lens is the only dominant source, firing mid-motion. It produces harsh frontal highlights on the forehead, nose, cheek and white T-shirt, rapid falloff across the body, hard offset shadows on the nearby tiled wall and deep darkness beyond flash range. Weak existing street ambience contributes only faint cool-grey information in the far background. No softbox, beauty light, cinematic rim light or golden ambient glow.
>
> **Image texture:** high ISO phone noise, limited dynamic range, mild colour-channel noise in the shadows, clipped white peaks on parts of the T-shirt, slight JPEG/social compression and imperfect local sharpening around a few edges. Preserve natural pores where visible, uneven hair strands, real cotton wrinkles and the accidental quality of a single hurried exposure. No airbrushed smoothing, clean beauty face, HDR recovery, fake film border or polished editorial retouching.
>
> **Colour:** neutral-to-cool white balance. The tiled wall reads cool white, skin remains natural rather than orange, ambient darkness is cool neutral and the flash-lit T-shirt is harsh white rather than creamy yellow. No warm grade, no amber wash, no teal-orange cinema treatment, no global bloom and no luxury gloss.
>
> **Background:** white ceramic tile wall continues along the sidewalk; minimal unreadable street detail disappears into darkness. No neon shop signs, vehicles dominating the frame, crowds, advertisements, legible text or invented brands.
>
> **Hard count and exclusions:** one woman only, two normal arms belonging to her, no visible extra person, no duplicate face, no extra hand, no bag, no jacket, no hoodie, no necklace, no product and no text. The final result must feel like a genuine spontaneous phone snapshot captured while passing—not a fashion campaign pretending to be candid.

---

## 10. Current capability note

As of July 2026, OpenAI describes GPT Image 2 as its state-of-the-art image generation and editing model with text-and-image input, high-fidelity image processing and flexible output sizes. OpenAI’s current image APIs support both full-image edits and mask-guided localized edits; masks guide the model but are not guaranteed to behave as exact vector boundaries. ChatGPT Images 2.0 is positioned for stronger visual precision, multilingual text, complex layouts, realism and creative construction. Mina’s practical routing and failure rules above include observed workflow behavior in addition to official capabilities.

---

## 11. GPT Image 2.5 — Sunburst and Flare (September 2026)

Mina's Creative lanes run on **GPT Image 2.5 Flare** (`gpt-image-2.5-flare`): **Creative = Flare**, and **Creative+** (the pill's second press, admin-only) opens on Flare too — it is the lane an admin re-points in GenCost to trial another engine. Sunburst (`gpt-image-2.5-sunburst`) and GPT Image 2 stay selectable there as manual choices. Everything below applies to both lanes.

- **Two snapshots, one architecture.** Sunburst is the most capable (editing precision, instruction following, typography); Flare is the fastest (about 1.5–2× quicker) at the same quality tiers. Token consumption is identical, so the two lanes cost the same to render.
- **Quality tiers `xhigh` and `max`.** New on 2.5 (GPT Image 2 stops at `high`). Mina renders both Creative lanes at **`max`** — the highest-fidelity tier, with the most output tokens. It spends more of the budget on fine texture, small text and material detail, so prompts can lean on legibility and micro-detail more than before.
- **Same 2K canvas.** The master stays 2048 px on the long edge (the 4K canvas is available on the API but is not used — it doubles the render cost). Custom sizes are any multiple of 16 px between 1:3 and 3:1.
- **`input_fidelity: "high"` on edits.** Reference images (product, face, logo) are reproduced with more of their own detail intact. Mina sends it on every 2.5 edit.
- **Up to 16 input images per edit** (GPT Image 2 took 10).
- **Text rendering is stronger.** Long multilingual copy, dense layouts and small labels come out cleaner — the "readable typography" mode in section E is the one that benefits most. The warm-gloss and skin-smoothing cautions in sections 4 and 6 still hold.
- **Moderation and refusals behave the same** as GPT Image 2; the safety-language rules in section 5 are unchanged.
