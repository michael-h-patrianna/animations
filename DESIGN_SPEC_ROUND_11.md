# Progress Bar Animation - Round 11: Magnetic Field

## Animation Concept

**Title:** Magnetic Field
**ID:** `progress-bars__magnetic-field`
**Description:** Iron filing particles are drawn toward the progress bar along curved magnetic field lines, creating organized patterns as progress increases

## Visual Elements

### Core Components

1. **Progress Bar Container**
   - Standard progress bar background
   - Fill bar that grows from 0% to 100%
   - Height: 12px, rounded corners

2. **Magnetic Particles (20-24 particles)**
   - Small circular particles (2-3px diameter)
   - Distributed evenly above and below the bar
   - Initial state: Scattered in random positions around the bar
   - Final state: Aligned closely to the bar along field lines
   - Color: Starts muted, brightens when aligned (via CSS classes)

3. **Particle Groups**
   - Group 1 (0-25%): 5-6 particles → Activate at 0-25% progress
   - Group 2 (25-50%): 5-6 particles → Activate at 25-50% progress
   - Group 3 (50-75%): 5-6 particles → Activate at 50-75% progress
   - Group 4 (75-100%): 5-6 particles → Activate at 75-100% progress

## Milestone Interactions

### Milestone Positions: [0, 0.25, 0.5, 0.75, 1.0]

**0% (Start)**
- All particles in scattered positions
- Minimal attraction, particles mostly static
- Low opacity (0.4)

**25% (First Quarter)**
- Group 1 particles attracted to bar
- Particles follow curved paths (simulated field lines)
- Brief pulse effect (scale 1.0 → 1.2 → 1.0)
- Opacity increases to 0.7 for aligned particles

**50% (Halfway)**
- Groups 1 and 2 aligned
- Field lines become more pronounced
- Medium pulse effect (scale 1.0 → 1.3 → 1.0)
- Opacity increases to 0.85 for aligned particles

**75% (Three Quarters)**
- Groups 1, 2, and 3 aligned
- Field density increases
- Strong pulse effect (scale 1.0 → 1.4 → 1.0)
- Opacity increases to 0.95 for aligned particles

**100% (Complete)**
- All particles perfectly aligned
- Final convergence pulse (scale 1.0 → 1.5 → 1.0)
- All particles at full opacity (1.0)
- Brief overshoot and settle animation

## Animation Choreography

### Timing
- **Total Duration:** 2000ms
- **Phase 1 (0-500ms):** Group 1 attraction
- **Phase 2 (500-1000ms):** Group 2 attraction + 50% pulse
- **Phase 3 (1000-1500ms):** Group 3 attraction + 75% pulse
- **Phase 4 (1500-2000ms):** Group 4 attraction + 100% pulse

### Particle Movement
- **Curved Paths:** Simulated using different easing for X and Y
  - `translateX`: ease-out (fast start, slow end)
  - `translateY`: ease-in-out (creates arc effect)
- **Rotation:** Particles rotate to "point" toward the bar as they move
- **Stagger:** Each particle within a group has slight delay (50-100ms offset)

### Pulse Effects
- Applied to particle groups at milestone moments
- Brief scale transform: `scale(1) → scale(1.2-1.5) → scale(1)`
- Duration: 300ms
- Timing: cubic-bezier(0.34, 1.56, 0.64, 1) for bounce effect

## GPU-Accelerated Properties Only

### Allowed Properties
- `transform: translate()` - Particle movement
- `transform: rotate()` - Particle orientation
- `transform: scale()` - Pulse effects
- `opacity` - Fade in/out

