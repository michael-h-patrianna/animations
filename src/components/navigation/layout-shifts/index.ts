import type { AnimationComponentMap } from '@/types/animation';

import { LayoutShiftsFilterFlow } from './LayoutShiftsFilterFlow';
import { LayoutShiftsGridReflow } from './LayoutShiftsGridReflow';
import { LayoutShiftsLayoutPanels } from './LayoutShiftsLayoutPanels';
import { LayoutShiftsResponsiveStack } from './LayoutShiftsResponsiveStack';
import { LayoutShiftsSortTransition } from './LayoutShiftsSortTransition';

export { LayoutShiftsFilterFlow } from './LayoutShiftsFilterFlow';
export { LayoutShiftsGridReflow } from './LayoutShiftsGridReflow';
export { LayoutShiftsLayoutPanels } from './LayoutShiftsLayoutPanels';
export { LayoutShiftsResponsiveStack } from './LayoutShiftsResponsiveStack';
export { LayoutShiftsSortTransition } from './LayoutShiftsSortTransition';

export const navigationLayoutShiftsAnimations: AnimationComponentMap = {
  'layout-shifts__filter-flow': LayoutShiftsFilterFlow,
  'layout-shifts__grid-reflow': LayoutShiftsGridReflow,
  'layout-shifts__layout-panels': LayoutShiftsLayoutPanels,
  'layout-shifts__responsive-stack': LayoutShiftsResponsiveStack,
  'layout-shifts__sort-transition': LayoutShiftsSortTransition
};
