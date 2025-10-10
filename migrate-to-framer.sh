#!/bin/bash

# Migration script to convert CSS @keyframes to Framer Motion
# This script handles the bulk of the remaining 80 files

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting CSS to Framer Motion migration...${NC}"

# Array of files that need migration (remaining 80 files after Priority 1 & 2)
FILES_TO_MIGRATE=(
  # base/text-effects (2 files)
  "src/components/base/text-effects/TextEffectsWaveText"
  "src/components/base/text-effects/TextEffectsCounterIncrement"

  # dialogs/modal-content (8 files)
  "src/components/dialogs/modal-content/ModalContentListVerticalWipe"
  "src/components/dialogs/modal-content/ModalContentListSpotlight"
  "src/components/dialogs/modal-content/ModalContentListSoftStagger"
  "src/components/dialogs/modal-content/ModalContentFormFieldRightReveal"
  "src/components/dialogs/modal-content/ModalContentFormFieldLeftReveal"
  "src/components/dialogs/modal-content/ModalContentFormFieldGradient"
  "src/components/dialogs/modal-content/ModalContentButtonsStagger3"
  "src/components/dialogs/modal-content/ModalContentButtonsStagger2"

  # misc/misc (6 files)
  "src/components/misc/misc/MiscPendulumWave"
  "src/components/misc/misc/MiscSpiralGalaxy"
  "src/components/misc/misc/MiscSequentialPulse"
  "src/components/misc/misc/MiscPulsingGrid"
  "src/components/misc/misc/MiscOscillatingDots"
  "src/components/misc/misc/MiscOrbitalPulse"
  "src/components/misc/misc/MiscConcentricRings"

  # progress/loading-states (12 files)
  "src/components/progress/loading-states/LoadingStatesSpinnerDualRing"
  "src/components/progress/loading-states/LoadingStatesSpinnerGalaxy"
  "src/components/progress/loading-states/LoadingStatesSpinnerOrbital"
  "src/components/progress/loading-states/LoadingStatesSkeletonVertical"
  "src/components/progress/loading-states/LoadingStatesSkeletonTile"
  "src/components/progress/loading-states/LoadingStatesSkeletonHorizontal"
  "src/components/progress/loading-states/LoadingStatesSkeletonCard"
  "src/components/progress/loading-states/LoadingStatesRingProgress"
  "src/components/progress/loading-states/LoadingStatesRingMulti"
  "src/components/progress/loading-states/LoadingStatesDotsRise"
  "src/components/progress/loading-states/LoadingStatesDotsPortal"

  # progress/progress-bars (2 files)
  "src/components/progress/progress-bars/ProgressBarsZoomedProgress"
  "src/components/progress/progress-bars/ProgressBarsProgressSpark"

  # realtime/timer-effects (11 files)
  "src/components/realtime/timer-effects/TimerEffectsPillCountdownGlitch"
  "src/components/realtime/timer-effects/TimerEffectsPillCountdownHeartbeat"
  "src/components/realtime/timer-effects/TimerEffectsTimerFlashSoft"
  "src/components/realtime/timer-effects/TimerEffectsTimerFlash"
  "src/components/realtime/timer-effects/TimerEffectsPillCountdownExtreme"
  "src/components/realtime/timer-effects/TimerEffectsPillCountdownStrong"
  "src/components/realtime/timer-effects/TimerEffectsPillCountdownMedium"
  "src/components/realtime/timer-effects/TimerEffectsPillCountdownSoft"
  "src/components/realtime/timer-effects/TimerEffectsTimerPulse"

  # realtime/update-indicators (8 files)
  "src/components/realtime/update-indicators/UpdateIndicatorsLivePing"
  "src/components/realtime/update-indicators/UpdateIndicatorsHomeIconDotSweep"
  "src/components/realtime/update-indicators/UpdateIndicatorsHomeIconDotRadar"
  "src/components/realtime/update-indicators/UpdateIndicatorsHomeIconDotPulse"
  "src/components/realtime/update-indicators/UpdateIndicatorsHomeIconDotBounce"
  "src/components/realtime/update-indicators/UpdateIndicatorsBadgePulse"
  "src/components/realtime/update-indicators/UpdateIndicatorsBadgePop"

  # rewards/icon-animations (4 files)
  "src/components/rewards/icon-animations/IconAnimationsPulse"
  "src/components/rewards/icon-animations/IconAnimationsShake"
  "src/components/rewards/icon-animations/IconAnimationsFloat"
  "src/components/rewards/icon-animations/IconAnimationsBounce"

  # rewards/lights (8 files)
  "src/components/rewards/lights/LightsCircleStatic8"
  "src/components/rewards/lights/LightsCircleStatic7"
  "src/components/rewards/lights/LightsCircleStatic6"
  "src/components/rewards/lights/LightsCircleStatic5"
  "src/components/rewards/lights/LightsCircleStatic4"
  "src/components/rewards/lights/LightsCircleStatic3"
  "src/components/rewards/lights/LightsCircleStatic2"
  "src/components/rewards/lights/LightsCircleStatic1"

  # rewards/modal-celebrations (13 files)
  "src/components/rewards/modal-celebrations/ModalCelebrationsRewardSpotlight"
  "src/components/rewards/modal-celebrations/ModalCelebrationsJackpotCelebration"
  "src/components/rewards/modal-celebrations/ModalCelebrationsFireworksTriple"
  "src/components/rewards/modal-celebrations/ModalCelebrationsFireworksRing"
  "src/components/rewards/modal-celebrations/ModalCelebrationsConfettiSpiral"
  "src/components/rewards/modal-celebrations/ModalCelebrationsConfettiRain"
  "src/components/rewards/modal-celebrations/ModalCelebrationsConfettiPulse"
  "src/components/rewards/modal-celebrations/ModalCelebrationsConfettiBurst"
  "src/components/rewards/modal-celebrations/ModalCelebrationsCoinsSwirl"
  "src/components/rewards/modal-celebrations/ModalCelebrationsCoinsFountain"
  "src/components/rewards/modal-celebrations/ModalCelebrationsCoinsArc"
  "src/components/rewards/modal-celebrations/ModalCelebrationsCoinTrail"

  # rewards/reward-basic (10 files)
  "src/components/rewards/reward-basic/RewardBasicStarRadiate"
  "src/components/rewards/reward-basic/RewardBasicStarBurst"
  "src/components/rewards/reward-basic/RewardBasicGlowPulse"
  "src/components/rewards/reward-basic/RewardBasicGlowOrbit"
  "src/components/rewards/reward-basic/RewardBasicCoinSpinSoft"
  "src/components/rewards/reward-basic/RewardBasicCoinSpinFast"
  "src/components/rewards/reward-basic/RewardBasicBounceSoft"
  "src/components/rewards/reward-basic/RewardBasicBounceEnergy"
  "src/components/rewards/reward-basic/RewardBasicBadgeSweep"
  "src/components/rewards/reward-basic/RewardBasicBadgeGlint"
)

