import { declareCategoryGroups } from '@/lib/lazyGroupRegistry'
import type { GroupMetadata } from '@/types/animation'

const modalBaseMeta: GroupMetadata = {
  id: 'modal-base',
  title: 'Base modal animations',
  demo: 'modalBaseFramer',
}

const modalContentMeta: GroupMetadata = {
  id: 'modal-content',
  title: 'Content choreography',
  demo: 'modalContentFramer',
}

const modalDismissMeta: GroupMetadata = {
  id: 'modal-dismiss',
  title: 'Auto-dismiss patterns',
  demo: 'modalDismissFramer',
}

const modalOpenMeta: GroupMetadata = {
  id: 'modal-open',
  title: 'Modal open',
  demo: 'modalOpenFramer',
}

const modalOrchestrationMeta: GroupMetadata = {
  id: 'modal-orchestration',
  title: 'Tile animations',
  demo: 'modalOrchestrationFramer',
}

declareCategoryGroups('dialogs', 'Dialog & Modal Animations', [
  { metadata: modalBaseMeta, load: () => import('./modal-base') },
  { metadata: modalContentMeta, load: () => import('./modal-content') },
  { metadata: modalDismissMeta, load: () => import('./modal-dismiss') },
  { metadata: modalOpenMeta, load: () => import('./modal-open') },
  { metadata: modalOrchestrationMeta, load: () => import('./modal-orchestration') },
])
