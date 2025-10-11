import type { GroupMetadata, GroupExport } from '@/types/animation'

import { RewardBasicCoinSpinSoft, metadata as coinSpinSoftMetadata } from './framer/RewardBasicCoinSpinSoft'
import { RewardBasicBadgeGlint, metadata as badgeGlintMetadata } from './framer/RewardBasicBadgeGlint'
import { RewardBasicBadgeSweep, metadata as badgeSweepMetadata } from './framer/RewardBasicBadgeSweep'
import { RewardBasicBounceEnergy, metadata as bounceEnergyMetadata } from './framer/RewardBasicBounceEnergy'
import { RewardBasicBounceSoft, metadata as bounceSoftMetadata } from './framer/RewardBasicBounceSoft'
import { RewardBasicCoinSpinFast, metadata as coinSpinFastMetadata } from './framer/RewardBasicCoinSpinFast'
import { RewardBasicGlowOrbit, metadata as glowOrbitMetadata } from './framer/RewardBasicGlowOrbit'
import { RewardBasicGlowPulse, metadata as glowPulseMetadata } from './framer/RewardBasicGlowPulse'
import { RewardBasicStarBurst, metadata as starBurstMetadata } from './framer/RewardBasicStarBurst'
import { RewardBasicStarRadiate, metadata as starRadiateMetadata } from './framer/RewardBasicStarRadiate'

// CSS animations
import { RewardBasicCoinSpinSoft as CssRewardBasicCoinSpinSoft, metadata as coinSpinSoftCssMetadata } from './css/RewardBasicCoinSpinSoft'
import { RewardBasicBadgeGlint as CssRewardBasicBadgeGlint, metadata as badgeGlintCssMetadata } from './css/RewardBasicBadgeGlint'
import { RewardBasicBadgeSweep as CssRewardBasicBadgeSweep, metadata as badgeSweepCssMetadata } from './css/RewardBasicBadgeSweep'
import { RewardBasicBounceEnergy as CssRewardBasicBounceEnergy, metadata as bounceEnergyCssMetadata } from './css/RewardBasicBounceEnergy'
import { RewardBasicBounceSoft as CssRewardBasicBounceSoft, metadata as bounceSoftCssMetadata } from './css/RewardBasicBounceSoft'
import { RewardBasicCoinSpinFast as CssRewardBasicCoinSpinFast, metadata as coinSpinFastCssMetadata } from './css/RewardBasicCoinSpinFast'
import { RewardBasicGlowOrbit as CssRewardBasicGlowOrbit, metadata as glowOrbitCssMetadata } from './css/RewardBasicGlowOrbit'
import { RewardBasicGlowPulse as CssRewardBasicGlowPulse, metadata as glowPulseCssMetadata } from './css/RewardBasicGlowPulse'
import { RewardBasicStarBurst as CssRewardBasicStarBurst, metadata as starBurstCssMetadata } from './css/RewardBasicStarBurst'
import { RewardBasicStarRadiate as CssRewardBasicStarRadiate, metadata as starRadiateCssMetadata } from './css/RewardBasicStarRadiate'


export const groupMetadata: GroupMetadata = {
  id: 'reward-basic',
  title: 'Basic Rewards',
  tech: 'css',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
    'reward-basic__coin-spin-soft': { component: RewardBasicCoinSpinSoft, metadata: coinSpinSoftMetadata },
    'reward-basic__badge-glint': { component: RewardBasicBadgeGlint, metadata: badgeGlintMetadata },
    'reward-basic__badge-sweep': { component: RewardBasicBadgeSweep, metadata: badgeSweepMetadata },
    'reward-basic__bounce-energy': { component: RewardBasicBounceEnergy, metadata: bounceEnergyMetadata },
    'reward-basic__bounce-soft': { component: RewardBasicBounceSoft, metadata: bounceSoftMetadata },
    'reward-basic__coin-spin-fast': { component: RewardBasicCoinSpinFast, metadata: coinSpinFastMetadata },
    'reward-basic__glow-orbit': { component: RewardBasicGlowOrbit, metadata: glowOrbitMetadata },
    'reward-basic__glow-pulse': { component: RewardBasicGlowPulse, metadata: glowPulseMetadata },
    'reward-basic__star-burst': { component: RewardBasicStarBurst, metadata: starBurstMetadata },
    'reward-basic__star-radiate': { component: RewardBasicStarRadiate, metadata: starRadiateMetadata },
  },
  css: {
    'reward-basic__coin-spin-soft': { component: CssRewardBasicCoinSpinSoft, metadata: coinSpinSoftCssMetadata },
    'reward-basic__badge-glint': { component: CssRewardBasicBadgeGlint, metadata: badgeGlintCssMetadata },
    'reward-basic__badge-sweep': { component: CssRewardBasicBadgeSweep, metadata: badgeSweepCssMetadata },
    'reward-basic__bounce-energy': { component: CssRewardBasicBounceEnergy, metadata: bounceEnergyCssMetadata },
    'reward-basic__bounce-soft': { component: CssRewardBasicBounceSoft, metadata: bounceSoftCssMetadata },
    'reward-basic__coin-spin-fast': { component: CssRewardBasicCoinSpinFast, metadata: coinSpinFastCssMetadata },
    'reward-basic__glow-orbit': { component: CssRewardBasicGlowOrbit, metadata: glowOrbitCssMetadata },
    'reward-basic__glow-pulse': { component: CssRewardBasicGlowPulse, metadata: glowPulseCssMetadata },
    'reward-basic__star-burst': { component: CssRewardBasicStarBurst, metadata: starBurstCssMetadata },
    'reward-basic__star-radiate': { component: CssRewardBasicStarRadiate, metadata: starRadiateCssMetadata },
  },
}
