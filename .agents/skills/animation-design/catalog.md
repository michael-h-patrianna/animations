# Animation Technique Catalog

This catalog indexes 198 **example animations** organized by technique. Use them as inspiration and technical reference when creating new animations for the showcase. They demonstrate motion patterns, easing curves, timing strategies, and composition approaches. They are NOT importable components.

## How to Use This Catalog

1. Read the user's animation request and identify which motion technique applies
2. Browse the catalog below for examples that use a similar technique
3. Open the reference file to study the implementation (both `framer/` and `css/` variants exist)
4. Extract the technique — curves, timing, keyframes, layering — then design your new animation from scratch

## Category Map

| Category | Groups | Typical Use |
|-|-|-|
| Base | Button Effects, Standard Effects, Text Effects | Foundation primitives: entrances, exits, attention, feedback |
| Dialogs | Modal Base, Modal Content, Modal Dismiss, Modal Orchestration | Modal/panel enter, exit, content reveal, multi-element coordination |
| Progress | Loading States, Progress Bars | Spinners, skeletons, progress visualizations |
| Realtime | Timer Effects, Update Indicators, Realtime Data | Countdowns, notifications, live data displays |
| Rewards | Reveal Effects, Modal Celebrations, Collection Effects, Icon Animations, Lights | Prize reveals, celebrations, particle effects, carnival lights |
| Content | Card Interactions | Hover, click, focus effects for card UI |

---

## Base — Foundation Techniques

### Button Effects
Interactive feedback patterns for clickable/tappable elements.

| Technique | What It Demonstrates | Reference |
|-|-|-|
| Jitter | Continuous scale+rotate loop with heartbeat hover swap | `reference/base/button-effects/framer/ButtonEffectsJitter.tsx` |
| Liquid Morph | Elastic blob deformation on click | `reference/base/button-effects/framer/ButtonEffectsLiquidMorph.tsx` |
| Press Squash | Vertical compression + horizontal stretch | `reference/base/button-effects/framer/ButtonEffectsPressSquash.tsx` |
| Reward Ready Pulse | Gentle breathing scale pulse | `reference/base/button-effects/framer/ButtonEffectsRewardReadyPulse.tsx` |
| Ripple | Material-style expanding circle from click point | `reference/base/button-effects/framer/ButtonEffectsRipple.tsx` |
| Shockwave | Concentric rings expanding outward | `reference/base/button-effects/framer/ButtonEffectsShockwave.tsx` |
| Split Reveal | Button splits open to show content underneath | `reference/base/button-effects/framer/ButtonEffectsSplitReveal.tsx` |
| Shake Gentle | Subtle horizontal oscillation | `reference/base/button-effects/framer/ButtonFeedbackShakeGentle.tsx` |

### Standard Effects
Foundational motion primitives — entrance, exit, attention, and looping patterns.

