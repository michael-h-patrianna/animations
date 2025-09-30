# React Native Translation Review for src/components

This review maps every animation component in `src/components` to its React Native equivalent stack (Moti + Reanimated + react-native-linear-gradient + react-native-svg), calls out web-only CSS features, and provides concrete modification guidance to keep the visual intent on mobile.

Legend:
- Feasibility: Yes (straightforward) • Partial (needs adaptation) • Hard (requires SVG/masking or heavier perf budget)
- RN Stack: Moti/Reanimated/SVG/Gradient/Blur

Assumptions:
- Available libs: react-native-reanimated, moti, react-native-linear-gradient, react-native-svg, @react-native-community/blur (see `docs/REACT_NATIVE_ANIMATION_TRANSLATION_GUIDE.md`).
- Prefer transforms and opacity over layout properties; use SVG for masks/arcs; use LinearGradient for moving/animated gradients.

---

## Base › Button Effects

| Animation | Feasibility | RN stack | Web-only features likely | Modification guidance |
| --- | --- | --- | --- | --- |
| ButtonEffectsJitter | Yes | Moti (translate/rotate), Reanimated | — | Animate tiny translate/rotate with withRepeat; randomize delay for organic feel. |
| ButtonEffectsLiquidMorph | Yes | Moti + SVG (clip/morph) + Gradient | clip-path, gooey/filters | Replace CSS gooey/clip with SVG rounded-rect path; morph via animated `d` or simulate with scale + borderRadius; use LinearGradient fill. |
| ButtonEffectsRipple | Yes | Moti, SVG optional | radial-gradient | Use absolute circular view scaling from 0→1 with opacity fade; for multi-ripples, stagger repeats; Android ripple alternative if desired. |
| ButtonEffectsShockwave | Yes | Moti + Gradient/SVG | drop-shadow spread, filter | Use a blurred circular overlay (SVG or view with gradient) scaling out; on Android avoid colored shadows—use an extra gradient ring. |
| ButtonEffectsSplitReveal | Yes | Moti | clip-path | Split content into two wrappers (left/right) with `overflow: hidden`; animate translateX inward/outward; avoid clip-path entirely. |

## Base › Standard Effects

All are transform/opacity based and translate well. For 3D flips add `perspective` and `backfaceVisibility`.

| Animation | Feasibility | RN stack | Notes |
| --- | --- | --- | --- |
| Blink, Fade | Yes | Moti | Opacity keyframes. |
| Bounce, Pop, SoftPulse, Pulse, PulseWave, RadialPulse, Heartbeat | Yes | Moti (scale/translate) | Use spring/timing; for radial pulses use expanding circle overlay. |
| Float, Wiggle, Shake, Swing | Yes | Moti | Small translate/rotate with easing. |
| Spin | Yes | Reanimated (rotate) | withRepeat timing on rotate. |
| Scale, Squeeze | Yes | Moti | Scale sequences and easing. |
| Flip | Yes | Reanimated (rotateY/rotateX) | Add `transform: [{ perspective: 600 }]` and `backfaceVisibility: 'hidden'`. |
| Jello, RubberBand, Tada, MorphPulse | Yes | Moti | Combine scale + skew/rotate sequences; clamp values to avoid layout jumps. |
| Slide | Yes | Moti | Translate in desired axis; optional spring. |
| PulseCircle | Yes | Moti + SVG | If CSS uses outline/box-shadow radius, replace with SVG circle scaling and opacity. |

## Base › Text Effects

