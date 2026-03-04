# Crystal Shatter Prize Reveal — Animation Specification

## Concept Summary

A luminous crystal descends from above, charges with converging energy, and **shatters** to reveal prizes that were trapped inside. The container is **destroyed** in the act of revealing — not opened, not widened — annihilated. Prizes emerge from the center, displayed in crystalline frames, and are collected by compressing into gem points that streak to the player's balance.

## Differentiator Matrix

| Axis | Chest Variants | Arcane Portal | **Crystal Shatter** |
|-|-|-|-|
| Container fate | Opens (survives) | Aperture widens | **Destroyed (shatters)** |
| Entry direction | Rises from below | Materializes in-place | **Descends from above** |
| Energy flow | Outward burst | Orbiting around | **Converges inward** |
| Prize origin | Fly in from edges | Descend through portal | **Emerge from center** |
| Display aesthetic | Glowing circles + rays | Runic sigils + motes | **Crystal frames + prisms** |
| Claim animation | Fly away upward | Fly away upward | **Compress → streak to target** |
| Material language | Wood / metal | Magical energy | **Crystal / glass / prism** |
| Color palette | Warm gold / brown | Purple / blue arcane | **Blue-white → prismatic** |

---

## Image Assets

All assets are transparent PNGs generated with GPT model, stored in xainflow folder `Crystal Shatter Prize Reveal` (project: Default Project).

| Asset | Size | Description | Asset ID |
|-|-|-|-|
| crystal-body | 1024x1024 | Luminous hexagonal crystal prism, blue-white, internal fracture veins | `eb3ff4ee-70a8-44de-8590-1502d577ae25` |
| crystal-shard-1 | 1024x1024 | Triangular wedge fragment | `0ab0d27e-3a03-4fdf-a2be-8b1eabcc27b6` |
| crystal-shard-2 | 1024x1024 | Long thin splinter fragment | `644d1304-eecf-403d-95d1-0ab1dfb02989` |
| crystal-shard-3 | 1024x1024 | Chunky pentagonal fragment | `eceac2f2-b2d4-4df3-91c3-5ba4031852c9` |
| crystal-shard-4 | 1024x1024 | Flat diamond/rhombus fragment | `1587883d-5026-4a51-8f52-9025de06b44f` |
| energy-mote | 1024x1024 | Glowing prismatic energy orb | `69a32530-ba2d-46b7-98dc-22876f872c6b` |
| crystal-sparkle | 1024x1024 | Four-pointed prismatic star sparkle | `6ff00b9f-cb22-4bf8-a820-6d09a791b2cc` |
| prismatic-ring | 1024x1024 | Rainbow gradient ring (shockwave) | `26e5ee91-0e4c-4883-a800-95610e5ac815` |
| crystal-frame | 1024x1024 | Hexagonal crystalline prize frame | `289daf41-ccfc-4cea-989b-0d41b64ff139` |
| dark-crystal-body | 1024x1024 | Depleted purple-grey crystal (no-win) | `10bf83d9-9e0a-4f51-9cfa-89c3ed5be1b9` |
| crystal-dust | 1024x1024 | Tiny luminous dust mote | `3eb782f0-740d-4148-a7bb-1c100268011e` |

---

## Phase 1: Crystal Descent (0 – 1200ms) — "The Arrival"

A massive luminous crystal descends from darkness above like a celestial object.

### Crystal Properties
- Shape: elongated hexagonal prism, ~180px rendered height
- Material: semi-transparent, cool blue-white, internal fracture veins glowing
- Image: `crystal-body.png`

### Motion Sequence
| Time | Property | From | To | Easing |
|-|-|-|-|-|
| 0–800ms | translateY | -150px | 0px | cubic-bezier(0.2, 0, 0.1, 1) |
| 0–800ms | rotateZ | -8° | 0° | same |
| 0–800ms | opacity | 0 | 1 | ease-out (first 200ms) |
| 800–1000ms | Landing ring scale | 0.3 | 1.5 | ease-out |
| 800–1000ms | Landing ring opacity | 1 | 0 | linear |
| 1000–1200ms | Crystal scale pulse | 1.0 → 1.03 → 1.0 | — | ease-in-out |

### Particle Effects
- **Dust trail**: 4–6 `crystal-dust` particles trail behind during descent, fading over 300ms each
- **Ambient motes**: 8–12 `crystal-dust` particles drift lazily around the scene throughout entire animation, opacity 0.3–0.5, random slow drift

---

## Phase 2: Energy Convergence (1200 – 2400ms) — "The Charging"

Energy converges **inward** toward the crystal — the inverse of a burst. This is the signature differentiator.

### Convergence Motes
- Count: 12–16 `energy-mote` particles
- Spawn: random positions 200–300px from center (edge of viewport area)
- Stagger: 3–4 motes every 200ms over 800ms total
- Path: curved inward (bezier arc, not straight line)
- Scale: 1.0 → 0.3 as they approach crystal
- Brightness: filter brightness(1) → brightness(2) during approach
- Absorption: tiny flash at crystal surface on contact (scale 0 → 0.5 → 0, opacity 1 → 0, 100ms)

