# Realism Best Practice — Human, Material & Environmental Truth

Use this file as a realism layer over every Mina photo or video mode. Realism does not mean “add pores, grain and camera shake.” A result feels real when causes and consequences agree across time: bodies carry weight, skin deforms, hair reacts to air, clothing reacts to joints, objects keep state, shadows stay attached, focus/exposure have reasons, and sound arrives from the visible event.

Follow `seedance-prompting.md` for structure and apply this file after the format-specific mode.

## 1. The realism stack

Build realism from large truths to small truths:

1. **World truth:** time, place, architecture, weather, era and social context agree.
2. **Spatial truth:** scale, perspective, contact, shadows and depth agree.
3. **Body truth:** balance, anatomy, weight transfer and joint limits agree.
4. **Temporal truth:** identity, wardrobe, objects, light and motion remain continuous.
5. **Material truth:** cloth, metal, glass, hair, liquid and skin respond differently.
6. **Behavioral truth:** people notice, hesitate, anticipate and react at believable times.
7. **Optical truth:** lens, focus, exposure, shutter and stabilization fit the camera.
8. **Acoustic truth:** loudness, distance, reflection, occlusion and timing fit the scene.
9. **Microdetail:** pores, fibres, scratches, dust and compression support the above.

Never begin at level 9 while levels 1–8 are vague.

## 2. Detail hierarchy for prompts

Use three scales:

### Macro details — scene-defining

- location geometry;
- body positions;
- light source and direction;
- camera path;
- main action and objective;
- object state;
- weather and time of day.

### Meso details — credibility

- wardrobe construction and fit;
- furniture wear;
- hand grips;
- hair shape;
- foot placement;
- background behavior;
- room acoustics;
- surface materials.

### Micro details — final realism

- pores and peach fuzz;
- cuticle edges;
- fabric pilling;
- tiny scratches;
- condensation paths;
- dust caught by side light;
- asymmetric expression;
- delayed focus correction.

A strong prompt uses a few selected microdetails where the lens can see them. Do not describe invisible pores in an aerial wide shot.

## 3. Face and skin

### Skin is regionally different

Describe variation rather than one global texture:

- forehead: slightly more sheen;
- nose/inner cheeks: visible pores and stronger speculars;
- under eyes: thin skin, faint folds or colour variation;
- lips: fine vertical lines and uneven moisture;
- jaw/temples: finer pores and small facial hairs;
- neck: different texture and fold behavior from face.

Useful imperfections:

- one faint blemish;
- mild redness beside nose;
- uneven blush;
- tiny healed mark;
- subtle under-eye darkness;
- light forehead shine;
- small difference between left and right eyebrow.

Avoid turning every face into acne, dirt or hyper-detailed “4K pores.” Controlled variation feels human; a catalogue of defects feels prompted.

### Skin under light

- broad soft light creates gradual highlights;
- small hard light creates sharper speculars;
- skin is not matte clay and not wet plastic;
- ears and thin skin may show restrained warm transmission;
- sweat gathers by region and gravity, not as uniform droplets;
- makeup sits on skin and may crease or separate slightly.

### Facial deformation

- cheeks compress against hands or pillows;
- smile changes eye shape, nasolabial folds and cheek volume together;
- speech changes jaw, lips, tongue and throat coherently;
- a brow lift affects forehead lines asymmetrically;
- head turns should not preserve the exact frontal facial geometry.

## 4. Eyes and gaze

- both eyes converge on the same target at close distance;
- gaze leads head movement or follows it depending on intention;
- blinks are irregular and often occur around gaze shifts;
- eyelids contact the eyeball and cast tiny shadows;
- catchlights match the scene’s light sources;
- pupils should not pulse randomly;
- eyes are moist, not glass marbles;
- direct eye contact should have a reason.

AI tell: subject stares unblinkingly at camera while performing a task.
Fix: map gaze targets by beat—object, person, preview, environment, then lens.

## 5. Mouth, speech and teeth

- exact speaker only moves lips;
- jaw motion precedes/follows certain sounds naturally;
- lips maintain volume rather than stretching like rubber;
- teeth are not identical white tiles;
- tongue appears only when phonemes require it;
- listener’s mouth remains relaxed, not silently copying;
- laughter changes cheeks, shoulders, breath and timing;
- speech while chewing, drinking or holding an object must be physically possible.

