import type { CategoryExport, CategoryMetadata } from '@/types/animation'
import { groupExport as collectionEffectsGroup } from './collection-effects'
import { groupExport as iconAnimationsGroup } from './icon-animations'
import { groupExport as lightsGroup } from './lights'
import { groupExport as modalCelebrationsGroup } from './modal-celebrations'
import { groupExport as revealEffectsGroup } from './reveal-effects'

export const categoryMetadata: CategoryMetadata = {
  id: 'rewards',
  title: 'Game Elements & Rewards',
}

export const categoryExport: CategoryExport = {
  metadata: categoryMetadata,
  groups: {
    'collection-effects': collectionEffectsGroup,
    'icon-animations': iconAnimationsGroup,
    lights: lightsGroup,
    'modal-celebrations': modalCelebrationsGroup,
    'reveal-effects': revealEffectsGroup,
  },
}
