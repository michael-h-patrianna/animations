import type { AnimationComponentMap } from '@/types/animation';

import { ModalOrchestrationComparisonMorph } from './ModalOrchestrationComparisonMorph';
import { ModalOrchestrationGridHighlight } from './ModalOrchestrationGridHighlight';
import { ModalOrchestrationMultiStepProgressive } from './ModalOrchestrationMultiStepProgressive';
import { ModalOrchestrationSelectionGrid } from './ModalOrchestrationSelectionGrid';
import { ModalOrchestrationTabMorph } from './ModalOrchestrationTabMorph';
import { ModalOrchestrationTabSlide } from './ModalOrchestrationTabSlide';
import { ModalOrchestrationWizardFadeCross } from './ModalOrchestrationWizardFadeCross';
import { ModalOrchestrationWizardScaleRotate } from './ModalOrchestrationWizardScaleRotate';
import { ModalOrchestrationWizardSlideStack } from './ModalOrchestrationWizardSlideStack';

export { ModalOrchestrationComparisonMorph } from './ModalOrchestrationComparisonMorph';
export { ModalOrchestrationGridHighlight } from './ModalOrchestrationGridHighlight';
export { ModalOrchestrationMultiStepProgressive } from './ModalOrchestrationMultiStepProgressive';
export { ModalOrchestrationSelectionGrid } from './ModalOrchestrationSelectionGrid';
export { ModalOrchestrationTabMorph } from './ModalOrchestrationTabMorph';
export { ModalOrchestrationTabSlide } from './ModalOrchestrationTabSlide';
export { ModalOrchestrationWizardFadeCross } from './ModalOrchestrationWizardFadeCross';
export { ModalOrchestrationWizardScaleRotate } from './ModalOrchestrationWizardScaleRotate';
export { ModalOrchestrationWizardSlideStack } from './ModalOrchestrationWizardSlideStack';

export const dialogsModalOrchestrationAnimations: AnimationComponentMap = {
  'modal-orchestration__comparison-morph': ModalOrchestrationComparisonMorph,
  'modal-orchestration__grid-highlight': ModalOrchestrationGridHighlight,
  'modal-orchestration__multi-step-progressive': ModalOrchestrationMultiStepProgressive,
  'modal-orchestration__selection-grid': ModalOrchestrationSelectionGrid,
  'modal-orchestration__tab-morph': ModalOrchestrationTabMorph,
  'modal-orchestration__tab-slide': ModalOrchestrationTabSlide,
  'modal-orchestration__wizard-fade-cross': ModalOrchestrationWizardFadeCross,
  'modal-orchestration__wizard-scale-rotate': ModalOrchestrationWizardScaleRotate,
  'modal-orchestration__wizard-slide-stack': ModalOrchestrationWizardSlideStack
};
