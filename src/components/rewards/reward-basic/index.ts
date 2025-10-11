import type { GroupMetadata, GroupExport } from '@/types/animation'

import { RewardBasicCoinSpinSoft, metadata as coinSpinSoftMetadata } from './framer/RewardBasicCoinSpinSoft'

// CSS animations
import { RewardBasicCoinSpinSoft as CssRewardBasicCoinSpinSoft, metadata as coinSpinSoftCssMetadata } from './css/RewardBasicCoinSpinSoft'


export const groupMetadata: GroupMetadata = {
  id: 'reward-basic',
  title: 'Basic Rewards',
  tech: 'css',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
    'reward-basic__coin-spin-soft': { component: RewardBasicCoinSpinSoft, metadata: coinSpinSoftMetadata },
  },
  css: {
    'reward-basic__coin-spin-soft': { component: CssRewardBasicCoinSpinSoft, metadata: coinSpinSoftCssMetadata },
  },
}
