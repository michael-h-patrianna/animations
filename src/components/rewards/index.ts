import type { CategoryExport, CategoryMetadata } from '@/types/animation'
import { groupExport as iconAnimationsGroup } from './icon-animations'
import { groupExport as lightsGroup } from './lights'
import { groupExport as modalCelebrationsGroup } from './modal-celebrations'
import { groupExport as rewardBasicGroup } from './reward-basic'

export const categoryMetadata: CategoryMetadata = {
  id: 'rewards',
  title: 'Game Elements & Rewards',
}

export const categoryExport: CategoryExport = {
  metadata: categoryMetadata,
  groups: {
    'icon-animations': iconAnimationsGroup,
    'lights': lightsGroup,
    'modal-celebrations': modalCelebrationsGroup,
    'reward-basic': rewardBasicGroup,
  }
}
