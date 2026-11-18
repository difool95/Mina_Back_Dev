# Seedance 2.0 — how to talk to it (official guide + vendor phone-call notes)

Sources: the official Seedance 2.0 Chinese template (translated) + a direct call with
the Seedance team. Follow this file for every Seedance **2.0** generation.

> **Read `seedance-common.md` alongside this file.** It carries the rules that
> hold on every Seedance version — the six-part shot grammar, the reference-role
> contract (job **and** do-not-touch), the `( ) < > { } 【 】` audio/text syntax,
> dialogue-language reinforcement, and the editing master/scope/preserve
> pattern. This file is the 2.0-specific layer: its ceilings, its quirks, its
> negative prompt.

## 0. The golden rules from the Seedance team

1. **Blueprint first.** Open the prompt by explaining the IDEA of the video — what
   it is, its arc, its mood — before any detail. Then descend into detailed
   descriptions of every character, place, prop, and shot. Seedance reads the
   blueprint as the plan and the details as the execution.
2. **Complete, structured prompts — not merely long ones.** Short prompts make
   Seedance HALLUCINATE: it fills every unspecified gap with its own inventions.
   Whatever you don't write down does not exist (or worse, gets invented). So
   write everything down — but write it *structured*, and stay under roughly
   **1,000 words** (official guidance). Long because it is complete is right;
   long because it rambles costs coherence. Completeness is measured by the six
   shot fields being present, not by word count.
