import type { CategoryExport, CategoryMetadata } from '@/types/animation'
import { groupExport as miscGroup } from './misc'

export const categoryMetadata: CategoryMetadata = {
  id: 'misc',
  title: 'Misc',
}

export const categoryExport: CategoryExport = {
  metadata: categoryMetadata,
  groups: {
    'misc': miscGroup,
  }
}
