import type { CategoryExport, CategoryMetadata } from '@/types/animation'
import { groupExport as textEffectsGroup } from './text-effects'
import { groupExport as standardEffectsGroup } from './standard-effects'
import { groupExport as buttonEffectsGroup } from './button-effects'

export const categoryMetadata: CategoryMetadata = {
  id: 'base',
  title: 'Base effects',
}

export const categoryExport: CategoryExport = {
  metadata: categoryMetadata,
  groups: {
    'text-effects': textEffectsGroup,
    'standard-effects': standardEffectsGroup,
    'button-effects': buttonEffectsGroup,
  }
}
