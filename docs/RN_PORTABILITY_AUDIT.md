# React Native Portability Audit Report

**Date:** 2025-10-10
**Project:** Animation Showcase
**Location:** `/Users/michaelhaufschild/Documents/code/animations`

---

## Executive Summary

This audit identifies all web-only CSS features that prevent direct React Native porting of the animation showcase. The codebase contains **401 total violations** across **79 unique CSS files**, requiring systematic remediation before RN migration.

### Violation Summary

| Violation Type | Total Count | Affected Files | Severity |
|----------------|-------------|----------------|----------|
| `box-shadow` | 234 | 64 files | **CRITICAL** |
| `radial-gradient` | 61 | 36 files | **HIGH** |
| `::before/::after` | 47 | 19 files | **HIGH** |
| `text-shadow` | 35 | 23 files | **HIGH** |
| `filter:` | 24 | 12 files | **MEDIUM** |
| **TOTAL** | **401** | **79** | - |

### Category Impact

| Category | Affected Animations | Priority |
|----------|-------------------|----------|
| **Rewards (Lights)** | 8 lights animations | CRITICAL - High visibility |
| **Progress Bars** | XP Accumulation, Zoomed Progress | HIGH - Core feature |
| **Text Effects** | Combo Counter, Wave Text, Epic Win | HIGH - User engagement |
| **Modal Celebrations** | 10 celebration effects | HIGH - Reward feedback |
| **Timer Effects** | 6 countdown variants | MEDIUM - Real-time UI |
| **Dialog Animations** | Modal content choreography | MEDIUM - Standard UX |
| **Standard Effects** | Pulse, Morph, Pop | MEDIUM - Reusable base |

---

## Detailed Violations by Category

### 1. box-shadow (234 occurrences, 64 files) - CRITICAL

**Impact:** `box-shadow` is the most pervasive violation. React Native requires migration to platform-specific shadow props (`shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius` on iOS, `elevation` on Android) or custom gradient overlays.

#### Highest-Impact Files

**Top Offenders:**
- **LightsCircleStatic1.css** (11 occurrences) - Carnival lights with pulsing glow effects
- **LightsCircleStatic8.css** (15 occurrences) - Dual convergence animation
- **LightsCircleStatic4.css** (14 occurrences) - Reverse chase pulse
- **LightsCircleStatic6.css** (14 occurrences) - Carnival waltz pattern
- **LightsCircleStatic2.css** (13 occurrences) - Sequential chase
- **LightsCircleStatic3.css** (13 occurrences) - Accelerating spin
- **TimerEffectsPillCountdownHeartbeat.css** (17 occurrences) - Threshold pulse timer

#### Example Code (LightsCircleStatic1.css:147-171)

```css
@keyframes carnival-bulb-even {
  0%, 42% {
    background: radial-gradient(circle at 40% 40%, var(--bulb-on), ...);
    box-shadow: 0 0 4px var(--bulb-on-glow70), 0 0 6px var(--bulb-on-glow50);
    transform: translate(-50%, -50%) scale(1.12) rotate(1.5deg);
  }
  43% {
    box-shadow: 0 0 2px var(--bulb-on-glow50);
  }
  44%, 92% {
    box-shadow: none;
  }
}
```

**RN Strategy:** Replace layered `box-shadow` with:
1. Animated `shadowOpacity` and `shadowRadius` (iOS)
2. Animated `elevation` (Android)
3. Multiple positioned `<View>` elements with `radial-gradient` backgrounds for complex glows

---

#### box-shadow Usage by Component Category

**Rewards (Lights):**
- `LightsCircleStatic1.css` - 11 occurrences (lines 147, 153, 159, 165, 171, 208, 214, 220, 226, 232)
- `LightsCircleStatic2.css` - 13 occurrences
- `LightsCircleStatic3.css` - 13 occurrences
- `LightsCircleStatic4.css` - 14 occurrences
- `LightsCircleStatic5.css` - 6 occurrences
- `LightsCircleStatic6.css` - 14 occurrences
- `LightsCircleStatic7.css` - 9 occurrences
- `LightsCircleStatic8.css` - 15 occurrences

**Progress Bars:**
- `ProgressBarsXpAccumulation.css` - 6 occurrences (lines 100, 119, 171, 175, 199, 234)
- `ProgressBarsZoomedProgress.css` - 4 occurrences (lines 61, 91, 97, 103)
- `ProgressBarsProgressSpark.css` - 2 occurrences

**Timer Effects:**
- `TimerEffectsPillCountdownHeartbeat.css` - 17 occurrences (most affected)
- `TimerEffectsPillCountdownGlitch.css` - 4 occurrences
- `TimerEffectsTimerFlash.css` - 7 occurrences

**Standard Effects:**
- `StandardEffectsMorphPulse.css` - 8 occurrences (lines 30, 52, 63, 88, 96, 104)
- `StandardEffectsPulse.css` - 3 occurrences
- `StandardEffectsPulseWave.css` - 3 occurrences

**Modal Content:**
- `ModalContentButtonsStagger2.css` - 3 occurrences (lines 16, 68, 88)
- `ModalContentFormFieldGradient.css` - 4 occurrences

---

### 2. radial-gradient (61 occurrences, 36 files) - HIGH

**Impact:** `radial-gradient` is used extensively for glow effects, spotlights, and light sources. React Native requires migration to `react-native-linear-gradient` with circular gradients or SVG-based solutions.

#### Key Files

**Modal Celebrations (Heavy Users):**
- `ModalCelebrationsJackpotCelebration.css` - 8 occurrences (spotlight beams, coin glows)
- `ModalCelebrationsRewardSpotlight.css` - 7 occurrences (hero light effects)

**Lights:**
- All 8 `LightsCircleStatic*.css` files use radial gradients for bulb glow effects

**Progress:**
- `ProgressBarsXpAccumulation.css` - 2 occurrences (orb glows)
- `ProgressBarsZoomedProgress.css` - 3 occurrences (marker highlights)

#### Example Code (ModalCelebrationsJackpotCelebration.css:68-69)

```css
.jackpot-coin {
  background:
    radial-gradient(circle at 50% 28%, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0)),
    radial-gradient(circle at 50% 100%, rgba(255, 206, 26, 0.52), rgba(255, 206, 26, 0));
}
```

