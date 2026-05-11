# Todo - PixiJS + GSAP Parity Repair

Inventory source: `src/components/**/pixijs/*.meta.ts`.
Verified on 2026-05-05: 183 PixiJS metadata files, 183 Framer metadata files, 183 CSS metadata files, no missing basename matches between runtimes.

## Subagent Task Contract

Each checkbox below is one independent read-write task for one animation.

Objective: make that animation's PixiJS v8 + GSAP variant match the intent, behavior, timing, staging, configurability, and visual quality of its Framer and CSS variants.

Required reading for each task:

- `docs/architecture.md`
- `docs/testing.md`
- `docs/meta/styleguide.md`
- The animation's Framer component and metadata
- The animation's CSS component, CSS module, and metadata
- The animation's PixiJS component and metadata
- Group Pixi shared files listed above the task

Process:

1. Read the Framer and CSS variants first. Determine intended motion, visual state, props, timing, easing, reduced-motion behavior, and default zero-prop rendering.
2. Read the PixiJS variant and same-group Pixi shared files. Identify concrete gaps against the baselines.
3. Implement exactly the PixiJS changes needed for parity. Prefer editing the animation's Pixi component and same-group Pixi shared files only.
4. Preserve standalone copy-paste contract: file header dependency list, optional props with defaults, `PixiAnimationHost`, GSAP timeline cleanup, no catalog-only demo imports, no unmanaged ticker loops, no unbounded object creation.
5. Verify before claiming done. Run `pnpm run type-check`. Run targeted lint/test/build commands when touched code warrants them. Do not start a dev server.

Constraints:

- No Python.
- No custom automation scripts, codegen, or looped bulk edits. One-off verification commands (`rg`, `grep`, single-run tools) are allowed.
- No generators, shell loops, bulk rewrites, or automated "speed-up" edits.
- Do not manually edit generated group index files — add `.tsx` and `.meta.ts` files to auto-discovery directories instead.
- Use `rg` only for search.
- Do not modify Framer or CSS baselines unless a blocking baseline bug is proven; if so, stop and report it instead of widening scope.
- Do not add features, cards, catalog scaffolding, or unrelated refactors.
- When uncertain, say so. Never claim visual parity without verification evidence.

Output format for subagent:

- Baseline behavior summary
- PixiJS gaps found
- Files changed
- Verification commands and results
- Remaining risks or "none"

## Tasks

### base/button-effects

Group Pixi shared files: `src/components/base/button-effects/pixijs/SharedButtonPixiComponent.tsx`, `src/components/base/button-effects/pixijs/SharedButtonPixiScenes.ts`.
Task files use `src/components/base/button-effects/{framer,css,pixijs}/<Component>.{tsx,meta.ts}` plus `src/components/base/button-effects/css/<Component>.module.css`.

- [ ] TASK-001 `ButtonEffectsJitter`
- [ ] TASK-002 `ButtonEffectsLiquidMorph`
- [ ] TASK-003 `ButtonEffectsPressSquash`
- [ ] TASK-004 `ButtonEffectsRewardReadyPulse`
- [ ] TASK-005 `ButtonEffectsRipple`
- [ ] TASK-006 `ButtonEffectsShakeGentle`
- [ ] TASK-007 `ButtonEffectsShockwave`
- [ ] TASK-008 `ButtonEffectsSplitReveal`

### base/standard-effects

Group Pixi shared files: `src/components/base/standard-effects/pixijs/SharedStandardPixiScenes.ts`.
Task files use `src/components/base/standard-effects/{framer,css,pixijs}/<Component>.{tsx,meta.ts}` plus `src/components/base/standard-effects/css/<Component>.module.css`.

- [ ] TASK-009 `StandardEffectsBlink`
- [ ] TASK-010 `StandardEffectsBounce`
- [ ] TASK-011 `StandardEffectsFade`
- [ ] TASK-012 `StandardEffectsFlip`
- [ ] TASK-013 `StandardEffectsFloat`
- [ ] TASK-014 `StandardEffectsHeartbeat`
- [ ] TASK-015 `StandardEffectsJello`
- [ ] TASK-016 `StandardEffectsPop`
- [ ] TASK-017 `StandardEffectsPulse`
- [ ] TASK-018 `StandardEffectsPulseCircle`
- [ ] TASK-019 `StandardEffectsPulseWave`
- [ ] TASK-020 `StandardEffectsRadialPulse`
- [ ] TASK-021 `StandardEffectsRubberBand`
- [ ] TASK-022 `StandardEffectsScale`
- [ ] TASK-023 `StandardEffectsScreenFlash`
- [ ] TASK-024 `StandardEffectsShake`
- [ ] TASK-025 `StandardEffectsSlide`
- [ ] TASK-026 `StandardEffectsSpin`
- [ ] TASK-027 `StandardEffectsSqueeze`
- [ ] TASK-028 `StandardEffectsStampDown`
- [ ] TASK-029 `StandardEffectsStarburst`
- [ ] TASK-030 `StandardEffectsSwing`
- [ ] TASK-031 `StandardEffectsTada`
- [ ] TASK-032 `StandardEffectsWiggle`

