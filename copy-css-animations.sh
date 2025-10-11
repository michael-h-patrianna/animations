#!/bin/bash

# Script to copy CSS animations from main branch to css/ subfolders

set -e

# Define all animation groups and their CSS animations
declare -A ANIMATIONS

# BASE - button-effects
ANIMATIONS["base/button-effects"]="ButtonEffectsJitter ButtonEffectsLiquidMorph ButtonEffectsRipple ButtonEffectsShockwave ButtonEffectsSplitReveal"

# BASE - standard-effects
ANIMATIONS["base/standard-effects"]="StandardEffectsFlip StandardEffectsMorphPulse StandardEffectsPop StandardEffectsPulse StandardEffectsPulseCircle StandardEffectsPulseWave StandardEffectsRadialPulse StandardEffectsSoftPulse"

# BASE - text-effects
ANIMATIONS["base/text-effects"]="TextEffectsCharacterReveal TextEffectsComboCounter TextEffectsCounterIncrement TextEffectsEpicWin TextEffectsGlitchText TextEffectsHorizonLightPass TextEffectsLevelBreakthrough TextEffectsLightSweepDraw TextEffectsMetallicSpecularFlash TextEffectsTypewriter TextEffectsVerbFall TextEffectsVerbFlip TextEffectsVerbFloat TextEffectsVerbJog TextEffectsVerbJump TextEffectsVerbTwirl TextEffectsWaveReveal TextEffectsWaveText TextEffectsXpNumberPop"

# DIALOGS - modal-content
ANIMATIONS["dialogs/modal-content"]="ModalContentButtonsStagger2 ModalContentButtonsStagger3 ModalContentFormFieldGradient ModalContentFormFieldLeftReveal ModalContentFormFieldRightReveal ModalContentListSoftStagger ModalContentListSpotlight ModalContentListVerticalWipe"

# DIALOGS - modal-dismiss
ANIMATIONS["dialogs/modal-dismiss"]="ModalDismissSnackbarScale ModalDismissSnackbarWipe ModalDismissToastDrop ModalDismissToastFadeProgress ModalDismissToastRaise ModalDismissToastSlideLeft ModalDismissToastSlideRight"

# DIALOGS - modal-orchestration
ANIMATIONS["dialogs/modal-orchestration"]="ModalOrchestrationComparisonMorph ModalOrchestrationFlipReveal ModalOrchestrationMagneticHover ModalOrchestrationMultiStepProgressive ModalOrchestrationSelectionGrid ModalOrchestrationSpringPhysics ModalOrchestrationStaggerInview ModalOrchestrationTabMorph ModalOrchestrationTabSlide ModalOrchestrationWizardFadeCross ModalOrchestrationWizardScaleRotate ModalOrchestrationWizardSlideStack"

# MISC - misc
ANIMATIONS["misc/misc"]="MiscConcentricRings MiscOrbitalPulse MiscOscillatingDots MiscPendulumWave MiscPulsingGrid MiscSequentialPulse MiscSpiralGalaxy"

# PROGRESS - loading-states
ANIMATIONS["progress/loading-states"]="LoadingStatesDotsPortal LoadingStatesDotsRise LoadingStatesRingMulti LoadingStatesRingProgress LoadingStatesSkeletonCard LoadingStatesSkeletonHorizontal LoadingStatesSkeletonTile LoadingStatesSkeletonVertical LoadingStatesSpinnerDualRing LoadingStatesSpinnerGalaxy LoadingStatesSpinnerOrbital"

# PROGRESS - progress-bars
ANIMATIONS["progress/progress-bars"]="ProgressBarsProgressBounce ProgressBarsProgressGradient ProgressBarsProgressMilestones ProgressBarsProgressSegmented ProgressBarsProgressSpark ProgressBarsProgressStriped ProgressBarsProgressThin ProgressBarsTimelineProgress ProgressBarsXpAccumulation ProgressBarsZoomedProgress"

# REALTIME - realtime-data
ANIMATIONS["realtime/realtime-data"]="RealtimeDataLeaderboardShift RealtimeDataLiveScoreUpdate RealtimeDataStackedRealtime RealtimeDataWinTicker"