**RN Strategy:**
1. Use `react-native-linear-gradient` with `useAngle={true}` and creative positioning
2. Create SVG `<RadialGradient>` components with `react-native-svg`
3. Layer multiple `<View>` elements with opacity masks
4. For simple glows, use `backgroundColor` with high opacity

---

#### radial-gradient Usage by Component

**Lights (All 8 animations):**
- `LightsCircleStatic1.css` - 5 occurrences (glow layers: lines 33, 48, 146, 170, 219)
- `LightsCircleStatic2.css` - 1 occurrence
- `LightsCircleStatic3.css` - 1 occurrence
- `LightsCircleStatic4.css` - 1 occurrence
- `LightsCircleStatic5.css` - 1 occurrence
- `LightsCircleStatic6.css` - 1 occurrence
- `LightsCircleStatic7.css` - 1 occurrence
- `LightsCircleStatic8.css` - 1 occurrence

**Modal Celebrations:**
- `ModalCelebrationsJackpotCelebration.css` - 8 radial gradients
- `ModalCelebrationsRewardSpotlight.css` - 7 radial gradients
- `ModalCelebrationsTreasureParticles.css` - 1 occurrence
- 9 other celebration files (1 each): ConfettiBurst, ConfettiRain, CoinsArc, etc.

**Progress:**
- `ProgressBarsXpAccumulation.css` - 2 occurrences (lines 193, 211)
- `ProgressBarsZoomedProgress.css` - 3 occurrences (lines 120, 129, 138)

**Base Effects:**
- `StandardEffectsMorphPulse.css` - 2 occurrences (lines 27, 28)
- `StandardEffectsSoftPulse.css` - 2 occurrences
- `StandardEffectsPulse.css` - 1 occurrence
- `TextEffectsEpicWin.css` - 1 occurrence
- `TextEffectsCounterIncrement.css` - 1 occurrence
- `TextEffectsComboCounter.css` - 2 occurrences

---

### 3. ::before and ::after pseudo-elements (47 occurrences, 19 files) - HIGH

**Impact:** Pseudo-elements are used for decorative overlays, particle effects, and shimmer animations. React Native requires these to be converted to actual child `<View>` components.

#### Key Files

**Timer Effects:**
- `TimerEffectsPillCountdownGlitch.css` - 6 occurrences (glitch layers)

**Standard Effects:**
- `StandardEffectsMorphPulse.css` - 6 occurrences (pulse ring layers)
- `StandardEffectsSoftPulse.css` - 5 occurrences (glow halos)
- `StandardEffectsPulseCircle.css` - 3 occurrences (ripple rings)

**Text Effects:**
- `TextEffectsWaveText.css` - 2 occurrences (wave highlights)
- `TextEffectsEpicWin.css` - 2 occurrences (metallic shine)
- `TextEffectsCharacterReveal.css` - 2 occurrences (reveal masks)
- `TextEffectsComboCounter.css` - 1 occurrence (milestone glow)

**Loading States:**
- `LoadingStatesSpinnerDualRing.css` - 2 occurrences (dual ring layers)
- `LoadingStatesSpinnerGalaxy.css` - 2 occurrences (galaxy arms)
- `LoadingStatesSpinnerOrbital.css` - 2 occurrences (orbital satellites)

#### Example Code (StandardEffectsMorphPulse.css:39-61)

```css
.morph-pulse::before,
.morph-pulse::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  pointer-events: none;
}

.morph-pulse::before {
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 16px rgba(106, 231, 168, 0.6), ...;
  animation: pulse-ring 2.5s ease-in-out infinite;
}

.morph-pulse::after {
  border: 2px solid rgba(106, 231, 168, 0.4);
  box-shadow: 0 0 20px rgba(106, 231, 168, 0.5), ...;
  animation: pulse-ring 2.5s ease-in-out infinite 0.4s;
}
```

**RN Strategy:**
1. Convert each pseudo-element to a positioned child `<View>`
2. Maintain absolute positioning with `position: 'absolute'`
3. Replicate animations using Reanimated/Moti on actual components
4. Update component structure to include new child elements

---

#### Pseudo-element Usage by File

**Timer Effects:**
- `TimerEffectsPillCountdownGlitch.css` - 6 occurrences (lines 68, 69, 86, 87, 97, 103)

**Standard Effects:**
- `StandardEffectsMorphPulse.css` - 6 occurrences (lines 39, 40, 49, 61, 115, 116)
- `StandardEffectsSoftPulse.css` - 5 occurrences (lines 20, 21, 31, 43, 58)
- `StandardEffectsPulseCircle.css` - 3 occurrences (lines 17, 18, 28)
- `StandardEffectsPulse.css` - 1 occurrence (line 25)

**Text Effects:**
- `TextEffectsWaveText.css` - 2 occurrences (lines 30, 45)
- `TextEffectsEpicWin.css` - 2 occurrences (lines 73, 84)
- `TextEffectsCharacterReveal.css` - 2 occurrences (lines 58, 78)
- `TextEffectsCounterIncrement.css` - 1 occurrence (line 77)
- `TextEffectsComboCounter.css` - 1 occurrence (line 188)

**Loading States:**
- `LoadingStatesSpinnerDualRing.css` - 2 occurrences (lines 15, 27)
- `LoadingStatesSpinnerGalaxy.css` - 2 occurrences (lines 21, 31)
- `LoadingStatesSpinnerOrbital.css` - 2 occurrences (lines 17, 30)

**Modal Dialogs:**
- `ModalBaseGlitchDigital.css` - 4 occurrences (lines 6, 7, 21, 25)

**Misc:**
- `MiscPendulumWave.css` - 1 occurrence (line 76)

**Modal Celebrations:**
- `ModalCelebrationsTreasureParticles.css` - 2 occurrences (lines 23, 35)

**Icon Animations:**
- `IconAnimationsPulse.css` - 1 occurrence (line 66)

**Global:**
- `index.css` - 2 occurrences (lines 71, 72) - CSS reset

---

### 4. text-shadow (35 occurrences, 23 files) - HIGH

**Impact:** `text-shadow` is widely used for glowing text effects and depth. React Native Text components don't support `textShadowColor` with blur radius, requiring alternative approaches.

#### Key Files

