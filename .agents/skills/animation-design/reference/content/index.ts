import type { CategoryExport, CategoryMetadata } from '@/types/animation'
import { groupExport as cardInteractionsGroup } from './card-interactions'

export const categoryMetadata: CategoryMetadata = {
  id: 'content',
  title: 'Content & Cards',
}

export const categoryExport: CategoryExport = {
  metadata: categoryMetadata,
  groups: {
    'card-interactions': cardInteractionsGroup,
  },
}
