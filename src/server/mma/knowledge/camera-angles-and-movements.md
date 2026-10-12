# Camera movements & transitions — the per-frame motion grammar

Owner's law: this guide rides EVERY video Mina animates — Director, Quicks and
CopyCat, every register, every format. A frame with no camera plan is a frozen
frame. Give EVERY frame/shot its own named camera movement written with the
full formula below, and give EVERY shot boundary an explicit named transition.
One generic movement applied to the whole video is not enough — that is
exactly what produces lifeless clips that freeze and animate a single element.

How to apply:
- Pick ONE dominant camera movement per shot/frame from the library below and
  write it out with its full formula: movement, speed, framing, end state.
- Name the transition at every shot boundary. When no transition is specified,
  use a clean hard cut.
- Never leave a frame static unless the user specified a fixed camera or the
  format truly demands it (a creator filming content with no camera movement).

## I. Camera movements

- **Pan/Tilt | Static shot** (use only when the user specifies a fixed camera, or when a creator is filming content with no camera movement) | Prompt formula: locked-off static shot. Movement: hold one fixed camera position for the full clip. Speed: still and steady. Framing: keep the same angle, height, lens distance and composition. End: finish with the same framing and camera position.
- **Pan/Tilt | Pan right** | Prompt formula: pan right. Movement: rotate the camera horizontally from left to right from one fixed point. Speed: smooth constant rotation. Framing: keep the horizon level while new space enters from the right side of the frame. End: settle on a clear final composition.
- **Pan/Tilt | Pan left** | Prompt formula: pan left. Movement: rotate the camera horizontally from right to left from one fixed point. Speed: smooth constant rotation. Framing: keep the horizon level while new space enters from the left side of the frame. End: settle on a clear final composition.
- **Pan/Tilt | Whip pan right** | Prompt formula: whip pan right. Movement: rotate rapidly from the starting direction toward a new target on the right. Speed: fast snap with brief motion blur during the rotation. Framing: begin on one readable composition and land on a second readable target. End: settle into a sharp final frame.
- **Pan/Tilt | Whip pan left** | Prompt formula: whip pan left. Movement: rotate rapidly from the starting direction toward a new target on the left. Speed: fast snap with brief motion blur during the rotation. Framing: begin on one readable composition and land on a second readable target. End: settle into a sharp final frame.
- **Pan/Tilt | Tilt up** | Prompt formula: tilt up. Movement: rotate the camera upward from one fixed point. Speed: smooth constant tilt. Framing: keep the vertical subject or architecture centered as the frame travels upward. End: land on the upper target.
- **Pan/Tilt | Tilt down** | Prompt formula: tilt down. Movement: rotate the camera downward from one fixed point. Speed: smooth constant tilt. Framing: keep the vertical subject or architecture centered as the frame travels downward. End: land on the lower target.
- **Zoom/Lens | Slow zoom in** | Prompt formula: slow zoom in. Movement: slowly increase lens focal length toward a tighter frame. Speed: gradual and even. Framing: keep the main visual target readable as it becomes larger in frame. End: finish on a stable tighter composition.
- **Zoom/Lens | Slow zoom out** | Prompt formula: slow zoom out. Movement: slowly decrease lens focal length toward a wider frame. Speed: gradual and even. Framing: keep the main visual target readable as more surrounding space appears. End: finish on a stable wider composition.
- **Zoom/Lens | Fast zoom in** | Prompt formula: fast zoom in. Movement: quickly increase lens focal length toward the main visual target. Speed: quick decisive zoom. Framing: keep the target centered or clearly readable during the scale change. End: finish on a stable tighter composition.
- **Zoom/Lens | Fast zoom out** | Prompt formula: fast zoom out. Movement: quickly decrease lens focal length away from the main visual target. Speed: quick decisive zoom. Framing: keep the target readable as the surrounding space appears. End: finish on a stable wider composition.
- **Zoom/Lens | Crash zoom in** | Prompt formula: crash zoom in. Movement: snap the lens rapidly toward the main visual target. Speed: very fast and punchy. Framing: keep the target readable through the sudden scale change. End: land on a bold tighter composition.
- **Zoom/Lens | Crash zoom out** | Prompt formula: crash zoom out. Movement: snap the lens rapidly away from the main visual target. Speed: very fast and punchy. Framing: keep the target readable as the surrounding space appears. End: land on a bold wider composition.
- **Dolly/Track | Dolly in** | Prompt formula: dolly in. Movement: move the camera physically forward in a straight line toward the main subject. Speed: smooth controlled push. Framing: keep camera height, lens direction and subject position consistent while distance closes. End: finish in a tighter composition.
- **Dolly/Track | Dolly out** | Prompt formula: dolly out. Movement: move the camera physically backward in a straight line away from the main subject. Speed: smooth controlled retreat. Framing: keep lens direction and camera height consistent while more environment enters the frame. End: finish in a wider composition.
- **Physical Moves | Truck right** | Prompt formula: truck right. Movement: move the camera physically to the right on a straight horizontal path. Speed: smooth constant lateral travel. Framing: keep the lens facing the same direction while the scene slides across the frame. End: finish on a clean lateral composition.
- **Physical Moves | Truck left** | Prompt formula: truck left. Movement: move the camera physically to the left on a straight horizontal path. Speed: smooth constant lateral travel. Framing: keep the lens facing the same direction while the scene slides across the frame. End: finish on a clean lateral composition.
- **Physical Moves | Pedestal up** | Prompt formula: pedestal up. Movement: move the entire camera vertically upward in a straight line. Speed: smooth constant lift. Framing: keep the lens level and pointed in the same direction during the vertical movement. End: finish with the higher framing clearly readable.
- **Physical Moves | Pedestal down** | Prompt formula: pedestal down. Movement: move the entire camera vertically downward in a straight line. Speed: smooth constant descent. Framing: keep the lens level and pointed in the same direction during the vertical movement. End: finish with the lower framing clearly readable.
- **Physical Moves | Slider right** | Prompt formula: slider right. Movement: slide the camera a small distance to the right. Speed: slow controlled constant motion. Framing: keep the foreground, subject and background layers readable as the parallax shifts. End: finish on a refined composition with the new right-side angle visible.
- **Physical Moves | Slider left** | Prompt formula: slider left. Movement: slide the camera a small distance to the left. Speed: slow controlled constant motion. Framing: keep the foreground, subject and background layers readable as the parallax shifts. End: finish on a refined composition with the new left-side angle visible.
- **Physical Moves | Push past / pass-by shot** | Prompt formula: push past. Movement: move forward past a visible foreground object, edge or opening. Speed: smooth forward glide. Framing: let the foreground pass close to the lens while the space beyond becomes clearer. End: arrive inside or beyond the foreground layer.
- **Physical Moves | Arc right** | Prompt formula: arc right. Movement: move on a shallow curved path around the main subject toward the right side. Speed: smooth measured curve. Framing: keep distance, height and subject readability consistent while the angle changes. End: finish from a new right-side angle.
- **Physical Moves | Arc left** | Prompt formula: arc left. Movement: move on a shallow curved path around the main subject toward the left side. Speed: smooth measured curve. Framing: keep distance, height and subject readability consistent while the angle changes. End: finish from a new left-side angle.
- **Physical Moves | Orbit clockwise** | Prompt formula: clockwise orbit. Movement: circle clockwise around the main subject at a consistent radius. Speed: smooth controlled orbit. Framing: keep the subject centered while the background rotates around them. End: complete the intended arc or full circle with stable framing.
- **Physical Moves | Orbit counterclockwise** | Prompt formula: counterclockwise orbit. Movement: circle counterclockwise around the main subject at a consistent radius. Speed: smooth controlled orbit. Framing: keep the subject centered while the background rotates around them. End: complete the intended arc or full circle with stable framing.
- **Dolly/Track | Tracking shot** | Prompt formula: tracking shot. Movement: move through the scene with the main subject. Speed: match the subject's pace. Framing: keep the subject consistently readable while the environment moves around them. End: maintain a clear moving composition.
- **Dolly/Track | Follow shot / over-the-shoulder** | Prompt formula: follow shot from behind. Movement: move behind the subject along their route at shoulder height. Speed: match the subject's pace. Framing: keep the back, shoulder or head as the foreground guide while the route ahead stays readable. End: continue following with the subject leading the frame.
- **Dolly/Track | Reverse tracking / walk-and-talk** | Prompt formula: reverse tracking shot. Movement: move backward in front of the walking subject. Speed: match the subject's forward pace. Framing: keep the front-facing face and body framing stable as the background moves behind them. End: hold a clear front-facing moving composition.
- **Dolly/Track | Side tracking** | Prompt formula: side tracking shot. Movement: move parallel beside the subject along their direction of travel. Speed: match the subject's motion. Framing: keep the subject in side profile or three-quarter profile at a stable distance. End: continue the parallel movement with clear horizontal motion.
- **Dolly/Track | Low tracking** | Prompt formula: low tracking shot. Movement: move at ground or below-waist height alongside the subject's movement path. Speed: match the subject, footsteps or wheels. Framing: keep the low detail readable while the ground plane moves through the frame. End: finish with the low perspective clearly maintained.
- **Dolly/Track | Vehicle tracking** | Prompt formula: vehicle tracking shot. Movement: move with the vehicle along its route. Speed: match the vehicle's pace. Framing: keep the vehicle stable in the frame while the road or environment moves past. End: maintain a clear moving vehicle composition.
- **Dolly/Track | Chase shot** | Prompt formula: chase shot. Movement: follow a moving subject quickly along the action route. Speed: fast, reactive and physically close. Framing: keep the subject visible while allowing energetic reframing. End: stay connected to the subject in motion.
- **Human Camera | Handheld shot** | Prompt formula: handheld shot. Movement: hold the camera at human-operator height with natural body movement. Speed: responsive and organic. Framing: keep the subject readable while the frame has subtle sway and micro-adjustments. End: finish with a natural handheld composition.
- **Human Camera | Body-mounted camera / Snorricam** | Prompt formula: body-mounted Snorricam. Movement: keep the camera fixed relative to the subject's torso or face while the subject moves. Speed: match the subject's body motion. Framing: keep the subject close, centered and facing the camera as the background moves around them. End: finish with the subject still locked in the frame.
- **Drone/Crane | Crane up** | Prompt formula: crane up. Movement: travel smoothly upward through open space. Speed: slow controlled vertical lift. Framing: keep the subject or location readable as the camera rises. End: finish with the higher scale clearly visible.
- **Drone/Crane | Crane down** | Prompt formula: crane down. Movement: travel smoothly downward through open space. Speed: slow controlled vertical descent. Framing: keep the subject or location readable as the camera descends. End: finish with the lower subject or destination clearly visible.
- **Drone/Crane | Drone push in** | Prompt formula: drone push in. Movement: fly smoothly forward through open space toward the subject or destination. Speed: controlled aerial glide. Framing: keep the route and destination readable as the camera approaches. End: arrive at a closer aerial composition.
- **Drone/Crane | Drone pull back** | Prompt formula: drone pull back. Movement: fly smoothly backward away from the subject or destination. Speed: controlled aerial retreat. Framing: keep the subject readable as more of the landscape appears. End: finish on a wider aerial composition.
- **Drone/Crane | Helicopter shot** | Prompt formula: helicopter-style aerial shot. Movement: move from a high altitude along a broad gradual flight path. Speed: steady controlled aerial motion. Framing: keep the landscape or distant moving subject readable at a wide scale. End: finish on a stable high-altitude composition.
- **Specials | First-person view** | Prompt formula: first-person view. Movement: move forward at human-eye height from the character's perspective. Speed: natural walking or reaching pace. Framing: use visible hands, arms or body edges as the viewer's physical reference. End: arrive at the next point of action from the same point of view.
- **Specials | Tilt-shift** | Prompt formula: tilt-shift miniature view. Movement: hold or glide from a high angled view over the scene. Speed: small precise movement. Framing: keep a narrow band of sharp focus across the key subject area with soft blur above and below. End: finish with the miniature-scale view intact.
- **Specials | Infinite zoom** | Prompt formula: infinite zoom. Movement: zoom continuously inward toward the exact centre target. Speed: smooth accelerating zoom. Framing: keep the circular target centred as it expands. End: finish when the next visual world fills the frame.
- **Specials | Earth zoom out** | Prompt formula: earth zoom out. Movement: pull upward from the starting point through street, city, landscape and planet scale. Speed: rapid expanding zoom out. Framing: keep the original location centred as the scale grows. End: finish on a planet-scale view with the starting point still implied at the centre.
- **Specials | Time-lapse** | Prompt formula: locked-camera time-lapse. Movement: hold one fixed camera position while time moves rapidly forward. Speed: fast time compression with a stable camera. Framing: keep the same composition and horizon as motion passes through the frame. End: finish from the same camera angle with the visible passage of time.
- **Specials | Pass-through objects** | Prompt formula: pass-through movement. Movement: move forward toward a visible object, surface or barrier and continue into the space beyond. Speed: smooth centred glide. Framing: keep the opening or surface centred as the transition point. End: arrive inside the revealed space beyond.
- **Roll/Rotation | Camera roll clockwise** | Prompt formula: camera roll clockwise. Movement: rotate the camera clockwise around the optical axis while keeping [subject or central anchor] readable. Speed: [slow controlled roll / fast energetic roll]. Framing: maintain the subject near [frame position] as the horizon rotates. End: finish at [level horizon / specified angle] with a stable composition.
- **Roll/Rotation | Camera roll counterclockwise** | Prompt formula: camera roll counterclockwise. Movement: rotate the camera counterclockwise around the optical axis while keeping [subject or central anchor] readable. Speed: [slow controlled roll / fast energetic roll]. Framing: maintain the subject near [frame position] as the horizon rotates. End: finish at [level horizon / specified angle] with a stable composition.
- **Dolly/Lens | Dolly zoom in / Vertigo push** | Prompt formula: dolly zoom in. Movement: move the camera physically toward [subject] while simultaneously zooming the lens out to keep the subject approximately the same size. Speed: smooth synchronised movement. Effect: the background appears to stretch and recede while the subject remains stable. End: finish with the subject sharply framed and the perspective shift clearly visible.
- **Dolly/Lens | Dolly zoom out / Vertigo pull** | Prompt formula: dolly zoom out. Movement: move the camera physically away from [subject] while simultaneously zooming the lens in to keep the subject approximately the same size. Speed: smooth synchronised movement. Effect: the background appears to compress toward the subject. End: finish with stable subject scale and a clearly changed perspective.
- **Diagonal Moves | Diagonal dolly in** | Prompt formula: diagonal dolly in. Movement: move the camera forward and toward [left/right] on a straight diagonal path toward [subject]. Speed: smooth controlled approach. Framing: allow foreground and background layers to shift with visible parallax while keeping the subject readable. End: finish closer from a new [left/right] angle.
- **Diagonal Moves | Diagonal dolly out** | Prompt formula: diagonal dolly out. Movement: move the camera backward and toward [left/right] on a straight diagonal path away from [subject]. Speed: smooth controlled retreat. Framing: reveal more environment while changing the viewing angle and preserving subject readability. End: finish wider from a new [left/right] position.
- **Compound Moves | Spiral orbit up** | Prompt formula: spiral orbit up. Movement: orbit [clockwise/counterclockwise] around [subject] while gradually rising. Speed: smooth measured spiral. Framing: keep the subject centred or consistently positioned while the background rotates and the camera gains height. End: finish from a higher three-quarter or overhead angle.
- **Compound Moves | Spiral orbit down** | Prompt formula: spiral orbit down. Movement: orbit [clockwise/counterclockwise] around [subject] while gradually descending. Speed: smooth measured spiral. Framing: keep the subject readable while the angle lowers and the background rotates. End: finish from a lower or more intimate angle.
- **Overhead Moves | Overhead drop** | Prompt formula: overhead drop. Movement: begin from a high top-down view and descend vertically toward [subject or object]. Speed: [slow controlled descent / fast dramatic drop]. Framing: keep the target centred while scale increases. End: finish at [medium height / close overhead detail] without tilting away from the top-down axis.
- **Overhead Moves | Overhead rise** | Prompt formula: overhead rise. Movement: begin above [subject or object] in a close top-down composition and rise vertically. Speed: smooth controlled lift. Framing: keep the target centred as more of the environment is revealed. End: finish on a wide top-down establishing view.
- **Reveal Moves | Jib reveal up** | Prompt formula: jib reveal up. Movement: rise smoothly from behind [foreground object, furniture, wall or landscape feature] while slightly advancing toward [subject or location]. Speed: slow controlled reveal. Framing: let the foreground clear the lens gradually as the main subject becomes visible. End: settle on a clean elevated composition.
- **Reveal Moves | Jib reveal down** | Prompt formula: jib reveal down. Movement: descend smoothly from above or behind [foreground layer] to reveal [subject or location] below. Speed: slow controlled descent. Framing: keep foreground depth readable while the destination enters the frame. End: settle on a lower clear composition.
- **Human Camera | Handheld push-in** | Prompt formula: handheld push-in. Movement: a human camera operator walks slowly toward [subject] with natural body sway and subtle footstep vibration. Speed: responsive but controlled. Framing: maintain [close-up/medium] subject readability while allowing minor organic reframing. End: finish closer with a natural handheld settle.
- **Human Camera | Handheld pull-back** | Prompt formula: handheld pull-back. Movement: a human camera operator steps backward away from [subject] while continuing to face them. Speed: match [subject movement or conversational pace]. Framing: preserve readable face and body framing with subtle organic sway. End: finish wider without an artificial stabilised glide.
- **Parallax Moves | Parallax push** | Prompt formula: parallax push. Movement: move forward toward [subject] while drifting slightly toward [left/right] so close foreground elements slide faster than the background. Speed: slow cinematic push. Framing: preserve clear foreground, subject and background separation. End: finish closer with a visibly changed angle and strong depth.
- **Shoulder Moves | Over-the-shoulder switch** | Prompt formula: over-the-shoulder switch. Movement: move laterally behind [foreground character] from one shoulder to the other while keeping [target character or object] readable. Speed: smooth controlled crossover. Framing: allow the foreground head and shoulders to guide the movement without blocking the target for too long. End: finish on the opposite over-the-shoulder composition.
- **FPV/Drone | FPV fly-through** | Prompt formula: FPV fly-through. Movement: fly continuously through [doorways, windows, gaps, corridors or environmental obstacles] along a clearly defined route. Speed: [slow exploratory / fast dynamic]. Framing: keep each opening centred before passing through it and maintain believable clearance from surfaces. End: arrive at [final subject or destination] with a readable settle.
- **FPV/Drone | Drone dive** | Prompt formula: drone dive. Movement: descend rapidly from a high aerial position toward [ground target or destination] along a controlled forward path. Speed: accelerating dive followed by a smooth deceleration. Framing: keep the target centred and maintain a readable horizon or flight direction. End: level out near the target in a stable lower-altitude composition.
- **FPV/Drone | Rocket rise** | Prompt formula: rocket rise. Movement: accelerate vertically upward from [subject or location], rapidly revealing the surrounding environment at expanding scale. Speed: fast upward launch with controlled stabilisation. Framing: keep the starting point centred as the view expands. End: finish at a high aerial wide shot without transitioning to outer space unless explicitly requested.