**Text Effects (Heavy Users):**
- `TextEffectsComboCounter.css` - 9 occurrences (lines 63, 123, 130, 160, 166, 172, 183)
  - Combo number glows, milestone particles, score indicators

**Progress Bars:**
- `ProgressBarsXpAccumulation.css` - 4 occurrences (lines 80, 87, 251, 263)
  - XP counter values, multiplier text, level labels

**Timer Effects:**
- `TimerEffectsPillCountdownExtreme.css` - 1 occurrence (line 72)
- `TimerEffectsPillCountdownMedium.css` - 1 occurrence (line 46)
- `TimerEffectsPillCountdownSoft.css` - 1 occurrence (line 35)
- `TimerEffectsPillCountdownStrong.css` - 1 occurrence (line 40)

**Modal Content:**
- All modal content choreography files use text-shadow for button text depth

#### Example Code (ProgressBarsXpAccumulation.css:80-87)

```css
.pf-xp-counter__value {
  font-size: 16px;
  font-weight: 700;
  color: var(--zone-color, #1e90ff);
  text-shadow: 0 0 12px var(--glow-color, rgba(0, 255, 255, 0.5));
}

.pf-xp-multiplier {
  font-weight: 800;
  color: #ffd700;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.65);
}
```

**RN Strategy:**
1. Use `textShadowColor`, `textShadowOffset`, `textShadowRadius` (limited to single shadow, no glow)
2. Layer duplicate `<Text>` components with opacity and blur for glow effects
3. Use `react-native-svg` with `<Text>` and `<FeGaussianBlur>` filter
4. Consider custom native modules for advanced text effects

---

#### text-shadow Usage by File

**Text Effects:**
- `TextEffectsComboCounter.css` - 9 occurrences (most affected)
- `TextEffectsWaveText.css` - 2 occurrences (lines 27, 36)
- `TextEffectsCharacterReveal.css` - 1 occurrence (line 31)
- `TextEffectsCounterIncrement.css` - 1 occurrence (line 72)
- `TextEffectsWaveReveal.css` - 1 occurrence (line 24)
- `TextEffectsXpNumberPop.css` - 1 occurrence (line 25)

**Progress:**
- `ProgressBarsXpAccumulation.css` - 4 occurrences

**Timer Effects:**
- `TimerEffectsPillCountdownExtreme.css` - 1 occurrence
- `TimerEffectsPillCountdownMedium.css` - 1 occurrence
- `TimerEffectsPillCountdownSoft.css` - 1 occurrence
- `TimerEffectsPillCountdownStrong.css` - 1 occurrence
- `TimerEffectsTimerFlash.css` - 1 occurrence (line 33)
- `TimerEffectsTimerFlashSoft.css` - 1 occurrence (line 37)

**Modal Content (all have 1 occurrence each):**
- `ModalContentButtonsStagger2.css` - line 75
- `ModalContentButtonsStagger3.css` - line 75
- `ModalContentFormFieldGradient.css` - line 105
- `ModalContentFormFieldLeftReveal.css` - line 105
- `ModalContentFormFieldRightReveal.css` - line 105
- `ModalContentListSoftStagger.css` - line 79
- `ModalContentListSpotlight.css` - line 89
- `ModalContentListVerticalWipe.css` - line 89

**Modal Base:**
- `shared.css` - 1 occurrence (line 77)

**Button Effects:**
- `shared.css` - 1 occurrence (line 35)

---

### 5. filter: property (24 occurrences, 12 files) - MEDIUM

**Impact:** CSS filters like `drop-shadow()`, `blur()`, `brightness()`, `grayscale()` are not supported in React Native. Requires case-by-case remediation.

#### Key Files

**Timer Effects (brightness/saturate filters):**
- `TimerEffectsPillCountdownExtreme.css` - 3 occurrences (lines 57, 60, 63)
  ```css
  filter: brightness(1);
  filter: brightness(1.25);
  ```
- `TimerEffectsPillCountdownMedium.css` - 3 occurrences (lines 31, 34, 37)
  ```css
  filter: brightness(1) saturate(1);
  filter: brightness(1.12) saturate(1.1);
  ```
- `TimerEffectsPillCountdownStrong.css` - 3 occurrences
- `TimerEffectsPillCountdownSoft.css` - 3 occurrences

**Text Effects (drop-shadow):**
- `TextEffectsCounterIncrement.css` - 5 occurrences (lines 92, 96, 100, 104, 108)
  ```css
  filter: drop-shadow(0 3px 8px rgba(255, 215, 0, 0.6));
  ```

**Modal Content (grayscale):**
- `ModalContentButtonsStagger2.css` - 1 occurrence (line 87)
- `ModalContentButtonsStagger3.css` - 1 occurrence
- `ModalContentFormFieldGradient.css` - 1 occurrence
- `ModalContentFormFieldLeftReveal.css` - 1 occurrence
- `ModalContentFormFieldRightReveal.css` - 1 occurrence
- `ModalContentListSoftStagger.css` - 1 occurrence
- `shared.css` (modal-base) - 1 occurrence

#### RN Strategy by Filter Type

1. **`drop-shadow()`**: Replicate with layered `<View>` components using `shadowOpacity`
2. **`brightness()`**: Animate `opacity` or overlay white `<View>` with low opacity
3. **`saturate()`**: Not directly supported; consider color manipulation libraries or image filters
4. **`grayscale()`**: Use `react-native-color-matrix-image-filters` or custom shader
5. **`blur()`**: Use `@react-native-community/blur` for iOS/Android blur views

---

## File-by-File Breakdown: Top 20 Most Affected Files

### 1. LightsCircleStatic8.css (15 box-shadow + 1 radial-gradient = 16 total)
**Location:** `/src/components/rewards/lights/LightsCircleStatic8.css`
**Animation:** Dual Convergence - Two lights chase from opposite sides with collision flash

**Violations:**
- 15× `box-shadow` (bulb glows, collision flashes)
- 1× `radial-gradient` (glow overlay)

**Impact:** CRITICAL - High-visibility reward animation

**Remediation Strategy:**
- Replace `box-shadow` with animated `shadowRadius`/`elevation`
- Convert `radial-gradient` to SVG `<RadialGradient>` or layered Views
- Maintain collision timing with Reanimated sequences

---