| Technique | What It Demonstrates | Reference |
|-|-|-|
| Blink | Rapid opacity flash | `reference/base/standard-effects/framer/StandardEffectsBlink.tsx` |
| Bounce | Vertical bounce with squash-stretch + tilt | `reference/base/standard-effects/framer/StandardEffectsBounce.tsx` |
| Fade | Simple opacity 0 to 1 | `reference/base/standard-effects/framer/StandardEffectsFade.tsx` |
| Flip | Y-axis rotation with shadow + scale | `reference/base/standard-effects/framer/StandardEffectsFlip.tsx` |
| Float | Gentle Y sine wave + subtle rotation | `reference/base/standard-effects/framer/StandardEffectsFloat.tsx` |
| Heartbeat | Double-pulse scale rhythm | `reference/base/standard-effects/framer/StandardEffectsHeartbeat.tsx` |
| Jello | Wobble deformation with ripple-through | `reference/base/standard-effects/framer/StandardEffectsJello.tsx` |
| Pop | Scale overshoot + rotation twist | `reference/base/standard-effects/framer/StandardEffectsPop.tsx` |
| Pulse | Scale pulse + opacity fade + glow | `reference/base/standard-effects/framer/StandardEffectsPulse.tsx` |
| Pulse Circle | Breathing core + staggered outward ripple rings | `reference/base/standard-effects/framer/StandardEffectsPulseCircle.tsx` |
| Pulse Wave | Filled core + expanding ring glow | `reference/base/standard-effects/framer/StandardEffectsPulseWave.tsx` |
| Radial Pulse | Concentric ripple pulses from center | `reference/base/standard-effects/framer/StandardEffectsRadialPulse.tsx` |
| Rubber Band | Elastic stretch with edge vibration | `reference/base/standard-effects/framer/StandardEffectsRubberBand.tsx` |
| Scale | Clean scale 0 to 1 without bounce | `reference/base/standard-effects/framer/StandardEffectsScale.tsx` |
| Shake | Horizontal shake + rotation wobble | `reference/base/standard-effects/framer/StandardEffectsShake.tsx` |
| Slide | Linear off-screen slide entrance | `reference/base/standard-effects/framer/StandardEffectsSlide.tsx` |
| Soft Pulse | Gentle breathing + soft glow aura | `reference/base/standard-effects/framer/StandardEffectsSoftPulse.tsx` |
| Spin | 360 degree rotation + midpoint scale pulse | `reference/base/standard-effects/framer/StandardEffectsSpin.tsx` |
| Squeeze | Compression squash effect | `reference/base/standard-effects/framer/StandardEffectsSqueeze.tsx` |
| Swing | Pendulum arc with momentum lean | `reference/base/standard-effects/framer/StandardEffectsSwing.tsx` |
| Tada | Scale + rotation celebration combo | `reference/base/standard-effects/framer/StandardEffectsTada.tsx` |
| Wiggle | Rotation oscillation + scale breathing | `reference/base/standard-effects/framer/StandardEffectsWiggle.tsx` |

### Text Effects
Text-specific animation techniques — reveals, counters, decorative effects.

| Technique | What It Demonstrates | Reference |
|-|-|-|
| Character Reveal | Layered shadows + per-character scale stagger | `reference/base/text-effects/framer/TextEffectsCharacterReveal.tsx` |
| Combo Counter | Counting + milestone particles + celebration | `reference/base/text-effects/framer/TextEffectsComboCounter.tsx` |
| Counter Increment | Numeric tick upward with scale | `reference/base/text-effects/framer/TextEffectsCounterIncrement.tsx` |
| Epic Win | Metallic 3D text + rotating entrance | `reference/base/text-effects/framer/TextEffectsEpicWin.tsx` |
| Glitch Text | RGB channel separation + scan line artifacts | `reference/base/text-effects/css/TextEffectsGlitchText.tsx` |
| Horizon Light Pass | Horizontal light band sweeps across text | `reference/base/text-effects/framer/TextEffectsHorizonLightPass.tsx` |
| Level Breakthrough | Frame shake + surge lines explosion | `reference/base/text-effects/framer/TextEffectsLevelBreakthrough.tsx` |
| Light Sweep Draw | Left-to-right cinematic letter highlight | `reference/base/text-effects/framer/TextEffectsLightSweepDraw.tsx` |
| Metallic Specular Flash | Crisp metallic highlight sweep | `reference/base/text-effects/framer/TextEffectsMetallicSpecularFlash.tsx` |
| Typewriter | Terminal-style character-by-character typing | `reference/base/text-effects/framer/TextEffectsTypewriter.tsx` |
| Wave Reveal | Staggered wave from bottom | `reference/base/text-effects/framer/TextEffectsWaveReveal.tsx` |
| Wave Text | Undulating wave through characters | `reference/base/text-effects/framer/TextEffectsWaveText.tsx` |
| XP Number Pop | Count-up with pop easing | `reference/base/text-effects/framer/TextEffectsXPNumberPop.tsx` |
| Verb Animations | Per-letter float, jog, jump, fall, flip, twirl | `reference/base/text-effects/framer/TextEffectsVerbFloating.tsx` (and Jogging, Jumping, Falling, Flipping, Twirling) |