## II. Transitions

Defaults that apply to every video:

- **BAN FADES BY DEFAULT**: Never use fade in, fade out, crossfade, cross-dissolve, dissolve to black, dissolve to white, opacity blending or gradual image overlap unless the user explicitly requests one.
- Start the video on a fully visible, already established frame. Do not begin from black, white or transparency.
- End the video on a fully visible final frame. Do not fade the ending away.
- When no transition is specified, use a clean hard cut.
- Describe the final readable state of Shot A and the first readable state of Shot B.
- State the exact transition cue: [timestamp], [gesture], [impact], [object crossing frame], [camera movement] or [audio cue].
- Use one dominant transition at a time unless the user explicitly requests a combination.
- Do not add automatic morphing, liquid warping, face blending, object melting or generative transformation between unrelated subjects unless explicitly requested.
- Preserve identity, wardrobe, product geometry, screen direction and spatial continuity across the transition unless the transition intentionally changes them.
- For multi-shot prompts, state: No blended frames between shots. Each new shot begins fully formed and immediately readable.

### 1. Direct cuts

- **Hard cut** | Prompt formula: hard cut. Transition: cut instantly from [final composition/action in Shot A] to [opening composition/action in Shot B] at [exact timestamp or action cue]. Timing: immediate, with zero overlap between shots. Continuity: preserve [subject identity, screen direction, position or action] where required. Ban: no fade, dissolve, crossfade, opacity blend or transitional blur. End: Shot B appears fully formed on its first frame.
- **Cut on action** | Prompt formula: cut on action. Transition: begin [action] in Shot A and cut at the exact midpoint of the movement to Shot B, where the same action continues seamlessly from [new angle or framing]. Timing: cut during the fastest readable part of the movement. Continuity: preserve body position, hand placement, object position, movement direction and speed. Ban: no pause, duplicated motion, reset, fade or blended frames. End: the action completes naturally in Shot B.
- **Match cut** | Prompt formula: match cut. Transition: cut from [visual element in Shot A] to [matching visual element in Shot B] using the shared [shape, position, scale, colour, pose or movement] as the visual connection. Timing: cut when both elements occupy the same approximate frame location and size. Ban: no dissolve or morph between the two images. End: Shot B appears instantly while preserving the visual match.
- **Jump cut** | Prompt formula: jump cut. Transition: keep the same subject, camera angle and general composition while cutting forward from [first moment/action] to [later moment/action]. Timing: remove the intermediate time so the subject or object changes position abruptly but intentionally. Framing: preserve the background and camera placement. Ban: no smoothing, interpolation, fade or morphing between positions. End: the later moment begins immediately.
- **Smash cut** | Prompt formula: smash cut. Transition: cut abruptly from [quiet, slow, restrained or visually simple Shot A] to [loud, fast, intense or visually contrasting Shot B] at [impact cue]. Timing: sudden and decisive. Contrast: maximise the change in [sound, movement, scale, brightness or environment] without using a fade. End: Shot B lands immediately with full visual and audio impact.
- **Reaction cut** | Prompt formula: reaction cut. Transition: cut immediately after [character/object/event in Shot A] performs or reveals [trigger] to [character in Shot B] reacting to it. Timing: hold the trigger only long enough to read, then cut to the first authentic reaction. Continuity: maintain eyeline and screen direction. Ban: no transition effect or dissolve. End: the reaction is clearly readable in Shot B.
- **Insert cut** | Prompt formula: insert cut. Transition: cut from [main scene or wider shot] to a close insert of [hand, product, screen, detail or object] at the moment it becomes narratively important. Timing: immediate clean cut. Framing: make the inserted detail large and unambiguous. Ban: no zoom effect, fade or blended overlay unless explicitly requested. End: hold the insert long enough for the detail to register.
- **Cutaway and return** | Prompt formula: cutaway transition. Transition: cut from [main action] to [secondary detail, environment, observer or contextual object], then return by hard cut to [main action] after [duration or cue]. Continuity: the main action should progress logically during the cutaway. Ban: no dissolve in or out. End: return to the main scene on a clear continuation point.
- **Eyeline cut** | Prompt formula: eyeline cut. Transition: show [character] looking toward [off-screen direction] in Shot A, then hard cut to [the person, object or event being viewed] in Shot B. Timing: cut immediately after the gaze direction becomes clear. Framing: place the viewed target consistently with the established eyeline. Ban: no fade or artificial camera swing between shots. End: Shot B clearly answers what the character was looking at.
- **Shot–reverse-shot** | Prompt formula: shot–reverse-shot transition. Transition: hard cut between [Character A] and [Character B] during [dialogue or interaction]. Framing: preserve opposing eyelines, compatible camera height and consistent screen direction across both angles. Timing: cut on [speaker change, reaction or dialogue beat]. Ban: no fade, dissolve or random repositioning. End: each reverse angle begins fully formed and spatially coherent.
- **Invisible continuity cut** | Prompt formula: invisible continuity cut. Transition: conceal a hard cut at [fast movement, object crossing, body turn, camera shake or momentary occlusion] so Shot A and Shot B feel continuous. Alignment: match subject position, movement direction, camera height and exposure on both sides of the cut. Ban: no visible dissolve, ghosting or frame blending. End: the audience perceives one uninterrupted action.