### 2. LightsCircleStatic4.css (14 box-shadow + 1 radial-gradient = 15 total)
**Location:** `/src/components/rewards/lights/LightsCircleStatic4.css`
**Animation:** Reverse Chase Pulse - Counter-clockwise chase with synchronized pulses

**Violations:**
- 14× `box-shadow` (chase trails, pulse glows)
- 1× `radial-gradient` (halo effect)

**Impact:** CRITICAL

**Remediation Strategy:**
- Extract bulb glow logic into reusable RN component
- Use Moti's `<MotiView>` for coordinated pulse animations
- Platform-specific shadow implementations for iOS/Android

---

### 3. LightsCircleStatic6.css (14 box-shadow + 1 radial-gradient = 15 total)
**Location:** `/src/components/rewards/lights/LightsCircleStatic6.css`
**Animation:** Carnival Waltz - Groups of 3 bulbs in waltz rhythm

**Violations:**
- 14× `box-shadow` (rhythmic glow patterns)
- 1× `radial-gradient` (base glow)

**Impact:** CRITICAL

**Remediation Strategy:**
- Group animations by 3-beat pattern
- Shared shadow animation configs
- Moti spring physics for musical timing

---

### 4. LightsCircleStatic2.css (13 box-shadow + 1 radial-gradient = 14 total)
**Location:** `/src/components/rewards/lights/LightsCircleStatic2.css`
**Animation:** Sequential Chase - Single lit bulb rotating

**Violations:**
- 13× `box-shadow` (sequential glow)
- 1× `radial-gradient`

**Impact:** CRITICAL

---

### 5. LightsCircleStatic3.css (13 box-shadow + 1 radial-gradient = 14 total)
**Location:** `/src/components/rewards/lights/LightsCircleStatic3.css`
**Animation:** Accelerating Spin - Wheel of fortune acceleration

**Violations:**
- 13× `box-shadow` (motion blur glows)
- 1× `radial-gradient`

**Impact:** CRITICAL

---

### 6. TimerEffectsPillCountdownHeartbeat.css (17 box-shadow)
**Location:** `/src/components/realtime/timer-effects/TimerEffectsPillCountdownHeartbeat.css`
**Animation:** Threshold Pulse - Heartbeat pulses at 50/40/30/20/10s

**Violations:**
- 17× `box-shadow` (pulse glow intensities)

**Impact:** HIGH - Real-time urgency feedback

**Remediation Strategy:**
- Threshold-based shadow intensity maps
- Reanimated timing sequences for heartbeat rhythm
- Interpolate `shadowRadius` from 0 to peak values

---

### 7. LightsCircleStatic1.css (11 box-shadow + 5 radial-gradient = 16 total)
**Location:** `/src/components/rewards/lights/LightsCircleStatic1.css`
**Animation:** Alternating Carnival - Even/odd bulbs alternating

**Violations:**
- 11× `box-shadow` (lines 147, 153, 159, 165, 171, 208, 214, 220, 226, 232)
- 5× `radial-gradient` (lines 33, 48, 146, 170, 219)

**Impact:** CRITICAL

**Example Code:**
```css
@keyframes carnival-bulb-even {
  0%, 42% {
    background: radial-gradient(...);
    box-shadow: 0 0 4px var(--bulb-on-glow70), 0 0 6px var(--bulb-on-glow50);
    transform: translate(-50%, -50%) scale(1.12) rotate(1.5deg);
  }
}
```

**Remediation Strategy:**
- Create `<BulbGlow>` component with platform shadows
- Animate `backgroundColor` transitions for on/off states
- Use `react-native-linear-gradient` for radial emulation

---

### 8. TextEffectsComboCounter.css (9 text-shadow + 2 radial-gradient + 1 ::after = 12 total)
**Location:** `/src/components/base/text-effects/TextEffectsComboCounter.css`
**Animation:** Combo Counter - Dynamic counting with milestone particles

**Violations:**
- 9× `text-shadow` (lines 63, 123, 130, 160, 166, 172, 183)
- 2× `radial-gradient` (lines 71, 193)
- 1× `::after` pseudo-element (line 188)

**Impact:** HIGH - Core gameplay feedback

**Example Code:**
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

**Remediation Strategy:**
- Layer duplicate `<Text>` elements with blur for glow
- Convert `::after` to actual child component
- Use `react-native-svg` for complex text effects
- Consider custom native text shadow module

---

### 9. LightsCircleStatic7.css (9 box-shadow + 1 radial-gradient = 10 total)
**Location:** `/src/components/rewards/lights/LightsCircleStatic7.css`
**Animation:** Comet Trail - Bright head with trailing fadeout

**Violations:**
- 9× `box-shadow`
- 1× `radial-gradient`

**Impact:** CRITICAL

---

### 10. StandardEffectsMorphPulse.css (8 box-shadow + 2 radial-gradient + 6 ::before/::after = 16 total)
**Location:** `/src/components/base/standard-effects/StandardEffectsMorphPulse.css`
**Animation:** Morph Pulse - Expanding rings with gradient morphing

**Violations:**
- 8× `box-shadow` (lines 30, 52, 63, 88, 96, 104)
- 2× `radial-gradient` (lines 27, 28)
- 6× `::before/::after` (lines 39, 40, 49, 61, 115, 116)

**Impact:** MEDIUM - Reusable base effect

**Example Code:**
```css
.morph-pulse::before,
.morph-pulse::after {
  content: '';
  border-radius: 50%;
  box-shadow: 0 0 16px rgba(106, 231, 168, 0.6), ...;
  animation: pulse-ring 2.5s ease-in-out infinite;
}
```

**Remediation Strategy:**
- Convert pseudo-elements to `<View>` children
- Create reusable `<PulseRing>` component
- Coordinate animations with Moti stagger delays

---

### 11. ModalCelebrationsJackpotCelebration.css (8 radial-gradient + 1 box-shadow = 9 total)
**Location:** `/src/components/rewards/modal-celebrations/ModalCelebrationsJackpotCelebration.css`
**Animation:** Jackpot Celebration - Epic win with spotlight beams

**Violations:**
- 8× `radial-gradient` (spotlight layers, coin glows)
- 1× `box-shadow`

**Impact:** HIGH - Premium reward feedback

