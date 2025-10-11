#!/usr/bin/env python3

import os
import re
from pathlib import Path

# Map of group paths to their CSS animation names
ANIMATIONS = {
    "base/button-effects": [
        ("ButtonEffectsJitter", "jitter"),
        ("ButtonEffectsLiquidMorph", "liquid-morph"),
        ("ButtonEffectsRipple", "ripple"),
        ("ButtonEffectsShockwave", "shockwave"),
        ("ButtonEffectsSplitReveal", "split-reveal"),
    ],
    "base/standard-effects": [
        ("StandardEffectsFlip", "flip"),
        ("StandardEffectsMorphPulse", "morph-pulse"),
        ("StandardEffectsPop", "pop"),
        ("StandardEffectsPulse", "pulse"),
        ("StandardEffectsPulseCircle", "pulse-circle"),
        ("StandardEffectsPulseWave", "pulse-wave"),
        ("StandardEffectsRadialPulse", "radial-pulse"),
        ("StandardEffectsSoftPulse", "soft-pulse"),
    ],
    "base/text-effects": [
        ("TextEffectsCharacterReveal", "character-reveal"),
        ("TextEffectsComboCounter", "combo-counter"),
        ("TextEffectsCounterIncrement", "counter-increment"),
        ("TextEffectsEpicWin", "epic-win"),
        ("TextEffectsGlitchText", "glitch-text"),
        ("TextEffectsHorizonLightPass", "horizon-light-pass"),
        ("TextEffectsLevelBreakthrough", "level-breakthrough"),
        ("TextEffectsLightSweepDraw", "light-sweep-draw"),
        ("TextEffectsMetallicSpecularFlash", "metallic-specular-flash"),
        ("TextEffectsTypewriter", "typewriter"),
        ("TextEffectsVerbFall", "verb-fall"),
        ("TextEffectsVerbFlip", "verb-flip"),
        ("TextEffectsVerbFloat", "verb-float"),
        ("TextEffectsVerbJog", "verb-jog"),
        ("TextEffectsVerbJump", "verb-jump"),
        ("TextEffectsVerbTwirl", "verb-twirl"),
        ("TextEffectsWaveReveal", "wave-reveal"),
        ("TextEffectsWaveText", "wave-text"),
        ("TextEffectsXpNumberPop", "xp-number-pop"),
    ],
    "dialogs/modal-content": [
        ("ModalContentButtonsStagger2", "buttons-stagger-2"),
        ("ModalContentButtonsStagger3", "buttons-stagger-3"),
        ("ModalContentFormFieldGradient", "form-field-gradient"),
        ("ModalContentFormFieldLeftReveal", "form-field-left-reveal"),
        ("ModalContentFormFieldRightReveal", "form-field-right-reveal"),
        ("ModalContentListSoftStagger", "list-soft-stagger"),
        ("ModalContentListSpotlight", "list-spotlight"),
        ("ModalContentListVerticalWipe", "list-vertical-wipe"),
    ],
    "dialogs/modal-dismiss": [
        ("ModalDismissSnackbarScale", "snackbar-scale"),
        ("ModalDismissSnackbarWipe", "snackbar-wipe"),
        ("ModalDismissToastDrop", "toast-drop"),
        ("ModalDismissToastFadeProgress", "toast-fade-progress"),
        ("ModalDismissToastRaise", "toast-raise"),
        ("ModalDismissToastSlideLeft", "toast-slide-left"),
        ("ModalDismissToastSlideRight", "toast-slide-right"),
    ],
    "dialogs/modal-orchestration": [
        ("ModalOrchestrationComparisonMorph", "comparison-morph"),
        ("ModalOrchestrationFlipReveal", "flip-reveal"),
        ("ModalOrchestrationMagneticHover", "magnetic-hover"),
        ("ModalOrchestrationMultiStepProgressive", "multi-step-progressive"),
        ("ModalOrchestrationSelectionGrid", "selection-grid"),
        ("ModalOrchestrationSpringPhysics", "spring-physics"),
        ("ModalOrchestrationStaggerInview", "stagger-inview"),
        ("ModalOrchestrationTabMorph", "tab-morph"),
        ("ModalOrchestrationTabSlide", "tab-slide"),
        ("ModalOrchestrationWizardFadeCross", "wizard-fade-cross"),
        ("ModalOrchestrationWizardScaleRotate", "wizard-scale-rotate"),
        ("ModalOrchestrationWizardSlideStack", "wizard-slide-stack"),
    ],
    "misc/misc": [
        ("MiscConcentricRings", "concentric-rings"),
        ("MiscOrbitalPulse", "orbital-pulse"),
        ("MiscOscillatingDots", "oscillating-dots"),
        ("MiscPendulumWave", "pendulum-wave"),
        ("MiscPulsingGrid", "pulsing-grid"),
        ("MiscSequentialPulse", "sequential-pulse"),
        ("MiscSpiralGalaxy", "spiral-galaxy"),
    ],
    "progress/loading-states": [
        ("LoadingStatesDotsPortal", "dots-portal"),
        ("LoadingStatesDotsRise", "dots-rise"),
        ("LoadingStatesRingMulti", "ring-multi"),
        ("LoadingStatesRingProgress", "ring-progress"),
        ("LoadingStatesSkeletonCard", "skeleton-card"),
        ("LoadingStatesSkeletonHorizontal", "skeleton-horizontal"),
        ("LoadingStatesSkeletonTile", "skeleton-tile"),
        ("LoadingStatesSkeletonVertical", "skeleton-vertical"),
        ("LoadingStatesSpinnerDualRing", "spinner-dual-ring"),
        ("LoadingStatesSpinnerGalaxy", "spinner-galaxy"),
        ("LoadingStatesSpinnerOrbital", "spinner-orbital"),
    ],
    "progress/progress-bars": [
        ("ProgressBarsProgressBounce", "progress-bounce"),
        ("ProgressBarsProgressGradient", "progress-gradient"),
        ("ProgressBarsProgressMilestones", "progress-milestones"),
        ("ProgressBarsProgressSegmented", "progress-segmented"),
        ("ProgressBarsProgressSpark", "progress-spark"),
        ("ProgressBarsProgressStriped", "progress-striped"),
        ("ProgressBarsProgressThin", "progress-thin"),
        ("ProgressBarsTimelineProgress", "timeline-progress"),
        ("ProgressBarsXpAccumulation", "xp-accumulation"),
        ("ProgressBarsZoomedProgress", "zoomed-progress"),
    ],
    "realtime/realtime-data": [
        ("RealtimeDataLeaderboardShift", "leaderboard-shift"),
        ("RealtimeDataLiveScoreUpdate", "live-score-update"),
        ("RealtimeDataStackedRealtime", "stacked-realtime"),
        ("RealtimeDataWinTicker", "win-ticker"),
    ],
    "realtime/timer-effects": [
        ("TimerEffectsPillCountdownExtreme", "pill-countdown-extreme"),
        ("TimerEffectsPillCountdownGlitch", "pill-countdown-glitch"),
        ("TimerEffectsPillCountdownHeartbeat", "pill-countdown-heartbeat"),
        ("TimerEffectsPillCountdownMedium", "pill-countdown-medium"),
        ("TimerEffectsPillCountdownSoft", "pill-countdown-soft"),
        ("TimerEffectsPillCountdownStrong", "pill-countdown-strong"),
        ("TimerEffectsTimerColorShift", "timer-color-shift"),
        ("TimerEffectsTimerFlash", "timer-flash"),
        ("TimerEffectsTimerFlashSoft", "timer-flash-soft"),
        ("TimerEffectsTimerFlip", "timer-flip"),
        ("TimerEffectsTimerPulse", "timer-pulse"),
    ],
    "realtime/update-indicators": [
        ("UpdateIndicatorsBadgePop", "badge-pop"),
        ("UpdateIndicatorsBadgePulse", "badge-pulse"),
        ("UpdateIndicatorsHomeIconDotBounce", "home-icon-dot-bounce"),
        ("UpdateIndicatorsHomeIconDotPulse", "home-icon-dot-pulse"),
        ("UpdateIndicatorsHomeIconDotRadar", "home-icon-dot-radar"),
        ("UpdateIndicatorsHomeIconDotSweep", "home-icon-dot-sweep"),
        ("UpdateIndicatorsLivePing", "live-ping"),
    ],
    "rewards/icon-animations": [
        ("IconAnimationsBounce", "bounce"),
        ("IconAnimationsFloat", "float"),
        ("IconAnimationsPulse", "pulse"),
        ("IconAnimationsShake", "shake"),
    ],
    "rewards/lights": [
        ("LightsCircleStatic1", "circle-static-1"),
        ("LightsCircleStatic2", "circle-static-2"),
        ("LightsCircleStatic3", "circle-static-3"),
        ("LightsCircleStatic4", "circle-static-4"),
        ("LightsCircleStatic5", "circle-static-5"),
        ("LightsCircleStatic6", "circle-static-6"),
        ("LightsCircleStatic7", "circle-static-7"),
        ("LightsCircleStatic8", "circle-static-8"),
    ],
    "rewards/modal-celebrations": [
        ("ModalCelebrationsCoinCascade", "coin-cascade"),
        ("ModalCelebrationsCoinsArc", "coins-arc"),
        ("ModalCelebrationsCoinsFountain", "coins-fountain"),
        ("ModalCelebrationsCoinsSwirl", "coins-swirl"),
        ("ModalCelebrationsCoinTrail", "coin-trail"),
        ("ModalCelebrationsConfettiBurst", "confetti-burst"),
        ("ModalCelebrationsConfettiPulse", "confetti-pulse"),
        ("ModalCelebrationsConfettiRain", "confetti-rain"),
        ("ModalCelebrationsConfettiSpiral", "confetti-spiral"),
        ("ModalCelebrationsFireworksRing", "fireworks-ring"),
        ("ModalCelebrationsFireworksTriple", "fireworks-triple"),
        ("ModalCelebrationsJackpotCelebration", "jackpot-celebration"),
        ("ModalCelebrationsMultiCoin", "multi-coin"),
        ("ModalCelebrationsRewardSpotlight", "reward-spotlight"),
        ("ModalCelebrationsTreasureParticles", "treasure-particles"),
    ],
    "rewards/reward-basic": [
        ("RewardBasicBadgeGlint", "badge-glint"),
        ("RewardBasicBadgeSweep", "badge-sweep"),
        ("RewardBasicBounceEnergy", "bounce-energy"),
        ("RewardBasicBounceSoft", "bounce-soft"),
        ("RewardBasicCoinSpinFast", "coin-spin-fast"),
        ("RewardBasicCoinSpinSoft", "coin-spin-soft"),
        ("RewardBasicGlowOrbit", "glow-orbit"),
        ("RewardBasicGlowPulse", "glow-pulse"),
        ("RewardBasicStarBurst", "star-burst"),
        ("RewardBasicStarRadiate", "star-radiate"),
    ],
}

