# Kling 3.0 / 3.0 Omni prompting guide

Source: the official Kling 3.0 & 3.0 Omni API documentation (image-to-video,
omni video, motion control, elements, voices). This book is for the
prompt-writing AI on every KLING render (Quicks lanes, motion level 1).
Kling is NOT Seedance — different tags, different limits, different taste.

## 1. Golden rules

- **Hard cap: 2,500 characters** for the whole prompt (Seedance allows 12,000 —
  do NOT reuse Seedance-length prompts). Multi-shot storyboards are capped at
  **512 characters per shot**. Budget every sentence.
- **Tags are `<<<>>>`, not @.** Reference attached inputs as `<<<image_1>>>`,
  `<<<video_1>>>`, `<<<element_1>>>`, `<<<voice_1>>>` — numbering follows the
  order the inputs were attached. Mina's runner prepends a marker manifest
  ("<<<image_1>>> as the first frame…") — cite the SAME numbers, never invent new ones.
- **The simpler the syntax, the better** (official guidance). Short declarative
  sentences. Kling responds to plain physical description + explicit camera
  language, not literary prose.
- **Negatives go INSIDE the positive prompt as negative sentences** (official
  recommendation) — "No on-screen text. No captions. No watermark." beats a
  separate negative_prompt field.
- **One camera intent per shot.** Kling has real camera control (pan, tilt,
  roll, zoom, down_back, forward_up, turn-forward presets) — say ONE thing:
  "slow push-in", "static locked-off", "handheld micro-shake". Stacked camera
  instructions fight each other.

## 2. Duration & shots

- Single shot: 3–15s depending on model/mode. Quicks defaults render 1080p pro.
- **Multi-shot storyboards** (multi_shot + multi_prompt): up to 6 shots, each
  with its own prompt (≤512 chars) and duration (≥1s); durations must sum to
  the total. Write each shot as a self-contained mini-scene: subject, action,
  setting, mood, camera — the model does not carry description across shots,
  so repeat the essentials (same woman, same bottle) in every shot prompt.
- **Video edit** (a `<<<video_1>>>` attached as base): output duration equals
  the input video — do not specify a duration or first/last frames; describe
  ONLY the change ("swap the background to a sunset beach; keep everything
  else identical").
- **Video reference** (feature): use for "generate the NEXT shot after
  <<<video_1>>>" continuations, or to borrow its camera movement/style.

## 3. Reference budget (Kling's counterpart to Seedance's 14-cap)

- No reference video: images + elements ≤ **7**.
- With a reference video: images + elements ≤ **4**, and max **1** video.
- Video character elements: ≤ 3 (none allowed when a reference video exists).
- `element_list` and `voice_list` are **mutually exclusive** — a job cannot
  use library elements AND specified voices together.
- First/last frames: `end_frame` requires a `first_frame`; first/last-frame
  jobs on v3-omni allow at most 3 elements.
- Frames must be 300px+ with aspect between 1:2.5 and 2.5:1 — extreme crops
  get rejected before generation.

## 4. Dialogue & voice on Kling

- Native audio: `sound: on` generates ambience + spoken lines written in the
  prompt. Write dialogue in quotes with the speaker clearly named, and state
  when the mouth is still ("she listens, mouth closed" — same mouth-still
  discipline as the Seedance book).
- Specified voices: `<<<voice_1>>>` immediately after the speaker, max 2
  voices per job, official syntax example: `The man<<<voice_1>>> said: "Hello"`.
  Keep the sentence around the tag SIMPLE.
- Motion control keeps the reference video's original sound unless told not to.

## 5. Motion control jobs (reference-video acting)

- The reference video must be ONE continuous shot, character always visible,
  clear upper body or full body, no cuts, no camera moves, stable non-frantic
  actions. Fast/complex motion gets truncated (minimum extractable action: 3s).
- character_orientation "image" (≤10s ref) keeps the anchor image's facing;
  "video" (≤30s ref) follows the reference's facing.
- The prompt's job here is wardrobe/set/mood — the MOTION comes from the video.

## 6. What kills a Kling prompt

- Seedance-length walls of text (truncated at 2,500 — the tail is silently lost).
- Inventing tags the manifest didn't declare (`<<<image_4>>>` with 3 images
  attached → broken reference).
- Two camera intents in one shot.
- Dialogue without mouth-still rules — everyone on screen starts mouthing.
- Describing shot 2's subject only in shot 1 of a storyboard — each shot
  prompt stands alone.

---

## Example prompt — single-shot Quicks image-to-video (KEEP THIS)

Using <<<image_1>>> as the first frame. Vertical 9:16, 8 seconds, single continuous take.
The same mid-twenties British woman from <<<image_1>>> — long brunette waves, bare-face minimal makeup, oversized cream knit jumper — stands at the marble kitchen counter holding the rose-gold NYLA perfume bottle from the frame in both hands at chest height. She lifts it slowly toward the window light, turns it once so the filigree face catches a bright streak, then presses the atomiser at 5s: one soft mist cloud drifts through the sunbeam. She watches the mist settle with a small genuine smile. Her mouth stays closed the whole take — no talking.
Camera: slow gentle push-in from medium to medium-close, nothing else — no pan, no tilt, no zoom-out. Soft morning window light from camera-right, warm bounce, natural skin texture, light handheld micro-shake.
Sound: quiet kitchen room tone, the soft "psshh" of the atomiser at 5s, faint knit-fabric rustle. No music. No voice.
No on-screen text, no captions, no subtitles, no watermark, no logo overlays, no extra hands, no warped bottle, no distorted label.

## Example prompt — 15s multi-shot storyboard (three 5s shots, KEEP THIS)

Shot 1 (5s): The mid-twenties British woman from <<<image_1>>> — brunette waves, cream knit jumper — unzips a small beige parcel on a marble kitchen counter and lifts out the rose-gold NYLA perfume bottle, eyes widening in genuine delight. Bright morning window light from camera-right. Static camera, medium framing. Sound: paper rustle, a soft "oh" breath. No on-screen text.
Shot 2 (5s): Same woman, same kitchen, same rose-gold NYLA bottle. Macro close-up: her hands turn the bottle so the baroque filigree and the "NYLA" medallion catch the light; a slow specular streak crawls across the chrome. Slow push-in, shallow focus. Sound: gentle finger-taps on glass, quiet room tone. No on-screen text.
Shot 3 (5s): Same woman sprays once toward her neck, closes her eyes through the drifting mist, then looks into the lens with a warm closed-mouth smile, holding the bottle up beside her face, label to camera. Static camera, medium-close. Sound: one atomiser "psshh", soft ambient morning. No music, no talking, no on-screen text.
