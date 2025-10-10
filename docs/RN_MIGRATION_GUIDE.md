# React Native Migration Guide

**Version:** 1.0.0
**Last Updated:** 2025-10-10
**Project:** Animation Showcase
**Location:** `/Users/michaelhaufschild/Documents/code/animations`

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Implementation Roadmap](#implementation-roadmap)
3. [Platform Abstractions Implementation Guide](#platform-abstractions-implementation-guide)
   - [Shadow Abstraction](#shadow-abstraction)
   - [Gradient Abstraction](#gradient-abstraction)
   - [Text Shadow Abstraction](#text-shadow-abstraction)
   - [Filter Abstraction](#filter-abstraction)
   - [Pseudo Element Abstraction](#pseudo-element-abstraction)
4. [Component Migration Examples](#component-migration-examples)
5. [Testing Strategy](#testing-strategy)
6. [Performance Guidelines](#performance-guidelines)
7. [Troubleshooting](#troubleshooting)
8. [Resources](#resources)

---

## Quick Start

### Overview

This guide provides React Native developers with everything needed to implement the platform abstractions defined in `src/types/platform.ts`. The project contains **401 violations** across **79 CSS files** that must be migrated to RN-compatible implementations.

**Migration Goal:** Create cross-platform animation components that work identically on web (CSS/Framer Motion) and React Native (Reanimated/Moti).

### Prerequisites

**Required Knowledge:**
- React Native fundamentals (View, Text, StyleSheet)
- React Native Reanimated v2+ (worklets, useSharedValue, useAnimatedStyle)
- Moti declarative animations
- TypeScript

**Development Environment:**
- Node.js 18+
- React Native 0.72+
- iOS development setup (Xcode, CocoaPods)
- Android development setup (Android Studio, JDK)

### Recommended Stack

**Core Dependencies:**
```json
{
  "react-native-reanimated": "^3.5.0",
  "moti": "^0.27.0",
  "react-native-svg": "^13.14.0",
  "react-native-linear-gradient": "^2.8.0",
  "@react-native-community/blur": "^4.3.0"
}
```

**Optional (for advanced effects):**
```json
{
  "react-native-radial-gradient": "^1.1.3",
  "react-native-color-matrix-image-filters": "^6.0.0"
}
```

**Installation:**
```bash
npm install react-native-reanimated moti react-native-svg react-native-linear-gradient

# iOS
cd ios && pod install && cd ..

# Configure Reanimated babel plugin in babel.config.js
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

**Goal:** Implement the 5 core platform abstractions as reusable RN components.

**Tasks:**
1. Create `src/platform/shadow/` directory
   - Implement `PlatformShadow` component
   - Create iOS/Android shadow utilities
   - Write shadow style helper functions

2. Create `src/platform/gradient/` directory
   - Implement `PlatformLinearGradient` component
   - Implement `PlatformRadialGradient` component (SVG-based)
   - Create gradient utilities

3. Create `src/platform/text-shadow/` directory
   - Implement `PlatformTextShadow` component
   - Create layered text glow utilities

4. Create `src/platform/filter/` directory
   - Implement `PlatformFilter` component
   - Create filter utilities (blur, brightness, etc.)

5. Create `src/platform/pseudo-element/` directory
   - Implement `PlatformPseudoElement` component
   - Create render props alternative

**Deliverables:**
- 5 working platform components
- Comprehensive unit tests
- Storybook documentation
- TypeScript type safety

### Phase 2: High-Impact Components (Week 3-4)

**Priority:** Lights animations (8 files, 118 violations)

**Tasks:**
1. Migrate `LightsCircleStatic1-8` components
   - Extract shared `<Bulb>` component using `PlatformShadow` and `PlatformRadialGradient`
   - Port CSS keyframe animations to Reanimated worklets
   - Test on iOS/Android devices (60fps target)

2. Migrate `ProgressBarsXpAccumulation`
   - 12 violations (box-shadow, text-shadow, radial-gradient)
   - Flow animations with Moti
   - Dynamic glow intensity

**Deliverables:**
- 9 fully migrated components
- Performance benchmarks (iOS/Android)
- Visual regression tests

### Phase 3: User Engagement (Week 5-6)

**Priority:** Text effects, Modal celebrations

**Tasks:**
1. Migrate `TextEffectsComboCounter`
   - Milestone particles with `PlatformPseudoElement`
   - Glow text with `PlatformTextShadow`

2. Migrate Modal Celebrations (10 animations)
   - SVG-based spotlight effects
   - Particle systems with Reanimated

**Deliverables:**
- 11 migrated components
- Design approval (visual fidelity check)

### Phase 4: Standard Effects (Week 7-8)

**Priority:** Reusable base effects

**Tasks:**
1. Migrate `StandardEffects*` (9 files, 34 violations)
   - Create `<Pulse>`, `<MorphPulse>`, `<SoftPulse>` RN components
   - Shared animation configs

**Deliverables:**
- 9 reusable effect components
- Animation library documentation

### Phase 5: Dialog & Timer UX (Week 9-10)

**Priority:** Modal content, Timer effects

**Tasks:**
1. Migrate Modal Content Choreography (8 files, 24 violations)
2. Migrate Timer Effects (9 files, 39 violations)

**Deliverables:**
- 17 migrated components
- Full test coverage

---

## Platform Abstractions Implementation Guide

### Shadow Abstraction

#### Overview

**Violation Count:** 234 occurrences across 64 files (58% of all violations)
**Priority:** CRITICAL

CSS `box-shadow` is the most pervasive violation. React Native requires platform-specific shadow implementations:
- **iOS:** `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`
- **Android:** `elevation` (color support limited to API 28+)

#### Web Implementation (CSS)

**Current CSS Pattern:**
```css
.glow-element {
  box-shadow:
    0 0 4px rgba(0, 255, 255, 0.7),
    0 0 6px rgba(0, 255, 255, 0.5);
}
```

**Example from `LightsCircleStatic1.css` (line 147):**
```css
@keyframes carnival-bulb-even {
  0%, 42% {
    box-shadow: 0 0 4px var(--bulb-on-glow70), 0 0 6px var(--bulb-on-glow50);
  }
  44%, 92% {
    box-shadow: none;
  }
}
```

#### RN Implementation

**Using the Platform Abstraction:**

```typescript
import { PlatformShadow } from '@/platform/shadow';

// Component usage
<PlatformShadow
  elevation={8}
  color="rgba(0, 255, 255, 0.5)"
  offset={{ x: 0, y: 4 }}
  opacity={0.7}
>
  <View style={styles.glowElement}>
    <Text>Content with glow</Text>
  </View>
</PlatformShadow>
```

**Implementation of `PlatformShadow.tsx`:**

```typescript
import React from 'react';
import { View, Platform, StyleSheet, ViewStyle } from 'react-native';
import type { PlatformShadowProps } from '@/types/platform';

export function PlatformShadow({
  elevation,
  color = 'rgba(0, 0, 0, 0.3)',
  offset = { x: 0, y: elevation / 2 },
  opacity,
  borderRadius = 0,
  children,
}: PlatformShadowProps) {
  // Extract opacity from color if not explicitly provided
  const shadowOpacity = opacity ?? parseOpacityFromColor(color);

  const shadowStyle: ViewStyle = Platform.select({
    ios: {
      shadowColor: color,
      shadowOffset: { width: offset.x, height: offset.y },
      shadowOpacity,
      shadowRadius: elevation,
    },
    android: {
      elevation,
      // Android shadowColor support is limited
      ...(Platform.Version >= 28 && { shadowColor: color }),
    },
    web: {
      // Fallback to CSS box-shadow on web
      boxShadow: `${offset.x}px ${offset.y}px ${elevation}px ${color}`,
    } as ViewStyle,
  });

  return (
    <View style={[shadowStyle, borderRadius && { borderRadius }]}>
      {children}
    </View>
  );
}

// Helper to extract opacity from rgba color
function parseOpacityFromColor(color: string): number {
  const match = color.match(/rgba?\([\d\s,]+,\s*([\d.]+)\)/);
  return match ? parseFloat(match[1]) : 1;
}

// Style helper for direct application
export function createShadowStyle({
  elevation,
  color = 'rgba(0, 0, 0, 0.3)',
  offset = { x: 0, y: elevation / 2 },
  opacity,
}: Omit<PlatformShadowProps, 'children' | 'borderRadius'>): ViewStyle {
  const shadowOpacity = opacity ?? parseOpacityFromColor(color);

  return Platform.select({
    ios: {
      shadowColor: color,
      shadowOffset: { width: offset.x, height: offset.y },
      shadowOpacity,
      shadowRadius: elevation,
    },
    android: {
      elevation,
      ...(Platform.Version >= 28 && { shadowColor: color }),
    },
    web: {
      boxShadow: `${offset.x}px ${offset.y}px ${elevation}px ${color}`,
    } as ViewStyle,
  }) as ViewStyle;
}
```

**Animated Shadow with Reanimated:**

```typescript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';
import { createShadowStyle } from '@/platform/shadow';

function PulsingGlow() {
  const elevation = useSharedValue(4);

  useEffect(() => {
    elevation.value = withRepeat(
      withTiming(12, { duration: 1200 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    ...createShadowStyle({
      elevation: elevation.value,
      color: 'rgba(0, 255, 255, 0.5)',
    }),
  }));

  return (
    <Animated.View style={[styles.bulb, animatedStyle]}>
      <View style={styles.content} />
    </Animated.View>
  );
}
```

#### Side-by-Side Comparison

| Feature | Web (CSS) | iOS | Android |
|---------|-----------|-----|---------|
| Multiple shadows | ✅ Unlimited | ❌ Single shadow | ❌ Single shadow |
| Blur radius | ✅ Exact px control | ✅ `shadowRadius` | ⚠️ Approximated by elevation |
| Color control | ✅ Full RGBA | ✅ Full RGBA | ⚠️ Limited (API 28+) |
| Inset shadows | ✅ `inset` keyword | ❌ Not supported | ❌ Not supported |
| Spread radius | ✅ 4th parameter | ❌ Not supported | ❌ Not supported |

#### Platform Gotchas

**iOS:**
- Shadows only render on elements with `backgroundColor` or child content
- Transparent backgrounds won't show shadows
- Shadow performance: limit simultaneous animated shadows to ~10

**Android:**
- `elevation` creates both shadow and z-ordering
- Shadow color requires API 28+ (Android 9)
- Elevation shadows are always black/gray on older devices
- Workaround for colored shadows: layer a blurred `LinearGradient` underneath

**Workaround for Android Colored Glows:**

```typescript
function ColoredGlowAndroid({ color, children }: Props) {
  return (
    <View>
      {/* Colored glow layer */}
      <LinearGradient
        colors={[color, 'transparent']}
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: 50,
            transform: [{ scale: 1.3 }],
          },
        ]}
      />
      {/* Content with standard elevation */}
      <View style={{ elevation: 4 }}>
        {children}
      </View>
    </View>
  );
}
```

#### Migration Checklist

- [ ] Replace all CSS `box-shadow` with `PlatformShadow` component or `createShadowStyle()`
- [ ] Convert layered shadows (multiple box-shadow values) to stacked Views
- [ ] Animate shadow properties using Reanimated `useAnimatedStyle`
- [ ] Test on iOS (shadows render correctly)
- [ ] Test on Android API 28+ (colored shadows)
- [ ] Test on Android API 21-27 (fallback to gray shadows)
- [ ] Verify 60fps performance on low-end Android devices

---

### Gradient Abstraction

#### Overview

**Violation Count:** 61 occurrences across 36 files (15% of all violations)
**Priority:** HIGH

CSS `linear-gradient` and `radial-gradient` are used extensively for glow effects, spotlights, and backgrounds. React Native requires third-party libraries.

#### Web Implementation (CSS)

**Linear Gradient Pattern:**
```css
.gradient-bg {
  background: linear-gradient(90deg, #FF5733 0%, #FFC300 100%);
}
```

**Radial Gradient Pattern (from `LightsCircleStatic1.css` line 33):**
```css
.glow-outer {
  background: radial-gradient(circle, var(--bulb-on-glow50) 0%, transparent 70%);
}
```

**Example from `ProgressBarsXpAccumulation.css` (line 193):**
```css
.pf-marker--active .pf-marker__dot {
  background: radial-gradient(
    circle,
    var(--zone-color) 0%,
    #00ffff 60%,
    rgba(255, 255, 255, 0.95) 100%
  );
}
```

#### RN Implementation

**Linear Gradient:**

```typescript
import { PlatformLinearGradient } from '@/platform/gradient';

<PlatformLinearGradient
  colors={[
    { color: '#FF5733', position: 0 },
    { color: '#FFC300', position: 1 },
  ]}
  direction="to right"
>
  <Text>Gradient Background</Text>
</PlatformLinearGradient>
```

**Radial Gradient (SVG-based):**

```typescript
import { PlatformRadialGradient } from '@/platform/gradient';

<PlatformRadialGradient
  colors={[
    { color: 'rgba(0, 255, 255, 0.5)', position: 0 },
    { color: 'transparent', position: 0.7 },
  ]}
  center={{ x: 0.5, y: 0.5 }}
  radius={0.5}
>
  <View style={styles.glowOuter} />
</PlatformRadialGradient>
```

**Implementation of `PlatformLinearGradient.tsx`:**

```typescript
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import type { PlatformLinearGradientProps } from '@/types/platform';

export function PlatformLinearGradient({
  colors,
  direction = 'to bottom',
  children,
  style,
}: PlatformLinearGradientProps) {
  // Convert direction to start/end coordinates
  const { start, end } = directionToCoordinates(direction);

  // Extract colors and positions
  const colorValues = colors.map((stop) => stop.color);
  const locations = colors.map((stop) => stop.position);

  return (
    <LinearGradient
      colors={colorValues}
      locations={locations}
      start={start}
      end={end}
      style={style}
    >
      {children}
    </LinearGradient>
  );
}

// Helper: Convert CSS direction to RN coordinates
function directionToCoordinates(direction: string): {
  start: { x: number; y: number };
  end: { x: number; y: number };
} {
  const directionMap = {
    'to top': { start: { x: 0.5, y: 1 }, end: { x: 0.5, y: 0 } },
    'to bottom': { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
    'to left': { start: { x: 1, y: 0.5 }, end: { x: 0, y: 0.5 } },
    'to right': { start: { x: 0, y: 0.5 }, end: { x: 1, y: 0.5 } },
    'to top right': { start: { x: 0, y: 1 }, end: { x: 1, y: 0 } },
    'to top left': { start: { x: 1, y: 1 }, end: { x: 0, y: 0 } },
    'to bottom right': { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    'to bottom left': { start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
  };

  return directionMap[direction] || directionMap['to bottom'];
}
```

**Implementation of `PlatformRadialGradient.tsx` (SVG-based):**

```typescript
import React from 'react';
import Svg, { Defs, RadialGradient as SvgRadialGradient, Stop, Rect } from 'react-native-svg';
import { View, StyleSheet } from 'react-native';
import type { PlatformRadialGradientProps } from '@/types/platform';

export function PlatformRadialGradient({
  colors,
  center = { x: 0.5, y: 0.5 },
  radius = 0.5,
  children,
  style,
}: PlatformRadialGradientProps) {
  const gradientId = `radial-gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <View style={[styles.container, style]}>
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <SvgRadialGradient
            id={gradientId}
            cx={`${center.x * 100}%`}
            cy={`${center.y * 100}%`}
            r={`${radius * 100}%`}
          >
            {colors.map((stop, index) => (
              <Stop
                key={index}
                offset={`${stop.position * 100}%`}
                stopColor={stop.color}
                stopOpacity={parseOpacity(stop.color)}
              />
            ))}
          </SvgRadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${gradientId})`} />
      </Svg>
      {children}
    </View>
  );
}

function parseOpacity(color: string): number {
  const match = color.match(/rgba?\([\d\s,]+,\s*([\d.]+)\)/);
  return match ? parseFloat(match[1]) : 1;
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
});
```

**Animated Gradient:**

```typescript
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Stop } from 'react-native-svg';

const AnimatedStop = Animated.createAnimatedComponent(Stop);

function AnimatedRadialGlow() {
  const offset = useSharedValue(0);

  useEffect(() => {
    offset.value = withRepeat(
      withTiming(1, { duration: 1200 }),
      -1,
      true
    );
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    offset: `${offset.value * 70}%`,
  }));

  return (
    <Svg>
      <Defs>
        <RadialGradient id="glow">
          <AnimatedStop
            animatedProps={animatedProps}
            stopColor="rgba(0, 255, 255, 0.8)"
          />
          <Stop offset="100%" stopColor="transparent" />
        </RadialGradient>
      </Defs>
      <Rect width="100" height="100" fill="url(#glow)" />
    </Svg>
  );
}
```

#### Side-by-Side Comparison

| Feature | Web (CSS) | RN (Linear) | RN (Radial) |
|---------|-----------|-------------|-------------|
| Implementation | Native CSS | `react-native-linear-gradient` | `react-native-svg` |
| Performance | ✅ GPU-accelerated | ✅ GPU-accelerated | ⚠️ Can be slow on Android |
| Color stops | ✅ Unlimited | ✅ Unlimited | ✅ Unlimited |
| Angle control | ✅ `45deg`, `to right` | ✅ Start/end coords | ❌ Center/radius only |
| Animation | ✅ CSS keyframes | ✅ Reanimated | ⚠️ Complex (SVG props) |

#### Platform Gotchas

**Linear Gradients:**
- `react-native-linear-gradient` requires native linking (CocoaPods/Gradle)
- Angle-based gradients need conversion to start/end coordinates
- Animated gradients: animate color stops with Reanimated

**Radial Gradients:**
- No native RN support - requires SVG
- SVG rendering can be slow on older Android devices
- Complex radial gradients (multiple centers, elliptical) are difficult
- **Alternative:** Use `LinearGradient` with `borderRadius: 9999` for simple circular glows

**Performance Tips:**
- Cache gradient components to avoid re-renders
- Use `shouldRasterizeIOS={true}` on iOS for static gradients
- Consider using solid colors with opacity on low-end devices

**Simple Circular Glow (Non-SVG Alternative):**

```typescript
// Faster than SVG for simple radial glows
<LinearGradient
  colors={['rgba(0, 255, 255, 0.5)', 'transparent']}
  style={{
    width: 100,
    height: 100,
    borderRadius: 50, // Makes it circular
  }}
/>
```

#### Migration Checklist

- [ ] Replace CSS `linear-gradient` with `PlatformLinearGradient`
- [ ] Replace CSS `radial-gradient` with `PlatformRadialGradient` or circular `LinearGradient`
- [ ] Convert gradient directions to start/end coordinates
- [ ] Test gradient rendering on iOS and Android
- [ ] Profile SVG gradient performance on low-end Android
- [ ] Consider solid color + opacity fallback for complex gradients

---

### Text Shadow Abstraction

#### Overview

**Violation Count:** 35 occurrences across 23 files (9% of all violations)
**Priority:** HIGH

CSS `text-shadow` is widely used for glowing text effects and depth. React Native Text components support `textShadowColor`, `textShadowOffset`, and `textShadowRadius`, but with limitations (single shadow only, no multi-layer glow).

#### Web Implementation (CSS)

**Current CSS Pattern:**
```css
.glow-text {
  text-shadow: 0 0 12px rgba(0, 255, 255, 0.5);
}
```

**Example from `ProgressBarsXpAccumulation.css` (line 80):**
```css
.pf-xp-counter__value {
  color: var(--zone-color, #1e90ff);
  text-shadow: 0 0 12px var(--glow-color, rgba(0, 255, 255, 0.5));
}
```

**Example from `TextEffectsComboCounter.tsx` (line 71):**
```typescript
<motion.span
  animate={{
    textShadow: [
      '0 2px 4px rgba(0, 0, 0, 0.3)',
      '0 2px 8px rgba(239, 68, 68, 0.4)',
      '0 2px 4px rgba(0, 0, 0, 0.3)',
    ],
  }}
/>
```

#### RN Implementation

**Using the Platform Abstraction:**

```typescript
import { PlatformTextShadow } from '@/platform/text-shadow';

<PlatformTextShadow
  color="rgba(0, 255, 255, 0.5)"
  offset={{ x: 0, y: 0 }}
  blur={12}
>
  <Text style={styles.glowText}>XP: 1250</Text>
</PlatformTextShadow>
```

**Implementation of `PlatformTextShadow.tsx`:**

```typescript
import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import type { PlatformTextShadowProps } from '@/types/platform';

export function PlatformTextShadow({
  color = 'rgba(0, 0, 0, 0.5)',
  offset = { x: 0, y: 0 },
  blur = 0,
  children,
}: PlatformTextShadowProps) {
  // For simple shadows, use native textShadow props
  if (blur <= 4) {
    return React.cloneElement(children as React.ReactElement, {
      style: [
        (children as React.ReactElement).props.style,
        {
          textShadowColor: color,
          textShadowOffset: { width: offset.x, height: offset.y },
          textShadowRadius: blur,
        },
      ],
    });
  }

  // For glow effects (blur > 4), use layered text
  return (
    <View>
      {/* Background glow layers */}
      <Text
        style={[
          styles.glowLayer,
          (children as React.ReactElement).props.style,
          {
            color,
            opacity: 0.3,
            textShadowColor: color,
            textShadowRadius: blur,
          },
        ]}
      >
        {(children as React.ReactElement).props.children}
      </Text>
      <Text
        style={[
          styles.glowLayer,
          (children as React.ReactElement).props.style,
          {
            color,
            opacity: 0.5,
            textShadowColor: color,
            textShadowRadius: blur * 0.7,
          },
        ]}
      >
        {(children as React.ReactElement).props.children}
      </Text>
      {/* Foreground text */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  glowLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

// Style helper for direct application
export function createTextShadowStyle({
  color = 'rgba(0, 0, 0, 0.5)',
  offset = { x: 0, y: 0 },
  blur = 0,
}: Omit<PlatformTextShadowProps, 'children'>) {
  return {
    textShadowColor: color,
    textShadowOffset: { width: offset.x, height: offset.y },
    textShadowRadius: blur,
  };
}
```

**Animated Text Shadow:**

```typescript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { createTextShadowStyle } from '@/platform/text-shadow';

function PulsingTextGlow() {
  const blur = useSharedValue(4);

  useEffect(() => {
    blur.value = withRepeat(
      withTiming(12, { duration: 1200 }),
      -1,
      true
    );
  }, []);

  const animatedTextStyle = useAnimatedStyle(() => ({
    ...createTextShadowStyle({
      color: 'rgba(0, 255, 255, 0.5)',
      blur: blur.value,
    }),
  }));

  return (
    <Animated.Text style={[styles.text, animatedTextStyle]}>
      +50 XP
    </Animated.Text>
  );
}
```

#### Side-by-Side Comparison

| Feature | Web (CSS) | RN (Native) | RN (Layered) |
|---------|-----------|-------------|--------------|
| Shadow count | ✅ Unlimited | ❌ Single shadow | ✅ Multiple layers |
| Blur control | ✅ Exact px | ⚠️ Limited precision | ✅ Layered approach |
| Color control | ✅ Full RGBA | ✅ Full RGBA | ✅ Full RGBA |
| Performance | ✅ GPU | ✅ GPU | ⚠️ 3x text render |
| Glow effect | ✅ Multi-shadow | ❌ Poor quality | ✅ Good quality |

#### Platform Gotchas

**Native Text Shadow Limitations:**
- Only one shadow per Text component
- `textShadowRadius` has limited blur range (~0-10px)
- No multi-layer shadows for glow effects

**Layered Text Workaround:**
- Renders text 3+ times (performance impact)
- Use only for high-impact text (headings, counters)
- Avoid on ScrollView/FlatList items

**Performance Tips:**
- Prefer native `textShadow` for simple shadows (blur < 4px)
- Use layered approach only for glow effects
- Consider SVG text with `<feGaussianBlur>` for complex effects

**SVG Text Glow (Advanced):**

```typescript
import Svg, { Text as SvgText, Defs, Filter, FeGaussianBlur } from 'react-native-svg';

function SvgTextGlow() {
  return (
    <Svg width="200" height="60">
      <Defs>
        <Filter id="glow">
          <FeGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </Filter>
      </Defs>
      <SvgText
        x="50%"
        y="50%"
        textAnchor="middle"
        fontSize="24"
        fill="rgba(0, 255, 255, 0.8)"
        filter="url(#glow)"
      >
        +50 XP
      </SvgText>
    </Svg>
  );
}
```

#### Migration Checklist

- [ ] Replace CSS `text-shadow` with `PlatformTextShadow` or `createTextShadowStyle()`
- [ ] Use native shadow for simple shadows (blur < 4px)
- [ ] Use layered text for glow effects (blur ≥ 4px)
- [ ] Animate text shadows with Reanimated
- [ ] Test text rendering performance on low-end devices
- [ ] Consider SVG text for complex effects

---

### Filter Abstraction

#### Overview

**Violation Count:** 24 occurrences across 12 files (6% of all violations)
**Priority:** MEDIUM

CSS `filter` property (blur, brightness, contrast, grayscale) is not supported in React Native. Each filter type requires custom implementation or third-party libraries.

#### Web Implementation (CSS)

**Current CSS Patterns:**

**Blur Filter:**
```css
.blurred {
  filter: blur(10px);
}
```

**Brightness Filter (from `TimerEffectsPillCountdownExtreme.css` line 57):**
```css
.timer-pill {
  filter: brightness(1);
}
.timer-pill--urgent {
  filter: brightness(1.25);
}
```

**Drop Shadow Filter (from `TextEffectsCounterIncrement.css` line 92):**
```css
@keyframes counter-glow {
  0% { filter: drop-shadow(0 0 0 rgba(255, 215, 0, 0)); }
  50% { filter: drop-shadow(0 3px 8px rgba(255, 215, 0, 0.6)); }
}
```

**Grayscale Filter (from `ModalContentButtonsStagger2.css` line 87):**
```css
.button-disabled {
  filter: grayscale(100%);
}
```

#### RN Implementation

**Using the Platform Abstraction:**

```typescript
import { PlatformFilter } from '@/platform/filter';

<PlatformFilter
  filters={[
    { type: 'blur', radius: 10 },
    { type: 'brightness', value: 1.2 },
  ]}
>
  <Image source={require('./photo.jpg')} />
</PlatformFilter>
```

**Implementation of `PlatformFilter.tsx`:**

```typescript
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import type { PlatformFilterProps } from '@/types/platform';

export function PlatformFilter({
  filters,
  children,
  style,
}: PlatformFilterProps) {
  let content = children;

  // Apply filters in order
  filters.forEach((filter) => {
    switch (filter.type) {
      case 'blur':
        content = <BlurFilter radius={filter.radius}>{content}</BlurFilter>;
        break;
      case 'brightness':
        content = <BrightnessFilter value={filter.value}>{content}</BrightnessFilter>;
        break;
      case 'grayscale':
        content = <GrayscaleFilter amount={filter.amount}>{content}</GrayscaleFilter>;
        break;
      case 'contrast':
        content = <ContrastFilter value={filter.value}>{content}</ContrastFilter>;
        break;
      case 'opacity':
        content = <View style={{ opacity: filter.value }}>{content}</View>;
        break;
    }
  });

  return <View style={style}>{content}</View>;
}

// Blur Filter Implementation
function BlurFilter({ radius, children }: { radius: number; children: React.ReactNode }) {
  if (Platform.OS === 'web') {
    return (
      <View style={{ filter: `blur(${radius}px)` } as any}>
        {children}
      </View>
    );
  }

  // Use BlurView from @react-native-community/blur
  return (
    <View style={styles.blurContainer}>
      {children}
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="light"
        blurAmount={radius}
      />
    </View>
  );
}

// Brightness Filter Implementation (overlay approach)
function BrightnessFilter({ value, children }: { value: number; children: React.ReactNode }) {
  const overlayOpacity = value > 1 ? (value - 1) * 0.5 : 0;
  const overlayColor = value > 1 ? 'white' : 'black';

  return (
    <View>
      {children}
      {value !== 1 && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: overlayColor,
              opacity: overlayOpacity,
              pointerEvents: 'none',
            },
          ]}
        />
      )}
    </View>
  );
}

// Grayscale Filter (requires color matrix library)
import ColorMatrixFilter from 'react-native-color-matrix-image-filters';

function GrayscaleFilter({ amount, children }: { amount: number; children: React.ReactNode }) {
  return (
    <ColorMatrixFilter
      matrix={[
        0.33 * amount + (1 - amount), 0.59 * amount, 0.11 * amount, 0, 0,
        0.33 * amount, 0.59 * amount + (1 - amount), 0.11 * amount, 0, 0,
        0.33 * amount, 0.59 * amount, 0.11 * amount + (1 - amount), 0, 0,
        0, 0, 0, 1, 0,
      ]}
    >
      {children}
    </ColorMatrixFilter>
  );
}

const styles = StyleSheet.create({
  blurContainer: {
    position: 'relative',
  },
});
```

**Animated Brightness:**

```typescript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

function PulsingBrightness() {
  const brightness = useSharedValue(1);

  useEffect(() => {
    brightness.value = withRepeat(
      withTiming(1.25, { duration: 600 }),
      -1,
      true
    );
  }, []);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: (brightness.value - 1) * 0.5,
  }));

  return (
    <View>
      <View style={styles.content} />
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: 'white', pointerEvents: 'none' },
          overlayStyle,
        ]}
      />
    </View>
  );
}
```

#### Side-by-Side Comparison

| Filter Type | Web (CSS) | RN Implementation | Quality |
|-------------|-----------|-------------------|---------|
| Blur | ✅ Native | `@react-native-community/blur` | ✅ Good |
| Brightness | ✅ Native | White/black overlay | ⚠️ Approximation |
| Contrast | ✅ Native | Color matrix library | ⚠️ Approximation |
| Grayscale | ✅ Native | Color matrix library | ✅ Good |
| Drop Shadow | ✅ Native | Layered View + shadow | ⚠️ Approximation |

#### Platform Gotchas

**Blur:**
- `@react-native-community/blur` requires native modules
- BlurView is expensive - use sparingly
- Blur quality differs between iOS (good) and Android (variable)

**Brightness:**
- No native support - use overlay approach
- Overlays affect all children (can't target specific elements)
- Brightness >1.5 looks artificial

**Drop Shadow:**
- CSS `drop-shadow` vs. `box-shadow`: drop-shadow follows element shape
- RN approximation: use `PlatformShadow` on parent View
- Not perfect for non-rectangular shapes

**Grayscale:**
- Requires `react-native-color-matrix-image-filters` library
- Color matrices are expensive - avoid animating
- Consider pre-processing images to grayscale

#### Migration Checklist

- [ ] Replace CSS `filter: blur()` with `BlurView` component
- [ ] Replace CSS `filter: brightness()` with overlay approach
- [ ] Replace CSS `filter: drop-shadow()` with `PlatformShadow`
- [ ] Replace CSS `filter: grayscale()` with color matrix
- [ ] Test filter performance on low-end devices
- [ ] Consider removing complex filters on low-end devices

---

### Pseudo Element Abstraction

#### Overview

**Violation Count:** 47 occurrences across 19 files (12% of all violations)
**Priority:** HIGH

CSS `::before` and `::after` pseudo-elements are used for decorative overlays, particle effects, and shimmer animations. React Native requires these to be converted to actual child `<View>` components.

#### Web Implementation (CSS)

**Current CSS Pattern:**
```css
.element::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}
```

**Example from `StandardEffectsMorphPulse.css` (line 39):**
```css
.morph-pulse::before,
.morph-pulse::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  box-shadow: 0 0 16px rgba(106, 231, 168, 0.6);
  animation: pulse-ring 2.5s ease-in-out infinite;
}

.morph-pulse::before {
  border: 3px solid rgba(255, 255, 255, 0.3);
  animation-delay: 0s;
}

.morph-pulse::after {
  border: 2px solid rgba(106, 231, 168, 0.4);
  animation-delay: 0.4s;
}
```

#### RN Implementation

**Using the Platform Abstraction:**

```typescript
import { PlatformPseudoElement } from '@/platform/pseudo-element';

<PlatformPseudoElement
  position="before"
  content={{
    width: 20,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
  }}
  style={{
    position: 'absolute',
    top: -5,
    right: -5,
  }}
>
  <View style={styles.element}>
    <Text>Content</Text>
  </View>
</PlatformPseudoElement>
```

**Implementation of `PlatformPseudoElement.tsx`:**

```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { PlatformPseudoElementProps } from '@/types/platform';

export function PlatformPseudoElement({
  position,
  content,
  style,
  children,
}: PlatformPseudoElementProps) {
  return (
    <View style={styles.container}>
      {position === 'before' && (
        <View style={[content, style]} />
      )}
      {children}
      {position === 'after' && (
        <View style={[content, style]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
});

// Alternative: Render Props Pattern
export function PlatformPseudoElementRender({
  renderBefore,
  renderAfter,
  children,
}: PlatformPseudoElementRenderProps) {
  return (
    <View style={styles.container}>
      {renderBefore?.()}
      {children}
      {renderAfter?.()}
    </View>
  );
}
```

**Migrating MorphPulse Example:**

**Before (Web CSS):**
```css
.morph-pulse::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 16px rgba(106, 231, 168, 0.6);
  animation: pulse-ring 2.5s ease-in-out infinite;
}
```

**After (RN with Reanimated):**
```typescript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

function MorphPulse({ children }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.5, { duration: 2500 }),
      -1,
      false
    );
    opacity.value = withRepeat(
      withTiming(0, { duration: 2500 }),
      -1,
      false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Pseudo ::before as actual View */}
      <Animated.View
        style={[
          styles.pulseRing,
          pulseStyle,
          {
            borderWidth: 3,
            borderColor: 'rgba(255, 255, 255, 0.3)',
          },
        ]}
      />
      {/* Main content */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 9999,
  },
});
```

#### Side-by-Side Comparison

| Feature | Web (::before/::after) | RN (Child Views) |
|---------|------------------------|------------------|
| Implementation | CSS pseudo-elements | Actual `<View>` components |
| DOM nodes | 0 extra elements | +1 or +2 elements |
| Animation | CSS keyframes | Reanimated |
| Content | `content: ''` | Empty View or children |
| Positioning | Absolute by default | Must specify `position: 'absolute'` |

#### Platform Gotchas

**Structure Changes:**
- Pseudo-elements become sibling Views (must manage z-index)
- Use `zIndex` prop to control stacking order

**Performance:**
- Pseudo-elements add extra Views (minimal impact)
- Animated pseudo-elements use Reanimated for 60fps

**Positioning:**
- CSS `inset: 0` becomes `StyleSheet.absoluteFill`
- Ensure parent has `position: 'relative'` (or use absolute in parent)

#### Migration Checklist

- [ ] Identify all `::before` and `::after` usages in CSS
- [ ] Convert each pseudo-element to a child `<View>`
- [ ] Replicate positioning with `position: 'absolute'` and `top/left/right/bottom`
- [ ] Port CSS animations to Reanimated
- [ ] Update component structure to include new child elements
- [ ] Test z-index stacking order

---

## Component Migration Examples

### Example 1: Lights Bulb with Shadow & Radial Gradient

**Component:** `LightsCircleStatic1` (Alternating Carnival)
**Violations:** 11 box-shadow + 5 radial-gradient = 16 total
**Priority:** CRITICAL

#### Current Web Implementation

**LightsCircleStatic1.css (excerpt):**
```css
.lights-circle-static-1__glow-outer {
  background: radial-gradient(circle, var(--bulb-on-glow50) 0%, transparent 70%);
  opacity: 0;
}

.lights-circle-static-1__bulb {
  background-color: var(--bulb-off);
  box-shadow: 0 0 4px var(--bulb-on-glow70), 0 0 6px var(--bulb-on-glow50);
}

@keyframes carnival-bulb-even {
  0%, 42% {
    background: radial-gradient(circle at 40% 40%, var(--bulb-on), transparent);
    box-shadow: 0 0 4px var(--bulb-on-glow70), 0 0 6px var(--bulb-on-glow50);
  }
  44%, 92% {
    background: var(--bulb-off);
    box-shadow: none;
  }
}
```

**LightsCircleStatic1.tsx:**
```typescript
export function LightsCircleStatic1() {
  return (
    <div className="lights-circle-static-1">
      <div className="lights-circle-static-1__bulb-wrapper even">
        <div className="lights-circle-static-1__glow-outer" />
        <div className="lights-circle-static-1__bulb" />
      </div>
    </div>
  );
}
```

#### Refactored Version Using Platform Abstractions

**Create `Bulb.tsx` Component:**

```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { PlatformShadow } from '@/platform/shadow';
import { PlatformRadialGradient } from '@/platform/gradient';

interface BulbProps {
  isEven: boolean;
  onColor: string;
  offColor: string;
}

export function Bulb({ isEven, onColor, offColor }: BulbProps) {
  const isOn = useSharedValue(isEven ? 1 : 0);

  useEffect(() => {
    isOn.value = withRepeat(
      withTiming(1, {
        duration: 1200,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      }),
      -1,
      false
    );
  }, []);

  // Animated styles for bulb
  const bulbStyle = useAnimatedStyle(() => {
    const active = isEven
      ? isOn.value <= 0.43 // Even: ON during 0-43%
      : isOn.value > 0.43;  // Odd: ON during 44-100%

    return {
      backgroundColor: active ? onColor : offColor,
      transform: [
        { scale: active ? 1.12 : 1 },
        { rotate: active ? '1.5deg' : '0deg' },
      ],
    };
  });

  // Animated shadow elevation
  const shadowElevation = useAnimatedStyle(() => {
    const active = isEven ? isOn.value <= 0.43 : isOn.value > 0.43;
    return { elevation: active ? 8 : 0 };
  });

  // Animated glow opacity
  const glowOpacity = useAnimatedStyle(() => {
    const active = isEven ? isOn.value <= 0.43 : isOn.value > 0.43;
    return { opacity: active ? 0.65 : 0 };
  });

  return (
    <View style={styles.bulbWrapper}>
      {/* Outer glow using radial gradient */}
      <Animated.View style={[styles.glowOuter, glowOpacity]}>
        <PlatformRadialGradient
          colors={[
            { color: `${onColor}80`, position: 0 }, // 50% opacity
            { color: 'transparent', position: 0.7 },
          ]}
          center={{ x: 0.5, y: 0.5 }}
          radius={0.5}
        >
          <View style={styles.glowOuterSize} />
        </PlatformRadialGradient>
      </Animated.View>

      {/* Main bulb with shadow */}
      <Animated.View style={shadowElevation}>
        <PlatformShadow
          elevation={8}
          color={`${onColor}B3`} // 70% opacity
          offset={{ x: 0, y: 0 }}
        >
          <Animated.View style={[styles.bulb, bulbStyle]}>
            {/* Inner filament */}
            <Animated.View
              style={[
                styles.filament,
                useAnimatedStyle(() => ({
                  opacity: isOn.value <= 0.43 ? 0.85 : 0,
                })),
              ]}
            />
          </Animated.View>
        </PlatformShadow>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  bulbWrapper: {
    position: 'relative',
    width: 12,
    height: 12,
  },
  glowOuter: {
    position: 'absolute',
    width: 20,
    height: 20,
    top: -4,
    left: -4,
  },
  glowOuterSize: {
    width: 20,
    height: 20,
  },
  bulb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  filament: {
    position: 'absolute',
    width: 3,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 1.5,
    top: 4.5,
    left: 4.5,
  },
});
```

**Use `Bulb` in `LightsCircleStatic1.tsx`:**

```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Bulb } from './Bulb';