### 2. Motion transitions

- **Whip-pan transition right** | Prompt formula: whip-pan transition right. Shot A ending: whip the camera rapidly to the right until the frame becomes directional motion blur. Cut: hard cut at peak blur. Shot B opening: begin with matching rightward motion blur and decelerate into [new subject or scene]. Speed: fast snap followed by a clean settle. Ban: no crossfade or blended scenes. End: land on a sharp readable composition.
- **Whip-pan transition left** | Prompt formula: whip-pan transition left. Shot A ending: whip the camera rapidly to the left until the frame becomes directional motion blur. Cut: hard cut at peak blur. Shot B opening: begin with matching leftward motion blur and decelerate into [new subject or scene]. Speed: fast snap followed by a clean settle. Ban: no crossfade or blended scenes. End: land on a sharp readable composition.
- **Whip-tilt transition up** | Prompt formula: whip-tilt transition up. Shot A ending: tilt rapidly upward until the image becomes vertical motion blur or a readable ceiling/sky field. Cut: hard cut at peak upward movement. Shot B opening: continue the same upward direction before settling on [new subject or location]. Ban: no dissolve or fade through white. End: Shot B resolves sharply.
- **Whip-tilt transition down** | Prompt formula: whip-tilt transition down. Shot A ending: tilt rapidly downward until the image becomes vertical motion blur or a readable ground field. Cut: hard cut at peak downward movement. Shot B opening: continue the same downward direction before settling on [new subject or location]. Ban: no dissolve or fade through black. End: Shot B resolves sharply.
- **Spin transition clockwise** | Prompt formula: clockwise spin transition. Shot A ending: rotate the camera clockwise around the optical axis with increasing speed. Cut: hard cut when the frame reaches [chosen rotation angle or peak blur]. Shot B opening: begin with matching clockwise rotation and decelerate into [new composition]. Alignment: match the central subject or visual anchor. Ban: no warped morphing or dissolve. End: finish level and sharp.
- **Spin transition counterclockwise** | Prompt formula: counterclockwise spin transition. Shot A ending: rotate the camera counterclockwise around the optical axis with increasing speed. Cut: hard cut when the frame reaches [chosen rotation angle or peak blur]. Shot B opening: begin with matching counterclockwise rotation and decelerate into [new composition]. Alignment: match the central subject or visual anchor. Ban: no warped morphing or dissolve. End: finish level and sharp.
- **Zoom-in cut** | Prompt formula: zoom-in transition. Shot A ending: rapidly zoom or push toward [specific object, eye, label, opening or central target] until it fills the frame. Cut: hard cut when the target fills the image. Shot B opening: begin from a matching full-frame shape, texture or colour and pull back to reveal [new scene]. Ban: no infinite morph, dissolve or blended tunnel effect unless requested. End: settle on a stable new composition.
- **Zoom-out cut** | Prompt formula: zoom-out transition. Shot A ending: pull rapidly away from [subject or detail] toward a wider composition. Cut: hard cut at [matching scale or motion cue]. Shot B opening: continue the outward movement from [matching subject or composition] into [new wider environment]. Alignment: preserve the central visual anchor. Ban: no crossfade or object morphing. End: finish on a stable wide shot.
- **Speed-ramp cut** | Prompt formula: speed-ramp transition. Shot A ending: accelerate [subject or camera movement] toward [peak speed/action]. Cut: hard cut at the fastest point. Shot B opening: begin with matching movement direction and high speed, then decelerate naturally into [new action or scene]. Continuity: match motion vector and energy. Ban: no fade, ghosting or optical-flow warping. End: return to normal speed on a clear composition.
- **Motion-direction match** | Prompt formula: motion-direction match transition. Shot A ending: [subject, camera or object] exits or moves strongly toward [left/right/up/down]. Cut: hard cut at the movement peak. Shot B opening: [new subject, camera or object] continues in the same screen direction and approximate speed. Ban: no dissolve or reversed direction unless intentional. End: maintain continuous visual momentum.