| Animation | Feasibility | RN stack | Web-only features likely | Modification guidance |
| --- | --- | --- | --- | --- |
| CharacterReveal, CharIndexDelays | Yes | Moti/AnimateableText | — | Split to chars; stagger `opacity/translateY`. |
| ComboCounter, CounterIncrement, XpNumberPop | Yes | Reanimated + AnimateableText | — | Interpolate numeric value; pop via scale. |
| GlitchText | Yes | Reanimated + layered Text | text-shadow, blend | Duplicate text layers with small translate/skew and color offsets; jitter via withSequence; avoid blend modes. |
| HorizonLightPass, LightSweepDraw, MetallicSpecularFlash | Yes | LinearGradient + Mask (SVG Text) | mask-composite, gradient masks | Use react-native-svg: <Text> filled by animated LinearGradient or SVG gradient; animate gradient stops/positions. |
| LevelBreakthrough | Yes | Moti | clip/mask | Use scale/translate + color change; if mask used on web, swap to SVG masked text. |
| Typewriter | Yes | AnimateableText | — | Reveal substring over time; add caret as separate View. |
| VerbFloat/Jog/Jump/Twirl/Flip/Reveal/WaveText/WaveReveal | Yes | Moti/Reanimated | — | Per-char transform with stagger; for wave, drive translateY by sin(time + index). |

## Dialogs › Modal Base

| Animation | Feasibility | RN stack | Web-only features likely | Modification guidance |
| --- | --- | --- | --- | --- |
| Flip3d | Yes | Reanimated (rotateY/X) | — | Add perspective; split front/back if needed. |
| GlitchDigital | Yes | Reanimated + layered views/text | blend, clip | Stack slices with tiny offsets, noise lines via thin Views; jitter transforms; avoid blend modes. |
| PortalSwirl | Yes | Reanimated + LinearGradient/SVG | radial gradients, masks | Use rotate+scale container; overlay animated radial gradient via SVG; no CSS masks. |
| RippleExpand (modal iris) | Yes | SVG clipPath or circular View | clip-path: circle | Use SVG ClipPath expanding circle to reveal; or wrap content in View with big `borderRadius` and scale from center. |
| ScaleCrisp/GentlePop/Hero | Yes | Moti | — | Scale + opacity; optional translate. |
| ShatterAssemble | Yes | SVG polygons + Reanimated | polygon clip, multiple masks | Predefine shards as SVG polygons; animate translate/rotate/opacity; or use image shards; consider Lottie if fidelity critical. |
| SlideDown/Up/Left/Right (Crisp/Soft) | Yes | Moti | — | Translate with easing; add shadow on entry. |
| SpringBounce | Yes | Moti spring | — | Spring params (damping, stiffness). |
| TvTurnOn | Yes | Reanimated | — | Sequence scaleY 0→1 with slight overshoot; add bloom via gradient overlay. |
| UnfoldOrigami | Yes | Nested Views with 3D rotates | complex 3D stacking | Build 2–3 nested panels rotating around edges; add perspective; limit layers for perf. |
| ZoomElastic | Yes | Moti spring | — | Scale spring with slight overshoot. |

Note: `dialogs/modal-base-framer/*` are Framer Motion analogues; use the same RN guidance as above.

## Dialogs › Modal Content

| Animation | Feasibility | RN stack | Web-only features likely | Modification guidance |
| --- | --- | --- | --- | --- |
| ButtonsStagger2/3 | Yes | Moti | — | Stagger children with delay index. |
| FormFieldGradient | Yes | LinearGradient | — | Use LinearGradient as background; animate colors with interpolateColor. |
| FormFieldLeft/RightReveal | Yes | Moti | — | Translate + opacity; focus ring as separate View. |
| ListSoftStagger | Yes | Moti | — | Staggered translate/opacity. |
| ListSpotlight | Yes | SVG radial gradient | radial-gradient | Overlay SVG RadialGradient following touch/scroll; animate center/opacity. |
| ListVerticalWipe | Yes | SVG mask or height | clip-path | Use animated height/translate + overflow: 'hidden'; or SVG rect mask expanding. |

## Dialogs › Modal Dismiss