3. **Tag every reference inline with @.** When talking about a character, say
   `@Image 2 is the character, wearing …` — even wardrobe details bind better when
   attached to the tag. The same tagging works for other media:
   - `@Image N` — a reference image (character, product, scene, prop)
   - `@Voice N` / `@Audio N` — an attached audio file; use it to say WHO speaks
     with this voice ("@Image 1 speaks with @Voice 1")
   - `@Video N` — an attached video; use it for motion ("walks the same way as
     @Video 3") or as edit source
   Numbers follow the ORDER media is attached to the request. Never describe a
   tagged element without its tag; never reuse a tag for two different things.
4. **Maximum 14 references per generation.** Seedance 2.0 accepts at most 14
   attached media items. Budget them: frame anchors first, then the product, then
   the character, then scene/style refs. Do not waste slots on near-duplicates.
   Fewer purposeful references beat a filled slot count — and **independent
   single-view images are more stable than one multi-view collage.** Prefer
   clean separate headshot / full-body references over a giant multi-person
   collage.
4b. **Every reference states its job AND what it must not touch.** A job line
   alone leaks: `@Video 1 defines motion, camera movement and pacing` needs the
   second line `Do not use the person's identity, clothing or scene from the
   video.` Write the material mapping in the prompt — never rely on a text label
   drawn inside the image, and never make the model infer which person, prop or
   scene a reference represents. Full template in `seedance-common.md` §2.
5. **Always include a negative prompt.** Seedance 2.0 accepts negatives and they
   matter. See section 4 for the official negative list.

## 1. The official blueprint structure (from the Seedance 2.0 template)

Write the prompt in these sections, in this order:

1. **Scene description (场景描述)** — the establishing blueprint: place (cite its
   ref: "the luxury foyer from @Image 1"), light, atmosphere, aspect ratio, film
   texture ("16:9 cinematic widescreen, 4K film grain" / "vertical 9:16 iPhone look").
2. **Style description (风格描述)** — the overall visual register in one or two lines.
3. **Character descriptions (人物描述)** — EVERY character gets one line, each
   opening with its tag: `@Image 4 Ryder (silver hair, back to camera, suit);
   @Image 3 Mila (standing, soaked grey dress, shocked expression)…`. Wardrobe,
   hair, expression — all inside the tagged line.
4. **Core action (核心动作)** — the arc of what happens, with tags inline every
   time a character or prop is mentioned.
5. **Framing (画面构图)** — lens language per shot: "Panavision anamorphic; the
   establishing shot uses @Image 1's composition, slowly pushing toward @Image 4's
   back; the phone-screen close-up uses a macro push-in."
6. **Audio hierarchy** — which sounds sit above which: "keep @Image 3's breathing
   and the knee-hitting-marble sound clearly layered under the dialogue. NO
   background music." (Music only if the user asked.)
7. **Shot-by-shot with timecodes (运镜描述)** — the heart of the prompt:
   ```
   0–3s: Shot 1: [wide establishing shot, based on @Image 1] + [static camera] + Ryder's (@Image 4) unshakeable back.
   Dialogue: "Walk out that door, and your mom's ventilator shuts off in sixty seconds."
   SFX: low resonant menace tone, a distant clock ticking.
   3–6s: Shot 2: [wide shot] + [push-in toward the phone] + …
   SFX: quiet snicker, faint electronic buzz from the phone.
   ```
   Every shot: 【camera intent】+【move】+ action, then its dialogue line (if any),
   then its SFX line. One camera intent per shot.
8. **Negative prompt (负面提示)** — see section 4.

## 2. Technical constraints

- Duration: 4 to 15 seconds per generation (hard cap)
- Aspect ratio: 9:16 default unless the user picks different
- Resolution: 1080p or 4K
- Media roles accepted: `image`, `start_image`, `end_image`, `video`, `audio`
- **Reference cap: 14 attached media items maximum**
- Dialogue: embed the exact quoted words in the shot where they're spoken;
  Seedance vocalises and lip-syncs them. When an audio file is attached, say who
  speaks with it (`@Image 1 speaks the words in @Voice 1`) instead of quoting text.
- Dialogue language, regional variety/accent, delivery style and speaker are
  **stated explicitly** before the line — an unstated language is a language
  Seedance picks for you. Formula and examples in `seedance-common.md` §3.
- Audio and text may be disambiguated with the official notation: `( )` music,
  `< >` sound effects, `{ }` dialogue, `【 】` subtitles.

**Version note.** These are 2.0's ceilings. Seedance **2.5** raises the single
clip to 30 seconds and the reference budget to 30 images / 10 videos / 10 audio
clips (50 total), and generates audio in the same pass — see `seedance-2.5.md`.
Never apply a 2.5 duration or reference count to a 2.0 job, or the reverse.

## 3. Known quirks to design around

**Quirk 1: Brand-bleed.** If you describe a branded item in detail, Seedance will
bleed the brand name onto nearby surfaces — tote bags become "yourbrand" tote
bags, mugs get labels. Include this hard rule near the top of every product prompt:

> **Critical brand-bleed rule.** The user product is the ONLY branded item anywhere
> in the frame. No other item, surface, label, fabric, mug, bag, cup, poster, box,
> or object anywhere in the frame contains any text, logo, brand mark, lettering,
> or readable symbol of any kind. All surfaces, fabrics, objects and backgrounds
> must be plain and unbranded.

**Quirk 2: Back-face duplication.** If the bottle rotates or you describe the back,
Seedance renders the back with the same front decoration. Never describe the back,
never describe a rotation; keep the product label-forward.

**Quirk 3: Lip-sync degrades near the mouth.** Keep the product at chest, thigh or
lap level during dialogue; bring it to face height only during silent beats.

**Quirk 4: Moderation flags.** Detailed descriptions of minors, poverty framing,
distress language, cultural stereotyping trip the "sensitive content" filter. Age
up the cast, soften distress into "quiet moments".

**Quirk 5: Preset hijack.** Seedance sometimes swaps in a preset instead of
generating literally; decline presets in params where available.

## 4. The official negative prompt (translated from the Seedance 2.0 template)

Include a negative section in every prompt; adapt to the job but start from this list:

> plastic-looking skin, waxy texture, dead lifeless eyes, stiff limbs, unnatural
> movement, uncanny valley, body deformation, blurry image, low quality, awkward
> poses, unnatural body dynamics, wrong center of gravity, no cloth physics,
> floating objects, broken physics, parallax errors, perspective distortion, flat
> lighting, harsh fake shadows, bad subsurface scattering, weak composition,
> cropped/misaligned framing, no depth of field, sluggish pacing, padded filler
> shots, overacted performance, single static unchanging shot, character not
> matching the reference images, bad lip-sync, background music, pure BGM,
> non-diegetic soundtrack, missing sound effects, fluid simulation artifacts

Add job-specific negatives at the end (e.g. "text overlays, captions, watermarks"
unless the user asked for text; "a paper appearing in her hand" style fixes for
observed glitches).

## 5. The paste-ready structure for video-register jobs

For raw video (not cinematic), keep the SAME blueprint order but swap the register:

```
[Blueprint line: vertical 9:16 selfie-style iPhone video, X seconds, 1080p/4K,
single continuous take / jumpcuts, handheld micro-shake or fixed framing, the
overall vibe in one sentence.]

No on-screen text of any kind. No captions, no overlays, no emojis, no watermarks.

[Brand-bleed rule block.]

Subject. @Image N is the character — hair, eyes, skin texture, makeup register,
jewellery, wardrobe, all attached to the tag.

Setting. Room, light, props — no branded items anywhere.

Hero prop. @Image M is the product — material, colour, label, cap, where it sits.

Beat-by-beat action with exact dialogue timing.
[0–Xs] — [Beat name]. [Physical action.] [Expression.] Says: "[dialogue]"
SFX: [the sounds of this beat].
[continue per beat]

Lip-sync note: mouth moves ONLY during her lines.

Lighting & grade. [source, direction, colour temperature, grain.]
Lens & camera. [~24mm selfie / static / handheld; ONE camera intent per shot.]
Imperfections to preserve. [skin texture, flyaways, blinks, micro-shake.]
Audio direction. [voice register, room tone, per-beat SFX; no BGM unless asked.]
Negative prompt: [section 4 list + job-specific.]
```

## 6. In-video work — when a SOURCE VIDEO ships as @Video 1 (Seedance 2.0)

Seedance 2.0 can edit, replace and track INSIDE an attached video. When a job
ships a source video, the megaprompt must state which contract applies —
never leave the model to guess.

**The canonical TRACKING template (from ByteDance's own replace example —
use this wording for every swap/replace job):**

> @Video 1 is the LAW for motion, camera language, framing, timing and cut
> rhythm — copy it exactly. Replace [the source subject] with [@Image N —
> the user's product/person]. Track the replaced subject through every
> frame — all angles, motion and occlusion — matching the original's
> position, size, perspective, light direction and trajectory. Replace only
> the subject's appearance; do not change background, composition, lighting,
> depth of field or camera motion; no added or removed objects; no drift,
> no flicker, no style shift.

**Ordered replacement** (pages, steps, one-by-one): add the sequence map —
"page turn 1 reveals @Image 1; page turn 2 reveals @Image 2; …" — and the
tracking template above; the reveal ORDER is part of the contract.

**Local repair** (remove/fix something): name the target, track it in every
frame, reconstruct what is behind it naturally; everything else — subjects,
background, light, camera, timing, audio — stays exactly unchanged.

**Pinned opening + video motion**: the cited opening image is the EXACT
first frame (pixel-faithful); from it, perform @Video 1's motion and timing;
state the bridge from the opening into the reference motion explicitly.

**Extend forward / backward**: continue seamlessly AFTER the final frame
(or generate the shots BEFORE the first frame, ending exactly on it) — same
subjects, setting, light, grade, camera language and pacing; the join must
be invisible; never re-establish the scene.

**Bridge two videos**: start on @Video 1's final frame, end on @Video 2's
first frame, continuous subjects/setting/light so both joins are invisible.

**Restyle** (same video, new look): motion, timing, framing and every
subject's action stay frame-for-frame; ONLY the render style changes (anime,
claymation, oil-paint, 3D …) — one consistent style across the whole clip,
no per-frame drift.

**Effect transfer**: @Video 1 is the reference for the EFFECT only (its
transition, vfx, motion signature and timing); the cited images are the true
subjects — never copy the source's cast or setting.

**Audio-driven MV** (images + song, no source video): @Audio 1 is the
backbone — structure the video on its rhythm and sections, cut on its beats;
the cited images provide cast, products, environments.

Two hard laws ride every in-video job: (1) EVERY attached input is cited by
tag in the References legend — an uncited video/audio attachment is invisible
to the model; (2) the strategy contract lives in the prompt BODY, the legend
BELOW it, the negative prompt LAST.

---

## Example prompts — full, real, known-good (KEEP THESE)

The two complete prompts below produced strong output and are the register
target for every Seedance job. Study the density: exact dialogue timing,
mouth-still rules, named jewellery, named sounds, performance notes.
(They predate the @Image N tagging convention — where they write
`@[Image 1](image_1)`, you write `@Image 1`.)

## Exmaples 1: for video (other type of videos can be inspired from)
Vertical 9:16 selfie-style iPhone front-camera video, 15 seconds, light handheld micro-shake throughout, slightly overexposed warm natural daylight TikTok look, single continuous take with no cuts, no zoom, no pan, no tilt.
Absolutely no on-screen text, captions, subtitles, overlays, emojis, watermarks, or graphic elements of any kind. Completely text-free frame from 0 to 15s. Ready-to-post raw video output.
Two characters:
Character A (on-camera, hero — Speaker 1). [mid-twenties British woman, long natural brunette wavy hair past her chest with a soft centre middle-part and natural body, pale fair skin with a soft rosy flush across the cheeks, light blue-grey eyes, defined natural full brows, fluttery natural lashes, bare-face / minimal-makeup Sunday-morning look, glossy nude lips, no airbrushing]. Long pointed-almond nails in glossy hot-pink. Silver diamond engagement/wedding ring on her left ring finger. Wearing a relaxed-fit matching satin pyjama set — sage-green-and-cream wide vertical stripe with scattered pink rose-bouquet floral print across the fabric, long-sleeve button-up top and matching loose long bottoms.
Character B (off-camera — Speaker 0). Her partner. Only his right hand and forearm enter frame from camera-left during the opening hand-off — light-skinned, plain hand, no jewellery, no nail polish, casual partner grip on the bottle. He never appears on screen beyond his hand at 0–2s. His voice is heard throughout — warm casual British male, mid-twenties to thirties, gentle conversational tone, partner-to-partner intimacy.
Setting. Modern English country kitchen interior — sage-grey shaker-style cabinetry on the back wall, white-painted walls and ceiling, dark grey quartz worktop, soft natural daylight pouring in from a window off-frame to camera-right, white kitchen appliances softly out of focus in the background bokeh, a wooden chopping board on the counter, a bar stool visible at one edge. Slightly shallow selfie depth of field, background gently out of focus.
Hero prop. Rose-gold-chrome @[Image 1](image_1) NYLA perfume bottle — flat round disc silhouette (hip-flask shape, wide circular face-on, slim from the side), highly reflective mirror-polished rose-gold chrome. Front face has raised baroque filigree scrollwork curling around a small oval medallion with "NYLA" in rose-pink on a pale inset. Fluted ribbed base, narrow ribbed engraved neck collar, wide mushroom-domed faceted gem-cut cap — all matching rose-gold chrome. Atomizer of the perfume is the same colour as the bottle.
Beat-by-beat action with exact dialogue timing:
0–0.36s — Silent opening. Phone held by Character A at arm's length. She is framed mid-kitchen, upper-body in shot, hands relaxed at her sides, soft contemplative half-smile, gaze just past the lens. Background is the sage-grey kitchen. No speech.
0.36–1.30s — Off-camera male: "Are you happy?" Visual: From camera-left foreground, his right hand and forearm enter frame holding the rose-gold @[Image 1](image_1) Nyla bottle out toward camera at chest-height — bottle close to the lens, large and hero-prominent. Character A is softly out of focus in the background; the bottle is sharp. Her mouth is closed, slight knowing smile, eyes flick down to the bottle then back up. She does NOT speak during this beat — only listens.
1.30–2.72s — Character A, on-camera: "I am over the moon." Visual: She steps forward, focus pull shifts to her face. She reaches out and gently takes the @[Image 1](image_1) Nyla bottle from his hand with both hands; his hand exits frame to camera-left. Mouth clearly moving in sync with the words — soft happy "I am over the moon" delivery, eyes warm, small genuine smile breaking through on "moon." Hot-pink nails visible cradling the bottle.
2.72–7.50s — Off-camera male: "I managed to get this off a TikTok shop. It's back in stock. This is the viral TikTok shop perfume that is everywhere." Visual: She holds the @[Image 1](image_1) bottle two-handed at chest height, tilts it gently, eyes downcast on the bottle inspecting the filigree and medallion as he talks. Small nods of agreement at "back in stock" and "everywhere," soft smile, occasional glance up at the camera. Hair falls naturally either side of her face. Her mouth is closed and still during this beat — she is silent, only listening and nodding along. NO lip movement at all.
7.50–9.14s — Character A, on-camera: "I've been waiting for this for months, haven't I?" Visual: She looks up directly at the camera and speaks. Mouth clearly moving in sync — slight upward inflection on "haven't I?" like she's asking him for confirmation, eyebrows lifting gently on the question. Holds the bottle at chest height with both hands as she delivers the line, label squarely toward camera.
9.14–14.50s — Off-camera male: "It's honestly been out of stock everywhere, but if you see the yellow basket on the video now, it's back in stock, and it's on a flash sale, so be quick." Visual: This is the sales beat — she now actively showcases the bottle to camera as he speaks. Brings the bottle up close to face height, presents both faces of the filigree, tilts it so the rose-gold catches the daylight. Small nodding agreement on "out of stock everywhere," a confident look-at-camera on "yellow basket on the video now," a soft "yes" closed-mouth smile on "flash sale." On "so be quick," she holds the bottle up centred at face height in both hands, label squarely toward camera, looks directly into the lens with a confident reassuring smile. Her mouth stays closed and still throughout this beat — she does NOT speak, only reacts, smiles, and showcases. NO lip movement at all.
14.50–15s — Silent hold. She keeps the bottle held up at face height, two-handed, label centred to camera, soft confident closed-mouth smile direct to lens. Final natural blink. End frame.
Lip-sync precision is critical. Character A's mouth MUST be visibly moving and clearly forming words ONLY during 1.30–2.72s and 7.50–9.14s. At every other moment her mouth is closed, relaxed, or smiling — never moving. The illusion that the male voice is coming from off-frame depends on her mouth being still during his lines.
Lighting & grade. Bright airy natural daylight from the window off-frame camera-right, soft warm bounce off the white walls and ceiling, gentle warm midtones. Slightly blown skin highlights, faint bloom around bright surfaces, soft warm shadows on the sage-grey cabinetry, deep specular streaks on the rose-gold bottle. Natural fine skin grain, no cinematic gloss.
Lens & camera. ~24mm-equivalent front-camera selfie field of view, light natural handheld micro-shake throughout, single soft focus pull at 1.3s as she steps forward (background→foreground), no zoom, no pan, no tilt. Light TikTok compression mush on hair edges.
Imperfections to preserve. Bare-face natural skin texture and small pores, light forehead sheen, soft flyaway hairs, micro-fingerprints on the polished rose-gold bottle, natural blink rate, slight handheld jitter, no stabilisation, no regrade.
Audio direction. Two-voice exchange embedded directly into the generation. Off-camera male voice (warm, casual British, mid-twenties to thirties, partner-tone, slightly louder on the sales lines than the opening question) for the speaker-0 timing. On-camera female voice (warm conversational British, mid-twenties, soft genuine delight, slight upspeak) for the speaker-1 timing, perfectly lip-synced. Quiet kitchen ambient room tone underneath throughout — faint hum of a fridge, distant birdsong through the window, the soft satin-rustle of her pyjamas as she steps forward at 1.3s, the faint metallic clink of the bottle changing hands at 1.5s.
Performance note. Energy is "lazy Sunday morning at home, partner just surprised me with the perfume I've been waiting for." Real, natural, intimate. Her two on-camera lines are genuine, warm, slightly understated — not performative, not theatrical. His off-camera voice is conversational and proud at the start, shifts to a slightly punchier sales tone at 9.14s for the CTA. The bottle is the visual hero across the take; she is the real-person reaction. Output should be a clean ready-to-post 15s vertical MP4 with embedded audio, no captions, no overlays.

---
## Exmaples 2: 

Aspect ratio 9:16 vertical, 15 seconds, 720p, single continuous take, some jumpcuts cuts, no zoom, no pan, no tilt — fully fixed framing (phone propped on the dashboard or front cup-holder).
No on-screen text of any kind. No captions, no overlays, no emojis, no watermarks. Completely text-free frame from 0 to 15s.
Subject - @[Image 5](image_5). Long pointed-almond nails in glossy soft butter-yellow / pastel-yellow. Jewellery: a chunky silver diamond solitaire ring on her left index finger, a thin silver band on her left ring finger, a thin gold band on her right ring finger, small gold huggie hoop earrings. Wearing an oversized vintage-style chocolate-brown faux-leather bomber jacket — full zip front (zip half-undone), puffy elasticated cuffs, slightly cropped at the waist, Y2K silhouette. Underneath: a warm-toned soft brown cropped tank/bralette visible at the chest.
Setting. She is sat in the back seat of a modern luxury SUV parked stationary. Cream-coloured leather seats and headliner. A large panoramic glass moonroof/sunroof directly above her showing overcast British grey-and-blue sky with soft cloud cover. Soft natural daylight pouring down through the sunroof onto her face and torso. Cream leather seat-back visible behind her shoulders. Bottom-left of frame: a chrome cup-holder area with a pink Stanley-style tumbler cup, clear plastic straw, and a small pink-bow straw-topper charm visible — just edging into frame. Background slightly out of focus, shallow selfie depth of field.
Hero prop - @[Nyla-Bottle-Normal](3ec1bdee-5886-4210-85d3-9442500ca0c1). Rose-gold / champagne-gold-chrome NYLA perfume bottle — flat round disc silhouette (hip-flask shape, wide circular face-on, slim from the side), highly reflective mirror-polished rose-gold chrome. Front face has raised baroque filigree scrollwork curling around a small oval medallion with "NYLA" in rose-pink on a pale inset. Narrow ribbed neck collar, wide mushroom-domed faceted gem-cut cap. The cap is OFF throughout the clip; the matching rose-gold chrome atomiser nozzle is exposed at the top of the bottle.
Beat-by-beat action with exact dialogue timing (clip-relative seconds shown, real-video seconds in brackets):
0–5s [14–19s real] — Segment 4. "Love Island girls have been spotted wearing this and honestly you would never guess it is only twenty five pounds. It smells like it should cost three times that." Visual: She holds the bottle two-handed at chin height as the clip opens (matching the Clip 1 final pose). On "Love Island girls have been spotted wearing this," she lifts her chin slightly, raised brow, knowing smile — like she's dropping a hot tip. On "you would never guess it is only twenty-five pounds," her eyes widen in a small mock-shocked face, head tilts forward conspiratorially, mouth animated on the price reveal. On "smells like it should cost three times that," she tilts the bottle so the rose-gold catches a flash of moonroof daylight, free hand gestures emphatically with a small flicked palm-up motion on "three times that."
5–10s [19–24s real] — Segment 5. "It is an eighty millilitre bottle as well, so it is going to last you a really good while. Perfect going into summer." Visual: She brings the bottle slightly forward toward camera, presents the size of it — turns the bottle so the disc face fills the centre of frame at chest height, gestures the width with her free hand on "eighty millilitre bottle." Brows raised in genuine value-shock on "really good while." On "perfect going into summer," she glances up toward the panoramic moonroof and the overcast-but-bright sky above her — soft dreamy smile on "summer," eyes half-close with a tiny anticipatory grin.
10–15s [24–29s real] — Segment 6 (slightly tightened to fit the 15s cap). "If you have been looking for your new summer scent, this is it. Link's below on TikTok Shop — go and get it." Visual: She brings her gaze back down to the lens with a confident shift into close-out mode. On "this is it," she lifts the bottle up centred at face height, label squarely toward camera. On "Link's below on TikTok Shop," her free hand gestures emphatically downward toward the bottom of frame (toward the unseen yellow basket icon). On "go and get it," firm confident nod, raised brows, then a final small open-mouthed knowing smile holding the bottle high. Final beat held: bottle centred at face level in both hands, confident closed-mouth smile, gentle natural blink, end of clip.
Lip-sync precision is critical. Her mouth must be visibly forming words throughout the full 15 seconds — there are no silent beats in Clip 2. Natural micro-pauses between sentences only.
Lighting & grade. Identical to Clip 1 — bright airy diffused overcast daylight pouring down through the panoramic moonroof from directly above, soft warm bounce off the cream leather interior, slightly blown skin highlights, deep specular streaks on the polished rose-gold bottle, soft warm midtones. Fine natural skin grain, no cinematic gloss.
Lens & camera. Identical to Clip 1 — ~24mm-equivalent front-camera selfie field of view, fully static phone mount, no shake beyond gentle natural micro-jitter, no zoom, no pan. Soft natural auto-focus pulse only when the bottle moves toward her face.
Imperfections to preserve. Light forehead sheen from the top-light, subtle flyaway hairs catching the daylight from above, glossy lip-light catches, faint micro-fingerprints on the polished rose-gold chrome, natural blink rate, no stabilisation, no regrade.
Audio direction. Same Speaker 0 voice from Clip 1 — single warm enthusiastic British female voice, mid-twenties, slight upspeak, conversational mate-to-mate review tone. Energy lifts slightly into the CTA in segment 6 (a touch punchier on "go and get it") but stays mate-to-mate, never salesy. Quiet stationary-car interior ambient underneath — faint outdoor wind brushing the car, soft cream-leather rustle, no engine noise.
Performance note. Energy is "warm value-flex confidence shifting into helpful close." Segment 4's price reveal should land with a small mock-shocked conspiratorial expression — like she still can't believe twenty-five quid herself. Segment 5's "perfect going into summer" should carry a soft dreamy upward glance to sell the summer association. Segment 6 is the close — slightly more direct, slightly more eye-contact with the lens, ending on a confident wink-without-winking smile.