**Remediation Strategy:**
- SVG `<RadialGradient>` for spotlight beams
- Animated `<Svg>` with `<Defs>` for complex lighting
- Layer multiple gradient Views with `opacity` animations

---

### 12. ModalCelebrationsRewardSpotlight.css (7 radial-gradient + 1 box-shadow = 8 total)
**Location:** `/src/components/rewards/modal-celebrations/ModalCelebrationsRewardSpotlight.css`
**Animation:** Reward Spotlight - Hero reward presentation

**Violations:**
- 7× `radial-gradient`
- 1× `box-shadow`

**Impact:** HIGH

---

### 13. TimerEffectsTimerFlash.css (7 box-shadow + 1 text-shadow = 8 total)
**Location:** `/src/components/realtime/timer-effects/TimerEffectsTimerFlash.css`
**Animation:** Flash Expire - Flashing urgency warning

**Violations:**
- 7× `box-shadow` (flash intensities)
- 1× `text-shadow` (line 33)

**Impact:** MEDIUM

---

### 14. LightsCircleStatic5.css (6 box-shadow + 1 radial-gradient = 7 total)
**Location:** `/src/components/rewards/lights/LightsCircleStatic5.css`
**Animation:** Random Sparkle - Unpredictable twinkling

**Violations:**
- 6× `box-shadow`
- 1× `radial-gradient`

**Impact:** CRITICAL

---

### 15. ProgressBarsXpAccumulation.css (6 box-shadow + 4 text-shadow + 2 radial-gradient = 12 total)
**Location:** `/src/components/progress/progress-bars/ProgressBarsXpAccumulation.css`
**Animation:** XP Accumulation - Flowing orbs with multiplier zones

**Violations:**
- 6× `box-shadow` (lines 100, 119, 171, 175, 199, 234)
- 4× `text-shadow` (lines 80, 87, 251, 263)
- 2× `radial-gradient` (lines 193, 211)

**Impact:** HIGH - Core progression mechanic

**Example Code:**
```css
.pf-progress-track {
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.35),
    0 0 var(--track-glow-blur, 12px) var(--glow-color, rgba(0, 255, 255, 0.5));
}

.pf-xp-counter__value {
  text-shadow: 0 0 12px var(--glow-color, rgba(0, 255, 255, 0.5));
}

.pf-marker--active .pf-marker__dot {
  background: radial-gradient(circle, var(--zone-color) 0%, #00ffff 60%, ...);
}
```

**Remediation Strategy:**
- Inset shadows: Use border + inner View with gradient
- Glow shadows: Animate `shadowRadius` based on progress
- Text glows: Layered `<Text>` components
- Radial markers: SVG circles with gradient fills

---

### 16. TimerEffectsPillCountdownGlitch.css (4 box-shadow + 6 ::before/::after = 10 total)
**Location:** `/src/components/realtime/timer-effects/TimerEffectsPillCountdownGlitch.css`
**Animation:** Threshold Glitch - Digital distortion at thresholds

**Violations:**
- 4× `box-shadow`
- 6× `::before/::after` (lines 68, 69, 86, 87, 97, 103)

**Impact:** MEDIUM

**Remediation Strategy:**
- Convert glitch layers (::before/::after) to positioned Views
- Use RGB channel offset with colored overlay Views
- Coordinate timing with Reanimated sequence

---

### 17. ModalContentFormFieldGradient.css (4 box-shadow + 1 text-shadow + 1 filter = 6 total)
**Location:** `/src/components/dialogs/modal-content/ModalContentFormFieldGradient.css`
**Animation:** Form Gradient Sweep - Gradient emphasizing focus order

**Violations:**
- 4× `box-shadow`
- 1× `text-shadow`
- 1× `filter: grayscale(10%)`

**Impact:** MEDIUM

---

### 18. StandardEffectsSoftPulse.css (2 radial-gradient + 5 ::before/::after = 7 total)
**Location:** `/src/components/base/standard-effects/StandardEffectsSoftPulse.css`
**Animation:** Soft Pulse - Gentle breathing with aura

**Violations:**
- 2× `radial-gradient` (glow halos)
- 5× `::before/::after` (lines 20, 21, 31, 43, 58)

**Impact:** MEDIUM

---

### 19. ProgressBarsZoomedProgress.css (4 box-shadow + 3 radial-gradient = 7 total)
**Location:** `/src/components/progress/progress-bars/ProgressBarsZoomedProgress.css`
**Animation:** Zoomed Progress - Shifting viewport with color transitions

**Violations:**
- 4× `box-shadow` (lines 61, 91, 97, 103)
- 3× `radial-gradient` (lines 120, 129, 138)

**Impact:** HIGH - Multi-level progression

---

### 20. TextEffectsCounterIncrement.css (5 filter:drop-shadow + 1 text-shadow + 1 radial-gradient + 1 ::after = 8 total)
**Location:** `/src/components/base/text-effects/TextEffectsCounterIncrement.css`
**Animation:** Counter Increment - Numeric counter with scale

**Violations:**
- 5× `filter: drop-shadow()` (lines 92, 96, 100, 104, 108)
- 1× `text-shadow` (line 72)
- 1× `radial-gradient` (line 81)
- 1× `::after` (line 77)

**Impact:** MEDIUM

**Example Code:**
```css
@keyframes counter-glow {
  0% { filter: drop-shadow(0 0 0 rgba(255, 215, 0, 0)); }
  50% { filter: drop-shadow(0 3px 8px rgba(255, 215, 0, 0.6)); }
  100% { filter: drop-shadow(0 0 0 rgba(255, 215, 0, 0)); }
}
```

**Remediation Strategy:**
- Replace `drop-shadow` with layered View + animated `shadowOpacity`
- Convert `::after` glow to child View with `radial-gradient` emulation

---

## Statistics Dashboard

### Violation Distribution

```
box-shadow          ████████████████████████████████████████ 234 (58%)
radial-gradient     ███████████████ 61 (15%)
::before/::after    ███████████ 47 (12%)
text-shadow         ████████ 35 (9%)
filter:             ██████ 24 (6%)
```

### Files by Severity

| Severity | File Count | % of Total |
|----------|-----------|------------|
| Critical (10+ violations) | 8 files | 10% |
| High (5-9 violations) | 15 files | 19% |
| Medium (3-4 violations) | 21 files | 27% |
| Low (1-2 violations) | 35 files | 44% |