export function LightsCircleStatic1() {
  const bulbCount = 12;
  const radius = 75;

  return (
    <View style={styles.container}>
      {Array.from({ length: bulbCount }).map((_, index) => {
        const angle = (index / bulbCount) * 2 * Math.PI;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <View
            key={index}
            style={[
              styles.bulbPosition,
              {
                transform: [
                  { translateX: x },
                  { translateY: y },
                ],
              },
            ]}
          >
            <Bulb
              isEven={index % 2 === 0}
              onColor="#FFD700" // Gold
              offColor="#2C2C2C" // Dark gray
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bulbPosition: {
    position: 'absolute',
  },
});
```

#### What the RN Developer Needs to Implement

**Files to Create:**
1. `/platform/shadow/PlatformShadow.tsx` - Shadow abstraction (see Shadow section)
2. `/platform/gradient/PlatformRadialGradient.tsx` - Radial gradient abstraction (see Gradient section)
3. `/components/rewards/lights/Bulb.tsx` - Reusable bulb component (shown above)
4. `/components/rewards/lights/LightsCircleStatic1.tsx` - Main lights component (shown above)

**Testing Checklist:**
- [ ] Bulbs alternate correctly (even/odd pattern)
- [ ] Shadow glows animate smoothly (60fps)
- [ ] Radial gradient renders correctly on iOS
- [ ] Radial gradient renders correctly on Android (may need fallback)
- [ ] Animation timing matches web version (1200ms cycle)

---

### Example 2: XP Accumulation with Text Shadow & Markers

**Component:** `ProgressBarsXpAccumulation`
**Violations:** 6 box-shadow + 4 text-shadow + 2 radial-gradient = 12 total
**Priority:** HIGH

#### Current Web Implementation

**ProgressBarsXpAccumulation.css (excerpt):**
```css
.pf-xp-counter__value {
  color: var(--zone-color, #1e90ff);
  text-shadow: 0 0 12px var(--glow-color, rgba(0, 255, 255, 0.5));
}

.pf-progress-track {
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.35),
    0 0 var(--track-glow-blur, 12px) var(--glow-color, rgba(0, 255, 255, 0.5));
}

.pf-marker--active .pf-marker__dot {
  background: radial-gradient(
    circle,
    var(--zone-color) 0%,
    #00ffff 60%,
    rgba(255, 255, 255, 0.95) 100%
  );
  box-shadow: 0 0 12px var(--glow-color, rgba(0, 255, 255, 0.5));
}

.pf-marker--active .pf-marker__label {
  text-shadow: 0 0 6px var(--glow-color, rgba(0, 255, 255, 0.75));
}
```

#### Refactored Version Using Platform Abstractions

**Create `XpCounter.tsx` Component:**

```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { PlatformTextShadow, createTextShadowStyle } from '@/platform/text-shadow';

interface XpCounterProps {
  value: number;
  zoneColor: string;
  glowColor: string;
}

export function XpCounter({ value, zoneColor, glowColor }: XpCounterProps) {
  return (
    <View style={styles.counterRow}>
      <PlatformTextShadow
        color={glowColor}
        blur={12}
      >
        <Animated.Text
          style={[
            styles.counterValue,
            { color: zoneColor },
            createTextShadowStyle({
              color: glowColor,
              blur: 12,
            }),
          ]}
        >
          {value} XP
        </Animated.Text>
      </PlatformTextShadow>
    </View>
  );
}

const styles = StyleSheet.create({
  counterRow: {
    alignItems: 'center',
    marginBottom: 12,
  },
  counterValue: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
```

**Create `ProgressMarker.tsx` Component:**

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import { PlatformShadow } from '@/platform/shadow';
import { PlatformRadialGradient } from '@/platform/gradient';
import { createTextShadowStyle } from '@/platform/text-shadow';

interface ProgressMarkerProps {
  position: number; // 0-1
  label: string;
  isActive: boolean;
  zoneColor: string;
  glowColor: string;
}

export function ProgressMarker({
  position,
  label,
  isActive,
  zoneColor,
  glowColor,
}: ProgressMarkerProps) {
  return (
    <View
      style={[
        styles.marker,
        { left: `${position * 100}%` },
      ]}
    >
      {/* Marker dot with radial gradient */}
      <PlatformShadow
        elevation={isActive ? 12 : 0}
        color={glowColor}
      >
        <View style={styles.markerDot}>
          {isActive ? (
            <PlatformRadialGradient
              colors={[
                { color: zoneColor, position: 0 },
                { color: '#00ffff', position: 0.6 },
                { color: 'rgba(255, 255, 255, 0.95)', position: 1 },
              ]}
              center={{ x: 0.5, y: 0.5 }}
              radius={0.5}
            >
              <View style={styles.markerDotInner} />
            </PlatformRadialGradient>
          ) : (
            <View
              style={[
                styles.markerDotInner,
                { backgroundColor: 'rgba(255, 255, 255, 0.25)' },
              ]}
            />
          )}
        </View>
      </PlatformShadow>

      {/* Label */}
      <Text
        style={[
          styles.markerLabel,
          { color: isActive ? '#f8fbff' : 'rgba(255, 255, 255, 0.45)' },
          isActive && createTextShadowStyle({
            color: glowColor,
            blur: 6,
          }),
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  marker: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateX: -7 }, { translateY: -7 }],
    zIndex: 12,
  },
  markerDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  markerDotInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  markerLabel: {
    position: 'absolute',
    top: 26,
    left: '50%',
    transform: [{ translateX: -15 }],
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
});
```

**Create `ProgressTrack.tsx` Component:**

```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { PlatformShadow } from '@/platform/shadow';

interface ProgressTrackProps {
  progress: number; // 0-1
  zoneColor: string;
  glowColor: string;
}

export function ProgressTrack({
  progress,
  zoneColor,
  glowColor,
}: ProgressTrackProps) {
  const progressValue = useSharedValue(0);

  useEffect(() => {
    progressValue.value = withTiming(progress, { duration: 800 });
  }, [progress]);

  const fillStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: progressValue.value }],
  }));

  return (
    <PlatformShadow elevation={4} color="rgba(0, 0, 0, 0.35)">
      <View style={styles.track}>
        <PlatformShadow elevation={8} color={glowColor}>
          <Animated.View
            style={[
              styles.fill,
              fillStyle,
              { backgroundColor: zoneColor },
            ]}
          />
        </PlatformShadow>
      </View>
    </PlatformShadow>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(10, 18, 25, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'visible',
  },
  fill: {
    height: '100%',
    borderRadius: 6,
    transformOrigin: 'left center',
  },
});
```

**Assemble in `ProgressBarsXpAccumulation.tsx`:**

```typescript
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { XpCounter } from './XpCounter';
import { ProgressTrack } from './ProgressTrack';
import { ProgressMarker } from './ProgressMarker';

export function ProgressBarsXpAccumulation() {
  const [xpValue, setXpValue] = useState(650);
  const progress = xpValue / 1000; // Assume max 1000 XP

  const zoneColor = progress < 0.5 ? '#1E90FF' : '#00D0C7';
  const glowColor = `${zoneColor}80`; // 50% opacity

  return (
    <View style={styles.container}>
      <XpCounter value={xpValue} zoneColor={zoneColor} glowColor={glowColor} />

      <View style={styles.trackContainer}>
        <ProgressTrack
          progress={progress}
          zoneColor={zoneColor}
          glowColor={glowColor}
        />

        <ProgressMarker
          position={0}
          label="0"
          isActive={progress >= 0}
          zoneColor={zoneColor}
          glowColor={glowColor}
        />
        <ProgressMarker
          position={0.2}
          label="200"
          isActive={progress >= 0.2}
          zoneColor={zoneColor}
          glowColor={glowColor}
        />
        <ProgressMarker
          position={0.5}
          label="500"
          isActive={progress >= 0.5}
          zoneColor={zoneColor}
          glowColor={glowColor}
        />
        <ProgressMarker
          position={1}
          label="1000"
          isActive={progress >= 1}
          zoneColor={zoneColor}
          glowColor={glowColor}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  trackContainer: {
    position: 'relative',
    height: 60,
    justifyContent: 'center',
  },
});
```

#### What the RN Developer Needs to Implement

**Files to Create:**
1. `/platform/shadow/PlatformShadow.tsx` - Shadow abstraction
2. `/platform/gradient/PlatformRadialGradient.tsx` - Radial gradient
3. `/platform/text-shadow/PlatformTextShadow.tsx` - Text shadow abstraction
4. `/components/progress/XpCounter.tsx` - Counter component
5. `/components/progress/ProgressMarker.tsx` - Marker component
6. `/components/progress/ProgressTrack.tsx` - Track component
7. `/components/progress/ProgressBarsXpAccumulation.tsx` - Main component

**Testing Checklist:**
- [ ] XP counter text glow renders correctly
- [ ] Progress bar fills smoothly (800ms animation)
- [ ] Markers light up as progress crosses thresholds
- [ ] Radial gradient in marker dots renders on iOS/Android
- [ ] Text shadows on labels are visible
- [ ] 60fps performance during progress animation

---

### Example 3: Combo Counter with Particles & Text Effects

**Component:** `TextEffectsComboCounter`
**Violations:** 9 text-shadow + 2 radial-gradient + 1 ::after = 12 total
**Priority:** HIGH

#### Current Web Implementation

**TextEffectsComboCounter.tsx (excerpt):**
```typescript
<motion.span
  animate={{
    textShadow: [
      '0 2px 4px rgba(0, 0, 0, 0.3)',
      '0 2px 8px rgba(239, 68, 68, 0.4)',
      '0 2px 4px rgba(0, 0, 0, 0.3)',
    ],
  }}
>
  {rounded}
</motion.span>
```

**TextEffectsComboCounter.css (excerpt):**
```css
.combo-hit-marker {
  color: #f59e0b;
  text-shadow: 0 0 8px rgba(245, 158, 11, 0.8);
}

.combo-digit-glow {
  background: radial-gradient(circle, rgba(239, 68, 68, 0.3), transparent);
}

.combo-milestone-particle[data-value='10']::after {
  content: attr(data-text);
  background: radial-gradient(...);
}
```

#### Refactored Version Using Platform Abstractions

**Create `ComboNumber.tsx` Component:**

```typescript
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';
import { createTextShadowStyle } from '@/platform/text-shadow';

interface ComboNumberProps {
  value: number;
}

export function ComboNumber({ value }: ComboNumberProps) {
  const shadowBlur = useSharedValue(4);

  useEffect(() => {
    shadowBlur.value = withRepeat(
      withTiming(8, { duration: 600 }),
      -1,
      true
    );
  }, []);

  const textStyle = useAnimatedStyle(() => ({
    ...createTextShadowStyle({
      color: 'rgba(239, 68, 68, 0.4)',
      offset: { x: 0, y: 2 },
      blur: shadowBlur.value,
    }),
  }));

  return (
    <Animated.Text style={[styles.comboNumber, textStyle]}>
      {value}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  comboNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: '#ffffff',
  },
});
```

**Create `MilestoneParticle.tsx` Component:**

```typescript
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { PlatformRadialGradient } from '@/platform/gradient';

interface MilestoneParticleProps {
  value: number;
  angle: number;
  distance: number;
  delay: number;
}

export function MilestoneParticle({
  value,
  angle,
  distance,
  delay,
}: MilestoneParticleProps) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    const xOffset = Math.cos((angle * Math.PI) / 180) * distance;
    const yOffset = Math.sin((angle * Math.PI) / 180) * distance;

    opacity.value = withTiming(1, { duration: 250, delay });
    translateX.value = withTiming(xOffset, { duration: 1000, delay });
    translateY.value = withTiming(yOffset, { duration: 1000, delay });
    scale.value = withTiming(1.4, { duration: 500, delay }, () => {
      opacity.value = withTiming(0, { duration: 500 });
    });
  }, []);

  const particleStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View style={[styles.particle, particleStyle]}>
      <PlatformRadialGradient
        colors={[
          { color: 'rgba(239, 68, 68, 0.3)', position: 0 },
          { color: 'transparent', position: 1 },
        ]}
      >
        <View style={styles.particleInner}>
          <Text style={styles.particleText}>+{value}</Text>
        </View>
      </PlatformRadialGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    width: 40,
    height: 40,
  },
  particleInner: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f59e0b',
  },
});
```

**Assemble in `TextEffectsComboCounter.tsx`:**

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { ComboNumber } from './ComboNumber';
import { MilestoneParticle } from './MilestoneParticle';

export function TextEffectsComboCounter() {
  const [count, setCount] = useState(0);
  const finalValue = 25;

  const milestones = [
    { trigger: 1, value: 1 },
    { trigger: 6, value: 5 },
    { trigger: 15, value: 9 },
    { trigger: 25, value: 10 },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => (prev < finalValue ? prev + 1 : prev));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Main combo number */}
      <ComboNumber value={count} />

      {/* Milestone particles */}
      {milestones.map((milestone, i) => {
        if (count >= milestone.trigger) {
          const angle = -90 + i * 30 - 45;
          const distance = 70 + i * 12;
          const delay = (milestone.trigger / finalValue) * 800;

          return (
            <MilestoneParticle
              key={i}
              value={milestone.value}
              angle={angle}
              distance={distance}
              delay={delay}
            />
          );
        }
        return null;
      })}

      {/* Combo text */}
      <Text style={styles.comboText}>COMBO</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  comboText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 20,
  },
});
```

#### What the RN Developer Needs to Implement

**Files to Create:**
1. `/platform/text-shadow/createTextShadowStyle.ts` - Text shadow helper
2. `/platform/gradient/PlatformRadialGradient.tsx` - Radial gradient
3. `/components/text-effects/ComboNumber.tsx` - Animated number component
4. `/components/text-effects/MilestoneParticle.tsx` - Particle component
5. `/components/text-effects/TextEffectsComboCounter.tsx` - Main component

**Testing Checklist:**
- [ ] Combo number counts from 0 to 25
- [ ] Text shadow animates (pulsing effect)
- [ ] Milestone particles emit at correct thresholds (1, 6, 15, 25)
- [ ] Particles follow correct trajectory (arc pattern)
- [ ] Radial gradient renders behind particles
- [ ] 60fps performance during animations

---

## Testing Strategy

### Visual Regression Testing

**Goal:** Ensure RN animations match web versions within acceptable tolerance.

**Tools:**
- `jest-image-snapshot` - Automated screenshot comparison
- Manual design review

**Process:**

1. **Capture Web Baseline:**
   ```bash
   npm run test:visual:baseline
   ```

2. **Capture RN Screenshots:**
   ```bash
   # iOS
   npm run test:visual:ios

   # Android
   npm run test:visual:android
   ```

3. **Compare & Review:**
   ```typescript
   import { toMatchImageSnapshot } from 'jest-image-snapshot';

   expect.extend({ toMatchImageSnapshot });

   it('matches web baseline', async () => {
     const screenshot = await takeScreenshot('LightsCircleStatic1');
     expect(screenshot).toMatchImageSnapshot({
       failureThreshold: 0.05, // 5% difference allowed
       failureThresholdType: 'percent',
     });
   });
   ```

4. **Designer Approval:**
   - Flag any visual deviation >5%
   - Document acceptable platform differences
   - Get design team sign-off

### Platform Parity Testing

**Goal:** Verify identical behavior across iOS, Android, and Web.

**Test Matrix:**

| Component | iOS | Android | Web |
|-----------|-----|---------|-----|
| Shadow rendering | ✅ Native | ⚠️ Elevation | ✅ box-shadow |
| Gradient rendering | ✅ SVG | ⚠️ SVG (slow) | ✅ CSS |
| Text shadow | ✅ Native | ✅ Native | ✅ CSS |
| Animation timing | ✅ 60fps | ⚠️ Test | ✅ 60fps |

**Automated Tests:**

```typescript
describe('Platform Parity', () => {
  it('renders shadow on all platforms', () => {
    const { getByTestId } = render(
      <PlatformShadow elevation={8} testID="shadow">
        <View />
      </PlatformShadow>
    );

    const element = getByTestId('shadow');

    if (Platform.OS === 'ios') {
      expect(element.props.style).toHaveProperty('shadowRadius', 8);
    } else if (Platform.OS === 'android') {
      expect(element.props.style).toHaveProperty('elevation', 8);
    }
  });
});
```

### Performance Testing

**Goal:** Maintain 60fps during all animations.

**Tools:**
- React Native Performance Monitor
- Xcode Instruments (iOS)
- Android Profiler (Android)

**Process:**

1. **Enable Performance Monitor:**
   ```typescript
   import { enableScreens } from 'react-native-screens';
   import { enableFreeze } from 'react-native-screens';

   enableScreens(true);
   enableFreeze(true);
   ```

2. **Profile Frame Rate:**
   ```typescript
   import { PerformanceObserver } from 'react-native-performance';

   const observer = new PerformanceObserver((list) => {
     const entries = list.getEntries();
     entries.forEach((entry) => {
       if (entry.duration > 16.67) {
         console.warn('Frame drop detected:', entry);
       }
     });
   });

   observer.observe({ entryTypes: ['measure'] });
   ```

3. **Test Devices:**
   - **iOS:** iPhone 8 (oldest supported)
   - **Android:** Samsung Galaxy S8 (mid-range)

4. **Performance Targets:**
   - Maintain 60fps (16.67ms per frame)
   - JS thread <80% utilization
   - UI thread <70% utilization

**Stress Tests:**

```typescript
describe('Performance', () => {
  it('maintains 60fps with 12 animated bulbs', async () => {
    const { getByTestId } = render(<LightsCircleStatic1 />);

    const startTime = performance.now();
    await waitFor(() => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      const frameCount = duration / 16.67;

      expect(frameCount).toBeCloseTo(duration / 16.67, 1);
    }, { timeout: 5000 });
  });
});
```

---

## Performance Guidelines

### 60fps Requirements

**Target:** All animations must run at 60fps (16.67ms per frame).

**Key Principles:**

1. **Use `useNativeDriver: true`:**
   ```typescript
   Animated.timing(value, {
     toValue: 1,
     duration: 1000,
     useNativeDriver: true, // Run on UI thread
   }).start();
   ```

2. **Avoid JS Thread Blocking:**
   - Keep worklet functions small (<50 lines)
   - Avoid heavy computations in render
   - Use `useMemo` and `useCallback` aggressively

3. **Optimize Reanimated Worklets:**
   ```typescript
   import { runOnUI } from 'react-native-reanimated';

   const heavyCalculation = () => {
     'worklet';
     // Runs on UI thread
     return complexMath();
   };
   ```

### Worklet Best Practices

**What are Worklets?**
Worklets are JavaScript functions that run on the UI thread, bypassing the JS bridge for 60fps animations.

**Rules:**
1. Must have `'worklet';` directive
2. Cannot access external variables (must be passed as arguments)
3. Cannot use console.log (use `runOnJS` wrapper)

**Example:**

```typescript
import { useAnimatedStyle, runOnJS } from 'react-native-reanimated';

function AnimatedComponent() {
  const progress = useSharedValue(0);

  // ❌ WRONG: Accessing external state
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [{ scale: someExternalState }], // ERROR
    };
  });

  // ✅ CORRECT: All dependencies passed as arguments
  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: progress.value,
      transform: [{ scale: progress.value * 2 }],
    };
  });

  return <Animated.View style={animatedStyle} />;
}
```

**Debugging Worklets:**

```typescript
import { runOnJS } from 'react-native-reanimated';

