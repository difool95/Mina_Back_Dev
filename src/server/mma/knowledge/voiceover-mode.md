# Voice-over Mode — Adaptive Prompt Formula

Use this module when one off-screen narrator carries the meaning while visuals provide evidence, consequence, contrast or atmosphere.

## Selection rule


- The narration is the timing authority.
- Never paste the whole library into one prompt.
- Keep final voice-over direction concise: usually **80–160 words** plus the script.
- Do not invent narration, dialogue, music, captions, CTA, location or B-roll not implied by the brief.
- No visible person should lip-sync unless internal monologue is explicitly requested.

## Prompt formulas

- **Voice-over | Narrative register | Prompt formula:** Register: [product testimony / explainer / documentary observation / founder story / memory essay / tutorial / travel diary / luxury brand film]. Keep the visual and vocal grammar consistent with this register and avoid mixing conflicting commercial, documentary or sales styles.

- **Voice-over | Voice binding (use when an audio file is attached) | Prompt formula:** @Voice 1 runs continuously across the full clip and is the only voice. The edit follows its real cadence, stresses, pauses and breaths. Nobody on screen speaks, mouths the narration or performs direct-to-camera delivery.

- **Voice-over | Narrator specification | Prompt formula:** Narrator: [age impression], [accent or dialect], [pitch and timbre], [pace], [articulation], [emotional baseline and change], recorded through [microphone and room character]. Keep the performance conversational and physically plausible, with restrained breaths and pauses.

- **Voice-over | Narrative map (always use for multi-beat clips) | Prompt formula:** Divide the narration into [number] beats. For each beat define: spoken phrase = [line], narrative job = [setup / proof / turn / resolution], visual relationship = [direct / evidence / consequence / contrast / atmosphere], supporting sound = [one relevant diegetic sound], end state = [continuity state].

- **Voice-over | Visual relationship (choose one per beat) | Prompt formula:** Relate the image to the narration through [direct illustration / evidence / consequence / contrast / atmosphere]. Avoid literally showing every noun or repeating the same relationship across consecutive beats.

- **Voice-over | Visual diversity (use for multi-shot sequences) | Prompt formula:** Across consecutive beats, change at least two of [shot size, angle, camera height, subject, action, foreground relationship, movement direction, location layer or light], while preserving narrative and physical continuity.

- **Voice-over | On-screen human behavior (use when people appear) | Prompt formula:** The visible person performs [simple physical task] with natural gaze shifts and task-related pauses. Mouth remains closed or naturally relaxed, with no syllable-shaped movement, presenter gestures or repeated direct eye contact.

- **Voice-over | Audio hierarchy (always apply) | Prompt formula:** Narration remains centred, stable and intelligible. [One meaningful diegetic sound] supports each beat below the voice, with continuous [room or environment tone] underneath. Music is [none / requested treatment] and never competes with speech.

- **Voice-over | Pacing and performance (use when generating narration) | Prompt formula:** Write for natural speech using human like clauses, varied sentence length and [one or two emphasis words]. Preserve [breath, micro-pause, sigh, eee, or softened ending] without overloading fillers. End with [flat / quiet / unresolved / reflective] energy unless the brief explicitly asks for a CTA.

- **Voice-over | Continuity across B-roll (use for edited sequences) | Prompt formula:** Preserve [product state, wardrobe, jewellery, hands, object placement, time of day, weather, light direction and chronology] across shots. Change only what the action explicitly changes.

- **Voice-over | Editorial sound bridge (use only when the assembled clip needs continuity) | Prompt formula:** Let [room tone, action sound or narration phrase] continue across the visual cut to preserve flow. Use a pre-lap or sound tail only when it serves the edit; do not restart narration or ambience after each shot.

- **Voice-over | Conditional negative prompt | Prompt formula:** Avoid [visible lip-sync / narrator restart after cuts / literal noun-by-noun B-roll / generic stock footage / repeated push-ins / SFX louder than narration / robotic cadence / announcer delivery / invented captions / unwanted music / continuity resets]. Remove any negative that does not apply.

## Compact output structure

```text
Voice-over: register = [type]; voice = [binding or narrator profile]; arc = [setup → proof → turn → resolution]; each beat uses [visual relationship] with [one simple action]; narration remains primary, diegetic sound stays subordinate, and visible people do not lip-sync; continuity = [key state rules].
```

## Core default bans unless requested.

- No visible lip-sync or on-camera speech.
- No captions, kinetic typography or text unless requested.
- No random B-roll under narration.
- No hook → benefit → CTA structure unless explicitly requested.
- No inspirational music, risers or bass hits by default.
- No repeated camera push-in on every beat.
- No hardcoded narrator, setting, script, timing or founder example.