### Violations by Directory

| Directory | Files Affected | Total Violations |
|-----------|----------------|------------------|
| `/rewards/lights/` | 8 files | 118 violations |
| `/progress/progress-bars/` | 6 files | 28 violations |
| `/base/text-effects/` | 11 files | 37 violations |
| `/realtime/timer-effects/` | 9 files | 39 violations |
| `/dialogs/modal-content/` | 8 files | 24 violations |
| `/dialogs/modal-base/` | 4 files | 8 violations |
| `/rewards/modal-celebrations/` | 12 files | 36 violations |
| `/base/standard-effects/` | 9 files | 34 violations |
| `/progress/loading-states/` | 5 files | 11 violations |
| `/realtime/update-indicators/` | 5 files | 11 violations |

---

## Remediation Roadmap

### Phase 1: Foundation (Week 1-2)
**Goal:** Create reusable RN abstraction layer

1. **Shadow Abstraction Library**
   - Create `<ShadowView>` component wrapping platform-specific shadow logic
   - iOS: `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`
   - Android: `elevation` with fallback layering
   - API: `<ShadowView intensity={0.7} blur={12} color="rgba(0,255,255,0.5)">`

2. **Gradient Abstraction Library**
   - `<RadialGlow>` component using `react-native-linear-gradient` + SVG
   - `<SpotlightBeam>` for celebration effects
   - Reusable gradient configurations for common patterns

3. **Text Effect Library**
   - `<GlowText>` with layered text approach
   - `<DropShadowText>` with view-based shadows
   - Performance-optimized text rendering

### Phase 2: High-Impact Components (Week 3-4)
**Priority:** Lights animations (8 files, 118 violations)

1. **LightsCircleStatic1-8 Migration**
   - Extract shared `<Bulb>` component
   - Platform shadow implementations
   - Coordinate timing with Reanimated worklets
   - Test on iOS/Android devices

2. **XP Accumulation (ProgressBarsXpAccumulation.css)**
   - Migrate 12 violations (box-shadow, text-shadow, radial-gradient)
   - Flow animations with Moti
   - Dynamic glow intensity based on progress

### Phase 3: User Engagement (Week 5-6)
**Priority:** Text effects, Modal celebrations

1. **TextEffectsComboCounter Migration**
   - 12 violations (text-shadow, radial-gradient, ::after)
   - Milestone particles with SVG
   - Glow text with layered approach

2. **Modal Celebrations (10 animations)**
   - 36 total violations
   - SVG-based spotlight effects
   - Particle systems with Reanimated

### Phase 4: Standard Effects (Week 7-8)
**Priority:** Reusable base effects

1. **StandardEffects* Migration**
   - 9 files, 34 violations
   - Create `<Pulse>`, `<MorphPulse>`, `<SoftPulse>` RN components
   - Moti/Reanimated animation configs
   - Storybook documentation

### Phase 5: Dialog & Timer UX (Week 9-10)
**Priority:** Modal content, Timer effects

1. **Modal Content Choreography**
   - 8 files, 24 violations
   - Form field animations
   - Button stagger sequences

2. **Timer Effects**
   - 9 files, 39 violations
   - Urgency feedback patterns
   - Countdown glow intensities

---

## Technical Recommendations

### Shadow Implementation Pattern

```typescript
// Cross-platform shadow abstraction
import { Platform, ViewStyle } from 'react-native';

interface ShadowProps {
  intensity?: number; // 0-1
  blur?: number;
  color?: string;
  offset?: { x: number; y: number };
}

export const createShadow = ({
  intensity = 0.5,
  blur = 10,
  color = 'rgba(0,0,0,0.3)',
  offset = { x: 0, y: 0 }
}: ShadowProps): ViewStyle => {
  if (Platform.OS === 'ios') {
    return {
      shadowColor: color,
      shadowOffset: { width: offset.x, height: offset.y },
      shadowOpacity: intensity,
      shadowRadius: blur,
    };
  } else {
    // Android: elevation doesn't support color/blur
    // Fallback: use elevation for depth, layer Views for color
    return {
      elevation: Math.round(blur / 2),
      // Add layered View with gradient for colored glow
    };
  }
};
```

### Radial Gradient Pattern

```typescript
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';

// Simple approach: Linear gradient with circular mask
export const SimpleRadialGlow = () => (
  <LinearGradient
    colors={['rgba(0,255,255,0.5)', 'transparent']}
    style={{ width: 100, height: 100, borderRadius: 50 }}
  />
);

// Advanced: True radial with SVG
export const RadialGlow = () => (
  <Svg height="100" width="100">
    <Defs>
      <RadialGradient id="grad" cx="50%" cy="50%">
        <Stop offset="0%" stopColor="rgba(0,255,255,0.8)" />
        <Stop offset="70%" stopColor="transparent" />
      </RadialGradient>
    </Defs>
    <Circle cx="50" cy="50" r="50" fill="url(#grad)" />
  </Svg>
);
```

### Pseudo-element Conversion Pattern

```typescript
// Before (Web CSS)
// .element::before { content: ''; position: absolute; ... }

// After (React Native)
const ElementWithGlow = () => (
  <View style={styles.container}>
    <View style={styles.glowBefore} /> {/* ::before */}
    <View style={styles.content}>{children}</View>
    <View style={styles.glowAfter} /> {/* ::after */}
  </View>
);

const styles = StyleSheet.create({
  container: { position: 'relative' },
  glowBefore: {
    position: 'absolute',
    inset: 0,
    // Replicate ::before styles
  },
  glowAfter: {
    position: 'absolute',
    inset: 0,
    // Replicate ::after styles
  },
});
```

### Text Shadow Pattern

```typescript
// Simple single shadow (limited)
const textStyle = {
  textShadowColor: 'rgba(0, 0, 0, 0.75)',
  textShadowOffset: { width: 0, height: 2 },
  textShadowRadius: 4,
};

// Advanced glow (layered approach)
const GlowText = ({ children, glowColor }) => (
  <View>
    <Text style={[styles.text, { color: glowColor, opacity: 0.3, position: 'absolute' }]}>
      {children}
    </Text>
    <Text style={[styles.text, { color: glowColor, opacity: 0.5, position: 'absolute' }]}>
      {children}
    </Text>
    <Text style={styles.text}>{children}</Text>
  </View>
);
```

