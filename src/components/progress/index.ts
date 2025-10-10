import type { CategoryExport, CategoryMetadata } from '@/types/animation'
import { groupExport as progressBarsGroup } from './progress-bars'
import { groupExport as loadingStatesGroup } from './loading-states'

export const categoryMetadata: CategoryMetadata = {
  id: 'progress',
  title: 'Progress & Loading Animations',
}

export const categoryExport: CategoryExport = {
  metadata: categoryMetadata,
  groups: {
    'progress-bars': progressBarsGroup,
    'loading-states': loadingStatesGroup,
  }
}
