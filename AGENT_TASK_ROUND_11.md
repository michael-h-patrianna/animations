# Animation Developer Task: Magnetic Field Progress Bar (Round 11)

## Task Overview
Implement BOTH CSS and Framer Motion variants of the "Magnetic Field" progress bar animation as specified in the design specification.

## Context
- This is Round 11 of 20 in the autonomous animation generation workflow
- Previous 10 animations are complete (celebration-burst, charge-surge, ripple-flow, spark-chain, velocity-surge, coin-cascade, thermal-surge, crystal-formation, liquid-flow, orbit-ring)
- This animation MUST be visually distinct from all previous animations
- You are implementing a magnetic field visualization where particles are attracted along curved field lines

## Design Specification Reference
Read the complete design specification at: `/Users/michaelhaufschild/Documents/code/animations/DESIGN_SPEC_ROUND_11.md`

## Critical Requirements

### 1. GPU-Only Properties
**ALLOWED ONLY:**
- `transform: translate()` - For particle movement
- `transform: rotate()` - For particle orientation
- `transform: scale()` - For pulse effects
- `opacity` - For fade effects

**FORBIDDEN:**
- `background-color` animation
- `filter` (blur, etc.)
- `box-shadow`
- `clip-path`
- Radial or conic gradients
- Any non-GPU-accelerated properties

**Color Changes:** Use CSS classes that toggle (no transitions on color properties)

### 2. Milestones
MUST be positioned at exactly: `[0, 0.25, 0.5, 0.75, 1.0]`
Each milestone MUST trigger a pulse effect on the particles in that region.

### 3. Animation Duration
Total duration: 2000ms (both CSS and Framer variants)

### 4. Cleanup
- CSS variant: Static DOM only, no dynamic element creation
- Framer variant: Static DOM only, no dynamic element creation
- No infinite animations (animation is finite 2000ms)
- Any useEffect timers must have cleanup functions

### 5. File Structure
Create EXACTLY these 6 files:

**CSS Variant (3 files):**
1. `/Users/michaelhaufschild/Documents/code/animations/src/components/progress/progress-bars/css/ProgressBarsMagneticField.tsx`
2. `/Users/michaelhaufschild/Documents/code/animations/src/components/progress/progress-bars/css/ProgressBarsMagneticField.css`
3. `/Users/michaelhaufschild/Documents/code/animations/src/components/progress/progress-bars/css/ProgressBarsMagneticField.meta.ts`

**Framer Variant (3 files):**
1. `/Users/michaelhaufschild/Documents/code/animations/src/components/progress/progress-bars/framer/ProgressBarsMagneticField.tsx`
2. `/Users/michaelhaufschild/Documents/code/animations/src/components/progress/progress-bars/framer/ProgressBarsMagneticField.css`
3. `/Users/michaelhaufschild/Documents/code/animations/src/components/progress/progress-bars/framer/ProgressBarsMagneticField.meta.ts`

### 6. Registry Update
Update `/Users/michaelhaufschild/Documents/code/animations/src/components/progress/progress-bars/index.ts`:
- Add metadata imports for both variants (lines 1-44 section)
- Add lazy component imports for both variants (lines 46-227 section)
- Add entries to `groupExport.framer` object (lines 237-315 section)
- Add entries to `groupExport.css` object (lines 316-394 section)

Follow the exact pattern used for existing animations in the file.

## Animation Concept Summary

### Visual Elements
- **20-24 small particles** (2-3px diameter) scattered above and below the progress bar
- Particles arranged in 4 groups corresponding to progress regions:
  - Group 1: 0-25% region (5-6 particles)
  - Group 2: 25-50% region (5-6 particles)
  - Group 3: 50-75% region (5-6 particles)
  - Group 4: 75-100% region (5-6 particles)

### Animation Behavior
1. **Initial State (0%)**: Particles scattered randomly, low opacity (0.4)
2. **Progressive Attraction**: As progress increases, particles in that region are drawn toward the bar along curved paths
3. **Curved Motion**: Simulate magnetic field lines using different easing for X and Y:
   - `translateX`: ease-out (fast start, slow end)
   - `translateY`: ease-in-out (creates arc effect)
4. **Rotation**: Particles rotate to "point" toward bar as they move
5. **Milestone Pulses**: At 25%, 50%, 75%, 100%, aligned particles pulse (scale 1.0 → 1.2-1.5 → 1.0)
6. **Opacity Changes**: Particles brighten as they align (0.4 → 0.7 → 0.85 → 0.95 → 1.0)

### Timing Choreography
- **0-500ms (0-25%)**: Group 1 particles attracted
- **500-1000ms (25-50%)**: Group 2 particles attracted + pulse at 50%
- **1000-1500ms (50-75%)**: Group 3 particles attracted + pulse at 75%
- **1500-2000ms (75-100%)**: Group 4 particles attracted + pulse at 100%

## Implementation Details

### CSS Variant Structure
```tsx
export function ProgressBarsMagneticField() {
  return (
    <div className="progress-bars-magnetic-field">
      <div className="pb-mf-container">
        <div className="pb-mf-track">
          <div className="pb-mf-fill" />
        </div>
        <div className="pb-mf-particles">
          {/* Render 20-24 particles with data-group and data-index attributes */}
        </div>
      </div>
    </div>
  )
}
```