def pascal_to_kebab(pascal_str):
    """Convert PascalCase to kebab-case"""
    # Insert hyphens before uppercase letters and convert to lowercase
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1-\2', pascal_str)
    return re.sub('([a-z0-9])([A-Z])', r'\1-\2', s1).lower()

def camel_case(s):
    """Convert kebab-case to camelCase"""
    parts = s.split('-')
    return parts[0] + ''.join(word.capitalize() for word in parts[1:])

def update_group_index(group_path, animations):
    """Update a group's index.ts file to include CSS animations"""
    index_path = f"src/components/{group_path}/index.ts"

    if not os.path.exists(index_path):
        print(f"  ⚠ Index file not found: {index_path}")
        return False

    with open(index_path, 'r') as f:
        content = f.read()

    # Extract group ID from existing file
    group_id_match = re.search(r"id:\s*'([^']+)'", content)
    if not group_id_match:
        print(f"  ✗ Could not find group ID in {index_path}")
        return False

    group_id = group_id_match.group(1)

    # Generate CSS imports
    css_imports = []
    css_exports = []

    for component_name, variant_id in animations:
        var_name = f"Css{component_name}"
        meta_var_name = f"{camel_case(variant_id)}CssMeta"
        full_id = f"{group_id}__{variant_id}"

        css_imports.append(
            f"import {{ {component_name} as {var_name}, metadata as {meta_var_name} }} from './css/{component_name}'"
        )
        css_exports.append(
            f"    '{full_id}': {{ component: {var_name}, metadata: {meta_var_name} }},"
        )

    # Find the position to insert CSS imports (after the last framer import)
    last_framer_import = list(re.finditer(r"import.*from\s+['\"]\.\/framer\/.*['\"]", content))
    if last_framer_import:
        insert_pos = last_framer_import[-1].end()
        # Insert CSS imports after framer imports
        new_content = (
            content[:insert_pos] +
            "\n\n// CSS animations\n" +
            "\n".join(css_imports) +
            content[insert_pos:]
        )
    else:
        # No framer imports found, insert after type imports
        type_import_match = re.search(r"import type.*", content)
        if type_import_match:
            insert_pos = type_import_match.end()
            new_content = (
                content[:insert_pos] +
                "\n\n// CSS animations\n" +
                "\n".join(css_imports) +
                content[insert_pos:]
            )
        else:
            print(f"  ✗ Could not find insertion point in {index_path}")
            return False

    # Replace css: {} with the actual CSS exports
    css_export_block = "css: {\n" + "\n".join(css_exports) + "\n  },"
    new_content = re.sub(
        r"css:\s*\{\s*\}",
        css_export_block,
        new_content
    )

    # Write the updated content
    with open(index_path, 'w') as f:
        f.write(new_content)

    return True

def main():
    print("Updating group index.ts files with CSS animations...")
    print()

    success_count = 0
    error_count = 0

    for group_path, animations in ANIMATIONS.items():
        print(f"Processing {group_path}...")

        if update_group_index(group_path, animations):
            print(f"  ✓ Updated successfully ({len(animations)} CSS animations)")
            success_count += 1
        else:
            print(f"  ✗ Failed to update")
            error_count += 1

        print()

    print("Update complete!")
    print(f"Successfully updated: {success_count}")
    print(f"Errors: {error_count}")

if __name__ == "__main__":
    main()
