# Animation Design Principles

## User Feedback (2026-02-22)
- Each animation must have a UNIQUE visual identity — not just "confetti with different movement patterns"
- Use /animAdd skill instructions for designing better, more creative animations
- The *mechanism* matters more than the particle type: how particles appear, move, and interact

## Uniqueness Matrix (Modal Celebrations)
Each animation must differ in its CORE MECHANISM, not just trajectory:
- **Burst**: instant radial explosion from center, everything at once
- **Rain**: top-down cascade, gravity-dominant
- **Spiral**: continuous vortex/tornado orbital movement  
- **Pulse**: RHYTHMIC shockwaves — particles spawn AT wave radius, not from center; temporal rhythm (boom, boom, BOOM) is the key feature
- **FireworksTriple**: 3 offset burst positions with directional rays + trailing confetti
- **FireworksRing**: (TBD — must differ from Triple)

## Technical Lessons
- Motion (Framer) interpolates x,y LINEARLY — curved paths need 24+ stops
- CSS rotate()+translateX() natively traces curves — no dense sampling needed
- For straight radial + gravity paths, 10-12 stops suffice
- Always use `ease: 'linear'` when easing is baked into computed keyframe values
- Ray elements use transformOrigin: '50% 100%' with scaleY for extension from center