| Animation | Feasibility | RN stack | Notes |
| --- | --- | --- | --- |
| SnackbarScale/Wipe | Yes | Moti | Scale/clip via container height; mask with SVG if needed. |
| ToastDrop/Raise/SlideLeft/SlideRight | Yes | Moti | Translate/opacity. |
| ToastFadeProgress | Yes | Moti + LinearGradient (bar) | Animate width and color of progress bar. |

## Dialogs › Modal Orchestration

| Animation | Feasibility | RN stack | Web-only features likely | Modification guidance |
| --- | --- | --- | --- | --- |
| ComparisonMorph | Yes | Moti/SVG | clip-path | Crossfade + transform; if shape morph used, swap to SVG path morph or rounded-rect scale. |
| FlipReveal | Yes | Reanimated | — | RotateY + stagger content. |
| GridHighlight | Yes | Moti | — | Animate background/scale of selected cell. |
| MagneticHover | Yes | Reanimated + Gesture | pointer hover | Replace hover with Pan/gesture proximity; compute distance-based translate/scale. |
| MultiStepProgressive | Yes | Orchestrated Moti | — | Sequence screens with delays. |
| SelectionGrid | Yes | Moti | — | Scale/opacity with selection. |
| SpringPhysics | Yes | Moti spring | — | Springs on enter/exit. |
| StaggerInview | Yes | Reanimated + onScroll | intersection observer | Use Animated.ScrollView and item visibility thresholds to trigger. |
| TabMorph | Yes | Reanimated + SVG underline | mask/morph | Animate underline width/position; avoid complex morphs unless using SVG path. |
| TabSlide | Yes | Moti | — | Translate active content. |
| Wizard FadeCross/ScaleRotate/SlideStack | Yes | Moti | — | Switch transitions with shared container. |

## Misc

| Animation | Feasibility | RN stack | Web-only features likely | Modification guidance |
| --- | --- | --- | --- | --- |
| MiscConcentricRings | Yes | Moti/SVG | — | Use multiple SVG circles scaling/fading. |
| MiscOrbitalPulse | Yes | Reanimated | — | Rotate container; pulse via scale. |
| MiscOscillatingDots | Yes | Moti | — | TranslateY sinusoidal with phase offsets. |
| MiscPendulumWave | Yes | Reanimated | transform-origin | Simulate pivot by translating to pivot point, rotate, then translate back; precompute offsets. |
| MiscPulsingGrid | Yes | Moti | — | Staggered scale/opacity in grid. |
| MiscSequentialPulse | Yes | Moti | — | Delay chain of pulses. |
| MiscSpiralGalaxy | Yes | Reanimated + SVG | many particles | Use batched particles (limit count), rotate + radial drift; consider offloading to Lottie if heavy. |

## Progress › Loading States

| Animation | Feasibility | RN stack | Web-only features likely | Modification guidance |
| --- | --- | --- | --- | --- |
| DotsPortal, DotsRise | Yes | Moti | — | Scale/translate dots with stagger. |
| RingMulti | Yes | SVG | conic gradients | Use SVG arcs with stroke animation; animate strokeDashoffset for sweep. |
| RingProgress | Yes | SVG | — | Circle with strokeDasharray/offset driven by value. |
| Skeleton* (Card/Horizontal/Tile/Vertical) | Yes | LinearGradient | — | Shimmer via animated gradient translateX. |
| SpinnerDualRing | Yes | SVG or Views | border-based spinners | Use two SVG arcs rotating; or two Views with masked borders and rotation. |
| SpinnerGalaxy/Orbital | Yes | Reanimated | many particles | Rotate groups and fade; cap particle count for perf. |

## Progress › Progress Bars

