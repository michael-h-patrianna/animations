import type { GroupMetadata, GroupExport } from '@/types/animation'

import {
  ModalOrchestrationComparisonMorph,
  metadata as comparisonMorphMetadata,
} from './framer/ModalOrchestrationComparisonMorph'
import {
  ModalOrchestrationSelectionGrid,
  metadata as selectionGridMetadata,
} from './framer/ModalOrchestrationSelectionGrid'
import { ModalOrchestrationTabMorph, metadata as tabMorphMetadata } from './framer/ModalOrchestrationTabMorph'
import {
  ModalOrchestrationWizardFadeCross,
  metadata as wizardFadeCrossMetadata,
} from './framer/ModalOrchestrationWizardFadeCross'
import {
  ModalOrchestrationWizardScaleRotate,
  metadata as wizardScaleRotateMetadata,
} from './framer/ModalOrchestrationWizardScaleRotate'
import {
  ModalOrchestrationWizardSlideStack,
  metadata as wizardSlideStackMetadata,
} from './framer/ModalOrchestrationWizardSlideStack'
import {
  ModalOrchestrationStaggerInview,
  metadata as staggerInviewMetadata,
} from './framer/ModalOrchestrationStaggerInview'
import {
  ModalOrchestrationSpringPhysics,
  metadata as springPhysicsMetadata,
} from './framer/ModalOrchestrationSpringPhysics'
import {
  ModalOrchestrationMagneticHover,
  metadata as magneticHoverMetadata,
} from './framer/ModalOrchestrationMagneticHover'
import {
  ModalOrchestrationFlipReveal,
  metadata as flipRevealMetadata,
} from './framer/ModalOrchestrationFlipReveal'

export const groupMetadata: GroupMetadata = {
  id: 'modal-orchestration',
  title: 'Tile animations',
  tech: 'framer',
  demo: 'wizard',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
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
  css: {},
}
