# Seedance 2.5 — what is different, and how to prompt it

Read `seedance-common.md` first. It carries the six-part shot grammar, the
reference-role contract, the audio/text syntax and the editing pattern — all of
which are unchanged in 2.5. This file only covers what 2.5 changes.

Tags: **[OFFICIAL]** vendor documentation · **[PRACTICE]** production practice,
not a vendor rule.

> **API STATUS.** Seedance 2.5 is LIVE. When this file is routed to you, the
> render you are writing for IS a Seedance 2.5 render — never report it as a
> 2.0 render or skip this guide's rules on that assumption. (2.0 jobs receive
> the separate 2.0 guide instead of this one.)

---

## 1. The two things that actually changed [OFFICIAL]

1. **Single-clip duration doubled** — from up to 15 seconds to **up to 30
   seconds**, generated in one pass.
2. **The reference budget more than tripled** — up to **50 reference
   materials** in one generation.

And one structural change worth as much as both: **audio and video generate
together in the same pass** instead of audio being stitched on afterward.

### The trap [OFFICIAL]

More room does not mean you can be less precise — it means there are more
places to go wrong without noticing.

The model does **not** refuse a 30-second request it cannot hold. It tries
anyway. Stretch a 15-second-era prompt to 30 seconds without breaking it into
beats and you get actions that make no sense, props that appear from nowhere,
and characters that slowly stop looking like themselves — all only visible
after the render finished.

So hold both facts at once: 2.5 can carry a longer story on its own, **and**
you still owe it the same detail per shot as before — just four times over
instead of once.

---

## 2. Material quantity and selection [OFFICIAL]

Seedance 2.5 can combine **up to 50 reference materials** in total. Each type
has its own input limit. The recommended ranges exist to improve generation
**stability — they are not capability limits.**

| Material type | Input limit | Recommended range |
|---|---|---|
| **Images** | up to **30 images**, each no larger than **4K** | prefer **1–8 distinct subjects** across subject-reference images |
| **Videos** | up to **10 videos**, combined duration no more than **30 seconds** | prefer **1–5 distinct subjects**, and **5–10 seconds** per subject video |
| **Audio** | up to **10 audio clips**, combined duration no more than **30 seconds** | keep only dialogue, voice characteristics, ambience or music **directly relevant to the task** |
| **Video editing** | a **source video** may be used together with **reference images** | prefer a source video **under 20 seconds** and **1–5 reference images** |

You may still go above the recommendations: **9–12 subjects** in subject
images, **6–10 subjects** in subject audio/video, or **6–8 reference images**
for video editing. **Stability may decrease as the number of materials grows.**

If more than five subjects also need multiple views, **place different views in
separate images** — independent view images are usually more stable than
combining several views into one collage.

> The honest number to work to is the small one: **1–8 images and 1–5 video or
> audio clips**, not the 50-slot ceiling that just sounds impressive.
> **[PRACTICE]** A full reference bible inside that range is an afternoon of
> work.

---

## 3. Multi-reference creation — the ordering rule [OFFICIAL]

When many materials are provided, the goal is **not** to cram every reference
into one sentence. It is to define the *relationships* among characters, props,
scenes, actions and audio.

Use this order:

> **Define each material's role → Map subjects → Group by type → Create subject
> profiles → Select per scene**

Group syntax exists for ranges — e.g. `@Images 6 to 10` addresses a block of
images as one group instead of listing each. **[PRACTICE]** Use groups for
"all the crowd references" or "all the wardrobe sheets"; keep individually
named subjects individually tagged.

### `@Clay Render N` — a new kind of reference [PRACTICE]

A bare 3D shape with no texture, used **only** to lock camera movement and
blocking. A separate image reference handles the actual look — materials,
lighting, finish. Each reference does one job:

```
@Clay Render 1 locks the camera movement and the blocking only.
@Image 2 defines the final materials, lighting and surface finish.
```

---

## 4. The four-beat map for 30 seconds [OFFICIAL — Dreamina default]

One prompt now covers a 30-second story, so split it into four timed chunks and
write all six shot fields **inside each chunk**, with the timestamps included.

| Window | Job | Goal |
|--------|-----|------|
| **0–6s** | Set the scene. Introduce the world, the location, the mood; introduce the main character or focus; state the initial goal or situation; end on a hook that pushes forward. | context + hook |
| **6–14s** | Build it out. Add detail, stakes and movement; show the plan, the attempt or the early progress; introduce obstacles or complications; deepen what can be lost. | raise stakes |
| **14–24s** | The turn. Trigger the turning point or major shift; escalate conflict or pressure; force a choice or commit to the path; deliver the peak moment of impact. | change everything |
| **24–30s** | How it ends. Show the immediate result; tie off loose ends; leave the audience with the takeaway; end cleanly and on time. | resolution + satisfaction |

**This timing is a useful default, not a model law.** Adapt it to the actual
duration and the actual story — a 20-second piece gets three beats, a montage
may want six. What is *not* optional is that the beats are **timed and
explicit**.

One long paragraph for all 30 seconds and the model has no idea where the story
is supposed to turn. Four timed chunks and it knows exactly.

---

## 5. Parameter rules that lock automatically [OFFICIAL]

Video editing, first-frame / first-and-last-frame generation, and video
extension **automatically lock some generation parameters based on the input
material.** Locked parameters cannot be specified separately — not on the
generation page and not through the API.

