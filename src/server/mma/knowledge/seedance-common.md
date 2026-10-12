# Seedance — the rules that hold on EVERY version (2.0 and 2.5)

This file is the shared contract. It is routed for every Seedance generation
regardless of version. The version-specific file (`seedance-prompting.md` for
2.0, `seedance-2.5.md` for 2.5) then adds the ceilings, durations and features
that differ.

Every claim below is tagged:

- **[OFFICIAL]** — stated in ByteDance / Dreamina / BytePlus documentation.
- **[VENDOR CALL]** — from a direct call with the Seedance team.
- **[PRACTICE]** — production practice that is not in any vendor doc. Useful,
  but never quote it to a user as a vendor rule.

---

## 1. The six-part shot grammar — write it for EVERY shot [OFFICIAL]

Every single shot states the same six things, in this order:

| # | Field | What it answers |
|---|-------|-----------------|
| 1 | **Subject** | what is in the shot |
| 2 | **Action** | what it is doing |
| 3 | **Place** | where it is |
| 4 | **Camera** | how the camera moves |
| 5 | **Style** | what visual style it is in |
| 6 | **Rules** | what to follow or avoid |

This list did NOT change between 2.0 and 2.5. What changed is **how many times
per prompt you write it**: once for a 2.0 shot, once per beat for a 2.5
multi-beat sequence.

A shot missing any of the six is an under-specified shot, and Seedance fills
every gap it is given with its own invention. **[VENDOR CALL]** Whatever you
do not write down does not exist — or worse, gets invented.

---

## 2. Every reference states its job AND what it must not touch [OFFICIAL]

After attaching reference material, specify **exactly what each one
contributes**. Add **exclusions** whenever a person, background or composition
inside a reference could be unintentionally carried into the output.

Two hard rules from the official guide:

1. **Material mappings must be written in the prompt.** Do not rely only on
   text labels drawn inside the image, and do not make the model infer which
   person, prop or scene each material represents.
2. **A job line alone is not enough.** `@Video 1 defines motion, camera
   movement and pacing` is correct but incomplete. It needs the second line:
   `Do not use the person's identity, clothing or scene from the video.`

That second line is what stops one reference's details from leaking into a
shot they were never meant to touch.

### Reference role template [OFFICIAL]

```
@Image 1 defines <subject>'s <appearance, clothing, structure, or material>.
@Video 1 defines <motion, camera movement, or pacing>.
@Audio 1 defines <character or sound type>'s <voice, dialogue, ambience, or music>.

<Subject> completes <primary action or event> in <scene>.
The visuals feature <visual style>, with <camera treatment>.
```

### Worked example [OFFICIAL]

```
@Image 1 defines the ceramic artist's facial features, hairstyle, and dark
green apron. Do not use the image background.
@Image 2 defines the wooden workbench, window placement, and morning light of
the pottery studio. Do not use the people in the image.
@Video 1 defines the pacing of throwing clay with both hands, lifting the cup,
and placing it down. Do not use the person's identity, clothing, or scene from
the video.
```

### Reference discipline [OFFICIAL]

- Independent single-view images are **more stable** than one collage holding
  several views. If more than five subjects each need multiple views, put each
  view in its own image.
- Prefer clean separate headshot / full-body references over a giant
  multi-person collage.
- The recommended ranges exist to **improve generation stability — they are
  not capability limits.** Going above them is allowed and degrades stability.

---

## 3. Special syntax for audio and text [OFFICIAL]

Prompts can be written entirely in natural language. When music, sound
effects, dialogue and subtitles need to be distinguished explicitly, use:

| Content | Syntax | Example |
|---------|--------|---------|
| Music | `( )` | `(Soft, rhythmic piano music plays in the background)` |
| Sound effects | `< >` | `<A bell rings in the distance>` |
| Dialogue | `{ }` | `{Hello, welcome back.}` |
| Subtitles | `【 】` | `【Chapter One: Departure】` |

### Dialogue language reinforcement [OFFICIAL]

When dialogue is not in Chinese, **state the language before the line**:

```
The girl says softly in Japanese: {もう大丈夫です}
```

If the dialogue text is English but the model speaks it in Chinese, or a
specific regional variety is required, reinforce with this formula:

> **Dialogue Language + Regional Variety or Accent + Delivery Style + Speaker + {Dialogue}**

```
Dialogue language: American English. The girl says in natural, conversational
American English: {I thought you weren't coming.}

Dialogue language: authentic Los Angeles English. The young man says in natural
Los Angeles vernacular: {No way, you actually made it.}
```