Keep products below face during critical lip-sync unless the action specifically uses the mouth.

## 6. Human asymmetry

Perfect bilateral symmetry reads synthetic. Preserve modest asymmetry:

- one shoulder slightly lower;
- weight resting more on one hip;
- eyebrow responses differ;
- hair volume differs by side;
- smile begins on one side;
- garment folds are not mirrored;
- hands do not perform identical gestures;
- feet point at slightly different angles.

Asymmetry should emerge from posture and behavior, not random deformation.

## 7. Body mechanics and weight

For every major action identify:

1. centre of mass;
2. support points;
3. preparation/anticipation;
4. force direction;
5. follow-through;
6. recovery.

Examples:

### Standing from a chair

- feet reposition under knees;
- torso leans forward;
- hands may brace;
- hips lift after centre of mass moves over feet;
- chair cushion rebounds after weight leaves.

### Picking up a heavy object

- hand tests/grips;
- fingers compress and wrist aligns;
- shoulder and torso prepare;
- object accelerates slowly;
- posture adjusts to load;
- set-down includes deceleration and surface reaction.

### Running

- arms counter-rotate;
- torso has controlled vertical motion;
- feet contact ground and receive force;
- loose clothing/hair lag behind acceleration;
- camera movement must correspond if operator follows.

AI tells:

- feet skating;
- knees bending backward;
- centre of mass outside support with no fall;
- heavy objects moving at fingertip speed;
- instant stop without follow-through;
- sitting without chair compression.

## 8. Hands and object interaction

Hands are high-risk. Reduce ambiguity.

- state exact hand and grip;
- show contact points;
- assign one active hand and one support hand;
- avoid hiding fingers behind reflective objects;
- include pressure deformation at fingertips;
- maintain ring/watch/nail continuity;
- make finger movement sequential, not simultaneous noise;
- object shadows and reflections respond to hand position;
- liquids and flexible materials react after contact.

For complex interactions, use a close angle that proves the grip rather than asking the model to infer it.

## 9. Hair

Hair is a system of mass plus strands.

- preserve overall haircut, part, length and density;
- separate large clumps from fine flyaways;
- roots move less than ends;
- motion lags head acceleration and overshoots slightly after a stop;
- gravity pulls loose hair downward;
- wind direction must match clothes, leaves and microphone noise;
- hair can catch on fabric, sit behind one ear or cross the face;
- wet hair clumps and darkens; dry hair separates more;
- curls compress and rebound differently from straight hair.

Do not write “hair flowing beautifully” in an indoor still room. Name the force.

## 10. Clothing and cloth physics

Describe:

- material: cotton jersey, wool, satin, denim, leather, nylon shell;
- weight/thickness;
- fit and construction;
- seam and closure positions;
- where it contacts the body;
- how it reacts to motion, wind and sitting.

Material behavior:

- **cotton jersey:** soft folds, slight stretch, absorbs sweat;
- **denim:** stiffer folds around hips/knees, holds creases;
- **satin:** smooth highlights, sliding folds, lower friction;
- **wool:** bulky compression, soft fibre edge;
- **leather:** structured creases at joints, stronger speculars;
- **technical nylon:** crisp fold recovery, audible rustle, wind response.

Continuity anchors:

- buttons remain open/closed;
- sleeves stay rolled to same height;
- patterns do not crawl;
- logos/text do not morph;
- pockets and seams remain in place;
- clothing does not fuse into chair or body.

## 11. Material truth

### Glass

- transmits and reflects;
- has thickness and edge refraction;
- fingerprints appear where held;
- sound depends on thickness and surface;
- liquid line stays level with gravity.

### Metal/chrome

- reflects environment coherently;
- highlights move with object/camera;
- rigid unless thin sheet;
- sharp edges and cold speculars;
- should not behave like liquid mercury.

### Wood

- directional grain;
- worn edges and small dents where used;
- matte or varnished response;
- weight and dry contact sound.

### Plastic

- stiffness varies by type;
- mould lines and edge thickness can appear;
- reflections are softer than chrome;
- thin plastic flexes before snapping back.

### Liquid

- surface remains level under gravity;
- inertia causes lag and slosh;
- viscosity controls speed;
- droplets merge, spread or bead according to surface;
- condensation moves downward and responds to touch.