| Task type | Aspect ratio | Duration |
|---|---|---|
| **Video editing** | automatically preserves the input video's aspect ratio; **cannot be set separately** | automatically preserves *approximately* the input duration; **cannot be set separately**. Input-frame processing may introduce a difference of up to **~0.3 seconds** |
| **First-frame or first-and-last-frame** | automatically uses the **first image's** aspect ratio. First and last images should share an aspect ratio to avoid stretching the last frame | **can be set** |
| **Video extension** | automatically preserves the input video's aspect ratio; **cannot be set separately** | **can be set** |

The ~0.3-second drift on edits is usually transition-frame handling. Overall
content and event order stay substantially unchanged. Any caller that asserts
an exact output duration on an edit job is asserting something the model does
not promise — budget for the drift instead of validating against it.

---

## 6. Video editing in 2.5 [OFFICIAL]

Same master/reference split as `seedance-common.md` §5, with 2.5's timestamp
precision:

```
[Edit Goal]
Edit @Video 1. Between 00:06 and 00:12, change only the camera movement.

[Source Video Role]
@Video 1 is the sole editing master.

[Edit Scope]
Modify only the camera movement in that window.

[Content to Preserve]
Keep the characters, identities, actions, clothing, scene, visual style, audio
and all other timing unchanged.
```

Remember the output preserves the input's aspect ratio and approximately its
duration, and neither can be set separately.

---

## 7. What a 2.5 prompt should read like

A **director's production brief**, not one enormous descriptive paragraph:

```
[Blueprint]
<one paragraph: what this video is, its arc, its mood>

[Materials]
@Image 1 defines … Do not use …
@Image 2 defines … Do not use …
@Video 1 defines … Do not use …
@Audio 1 defines … Do not use …

[Beat 1 — 0–6s]
Subject: … | Action: … | Place: … | Camera: … | Style: … | Rules: …
{dialogue}  <sfx>  (music)

[Beat 2 — 6–14s]
Subject: … | Action: … | Place: … | Camera: … | Style: … | Rules: …

[Beat 3 — 14–24s]
…

[Beat 4 — 24–30s]
…

[Audio hierarchy]
<what sits above what>

[Negative]
<what must not appear>
```

---

## 8. Format recipes [PRACTICE]

Community-tested direction for five formats. Useful as *direction*, never
pasted verbatim as a house style.

**Music video.** Cut hard on the beat — on the snare or the drop, never a soft
crossfade. Symmetrical, centre-weighted framing; recurring archways or circular
portals the camera dollies backward through at eye level with the lead. One
bold saturated palette locked across every scene, block colours over
naturalistic tones, skin kept neutral-to-warm so saturation pops without
casting on faces. Lip sync survives best on medium close-ups with simple
phoneme shapes — write the delivery in: crisp diction, open vowels, staccato
phrasing. One dance move per cut, not a continuous take.

**Vlog.** No tripod language — describe the shake: handheld micro-jitter,
arm's-length selfie framing, natural body sway while walking. Light with
whatever is already there; let quality change with location. Cut on movement —
a turn, a step off a curb, a hand reaching for a door — with quick b-roll
between talking segments. Warm and soft outdoors, cooler and flatter inside.
The giveaways sell it harder than any camera move: a visible mic cable, hair
across the face, a direct look at the lens.

**Product with 3D elements.** Describe materials by physical property, not
name — "glossy polycarbonate with internal light scatter" reads completely
differently from "shiny plastic"; matte PBT-style plastic wants high diffuse
roughness called out. Separate the camera moves: a slow 360° orbit for material
read, a straight pull-back dolly for an exploded-parts reveal — never both in
one shot. Large diffused softboxes, minimal shadow, a thin rim light on every
translucent edge, a gradient specular sweep as the camera moves. Infinite
studio backdrop, soft pastel gradient, ambient occlusion under anything
floating. Grade pastel with lifted blacks and no blown highlights.

**Realistic lighting.** Name direction and colour temperature **separately** —
a warm key against a cool sky-fill is what reads as real; one flat light never
does. Hard directional light for crisp speculars and sharp shadow edges up
close, then atmospheric haze softening with distance; that sharp-to-soft shift
does most of the realism work. Weight the edges: rim light on flyaway hair, a
flare blooming exactly when the camera tilts toward the sun, highlights that
roll off instead of clipping. Let shadows pick up bounced colour — cool blue
from open sky, warm from stone. Let distant layers lose contrast and
saturation; skipping that is the fastest way to look synthetic.

**Animation.** Pick one reference era and commit — cel-shaded, painterly-over-
3D, or classic 2D. Never blend three. Give elements different frame rates on
purpose: the character on twos for a hand-drawn snap while the vehicle or
camera moves continuously. Mix camera language deliberately: extreme close-ups
on hands and mechanical detail, smooth tracking on the action, low angles for
whatever needs to feel largest. Visible brushstroke texture over the geometry,
hand-painted highlights instead of a photoreal shader. One palette family
across every scene.

---

## 9. Checklist

- Six details for **every beat**, not once for the whole clip.
- Four-beat map as the default for 30 seconds: 0–6, 6–14, 14–24, 24–30 —
  adapted to the real duration and story.
- Every reference gets a **job** and a **do-not-carry-over**.
- Stay inside **1–8 images** and **1–5 video or audio clips**; the 30/10/10
  and 50-total figures are ceilings, not targets.
- Reference images built and **locked** first; fix the motion prompt, never
  regenerate a locked image.
- Editing: declare the sole master, scope the edit, list what to preserve, and
  expect ~0.3s duration drift.
- Under roughly 1,000 words, complete and structured.