# REALTIME - timer-effects
ANIMATIONS["realtime/timer-effects"]="TimerEffectsPillCountdownExtreme TimerEffectsPillCountdownGlitch TimerEffectsPillCountdownHeartbeat TimerEffectsPillCountdownMedium TimerEffectsPillCountdownSoft TimerEffectsPillCountdownStrong TimerEffectsTimerColorShift TimerEffectsTimerFlash TimerEffectsTimerFlashSoft TimerEffectsTimerFlip TimerEffectsTimerPulse"

# REALTIME - update-indicators
ANIMATIONS["realtime/update-indicators"]="UpdateIndicatorsBadgePop UpdateIndicatorsBadgePulse UpdateIndicatorsHomeIconDotBounce UpdateIndicatorsHomeIconDotPulse UpdateIndicatorsHomeIconDotRadar UpdateIndicatorsHomeIconDotSweep UpdateIndicatorsLivePing"

# REWARDS - icon-animations
ANIMATIONS["rewards/icon-animations"]="IconAnimationsBounce IconAnimationsFloat IconAnimationsPulse IconAnimationsShake"

# REWARDS - lights
ANIMATIONS["rewards/lights"]="LightsCircleStatic1 LightsCircleStatic2 LightsCircleStatic3 LightsCircleStatic4 LightsCircleStatic5 LightsCircleStatic6 LightsCircleStatic7 LightsCircleStatic8"

# REWARDS - modal-celebrations
ANIMATIONS["rewards/modal-celebrations"]="ModalCelebrationsCoinCascade ModalCelebrationsCoinsArc ModalCelebrationsCoinsFountain ModalCelebrationsCoinsSwirl ModalCelebrationsCoinTrail ModalCelebrationsConfettiBurst ModalCelebrationsConfettiPulse ModalCelebrationsConfettiRain ModalCelebrationsConfettiSpiral ModalCelebrationsFireworksRing ModalCelebrationsFireworksTriple ModalCelebrationsJackpotCelebration ModalCelebrationsMultiCoin ModalCelebrationsRewardSpotlight ModalCelebrationsTreasureParticles"

# REWARDS - reward-basic
ANIMATIONS["rewards/reward-basic"]="RewardBasicBadgeGlint RewardBasicBadgeSweep RewardBasicBounceEnergy RewardBasicBounceSoft RewardBasicCoinSpinFast RewardBasicCoinSpinSoft RewardBasicGlowOrbit RewardBasicGlowPulse RewardBasicStarBurst RewardBasicStarRadiate"

echo "Starting CSS animation migration..."
echo ""

total_count=0
success_count=0
error_count=0

for group_path in "${!ANIMATIONS[@]}"; do
    animations=${ANIMATIONS[$group_path]}

    echo "Processing group: $group_path"

    # Create css/ subdirectory
    css_dir="src/components/$group_path/css"
    mkdir -p "$css_dir"

    for animation in $animations; do
        total_count=$((total_count + 1))

        # Get source path from main branch
        src_tsx="src/components/$group_path/$animation.tsx"
        src_css="src/components/$group_path/$animation.css"

        # Target paths in css/ subfolder
        dest_tsx="$css_dir/$animation.tsx"
        dest_css="$css_dir/$animation.css"

        echo "  Copying $animation..."

        # Copy TSX file
        if git show "origin/main:$src_tsx" > "$dest_tsx" 2>/dev/null; then
            echo "    ✓ $animation.tsx"
        else
            echo "    ✗ Failed to copy $animation.tsx"
            error_count=$((error_count + 1))
            continue
        fi

        # Copy CSS file
        if git show "origin/main:$src_css" > "$dest_css" 2>/dev/null; then
            echo "    ✓ $animation.css"
            success_count=$((success_count + 1))
        else
            echo "    ✗ Failed to copy $animation.css"
            error_count=$((error_count + 1))
        fi
    done

    echo ""
done

echo "Migration complete!"
echo "Total animations: $total_count"
echo "Successfully copied: $success_count"
echo "Errors: $error_count"