### Occlusion & wipes

- **Foreground object wipe** | Prompt formula: foreground object wipe. Shot A ending: move [foreground object] close across the lens from [direction] until it fully covers the frame. Cut: hard cut only when the lens is completely occluded. Shot B opening: begin fully covered by [matching object, colour or texture], then let it move away in the same direction to reveal [new scene]. Ban: no digital dissolve or transparency. End: reveal a fully sharp new composition.
- **Person/body wipe** | Prompt formula: body wipe transition. Shot A ending: have [person] pass very close across the camera from [direction], naturally filling and blocking the entire frame. Cut: hard cut during complete body occlusion. Shot B opening: begin with [same or different person] completing the pass in the same direction and revealing [new location]. Continuity: match speed, clothing colour or silhouette where useful. Ban: no fade or body morphing. End: new scene is fully visible.
- **Doorframe or wall wipe** | Prompt formula: architectural wipe transition. Shot A ending: move the camera behind [doorframe, wall, pillar or building edge] until the frame becomes fully blocked. Cut: hard cut during complete occlusion. Shot B opening: continue moving from behind a visually compatible edge to reveal [new scene]. Direction: preserve [left/right] camera travel. Ban: no dissolve or blended architecture. End: finish on a readable reveal.
- **Lens-cover transition** | Prompt formula: lens-cover transition. Shot A ending: [hand, fabric, cap or object] moves directly toward the lens and covers it completely. Cut: hard cut only when no scene detail remains visible. Shot B opening: begin with the lens fully covered, then remove [matching covering object] to reveal [new scene]. Ban: no fade to black; the darkness must come from physical lens occlusion. End: the new scene appears immediately as the cover moves away.
- **Shadow wipe** | Prompt formula: shadow wipe transition. Shot A ending: a solid moving shadow travels across the frame from [direction] until the image is fully darkened by a physical shadow source. Cut: hard cut at full shadow coverage. Shot B opening: a matching shadow continues moving away in the same direction to reveal [new scene]. Ban: do not simulate this as a fade to black. End: maintain realistic light behaviour.
- **Vehicle pass wipe** | Prompt formula: vehicle pass wipe. Shot A ending: [vehicle] passes close across the lens from [direction], filling the entire frame. Cut: hard cut during complete vehicle occlusion. Shot B opening: begin with a matching vehicle surface crossing the lens in the same direction, then reveal [new scene]. Match: speed, height and motion direction. Ban: no dissolve or vehicle morphing. End: Shot B resolves clearly.
- **Fabric wipe** | Prompt formula: fabric wipe transition. Shot A ending: [coat, curtain, scarf, dress or cloth] sweeps naturally across the lens until the full frame is covered by [colour/texture]. Cut: hard cut at full coverage. Shot B opening: matching fabric continues the sweep and clears the lens to reveal [new shot]. Ban: no liquid morph or transparency effect. End: preserve realistic cloth physics.
- **Water or splash wipe** | Prompt formula: water wipe transition. Shot A ending: [splash, wave or droplets] physically covers the lens until the image is fully obscured. Cut: hard cut at maximum lens coverage. Shot B opening: begin with matching water coverage, then let the water clear or move away to reveal [new environment]. Ban: no cross-dissolve between locations. End: retain realistic droplets, refraction and lens behaviour.

