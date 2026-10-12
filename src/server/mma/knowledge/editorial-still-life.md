# Editorial Still Life — Adaptive Prompt Formula

Use this module when a product, accessory, garment, flower, food object or designed object should feel like a fashion-magazine still life rather than an e-commerce packshot or conventional luxury advertisement.

The user's explicit visual instructions always win.

## Prompt formulas

- **Editorial Still Life | Editorial idea | Prompt formula:** Treat [hero object] as part of a fashion-editorial visual sentence expressing [restrained desire / intimacy / tactile curiosity / ritual / fragility / graphic tension / surreal calm / controlled disorder]. Keep the object recognizable while avoiding a centered e-commerce presentation.

- **Editorial Still Life | Tonal family| Prompt formula:** Build the frame around [dominant tonal family], preserving distinct neutrals and accurate product colour. Highlights roll gently into [ivory / pearl / champagne / cool white .. etc], shadows remain [neutral greige / faintly cool / deep tobacco / graphite .. etc], and one clean dark anchor prevents the image from becoming washed out.

- **Editorial Still Life | Visual tension| Prompt formula:** Create intentional tension through [asymmetric placement / partial occlusion / severe crop / interrupted symmetry / oversized negative space / diagonal shadow / reflection-led composition / object near frame edge]. The imbalance must feel chosen, not random.

- **Editorial Still Life | Sharp anchor and softness | Prompt formula:** Keep [one exact feature] critically sharp as the visual anchor while [foreground layer / background plane / rear edge / reflected copy] falls away gradually through physically coherent depth of field or optical diffusion. No uniform dreamy blur, missed focus or artificial cutout edges.

- **Editorial Still Life | Highlight treatment | Prompt formula:** Bright values roll into [warm ivory / pale champagne / pearl / clean cool white ...etc] with preserved texture and a long soft highlight shoulder. Apply restrained localized bloom only around true specular sources. Do not apply a global cream, yellow, sepia or beige filter.

- **Editorial Still Life | Haze, bloom or flare | Prompt formula:** Use [thin atmospheric haze / localized bloom / faint halation etc..] only where [backlight, bright reflection or lens angle] physically supports it. Keep the hero object readable and the foreground sufficiently crisp. No whole-frame fog or glow around every edge.

- **Editorial Still Life | Lighting architecture | Prompt formula (new compositions only):** Light [hero object] with one [large soft / narrow hard / side-back / frontal flash] source from [direction], supported by [controlled fill or bounce ..etc] and [negative fill] to restore shape. Define one coherent reflection shape on glass, metal or lacquer instead of generic CGI shine.
- **Editorial Still Life | Scene-edit exception:** If a base scene must be preserved, do not apply the lighting formula above. Keep its existing brightness map, highlights, shadows and falloff exactly; do not infer a direction or add key, fill, bounce, rim, glow or studio light. Reference objects contribute identity and material only.

- **Editorial Still Life | Reflection design | Prompt formula:** Reflect only the described set through [broad bright strip / narrow dark edge / soft rectangular source / curved highlight sweep / tiny hard specular ..etc]. Keep reflections stable, geometrically coherent and free from duplicated labels, invented rooms or random scenery.

- **Editorial Still Life | Product truth | Prompt formula:** Preserve the exact [shape, proportions, colour, material, label, cap, construction and liquid level] of [reference product]. Keep gravity, contact, refraction, reflections and typography stable. The hero product remains the only branded object unless the user specifies otherwise.

- **Editorial Still Life | Set styling | Prompt formula:** Build the set from [two dominant materials] and [one restrained accent]. Keep all secondary surfaces plain and text-free. Use fewer, stronger styling decisions rather than stacking multiple luxury-coded props.

- **Editorial Still Life | Physical contact and weight | Prompt formula:** [Hero object] rests or moves with believable weight, exact contact area, a narrow occlusion shadow and stable gravity. Any fabric, paper, liquid, hand or prop responds only to visible force, support, airflow or contact. No levitation, floating product or unsupported movement.

- **Editorial Still Life | Controlled imperfection | Prompt formula:** Preserve [two or three scene-specific imperfections] such as [faint fingerprint / dust fibre / irregular crease / condensation trail / chipped edge / lifted paper corner / subtle film grain ..etc]. Keep them sparse, physically located and stable across frames.

- **Editorial Still Life | Still-image camera direction | Prompt formula:** Frame in [format and crop] from [camera height and angle] using [lens range or perspective]. Focus exactly on [sharp plane], allow gradual falloff toward [foreground and background], and compose with [editorial tension device]. Avoid ultra-wide distortion unless it is the concept.

- **Editorial Still Life | Video camera movement (use for video only) | Prompt formula:** Use one restrained movement: [locked frame / slow physical push / short lateral slide / shallow arc / slow rise / deliberate rack focus]. Define the start composition, limited travel and exact end composition. Do not combine orbit, zoom, tilt and focus movement at once.

- **Editorial Still Life | Material movement (use only when the scene implies motion) | Prompt formula:** Let [fabric / paper / liquid / flower / reflection / hand / haze..etc] perform one subtle physically motivated movement caused by [gravity / airflow / contact / camera movement / settling..etc]. Keep the hero object readable and avoid making every element move simultaneously.

- **Editorial Still Life | Colour grade (use after product truth is protected) | Prompt formula:** Apply a [high-key / mid-key / low-key] editorial grade with [contrast level], [highlight character], [shadow character], [saturation hierarchy] and [one protected accent]. Preserve material separation and product colour; avoid HDR clarity, crushed blacks, muddy neutrals or equal saturation everywhere.

- **Editorial Still Life | Continuity across video shots (use for multi-shot sequences) | Prompt formula:** Preserve [product orientation, prop positions, folds, fingerprints, liquid level, light direction, shadow direction, haze density and set geometry] across shots. Change only the elements explicitly moved by the action. No appearing props, resetting fabric or morphing product details.

- **Editorial Still Life | Conditional negative prompt (include only relevant failures) | Prompt formula:** Avoid [centered packshot / beige colour wash / uniform blur / whole-frame haze / excessive glow / warped product / duplicate label / random reflections / missing contact shadow / floating props / luxury cliché pile-up / purposeless camera drift / unsupported motion / added text or logos]. Remove every negative that does not apply.

## Compact output structure

```text
Editorial direction: idea = [editorial concept]; palette = [tonal family + dark anchor]; materials = [two dominant materials + one accent]; tension = [composition device]; sharp anchor = [exact feature]; softness = [physical optical source]; lighting = [source + negative fill + reflection shape]; realism = [weight, contact and two imperfections]; camera = [still framing or one restrained movement]; grade = [highlight, shadow and saturation behavior].
```

## Core default bans unless explicitly requested.

- No global cream, yellow, sepia or beige filter unless explicitly requested.
- No centered e-commerce packshot unless explicitly requested.
- No uniform dreamy blur or entire frame out of focus unless explicitly requested.
- No whole-frame fog, glow around every edge or random flare unless explicitly requested.
- No endless product spin, purposeless orbit or constant camera drift.
- No floating product, unsupported fabric, random petals or simultaneous movement of every object.
- No extra luxury props unless they perform a clear visual role.
- No additional text, logos or branding beyond the supplied hero product.
- No full preset, hardcoded scene, exact colour palette, lens, timing or perfume example copied into the final prompt.