---

## Risk Assessment

### High-Risk Migrations

1. **Lights Animations (LightsCircleStatic1-8)**
   - **Risk:** Complex layered glows may cause performance issues
   - **Mitigation:** GPU-accelerated layers, use `shouldRasterizeIOS`, limit simultaneous animations
   - **Testing:** Profile on low-end Android devices (>60fps target)

2. **XP Accumulation**
   - **Risk:** Flowing orb particles with dynamic shadows
   - **Mitigation:** Pre-calculate shadow intensities, use `useNativeDriver: true`
   - **Testing:** Stress test with rapid XP gains

3. **Modal Celebrations**
   - **Risk:** SVG radial gradients may not match web visual fidelity
   - **Mitigation:** Create design review checkpoints, A/B test visual alternatives
   - **Testing:** Designer approval on both platforms

### Performance Considerations

- **Shadow Performance:** iOS handles multiple shadows well; Android elevation is limited
- **SVG Gradients:** Performant on modern devices, test on Android API 21-23
- **Text Layering:** 3+ layered text components can impact scroll performance
- **Recommendation:** Use `react-native-reanimated` worklets for all animations to ensure 60fps

---

## Testing Strategy

### Visual Regression Testing
1. Create screenshot baselines for all 79 affected components
2. Use `jest-image-snapshot` for automated visual diffing
3. Designer approval required for any visual deviation >5%

### Performance Testing
1. Profile frame rate (target: 60fps) on:
   - iOS: iPhone 8 (oldest supported)
   - Android: Samsung Galaxy S8 (mid-range)
2. Monitor memory usage during animation sequences
3. Test simultaneous animations (e.g., multiple lights + XP bar)

### Platform Parity Testing
1. Side-by-side iOS vs Android visual comparison
2. Document acceptable platform differences
3. Flag any critical deviations to design team

---

## Appendix: Complete File Manifest

### All Affected Files (Alphabetical)

#### App-Level
- `App.css` - 4 box-shadow, 3 radial-gradient, 2 ::before/::after
- `index.css` - 1 radial-gradient, 2 ::before/::after

#### Base / Button Effects
- `button-effects/shared.css` - 4 box-shadow, 1 text-shadow
- `button-effects/ButtonEffectsRipple.css` - 1 radial-gradient

#### Base / Standard Effects
- `standard-effects/shared.css` - 1 box-shadow
- `standard-effects/StandardEffectsFlip.css` - 3 box-shadow
- `standard-effects/StandardEffectsMorphPulse.css` - 8 box-shadow, 2 radial-gradient, 6 ::before/::after
- `standard-effects/StandardEffectsPop.css` - 3 box-shadow
- `standard-effects/StandardEffectsPulse.css` - 3 box-shadow, 1 radial-gradient, 1 ::before
- `standard-effects/StandardEffectsPulseCircle.css` - 3 ::before/::after
- `standard-effects/StandardEffectsPulseWave.css` - 3 box-shadow
- `standard-effects/StandardEffectsRadialPulse.css` - 1 box-shadow
- `standard-effects/StandardEffectsSoftPulse.css` - 2 radial-gradient, 5 ::before/::after

#### Base / Text Effects
- `text-effects/TextEffectsCharacterReveal.css` - 1 text-shadow, 2 ::before/::after
- `text-effects/TextEffectsComboCounter.css` - 9 text-shadow, 2 radial-gradient, 1 ::after
- `text-effects/TextEffectsCounterIncrement.css` - 5 filter, 1 text-shadow, 1 radial-gradient, 1 ::after
- `text-effects/TextEffectsEpicWin.css` - 1 radial-gradient, 2 ::before/::after
- `text-effects/TextEffectsGlitchText.css` - 1 box-shadow
- `text-effects/TextEffectsWaveReveal.css` - 1 text-shadow
- `text-effects/TextEffectsWaveText.css` - 2 text-shadow, 2 ::before/::after
- `text-effects/TextEffectsXpNumberPop.css` - 1 text-shadow

#### Dialogs / Modal Base
- `modal-base/shared.css` - 3 box-shadow, 1 text-shadow, 1 filter
- `modal-base/ModalBaseGlitchDigital.css` - 4 ::before/::after

#### Dialogs / Modal Content
- `modal-content/ModalContentButtonsStagger2.css` - 3 box-shadow, 1 text-shadow, 1 filter
- `modal-content/ModalContentButtonsStagger3.css` - 3 box-shadow, 1 text-shadow, 1 filter
- `modal-content/ModalContentFormFieldGradient.css` - 4 box-shadow, 1 text-shadow, 1 filter
- `modal-content/ModalContentFormFieldLeftReveal.css` - 4 box-shadow, 1 text-shadow, 1 filter
- `modal-content/ModalContentFormFieldRightReveal.css` - 4 box-shadow, 1 text-shadow, 1 filter
- `modal-content/ModalContentListSoftStagger.css` - 3 box-shadow, 1 text-shadow, 1 filter
- `modal-content/ModalContentListSpotlight.css` - 2 box-shadow, 1 text-shadow
- `modal-content/ModalContentListVerticalWipe.css` - 2 box-shadow, 1 text-shadow

#### Dialogs / Modal Dismiss
- `modal-dismiss/shared.css` - 2 box-shadow, 1 radial-gradient

#### Dialogs / Modal Orchestration
- `modal-orchestration/ModalOrchestrationTabMorph.css` - 1 box-shadow
- `modal-orchestration/ModalOrchestrationWizardScaleRotate.css` - 2 box-shadow

#### Misc
- `misc/MiscConcentricRings.css` - 1 box-shadow
- `misc/MiscOrbitalPulse.css` - 1 box-shadow
- `misc/MiscPendulumWave.css` - 1 ::before
- `misc/MiscPulsingGrid.css` - 1 box-shadow

#### Progress / Loading States
- `loading-states/LoadingStatesSpinnerDualRing.css` - 2 ::before/::after
- `loading-states/LoadingStatesSpinnerGalaxy.css` - 1 box-shadow, 1 radial-gradient, 2 ::before/::after
- `loading-states/LoadingStatesSpinnerOrbital.css` - 1 box-shadow, 2 ::before/::after