### CSS Keyframes Needed
```css
@keyframes attractParticle {
  /* Curved movement using translate */
}

@keyframes rotateParticle {
  /* Rotation as particle aligns */
}

@keyframes pulseParticle {
  /* Scale pulse at milestones */
}

@keyframes fillProgress {
  /* Bar fill using scaleX */
}
```

### Framer Variant Structure
```tsx
export function ProgressBarsMagneticField() {
  // Array of particle configurations with initial/final positions
  const particles = [
    // 20-24 particle configs with group, delay, initial pos, final pos
  ]

  return (
    <div className="progress-bars-magnetic-field">
      <div className="pb-mf-container">
        <div className="pb-mf-track">
          <motion.div
            className="pb-mf-fill"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{ transformOrigin: "left" }}
          />
        </div>
        <div className="pb-mf-particles">
          {particles.map((particle, i) => (
            <motion.div
              key={i}
              className="pb-mf-particle"
              data-group={particle.group}
              initial={{
                x: particle.initialX,
                y: particle.initialY,
                opacity: 0.4,
                rotate: 0,
                scale: 1
              }}
              animate={{
                x: particle.finalX,
                y: particle.finalY,
                opacity: particle.finalOpacity,
                rotate: particle.finalRotate,
                scale: [1, particle.pulseScale, 1] // Pulse at milestone
              }}
              transition={{
                delay: particle.delay,
                duration: 0.8,
                ease: [0.34, 1.56, 0.64, 1], // Bounce easing
                scale: {
                  times: [0, 0.5, 1],
                  delay: particle.pulseDelay
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
```

### Metadata Template (BOTH variants)

**CSS Metadata:**
```typescript
import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'progress-bars__magnetic-field',
  title: 'Magnetic Field',
  description: 'Iron filing particles are drawn toward the progress bar along curved magnetic field lines, creating organized patterns as progress increases',
  tags: ['css', 'progress', 'particles', 'physics']
}
```

**Framer Metadata:**
```typescript
import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'progress-bars__magnetic-field-framer',
  title: 'Magnetic Field (Framer)',
  description: 'Iron filing particles are drawn toward the progress bar along curved magnetic field lines, creating organized patterns as progress increases',
  tags: ['framer', 'progress', 'particles', 'physics']
}
```

## Architecture References
MUST READ before implementing:
- `/Users/michaelhaufschild/Documents/code/animations/docs/architecture.md` - Component structure, file organization
- `/Users/michaelhaufschild/Documents/code/animations/docs/testing.md` - Testing requirements
- `/Users/michaelhaufschild/Documents/code/animations/.claude/meta/animation-short.md` - Animation principles

## Registry Integration Pattern

Study the existing registry file to understand the pattern:
`/Users/michaelhaufschild/Documents/code/animations/src/components/progress/progress-bars/index.ts`

**Key Points:**
1. Import metadata eagerly (top of file)
2. Lazy load components (after metadata imports)
3. Add to `groupExport.framer` object with exact ID
4. Add to `groupExport.css` object with exact ID
5. Follow alphabetical or logical ordering

## Quality Checklist

Before completing, verify:
- [ ] All 6 files created (.tsx, .css, .meta.ts for both variants)
- [ ] Both variants export the correct function name: `ProgressBarsMagneticField`
- [ ] Both metadata files export `metadata` constant
- [ ] CSS uses only GPU properties (transform, opacity)
- [ ] Framer uses only GPU properties (x, y, scale, rotate, opacity)
- [ ] No backgroundColor in animations (only CSS classes)
- [ ] Milestones at [0, 0.25, 0.5, 0.75, 1.0]
- [ ] Duration is 2000ms for both variants
- [ ] Static DOM only (no dynamic element creation)
- [ ] Registry updated with both variants
- [ ] TypeScript compiles without errors
- [ ] No infinite animations
- [ ] Proper cleanup (useEffect cleanup functions if needed)
- [ ] Visually distinct from previous 10 animations
- [ ] Particles follow curved paths (simulated field lines)
- [ ] Milestone pulses implemented
- [ ] Progressive opacity changes implemented
- [ ] All imports use correct paths with @ alias

## Common Pitfalls to Avoid

1. **DO NOT** animate backgroundColor - use CSS classes
2. **DO NOT** create particles dynamically during animation
3. **DO NOT** use blur, shadows, or filters
4. **DO NOT** forget to update the registry
5. **DO NOT** use radial/conic gradients
6. **DO NOT** create infinite animations
7. **DO NOT** forget transformOrigin for scaleX on fill bar
8. **DO NOT** use wrong metadata IDs (CSS: `progress-bars__magnetic-field`, Framer: `progress-bars__magnetic-field-framer`)

## Success Criteria

Implementation is complete when:
1. All 6 files exist and contain valid code
2. Registry is updated correctly
3. TypeScript compiles with no errors
4. Animation runs for 2000ms and stops
5. Particles move along curved paths
6. Milestone pulses occur at correct times
7. Only GPU properties used
8. Both variants render without errors
9. Animation is visually distinct from previous rounds

## Next Steps After Completion

After you implement this animation:
1. Report completion status
2. List all files created/modified
3. Confirm TypeScript compilation status
4. Note any issues or deviations from spec
5. The main workflow will then run code review and registry verification