| Animation | Feasibility | RN stack | Web-only features likely | Modification guidance |
| --- | --- | --- | --- | --- |
| ProgressBounce, Thin | Yes | Moti | — | Animate width/scaleX; add bounce on updates. |
| ProgressGradient | Yes | LinearGradient | — | Animate `colors` via interpolateColor; or move gradient start/end. |
| ProgressMilestones | Yes | Moti | — | Multiple segments fill with delays. |
| ProgressSegmented | Yes | Moti | — | Discrete bar pieces; animate each. |
| ProgressSpark | Yes | Moti + Gradient | additive glow | Animate a small gradient dot along the bar; add glow overlay (no blend modes). |
| ProgressStriped | Yes | SVG pattern or image | repeating-linear-gradient | Use SVG pattern for stripes or a tiling image; animate translateX for marching effect. |
| TimelineProgress | Yes | Moti/SVG | — | Step-wise progress across items; draw line with SVG if needed. |
| XpAccumulation | Yes | Moti | — | Animate chunked increments with pop effects. |
| ZoomedProgress | Yes | Moti | — | Scale container + bar together; keep rounded caps via padding. |

## Realtime

| Animation | Feasibility | RN stack | Web-only features likely | Modification guidance |
| --- | --- | --- | --- | --- |
| RealtimeDataLeaderboardShift | Yes | Reanimated Layout + Moti | — | Use Reanimated Layout Transitions for reorder and color flashes. |
| RealtimeDataLiveScoreUpdate | Yes | Moti | — | Brief scale/opacity color pulse. |
| RealtimeDataStackedRealtime | Yes | Moti | — | Stagger enters/exits; use Layout for reflows. |
| RealtimeDataWinTicker | Yes | Reanimated | — | Looping translateX marquee; pause on interaction. |

## Realtime › Timer Effects

| Animation | Feasibility | RN stack | Web-only features likely | Modification guidance |
| --- | --- | --- | --- | --- |
| PillCountdownSoft/Medium/Strong/Extreme/Heartbeat/Glitch | Yes | Moti + LinearGradient | — | Scale/opacity + color changes; glitch via small jitter and layer offsets. |
| TimerColorShift | Yes | LinearGradient | — | Animate gradient colors over time. |
| TimerFlash/FlashSoft | Yes | Moti | — | Opacity/scale pulses timed to seconds. |
| TimerFlip | Yes | Reanimated 3D | complex 3D half-card | Build top/bottom halves rotating with perspective; sync digit changes mid-flip. |
| TimerPulse | Yes | Moti | — | Scale pulses with easing. |

## Realtime › Update Indicators

| Animation | Feasibility | RN stack | Web-only features likely | Modification guidance |
| --- | --- | --- | --- | --- |
| BadgePop, BadgePulse | Yes | Moti | — | Scale/opacity. |
| HomeIconDotBounce/Pulse | Yes | Moti | — | Small translate/scale of dot overlay. |
| HomeIconDotRadar | Yes | Moti | — | Expanding rings via scale+opacity; render multiple with stagger. |
| HomeIconDotSweep | Partial | LinearGradient/SVG | gradient sweep | Use small gradient arc or SVG wedge sweeping around; animate rotation. |
| LivePing | Yes | Moti | — | Scale+opacity pulsing ring. |

## Rewards › Icon Animations

| Animation | Feasibility | RN stack | Notes |
| --- | --- | --- | --- |
| Bounce, Float, Pulse, Shake | Yes | Moti | Standard transforms; add subtle shadows separately. |

## Rewards › Modal Celebrations (Particles/Confetti/Fireworks)

These are all feasible but require attention to particle counts and batching. Prefer SVG circles/paths or simple Views for particles; limit to ~30–80 on low-end devices.

