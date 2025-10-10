import type { GroupMetadata, GroupExport } from '@/types/animation'

import { RewardBasicCoinSpinSoft, metadata as coinSpinSoftMetadata } from './framer/RewardBasicCoinSpinSoft'


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
  css: {},
}