---

## Rewards — Prize & Reward Techniques

### Reveal Effects
Prize/reward revelation patterns.

| Technique | What It Demonstrates | Reference |
|-|-|-|
| Card Flip Smooth | 3D Y-axis flip revealing hidden content | `reference/rewards/reveal-effects/framer/RevealEffectsCardFlipSmooth.tsx` |
| Anticipation Shake | Intensity-building shake before reveal | `reference/rewards/reveal-effects/framer/RevealEffectsAnticipationShake.tsx` |
| Badge Scale Shine | Scale bounce + shine sweep on badge | `reference/rewards/reveal-effects/framer/AchievementRevealsBadgeScaleShine.tsx` |
| Card Fan Reveal | Three cards fan out from central stack | `reference/rewards/reveal-effects/framer/RewardsRevealEffectsCardFanReveal.tsx` |
| Card Shimmer | Diagonal light shimmer on card appearance | `reference/rewards/reveal-effects/framer/RewardsRevealEffectsCardShimmer.tsx` |
| Card Slide Up | Spring bounce slide from hidden slot | `reference/rewards/reveal-effects/framer/RewardsRevealEffectsCardSlideUp.tsx` |
| Card Spin 3D | 360 degree Y-axis spin + scale up | `reference/rewards/reveal-effects/framer/RewardsRevealEffectsCardSpin3D.tsx` |
| Chest Bounce Open | Bounce anticipation before opening | `reference/rewards/reveal-effects/framer/RewardsRevealEffectsChestBounceOpen.tsx` |
| Chest Glow Open | Light beams emit before chest opens | `reference/rewards/reveal-effects/framer/RewardsRevealEffectsChestGlowOpen.tsx` |
| Chest Lid Open | Standard lid-lifting animation | `reference/rewards/reveal-effects/framer/RewardsRevealEffectsChestLidOpen.tsx` |
| Gift Box Unwrap | Lid lift + ribbon fade | `reference/rewards/reveal-effects/framer/RewardsRevealEffectsGiftBoxUnwrap.tsx` |
| Orb Shatter | Magical orb breaks apart | `reference/rewards/reveal-effects/framer/RewardsRevealEffectsOrbShatter.tsx` |
| Prize Float Land | Prize descends and lands softly | `reference/rewards/reveal-effects/framer/RewardsRevealEffectsPrizeFloatLand.tsx` |
| Prize Pop | Energetic pop-in scale entrance | `reference/rewards/reveal-effects/framer/RewardsRevealEffectsPrizePop.tsx` |
| Prize Rays | Rotating light rays behind prize | `reference/rewards/reveal-effects/framer/RewardsRevealEffectsPrizeRays.tsx` |

### Modal Celebrations
Full-screen celebration effects.

| Technique | What It Demonstrates | Reference |
|-|-|-|
| Coin Arc Fountain | Coins arc upward in fountain pattern | `reference/rewards/modal-celebrations/framer/ModalCelebrationCoinsArc.tsx` |
| Coin Fountain | Coins spray upward from center | `reference/rewards/modal-celebrations/framer/ModalCelebrationCoinsFountain.tsx` |
| Confetti Burst | Explosive confetti from center point | `reference/rewards/modal-celebrations/framer/ModalCelebrationConfettiBurst.tsx` |
| Confetti Rainfall | Confetti falling from top | `reference/rewards/modal-celebrations/framer/ModalCelebrationConfettiRain.tsx` |
| Confetti Spiral | Spiraling confetti pattern | `reference/rewards/modal-celebrations/framer/ModalCelebrationConfettiSpiral.tsx` |
| Fireworks Halo | Fireworks ring around focal point | `reference/rewards/modal-celebrations/framer/ModalCelebrationFireworksRing.tsx` |
| Fireworks Triple Burst | Three sequential firework explosions | `reference/rewards/modal-celebrations/framer/ModalCelebrationFireworksTriple.tsx` |
| Treasure Particles | Glowing treasure particles | `reference/rewards/modal-celebrations/framer/ModalCelebrationTreasureParticles.tsx` |

