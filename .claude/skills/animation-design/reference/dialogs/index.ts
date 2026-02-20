import type { CategoryExport, CategoryMetadata } from '@/types/animation'
import { groupExport as modalBaseGroup } from './modal-base'
import { groupExport as modalContentGroup } from './modal-content'
import { groupExport as modalDismissGroup } from './modal-dismiss'
import { groupExport as modalOrchestrationGroup } from './modal-orchestration'

export const categoryMetadata: CategoryMetadata = {
  id: 'dialogs',
  title: 'Dialog & Modal Animations',
}

export const categoryExport: CategoryExport = {
  metadata: categoryMetadata,
  groups: {
    'modal-base': modalBaseGroup,
    'modal-content': modalContentGroup,
    'modal-dismiss': modalDismissGroup,
    'modal-orchestration': modalOrchestrationGroup,
  },
}