### Food

- compression, crumbs, steam, moisture and break pattern must fit material;
- bites remove persistent volume;
- repeated cuts cannot restore food state.

## 12. Environment entropy

Real spaces have history, not random clutter.

Use a small number of coherent imperfections:

- high-touch wear on handles;
- chair slightly off alignment;
- cable following gravity;
- one folded blanket, not ten decorative props;
- dust only where cleaning misses;
- uneven condensation;
- pavement repairs and stains;
- mismatched but plausible objects;
- background people with independent goals.

Avoid “perfectly clean luxury room” and avoid “extremely cluttered realistic room” without functional logic.

## 13. Light and shadow causality

- name every major light source;
- shadow direction must match source;
- softness follows source size/distance;
- reflections reveal source position;
- moving objects cast moving shadows;
- exposure changes only when light/composition changes;
- daylight direction stays stable across shots;
- practical lights affect nearby surfaces;
- fog/dust beams require particles and a directional source.

AI tell: face is lit from front while visible window sits behind and no fill source exists.
Fix: add plausible bounce or accept a darker face.

## 14. Camera realism

Specify:

- camera/device;
- lens or field of view;
- camera height/distance;
- stabilization;
- focus target;
- exposure behavior;
- shutter/motion character;
- operator/body relationship;
- start and end frames.

Camera imperfections should be motivated:

- autofocus corrects when a new foreground target enters;
- exposure changes when moving between light zones;
- rolling shutter appears on fast lateral movement;
- motion blur increases with fast movement/longer shutter;
- handheld movement follows steps, breath or grip;
- compression affects moving detail more than static detail.

## 15. Temporal continuity ledger

Track across every beat:

- character identity and age;
- hair/wardrobe/accessories;
- body marks and handedness;
- object count, state and location;
- liquid/food level;
- doors/windows open/closed;
- weather and surface wetness;
- light direction and time;
- background people/vehicles;
- camera side and screen direction;
- audio source location.

Before generating, ask: “What can change, what must not change, and what causes each change?”

## 16. Acoustic realism

Sound proves space.

- loudness follows distance;
- high frequencies reduce through walls/doors;
- reflections fit room size/material;
- visible mouth direction affects clarity;
- contact sounds occur at contact;
- cloth/footstep sounds fit material;
- wind affects hair, fabric, vegetation and microphone together;
- nearby voices dominate far voices;
- ambience continues across cuts unless location changes;
- silence still contains a noise floor.

Avoid generic cinematic impacts and omnipresent music when documentary realism is the goal.

## 17. Imperfection budget

Choose a controlled set per shot:

- 1–2 human details;
- 1 material detail;
- 1 environmental detail;
- 0–1 camera behavior;
- 1 audio behavior.

Example:

> faint under-eye fold + uneven brow; sleeve pilling; scratched cup rim; one delayed focus correction; fridge hum rises during silence.

Too many flaws become an aesthetic filter. Real footage is often mostly clean.

## 18. Diagnostic checklist — what makes it feel AI

Ask after drafting:

- Is every surface equally detailed?
- Is the face perfectly symmetrical?
- Do all people move at once?
- Does the subject always face camera?
- Is the camera moving without a physical operator/path?
- Do hands hide during complex actions?
- Does an object change state off-screen?
- Does hair move without wind or acceleration?
- Do clothes ignore joints and gravity?
- Are shadows/reflections inconsistent?
- Does sound have no source or distance?
- Is every background person reacting to the hero?
- Are actions too smooth, evenly timed or instantly completed?
- Are imperfections repeated uniformly?
- Does the prompt request incompatible camera properties?

Fix causes, not symptoms.

## 19. Negative-prompt families

Adapt rather than pasting everything blindly.

### Human
plastic skin, waxy skin, beauty-filter face, perfect symmetry, dead eyes, random blinking, frozen expression, duplicated teeth, deformed hands, extra fingers, fused fingers, rubber joints, foot sliding, wrong centre of gravity.

### Temporal
identity drift, wardrobe mutation, crawling patterns, disappearing props, object duplication, state reset, changing weather, changing light direction, flicker, texture boiling.