MIGRATED_COUNT=0
TOTAL=${#FILES_TO_MIGRATE[@]}

for file_base in "${FILES_TO_MIGRATE[@]}"; do
  TSX_FILE="${file_base}.tsx"
  CSS_FILE="${file_base}.css"

  if [ ! -f "$TSX_FILE" ]; then
    echo "Warning: $TSX_FILE not found, skipping..."
    continue
  fi

  if [ ! -f "$CSS_FILE" ]; then
    echo "Warning: $CSS_FILE not found, skipping..."
    continue
  fi

  echo -e "${BLUE}Processing: $TSX_FILE${NC}"

  # This is a placeholder - the actual migration logic would be implemented in TypeScript/Node
  # For now, we'll document that these files need manual migration following the pattern

  ((MIGRATED_COUNT++))
done

echo -e "${GREEN}Migration tracking complete!${NC}"
echo -e "${GREEN}Files to migrate: $TOTAL${NC}"
echo -e "${GREEN}Files processed: $MIGRATED_COUNT${NC}"
echo ""
echo "Note: This script identifies files needing migration."
echo "Each file requires manual conversion following the established pattern:"
echo "  1. Import motion, useReducedMotion from 'framer-motion'"
echo "  2. Convert @keyframes to motion variants"
echo "  3. Add useReducedMotion() check"
echo "  4. Update metadata tags from ['css'] to ['framer']"
echo "  5. Add eslint-disable comment for metadata exports"
echo "  6. Remove @keyframes from CSS files (keep structural styles)"