### Visual match transitions

- **Shape match** | Prompt formula: shape-match transition. Shot A ending: frame [object or subject] so its dominant [circle, rectangle, line, silhouette or contour] occupies [specific frame position and scale]. Cut: hard cut to [different object or scene] with the same shape, position and scale. Ban: no morph between shapes. End: Shot B appears instantly while the shared geometry creates the connection.
- **Composition match** | Prompt formula: composition-match transition. Shot A ending: arrange [subject and environment] with [specific subject position, horizon, negative space and camera angle]. Cut: hard cut to [new subject or environment] using the same visual layout. Continuity: match framing and visual weight rather than identity. Ban: no dissolve. End: the new composition reads as a deliberate graphic match.
- **Pose match** | Prompt formula: pose-match transition. Shot A ending: [Character A] holds [specific pose, gesture or body silhouette]. Cut: hard cut to [Character B or the same character in another setting] holding the matching pose in the same frame position and scale. Continuity: align head, shoulders, hands and body direction. Ban: no face or body morphing. End: Shot B continues naturally from the matched pose.
- **Object match** | Prompt formula: object-match transition. Shot A ending: feature [Object A] prominently at [frame position, angle and scale]. Cut: hard cut to [Object B or the same product in a new location] matching the position, orientation and size. Ban: no melting or generative transformation between objects. End: Shot B appears immediately and keeps the matched object readable.
- **Colour match** | Prompt formula: colour-match transition. Shot A ending: let [dominant colour or surface] fill most or all of the frame. Cut: hard cut to [new object, wardrobe, wall, sky or environment] with the same dominant colour and similar brightness. Ban: no colour fade or gradual palette blend. End: Shot B is fully visible from its first frame.
- **Texture match** | Prompt formula: texture-match transition. Shot A ending: move close to [texture such as fabric, skin, sand, metal, glass or stone] until it fills the frame. Cut: hard cut to a visually similar texture in [new subject or location]. Framing: match pattern scale and lighting direction. Ban: no morphing between textures. End: pull away or reveal the new context if required.
- **Scale match** | Prompt formula: scale-match transition. Shot A ending: frame [subject/object] at [specific size] relative to the image. Cut: hard cut to [new subject/object] occupying the same scale and frame position. Ban: no smooth transformation or dissolve. End: the scale similarity creates the visual bridge.
- **Movement match** | Prompt formula: movement-match transition. Shot A ending: [subject/object] performs [specific movement] toward [direction] at [speed]. Cut: hard cut at the movement peak to [new subject/object] completing a visually equivalent movement with matching direction and rhythm. Ban: no interpolated morph. End: Shot B continues the movement energy.
- **Rotation match** | Prompt formula: rotation-match transition. Shot A ending: [object, person or camera] rotates [clockwise/counterclockwise] at [speed]. Cut: hard cut at [specific orientation] to [new rotating element] continuing the same direction and approximate speed. Ban: no blended rotational frames. End: the second rotation decelerates or completes naturally.
- **Eye match** | Prompt formula: eye-match transition. Shot A ending: move into an extreme close-up of [eye] with the iris centred and filling [specified proportion] of the frame. Cut: hard cut to [another eye, circular object or environment] matching the iris position, shape and scale. Ban: no biological morph or dissolve. End: Shot B is immediately sharp and readable.

### Spatial & practical transitions

- **Doorway transition** | Prompt formula: doorway transition. Shot A ending: move forward through [doorway] until the doorway edges or interior darkness fill the frame. Cut: hard cut at complete spatial coverage. Shot B opening: continue forward through a compatible doorway into [new location]. Direction, camera height and speed: remain consistent. Ban: no fade or location morph. End: arrive naturally inside the new space.
- **Window transition** | Prompt formula: window transition. Shot A ending: approach or pass behind [window, glass panel or frame] until [reflection, frame edge or surface] fills the image. Cut: hard cut at full coverage or aligned geometry. Shot B opening: continue the movement through or away from a matching window to reveal [new scene]. Ban: no cross-dissolve through the glass. End: preserve believable reflections and refraction.
- **Mirror/reflection transition** | Prompt formula: mirror transition. Shot A ending: frame [subject or environment] inside a mirror or reflective surface until the reflection fills most of the image. Cut: hard cut to the reflected space becoming the direct camera view in Shot B. Alignment: match subject pose, camera angle and reflection geometry. Ban: no liquid mirror morph or dissolve. End: Shot B appears as a stable direct view.
- **Phone/screen transition** | Prompt formula: screen transition. Shot A ending: move toward [phone, monitor, television or display] until its active image fills the entire frame edge to edge. Cut: hard cut when no bezel remains visible. Shot B opening: begin with the displayed content as the full direct scene, then [continue action or pull back]. Ban: no fade, UI morph or screen distortion. End: maintain matching composition across the cut.
- **Pass-through opening** | Prompt formula: pass-through transition. Shot A ending: move directly toward and through [keyhole, ring, tunnel, arch, gap or object opening] with the opening centred. Cut: hard cut when the opening or surrounding darkness fills the frame. Shot B opening: continue forward from a matching opening into [new environment]. Ban: no dissolve or unrelated portal morph. End: preserve forward momentum.
- **Surface pass-through** (use only for stylised or impossible-camera videos) | Prompt formula: surface pass-through transition. Shot A ending: move toward [solid surface or object] until it fills the frame. Transition: pass directly through the material along a centred path. Shot B opening: emerge into [interior or new space] with continuous camera direction and speed. Material behaviour: show [brief internal texture, refraction or darkness] only if requested. Ban: no fade or random melting. End: arrive in the revealed space.
- **Tunnel transition** | Prompt formula: tunnel transition. Shot A ending: enter [tunnel, corridor, tube or dark passage] while maintaining a centred forward path. Cut: hard cut at the darkest or most visually uniform point. Shot B opening: continue forward through a matching passage and emerge into [new location]. Ban: darkness must come from the environment, not a fade to black. End: expose the new environment naturally.