### base/text-effects

Group Pixi shared files: `src/components/base/text-effects/pixijs/SharedTextPixiComponent.tsx`, `src/components/base/text-effects/pixijs/SharedTextPixiScenes.ts`.
Task files use `src/components/base/text-effects/{framer,css,pixijs}/<Component>.{tsx,meta.ts}` plus `src/components/base/text-effects/css/<Component>.module.css`.

- [ ] TASK-033 `TextEffectsCharacterReveal`
- [ ] TASK-034 `TextEffectsComboCounter`
- [ ] TASK-035 `TextEffectsCounterIncrement`
- [ ] TASK-036 `TextEffectsEpicWin`
- [ ] TASK-037 `TextEffectsFloatingCombatText`
- [ ] TASK-038 `TextEffectsGlitchText`
- [ ] TASK-039 `TextEffectsHorizonLightPass`
- [ ] TASK-040 `TextEffectsLevelBreakthrough`
- [ ] TASK-041 `TextEffectsLightSweepDraw`
- [ ] TASK-042 `TextEffectsMetallicSpecularFlash`
- [ ] TASK-043 `TextEffectsTypewriter`
- [ ] TASK-044 `TextEffectsVerbFalling`
- [ ] TASK-045 `TextEffectsVerbFlipping`
- [ ] TASK-046 `TextEffectsVerbFloating`
- [ ] TASK-047 `TextEffectsVerbJogging`
- [ ] TASK-048 `TextEffectsVerbJumping`
- [ ] TASK-049 `TextEffectsVerbTwirling`
- [ ] TASK-050 `TextEffectsWaveReveal`
- [ ] TASK-051 `TextEffectsWaveText`
- [ ] TASK-052 `TextEffectsXpNumberPop`

### dialogs/auto-dismiss

Group Pixi shared files: `src/components/dialogs/auto-dismiss/pixijs/SharedAutoDismissPixiComponent.tsx`, `src/components/dialogs/auto-dismiss/pixijs/SharedAutoDismissPixiScenes.ts`.
Task files use `src/components/dialogs/auto-dismiss/{framer,css,pixijs}/<Component>.{tsx,meta.ts}` plus `src/components/dialogs/auto-dismiss/css/<Component>.module.css`.

- [ ] TASK-053 `AutoDismissSnackbarScale`
- [ ] TASK-054 `AutoDismissSnackbarWipe`
- [ ] TASK-055 `AutoDismissToastDrop`
- [ ] TASK-056 `AutoDismissToastFadeProgress`
- [ ] TASK-057 `AutoDismissToastRaise`
- [ ] TASK-058 `AutoDismissToastSlideLeft`
- [ ] TASK-059 `AutoDismissToastSlideRight`

### dialogs/modal-base

Group Pixi shared files: `src/components/dialogs/modal-base/pixijs/SharedModalBasePixiComponent.tsx`, `src/components/dialogs/modal-base/pixijs/SharedModalBasePixiScenes.ts`.
Task files use `src/components/dialogs/modal-base/{framer,css,pixijs}/<Component>.{tsx,meta.ts}` plus `src/components/dialogs/modal-base/css/<Component>.module.css`.

- [ ] TASK-060 `ModalBaseFlip3d`
- [ ] TASK-061 `ModalBaseGlitchDigital`
- [ ] TASK-062 `ModalBasePortalSwirl`
- [ ] TASK-063 `ModalBaseRippleExpand`
- [ ] TASK-064 `ModalBaseScaleGentlePop`
- [ ] TASK-065 `ModalBaseShatterAssemble`
- [ ] TASK-066 `ModalBaseSlideDownSoft`
- [ ] TASK-067 `ModalBaseSlideLeftDrift`
- [ ] TASK-068 `ModalBaseSlideRightDrift`
- [ ] TASK-069 `ModalBaseSlideUpSoft`
- [ ] TASK-070 `ModalBaseSpringBounce`
- [ ] TASK-071 `ModalBaseTvTurnOn`
- [ ] TASK-072 `ModalBaseUnfoldOrigami`
- [ ] TASK-073 `ModalBaseZoomElastic`

