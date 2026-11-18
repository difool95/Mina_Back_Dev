# Kling 4.0 prompting guide

Source: the official Kling 4.0 API documentation (text-to-video, image-to-video,
omni video) and the Kling 4.0 user guide. This book is for the prompt-writing
AI on every KLING render — the Art lane (called Quicks until Oct 23). Kling is
NOT Seedance — different tags, different limits, different taste.

## 1. Golden rules

- **Tags are `@image_N` and `@video_N`** — the id each attached material
  carries (`@image_1`, `@image_2`, `@video_1`). Never `<<<>>>`, never
  `@Image 1`. Numbering follows the order the inputs were attached. Mina's
  runner prepends a manifest ("Using @image_1 as the first frame, @image_2 the
  product to feature…") — cite the SAME numbers, never invent new ones.
- **Say what each reference lends, every time you cite it.** "Preserve the
  person's face, hairstyle and clothing from @image_1." "Follow the movement
  rhythm in @video_1 without using its background." A reference cited with no
  purpose is used however the engine guesses.
- **Budget.** The engine reads up to 26,000 English characters (11,000
  non-English), so nothing is truncated — but it is a diffusion model, not a
  reader. 600–2,000 characters is the sweet spot: every sentence changes what
  moves, what the camera does, what is heard, or what a reference lends.
- **The simpler the syntax, the better.** Short declarative sentences, plain
  physical description, explicit camera language. No literary prose.
- **Negatives go INSIDE the prompt as sentences** — "No on-screen text. No
  captions. No warped label." There is no negative field on 4.0; Mina's runner
  appends the writer's negative list as one "Avoid:" sentence.
- **One camera intent per shot.** "Slow push-in", "static locked-off",
  "handheld micro-shake". Stacked camera instructions fight each other.
- **Organise the prompt as: reference roles → overall setting → event
  sequence → audio.** That is the order the engine's own guide recommends.

## 2. Duration & shots

- One clip is **3–30 seconds, whole seconds, in a single pass** — no stitching,
  no drift between segments. Art renders 1080p.
- Match complexity to length: one clean action for 5s; a short progression
  for 10–15s; a real sequence of 2–4 beats for 20–30s. Timestamps help ("at
  5s she sprays"; "at 12s, cut to…").
- **Multi-shot** is written as text: "Shot 1 (5s): … Shot 2 (5s): …". Each
  shot is a self-contained mini-scene — restate the subject and the product;
  the model carries nothing across shots. Durations sum to the total.
- **Keyframes:** the first frame is `@image_1`; a last frame and middle
  frames can be attached (up to 10 images in all) and the engine lands on
  them in order. Cite them: "end on the exact pose of @image_3".
- **Video edit** (a base video attached as `@video_1`): say what to change
  and what to preserve, explicitly. The output keeps the source's length
  unless a duration is given.
- **Feature video** (a reference clip as `@video_1`): borrow its motion,
  camera, cut rhythm or style — say which. The 3.0 "motion control" product
  is this: `@image_1` is the first frame, `@video_1` the motion reference.

## 3. Reference budget

- Up to **10 images** (first / middle / last frames and reference images) and
  **5 reference videos**, **15 materials in all** (images + videos + elements
  + voices).
- Images: jpg / jpeg / png, ≥300 px a side, aspect between 2:5 and 5:2, ≤30 MB.
- Videos: mp4 / mov, 3–30 s each and in total, 700–4553 px a side, ≤300 MB,
  24–60 fps. Mina ships its own clips as a 1080p copy, inside every bound.
- An id is required when several middle frames or reference images ride.

## 4. Dialogue & voice on Kling

- Native audio is on by default: ambience, effects and the spoken lines
  written in the prompt. Write dialogue in quotes with the speaker clearly
  named, and state when a mouth is still ("she listens, mouth closed") — the
  same mouth-still discipline as the Seedance book. For a silent clip write
  "No speech, no music."; Mina also mutes the delivered file when the user
  turned sound off.
- Delivery and pace go in the label BEFORE the line — `She says (warm British female, unhurried): "…"` — in plain words (natural pace, unhurried, speaking slowly; 'fast' only when the brief asks for a fast talker). Kling has no speed setting: it speaks what the clip holds in the seconds it has, about 2.5 words a second, so a 5s clip holds about 12 words, a 10s clip about 25 and a 30s clip about 75, however many short sentences that is; a back-and-forth needs about 10s. One continuous talk is written as one shot (no Shot 1 / Shot 2, no cuts) unless the brief wants a cut creator edit or cuts away while the voice carries on; then name the voice in full in every shot it is heard (gender, tone, accent, pace — never "the same voice", which Kling cannot resolve across shots), and in a shot without the speaker's face write `Her voice, off-screen, goes on (…): "…"` with no mouth in frame.
- A pause, a breath or a laugh is plain action between two lines (`she pauses, smiles, then says (…): "…"`), never an ellipsis or a dash inside the quotes.
- Breaths and tempo come from the person and the moment: a calm talker breathes at sentence ends, an excited one runs on and then catches a bigger breath, someone running breathes between a few words. One person going on keeps one voice (`she takes a quick breath and goes on (…): "…"`), and every line is a whole spoken sentence, never keywords.
- Two speakers: write the switch out (`then he answers (…): "…"`) and keep the listener's mouth closed — without it Kling can run both lines into one voice. Three or more speakers in one clip degrade.
- The user's lines are spoken exactly as written, each by its own speaker. A script longer than the clip holds at that pace stays exact, in order, up to the last whole line the clip holds — the rest is for the user's own extend, never spoken faster. It is retyped only when the brief asks for a rewrite.
- A reference video's original sound is kept when the prompt says so ("keep
  @video_1's original sound exactly") and dropped when it says not to.

## 5. Motion jobs (reference-video acting)

- The reference video should be ONE continuous shot, character visible, clear
  upper body or full body, stable non-frantic actions. Fast or complex motion
  transfers worse.
- The prompt's job here is identity, wardrobe, set and mood — the MOTION comes
  from `@video_1`. Say it plainly: "copy @video_1's body movement, hand and
  head timing and camera; take the person, wardrobe and room from @image_1."

## 6. What kills a Kling prompt

- Inventing tags the manifest didn't declare (`@image_4` with 3 images
  attached → broken reference).
- A reference cited with no purpose.
- Two camera intents in one shot.
- Dialogue without mouth-still rules — everyone on screen starts mouthing.
- Describing shot 2's subject only in shot 1 of a storyboard — each shot
  prompt stands alone.
- Literary prose: the engine renders what moves, not how it is written.

---

## Example prompt — single-shot Art (Kling 4.0) image-to-video (KEEP THIS)

Using @image_1 as the first frame and @image_2 as the product to feature. Vertical 9:16, 8 seconds, single continuous take.
The same mid-twenties British woman from @image_1 — keep her face, long brunette waves, bare-face minimal makeup and oversized cream knit jumper exactly — stands at the marble kitchen counter holding the rose-gold NYLA perfume bottle from @image_2 (its exact bottle shape, filigree face and "NYLA" medallion) in both hands at chest height. She lifts it slowly toward the window light, turns it once so the filigree face catches a bright streak, then presses the atomiser at 5s: one soft mist cloud drifts through the sunbeam. She watches the mist settle with a small genuine smile. Her mouth stays closed the whole take — no talking.
Camera: slow gentle push-in from medium to medium-close, nothing else — no pan, no tilt, no zoom-out. Soft morning window light from camera-right, warm bounce, natural skin texture, light handheld micro-shake.
Sound: quiet kitchen room tone, the soft "psshh" of the atomiser at 5s, faint knit-fabric rustle. No music. No voice.
No on-screen text, no captions, no subtitles, no watermark, no logo overlays, no extra hands, no warped bottle, no distorted label.

## Example prompt — 20s three-shot sequence in one pass (KEEP THIS)

Using @image_1 as the first frame and @image_2 as the product to feature. Vertical 9:16, 20 seconds, three shots.
Shot 1 (7s): The mid-twenties British woman from @image_1 — keep her face, brunette waves and cream knit jumper — unzips a small beige parcel on a marble kitchen counter and lifts out the rose-gold NYLA perfume bottle from @image_2, eyes widening in genuine delight. Bright morning window light from camera-right. Static camera, medium framing. Sound: paper rustle, a soft "oh" breath. No on-screen text.
Shot 2 (6s): Same woman, same kitchen, the same rose-gold NYLA bottle from @image_2. Macro close-up: her hands turn the bottle so the baroque filigree and the "NYLA" medallion catch the light; a slow specular streak crawls across the chrome. Slow push-in, shallow focus. Sound: gentle finger-taps on glass, quiet room tone. No on-screen text.
Shot 3 (7s): Same woman sprays once toward her neck, closes her eyes through the drifting mist, then looks into the lens with a warm closed-mouth smile, holding the bottle up beside her face, label to camera. Static camera, medium-close. Sound: one atomiser "psshh", soft ambient morning. No music, no talking, no on-screen text.