| Animation | Feasibility | RN stack | Web-only features likely | Modification guidance |
| --- | --- | --- | --- | --- |
| CoinCascade/Trail/Arc/Fountain/Swirl/MultiCoin | Yes | Moti + Reanimated + SVG | motion paths, shadows | Use parametric paths with `withTiming`/`withDecay`; pre-generate trajectories; use small PNG/SVG sprites; avoid heavy drop-shadows. |
| ConfettiBurst/Pulse/Rain/Spiral | Yes | Moti + SVG | blend, masks | Rectangles/triangles with random spins; pool/reuse items; avoid blend modes—use solid colors or gradients. |
| FireworksRing/Triple | Yes | Moti + SVG | additive blending | Launch arcs then radial bursts with particles; simulate glow via gradient circles. |
| JackpotCelebration | Yes | Orchestration of many effects | — | Compose from simpler effects above; cap particle count; consider Lottie for parity. |
| RewardSpotlight | Yes | SVG radial gradient | radial-gradient | Overlay SVG radial gradient spotlight; animate center/opacity. |
| TreasureParticles | Yes | Moti + SVG | many particles | Similar to confetti; batch and reuse. |

## Rewards › Reward Basic

| Animation | Feasibility | RN stack | Web-only features likely | Modification guidance |
| --- | --- | --- | --- | --- |
| BadgeGlint/BadgeSweep | Yes | LinearGradient + SVG/Text mask | gradient mask | Mask text/icon with animated gradient sweep using SVG; or overlay animated gradient bar clipped to icon bounds. |
| BounceEnergy/BounceSoft | Yes | Moti | — | Scale/translate with slight rotation. |
| CoinSpinFast/Soft | Yes | Reanimated 3D | — | RotateY with perspective; if sprite sheet was used on web, replace with 3D rotate + shading overlay. |
| GlowOrbit/GlowPulse | Yes | Moti + Gradient overlay | colored shadows | Use blurred gradient circle behind element; on Android avoid shadowColor—use extra view. |
| StarBurst/StarRadiate | Yes | SVG lines/polygons | box-shadow/radial | Draw rays as SVG lines scaling/fading; add small gradient dots on tips.

---

## Cross-cutting web features and how to replace them

- CSS filter (blur, drop-shadow): Prefer BlurView for static background; for glows use gradient circles, not colored shadows (Android).
- clip-path/masks: Use react-native-svg ClipPath/Mask and animate path/rect size; or replace with nested Views + overflow hidden and height/width/translate animations.
- conic/radial gradients: Use react-native-svg gradients; LinearGradient (library) is only linear.
- repeating-linear-gradient (stripes): Use SVG patterns or a tiling image; animate translate for motion.
- 3D transforms/perspective: Supported via `transform` in RN; always include `perspective` for rotateX/rotateY; set `backfaceVisibility: 'hidden'` for flips.
- blend modes/mix-blend-mode: Not available; simulate by layering solid/gradient overlays with adjusted alpha; avoid reliance on screen/additive blending.

## Minimal code templates (copy-ready)

- Circular ripple (button): MotiView absolute, scale 0→1, opacity 0.35→0.
- Radial pulse/radar: render N circles with staggered looped scale/opacity transitions.
- Gradient sweep over text/icon: SVG Text or MaskedView + animated gradient x-position or colors.
- Ring progress: SVG Circle with strokeDasharray = 2πr, strokeDashoffset = (1 - progress)*circumference.
- 3D flip: `transform: [{ perspective: 600 }, { rotateY: `${angle}deg` }]` with backface hidden.

## Performance guidance

- Cap particles (≤ 60 low-end, ≤ 120 high-end). Pool and reuse.
- Prefer transforms/opacity; avoid animating width/height except for simple reveals.
- Use Reanimated worklets; avoid JS timers for long-running loops.
- Test on Android for shadows; prefer gradient glows instead of shadowColor anims.

## Next steps

- Pick 3–5 representative effects to prototype in RN (e.g., ProgressStriped with SVG pattern, ModalBaseRippleExpand with SVG ClipPath, TextEffectsGlitchText layered approach).
- Establish shared primitives: Ripple, GradientSweep, RingProgress, ParticlePool.
- Validate perf targets (60fps) on a mid-tier Android device.

---

This document covers all animations under `src/components` and indicates their RN translation path with required adaptations to preserve the intended visuals.