### dialogs/modal-content-choreography

Group Pixi shared files: `src/components/dialogs/modal-content-choreography/pixijs/SharedModalContentPixiComponent.tsx`, `src/components/dialogs/modal-content-choreography/pixijs/SharedModalContentPixiScenes.ts`.
Task files use `src/components/dialogs/modal-content-choreography/{framer,css,pixijs}/<Component>.{tsx,meta.ts}` plus `src/components/dialogs/modal-content-choreography/css/<Component>.module.css`.

- [ ] TASK-074 `ModalContentChoreographyButtonsStagger2`
- [ ] TASK-075 `ModalContentChoreographyButtonsStagger3`
- [ ] TASK-076 `ModalContentChoreographyFormFieldGradient`
- [ ] TASK-077 `ModalContentChoreographyFormFieldLeftReveal`
- [ ] TASK-078 `ModalContentChoreographyFormFieldRightReveal`
- [ ] TASK-079 `ModalContentChoreographyListSoftStagger`
- [ ] TASK-080 `ModalContentChoreographyListSpotlight`
- [ ] TASK-081 `ModalContentChoreographyListVerticalWipe`

### dialogs/modal-open

Group Pixi shared files: `src/components/dialogs/modal-open/pixijs/SharedModalOpenPixiComponent.tsx`, `src/components/dialogs/modal-open/pixijs/SharedModalOpenPixiScenes.ts`.
Task files use `src/components/dialogs/modal-open/{framer,css,pixijs}/<Component>.{tsx,meta.ts}` plus `src/components/dialogs/modal-open/css/<Component>.module.css`.

- [ ] TASK-082 `ModalOpenBubblePop`
- [ ] TASK-083 `ModalOpenComicPunch`
- [ ] TASK-084 `ModalOpenFlyIn`
- [ ] TASK-085 `ModalOpenSlamDown`
- [ ] TASK-086 `ModalOpenWantedPoster`

### dialogs/tile-animations

Group Pixi shared files: `src/components/dialogs/tile-animations/pixijs/SharedTilePixiComponent.tsx`, `src/components/dialogs/tile-animations/pixijs/SharedTilePixiScenes.ts`.
Task files use `src/components/dialogs/tile-animations/{framer,css,pixijs}/<Component>.{tsx,meta.ts}` plus `src/components/dialogs/tile-animations/css/<Component>.module.css`.

- [ ] TASK-087 `TileAnimationsComparisonMorph`
- [ ] TASK-088 `TileAnimationsFlipReveal`
- [ ] TASK-089 `TileAnimationsGridHighlight`
- [ ] TASK-090 `TileAnimationsMagneticHover`
- [ ] TASK-091 `TileAnimationsReorderDrag`
- [ ] TASK-092 `TileAnimationsSelectionGrid`
- [ ] TASK-093 `TileAnimationsSpringPhysics`
- [ ] TASK-094 `TileAnimationsStaggerInview`
- [ ] TASK-095 `TileAnimationsTabMorph`
- [ ] TASK-096 `TileAnimationsWizardFadeCross`
- [ ] TASK-097 `TileAnimationsWizardScaleRotate`
- [ ] TASK-098 `TileAnimationsWizardSlideStack`

### progress/loading-states

Group Pixi shared files: `src/components/progress/loading-states/pixijs/SharedLoadingPixiComponent.tsx`, `src/components/progress/loading-states/pixijs/SharedLoadingPixiScenes.ts`.
Task files use `src/components/progress/loading-states/{framer,css,pixijs}/<Component>.{tsx,meta.ts}` plus `src/components/progress/loading-states/css/<Component>.module.css`.

- [ ] TASK-099 `LoadingStatesDotsPortal`
- [ ] TASK-100 `LoadingStatesDotsPulse`
- [ ] TASK-101 `LoadingStatesDotsRise`
- [ ] TASK-102 `LoadingStatesPulsating`
- [ ] TASK-103 `LoadingStatesRingMulti`
- [ ] TASK-104 `LoadingStatesRingProgress`
- [ ] TASK-105 `LoadingStatesSkeletonCard`
- [ ] TASK-106 `LoadingStatesSkeletonHorizontal`
- [ ] TASK-107 `LoadingStatesSkeletonTile`
- [ ] TASK-108 `LoadingStatesSkeletonVertical`
- [ ] TASK-109 `LoadingStatesSpinner`
- [ ] TASK-110 `LoadingStatesSpinnerDualRing`
- [ ] TASK-111 `LoadingStatesSpinnerGalaxy`
- [ ] TASK-112 `LoadingStatesSpinnerOrbital`

