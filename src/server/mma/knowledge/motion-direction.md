# Motion Direction — Vehicles, Moving Objects & Travel Truth

Use this file whenever anything travels: cars, scooters, boats, bikes, drones-as-subjects, animals, runners, thrown or falling objects. It exists because of one repeated failure: a bare motion verb plus a static reference image renders a vehicle driving BACKWARD. The model cannot infer direction — it must be told, every time, in both world terms and screen terms.

Apply after `realism-best-practice.md`; camera movement grammar stays in `camera-angles-and-movements.md`. This file is about the SUBJECT's motion, not the camera's.

## 1. The direction law

Every moving subject gets one explicit direction sentence containing all three anchors:

1. **Orientation:** nose-first / head-first / bow-first — or explicitly "in reverse" when reverse is requested.
2. **World path:** where from, where to ("out through the gates onto the gravel drive").
3. **Screen vector:** toward or away from camera, and toward screen-left or screen-right.

Formula: `the [subject] moves [nose-first/forward], [world path], [toward camera / away from camera], travelling toward screen-[left/right]`.

Never rely on a bare verb. These verbs are ambiguous and the model resolves them badly:

- "pulls out" — training data resolves this as REVERSING out of a driveway;
- "rolls out", "drives off", "backs", "exits", "leaves" — direction unstated;
- "comes out of the gates" — could be nose-first or reverse.

Wrong: `the Mercedes rolls out through the gates.`
Right: `the Mercedes drives out nose-first through the open gates toward the camera, front grille leading, and passes screen-left.`

## 2. Static references do not mean static subjects

A reference image of a parked vehicle, standing person or resting object contributes appearance only. Say so: `@Image 5 supplies the car's paint, chrome and interior — the car itself is in forward motion in every driving shot.` Without this line, a parked reference pulls the shot toward stillness or reverse.

## 3. Physics that must agree with the direction

State or imply these; check them against the declared travel vector:

- wheels rotate in the direction of travel; spokes and hubcaps blur accordingly;
- dust, gravel spray, exhaust, boat wake and bow spray trail BEHIND the mover;
- hair, scarves, open shirts and convertible-cabin wind stream opposite to travel;
- the body/chassis leans INTO turns; suspension compresses on the outside;
- acceleration sits occupants back; braking pitches the nose down;
- a subject in motion advances through the world — background parallax moves opposite to travel at matching speed.

## 4. Direction across cuts

- Keep each mover's screen direction constant across consecutive shots (travel stays toward the same screen side) unless a turn is shown on screen.
- After a whip-pan or motion-direction match cut, the next shot continues the SAME travel vector.
- In mirrors and reflections the world direction stays true: a car moving screen-left shows a rearview coastline sliding screen-right.

## 5. Reverse is opt-in only

Reverse motion, backing up, or a rewind look happens only when the raw user brief explicitly asks for it. A generated prompt cannot introduce reverse on its own.

## 6. Negatives to attach when anything travels

`driving in reverse, backwards motion, reversed footage, rewind effect, wheels rotating against travel direction, vehicle sliding without wheel rotation, treadmill effect, subject walking in place, background moving the wrong way, wake or dust trailing ahead of the mover, direction flip between cuts`

Keep only the lines relevant to the shot — a walking scene does not need the wheel negatives.