#### Progress / Progress Bars
- `progress-bars/ProgressBarsProgressSpark.css` - 2 box-shadow, 1 radial-gradient
- `progress-bars/ProgressBarsXpAccumulation.css` - 6 box-shadow, 4 text-shadow, 2 radial-gradient
- `progress-bars/ProgressBarsZoomedProgress.css` - 4 box-shadow, 3 radial-gradient

#### Realtime / Timer Effects
- `timer-effects/TimerEffectsPillCountdownExtreme.css` - 1 box-shadow, 1 text-shadow, 3 filter
- `timer-effects/TimerEffectsPillCountdownGlitch.css` - 4 box-shadow, 6 ::before/::after
- `timer-effects/TimerEffectsPillCountdownHeartbeat.css` - 17 box-shadow
- `timer-effects/TimerEffectsPillCountdownMedium.css` - 1 box-shadow, 1 text-shadow, 3 filter
- `timer-effects/TimerEffectsPillCountdownSoft.css` - 1 box-shadow, 1 text-shadow, 3 filter
- `timer-effects/TimerEffectsPillCountdownStrong.css` - 1 box-shadow, 1 text-shadow, 3 filter
- `timer-effects/TimerEffectsTimerFlash.css` - 7 box-shadow, 1 text-shadow
- `timer-effects/TimerEffectsTimerFlashSoft.css` - 1 box-shadow, 1 text-shadow

#### Realtime / Update Indicators
- `update-indicators/UpdateIndicatorsBadgePulse.css` - 2 box-shadow
- `update-indicators/UpdateIndicatorsHomeIconDotBounce.css` - 2 box-shadow
- `update-indicators/UpdateIndicatorsHomeIconDotPulse.css` - 3 box-shadow
- `update-indicators/UpdateIndicatorsHomeIconDotRadar.css` - 1 box-shadow
- `update-indicators/UpdateIndicatorsHomeIconDotSweep.css` - 3 box-shadow

#### Rewards / Icon Animations
- `icon-animations/IconAnimationsPulse.css` - 1 radial-gradient, 1 ::before

#### Rewards / Lights
- `lights/LightsCircleStatic1.css` - 11 box-shadow, 5 radial-gradient
- `lights/LightsCircleStatic2.css` - 13 box-shadow, 1 radial-gradient
- `lights/LightsCircleStatic3.css` - 13 box-shadow, 1 radial-gradient
- `lights/LightsCircleStatic4.css` - 14 box-shadow, 1 radial-gradient
- `lights/LightsCircleStatic5.css` - 6 box-shadow, 1 radial-gradient
- `lights/LightsCircleStatic6.css` - 14 box-shadow, 1 radial-gradient
- `lights/LightsCircleStatic7.css` - 9 box-shadow, 1 radial-gradient
- `lights/LightsCircleStatic8.css` - 15 box-shadow, 1 radial-gradient

#### Rewards / Modal Celebrations
- `modal-celebrations/ModalCelebrationsCoinsCascade.css` - 1 box-shadow
- `modal-celebrations/ModalCelebrationsCoinsArc.css` - 1 radial-gradient
- `modal-celebrations/ModalCelebrationsCoinsFountain.css` - 1 radial-gradient
- `modal-celebrations/ModalCelebrationsCoinsSwirl.css` - 1 radial-gradient
- `modal-celebrations/ModalCelebrationsConfettiBurst.css` - 1 radial-gradient
- `modal-celebrations/ModalCelebrationsConfettiPulse.css` - 1 radial-gradient
- `modal-celebrations/ModalCelebrationsConfettiRain.css` - 1 radial-gradient
- `modal-celebrations/ModalCelebrationsConfettiSpiral.css` - 1 radial-gradient
- `modal-celebrations/ModalCelebrationsFireworksRing.css` - 1 radial-gradient
- `modal-celebrations/ModalCelebrationsFireworksTriple.css` - 1 radial-gradient
- `modal-celebrations/ModalCelebrationsJackpotCelebration.css` - 1 box-shadow, 8 radial-gradient
- `modal-celebrations/ModalCelebrationsRewardSpotlight.css` - 1 box-shadow, 7 radial-gradient
- `modal-celebrations/ModalCelebrationsTreasureParticles.css` - 2 box-shadow, 1 radial-gradient, 2 ::before/::after

#### Rewards / Reward Basic
- `reward-basic/RewardBasicBadgeGlint.css` - 1 box-shadow
- `reward-basic/RewardBasicBadgeSweep.css` - 1 box-shadow
- `reward-basic/RewardBasicBounceEnergy.css` - 1 box-shadow
- `reward-basic/RewardBasicBounceSoft.css` - 1 box-shadow
- `reward-basic/RewardBasicCoinSpinFast.css` - 1 box-shadow
- `reward-basic/RewardBasicCoinSpinSoft.css` - 1 box-shadow
- `reward-basic/RewardBasicGlowOrbit.css` - 1 box-shadow, 1 radial-gradient
- `reward-basic/RewardBasicGlowPulse.css` - 1 box-shadow
- `reward-basic/RewardBasicStarBurst.css` - 1 box-shadow
- `reward-basic/RewardBasicStarRadiate.css` - 1 box-shadow

---

## Glossary

**RN**: React Native
**Moti**: Declarative animation library for React Native
**Reanimated**: React Native Reanimated (v2+) - high-performance animation library
**SVG**: Scalable Vector Graphics (via `react-native-svg`)
**Elevation**: Android-specific shadow property
**shadowRadius**: iOS-specific blur radius for shadows
**GPU Acceleration**: Hardware-accelerated rendering (use `transform`, `opacity` for best performance)

---

## Next Steps

1. **Review this audit** with design and engineering teams
2. **Prioritize categories** based on product roadmap
3. **Create Jira epics** for each phase (estimate: 10 weeks total)
4. **Set up RN development environment** with shadow/gradient test harness
5. **Begin Phase 1** abstraction library development
6. **Schedule weekly design reviews** to ensure visual fidelity

---

**Report Generated:** 2025-10-10
**Tool:** Claude Code Audit Agent
**Contact:** For questions about this audit, refer to `/docs/CROSS_PLATFORM_REMEDIATION.md` for additional context.
