# iPhone Aesthetic — Photo & Video Prompting Library

Use this mode when the result should feel captured by a real person on an iPhone rather than by a cinema camera pretending to be a phone. The iPhone look is a system: lens choice, sensor size, computational processing, autofocus/exposure behavior, stabilization, operator ergonomics, social-platform compression and ordinary human decisions. Do not create it by dumping every defect into one prompt.

Follow `seedance-prompting.md` first for blueprint order, tagging, timecodes, audio, negatives and continuity.

## 1. Select the exact iPhone register

Choose one. Different registers have different grammar.

- **Front-camera selfie video:** arm’s-length wide perspective, face near lens, slight edge stretching, screen-directed gaze, hand/body micro-shake, moderate beauty/computational smoothing but preserved texture.
- **Rear-camera casual video:** friend or partner filming, stronger detail, delayed reframing, occasional focus/exposure correction, more natural subject behavior.
- **Phone propped on furniture:** fixed wide frame, tiny support vibration, no operator pans, practical social-video composition.
- **Cinematic mode imitation:** shallow computational separation and focus transitions, but still phone ergonomics; avoid perfect optical cinema bokeh.
- **Action mode imitation:** visibly stabilized walking/running with wider crop and minor edge warping; do not combine with heavy raw shake.
- **Low-light nightlife phone:** bright signs, smeared moving highlights, shadow noise, aggressive denoising, exposure compromises, not clean cinema night.
- **Flash photo:** hard near-axis light, rapid falloff, bright skin/speculars, darker environment, red-eye risk, snapshot timing.
- **Casual still/photo dump:** slightly imperfect framing, social crop, computational HDR, ordinary gesture, not a campaign pose.
- **Compressed TikTok/Reels export:** softened microdetail, edge breakup around hair, mild blockiness in motion, platform sharpening; this is an output layer, not the camera itself.

## 2. Prompt stack for a believable phone image

Write these layers in order:

1. **Capture situation:** who holds the phone, why it is filming, how hurried or deliberate.
2. **Camera side:** front or rear.
3. **Approximate lens:** ultra-wide, main wide, short telephoto.
4. **Framing and distance:** arm’s length, table mount, partner distance, mirror distance.
5. **Operator behavior:** grip, late reaction, one-handed reach, walking cadence.
6. **Computational behavior:** HDR balance, sharpening, denoising, skin handling.
7. **Focus/exposure behavior:** lock, pulse, face priority, highlight compromise.
8. **Stabilization behavior:** none, ordinary optical/electronic correction, action-style.
9. **Audio capture:** phone microphone distance, room, wind and occlusion.
10. **Export state:** native camera, messaging compression, TikTok/Reels upload.

## 3. Lens and distance logic

Do not rely only on “24mm iPhone lens.” Describe distance and distortion.

### Ultra-wide
- large foreground expansion;
- edges stretch faces and limbs;
- room feels deeper;
- operator can be very close;
- useful for action, interiors and group selfies;
- avoid for flattering close portraits unless intentional.

### Main wide camera
- default natural phone look;
- moderate depth of field, background still readable;
- close faces show mild perspective enlargement of nose/forehead;
- ideal for casual rear-camera people, products and street clips.

### Short telephoto
- less perspective distortion;
- stronger compression;
- steadier operator needed;
- more separation but still not a full-frame 85mm portrait unless the device/setting supports it.

### Front camera
- typically broad field of view;
- face remains close to lens;
- hand/arm geometry matters;
- gaze often alternates between preview and lens;
- preview may create slightly off-axis eye contact.

## 4. Computational image behavior

A phone image is not raw sensor output. Use controlled clues:

- shadows lifted while bright windows remain partially retained;
- local contrast and edge sharpening around eyes, hair and product labels;
- skin texture reduced slightly but not erased;
- multi-frame HDR can make moving hands/hair less clean than static surfaces;
- denoising creates soft waxy patches in deep low light if pushed;
- white balance may neutralize mixed indoor light more than a cinema camera;
- face exposure can brighten skin while background highlights clip or compress;
- bright points may produce small ghosts or flare, but not constant anamorphic streaks.

Do not combine all defects. Choose two or three that fit the situation.

