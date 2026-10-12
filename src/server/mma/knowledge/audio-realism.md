Audio Realism — Adaptive Prompt Formula

Use this module only to complete audio details the user did not specify. The user's explicit audio instructions always win.

Selection rule

Use only 2–5 relevant formulas for each video. Never paste the whole library.

Keep the final audio direction compact: usually 40–90 words for one continuous shot and up to 140 words for a multi-shot edit.

Never invent music, dialogue, narration, weather, crowds, sound effects, microphones or background activity that the brief does not imply.

Do not add exact distances, timestamps or technical defects unless they matter to the scene or are provided by the user.

Choose one believable recording perspective. Never combine incompatible microphone systems.

Prompt formulas

Audio Realism | Capture perspective (always choose one) | Prompt formula: Audio captured through [device or microphone] positioned [relative location and useful distance], producing [raw / phone-compressed / controlled / untreated] sound in [mono / narrow stereo / natural stereo]. The audio perspective follows [camera / visible microphone / body-mounted device / dedicated speaker mic] without mixing incompatible recording systems.

Audio Realism | Acoustic bed (use unless deliberate silence is requested) | Prompt formula: Restrained [room tone / open-air tone] matching the visible [location, scale and materials], continuously present but barely noticed. No sterile digital vacuum, obvious ambience loop or environmental layer unsupported by the scene.

Audio Realism | Off-frame environment (use only when clearly implied) | Prompt formula: Include only [one or two physically plausible off-frame sources] appropriate to [location, time and weather], heard at a believable distance and filtered naturally by [walls / windows / doors / open space]. Keep events sparse, irregular and subordinate to the main action.

Audio Realism | Foreground and hero action (use only for realistically audible actions) | Prompt formula: [Visible action or material contact] produces [sound texture] exactly when the physical action begins, with a natural [attack, body and decay] shaped by [material pair, distance and room]. Quieter movements remain inaudible or naturally masked when the recording position could not capture them.

Audio Realism | Voice perspective (use only when speech exists) | Prompt formula: [Speaker profile and delivery] recorded through [microphone and relationship to speaker]. Clarity, warmth and room contribution change naturally when the speaker [moves closer, turns away or goes off-axis]. Only the active speaker lip-syncs, and the voice remains inside the visible environment rather than sounding pasted over it.

Audio Realism | Dynamics and imperfections (select only one or two relevant traits) | Prompt formula: Apply subtle [automatic gain / compression / limiting / wind response / handling noise / codec texture] appropriate to [device and action]. Imperfections are brief, source-linked and restrained; no aggressive denoising, pumping, chopped breath tails, constant fake hiss or unjustified clipping.

Audio Realism | Spatial behavior (use when direction or movement matters) | Prompt formula: Sound direction follows the visible position and path of [source]. Perspective changes smoothly as [camera, microphone or subject] moves, while the stereo width remains appropriate to [capture device]. No hard audio panning, teleporting sources or direction inconsistent with the frame.

Audio Realism | Continuity across cuts (use only for edited or multi-shot clips) | Prompt formula: Preserve [room tone, weather, voice perspective and persistent sources] across cuts in the same location. Change the acoustic character only when [location, recording device, distance or time] genuinely changes. Do not reset ambience or voice timbre at every visual cut.

Audio Realism | Deliberate near-silence (use for quiet or minimal scenes) | Prompt formula: Near-silent [room or location] capture with only a low natural recording floor and [one subtle subject-linked sound]. No decorative ambience, invented background activity, music or artificial digital vacuum.

Audio Realism | Conditional negative prompt (include only failures relevant to the chosen scene) | Prompt formula: Avoid [detached Foley / sound before contact / repeated ambience / every source equally loud / incorrect room reverb / distant sound with close-mic detail / studio-clean exterior dialogue / ambience resetting at cuts / aggressive noise gate / unwanted music]. Remove every negative that does not apply.

Compact output structure

Audio: [capture perspective]; [restrained acoustic bed]; [one or two audible foreground or environmental events]; [voice behavior if speech exists]; [one relevant processing or continuity rule]. [Music treatment only when the brief requires it].

Core default bans

No music, narration, dialogue, crowd reaction or sound effect unless requested or clearly implied.

No sound for every visible movement.

No generic cinematic whooshes, risers, bass drops, sparkle chimes or exaggerated Foley by default.

No exact timestamps unless synchronization across shots requires them.

No full environment preset copied into a prompt.

No contradictory capture instructions.
