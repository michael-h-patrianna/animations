import type { AnimationComponentMap } from '@/types/animation';

import { AdvancedInteractionsDragCard } from './AdvancedInteractionsDragCard';
import { AdvancedInteractionsDragSnap } from './AdvancedInteractionsDragSnap';
import { AdvancedInteractionsLongPress } from './AdvancedInteractionsLongPress';
import { AdvancedInteractionsMagneticHover } from './AdvancedInteractionsMagneticHover';
import { AdvancedInteractionsPinchZoom } from './AdvancedInteractionsPinchZoom';
import { AdvancedInteractionsPullToRefresh } from './AdvancedInteractionsPullToRefresh';
import { AdvancedInteractionsSwipeDismiss } from './AdvancedInteractionsSwipeDismiss';

export { AdvancedInteractionsDragCard } from './AdvancedInteractionsDragCard';
export { AdvancedInteractionsDragSnap } from './AdvancedInteractionsDragSnap';
export { AdvancedInteractionsLongPress } from './AdvancedInteractionsLongPress';
export { AdvancedInteractionsMagneticHover } from './AdvancedInteractionsMagneticHover';
export { AdvancedInteractionsPinchZoom } from './AdvancedInteractionsPinchZoom';
export { AdvancedInteractionsPullToRefresh } from './AdvancedInteractionsPullToRefresh';
export { AdvancedInteractionsSwipeDismiss } from './AdvancedInteractionsSwipeDismiss';

export const microAdvancedInteractionsAnimations: AnimationComponentMap = {
  'advanced-interactions__drag-card': AdvancedInteractionsDragCard,
  'advanced-interactions__drag-snap': AdvancedInteractionsDragSnap,
  'advanced-interactions__long-press': AdvancedInteractionsLongPress,
  'advanced-interactions__magnetic-hover': AdvancedInteractionsMagneticHover,
  'advanced-interactions__pinch-zoom': AdvancedInteractionsPinchZoom,
  'advanced-interactions__pull-to-refresh': AdvancedInteractionsPullToRefresh,
  'advanced-interactions__swipe-dismiss': AdvancedInteractionsSwipeDismiss
};
