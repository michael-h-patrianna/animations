import type { GroupMetadata, GroupExport } from '@/types/animation'

import {
  ModalOrchestrationComparisonMorph,
  metadata as comparisonMorphMetadata,
} from './ModalOrchestrationComparisonMorph'
import {
  ModalOrchestrationSelectionGrid,
  metadata as selectionGridMetadata,
} from './ModalOrchestrationSelectionGrid'
import { ModalOrchestrationTabMorph, metadata as tabMorphMetadata } from './ModalOrchestrationTabMorph'
import {
  ModalOrchestrationWizardFadeCross,
  metadata as wizardFadeCrossMetadata,
} from './ModalOrchestrationWizardFadeCross'
import {
  ModalOrchestrationWizardScaleRotate,
  metadata as wizardScaleRotateMetadata,
} from './ModalOrchestrationWizardScaleRotate'
import {
  ModalOrchestrationWizardSlideStack,
  metadata as wizardSlideStackMetadata,
} from './ModalOrchestrationWizardSlideStack'
import {
  ModalOrchestrationStaggerInview,
  metadata as staggerInviewMetadata,
} from './ModalOrchestrationStaggerInview'
import {
  ModalOrchestrationSpringPhysics,
  metadata as springPhysicsMetadata,
} from './ModalOrchestrationSpringPhysics'
import {
  ModalOrchestrationMagneticHover,
  metadata as magneticHoverMetadata,
} from './ModalOrchestrationMagneticHover'
import {
  ModalOrchestrationFlipReveal,
  metadata as flipRevealMetadata,
} from './ModalOrchestrationFlipReveal'

export const groupMetadata: GroupMetadata = {
  id: 'modal-orchestration',
  title: 'Tile animations',
  tech: 'framer',
  demo: 'wizard',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  animations: {
    'modal-orchestration__wizard-slide-stack': {
      component: ModalOrchestrationWizardSlideStack,
      metadata: wizardSlideStackMetadata,
    },
    'modal-orchestration__wizard-fade-cross': {
      component: ModalOrchestrationWizardFadeCross,
      metadata: wizardFadeCrossMetadata,
    },
    'modal-orchestration__wizard-scale-rotate': {
      component: ModalOrchestrationWizardScaleRotate,
      metadata: wizardScaleRotateMetadata,
    },
    'modal-orchestration__tab-morph': {
      component: ModalOrchestrationTabMorph,
      metadata: tabMorphMetadata,
    },
    'modal-orchestration__selection-grid': {
      component: ModalOrchestrationSelectionGrid,
      metadata: selectionGridMetadata,
    },
    'modal-orchestration__comparison-morph': {
      component: ModalOrchestrationComparisonMorph,
      metadata: comparisonMorphMetadata,
    },
    'modal-orchestration__stagger-inview': {
      component: ModalOrchestrationStaggerInview,
      metadata: staggerInviewMetadata,
    },
    'modal-orchestration__spring-physics': {
      component: ModalOrchestrationSpringPhysics,
      metadata: springPhysicsMetadata,
    },
    'modal-orchestration__magnetic-hover': {
      component: ModalOrchestrationMagneticHover,
      metadata: magneticHoverMetadata,
    },
    'modal-orchestration__flip-reveal': {
      component: ModalOrchestrationFlipReveal,
      metadata: flipRevealMetadata,
    },
  },
}