### Collection Effects
Reward gathering/collecting patterns.

| Technique | What It Demonstrates | Reference |
|-|-|-|
| Coin Burst | Coins explode outward from source | `reference/rewards/collection-effects/framer/CollectionEffectsCoinBurst.tsx` |
| Coin Magnet | Coins pulled toward collection point | `reference/rewards/collection-effects/framer/CollectionEffectsCoinMagnet.tsx` |

### Icon Animations
Prize/reward icon motion patterns.

| Technique | What It Demonstrates | Reference |
|-|-|-|
| Badge Pop Rotate | Scale bounce + rotation for badge | `reference/rewards/icon-animations/framer/IconAnimationsBadgePopRotate.tsx` |
| Bounce | Squash-stretch vertical bounce | `reference/rewards/icon-animations/framer/IconAnimationsBounce.tsx` |
| Float | Gentle vertical sine wave | `reference/rewards/icon-animations/framer/IconAnimationsFloat.tsx` |
| Pulse | Scale pulse + glow | `reference/rewards/icon-animations/framer/IconAnimationsPulse.tsx` |
| Shake | Horizontal wobble | `reference/rewards/icon-animations/framer/IconAnimationsShake.tsx` |

### Lights
Circular light chase patterns.

| Technique | What It Demonstrates | Reference |
|-|-|-|
| Alternating Carnival | Even/odd bulb alternation | `reference/rewards/lights/framer/LightsCircleStatic1.tsx` |
| Sequential Chase | Single lit bulb rotation | `reference/rewards/lights/framer/LightsCircleStatic2.tsx` |
| Accelerating Spin | Start slow, speed up, decelerate | `reference/rewards/lights/framer/LightsCircleStatic3.tsx` |
| Reverse Chase Pulse | Counter-clockwise then clockwise | `reference/rewards/lights/framer/LightsCircleStatic4.tsx` |
| Random Sparkle | Unpredictable twinkling | `reference/rewards/lights/framer/LightsCircleStatic5.tsx` |
| Carnival Waltz | Groups of 3 in waltz rhythm | `reference/rewards/lights/framer/LightsCircleStatic6.tsx` |
| Comet Trail | Bright head with fading trail | `reference/rewards/lights/framer/LightsCircleStatic7.tsx` |
| Dual Convergence | Two lights from opposite sides | `reference/rewards/lights/framer/LightsCircleStatic8.tsx` |

---

## Dialogs — Modal & Panel Techniques

### Modal Base
Modal entrance and exit animation patterns.

| Technique | What It Demonstrates | Reference |
|-|-|-|
| Gentle Scale Pop | 88% to 105% to 100% scale + blur + overlay fade | `reference/dialogs/modal-base/framer/ModalBaseScaleGentlePop.tsx` |
| Slide Up Soft | 64px translate + blur + overlay | `reference/dialogs/modal-base/framer/ModalBaseSlideUpSoft.tsx` |
| Slide Down | 60px top-down + overlay | `reference/dialogs/modal-base/framer/ModalBaseSlideDownSoft.tsx` |
| Spring Bounce | Spring physics + dynamic bounce | `reference/dialogs/modal-base/framer/ModalBaseSpringBounce.tsx` |
| Elastic Zoom | Zoom with elastic bounce + overshoot | `reference/dialogs/modal-base/framer/ModalBaseZoomElastic.tsx` |
| 3D Card Flip | Card-game rotation with perspective | `reference/dialogs/modal-base/framer/ModalBaseFlip3D.tsx` |
| Portal Swirl | Fantasy vortex spiral entrance | `reference/dialogs/modal-base/framer/ModalBasePortalSwirl.tsx` |
| CRT TV Turn On | Horizontal-to-vertical retro expansion | `reference/dialogs/modal-base/framer/ModalBaseTvTurnOn.tsx` |
| Digital Glitch | RGB channel separation + distortion | `reference/dialogs/modal-base/framer/ModalBaseGlitchDigital.tsx` |
| Origami Unfold | Sequential axis expansion | `reference/dialogs/modal-base/framer/ModalBaseUnfoldOrigami.tsx` |
| Shatter Assembly | Glass fragments coalesce | `reference/dialogs/modal-base/framer/ModalBaseShatterAssemble.tsx` |
| Material Ripple | Radiating wave expansion | `reference/dialogs/modal-base/framer/ModalBaseRippleExpand.tsx` |