## 5. Autofocus, exposure and white-balance behavior

### Autofocus

- face priority holds the nearest visible face;
- a product pushed close can temporarily steal focus;
- focus pulse should be brief and motivated;
- touching the screen can lock focus/exposure—then keep them stable;
- low light or low contrast can cause one slow correction, not endless hunting.

### Exposure

- stepping from shade into sun can cause a short automatic correction;
- a bright window behind a face forces compromise;
- phone HDR can protect both, but not perfectly;
- do not request constant exposure pumping for a static daylight scene.

### White balance

- mixed warm lamps and cool daylight may shift gently;
- avoid random colour-temperature flicker;
- after lock, colour should remain stable.

## 6. Stabilization and body mechanics

Match movement to the capture method.

- **Selfie held in one hand:** low-amplitude arm tremor, breathing rise/fall, footstep vertical bounce, occasional grip correction.
- **Two-handed rear camera:** steadier horizon, small torso sway, smoother reframe.
- **Phone on table/shelf:** static geometry, occasional surface vibration when touched, no floating drift.
- **Walking follow:** imperfect distance, operator accelerates late, brief vertical step rhythm.
- **Action stabilization:** wider crop, smoother centre, slight edge warp on hard steps.
- **Vehicle:** low-frequency chassis movement plus small road vibration; not generic handheld shake.

Never write “heavy handheld shake throughout” by default. Constant identical shake is an AI texture, not human camera operation.

## 7. Human phone-camera behavior

Real people make decisions late.

- recording may begin a fraction before or after the intended action;
- operator corrects framing after subject moves;
- subject glances at the preview, lens, off-camera person and their own hands;
- fingers can briefly enter the edge only when plausible;
- a selfie arm tires or changes angle slightly;
- the operator may lower the phone before the final action fully resolves;
- casual footage often contains one unimportant second rather than perfect beat density.

Use imperfections as consequences, not decoration.

## 8. iPhone video audio

Describe source distance and phone orientation.

- close selfie speech is dry and clear with mild room tone;
- rear-camera speech at 1–2 m contains more room and background;
- fingers near the microphone can create brief muffling or rub;
- wind creates low-frequency buffeting unless a protected external mic is shown;
- rotating the phone changes stereo/environment perspective subtly;
- voices near the phone should dominate distant voices;
- automatic gain may raise ambience during silence and reduce it during loud speech.

Do not ask for broadcast podcast sound from an uncovered phone in traffic.

## 9. Still-photo grammar

For iPhone photos specify:

- portrait or landscape orientation;
- rear/front camera and lens;
- distance;
- flash/no flash;
- still moment: caught mid-blink, just after laughter, posed, mirror selfie;
- computational HDR level;
- depth effect only when justified;
- crop and social export;
- realistic phone resolution, sharpening and compression.

### Casual still

- imperfect shoulder/headroom;
- background remains legible;
- ordinary light;
- natural posture and asymmetry;
- slight motion in hair or hand;
- no perfect campaign retouching.

### Portrait-mode still

- subject separation around clean edges;
- occasional imperfect segmentation around wispy hair, transparent objects or fingers;
- background blur follows depth approximately, not as a flat cutout;
- avoid impossible f/1.2 full-frame optics unless deliberately simulating a special app.

### Direct-flash still

- hard shadow behind subject when near wall;
- forehead/nose/lip highlights;
- reflective clothes and glass flare strongly;
- background falls darker with distance;
- white balance and red-eye behavior depend on room.

## 10. Platform/export layer

Only add this at the end:

- light H.264/HEVC compression;
- mild detail mush around moving hair;
- sharpening halos on contrast edges;
- tiny blocks or mosquito noise in dark gradients;
- rescaled 1080×1920 vertical output;
- no watermark unless requested.

Do not destroy a 4K source with fake VHS artifacts and call it “TikTok.”

## 11. AI tells and fixes

### “Phone look” made from random damage
Cause: rolling shutter, grain, compression, autofocus hunting and blown highlights all maxed.
Fix: choose artifacts caused by the actual scene; keep most frames clean.

