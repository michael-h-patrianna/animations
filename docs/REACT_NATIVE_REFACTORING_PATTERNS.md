# React Native Refactoring Patterns

This document outlines the refactoring patterns applied to make animations more compatible with React Native, along with guidelines for future development.

## Table of Contents

1. [DOM Manipulation → React State](#dom-manipulation--react-state)
2. [Pseudo-elements → React Components](#pseudo-elements--react-components)
3. [Web Animation API → CSS Animations](#web-animation-api--css-animations)
4. [Complete Refactoring Examples](#complete-refactoring-examples)
5. [React Native Translation Patterns](#react-native-translation-patterns)

## DOM Manipulation → React State

### Problem

Direct DOM manipulation using `document.createElement()` and `querySelector()` doesn't exist in React Native.

### Before (Web-only)

```tsx
useEffect(() => {
  const container = containerRef.current
  const particle = document.createElement('div')
  particle.style.cssText = `...`
  container.appendChild(particle)
}, [])
```

### After (RN-compatible)

```tsx
const [particles, setParticles] = useState<Particle[]>([])

useEffect(() => {
  setParticles((prev) => [...prev, { id: Date.now(), ...props }])
}, [])

return (
  <>
    {particles.map((particle) => (
      <div key={particle.id} style={particleStyles} />
    ))}
  </>
)
```

### Benefits

- Works identically in React Native
- Better React patterns (declarative vs imperative)
- Easier to test and debug
- State can be managed and tracked

## Pseudo-elements → React Components

### Problem

CSS pseudo-elements (`::before`, `::after`) don't exist in React Native.

### Before (Web-only)

```css
.coin::before {
  content: '$';
  position: absolute;
  /* styling */
}
```

### After (RN-compatible)

```tsx
const Coin = () => (
  <div className="coin">
    <span className="coin-symbol">$</span>
  </div>
)
```

### React Native equivalent

```tsx
const Coin = () => (
  <View style={styles.coin}>
    <Text style={styles.coinSymbol}>$</Text>
  </View>
)
```

## Web Animation API → CSS Animations

### Problem

The `.animate()` method doesn't exist in React Native. CSS animations are easier to translate to RN's Animated API.

### Before (Web-only)

```tsx
const animation = element.animate([{ transform: 'scale(0)' }, { transform: 'scale(1)' }], {
  duration: 1000,
  easing: 'ease-out',
})
```

### After (RN-compatible)

```tsx
// Using CSS animations
<div style={{
  animation: isAnimating ? 'scale-up 1s ease-out forwards' : 'none'
}} />

// CSS
@keyframes scale-up {
  from { transform: scale(0); }
  to { transform: scale(1); }
}
```

### React Native Translation

```tsx
// React Native with Reanimated
const scale = useSharedValue(0)

useEffect(() => {
  scale.value = withTiming(1, {
    duration: 1000,
    easing: Easing.out(Easing.ease),
  })
}, [])

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}))
```

## Complete Refactoring Examples

### Example 1: Progress Bar Spark Effect

**Original Pattern:**

- Created DOM elements dynamically
- Used `.animate()` for animations
- Managed particles with intervals

**Refactored Pattern:**

```tsx
interface Particle {
  id: number
  left: number
  animating: boolean
}

export function ProgressSpark() {
  const [isAnimating, setIsAnimating] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    setIsAnimating(true)

    // Create particles over time
    const interval = setInterval(() => {
      setParticles((prev) => {
        if (prev.length >= MAX_PARTICLES) {
          clearInterval(interval)
          return prev
        }
        return [...prev, createParticle()]
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      {particles.map((particle) => (
        <AnimatedParticle key={particle.id} {...particle} />
      ))}
    </div>
  )
}
```

### Example 2: Coin Animation

**Original Pattern:**

- Used `::before` for dollar sign
- Created coins with DOM manipulation
- Animated with `.animate()`

**Refactored Pattern:**

```tsx
const AnimatedCoin = ({ delay }: { delay: number }) => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), 10)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className="coin"
      style={{
        animation: isAnimating ? `coin-motion 2s ${delay}ms ease-out forwards` : 'none',
      }}
    >
      <CoinSymbol />
    </div>
  )
}

const CoinSymbol = () => <span className="coin-symbol">$</span>
```

## React Native Translation Patterns

### Pattern 1: Particle Systems

**Web (Refactored):**

```tsx
const [particles, setParticles] = useState([])
// Render particles with CSS animations
```

**React Native:**

```tsx
import { MotiView } from 'moti'

const Particle = ({ delay, position }) => (
  <MotiView
    from={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0 }}
    transition={{ delay }}
    style={{ position: 'absolute', ...position }}
  />
)
```

### Pattern 2: Sequential Animations

**Web (Refactored):**

```tsx
<div
  style={{
    animation: 'sequence 2s forwards',
    animationDelay: `${index * 100}ms`,
  }}
/>
```

**React Native:**

```tsx
const translateY = useSharedValue(0)

useEffect(() => {
  translateY.value = withDelay(index * 100, withSpring(-50))
}, [])
```

### Pattern 3: Complex Shapes

**Web (Refactored):**

```tsx
// Instead of clip-path
<div className="diamond-shape">
  <div className="diamond-top" />
  <div className="diamond-bottom" />
</div>
```

**React Native:**

```tsx
import Svg, { Polygon } from 'react-native-svg'

const Diamond = () => (
  <Svg>
    <Polygon points="50,0 100,50 50,100 0,50" fill="#gold" />
  </Svg>
)
```

## Best Practices

### 1. Component-Based Animation Elements

- Create reusable components for animated elements
- Pass animation props rather than hard-coding
- Use composition over complex single components

### 2. State-Driven Animations

- Use React state to control animation phases
- Avoid imperative animation control
- Let React handle the rendering

### 3. CSS Animation Preference

- Use CSS animations over JavaScript when possible
- They translate more easily to RN's Animated API
- Better performance on web

### 4. Avoid Web-Only APIs

- No `window` or `document` references
- No mouse-specific events
- No viewport units (vh, vw)
- No CSS variables (use JS constants)

### 5. Testing Compatibility

```tsx
// Create a simple RN compatibility checker
const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative'

// Use platform-specific code when necessary
const AnimatedComponent = isReactNative ? ReactNativeVersion : WebVersion
```

## Migration Checklist

When refactoring an animation for RN compatibility:

- [ ] Replace all `document.createElement()` with React state
- [ ] Convert `querySelector()` to refs or state
- [ ] Replace `::before/::after` with actual components
- [ ] Convert `.animate()` to CSS animations or state-driven animations
- [ ] Remove `filter:` CSS properties (blur, brightness, etc.)
- [ ] Replace `vh/vw` with percentages or fixed values
- [ ] Convert CSS variables to JS constants
- [ ] Test animation triggers and resets
- [ ] Ensure animations work with component remounting
- [ ] Document any platform-specific requirements

## Performance Considerations

### Web

- CSS animations use GPU acceleration
- Minimize reflows and repaints
- Use `transform` and `opacity` for best performance

### React Native

- Use `useNativeDriver: true` when possible
- Avoid animating layout properties
- Batch animations with `Animated.parallel()`
- Use `InteractionManager` for heavy animations

## Conclusion

These refactoring patterns make animations:

1. **Portable** - Easier to translate between web and React Native
2. **Maintainable** - Following React best practices
3. **Testable** - State-driven animations are easier to test
4. **Performant** - Using platform-optimized animation methods

The goal is not to make web code that runs in React Native, but to create patterns that are conceptually similar and easily translatable between platforms.
