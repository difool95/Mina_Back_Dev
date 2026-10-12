# Mina Prompt Library v2

This folder is a modular prompting system for Mina. Each request should load the smallest relevant set of files rather than concatenating the entire library.

## Recommended loading order

1. `seedance-prompting.md` — global Seedance structure, references, timing, brand-bleed protection and negatives.
2. One primary format file:
   - `ugc-best-practices.md`
   - `unboxing-asmr.md`
   - `voiceover-mode.md`
   - `iphone-aesthetic.md`
   - `street-interview.md`
   - `podcast-interview.md`
3. `realism-best-practice.md` — realism and AI-failure correction layer.
4. `motion-direction.md` — direction-of-travel truth for vehicles and every moving subject (orientation + world path + screen vector; static references never mean static subjects). Video-only; rides with the realism layer. Added after generation a07cf428 (Aug 2026) rendered a car reversing out of villa gates because the prompt's only motion verb was "rolls out".
5. `camera-angles-and-movements.md` — the camera movements + transitions grammar. ALWAYS loaded for every video (owner's rule, July 2026): every frame/shot gets its own named camera movement and every shot boundary an explicit transition. Video-only — never load for a still.

## Routing examples

- Raw creator perfume review: Seedance + video + iPhone + Realism.
- Product ASMR: Seedance + Unboxing/ASMR + Realism + Camera only when advanced macro movement is needed.
- Founder voice-over film: Seedance + Voice-over + Realism + Camera.
- Street vox pop: Seedance + Street Interview + iPhone + Realism.
- Studio podcast excerpt: Seedance + Podcast Interview + Realism + Camera.
- Found-footage MiniDV scene: Seedance + Realism + Camera; do not load iPhone unless the capture device is actually a phone.
- Drone/FPV action: Seedance + Camera + Realism.

## Conflict resolution

Use this priority order:

1. Explicit user brief and attached references.
2. Platform/provider hard constraints.
3. `seedance-prompting.md` global rules.
4. Primary format grammar.
5. Realism corrections.
6. Camera and style flourishes.

When rules conflict, preserve physical possibility and the primary format. Example: a raw street interview should not inherit a slow cinematic orbit simply because the camera library contains one.

## Mina decision procedure

Before writing a prompt, determine:

- final medium: photo or video;
- platform and aspect ratio;
- capture register: phone, cinema, camcorder, drone, studio;
- primary format: video, ASMR, voice-over, street interview, podcast or narrative;
- duration and number of shots;
- attached media tags and their roles;
- dialogue/voice/audio source;
- product and character continuity anchors;
- realism risks: hands, lip-sync, reflective products, crowds, cloth, liquids, complex movement;
- which mistakes would make this exact concept feel AI-generated.

Then write blueprint → references → action/timing → camera → audio → continuity → imperfection budget → tailored negative prompt.

## What changed in v2

- Unboxing/ASMR now includes product-state ledgers, material resistance, hand anatomy, microphone distance, acoustic perspective and sound/contact synchronization.
- Voice-over now begins with the finished voice, maps narration to visual function, supports J/L-cut logic, defines narrator performance and prevents generic stock B-roll.
- iPhone aesthetic separates front/rear camera, lens, computational processing, stabilization, operator behavior, audio and export compression.
- Street interview models microphone transfer, proximity, public behavior, near/mid/far ambience and background events.
- Podcast interview models room geometry, the 180-degree line, wide/single camera roles, boom-arm continuity, multitrack sound and conversational reactions.
- Realism is treated as causal consistency across anatomy, materials, light, time and sound—not a pile of defects.
- Camera language now separates shot size, position, lens, path, stabilization, focus and start/end framing, with dedicated FPV and drone rules.

## File-format note

The uploaded `.mina` file is a Mina draft JSON containing a single motion brief, settings and asset URLs. It is not a container for the Markdown library. This v2 package therefore preserves the library as Markdown modules, which can be loaded selectively by Mina’s routing/system layer.