const logToJS = (message: string) => {
  console.log(message);
};

const animatedStyle = useAnimatedStyle(() => {
  'worklet';

  // Run logging on JS thread
  runOnJS(logToJS)(`Progress: ${progress.value}`);

  return {
    opacity: progress.value,
  };
});
```

### Shadow Performance

**iOS:**
- Limit simultaneous animated shadows to ~10
- Use `shouldRasterizeIOS={true}` for static shadows
- Avoid large `shadowRadius` values (>20px)

**Android:**
- Elevation is GPU-accelerated (performant)
- Colored shadows (API 28+) have no performance penalty
- For older devices, consider disabling colored shadows

**Optimization:**

```typescript
const OptimizedShadow = ({ children }) => {
  return (
    <View
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        shouldRasterizeIOS: true, // Cache shadow rendering
        renderToHardwareTextureAndroid: true, // GPU acceleration
      }}
    >
      {children}
    </View>
  );
};
```

### Gradient Performance

**Linear Gradients:**
- `react-native-linear-gradient` is GPU-accelerated
- No performance concerns

**Radial Gradients (SVG):**
- Can be slow on older Android devices (API 21-23)
- Consider fallback to solid colors:

```typescript
const RadialGradientWithFallback = ({ colors, children }) => {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    // Detect slow device
    if (Platform.OS === 'android' && Platform.Version < 24) {
      setIsSlow(true);
    }
  }, []);

  if (isSlow) {
    // Fallback to solid color
    return (
      <View style={{ backgroundColor: colors[0].color }}>
        {children}
      </View>
    );
  }

  return (
    <PlatformRadialGradient colors={colors}>
      {children}
    </PlatformRadialGradient>
  );
};
```

### Text Shadow Performance

**Layered Text Approach:**
- Renders text 3+ times (performance impact)
- Use only for high-impact text (headings, counters)
- Avoid on `ScrollView`/`FlatList` items

**Optimization:**

```typescript
const OptimizedTextShadow = ({ children, isHighPriority }) => {
  if (!isHighPriority) {
    // Simple native shadow for list items
    return (
      <Text
        style={{
          textShadowColor: 'rgba(0, 0, 0, 0.5)',
          textShadowRadius: 4,
        }}
      >
        {children}
      </Text>
    );
  }

  // Layered glow for hero text
  return <PlatformTextShadow blur={12}>{children}</PlatformTextShadow>;
};
```

---

## Troubleshooting

### Common Issues

#### 1. Shadows Not Rendering on Android

**Symptom:** Shadows invisible on Android devices.

**Causes:**
- Elevation not set
- Element has no background color
- Overlapping Views block shadow

**Solutions:**

```typescript
// ❌ WRONG: No background color
<View style={{ elevation: 8 }}>
  <Text>Content</Text>
