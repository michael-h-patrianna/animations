# Motion Tokens Reference

Standardized timing, easing, and spring values extracted from the production animation library. Use these tokens as starting points, then tune to the specific animation's feel.

## Cross-Platform Notes

- **Motion+React variant**: Use spring configs and tween easings directly via `motion/react` `transition` prop. These map to Moti's `withSpring`/`withTiming` on React Native.
- **CSS+React variant**: Use `cubic-bezier()` easings and `@keyframes` durations. CSS animations have no direct React Native equivalent — the CSS variant exists as a web-native reference implementation.

## Duration Tokens

| Token | Value | Use For |
|-|-|-|
| `instant` | `0.1s` | Micro-feedback (opacity flash, color change) |
| `fast` | `0.15s` | Button press, small-scale feedback |
| `normal` | `0.3s` | Default transitions, fade in/out |
| `slow` | `0.5s` | Modal entrance, panel slides |
| `dramatic` | `0.8s` | Reveal animations, celebration entrance |
| `pulse` | `1.5s` | Breathing/pulse loop duration |
| `pulseCircle` | `2.2s` | Expanding ring pulse loop |
| `pulseWave` | `2.0s` | Wave pulse loop |
| `extended` | `3.0s` | Ambient float, slow idle loops |

## Easing Curves

### Standard Easings (CSS / motion)

| Name | Value | Feel | Use For |
|-|-|-|-|
| `standard` | `cubic-bezier(0.4, 0, 0.6, 1)` | Balanced in+out | Default for most transitions |
| `easeOut` | `cubic-bezier(0, 0, 0.2, 1)` | Fast start, gentle stop | Entrances, elements arriving |
| `easeIn` | `cubic-bezier(0.4, 0, 1, 1)` | Gentle start, fast end | Exits, elements leaving |
| `easeInOut` | `cubic-bezier(0.4, 0, 0.2, 1)` | Gentle start + stop | Continuous loops, idle motion |

### Spring Configs (motion/react)

Springs produce natural motion without fixed duration. Use `type: "spring"` in motion transitions.

| Feel | Config | Use For |
|-|-|-|
| Gentle | `{ stiffness: 120, damping: 14 }` | Soft entrance, modal popup |
| Snappy | `{ stiffness: 260, damping: 20 }` | Quick pop, button feedback |
| Bouncy | `{ stiffness: 300, damping: 10 }` | Playful overshoot |
| Heavy | `{ stiffness: 80, damping: 20 }` | Large panels, heavy elements |
| Elastic | `{ stiffness: 400, damping: 8 }` | Extreme bounce, jello effect |

### Usage in motion/react

```tsx
// Spring transition
<m.div
  animate={{ scale: 1 }}
  transition={{ type: "spring", stiffness: 260, damping: 20 }}
/>

// Tween with easing
<m.div
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
/>
```

### Usage in CSS @keyframes

```css
.entering {
  animation: fadeIn 0.3s cubic-bezier(0, 0, 0.2, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}
```

## Overlay Opacity Tokens

| Level | Value | Use For |
|-|-|-|
| `subtle` | `0.4` | Light overlay, hint of backdrop |
| `standard` | `0.68` | Default modal backdrop |
| `strong` | `0.85` | High-emphasis modal, focus overlay |

## Stagger Patterns

Stagger creates sequential entrance for grouped elements.

| Pattern | Delay Per Item | Use For |
|-|-|-|
| Fast cascade | `0.03s` | List items, grid tiles (many items) |
| Standard stagger | `0.06s` | Card groups, button clusters |
| Dramatic stagger | `0.12s` | Reveal sequences, celebration elements |
| Wave stagger | `0.08s` + sin offset | Text characters, organic-feeling sequences |

### Usage in motion/react

```tsx
<m.div
  variants={{
    visible: { transition: { staggerChildren: 0.06 } }
  }}
  animate="visible"
>
  {items.map(item => (
    <m.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    />
  ))}
</m.div>
```

## Loop Transition Factory

For repeating animations (ambient motion, continuous indicators):

```tsx
const loopTransition = {
  duration: 1.5,
  ease: [0.4, 0, 0.6, 1],
  repeat: Infinity,
  repeatType: "loop" as const,
}

<m.div
  animate={{ scale: [1, 1.05, 1] }}
  transition={loopTransition}
/>
```

## Keyframe Array Patterns

Common multi-step keyframe arrays from the reference library:

| Pattern | Array | Feel |
|-|-|-|
| Gentle pulse | `[1, 1.05, 1]` | Breathing, alive indicator |
| Pop entrance | `[0, 1.15, 1]` | Overshoot then settle |
| Shake | `[0, -5, 5, -3, 3, 0]` | Error/attention feedback (rotation degrees) |
| Heartbeat | `[1, 1.15, 1, 1.1, 1]` | Double-beat pulse |
| Rubber band | `[1, 0.9, 1.1, 0.95, 1]` | Elastic stretch and settle |
| Jitter | `[1, 0.9, 1.15, 1.15, 0.95, 1]` | Playful energy |