### Modal Content
Content reveal patterns inside modals/panels.

| Technique | What It Demonstrates | Reference |
|-|-|-|
| Button Stagger x2/x3 | Clustered button entrance stagger | `reference/dialogs/modal-content/framer/ModalContentButtonsStagger2.tsx` |
| Form Gradient Sweep | Gradient sweep across form fields | `reference/dialogs/modal-content/framer/ModalContentFormFieldGradient.tsx` |
| Form Fields Left/Right | Fields slide in from side | `reference/dialogs/modal-content/framer/ModalContentFormFieldLeftReveal.tsx` |
| List Soft Stagger | 60ms offset sequential list reveal | `reference/dialogs/modal-content/framer/ModalContentListSoftStagger.tsx` |
| List Vertical Wipe | Panel wipe across list items | `reference/dialogs/modal-content/framer/ModalContentListVerticalWipe.tsx` |

### Modal Dismiss
Exit/close animation patterns.

| Technique | What It Demonstrates | Reference |
|-|-|-|
| Snackbar Scale Pulse | Scale recede + timer depletion | `reference/dialogs/modal-dismiss/framer/ModalDismissSnackbarScale.tsx` |
| Snackbar Wipe | Horizontal wipe with progress | `reference/dialogs/modal-dismiss/framer/ModalDismissSnackbarWipe.tsx` |
| Toast Drop/Rise | Vertical slide with auto-dismiss | `reference/dialogs/modal-dismiss/framer/ModalDismissToastDrop.tsx` |
| Toast Fade Progress | Soft fade + progress bar depletion | `reference/dialogs/modal-dismiss/framer/ModalDismissToastFadeProgress.tsx` |
| Toast Slide Left/Right | Horizontal slide with auto-dismiss | `reference/dialogs/modal-dismiss/framer/ModalDismissToastSlideLeft.tsx` |

### Modal Orchestration
Multi-element coordinated animation patterns.

| Technique | What It Demonstrates | Reference |
|-|-|-|
| Comparison Tiles | Side-by-side morph transitions | `reference/dialogs/modal-orchestration/framer/ModalOrchestrationComparisonMorph.tsx` |
| 3D Flip Reveal | Tiles with 3D flip to reveal hidden content | `reference/dialogs/modal-orchestration/framer/ModalOrchestrationFlipReveal.tsx` |
| Grid Highlight | Highlight sweep + staggered entrance | `reference/dialogs/modal-orchestration/framer/ModalOrchestrationGridHighlight.tsx` |
| Magnetic Hover | Cursor-proximity magnetic attraction | `reference/dialogs/modal-orchestration/framer/ModalOrchestrationMagneticHover.tsx` |
| Grid Tile Cascade | Cascading entrance across grid | `reference/dialogs/modal-orchestration/framer/ModalOrchestrationSelectionGrid.tsx` |
| Spring Physics Tiles | Spring-based gesture interactions | `reference/dialogs/modal-orchestration/framer/ModalOrchestrationSpringPhysics.tsx` |
| Stagger In-View | Viewport-triggered progressive entrance | `reference/dialogs/modal-orchestration/framer/ModalOrchestrationStaggerInview.tsx` |
| Tab Morph Tiles | Sliding content transitions on tab selection | `reference/dialogs/modal-orchestration/framer/ModalOrchestrationTabMorph.tsx` |
| Wizard Step Tiles | Multi-step wizard with panel transitions | `reference/dialogs/modal-orchestration/framer/ModalOrchestrationWizardFadeCross.tsx` (and SlideStack, ScaleRotate) |

