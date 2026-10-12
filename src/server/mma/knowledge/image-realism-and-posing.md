# Image Realism & Posing — how a real photo of a person looks

Use this file on every Mina **still image** of a person or product. It is the photo-only realism layer: no motion, no beats, no follow-through — a single frozen frame that has to look like a real photograph someone actually took, not a rendered mannequin. Apply it after the engine guide (`nano_banana` / `gpt_image`) and the format guide (editorial / iphone / cinematic).

The single biggest tell that an image is generated is a **posed, symmetrical, evenly-lit subject staring into the lens**. Everything below fights that.

## 1. Posing — a real person is caught, not arranged

Default to a relaxed, weight-shifted stance, never square-to-lens with even weight and arms at the sides (the catalog / mannequin / ID-photo look):

- weight on one leg, the other knee soft and slightly bent (contrapposto); hips and shoulders tilt in **opposite** directions; spine gently S-curved, never a rigid vertical column;
- torso at a three-quarter angle to the lens more often than flat frontal; one shoulder nearer the camera;
- head not perfectly level — a small tilt or turn off the shoulder line, chin slightly up or down, rarely dead-square;
- feet at natural, unequal angles, actually bearing weight — never fused heels or floating.

Hands and arms must have a **reason** — this is where generated poses fall apart:

- resting in a pocket, on a hip, holding the product, tucking hair, adjusting a sleeve or collar, hanging with relaxed loose fingers — never two symmetrical claws hovering at the sides;
- fingers curve naturally and differ between hands; elbows keep a slight bend (locked-straight arms read as a doll);
- a hand holding something wraps it with a real grip and visible contact pressure, fingertips compressing slightly — not a flat stiff press, never fingers passing through the object.

Gaze and expression are a **micro-moment**, not a held pose:

- eyeline is motivated — into the lens with intent, or to a specific point in the scene, never a glassy middle-distance stare;
- expression is the start or tail of a smile, a soft closed mouth, a small breath — not a frozen full grin held a beat too long;
- if the frame catches a gesture (mid-step, turning, reaching, laughing, looking back), let it read as an in-between instant, not a stiff freeze of the endpoint.

Wardrobe and hair follow the pose: fabric folds and pulls at the engaged hip and knee, a hem hangs unevenly, a strap shifts, hair falls to one side and reacts to the head's angle.

## 2. Human asymmetry (perfect symmetry reads synthetic)

- one shoulder slightly lower; weight more on one hip;
- eyebrows and the two sides of a smile differ; the smile starts on one side;
- hair volume differs by side; a few flyaways break the silhouette;
- garment folds are not mirrored; hands never make identical gestures.

Asymmetry comes from posture and behaviour, not random deformation.

## 3. Face and skin

Skin is regionally different, not one global texture:

- forehead slightly more sheen; nose and inner cheeks show pores and stronger speculars; under-eyes thin with faint folds; lips have fine vertical lines and uneven moisture; jaw and temples finer with small facial hairs.

A few restrained imperfections make a face human — one faint blemish, mild redness beside the nose, uneven blush, a small healed mark, light forehead shine, a subtle brow difference. Avoid the two failure modes: **plastic/waxy beauty-filter skin** on one side and a **catalogue of 4K pores, acne and dirt** on the other. Controlled variation only.

Under light: broad soft light gives gradual highlights, a small hard source gives sharper speculars; skin is neither matte clay nor wet plastic; makeup sits on skin and can crease slightly.

## 4. Eyes and gaze

- both eyes converge on the same target; catchlights match the scene's real light sources;
- eyes are moist, not glass marbles; lids contact the eyeball and cast a tiny shadow;
- direct eye contact must have a reason; a subject doing something rarely stares dead into the lens.

## 5. Hands and object interaction (high-risk — be explicit)

- state the exact hand and grip; show the contact points; one active hand, one support hand;
- fingertips deform under pressure; ring / watch / nails stay consistent;
- don't hide fingers behind a reflective product to dodge the problem — frame an angle that proves the grip;
- the product's shadow and reflection respond to where the hand actually holds it.

## 6. Materials & light (photo truth)

- cloth, metal, glass, skin and hair each respond to light differently — never one uniform "render" sheen;
- shadows stay attached to their objects and agree on direction with the visible light source; contact shadows ground every object and foot;
- for a new composition, one motivated key light with a believable direction beats flat, sourceless, everywhere-light;
- for a scene edit, preserve the base image's exact existing illumination instead of inferring or naming a direction; add no new key, fill, bounce, rim or glow;
- exposure has a reason (window, softbox, sun); no random HDR glow, no full-frame cinematic bokeh on a phone-shot still.

## 7. Framing

- eye-level or a slightly motivated angle; a real photographer stands at a real distance with a real lens (≈35–85mm equivalent for people), not an impossible float;
- leave natural headroom and negative space; the subject is rarely dead-centre and dead-frontal;
- the product reads clearly but sits **in** the scene, held or placed with real weight, not pasted on top.

## Negative prompt (lift the fragments that apply)

stiff frontal pose, symmetrical stance, arms glued to sides, mannequin posture, catalog pose, ID-photo pose, rigid straight spine, weight evenly on both feet, claw hands, floating hands, fingers through product, held frozen grin, dead-eye stare, glassy middle-distance stare, posed and lifeless, plastic skin, waxy skin, beauty-filter face, perfect facial symmetry, duplicated identical teeth, extra fingers, fused fingers, changing ring, flat sourceless lighting, missing contact shadows, floating product, pasted-on product, watermark, captions, invented readable brands.