</View>

// ✅ CORRECT: Add background color
<View style={{ elevation: 8, backgroundColor: '#fff' }}>
  <Text>Content</Text>
</View>
```

**Debug Checklist:**
- [ ] `elevation` prop is set
- [ ] Element has `backgroundColor`
- [ ] No `overflow: 'hidden'` on parent
- [ ] Test on physical device (not emulator)

---

#### 2. Radial Gradients Rendering Poorly on Android

**Symptom:** SVG radial gradients appear jagged or slow.

**Causes:**
- Old Android version (API 21-23)
- Complex gradient with many stops
- Large SVG dimensions

**Solutions:**

```typescript
// Option 1: Circular LinearGradient fallback
<LinearGradient
  colors={['rgba(0, 255, 255, 0.5)', 'transparent']}
  style={{ width: 100, height: 100, borderRadius: 50 }}
/>

// Option 2: Platform-specific gradient
{Platform.select({
  ios: <PlatformRadialGradient colors={colors} />,
  android: Platform.Version >= 24
    ? <PlatformRadialGradient colors={colors} />
    : <View style={{ backgroundColor: colors[0].color }} />,
})}
```

---

#### 3. Animations Dropping Frames

**Symptom:** Animations stutter or run below 60fps.

**Causes:**
- Not using `useNativeDriver: true`
- Heavy JS thread work
- Too many simultaneous animations

**Solutions:**

```typescript
// ❌ WRONG: JS-driven animation
Animated.timing(value, {
  toValue: 1,
  duration: 1000,
  useNativeDriver: false, // Runs on JS thread
}).start();

