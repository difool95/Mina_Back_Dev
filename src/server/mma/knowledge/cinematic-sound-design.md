# Cinematic Sound Design — Adaptive Prompt Formula

Use this module only for cinematic, narrative, commercial, fashion, beauty, product, suspense, action or deliberately authored moving-image work.

This module sits on top of `audio-realism.md`. Audio realism defines believable capture and physics. This file defines what the audience should notice, what should recede, and how much expressive design the brief allows.

## Selection rule

- Use only **3–6 relevant formulas** per video.
- Never paste the whole library into one prompt.
- The user's explicit sound instructions always win.
- Select one design level before adding cues.
- Keep the final cinematic audio direction concise: usually **60–120 words for one continuous shot** and **up to 180 words for a multi-shot sequence**.
- Do not invent music, danger, crowds, reactions, dialogue, impacts, motifs or off-screen events that the brief does not imply.
- Do not add exact timestamps unless the edit or synchronization genuinely requires them.
- Prefer one clear sonic idea over many effects.

## Prompt formulas

- **Cinematic Sound | Capture-led documentary (use for observational, handheld, phone, found-footage or evidence-like work) | Prompt formula:** Design level: capture-led documentary. Preserve the declared camera or microphone perspective, including believable distance, masking, room tone and mild capture imperfections. Shape attention through continuity, subtraction and selective emphasis only. No non-diegetic effects, polished Foley, emotional drone, impact sweetener or score unless explicitly requested.

- **Cinematic Sound | Enhanced realism (use for grounded drama, naturalistic commercials and prestige documentary) | Prompt formula:** Design level: enhanced realism. Keep production sound as the base and reinforce only [story-relevant physical details] with restrained source-compatible Foley. Preserve the visible space, microphone perspective and natural dynamics. Any tonal or low-frequency support remains subliminal and physically motivated.

- **Cinematic Sound | Expressive cinematic (use for stylized fashion, perfume, beauty, suspense, fantasy or emotional montage) | Prompt formula:** Design level: expressive cinematic. Keep the physical acoustic world coherent, then use one restrained recurring [sonic motif or texture family] to support [emotion or story function]. Designed treatment may briefly move beyond literal realism, but must return clearly to the scene's believable sound world.

- **Cinematic Sound | Heightened spectacle (use only when the brief explicitly asks for trailer, hype, epic reveal, sports spectacle or maximal action) | Prompt formula:** Design level: heightened spectacle. Build [quiet-to-loud dynamic arc] using selective impacts, rises, drops or low-frequency weight only where the image earns them. Vary scale and density, protect dialogue when needed, and never place the same hit on every cut.

- **Cinematic Sound | Sonic point of view (always choose one) | Prompt formula:** Sonic point of view: [camera-attached / production-dialogue / character-subjective / environmental / omniscient designed]. Let distance, direction, masking, stereo width and detail follow that perspective consistently until the story intentionally changes it.

- **Cinematic Sound | Story function (use for each important beat) | Prompt formula:** Story function: [orient / focus / reveal / anticipate / conceal / connect / separate / subjectivize / intensify / release / contrast / authenticate]. Use sound to make the audience notice [specific action, emotion or spatial information], while suppressing any layer that competes with that purpose.

- **Cinematic Sound | Sonic focus (use when several layers are present) | Prompt formula:** Sonic focus: lead = [one primary sound]; support = [one contextual or physical sound]; bed = [restrained continuous environment]; suppress = [layer deliberately reduced or absent]. Keep no more than one or two highly detailed layers active at the same moment unless sensory overload is intentional.

- **Cinematic Sound | Physical event design (use for meaningful visible actions) | Prompt formula:** [Visible action or material contact] produces [attack], [material body] and [natural decay] shaped by [mass, force, contacting materials, distance and space]. Add low-frequency weight only when the visible scale or emotional function justifies it. No generic impact detached from the object.

- **Cinematic Sound | Dynamic arc (use for cinematic sequences) | Prompt formula:** Dynamics: [starting density and intensity] → [pressure, interruption or narrowing] → [release, aftermath or return]. Preserve contrast by leaving air before major sounds and avoid wall-to-wall loudness, constant drone or continuous sub-bass.