### Physics
floating objects, no weight, no anticipation, no follow-through, missing contact shadows, intersecting geometry, liquid ignoring gravity, cloth frozen to body, hair moving without force.

### Optical
impossible lens, inconsistent perspective, random focus hunting, exposure flicker, over-HDR, fake bokeh mask, constant lens flare, excessive motion blur.

### Audio
sound without source, wrong distance, all voices equally loud, missing room tone, synthetic impacts, background music, lip-sync mismatch.

## 20. Research principles incorporated

Recent video-generation evaluation research continues to identify temporal consistency, human structural correctness, hand-object interaction and physical plausibility as difficult areas. Real-time character systems similarly treat skin, body deformation and hair as separate physical problems rather than a single “photorealistic” style. This file therefore prioritizes state, contact, force, material response and cross-modal causality.

## 21. Full Seedance example — 15-second realism stress test in a kitchen

Horizontal 16:9, 15 seconds, 4K, one continuous observational take in a small apartment kitchen during a quiet rainy morning. Ultra-realistic everyday documentary register. A woman makes tea, briefly burns a fingertip on the hot mug, responds naturally and continues. The goal is not drama; it is a physically and behaviorally coherent ordinary moment. Camera, body, skin, hair, cloth, steam, liquid, reflections and sound must all obey the same causes. No dialogue, narration, music, captions, watermark or cinematic spectacle.

Subject — @Image 1 is a woman in her early thirties, average height and build, naturally asymmetrical face, dark hazel eyes, shoulder-length wavy black hair with slightly more volume on camera-left, a few grey strands near the right temple, medium olive skin. Preserve visible cheek/nose pores, faint redness beside the nostrils, one small healed blemish near the chin, mild under-eye darkness and light forehead sheen. She wears a washed heather-grey cotton T-shirt with a slightly stretched collar, loose navy cotton trousers and a thin plain ring on her left ring finger. Barefoot. Maintain exact identity, hairstyle, body proportions, wardrobe, ring and handedness.

Environment. Modest practical kitchen: off-white painted cabinets with mild wear near handles, dark laminate worktop, stainless sink, plain white ceramic mug with one tiny chip on the rim, metal teaspoon, electric kettle, folded tea towel, rain-streaked window camera-right. A small fridge stands background-left. No readable brands, labels, decorative text or excessive props. The worktop has one faint wiped streak and a few crumbs near the toaster, not everywhere.

Lighting. Overcast daylight from the rain window camera-right is the dominant large soft source. Weak warm ceiling practical provides subtle fill. Reflections on kettle and spoon match these sources. Soft shadow falls camera-left. Steam becomes visible only where it crosses the darker cabinet/background. Exposure remains stable except for one subtle correction when her pale hand lifts in front of the darker cabinet.

Camera. Friend-like observational camera at chest height, 45mm-equivalent natural lens, positioned 1.8 metres away at a three-quarter front angle. Restrained shoulder-supported handheld: low-amplitude breathing drift and one small weight-shift correction, no floating gimbal, orbit, dolly, zoom or pan. Medium frame from hips to head with worktop and mug visible. Focus stays primarily on her face and hands; one motivated minor correction follows the mug when it moves closer. Natural 180-degree shutter motion, no dreamy smear.

Initial state. Kettle has just clicked off; hot water is inside. Mug sits 30 cm in front of @Image 1 with tea bag submerged and teaspoon beside it. Tea level begins 2 cm below the rim. Her right hand holds the kettle handle; left hand rests near the mug. T-shirt hem falls unevenly due to posture. Hair is still except for small movement caused by her own head and shoulder motion. All object states persist.

0.00–3.80s — @Image 1 finishes pouring with her right hand. The kettle has visible weight: elbow and shoulder support it, wrist aligned, body leaning slightly toward the counter. Tea level rises realistically and remains horizontal; a small circular current turns the tea bag. Steam rises upward, bends weakly toward the cooler window and dissipates. She stops pouring before the mug reaches 2 cm below the rim, rotates the kettle upright, waits half a beat for the final drop, then places it on its base with controlled deceleration. The base receives the weight and makes one plastic-on-plastic contact. Her left hand remains clear of the stream. SFX: close kitchen room tone, realistic water pour thinning at the end, kettle base contact, rain against glass and low fridge hum.