### Cinema camera pretending to be selfie
Cause: creamy 85mm bokeh, invisible arm, perfect parallax and slow dolly.
Fix: state front camera, arm’s-length distance, broad lens, hand position and preview gaze.

### Impossible stabilized handheld
Cause: frame floats while body bounces independently.
Fix: link camera displacement to footsteps, breath and grip.

### Face permanently centred
Cause: automatic composition with no operator delay.
Fix: allow off-centre drift, then one corrective reframe.

### Fake skin
Cause: “flawless iPhone beauty mode.”
Fix: preserve pores, fine hairs, under-eye folds and local shine; only slight computational smoothing.

### Random focus pumping
Cause: artifact used as style.
Fix: identify the object that steals focus and the exact time focus returns.

### Front/rear-camera contradiction
Cause: selfie framing described with cinematic camera orbit.
Fix: name who holds the phone and what physical movement is possible.

### Unnatural HDR
Cause: every shadow and highlight perfectly exposed.
Fix: retain a real compromise—slightly clipped window, lifted noisy shadow or bright face.

## 12. Prompt phrase library

Use precise combinations:

- “rear main camera, friend filming from 1.2 metres, chest-height two-handed grip”;
- “front camera at arm’s length, gaze mostly at preview and briefly into lens”;
- “phone propped against a plain mug, completely fixed perspective, tiny desk vibration only when she touches the table”;
- “face-priority autofocus holds her eyes until the bottle enters 12 cm from lens, then one brief focus transfer”;
- “automatic exposure corrects once after the door opens into daylight”;
- “ordinary iPhone computational HDR, restrained sharpening, slight hair-edge mush after social upload”;
- “direct on-axis phone flash, hard wall shadow, darker room behind”;
- “no cinema dolly, no anamorphic flare, no full-frame shallow depth.”

## 13. Research principles incorporated

Apple’s camera documentation distinguishes lens controls, focus/exposure locking, stabilization options, HDR behavior, frame-rate management and Cinematic-mode focus transitions. Strong creator prompts on social platforms also specify capture device, operator behavior, focus/exposure response and compression rather than merely naming “iPhone aesthetic.” This module treats those behaviors as conditional, not mandatory artifact soup.

## 14. Full Seedance example — 15-second casual rear-camera café video

Vertical 9:16, 15 seconds, 4K capture exported as a lightly compressed 1080×1920 social video. Casual rear-main-camera iPhone footage recorded by a friend at a neighbourhood café, one continuous take. It feels like an unplanned personal clip rather than an advertisement or cinematic scene. Ordinary phone computational processing, believable operator delay, natural café sound and only scene-caused focus/exposure changes. No on-screen text, subtitles, graphics, watermark, music or artificial sound design.

Main subject — @Image 1 is a woman in her mid-twenties with shoulder-length dark brown hair cut slightly uneven at the ends, natural flyaways, medium olive skin with visible pores and a small blemish beside the left eyebrow, faint under-eye folds, minimal makeup, soft mauve lip balm. She wears a washed navy oversized sweatshirt, straight light-blue jeans, small plain gold hoops and a thin silver ring. Maintain identical identity, hair, skin details, wardrobe and jewellery throughout. She behaves naturally and never poses for a product shot.

Setting. Small everyday café near a front window on a bright overcast morning. Plain pale wall, scratched wooden table, ceramic cup with no writing, folded paper napkin, metal teaspoon, rain spots on the outer window, pedestrians and one bus passing softly outside. Background patrons are sparse and behave independently: one person reads, another briefly stands to collect a drink. No visible commercial logos, legible menus or branded packaging.

Capture situation and camera. A friend sits opposite and records with the iPhone rear main wide camera from roughly 1.1 metres away, chest-height, two-handed portrait grip. Approximate 24–26mm-equivalent phone perspective. The operator’s elbows rest loosely near the table, producing low-amplitude breathing drift and one small grip correction; no cinematic dolly, gimbal, orbit, zoom, pan or artificial floating. Horizon is mostly level but not mathematically perfect. Subject is framed from mid-torso upward with slightly too much empty space camera-right at the opening.

