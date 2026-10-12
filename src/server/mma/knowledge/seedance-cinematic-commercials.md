# Seedance 2.0 — cinematic commercials & short-drama register

For briefs that want CINEMA: commercials, brand films, trailer-feel product spots,
short-drama scenes. Built from the official Seedance 2.0 template (translated) and
the Seedance team's own director-agent playbook. For raw video register use the video
files instead — never mix the two grammars in one prompt.

## 1. Think like the Seedance "director agent"

The Seedance team structures cinematic work as a director agent with these skills —
write your prompt the way that director thinks:

1. **Shot splitting with consistency.** Break the video into shots that stay
   visually consistent with each other and cut smoothly — do NOT over-cut. Each
   shot flows from the previous one; a 15s piece wants 3–5 shots, not 10.
2. **Real-world light and physics.** Describe lighting that could exist (source,
   direction, temperature) and physical behaviour (cloth soaking and getting
   heavy, liquid splashing, hair moving) — Seedance simulates them when told.
3. **One style, chosen deliberately.** Name the style register once (film stock,
   era, colour palette) and keep every shot inside it.

## 2. The cinematic blueprint (exactly as the official template orders it)

1. **Scene description** — place cited from its ref ("the luxury mansion foyer
   from @Image 1, dim chandelier light, spilled milk on the marble floor"), the
   emotional atmosphere ("a suffocating silence broken only by cold, calculated
   menace"), then format: "16:9 cinematic widescreen, 4K film texture."
2. **Style description** — one line of register.
3. **Character descriptions** — every character in one tagged line:
   `@Image 4 Ryder (silver hair, back to camera, suit); @Image 3 Mila (standing,
   soaked grey dress, shocked expression); @Image 6 Sienna (orange jacket,
   holding up a phone)…`
4. **Core action** — the dramatic arc with tags inline. State physical micro-detail
   Seedance should enhance ("fluid physics on the milk; her ears flatten; her eyes
   widen and turn glossy with tears; the outstretched hand slowly lowers").
5. **Framing** — per-shot lens plan: "Panavision anamorphic widescreen. The
   establishing shot uses @Image 1's composition, subtly pushing toward @Image 4's
   back. The phone-screen close-up is a macro push-in. Mila's close-up uses a
   slow-shutter feel."
6. **Audio hierarchy** — order the mix explicitly: "keep her breathing and the
   knee-on-marble impact clearly layered against the dialogue. NO background
   music" (cinema lives on diegetic sound; add score ONLY if the brief asks).
7. **Shot-by-shot timeline** — the core of the prompt. Per shot:
   ```
   0–3s: Shot 1: 【wide establishing, based on @Image 1】+【static camera】+ Ryder's (@Image 4) unshakeable back.
   Dialogue: "Walk out that door, and your mom's ventilator shuts off in sixty seconds."
   SFX: low resonant menace tone, a distant clock ticking.

   9–12s: Shot 4: 【close-up on Mila】+【slow-shutter feel】+ @Image 3 freezes, ears
   flattening, eyes wide and glossy, the reaching hand lowering.
   SFX: her trembling, broken breathing; a tear sliding on skin.
   ```
   One camera intent per shot. Dialogue lines verbatim. An SFX line for EVERY shot
   — silence is also a sound direction.
8. **Negative prompt** — the full official list (see the Seedance prompting guide,
   section 4), plus scene-specific fixes for anything the model got wrong on a
   previous attempt (the official template literally lists "a paper mysteriously
   appearing in her hand" — fix observed glitches by naming them in the negative).

## 3. Commercial-specific craft

- **The product is a character.** Give it a tagged line in the character section
  with material, finish, label and how light hits it ("deep specular streaks on
  the mirror-polished rose-gold chrome").
- **Arc in 15 seconds:** establish (0–3s) → desire/demo (3–10s) → hold on the
  product (10–15s). The final shot holds the product in its best light — slow
  push-in or a hand setting it down, never a spin (back-face quirk).
- **Cut rhythm sells register.** Luxury = fewer, longer shots with slow moves.
  Energy/sport = harder cuts, but still one camera intent per shot.
- **Dialogue is optional in commercials.** A silent piece with strong SFX design
  (pour, clink, fabric, breath) often reads more premium than a voice.
- **Consistency across a series:** reuse the same tagged character/scene reference
  images in every generation of the campaign; describe them identically.

## 4. Budgeting the 14 references

Cinematic jobs eat references fast. Priority order when trimming to 14:
1. Frame anchor(s) — the start (and end, if used) frame.
2. The product.
3. The main character(s).
4. The scene/set reference.
5. Style/grade references — only if slots remain.
Cut style refs first; describe style in words instead. Never attach two
near-identical references — one slot each.

---

## Example prompt — full, real, in-register (KEEP THIS)

Aspect ratio 9:16 vertical, 15 seconds, 1080p, cinematic commercial grade, three shots with hard cuts at 5.0s and 10.0s. No on-screen text of any kind — no captions, no title cards, no logos beyond the product itself, completely text-free frame from 0 to 15s.

Hero product — @Image 1. Rose-gold / champagne-gold-chrome NYLA perfume bottle — flat round disc silhouette (hip-flask shape, wide circular face-on, slim from the side), highly reflective mirror-polished rose-gold chrome. Front face has raised baroque filigree scrollwork curling around a small oval medallion with "NYLA" in rose-pink on a pale inset. Fluted ribbed base, narrow ribbed engraved neck collar, wide mushroom-domed faceted gem-cut cap.

Shot 1 — 0.0–5.0s — "The dark room". Pitch-black void set. A single hard spotlight snaps on at 0.4s from top-left, carving the bottle out of the darkness on a slowly rotating black gloss pedestal. The rose-gold chrome throws one long specular streak that crawls across the filigree as the pedestal turns ~30 degrees over the shot. Dust motes drift through the light beam. Camera: slow 35mm push-in from medium to close, shallow depth, anamorphic oval bokeh. SFX: low room-tone rumble, a soft rising airy shimmer as the light snaps on, the faint mechanical whisper of the turning pedestal. No music.
Shot 2 — 5.0–10.0s — "The touch". Cut to macro. A woman's hand — fair skin, long pointed-almond nails in glossy deep burgundy, a thin gold band on the ring finger — enters frame-right in slow motion and lifts the bottle off the pedestal. Contact at 6.2s: fingertips wrap the disc edge, micro-fingerprints bloom on the chrome and fade. As the bottle lifts, the spotlight flares through the gem-cut cap and splits into prismatic streaks. Camera: locked-off macro, 100mm, razor-thin focus plane on the medallion. SFX: the tiny glass-on-gloss lift note at 6.2s, a slow silk-rustle as her sleeve moves, the low rumble continuing underneath. No music.
Shot 3 — 10.0–15.0s — "The mist". Cut to profile against the black void. She holds the bottle at collarbone height and presses the atomiser at 11.0s — one slow-motion cloud of fine mist erupts sideways through the spotlight beam, every droplet lit like a constellation, drifting and settling until 14.0s. The bottle stays sharp in the foreground, label face angled 15 degrees toward camera. Final second: the mist thins, the spotlight dims to a last glint on the medallion, cut to black at 15.0s. Camera: static 50mm profile, no movement — the mist is the movement. SFX: the sharp-but-soft "psshh" of the atomiser at 11.0s with a crisp cap-click before it at 10.6s, then near-silence as the droplets drift, room-tone fading with the light. No music anywhere in the piece — the sound design IS the score.

Lighting & grade. Single-source hard spotlight, everything else void-black. Deep blacks with zero lift, controlled specular highlights allowed to bloom on chrome only, warm champagne cast inside the beam, cool falloff at the edges. Fine 35mm film grain, subtle halation around the brightest chrome streaks, no digital sharpening.
Lens & camera. One camera intent per shot as written — push-in / locked macro / static profile. No handheld, no shake, no whip, no zoom.
Imperfections to preserve. Dust motes in the beam, micro-fingerprints on the chrome at the touch, one slow natural drift in the mist cloud — the piece should feel photographed, not rendered.
Audio direction. No voice, no music. Room-tone rumble + the four named sounds (light snap-shimmer, pedestal whisper, lift note + silk, cap-click + atomiser psshh) mixed sparse and close.
Negative prompt: on-screen text, captions, subtitles, watermark, logo overlay, background music, soundtrack, person talking, moving lips, extra hands, extra fingers, warped product, distorted label text, cartoon, illustration, oversaturated, plastic skin, camera shake.