3.80–7.20s — She grips the teaspoon with her right hand and stirs three irregular circles, not a perfect loop. Spoon contacts ceramic twice with small distinct clinks. Liquid rotates after the spoon, tea bag trails behind due to inertia, then slows. Her left fingertips touch the mug handle and soft tissue compresses lightly. She looks at the liquid; gaze convergence matches the close target. One natural blink occurs during a gaze shift, not on a fixed interval. Her loose T-shirt gathers where left forearm presses the counter.

7.20–10.30s — She sets the spoon down; it slides 1 cm and stops. She wraps her left hand around the mug handle and brings the right fingertips to the mug’s side to steady it. The ceramic is hotter than expected. After about 0.35 seconds of contact, her right index fingertip withdraws sharply first, followed by the other fingers; shoulder lifts and head pulls back a few centimetres. She inhales through her teeth, eyes narrow asymmetrically and the right hand shakes once. The mug remains supported by the handle in her left hand and does not jump or spill. Skin at the contacted fingertip shows only mild temporary redness—no injury. The camera operator reacts a fraction late with one small downward correction toward the hand. SFX: tiny skin-on-ceramic contact, short involuntary breath, shirt rustle; no dramatic sting.

10.30–12.60s — She sets the mug back down slowly using the left hand. Tea surface tilts slightly during movement, then oscillates and settles without spilling. The ceramic base contacts the laminate with one muted note. She presses the warm fingertip briefly against the cool stainless sink edge, flexes it once and gives a quiet closed-mouth embarrassed half-smile toward someone behind camera. Smile begins more on the left side; cheeks and eye corners respond together. She does not look into the lens for more than a fraction.

12.60–15.00s — She picks up the folded tea towel with her right hand and wraps a single layer around the mug body while the left still uses the handle. Cotton bends, compresses and conforms; printed pattern does not crawl because the towel is plain. She lifts the mug safely, exhales, and turns toward frame-left. Her weight transfers onto the left foot before the first step; trousers fold at hip and knee, hair lags behind the head turn then settles. The camera remains planted and allows her to begin leaving frame rather than following. End with the fridge hum and rain continuing after the last footstep.

Human realism. Pores and regional skin variation remain visible without hyper-sharpening. Face is not bilaterally perfect. Fingertips compress at grip points. Nails and ring remain consistent. Feet contact the floor without sliding. Reaction occurs after heat contact, not before. No theatrical grimace.

Material realism. Cotton T-shirt and towel form soft gravity-led folds; trousers compress at joints. Ceramic remains rigid and slightly reflective. Stainless sink has coherent cool reflections. Tea obeys gravity and inertia. Steam responds to heat and air, not to camera. Kettle, mug, spoon and towel preserve state and location.

Audio realism. Every contact sound aligns to visible contact. Rain is filtered through glass; fridge hum is stable and becomes more noticeable during silence. No studio vacuum, no amplified ASMR, no music, no cinematic impact, no sound before action.

Imperfection budget. One mug chip, faint cabinet-handle wear, one worktop streak, two spoon clinks, asymmetrical smile, mild under-eye texture, one late camera correction, natural cloth pilling and a low room noise floor. Do not add random dirt, extreme pores or continuous shake.

Negative prompt: plastic skin, waxy skin, beauty filter, perfect facial symmetry, dead eyes, synchronized blinking, random pupil changes, duplicated teeth, rubber lips, wrong lip deformation, extra hands, extra fingers, fused fingers, changing ring, changing nails, impossible grip, fingers passing through mug, hand reacting before heat contact, exaggerated burn, foot sliding, weightless kettle, instant acceleration, no anticipation, no follow-through, liquid ignoring gravity, tea level changing between frames, restored tea bag position, steam falling downward, frozen cloth, crawling fabric texture, hair moving without force, hair frozen during head turn, object teleportation, duplicate mug, spoon disappearing, kettle changing shape, missing contact shadows, reflection mismatch, changing window/rain, random exposure pumping, random autofocus hunting, over-HDR, full-frame cinematic bokeh, anamorphic flare, dolly, orbit, gimbal float, dramatic slow motion, subtitles, captions, watermark, readable invented brands, narration, dialogue, music, bass hit, exaggerated sizzling sound, sound without contact, missing room tone, temporal flicker, texture boiling, low detail, broken physics.