- **Cinematic Sound | Motif (use only when one recurring idea strengthens the concept) | Prompt formula:** Motif: [scene-linked sound source or texture] associated with [idea, character, product or emotion]. Repeat or transform it through [distance, filtering, rhythm, pitch, absence or diegetic-to-designed change], using one coherent vocabulary rather than unrelated effects.

- **Cinematic Sound | Subjective treatment (use only when the audience enters a character's sensory state) | Prompt formula:** Shift briefly into [character's physical or emotional perspective] by emphasizing [breath, pressure, one isolated source or narrowed hearing] and reducing [external detail]. Keep the treatment motivated, restrained and reversible; do not add heartbeat, tinnitus or muffling automatically.

- **Cinematic Sound | Sound bridge or pre-lap (use when sound intentionally connects shots) | Prompt formula:** Let [source from the next or current scene] begin before or continue after the visual cut to [anticipate, connect, reveal or preserve emotion]. Keep the source physically or narratively motivated and maintain continuous ambience beneath the edit.

- **Cinematic Sound | Match-cut sound (use when two scenes share a real sonic relationship) | Prompt formula:** Transform [sound A] into [sound B] through a shared [rhythm, pitch, texture, envelope or material quality], creating one continuous auditory bridge. Do not label unrelated sounds as a match cut.

- **Cinematic Sound | Hard sonic cut (use for deliberate rupture) | Prompt formula:** Break picture and sound together at [story turning point], replacing [previous acoustic world] with [new acoustic world or controlled near-silence]. Use only when the abrupt contrast serves surprise, comedy, shock, separation or location change.

- **Cinematic Sound | Designed transition (use rarely and only for expressive or spectacle levels) | Prompt formula:** Use one brief [source-derived air, material, tonal or mechanical sweep] to support [specific fast movement or transition]. Define its direction, duration and story purpose. No stock whoosh, riser or hit simply because the picture cuts.

- **Cinematic Sound | Dialogue integration (use only when dialogue exists) | Prompt formula:** Dialogue remains grounded in [boom / lavalier / phone / reporter mic / radio / off-screen source], with believable distance, facing, room reflection and environmental masking. Preserve natural breath, overlap and effort while keeping meaning intelligible when the story requires it.

- **Cinematic Sound | Music hierarchy (use only when music is requested or central to the concept) | Prompt formula:** Music: [none / diegetic / non-diegetic / trans-diegetic]. Its function is [emotion, rhythm, contrast or continuity], entering at [motivated moment], sitting [above or below specific sound layers], and leaving without erasing the acoustic world.

- **Cinematic Sound | Continuity across cuts (use for edited sequences) | Prompt formula:** Preserve [location bed, weather, persistent machinery, dialogue capture and spatial orientation] across shots in the same place. Change perspective only when [camera, microphone, enclosure, distance, time or location] genuinely changes. Do not restart ambience or redesign every cut independently.

- **Cinematic Sound | Conditional negative prompt (include only relevant failures) | Prompt formula:** Avoid [over-Foley / generic stock effects / ambience restarting / repeated loops / impossible reverb / sound before contact / every layer equally loud / dialogue detached from location / wall-to-wall low-end / random whooshes / motif inconsistency / unwanted music]. Remove every negative that does not apply.

## Compact output structure

```text
Cinematic audio: [design level]; [sonic point of view]; story function = [primary function]; lead = [main sound], support = [secondary sound], bed = [continuous environment], suppress = [reduced layer]; [one physical event, motif or editorial sound rule]; dynamics = [arc]; [music treatment only when requested].
```

## Core default bans

- No fade-in or fade-out audio treatment unless explicitly requested.
- No generic cinematic whoosh, riser, boom, braam, bass drop, heartbeat, sparkle chime or emotional drone by default.
- No hit on every cut.
- No polished Foley for every visible movement.
- No wall-to-wall low-end, constant tonal bed or permanent maximum intensity.
- No music unless requested or clearly central to the concept.
- No invented documentary danger, reactions, sirens, crowds or off-screen facts.
- No hardcoded scene, microphone, location, sound source, distance or timestamp.
- No full preset copied into the final prompt.
- No contradiction with `audio-realism.md` or the user's explicit brief.