Always state dialogue language, accent, delivery and speaker explicitly. An
unstated language is a language Seedance picks for you.

---

## 4. Audio hierarchy [VENDOR CALL]

State which sounds sit above which, explicitly:

```
Keep @Image 3's breathing and the knee-hitting-marble sound clearly layered
under the dialogue. NO background music.
```

Music only when the user asked for music. Silence is a valid, requested
outcome — never add a score to fill it.

---

## 5. Editing an existing video — the master/reference split [OFFICIAL]

A reference video used for motion and an editable master video are **two
different contracts.** Never blur them.

When editing, first declare the source video as the **sole editing master**,
then state the edit target, the edit scope, the target material, and the
content to preserve.

### General editing pattern [OFFICIAL]

```
[Edit Goal]
Edit @Video 1. Within <the entire video / a stated time range>, <goal>.

[Source Video Role]
@Video 1 is the sole editing master. It <what it provides>.

[Target Material Role]
@Image 1 or @Audio 1 defines <the specified attribute it contributes>.

[Edit Scope]
Modify only <object, region, time range, …>.

[Content to Preserve]
Keep the character's identity, clothing, scene, visual style, audio and all
other timing unchanged.
```

### Worked example [OFFICIAL]

```
[Edit Goal]
Edit @Video 1. Only from 4–7 seconds, change the light colour on the right.

[Source Video Role]
@Video 1 is the sole editing master.

[Edit Scope]
Change only the light colour on the right.

[Content to Preserve]
Keep the character's identity, clothing, scene, visual style and audio
unchanged.
```

A shorter one-line form that works today **[PRACTICE]**:

```
edit @video 1, keep the characters and visual style unchanged, adjust only the
camera movement over 6 to 12 seconds
```

---

## 6. Prompt length [OFFICIAL]

Complete, structured and concise — **not** maximally long. The official
guidance is to stay under roughly 1,000 words. Structure beats volume: a
1,000-word prompt with all six fields per beat outperforms a 2,000-word
paragraph that repeats itself.

This replaces the older internal habit of "make every prompt as long as
possible." Long *because it is complete* is right. Long *because it rambles*
costs coherence.

---

## 7. What tags mean

| Tag | Binds |
|-----|-------|
| `@Image N` | a reference image — character, product, scene, prop |
| `@Video N` | an attached video — motion source, or the edit master |
| `@Audio N` | an attached audio file — voice, dialogue, ambience, music |

Numbers follow the **order the media is attached to the request**, starting at
1. Never describe a tagged element without its tag. Never reuse one tag for
two different things.

---

## 8. Production practice around the prompt [PRACTICE]

These are workflow habits, not vendor rules. Do NOT inject them into a
generated prompt — they describe how a human prepares the material.

- **Build the reference bible first.** One page per asset — the idea, the
  locked colours and style, the character sheets, the reference images, the
  prompts that worked — all linked from one index page. A generation that can
  pull 30 images, 10 videos and 10 audio clips holds more than anyone
  remembers; it has to be something you look up.
- **Build reference images by hand, before writing the Seedance prompt.** The
  image slots do not come from Seedance. Pick the tool by what the shot needs:
  Midjourney for cinema / anime / distinct art style, Nano Banana Pro or GPT
  Image 2 for realism, real faces, real materials, real light.
- **Lock one look for the whole project first** — e.g. tune Midjourney's style
  creator to ~20–22 picks and keep the `--sref` code, or roll `--sref random`
  until a couple of codes read right. Then generate by category under that one
  locked style: wide establishing shot, environment, main character, key prop,
  closing shot.
- **Reference sheets for anything recurring** — front, side, back, blank
  background. That is what lets the same character drop into a new scene later
  without being redrawn.
- **Once the reference images are locked, freeze them.** If the motion looks
  wrong, fix the *motion prompt*. Regenerating the image undoes every bit of
  consistency work already done.
- **Review after every session.** One short note on what worked, then update
  the index. Skip it and the bible becomes a pile of dead files.

### The gate sequence [PRACTICE]

```
01 Build the bible          → GATE 01  bible complete and approved
02 Six details, per beat    → GATE 02  all six written for every beat
03 Tag every reference      → GATE 03  all references tagged and locked
04 Lock the images          → GATE 04  images locked and approved
05 Generate in Seedance     → GATE 05  generation complete
06 Review, update the bible → GATE 06  loop closed
```

Skip the reference-role step and the leak shows up in the one shot nobody
double-checked.