---

## Progress — Loading & Progress Techniques

### Loading States
Placeholder and spinner patterns during content loading.

| Technique | What It Demonstrates | Reference |
|-|-|-|
| Dots Rise | Three-dot rise cadence | `reference/progress/loading-states/framer/LoadingStatesDotsRise.tsx` |
| Dots Portal | Dots fold into portal center | `reference/progress/loading-states/framer/LoadingStatesDotsPortal.tsx` |
| Skeleton Variants | Shimmer placeholder layouts (horizontal, vertical, tile, card) | `reference/progress/loading-states/framer/LoadingStatesSkeletonHorizontal.tsx` |
| Spinner Dual Ring | Dual ring consistent velocity | `reference/progress/loading-states/framer/LoadingStatesSpinnerDualRing.tsx` |
| Spinner Galaxy | Layered opacity twirls | `reference/progress/loading-states/framer/LoadingStatesSpinnerGalaxy.tsx` |
| Spinner Orbital | Orbital around center mass | `reference/progress/loading-states/framer/LoadingStatesSpinnerOrbital.tsx` |
| Ring Progress | Ring fill 0 to 100% | `reference/progress/loading-states/framer/LoadingStatesRingProgress.tsx` |
| Ring Multi | Nested asynchronous rings | `reference/progress/loading-states/framer/LoadingStatesRingMulti.tsx` |

### Progress Bars
Linear progress visualization techniques — 30+ variants.

| Technique | What It Demonstrates | Reference |
|-|-|-|
| Elastic Fill | Overshoot fill with settle | `reference/progress/progress-bars/framer/ProgressBarsElasticFill.tsx` |
| Glow Trail | Pulsing glow at leading edge | `reference/progress/progress-bars/framer/ProgressBarsGlowTrail.tsx` |
| Milestone Unlock | Icons unlock as progress passes | `reference/progress/progress-bars/framer/ProgressBarsMilestoneUnlock.tsx` |
| Celebration Burst | Burst effects at milestones | `reference/progress/progress-bars/framer/ProgressBarsCelebrationBurst.tsx` |
| Boss Health | Damage delay health bar effect | `reference/progress/progress-bars/framer/ProgressBarsBossHealth.tsx` |
| Coin Trail | Coins collected along fill | `reference/progress/progress-bars/framer/ProgressBarsCoinTrail.tsx` |
| Crystal Nodes | Crystals charge with energy flow | `reference/progress/progress-bars/framer/ProgressBarsCrystalNodes.tsx` |
| XP Accumulation | Point accumulation + multiplier zone | `reference/progress/progress-bars/framer/ProgressBarsXpAccumulation.tsx` |
| Liquid Tube | Fluid filling with bubbles | `reference/progress/progress-bars/framer/ProgressBarsLiquidTube.tsx` |
| Journey Map | Avatar traveling path with nodes | `reference/progress/progress-bars/framer/ProgressBarsJourneyMap.tsx` |
| Shimmer Sweep | Premium shimmer across fill | `reference/progress/progress-bars/framer/ProgressBarsShimmerSweep.tsx` |
| Neon Pulse | Cyberpunk flickering bar | `reference/progress/progress-bars/framer/ProgressBarsNeonPulse.tsx` |
| Retro Bit | 8-bit segmented style | `reference/progress/progress-bars/framer/ProgressBarsRetroBit.tsx` |
| Gradient Glide / Striped / Segmented / Thin | Simpler progress bar variants | `reference/progress/progress-bars/framer/ProgressBarsGradient.tsx` |

---

## Realtime — Live Data & Timer Techniques

### Timer Effects
Countdown and time-pressure animation patterns.