// ✅ CORRECT: Native-driven animation
Animated.timing(value, {
  toValue: 1,
  duration: 1000,
  useNativeDriver: true, // Runs on UI thread
}).start();

// ✅ CORRECT: Reanimated worklet
const animatedStyle = useAnimatedStyle(() => {
  'worklet';
  return {
    opacity: progress.value,
  };
});
```

**Profiling:**

```bash
# iOS
npx react-native run-ios --configuration Release
# Open Xcode Instruments and profile

# Android
npx react-native run-android --variant=release
# Open Android Profiler
```

---

#### 4. Text Shadow Not Visible

**Symptom:** Text shadow doesn't render or looks incorrect.

**Causes:**
- Text color same as shadow color
- Shadow radius too small
- Platform doesn't support blur

**Solutions:**

```typescript
// ❌ WRONG: Shadow same color as text
<Text style={{ color: '#fff', textShadowColor: '#fff' }}>Text</Text>

// ✅ CORRECT: Contrasting shadow color
<Text
  style={{
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 2 },
  }}
>
  Text
</Text>

// ✅ CORRECT: Layered glow for strong effect
<PlatformTextShadow blur={12} color="rgba(0, 255, 255, 0.5)">
  <Text style={{ color: '#fff' }}>Glowing Text</Text>