### Focus & lens transitions

- **Rack-focus cut** | Prompt formula: rack-focus transition. Shot A ending: shift focus from [foreground subject] to [background target] until [chosen plane] becomes sharp and the other becomes blurred. Cut: hard cut while the frame is at [maximum blur or matched focus state]. Shot B opening: begin with matching blur depth, then rack focus to reveal [new subject or scene]. Ban: no crossfade; blur must be optical and motivated by focus. End: finish with the new target sharply focused.
- **Defocus cut** | Prompt formula: defocus cut. Shot A ending: deliberately pull focus away from [subject] until the full frame becomes soft, abstract bokeh without changing exposure. Cut: hard cut at maximum defocus. Shot B opening: begin with visually compatible optical blur, then pull focus onto [new subject]. Ban: no opacity fade or digital dissolve. End: the new scene resolves into sharp focus.
- **Aperture-bokeh match** | Prompt formula: bokeh-match transition. Shot A ending: frame [light or highlight] as a large out-of-focus bokeh shape at [position and colour]. Cut: hard cut to a matching bokeh shape in Shot B. Opening: rack focus or move the camera to reveal [new environment]. Ban: no blended lights or crossfade. End: reveal a sharp new composition.

### Light & impact transitions

- **Flash cut** (not a fade; use only as a brief single-frame or physically motivated burst) | Prompt formula: flash cut. Shot A ending: [camera flash, lightning, spark, headlight or practical light] produces a brief bright burst that fills the frame for no more than [one to three frames]. Cut: hard cut at peak brightness. Shot B opening: begin at matching peak brightness and immediately reveal [new scene] as the burst clears. Ban: no gradual fade to white, prolonged white screen or dissolve. End: restore normal exposure instantly or within the physically motivated light decay.
- **Impact cut** | Prompt formula: impact cut. Shot A ending: build toward [hit, clap, door slam, step, collision, beat or object placement]. Cut: hard cut on the exact contact frame or sound transient. Shot B opening: reveal [new action or scene] with matching impact energy. Ban: no dissolve, delay or softened transition. End: allow the impact consequence to continue naturally.
- **Black-frame impact cut** (use only when explicitly stylistic; never as a fade) | Prompt formula: black-frame impact cut. Transition: insert exactly [one or two] fully black frames at [impact cue], then hard cut immediately to [Shot B]. The black frames are instantaneous editorial punctuation, not a fade in or fade out. Ban: no gradual darkening, prolonged black screen or opacity blend. End: Shot B appears fully visible immediately after the black frame.
- **White-frame impact cut** (use only when explicitly stylistic; never as a fade) | Prompt formula: white-frame impact cut. Transition: insert exactly [one or two] fully white frames at [impact cue], then hard cut immediately to [Shot B]. The white frames are instantaneous editorial punctuation, not a fade or dissolve. Ban: no gradual brightening or prolonged white screen. End: Shot B appears fully visible immediately after the white frame.

### Time transitions

- **Time-jump cut** | Prompt formula: time-jump cut. Transition: keep [camera position, scene or subject] visually consistent while hard cutting from [earlier time/state] to [later time/state]. Change: update [lighting, wardrobe, object state, environment or activity] to show the passage of [duration]. Ban: no fade, dissolve or morph between time states. End: the later state is immediately readable.
- **Day-to-night match cut** | Prompt formula: day-to-night match cut. Shot A ending: hold [location and composition] in daylight. Cut: hard cut to the same framing at night with changed [sky, practical lights, exposure and activity]. Geometry: preserve camera position and architecture exactly. Ban: no gradual sunset, dissolve or time-lapse unless requested. End: night appears instantly as a deliberate time jump.
- **Before-and-after cut** | Prompt formula: before-and-after transition. Shot A ending: show [subject, room, product or object] in its initial state from [fixed composition]. Cut: hard cut at [gesture, clap, hand cover, object pass or beat] to the transformed final state using the same camera position and framing. Ban: no morph, fade or progressive transformation. End: the completed after-state appears immediately.
- **Repeated-action montage cuts** | Prompt formula: repeated-action montage transition. Transition: hard cut between multiple shots of [same repeated action] performed in [different locations, outfits, times or contexts]. Timing: cut at the same movement phase in every shot. Continuity: preserve frame position and action rhythm. Ban: no dissolve between montage shots. End: complete the final repetition in the last shot.

### Audio-led transitions

- **J-cut** | Prompt formula: J-cut. Audio transition: begin [dialogue, ambience, music or sound effect from Shot B] during the final [duration] of Shot A while Shot A remains visually unchanged. Visual transition: hard cut to Shot B at [exact cue]. Mix: let the incoming sound naturally motivate the new scene. Ban: no visual fade or dissolve. End: Shot B continues with its already-established audio.
- **L-cut** | Prompt formula: L-cut. Visual transition: hard cut from Shot A to Shot B at [exact cue]. Audio transition: continue [dialogue, ambience or sound from Shot A] over the opening [duration] of Shot B before blending into Shot B audio. Ban: no visual fade or dissolve. End: Shot B audio takes over naturally.
- **Sound bridge** | Prompt formula: sound-bridge transition. Audio: use [continuous ambience, music phrase, engine, footsteps, wind, crowd or repeated sound] across the hard cut from Shot A to Shot B. Visual transition: cut instantly at [action or rhythmic cue]. Continuity: maintain a believable shared sound texture or intentional thematic connection. Ban: no visual crossfade. End: the sound adapts naturally to the acoustics of Shot B.
- **Beat cut** | Prompt formula: beat cut. Transition: hard cut from [Shot A] to [Shot B] exactly on [specific musical beat, downbeat, snare, bass hit or rhythmic accent]. Visual rhythm: align [action, pose, camera movement or object impact] with the beat. Ban: no dissolve or delayed cut. End: Shot B begins with immediate rhythmic precision.
- **Silence cut** | Prompt formula: silence cut. Shot A ending: abruptly remove [music, dialogue or ambience] at [exact dramatic cue]. Visual transition: hard cut to [Shot B] either simultaneously or after [brief specified silence]. Ban: no audio fade unless explicitly requested; silence should begin suddenly. End: Shot B establishes its new sound bed clearly.

## Universal negative transition instruction

Add this to any multi-shot video prompt when fades or unwanted blending are appearing:

No fade in, no fade out, no crossfade, no cross-dissolve, no dissolve to black, no dissolve to white, no opacity blending, no overlapping scenes, no ghosted frames and no automatic morphing between shots. Every transition is a clean hard cut or the explicitly named practical transition. The first frame of every new shot must appear fully formed, sharp and immediately readable.

##Examples
Prompt: 
scene context
A bright summer afternoon on the coastal road: the young man drives the mint scooter down toward the sea with the young woman riding behind him, arms around his waist — an easy, happy ride past the railway crossing along the water.

