import type { AnimationComponentMap } from '@/types/animation';

import { ModalOrchestrationComparisonMorph } from './ModalOrchestrationComparisonMorph';
import { ModalOrchestrationSelectionGrid } from './ModalOrchestrationSelectionGrid';
import { ModalOrchestrationTabMorph } from './ModalOrchestrationTabMorph';
import { ModalOrchestrationWizardFadeCross } from './ModalOrchestrationWizardFadeCross';
import { ModalOrchestrationWizardScaleRotate } from './ModalOrchestrationWizardScaleRotate';
import { ModalOrchestrationWizardSlideStack } from './ModalOrchestrationWizardSlideStack';
import { ModalOrchestrationStaggerInview } from './ModalOrchestrationStaggerInview';
import { ModalOrchestrationSpringPhysics } from './ModalOrchestrationSpringPhysics';
import { ModalOrchestrationMagneticHover } from './ModalOrchestrationMagneticHover';
import { ModalOrchestrationFlipReveal } from './ModalOrchestrationFlipReveal';

export { ModalOrchestrationComparisonMorph } from './ModalOrchestrationComparisonMorph';
export { ModalOrchestrationSelectionGrid } from './ModalOrchestrationSelectionGrid';
export { ModalOrchestrationTabMorph } from './ModalOrchestrationTabMorph';
export { ModalOrchestrationWizardFadeCross } from './ModalOrchestrationWizardFadeCross';
export { ModalOrchestrationWizardScaleRotate } from './ModalOrchestrationWizardScaleRotate';
export { ModalOrchestrationWizardSlideStack } from './ModalOrchestrationWizardSlideStack';
export { ModalOrchestrationStaggerInview } from './ModalOrchestrationStaggerInview';
export { ModalOrchestrationSpringPhysics } from './ModalOrchestrationSpringPhysics';
export { ModalOrchestrationMagneticHover } from './ModalOrchestrationMagneticHover';
export { ModalOrchestrationFlipReveal } from './ModalOrchestrationFlipReveal';

export const dialogsModalOrchestrationAnimations: AnimationComponentMap = {
  'modal-orchestration__comparison-morph': ModalOrchestrationComparisonMorph,
  'modal-orchestration__selection-grid': ModalOrchestrationSelectionGrid,
  'modal-orchestration__tab-morph': ModalOrchestrationTabMorph,
  'modal-orchestration__wizard-fade-cross': ModalOrchestrationWizardFadeCross,
  'modal-orchestration__wizard-scale-rotate': ModalOrchestrationWizardScaleRotate,
  'modal-orchestration__wizard-slide-stack': ModalOrchestrationWizardSlideStack,
  'modal-orchestration__stagger-inview': ModalOrchestrationStaggerInview,
  'modal-orchestration__spring-physics': ModalOrchestrationSpringPhysics,
  'modal-orchestration__magnetic-hover': ModalOrchestrationMagneticHover,
  'modal-orchestration__flip-reveal': ModalOrchestrationFlipReveal
};
