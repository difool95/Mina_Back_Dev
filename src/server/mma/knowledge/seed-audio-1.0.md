# Seed Audio 1.0 — scene sound design, not just TTS

Seed Audio 1.0 is BytePlus Seed Speech's non-streaming audio generation model.
It is **reference-to-audio**, not text-to-speech: one call can produce dialogue,
voice character, ambience, Foley, sound effects and background music together as
one timed soundtrack.

Available **now**, independently of Seedance 2.5's pending API.

Tags: **[OFFICIAL]** BytePlus / Seed Audio documentation · **[PRACTICE]** ours.

---

## 1. Hard limits — design to these [OFFICIAL]

| Constraint | Value |
|---|---|
| Endpoint | `POST https://voice.ap-southeast-1.bytepluses.com/api/v3/tts/create` |
| Auth | `X-Api-Key` header |
| Model id | `seed-audio-1.0` |
| Prompt length | **3,000 characters** max (`text_prompt`) |
| Output duration | **120 seconds** max |
| Reference audio | **3 clips** max, each ≤ **30 s** and ≤ **10 MB** — wav / mp3 / pcm / ogg_opus |
| Reference image | **1** max, ≤ **10 MB** — jpeg / png / webp |
| Output formats | wav (default) / mp3 / pcm / ogg_opus |
| Output URL lifetime | **2 hours** |
| Billing basis | `original_duration` (the model's raw output length), $0.15 / minute, per-second accuracy |
| Languages | 20 — English, Chinese, Japanese, Korean, Mexican Spanish, Indonesian, German, Brazilian Portuguese, French, Thai, Vietnamese, Malay, Filipino, Italian, Russian, Dutch, Polish, Turkish, Swedish, Castilian Spanish |

### Two limitations that shape the whole architecture [OFFICIAL]

1. **It returns ONE mixed audio file** — not separate dialogue / music / SFX
   stems, despite the "multi-track generation" marketing wording. Anything that
   needs a clean dialogue-only track (lip-sync) requires a **second call** that
   asks for dialogue only.
2. **It cannot watch a video.** Input is text, up to three audio references, or
   one image reference. The soundtrack must be produced from the timed scene
   blueprint *before* video generation — it is never derived from a finished
   clip.

And two mode rules that are easy to violate **[OFFICIAL]**:

- `speaker`, `audio_data` and `audio_url` are **mutually exclusive** — provide
  exactly one per reference entry.
- An **image reference cannot be mixed with audio references**, and in
  image-reference mode `text_prompt` may contain **only the text to be
  synthesized**. Full sound design therefore uses text-only or audio-reference
  mode — never image mode.

### The 2-hour URL is a persistence requirement [PRACTICE]

The returned `url` expires in two hours. Save the audio to our own storage
immediately on receipt; never store the vendor URL as the artifact address.
Prefer the base64 `audio` field in the response over re-fetching the URL.

---

## 2. The four generation modes [OFFICIAL]

| Mode | How it is selected | Use |
|---|---|---|
| **TTS** | `speaker` id + text | a known voice reads a line |
| **Voice cloning** | one reference clip | clone a voice, then speak with it |
| **T2A** (text prompt → audio) | no references at all | describe voice character, atmosphere, music and SFX in prose; the model builds the whole soundtrack |
| **TA2A** (text + audio → audio) | up to 3 audio references | same as T2A, but voice character/emotion is anchored to reference clips |

The mode is matched **automatically** from what is passed in `references` —
there is no explicit mode field.

---

## 3. What a good T2A prompt contains [OFFICIAL]

Five things, all of them:

1. **Environment** — weather, location, context.
2. **Background music and sound effects** — classical orchestral, hip-hop, high
   heels, chuckles, and so on.
3. **Character action / appearance** — waving hands, playing soccer.
4. **Character voice** — gender, age, emotion, tone, speed, accent.
5. **What the characters actually say.**

**Keep the prompt language and the script language the same.** [OFFICIAL]

### Worked example [OFFICIAL]

```
Inside a huge football stadium, with the deafening roar of tens of thousands of
fans throughout the background. The commentator (middle-aged male, British
accent, rich and penetrating voice, classic sports commentary, extremely
exhilarated) shouts in a rapid, soaring, full-throated tone: "OH, HE SCORES!!!
WHAT A GOAL! He beats two men and buries it in the top corner — UNBELIEVABLE!
The stadium is on its feet!!!" He draws out the word "GOAL" with a voice
slightly hoarse from excitement, and the crowd's cheering erupts at the moment
of the goal and continues to the end.
```

Note the shape: environment first, then the speaker's voice character in
parentheses, then the delivery, then the line, then how the ambience behaves
across the clip.

---

## 4. Timestamp control [OFFICIAL]

Inline `[start:end]` before a line pins that sentence's window. Accuracy is to
the second.

```
Ryan (young adult male, warm voice) calls out anxiously, slightly out of
breath: "[5.5s:8.0s] Maya! Wait—you're really leaving tonight?"
Maya (young adult female, soft voice) answers softly, forcing herself to stay
composed: "[8.5s:11.5s] I have to. I've spent years chasing this… I can't walk
away now"
```

This is what makes Seed Audio usable as a **cue-accurate** scene soundtrack
rather than a loose read: the same beat windows used for the video prompt go
straight into the audio prompt.

---

## 5. Speaker binding in TA2A [OFFICIAL]

Reference clips are addressed as `@Audio1` / `@Audio2` / `@Audio3`, numbered in
upload order. Speakers are bound to them with `<<TGT_SPKn>>`:

```
Marcus (a male voice, smooth and confident, warm playful broadcaster tone,
clear articulation, the actor is <<TGT_SPK1>>), upbeat and inviting, says:
"Hey there! Quick question—what's the most embarrassing thing that's ever
happened to you?"
Tyler (a younger male voice, slightly nervous, expressive with a light laugh,
the actor is <<TGT_SPK2>>), letting out a long groan, says: "Oh, you do NOT
want to know."
```

`voiced by <<TGT_SPK1>>` works identically to `the actor is <<TGT_SPK1>>`.
Re-state the binding on every subsequent line for that speaker — the examples in
the official docs repeat it each time rather than declaring it once.

State three things clearly when using references **[OFFICIAL]**:
1. what content to generate,
2. which reference audio to use,
3. the purpose of each reference audio.

---

## 6. Subtitles give you word-level timestamps [OFFICIAL]

Set `audio_config.enable_subtitle: true` and the response carries a `subtitle`
object with utterance-level **and** word-level timings in milliseconds:

```
subtitle.sentences[] → { start_time, end_time, text, words[] }
words[]              → { start_time, end_time, text }
```

This is the cheapest accurate cue sheet available. **[PRACTICE]** Use it to
build the dialogue timing track, to drive lip-sync alignment, and to write the
timed cue list into the Seedance megaprompt so the visual beats and the audio
land on the same clock. Always request it for dialogue-bearing generations.

---

## 7. Output shaping [OFFICIAL]

`audio_config`:

| Field | Range / values | Default |
|---|---|---|
| `format` | wav / mp3 / pcm / ogg_opus | wav |
| `sample_rate` | 8000, 16000, 24000, 32000, 44100, 48000 | wav/pcm 40000; mp3 44100 |
| `speech_rate` | −50 … 100 (100 = 2.0×, −50 = 0.5×) | 0 |
| `loudness_rate` | −50 … 100 (100 = 2.0×, −50 = 0.5×) | 0 |
| `pitch_rate` | −12 … 12 | 0 |
| `enable_subtitle` | true / false | false |

Response `duration` is the post-processed length and may differ from
`original_duration` when speed adjustment or post-processing applied.
**Billing uses `original_duration`.** Cost must be computed from
`original_duration`, never from the muxed file's length.

`watermark` supports an explicit `aigc_watermark` (audio rhythm marker appended
to the output) and an implicit `aigc_metadata` block (`content_producer`,
`produce_id`, `content_propagator`, `propagate_id`).

**Format truth [PRACTICE]:** the default output is **wav**. Label the stored
artifact by the `format` actually requested — mislabelling wav as mp3 breaks
downstream muxing.

---

## 8. How Mina uses it

The Scénariste's timed scene blueprint becomes one canonical **AudioPlan**:

```
duration
dialogue[]  { speaker, voice, language, accent, words, start, end }
ambience[]  { description, start, end, level }
sfx[]       { description, cue, level }
music[]     { style, start, end, transitions, level }
silence[]   { start, end }
```

The plan is engine-agnostic. The selected adapter consumes it:

- **Seed Audio** — compiles the plan into one `text_prompt` with `[start:end]`
  cues and produces the master mix in one call.
- **ElevenLabs** — dialogue via TTS, Foley/ambience via the Sound Effects API,
  score via the Music API, then Mina mixes the layers.

Renderer handling:

| Renderer | Treatment |
|---|---|
| Seedance | attach the soundtrack as `@Audio`, put the identical timed cues in the megaprompt, then **mux the exact master** over the result so the final audio is the real track, not an approximation |
| Kling b-roll | render silent, then mux the master |
| Kling with visible speech | lip-sync against a **clean dialogue-only** track, then mux the complete master |

Because Seed Audio returns only one mixed waveform, a Kling talking job needs
**two calls**: one dialogue-only sync track, one full master. Music and
explosions in the sync track confuse mouth alignment.

---

## 9. Ideal use cases [OFFICIAL]

Audiobooks (T2A/TA2A remove the need for human recording and separate SFX
work), video dubbing (describe the voice, or supply a character image, and get
voice + SFX + music together), and gaming (character voices and environment
SFX).
