#!/usr/bin/env python3

import subprocess
import os
from pathlib import Path

# Define all animation groups and their CSS animations
ANIMATIONS = {
    "base/button-effects": [
        "ButtonEffectsJitter", "ButtonEffectsLiquidMorph", "ButtonEffectsRipple",
        "ButtonEffectsShockwave", "ButtonEffectsSplitReveal"
    ],
    "base/standard-effects": [
        "StandardEffectsFlip", "StandardEffectsMorphPulse", "StandardEffectsPop",
        "StandardEffectsPulse", "StandardEffectsPulseCircle", "StandardEffectsPulseWave",
        "StandardEffectsRadialPulse", "StandardEffectsSoftPulse"
    ],
    "base/text-effects": [
        "TextEffectsCharacterReveal", "TextEffectsComboCounter", "TextEffectsCounterIncrement",
        "TextEffectsEpicWin", "TextEffectsGlitchText", "TextEffectsHorizonLightPass",
        "TextEffectsLevelBreakthrough", "TextEffectsLightSweepDraw", "TextEffectsMetallicSpecularFlash",
        "TextEffectsTypewriter", "TextEffectsVerbFall", "TextEffectsVerbFlip",
        "TextEffectsVerbFloat", "TextEffectsVerbJog", "TextEffectsVerbJump",
        "TextEffectsVerbTwirl", "TextEffectsWaveReveal", "TextEffectsWaveText",
        "TextEffectsXpNumberPop"
    ],
    "dialogs/modal-content": [
        "ModalContentButtonsStagger2", "ModalContentButtonsStagger3", "ModalContentFormFieldGradient",
        "ModalContentFormFieldLeftReveal", "ModalContentFormFieldRightReveal", "ModalContentListSoftStagger",
        "ModalContentListSpotlight", "ModalContentListVerticalWipe"
    ],
    "dialogs/modal-dismiss": [
        "ModalDismissSnackbarScale", "ModalDismissSnackbarWipe", "ModalDismissToastDrop",
        "ModalDismissToastFadeProgress", "ModalDismissToastRaise", "ModalDismissToastSlideLeft",
        "ModalDismissToastSlideRight"
    ],
    "dialogs/modal-orchestration": [
        "ModalOrchestrationComparisonMorph", "ModalOrchestrationFlipReveal", "ModalOrchestrationMagneticHover",
        "ModalOrchestrationMultiStepProgressive", "ModalOrchestrationSelectionGrid", "ModalOrchestrationSpringPhysics",
        "ModalOrchestrationStaggerInview", "ModalOrchestrationTabMorph", "ModalOrchestrationTabSlide",
        "ModalOrchestrationWizardFadeCross", "ModalOrchestrationWizardScaleRotate", "ModalOrchestrationWizardSlideStack"
    ],
    "misc/misc": [
        "MiscConcentricRings", "MiscOrbitalPulse", "MiscOscillatingDots",
        "MiscPendulumWave", "MiscPulsingGrid", "MiscSequentialPulse",
        "MiscSpiralGalaxy"
    ],
    "progress/loading-states": [
        "LoadingStatesDotsPortal", "LoadingStatesDotsRise", "LoadingStatesRingMulti",
        "LoadingStatesRingProgress", "LoadingStatesSkeletonCard", "LoadingStatesSkeletonHorizontal",
        "LoadingStatesSkeletonTile", "LoadingStatesSkeletonVertical", "LoadingStatesSpinnerDualRing",
        "LoadingStatesSpinnerGalaxy", "LoadingStatesSpinnerOrbital"
    ],
    "progress/progress-bars": [
        "ProgressBarsProgressBounce", "ProgressBarsProgressGradient", "ProgressBarsProgressMilestones",
        "ProgressBarsProgressSegmented", "ProgressBarsProgressSpark", "ProgressBarsProgressStriped",
        "ProgressBarsProgressThin", "ProgressBarsTimelineProgress", "ProgressBarsXpAccumulation",
        "ProgressBarsZoomedProgress"
    ],
    "realtime/realtime-data": [
        "RealtimeDataLeaderboardShift", "RealtimeDataLiveScoreUpdate", "RealtimeDataStackedRealtime",
        "RealtimeDataWinTicker"
    ],
    "realtime/timer-effects": [
        "TimerEffectsPillCountdownExtreme", "TimerEffectsPillCountdownGlitch", "TimerEffectsPillCountdownHeartbeat",
        "TimerEffectsPillCountdownMedium", "TimerEffectsPillCountdownSoft", "TimerEffectsPillCountdownStrong",
        "TimerEffectsTimerColorShift", "TimerEffectsTimerFlash", "TimerEffectsTimerFlashSoft",
        "TimerEffectsTimerFlip", "TimerEffectsTimerPulse"
    ],
    "realtime/update-indicators": [
        "UpdateIndicatorsBadgePop", "UpdateIndicatorsBadgePulse", "UpdateIndicatorsHomeIconDotBounce",
        "UpdateIndicatorsHomeIconDotPulse", "UpdateIndicatorsHomeIconDotRadar", "UpdateIndicatorsHomeIconDotSweep",
        "UpdateIndicatorsLivePing"
    ],
    "rewards/icon-animations": [
        "IconAnimationsBounce", "IconAnimationsFloat", "IconAnimationsPulse",
        "IconAnimationsShake"
    ],
    "rewards/lights": [
        "LightsCircleStatic1", "LightsCircleStatic2", "LightsCircleStatic3",
        "LightsCircleStatic4", "LightsCircleStatic5", "LightsCircleStatic6",
        "LightsCircleStatic7", "LightsCircleStatic8"
    ],
    "rewards/modal-celebrations": [
        "ModalCelebrationsCoinCascade", "ModalCelebrationsCoinsArc", "ModalCelebrationsCoinsFountain",
        "ModalCelebrationsCoinsSwirl", "ModalCelebrationsCoinTrail", "ModalCelebrationsConfettiBurst",
        "ModalCelebrationsConfettiPulse", "ModalCelebrationsConfettiRain", "ModalCelebrationsConfettiSpiral",
        "ModalCelebrationsFireworksRing", "ModalCelebrationsFireworksTriple", "ModalCelebrationsJackpotCelebration",
        "ModalCelebrationsMultiCoin", "ModalCelebrationsRewardSpotlight", "ModalCelebrationsTreasureParticles"
    ],
    "rewards/reward-basic": [
        "RewardBasicBadgeGlint", "RewardBasicBadgeSweep", "RewardBasicBounceEnergy",
        "RewardBasicBounceSoft", "RewardBasicCoinSpinFast", "RewardBasicCoinSpinSoft",
        "RewardBasicGlowOrbit", "RewardBasicGlowPulse", "RewardBasicStarBurst",
        "RewardBasicStarRadiate"
    ]
}

