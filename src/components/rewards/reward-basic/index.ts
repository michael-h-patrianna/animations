import type { GroupMetadata, GroupExport } from '@/types/animation'

import { RewardBasicCoinSpinSoft, metadata as coinSpinSoftMetadata } from './RewardBasicCoinSpinSoft'


export const groupMetadata: GroupMetadata = {
  id: 'reward-basic',
  title: 'Basic Rewards',
  tech: 'css',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  animations: {
    'reward-basic__coin-spin-soft': { component: RewardBasicCoinSpinSoft, metadata: coinSpinSoftMetadata },
  },
}