Image behavior. Ordinary iPhone computational HDR: her face is exposed pleasantly while the overcast window remains bright but not perfectly recovered; one small patch of sky clips softly. Moderate local sharpening around eyes and cup rim, slight denoising in sweatshirt shadows, natural skin retained. Background depth is phone-like and still readable—not full-frame creamy bokeh. Stable neutral-cool white balance with a faint warm interior bias. No retro film grain, VHS texture or anamorphic flare.

0.00–2.20s — Recording begins a fraction early. @Image 1 is looking down, stirring her drink once. The operator initially frames her low, then makes one delayed 3-degree upward correction at 0.8s after noticing excess table. She glances at the preview rather than directly into the lens and gives a small closed-mouth half-smile. SFX: realistic rear-camera phone audio—teaspoon against ceramic close and crisp, café room tone, low HVAC, distant milk-steamer hiss, rain-muted traffic outside.

2.20–6.20s — An off-camera friend asks in a normal conversational voice, “Was it actually that bad?” Their voice comes from immediately behind the phone, clear and slightly louder than the room. @Image 1 looks briefly toward the friend’s face above the phone, not the lens, exhales through her nose and says, “No, it was just… weirdly intense.” Natural 0.35-second hesitation before “weirdly,” small asymmetrical brow lift, mouth perfectly lip-synced. She keeps one hand around the warm cup; her thumb presses lightly against the ceramic. Camera remains mostly still with breath-linked movement.

6.20–9.80s — A bus passes outside and temporarily darkens the window area. Automatic exposure makes one gentle 0.3-second correction to maintain her face, then settles. She looks toward the street, laughs once under her breath and adds, “Everyone suddenly had an opinion.” The operator reacts slightly late and shifts the frame 5 cm left only after she turns, leaving her off-centre for a moment. A loose strand of hair moves when she turns. SFX: bus tyre wash and low engine outside remain muffled by glass; her nearby voice dominates; teaspoon settles with one tiny clink.

9.80–12.70s — She reaches toward the phone with her left hand to see the framing. Her fingers enter the lower-left foreground and come within roughly 14 cm of the lens. Face-priority autofocus briefly transfers toward the nearest fingers for about 0.4 seconds, then returns cleanly to her eyes when she withdraws. She does not speak during the focus transition; mouth relaxed closed. The operator gives a quiet off-camera laugh.

12.70–15.00s — @Image 1 shakes her head once, picks up the cup and says, “Anyway, I’m not doing that again.” Her delivery falls flatter on “again,” no CTA energy. She looks at the friend, not the lens. At 14.55s the operator begins lowering the phone slightly before she has completely set the cup down, so the recording ends with the tabletop rising in frame and one natural ceramic contact sound. Cut abruptly, no polished end pose.

Audio capture. Built-in phone microphone perspective from the operator’s position. Off-camera friend and @Image 1 are close and clear; background conversations remain indistinct. Automatic gain raises the room slightly during the silent reach at 9.8–12.7s, then settles when speech resumes. No lavalier clarity, no podcast bass, no studio reverb, no aggressive noise removal, no wind because the window is closed.

Imperfection budget. Preserve pores, slight forehead sheen, one blemish, uneven hair ends, minor sleeve pilling, cup fingerprints, table scratches, one delayed reframe, one motivated focus transfer, one motivated exposure correction, mild social compression around moving hair and a natural unfinished ending. Do not add continuous shake or arbitrary glitches.

Negative prompt: cinema-camera look, full-frame 85mm portrait bokeh, anamorphic flare, dolly, gimbal, orbit, crane, perfect permanent centring, impossible invisible selfie arm, front-camera perspective, exaggerated fisheye, heavy rolling shutter, constant autofocus hunting, constant exposure pumping, random white-balance flicker, extreme HDR, perfectly recovered highlights and shadows, plastic beauty-filter skin, erased pores, symmetrical face, frozen hair, over-sharpened halos, VHS damage, MiniDV noise, film burn, fake timestamp, captions, subtitles, watermark, visible logos, invented menu text, generic upbeat music, cinematic sound effects, studio microphone sound, lip-sync errors, background patrons staring at camera, duplicated people, teleporting bus, changing cup, extra fingers, warped hand, floating objects, broken contact physics, overscripted influencer gestures, direct sales delivery, wink, final hero pose.