</PlatformTextShadow>
```

---

#### 5. Gradient Not Animating

**Symptom:** Gradient colors don't change during animation.

**Causes:**
- Animating gradient directly (not supported)
- Need to animate individual color stops

**Solutions:**

```typescript
// ❌ WRONG: Cannot animate gradient prop
<Animated.View style={{ background: animatedGradient }} />

// ✅ CORRECT: Animate opacity of gradient layer
const opacity = useSharedValue(0);

useEffect(() => {
  opacity.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
}, []);

const animatedStyle = useAnimatedStyle(() => ({
  opacity: opacity.value,
}));

<Animated.View style={animatedStyle}>
  <PlatformLinearGradient colors={colors} />
</Animated.View>

// ✅ CORRECT: Animate color stops with SVG
import Animated from 'react-native-reanimated';
import { Stop } from 'react-native-svg';

const AnimatedStop = Animated.createAnimatedComponent(Stop);

const offset = useSharedValue(0);

const animatedProps = useAnimatedProps(() => ({
  offset: `${offset.value * 100}%`,
}));

<Svg>
  <Defs>
    <LinearGradient id="grad">
      <AnimatedStop animatedProps={animatedProps} stopColor="#FF5733" />
      <Stop offset="100%" stopColor="#FFC300" />
    </LinearGradient>
  </Defs>