### Crystal Response
| Time (within phase) | Property | From | To | Notes |
|-|-|-|-|-|
| 0–1000ms | Crystal scale | 1.0 | 1.06 | Slow steady growth |
| 0–1000ms | Fracture vein opacity | 0.4 | 0.9 | Internal glow intensifies |
| 0–1000ms | Color temperature | blue-white | golden-white | CSS filter hue-rotate |
| 800–1100ms | Vibration (translateX) | ±1px | ±3px | Period: 30ms, intensifying |
| 800–1100ms | New fracture cracks | opacity 0 → 1 | — | Additional crack overlays appear |
| 1100–1200ms | Stillness | — | — | All motion stops (calm before storm) |

---

## Phase 3: The Shatter (2400 – 3200ms) — "The Break"

The crystal **shatters**. The container is annihilated.

### Central Flash
| Time | Property | From | To |
|-|-|-|-|
| 2400–2500ms | Flash scale | 0 | 3.0 |
| 2400–2700ms | Flash opacity | 1 → 0.8 | 0 |

Use a white radial gradient div or the `crystal-sparkle` asset scaled large.

### Fragment Explosion (2400–3000ms)
- Count: 8–10 fragments using `crystal-shard-1` through `crystal-shard-4` (reused with rotation)
- Angular distribution: roughly evenly spaced 360° with ±15° randomization
- Per fragment:

| Property | Value | Notes |
|-|-|-|
| Initial velocity | ~150px in first 200ms | Fast launch |
| Deceleration | Asymptotic to stopped | Zero-G float (no gravity) |
| Distance | 150–250px from center | Random per shard |
| Rotation | 60–240° total | Random direction and amount |
| Scale | 1.0 → 0.5 | Shrinks during flight |
| Opacity | 1.0 → 0 | Fades during last 30% of trajectory |
| Duration | 600ms | Per fragment |

### Prismatic Ring (2400–2900ms)
- Asset: `prismatic-ring.png`
- Scale: 0.1 → 2.5 over 500ms
- Opacity: 0.8 → 0
- Centered on crystal position

### Crystal Dust Spray (2400–3200ms)
- Count: 20–30 `crystal-dust` particles
- Direction: all 360° from center
- Varied velocities (fast near center, slower farther)
- Size: rendered at 4–8px
- Lifespan: 400–600ms each
- Stagger: spray continues 200ms after initial break

---

## Phase 4: Prize Emergence (3200 – 4800ms) — "The Reveal"

Prizes materialize **from within** — they were inside the crystal all along.

### Prize Positions (horizontal layout)
| Count | Positions (px from center) |
|-|-|
| 1 | [0] |
| 2 | [-80, +80] |
| 3 | [-120, 0, +120] |
| 4 | [-140, -47, +47, +140] |

Y position: -10px (slightly above center to leave room for claim button).

### Per-Prize Animation (staggered by 150ms)
| Time (relative) | Property | From | To | Easing |
|-|-|-|-|-|
| 0–200ms | Opacity | 0 | 1 | ease-out |
| 0–300ms | Scale | 0 → 1.15 → 1.0 | — | spring (stiffness ~200, damping ~15) |
| 0–400ms | translateX | 0 | target position | ease-out |
| 500–800ms | Frame materializes | scale 0.8, opacity 0 | scale 1.0, opacity 1 | ease-out |
| 600–1100ms | Count-up | 0 | target value | cubic-bezier(0, 0, 0.2, 1) over 500ms |
| 1100–1300ms | Label fade-in | opacity 0 | opacity 1 | ease-out |

### Prize Display Elements
1. **Prize icon**: reward image (coin, gem, etc.)
2. **Crystalline frame**: `crystal-frame.png` overlay around each prize, materializes 200ms after landing
3. **Prismatic aura**: soft rainbow glow behind prize, `hue-rotate` animation 0° → 360° over 8s (infinite), opacity 0.3–0.4
4. **Orbiting dust**: 3 × `crystal-dust` particles per prize, elliptical orbit paths (2.5s period), computed with trig
5. **Count-up text**: value counts from 0 to target over 500ms, prismatic shimmer via `background-clip: text` with animated linear gradient
6. **Prize label**: small text below icon ("Gold Coins", "Free Sweepstake Coins", etc.)

### Stagger Timeline
| Event | Time |
|-|-|
| Prize 1 starts | 3200ms |
| Prize 2 starts | 3350ms |
| Prize 3 starts | 3500ms |
| Prize 4 starts | 3650ms |
| All settled | ~4200ms |
| Count-ups begin | 3800–4250ms (600ms after each lands) |
| Full display | ~4800ms |

---

## Phase 5: Claim Button Reveal (4800 – 5200ms) — "The Invitation"

### Button Design
- Semi-transparent dark background with prismatic edge glow (frosted glass + rainbow edge lighting)
- Text: "CLAIM" — clean, luminous white, slight letter-spacing
- Rounded rectangle with subtle faceted edge treatment

### Entrance
| Property | From | To | Duration | Easing |
|-|-|-|-|-|
| Scale | 0.85 | 1.0 | 400ms | ease-out |
| Opacity | 0 | 1 | 400ms | ease-out |
| translateY | 10px | 0 | 400ms | ease-out |

