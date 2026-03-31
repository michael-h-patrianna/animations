import { declareCategoryGroups } from '@/lib/lazyGroupRegistry'
import type { GroupMetadata } from '@/types/animation'

const modalBaseMeta: GroupMetadata = {
  id: 'modal-base',
  title: 'Base modal animations',
  demo: 'modalBaseFramer',
}

const modalContentChoreographyMeta: GroupMetadata = {
  id: 'modal-content-choreography',
  title: 'Content choreography',
  demo: 'modalContentFramer',
}

const autoDismissMeta: GroupMetadata = {
  id: 'auto-dismiss',
  title: 'Auto-dismiss patterns',
  demo: 'modalDismissFramer',
}

const modalOpenMeta: GroupMetadata = {
  id: 'modal-open',
  title: 'Modal open',
  demo: 'modalOpenFramer',
}

const tileAnimationsMeta: GroupMetadata = {
  id: 'tile-animations',
  title: 'Tile animations',
  demo: 'modalOrchestrationFramer',
}

declareCategoryGroups('dialogs', 'Dialog & Modal Animations', [
  { metadata: modalBaseMeta, load: () => import('./modal-base') },
  { metadata: modalContentChoreographyMeta, load: () => import('./modal-content-choreography') },
  { metadata: autoDismissMeta, load: () => import('./auto-dismiss') },
  { metadata: modalOpenMeta, load: () => import('./modal-open') },
  { metadata: tileAnimationsMeta, load: () => import('./tile-animations') },
])