def run_command(cmd, capture_output=True):
    """Run a shell command and return the result"""
    result = subprocess.run(cmd, shell=True, capture_output=capture_output, text=True)
    return result

def main():
    print("Starting CSS animation migration...")
    print()

    total_count = 0
    success_count = 0
    error_count = 0
    errors = []

    for group_path, animations in ANIMATIONS.items():
        print(f"Processing group: {group_path}")

        # Create css/ subdirectory
        css_dir = f"src/components/{group_path}/css"
        Path(css_dir).mkdir(parents=True, exist_ok=True)

        for animation in animations:
            total_count += 1

            # Get source path from main branch
            src_tsx = f"src/components/{group_path}/{animation}.tsx"
            src_css = f"src/components/{group_path}/{animation}.css"

            # Target paths in css/ subfolder
            dest_tsx = f"{css_dir}/{animation}.tsx"
            dest_css = f"{css_dir}/{animation}.css"

            print(f"  Copying {animation}...")

            # Copy TSX file
            result = run_command(f"git show origin/main:{src_tsx} > {dest_tsx}")
            if result.returncode == 0:
                print(f"    ✓ {animation}.tsx")
            else:
                print(f"    ✗ Failed to copy {animation}.tsx")
                errors.append(f"{animation}.tsx - {result.stderr}")
                error_count += 1
                continue

            # Copy CSS file
            result = run_command(f"git show origin/main:{src_css} > {dest_css}")
            if result.returncode == 0:
                print(f"    ✓ {animation}.css")
                success_count += 1
            else:
                print(f"    ✗ Failed to copy {animation}.css")
                errors.append(f"{animation}.css - {result.stderr}")
                error_count += 1

        print()

    print("Migration complete!")
    print(f"Total animations: {total_count}")
    print(f"Successfully copied: {success_count}")
    print(f"Errors: {error_count}")

    if errors:
        print("\nErrors encountered:")
        for error in errors[:10]:  # Show first 10 errors
            print(f"  - {error}")

if __name__ == "__main__":
    main()