### progress/progress-bars

Group Pixi shared files: `src/components/progress/progress-bars/pixijs/SharedProgressPixiComponent.tsx`, `src/components/progress/progress-bars/pixijs/SharedProgressPixiScenes.ts`.
Task files use `src/components/progress/progress-bars/{framer,css,pixijs}/<Component>.{tsx,meta.ts}` plus `src/components/progress/progress-bars/css/<Component>.module.css`.

- [ ] TASK-113 `ProgressBarsCelebrationBurst`
- [ ] TASK-114 `ProgressBarsChargeSurge`
- [ ] TASK-115 `ProgressBarsCircularDash`
- [ ] TASK-116 `ProgressBarsCircularLevel`
- [ ] TASK-117 `ProgressBarsLiquidTube`
- [ ] TASK-118 `ProgressBarsNeonPulse`
- [ ] TASK-119 `ProgressBarsProgressBounce`
- [ ] TASK-120 `ProgressBarsProgressMilestones`
- [ ] TASK-121 `ProgressBarsProgressSegmented`
- [ ] TASK-122 `ProgressBarsProgressThin`
- [ ] TASK-123 `ProgressBarsRetroBit`
- [ ] TASK-124 `ProgressBarsSciFiLoader`
- [ ] TASK-125 `ProgressBarsTimelineProgress`
- [ ] TASK-126 `ProgressBarsZoomedProgress`

### realtime/realtime-data

Group Pixi shared files: `src/components/realtime/realtime-data/pixijs/SharedRealtimeDataPixiComponent.tsx`, `src/components/realtime/realtime-data/pixijs/SharedRealtimeDataPixiScenes.ts`.
Task files use `src/components/realtime/realtime-data/{framer,css,pixijs}/<Component>.{tsx,meta.ts}` plus `src/components/realtime/realtime-data/css/<Component>.module.css`.

- [ ] TASK-127 `RealtimeDataLeaderboardShift`
- [ ] TASK-128 `RealtimeDataLiveScoreUpdate`
- [ ] TASK-129 `RealtimeDataStackedRealtime`
- [ ] TASK-130 `RealtimeDataWinTicker`

### realtime/timer-effects

Group Pixi shared files: `src/components/realtime/timer-effects/pixijs/SharedTimerPixiComponent.tsx`, `src/components/realtime/timer-effects/pixijs/SharedTimerPixiScenes.ts`, `src/components/realtime/timer-effects/pixijs/SharedPillUrgencyEffects.ts`.
Task files use `src/components/realtime/timer-effects/{framer,css,pixijs}/<Component>.{tsx,meta.ts}` plus `src/components/realtime/timer-effects/css/<Component>.module.css`.

- [ ] TASK-131 `TimerEffectsCountdownBurst`
- [ ] TASK-132 `TimerEffectsPillCountdownExtreme`
- [ ] TASK-133 `TimerEffectsPillCountdownGlitch`
- [ ] TASK-134 `TimerEffectsPillCountdownHeartbeat`
- [ ] TASK-135 `TimerEffectsPillCountdownMedium`
- [ ] TASK-136 `TimerEffectsPillCountdownSoft`
- [ ] TASK-137 `TimerEffectsPillCountdownStrong`
- [ ] TASK-138 `TimerEffectsTimerFlash`
- [ ] TASK-139 `TimerEffectsTimerFlashSoft`
- [ ] TASK-140 `TimerEffectsTimerPulse`
- [ ] TASK-141 `TimerEffectsUrgentPulse`

### realtime/update-indicators

Group Pixi shared files: `src/components/realtime/update-indicators/pixijs/SharedUpdateIndicatorPixiComponent.tsx`, `src/components/realtime/update-indicators/pixijs/SharedUpdateIndicatorPixiScenes.ts`.
Task files use `src/components/realtime/update-indicators/{framer,css,pixijs}/<Component>.{tsx,meta.ts}` plus `src/components/realtime/update-indicators/css/<Component>.module.css`.

- [ ] TASK-142 `UpdateIndicatorsBadgePop`
- [ ] TASK-143 `UpdateIndicatorsBadgePulse`
- [ ] TASK-144 `UpdateIndicatorsHomeIconDotBounce`
- [ ] TASK-145 `UpdateIndicatorsHomeIconDotPulse`
- [ ] TASK-146 `UpdateIndicatorsHomeIconDotRadar`
- [ ] TASK-147 `UpdateIndicatorsHomeIconDotSweep`
- [ ] TASK-148 `UpdateIndicatorsLivePing`

### rewards/celebration-effects