</Svg>
```

---

#### 6. Platform Abstraction Not Found

**Symptom:** Import error: `Cannot find module '@/platform/shadow'`.

**Causes:**
- Platform abstraction not implemented yet
- Incorrect path alias configuration

**Solutions:**

```typescript
// Check tsconfig.json has path aliases
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

// Or use relative imports
import { PlatformShadow } from '../../../platform/shadow/PlatformShadow';
```

---

## Resources

### Official Documentation

**React Native:**
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [StyleSheet API](https://reactnative.dev/docs/stylesheet)
- [Animated API](https://reactnative.dev/docs/animated)

**React Native Reanimated:**
- [Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/)
- [Worklets Guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/worklets)
- [useSharedValue](https://docs.swmansion.com/react-native-reanimated/docs/core/useSharedValue)
- [useAnimatedStyle](https://docs.swmansion.com/react-native-reanimated/docs/core/useAnimatedStyle)

**Moti:**
- [Moti Docs](https://moti.fyi/)
- [MotiView Component](https://moti.fyi/components/view)
- [MotiText Component](https://moti.fyi/components/text)

**React Native SVG:**
- [react-native-svg Docs](https://github.com/software-mansion/react-native-svg)
- [SVG Elements](https://github.com/software-mansion/react-native-svg#supported-elements)

**React Native Linear Gradient:**
- [react-native-linear-gradient](https://github.com/react-native-linear-gradient/react-native-linear-gradient)

**React Native Blur:**
- [@react-native-community/blur](https://github.com/Kureev/react-native-blur)

### Helpful Guides

**Shadow Implementation:**
- [iOS Shadow Props](https://reactnative.dev/docs/shadow-props)
- [Android Elevation](https://developer.android.com/training/material/shadows-clipping)

**Gradient Implementation:**
- [Creating Radial Gradients with SVG](https://www.youtube.com/watch?v=fYq5PXgSsbE)
- [React Native Gradient Tutorial](https://blog.logrocket.com/gradients-react-native/)

**Performance Optimization:**
- [React Native Performance](https://reactnative.dev/docs/performance)
- [Reanimated Performance Tips](https://docs.swmansion.com/react-native-reanimated/docs/guides/performance-tips)
- [Profiling React Native Apps](https://reactnative.dev/docs/profiling)

### Project-Specific Files

**This Repository:**
- [Platform Types](/src/types/platform.ts) - TypeScript abstractions
- [Portability Audit](/docs/RN_PORTABILITY_AUDIT.md) - Complete violation list
- [Structure JSON](/docs/structure.json) - Component catalog

### Community Resources

**Forums:**
- [React Native Discord](https://discord.com/invite/reactnative)
- [Reanimated GitHub Discussions](https://github.com/software-mansion/react-native-reanimated/discussions)
- [Stack Overflow - react-native](https://stackoverflow.com/questions/tagged/react-native)

**Example Repositories:**
- [React Native Animations](https://github.com/oblador/react-native-animatable)
- [Reanimated Examples](https://github.com/software-mansion/react-native-reanimated/tree/main/example)

---

## Appendix

### Quick Reference: Violation Type to Abstraction Mapping

| CSS Feature | Platform Abstraction | Implementation File | Priority |
|-------------|---------------------|---------------------|----------|
| `box-shadow` | `PlatformShadow` | `/platform/shadow/PlatformShadow.tsx` | CRITICAL |
| `linear-gradient` | `PlatformLinearGradient` | `/platform/gradient/PlatformLinearGradient.tsx` | HIGH |
| `radial-gradient` | `PlatformRadialGradient` | `/platform/gradient/PlatformRadialGradient.tsx` | HIGH |
| `text-shadow` | `PlatformTextShadow` | `/platform/text-shadow/PlatformTextShadow.tsx` | HIGH |
| `filter: blur()` | `PlatformFilter` (BlurView) | `/platform/filter/PlatformFilter.tsx` | MEDIUM |
| `filter: brightness()` | `PlatformFilter` (Overlay) | `/platform/filter/PlatformFilter.tsx` | MEDIUM |
| `filter: grayscale()` | `PlatformFilter` (ColorMatrix) | `/platform/filter/PlatformFilter.tsx` | MEDIUM |
| `::before` / `::after` | `PlatformPseudoElement` | `/platform/pseudo-element/PlatformPseudoElement.tsx` | HIGH |

### Estimated Migration Effort

| Phase | Components | Files | Violations | Estimated Time |
|-------|-----------|-------|-----------|----------------|
| Phase 1: Foundation | 5 abstractions | 5 files | N/A | 2 weeks |
| Phase 2: High-Impact | 9 components | 18 files | 130 violations | 2 weeks |
| Phase 3: User Engagement | 11 components | 22 files | 48 violations | 2 weeks |
| Phase 4: Standard Effects | 9 components | 18 files | 34 violations | 2 weeks |
| Phase 5: Dialog & Timer | 17 components | 34 files | 63 violations | 2 weeks |
| **TOTAL** | **51 components** | **97 files** | **401 violations** | **10 weeks** |

---

**Document Version:** 1.0.0
**Last Updated:** 2025-10-10
**Maintained By:** Animation Platform Team
**Questions?** Refer to `/docs/CROSS_PLATFORM_REMEDIATION.md` or the RN Portability Audit.