ACTIVE REFERENCES
<<<image_1>>> — young woman, 20 years old, 165 cm tall, slender, straight dark brown hair with side-swept bangs pinned by a small black clip, freckles across her cheeks and nose. 100% matches the reference.
<<<image_2>>> — young man, 22 years old, 178 cm tall, lean, sun-tanned, messy dark hair under a tan baseball cap worn backwards. 100% matches the reference.
<<<image_3>>> — vehicle: vintage mint-green scooter with a brown leather saddle, chrome mirrors and silver wheels. 100% matches the reference.
<<<image_4>>> — location: coastal road curving downhill past a railway crossing with yellow-and-black crossbuck signs, utility poles and wires, stone embankment walls, an orange convex traffic mirror on a pole, the open sea with white-capped waves behind.

LOCATION MAP
The road from <<<image_4>>> curves downhill through the midground toward the railway crossing, the sea filling the background beyond it. Stone embankments rise on both sides, the orange convex mirror stands on the right shoulder in the near foreground, utility poles line the curve. Their path: down the curve, past the crossing, along the water toward screen-left. Primary light: bright seaside daylight, sun high, wind off the sea.

FIRST FRAME AND SPATIAL BLOCKING
The first visible frame already contains <<<image_3>>> rolling down the curve with both riders aboard — <<<image_2>>> driving, hands on the grips, <<<image_1>>> seated close behind him, arms wrapped around his waist, her head just above his shoulder, a full head shorter than him. No empty establishing frame, no delayed reveal. He drives in every segment; she is always the passenger.

FORMAT MODE
Controlled four-segment multi-shot sequence: one INSERT CUT and two HARD CUTS. Real-time motion at an easy unhurried scooter pace. Every segment is shot handheld — no static shot anywhere in the sequence.

OPTICS
LENS LOCK SEGMENT 1 = 47° diagonal field of view, standard normal lens character, camera 12 to 15 meters at the roadside, the scooter and both riders full in frame with the crossing and sea behind, straight lines rectilinear, no fisheye. Soft vintage lens rendering: gentle edge softness, mild halation in the bright sky and sea glare, even brightness across the whole frame — no vignette, corners stay as bright as the center. This rendering applies to every segment.
LENS LOCK SEGMENT 2 = 29° diagonal field of view, short telephoto character, camera 3 to 4 meters tracking alongside from a following vehicle, close two-shot of their faces and shoulders, the sea streaming soft behind them.
LENS LOCK SEGMENT 3 = 29°, camera 1.5 to 2 meters, tight insert on her hands clasped at his stomach, the mint body and brown saddle below, road surface blurring past.
LENS LOCK SEGMENT 4 = 47°, camera 10 to 12 meters behind the orange convex mirror on the right shoulder, the mirror large in the near foreground reflecting the road, the real scooter passing through the frame and receding along the sea.
No drift mid-segment.

CAMERA
Handheld in every segment with no exceptions — a real operator at the roadside and in a following vehicle: the frame breathes with shoulder sway and soft micro-tremor visible in every second, small late reframes chasing the scooter and easing back; the tracking shot carries gentle road vibration on top of the hand movement; the insert trembles slightly more; the mirror wide breathes slower but never freezes. No tripod stillness, no gimbal smoothness, no stabilization anywhere. On top, the footage behaves like an old film print running through a projector: constant subtle gate weave, faint exposure flicker, occasional tiny dust specks and hairline scratches, image soft and slightly diffused like an aged 16mm print — never sharp, never digitally clean, no vignette or darkened corners at any moment.

ACTION TIMING
0.0s to 3.5s — Roadside wide: the mint scooter putters down the curve at an easy pace, leaning gently with the bend; <<<image_2>>> relaxed at the grips, <<<image_1>>> pressed close behind him, her hair and skirt hem streaming in the sea wind; they pass the yellow-and-black crossing signs with the white-capped sea glittering beyond.
3.5s HARD CUT
3.5s to 6.5s — Tracking close two-shot: she rests her chin almost on his shoulder and says something teasing into his ear — lips moving without audible words; he barks a laugh, shaking his head, cap holding snug; she grins wide against the wind, bangs whipping, eyes squinting happily.
6.5s INSERT CUT
6.5s to 8.5s — Tight insert: her hands clasped over his stomach, fingers laced, giving a little squeeze as the scooter sways through a bend; the mint body flexes light reflections, the road surface streams underneath in soft blur.
8.5s HARD CUT
8.5s to 12.0s — Wide past the orange convex mirror: the tiny reflection of the scooter slides across the round mirror in the foreground a beat before the real scooter enters and crosses the frame, unhurried, the two of them small against the vast bright sea; she tips her head back and laughs into the wind as they recede along the coast; the engine putter fades.

PHYSICS
The scooter carries real combined weight: soft suspension compression over road seams, a gentle lean into each bend with both bodies tilting as one, slight throttle sway she counterbalances by gripping tighter; engine vibration trembles through their sleeves; wind at riding speed streams her hair, his tee and her skirt hem backward continuously with fabric flutter; the sea wind adds gusts; the convex mirror reflection tracks their motion with true optics.

LIGHTING
Bright seaside daylight only — no artificial light. Aged film print look: the sky and the glittering sea bloom into a soft white-gold haze with visible halation rings, gentle glow hanging in the air, creamy highlights rolling off softly. Faded pastel grade of an old print: lifted milky blacks, warm ivory and honey tones over softened sea blues, the mint scooter body reading as a gentle washed pastel green, the orange mirror and yellow-black signs as warm muted accents — never oversaturated; slightly yellowed whites, low contrast, colors gently washed as if the print has aged for twenty years, heavy visible film grain crawling in every frame, delicate haze. Exposure stays natural across the frame — no added vignette, no darkened edges or corners. The whole image reads as an old 2000s Japanese film discovered on a dusty reel. No crisp modern digital look, no cool color cast.

AUDIO
SFX only, with the worn texture of an old optical soundtrack — slightly muffled, faint constant hiss: the soft putter of the small scooter engine rising and fading with the throttle, wind buffeting past, waves breaking below the road, gull cries, her bright laugh snatched by the wind, the faint tick of the engine at the far end. No music, no intelligible spoken words, no captions, no score.

POSITIVE LOCKS
Identities lock 100% to <<<image_1>>> and <<<image_2>>> in every segment — same outfits as their references throughout, her natural 165 cm and his 178 cm with true relative proportions, his cap staying backwards and snug at riding speed in every shot. <<<image_2>>> drives in every segment; <<<image_1>>> rides pillion with her arms around his waist from first frame to last, hands unclasping never. The scooter stays 100% <<<image_3>>> — mint-green body, brown saddle, chrome mirrors — in every shot. Road geography stays consistent with <<<image_4>>> across all cuts: downhill curve, crossing signs, embankments, orange mirror on the right shoulder, sea always beyond the road; travel direction constant toward screen-left. Handheld breathing holds in every single segment, and the aged-film texture holds identically throughout: grain, gate weave, flicker, dust, halation and faded grade never weaken, frame stays vignette-free with even corner brightness; no segment turns rigid, stabilized, sharp or digitally clean. Only these two people appear; the road stays otherwise empty, no cars, no train.

#Example
Shahid Wani
@meng_dagg695
·
6h
Seedance 2.0 creation on @higgsfield
 

Prompt : Style: Ultra-photorealistic 8K IMAX cinematic film. Absolutely no CGI, game-engine appearance, or stylized rendering.

Lighting: Natural illumination only. Strong backlit (contre-jour) atmosphere with the camera positioned in shadow. Soft sky glow, window illumination, subtle atmospheric haze, and realistic night ambience. No artificial studio lighting.

Color Palette: 60:30:10 ratio (primary / secondary / accent).

Camera: Professional cinema camera with vintage anamorphic optics. Physical lens characteristics, authentic depth of field, and natural 180° shutter motion blur.