| Technique | What It Demonstrates | Reference |
|-|-|-|
| Pill Countdown Extreme | Quiet until 10s, stepwise color, 3-2-1 buzz | `reference/realtime/timer-effects/framer/TimerEffectsPillCountdownExtreme.tsx` |
| Pill Countdown Glitch | Glitch intensifying as time expires | `reference/realtime/timer-effects/framer/TimerEffectsPillCountdownGlitch.tsx` |
| Pill Countdown Heartbeat | Heartbeat intensifying to expiry | `reference/realtime/timer-effects/framer/TimerEffectsPillCountdownHeartbeat.tsx` |
| Pill Countdown Strong | Segmented bar + snap ticks under 15s | `reference/realtime/timer-effects/framer/TimerEffectsPillCountdownStrong.tsx` |
| Timer Color Shift | Green to yellow to red transition | `reference/realtime/timer-effects/framer/TimerEffectsTimerColorShift.tsx` |
| Timer Flip | Flip animation on digit changes | `reference/realtime/timer-effects/framer/TimerEffectsTimerFlip.tsx` |
| Timer Pulse | Continuous pulse animation | `reference/realtime/timer-effects/framer/TimerEffectsTimerPulse.tsx` |
| Flash Expire | Color transition + pulse urgency | `reference/realtime/timer-effects/framer/TimerEffectsTimerFlash.tsx` |
| Urgent Pulse | Fast pulse + color shift | `reference/realtime/timer-effects/framer/TimerEffectsUrgentPulse.tsx` |

### Update Indicators
Notification and data-change indicator patterns.

| Technique | What It Demonstrates | Reference |
|-|-|-|
| Badge Pop/Pulse | Notification badge entrance | `reference/realtime/update-indicators/framer/UpdateIndicatorsBadgePop.tsx` |
| Live Ping | Ping loop for streams | `reference/realtime/update-indicators/framer/UpdateIndicatorsLivePing.tsx` |
| Dot Pulse/Bounce/Radar/Sweep | Various dot notification styles | `reference/realtime/update-indicators/framer/UpdateIndicatorsHomeIconDotPulse.tsx` |

### Realtime Data
Live data display animation patterns.

| Technique | What It Demonstrates | Reference |
|-|-|-|
| Leaderboard Shift | Position change animation | `reference/realtime/realtime-data/framer/RealtimeDataLeaderboardShift.tsx` |
| Live Score Update | Score change animation | `reference/realtime/realtime-data/framer/RealtimeDataLiveScoreUpdate.tsx` |
| Stacked Pulse | Stacked data pulse pattern | `reference/realtime/realtime-data/framer/RealtimeDataStackedRealtime.tsx` |
| Win Ticker | Scrolling win feed | `reference/realtime/realtime-data/framer/RealtimeDataWinTicker.tsx` |

---

## Content — Card & Content Interaction Techniques

### Card Interactions
Hover, click, and focus effects for card-based UI elements.

| Technique | What It Demonstrates | Reference |
|-|-|-|
| Liquid Energy Border | Flowing animated gradient border | `reference/content/card-interactions/framer/CardInteractionsBorderGradient.tsx` |
| Volumetric Aurora | Deep glow with aurora effect | `reference/content/card-interactions/framer/CardInteractionsNeonGlow.tsx` |
| Parallax Glare | Physics tilt + dynamic glare reflection | `reference/content/card-interactions/framer/CardInteractionsTilt3D.tsx` |
| Holographic Data Flip | Premium 3D flip to data dashboard | `reference/content/card-interactions/framer/CardInteractionsFlip3D.tsx` |
| Glass Drawer Reveal | Frosted panel slides up with content | `reference/content/card-interactions/framer/CardInteractionsContentSlideUp.tsx` |
| Holographic Spotlight | Mouse-tracking texture reveal | `reference/content/card-interactions/framer/CardInteractionsSpotlight.tsx` |
| Iridescent Wave | Multi-colored sweep across surface | `reference/content/card-interactions/framer/CardInteractionsSheenSweep.tsx` |
| Orbital Notification | Badge floating with magnetic physics | `reference/content/card-interactions/framer/CardInteractionsFloatingBadge.tsx` |
| Haptic Press | Scale compression + haptic feedback | `reference/content/card-interactions/framer/CardInteractionsScaleClick.tsx` |