Group Pixi shared files: `src/components/rewards/celebration-effects/pixijs/SharedCelebrationPixiComponent.tsx`, `src/components/rewards/celebration-effects/pixijs/SharedCelebrationPixiScenes.ts`.
Task files use `src/components/rewards/celebration-effects/{framer,css,pixijs}/<Component>.{tsx,meta.ts}` plus `src/components/rewards/celebration-effects/css/<Component>.module.css`.

- [ ] TASK-149 `CelebrationEffectsCoinCascade`
- [ ] TASK-150 `CelebrationEffectsCoinsArc`
- [ ] TASK-151 `CelebrationEffectsCoinsSwirl`
- [ ] TASK-152 `CelebrationEffectsConfettiBurst`
- [ ] TASK-153 `CelebrationEffectsConfettiPulse`
- [ ] TASK-154 `CelebrationEffectsConfettiRain`
- [ ] TASK-155 `CelebrationEffectsConfettiSpiral`
- [ ] TASK-156 `CelebrationEffectsFirework`
- [ ] TASK-157 `CelebrationEffectsFireworksRing`
- [ ] TASK-158 `CelebrationEffectsFireworksTriple`
- [ ] TASK-159 `CelebrationEffectsTreasureParticles`

### rewards/collection-effects

Group Pixi shared files: `src/components/rewards/collection-effects/pixijs/SharedCollectionPixiComponent.tsx`, `src/components/rewards/collection-effects/pixijs/SharedCollectionPixiScenes.ts`.
Task files use `src/components/rewards/collection-effects/{framer,css,pixijs}/<Component>.{tsx,meta.ts}` plus `src/components/rewards/collection-effects/css/<Component>.module.css`.

- [ ] TASK-160 `CollectionEffectsCoinBurst`
- [ ] TASK-161 `CollectionEffectsCoinMagnet`
- [ ] TASK-162 `CollectionEffectsCoinTrail`
- [ ] TASK-163 `CollectionEffectsCoinsFountain`

### rewards/icon-animations

Group Pixi shared files: `src/components/rewards/icon-animations/pixijs/SharedIconPixiComponent.tsx`, `src/components/rewards/icon-animations/pixijs/SharedIconPixiScenes.ts`.
Task files use `src/components/rewards/icon-animations/{framer,css,pixijs}/<Component>.{tsx,meta.ts}` plus `src/components/rewards/icon-animations/css/<Component>.module.css`.

- [ ] TASK-164 `IconAnimationsBounce`
- [ ] TASK-165 `IconAnimationsFloat`
- [ ] TASK-166 `IconAnimationsJapaneseTapArrow`
- [ ] TASK-167 `IconAnimationsPulse`
- [ ] TASK-168 `IconAnimationsShake`
- [ ] TASK-169 `IconAnimationsTapArrow`

### rewards/lights

Group Pixi shared files: `src/components/rewards/lights/pixijs/SharedLightsPixiComponent.tsx`, `src/components/rewards/lights/pixijs/SharedLightsPixiScenes.ts`.
Task files use `src/components/rewards/lights/{framer,css,pixijs}/<Component>.{tsx,meta.ts}` plus `src/components/rewards/lights/css/<Component>.module.css`.

- [ ] TASK-170 `LightsCircleStatic1`
- [ ] TASK-171 `LightsCircleStatic2`
- [ ] TASK-172 `LightsCircleStatic3`
- [ ] TASK-173 `LightsCircleStatic4`
- [ ] TASK-174 `LightsCircleStatic5`
- [ ] TASK-175 `LightsCircleStatic6`
- [ ] TASK-176 `LightsCircleStatic7`
- [ ] TASK-177 `LightsCircleStatic8`

### rewards/prize-reveal

Group Pixi shared files: `src/components/rewards/prize-reveal/pixijs/SharedPrizeRevealPixiComponent.tsx`, `src/components/rewards/prize-reveal/pixijs/SharedPrizeRevealPixiHelpers.ts`, `src/components/rewards/prize-reveal/pixijs/SharedPrizeRevealPixiScenes.ts`.
Task files use `src/components/rewards/prize-reveal/{framer,css,pixijs}/<Component>.{tsx,meta.ts}` plus `src/components/rewards/prize-reveal/css/<Component>.module.css`.

- [ ] TASK-178 `PrizeRevealArcanePortal`
- [ ] TASK-179 `PrizeRevealCardPackOpen`
- [ ] TASK-180 `PrizeRevealChestGcSc`
- [ ] TASK-181 `PrizeRevealCrystalShatter`
- [ ] TASK-182 `PrizeRevealPirateChestNoWin`
- [ ] TASK-183 `PrizeRevealPirateChestWin`