Skin Detail: Hyper-realistic pores, fine facial hairs, natural skin asymmetry, subtle capillary warmth, realistic pore shadows, and physically accurate light interaction.

Performance: Feature-film quality acting with authentic micro-expressions, tiny pauses before reactions, believable eye movement, natural breathing, and emotionally grounded performances. Characters remain in motion or reacting naturally.

Physics: Real-world gravity and momentum. Every object carries believable weight with accurate contact shadows and inertia.

Composition: Rule of thirds combined with golden-ratio framing. Every shot contains purposeful movement from the first frame.

Continuity: Wardrobe, environment, props, and character appearance remain perfectly consistent throughout every cut.

Technical: Native 24 fps cinematic motion, ultra-high-resolution detail, completely stable camera movement.

Audio: Ambient environmental sounds only. No music. No narration. No subtitles.

Characters

LEAD WOMAN: Wearing a tailored pastel-blue pantsuit over a blush satin camisole, delicate gold necklace, pointed rose-colored heels, long honey-blonde hair worn loose. She radiates excitement, confidence, and genuine happiness, walking with effortless energy.

WINDOW COUPLE: A man and woman in their late twenties wearing elegant retro-inspired evening clothing, seated across from one another inside a classic chrome diner. Their posture is reserved and distant at first.

Setting

Nighttime in a dense downtown district filled with vintage architecture, towering buildings, glowing storefronts waiting in darkness, and reflective rain-washed pavement.

The central rule of this world:

Every source of light remains completely dark until the woman reaches it.

The instant she draws alongside a light source, it awakens naturally and remains illuminated behind her. The path ahead is always dark, while everything behind her becomes increasingly alive, creating the feeling that she is bringing the city to life with every step.

CUT 1

Fast side-tracking shot on a 35 mm lens, moving alongside her before craning upward toward a tall vertical theater sign.

As she walks beneath an apartment building, each individual window illuminates precisely as she passes below it, floor after floor, perfectly synchronized with her footsteps.

A towering vertical marquee, previously unlit, begins activating from the bottom upward as she reaches it. Each glowing letter appears in sequence, building into an original fictional title in vibrant magenta neon.

She instinctively looks upward, smiles, and lets out a quiet laugh as the final letter ignites.

CUT 2

Medium shot through the large diner window using a 50 mm lens.

The camera slowly pushes inward through reflections on the glass.

An elegant cursive neon sign above the window remains dark until she reaches it. The moment she passes, the sign hums softly to life, casting a cool turquoise glow across the chrome interior.

Focus shifts smoothly through the glass toward the seated couple.

As the light reaches them, they simultaneously look up, make eye contact for the first time, and exchange a small, genuine smile, subtly changing the atmosphere between them.

CUT 3

Wide 24 mm crane shot slowly rising while drifting in a gentle arc around her.

She crosses a deserted city intersection.

Every nearby source of light responds instantly to her movement.

Traffic signals awaken.

Storefront signs illuminate.

Vintage arcade lights flicker on.

Hotel arrows begin glowing.

Street lamps awaken one after another.

The activation spreads outward like ripples across every street connected to the intersection.

Behind her, the city becomes vibrant and alive.

Ahead of her, complete darkness remains until she arrives.

Halfway across the intersection she turns briefly, taking in the glowing world she has created.

CUT 4

An aerial camera accelerates upward from directly overhead into a sweeping skyline view.

Below lies an almost entirely dark city grid.

Only one brilliant ribbon of illuminated streets cuts through the darkness.

At the end of that glowing path, the tiny figure continues walking.

With every step, new lights ignite exactly where she is.

The illuminated trail grows continuously behind her while the city ahead remains untouched.

As the camera reaches the skyline, her path arrives at the base of a skyscraper.

A massive rooftop sign that has remained dark suddenly flickers to life, gradually forming an elegant original cursive wordmark in luminous rose-colored neon.

It becomes the brightest light visible anywhere in the city as the film ends.

#example3
Use the attached image as the exact first frame. Do not regenerate or restyle the face — keep the same girl, same blue goggles, same skin, and crucially keep the same heavy 35mm film grain texture of the original photo throughout the entire video, on every frame.

At the very start, the girl rises slightly so her mouth and chin lift just above the waterline into the pose shown, water sheeting and dripping off her face and goggles, ripples spreading around her. She then holds that exact position — calm, deadpan, nonchalant, eyes steady behind the goggles, never reacting, totally unbothered. Her face stays stable, natural, and anatomically correct the entire time, no warping or distortion.

The camera pulls back smoothly and steadily in one continuous unbroken shot, drifting backward and slightly upward, her face shrinking in the frame as more of the scene is revealed around her.

The pull-back uncovers that she is floating calmly in the middle of a flooded fluorescent-lit office breakroom in total chaos — knee-to-waist-deep churning water filling the room, dozens of office workers in business clothes panicking all around her: people scrambling onto a vending machine, leaping from tables, climbing the walls toward the ceiling tiles, wading and falling through the water, hauling each other up, papers and plastic chairs and a floating monitor swept up in the surge, water gushing in through a doorway like a waterfall along the back wall. She remains the one still, calm point at the center of the panic.

Every face in the video remains anatomically correct, stable, and realistic at all times — natural human proportions, clean facial features, genuine readable expressions of fear and panic. No melting, no warping, no distorted or smeared faces, no extra or misshapen eyes or mouths, no uncanny morphing as people move.

Everything moves continuously: the flood water churns, sloshes, and reflects the harsh ceiling lights, spray flies, the panicking people thrash and climb and scramble in motion, hands reach up out of the water, debris floats and bobs, the doorway waterfall pours steadily, fluorescent light flickers on the surface. The camera keeps gliding back to take in the full wide chaotic scene.

Sickly institutional palette throughout — seafoam green walls, cream, muted teal, harsh fluorescent white, cold reflective water. Consistent heavy analog film grain and 35mm photographic texture baked into every frame from start to finish, matching the grain of the source image, never clean or smooth, never digital-looking. Flat overhead light, absurd deadpan calm at the center against frantic drowning panic around it, smooth steady continuous camera motion, cinematic photorealistic, ultra-detailed.

##example4
Prompt:
Super casual real smartphone home video footage, road trip pit stop at a scenic roadside spot, natural mobile phone camera with slight authentic handheld shake, normal frame rate with smooth natural motion, rapid-fire montage with quick jump cuts every 1–2 seconds, unpolished authentic phone recording of friends stretching, snacking and taking photos by the car, pure raw home video feel, no cinematic polish.

Use the main character as the strict ONLY visual reference. Maintain their exact appearance with zero deviation. Generate a mixed group of friends around them at the roadside stop, with the car and open road visible.

0–2.5s: Shaky rapid cuts of the main character laughing while leaning on the car, wind blowing through their hair, with quick flashes of the scenic road view.

2.5–5s: Abrupt jump cuts to a close-up of them sipping a cold drink, followed by friends unpacking snacks from the car.

5–7.5s: Fast shaky footage as they chat animatedly and point toward the view while their friends laugh around them.

7.5–10s: Quick close-up of them giving the camera a playful smile, then a jump cut to the group taking a silly photo together.

10–12.5s: Abrupt edit to everyone gathered near the car hood, sharing chips while music plays casually.

12.5–15s: Final rapid transition to the main character relaxing against the car with a soft smile, ending like a calm road trip memory with a gentle phone sway.

Natural smartphone video quality, slight handheld shake, smooth motion, authentic physics, stable main character consistency and no professional effects.