### Idle State (infinite loops)
| Property | Range | Duration |
|-|-|-|
| Border glow opacity | 0.6 → 1.0 → 0.6 | 2s |
| Scale | 1.0 → 1.015 → 1.0 | 3s |
| Edge hue-rotate | 0° → 360° | 6s |

---

## Phase 6: Prize Collection (user-triggered) — "The Absorption"

### Step 1: Compression (per prize, staggered 80ms)
| Property | From | To | Duration | Easing |
|-|-|-|-|-|
| Scale | 1.0 | 0.35 | 350ms | ease-in |
| Brightness filter | 1 | 2.5 | 350ms | ease-in |
| Frame scale | 1.0 | 0 | 200ms | ease-in |
| Orbiting motes | orbit path | prize center | 200ms | accelerate |

Prize transforms into a brilliant gem point of light.

### Step 2: Streak to Target (350–750ms per prize)
- Trajectory: curved arc (bezier path, slight sweep)
- Speed: **accelerating** (starts slow, ends fast — ease-in, opposite of typical)
- **Comet trail**: 6–8 `crystal-dust` particles trail behind gem, each fading over 150ms
- Trail shifts through prismatic spectrum
- Trail particles shrink the farther behind they are

### Step 3: Arrival Burst
- Per gem: `crystal-sparkle` burst at collection point (scale 0 → 1.5 → 0, 200ms)
- Flash: opacity 0 → 0.8 → 0, 150ms

### Final Flourish
- After all gems collected: `prismatic-ring` expands from collection point (scale 0.5 → 2.0, opacity 0.6 → 0, 400ms)
- 4–6 `crystal-sparkle` particles scatter from collection point

### Collection Timeline
| Event | Time (relative to claim click) |
|-|-|
| Prize 1 compresses | +0ms |
| Prize 2 compresses | +80ms |
| Prize 3 compresses | +160ms |
| Prize 4 compresses | +240ms |
| Streaks fire | immediately after each compression |
| Final flourish | ~+1000ms |
| Total duration | ~1100ms for 4 prizes |

---

## No-Win Variant

Uses `dark-crystal-body.png` instead of `crystal-body.png`.

### Phase 1: Same descent (identical to win variant)

### Phase 2: Dark Charge (modified)
- Motes converge but crystal develops **dark cracks** instead of bright ones
- Color shifts to deep purple-grey (not golden-white)
- No vibration buildup — ominous darkening only
- Fracture lines glow dim sickly purple

### Phase 3: Crumble (replaces Shatter)
- No explosive burst, no flash, no prismatic ring
- Crystal **crumbles** — fragments fall **downward** with gravity
- Fragment opacity: 1.0 → 0 over 500ms
- Fragments dissolve into dust particles as they fall
- Mood: subdued, quiet, respectful

### Phase 4: Empty Reveal
- Small "No prizes" text fades in at center (opacity 0 → 0.6, 400ms)
- No claim button — auto-dismiss or simple "OK" button

### Total Duration: ~3s (brief, doesn't waste player's time)

---

## Master Timeline

```
0ms        Crystal appears at top edge
0–800ms    Crystal descends to center
800–1000ms Landing impact ring
1000–1200ms Crystal settle pulse
1200–2000ms Energy motes converge inward
2000–2200ms Crystal vibration builds, color shifts golden
2200–2350ms Peak vibration, fracture cracks appear
2350–2400ms Brief stillness (tension peak)
2400ms      SHATTER — flash + fragments + prismatic ring
2400–3000ms Fragments fly outward and fade
2400–3200ms Crystal dust spray
3200–4050ms Prizes emerge from center (staggered)
3800–4700ms Count-up animations
4800–5200ms Claim button materializes
5200ms+     Idle state loops

[USER CLICKS CLAIM]
+0–350ms    Prizes compress to gem points (staggered 80ms)
+350–750ms  Gems streak to collection target
+750–1100ms Arrival bursts + final flourish
```

**Total to claim-ready: ~5.2s**
**Collection animation: ~1.1s**

---

## Technical Notes

### Performance
- All animations use `transform` and `opacity` only (GPU-accelerated)
- Fragment explosion: pre-render shard positions, use CSS custom properties for per-shard angles/distances
- Energy mote paths: compute bezier control points at spawn time, animate with `motion` keyframes
- Orbiting dust: compute positions with sin/cos at fixed intervals, 10–12 keyframe stops

### Implementation
- Crystal body and dark variant are swapped via conditional rendering based on win/no-win state
- Shards reuse 4 images with CSS rotation for variety (8–10 visible shards from 4 assets)
- Prismatic aura: CSS `conic-gradient` with `hue-rotate` animation (cheaper than image)
- Count-up: use `useMotionValue` + `useTransform` for smooth number interpolation
- Comet trail: spawn trail particles at gem position every 25ms during streak, each with 150ms fade

### Responsive Sizing
- Crystal body: 40% of container width, max 180px
- Shards: 15% of container width, max 60px
- Prize display area: 80% of container width
- All positions computed relative to container center