### Color Changes (via CSS classes, NOT animated)
- Particles have class-based color states
- `.particle-scattered` - Muted color (#888)
- `.particle-aligned` - Bright color (#00f)
- Classes toggle based on progress, no transition on color

## Implementation Requirements

### CSS Variant

**Structure:**
```tsx
<div className="progress-bars-magnetic-field">
  <div className="pb-mf-container">
    <div className="pb-mf-track">
      <div className="pb-mf-fill" />
    </div>
    <div className="pb-mf-particles">
      {/* 20-24 particle divs */}
      <div className="pb-mf-particle" data-group="1" data-index="0" />
      {/* ... */}
    </div>
  </div>
</div>
```

**CSS Keyframes:**
- `@keyframes attractParticle` - Curved movement using translate
- `@keyframes rotateParticle` - Rotation animation
- `@keyframes pulseParticle` - Scale pulse at milestones
- `@keyframes fillProgress` - Bar fill animation

**Animation Application:**
- Particles use `animation` with calculated delays
- Fill bar animates width using transform: scaleX()
- Particles grouped by data-group attribute
- Each group activates at appropriate time

### Framer Motion Variant

**Structure:**
```tsx
<motion.div className="progress-bars-magnetic-field">
  <div className="pb-mf-container">
    <div className="pb-mf-track">
      <motion.div
        className="pb-mf-fill"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
    </div>
    <div className="pb-mf-particles">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="pb-mf-particle"
          initial={particle.initialPos}
          animate={particle.finalPos}
          transition={{
            delay: particle.delay,
            duration: 0.8,
            ease: [0.34, 1.56, 0.64, 1]
          }}
        />
      ))}
    </div>
  </div>
</motion.div>
```

**Motion Values:**
- Use `useMotionValue` for progress tracking
- Use `useTransform` to map progress to particle states
- Spring physics for pulse effects
- Stagger using calculated delays

## Cleanup Requirements

### CSS Variant
- Static DOM elements only (particles rendered in JSX)
- Animations are finite (2000ms)
- No infinite loops
- Component remount restarts animations automatically
- **No cleanup needed**

### Framer Variant
- Static DOM elements (particles mapped from array)
- No dynamic DOM creation
- No infinite animations
- Motion values reset on remount
- **Minimal cleanup:** Any useEffect timers should return cleanup function

## Files to Create

### CSS Variant
1. `/Users/michaelhaufschild/Documents/code/animations/src/components/progress/progress-bars/css/ProgressBarsMagneticField.tsx`
2. `/Users/michaelhaufschild/Documents/code/animations/src/components/progress/progress-bars/css/ProgressBarsMagneticField.css`
3. `/Users/michaelhaufschild/Documents/code/animations/src/components/progress/progress-bars/css/ProgressBarsMagneticField.meta.ts`

### Framer Variant
1. `/Users/michaelhaufschild/Documents/code/animations/src/components/progress/progress-bars/framer/ProgressBarsMagneticField.tsx`
2. `/Users/michaelhaufschild/Documents/code/animations/src/components/progress/progress-bars/framer/ProgressBarsMagneticField.css`
3. `/Users/michaelhaufschild/Documents/code/animations/src/components/progress/progress-bars/framer/ProgressBarsMagneticField.meta.ts`

### Registry Update
- Update `/Users/michaelhaufschild/Documents/code/animations/src/components/progress/progress-bars/index.ts`
- Import both variants
- Export both in groupExport

## Metadata

### CSS Variant
```typescript
export const metadata: AnimationMetadata = {
  id: 'progress-bars__magnetic-field',
  title: 'Magnetic Field',
  description: 'Iron filing particles are drawn toward the progress bar along curved magnetic field lines, creating organized patterns as progress increases',
  tags: ['css', 'progress', 'particles', 'physics']
};
```

### Framer Variant
```typescript
export const metadata: AnimationMetadata = {
  id: 'progress-bars__magnetic-field-framer',
  title: 'Magnetic Field (Framer)',
  description: 'Iron filing particles are drawn toward the progress bar along curved magnetic field lines, creating organized patterns as progress increases',
  tags: ['framer', 'progress', 'particles', 'physics']
};
```

## Distinctiveness from Previous Animations

This animation is unique because:

1. **Curved attraction paths** - Not radial (celebration-burst, crystal-formation), not linear (spark-chain, velocity-surge)
2. **Field line organization** - Particles move from chaos to order along specific curved paths
3. **Physics-based attraction** - Simulates magnetic field behavior
4. **Distributed to aligned** - Unlike orbital (orbit-ring) which maintains circular paths
5. **Not wave-based** - Different from ripple-flow, thermal-surge, charge-surge
6. **Not morphing** - Different from liquid-flow's organic shapes
7. **Not trajectory-based** - Different from coin-cascade's parabolic arcs

## Critical Constraints

1. **GPU Properties ONLY** - transform and opacity only
2. **NO backgroundColor animation** - Use CSS classes for color changes
3. **Milestones at [0, 0.25, 0.5, 0.75, 1.0]** - Exact positions required
4. **No infinite animations** - 2000ms finite duration
5. **Proper cleanup** - Clean up any dynamic elements or timers
6. **Static DOM** - Pre-render particles, don't create dynamically during animation

## Success Criteria

- [ ] Both CSS and Framer variants implemented
- [ ] All 6 files created (.tsx, .css, .meta.ts for each variant)
- [ ] Registry updated with both imports and exports
- [ ] Milestones at correct positions [0, 0.25, 0.5, 0.75, 1.0]
- [ ] Only GPU properties used (transform, opacity)
- [ ] No backgroundColor in animations
- [ ] Proper cleanup implemented
- [ ] TypeScript compiles without errors
- [ ] Animation visually distinct from previous 10 rounds
- [ ] Code review passes all checks
