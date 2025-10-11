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

// CSS animations
import {
  ModalOrchestrationComparisonMorph as CssModalOrchestrationComparisonMorph,
  metadata as comparisonMorphCssMetadata,
} from './css/ModalOrchestrationComparisonMorph'
import {
  ModalOrchestrationFlipReveal as CssModalOrchestrationFlipReveal,
  metadata as flipRevealCssMetadata,
} from './css/ModalOrchestrationFlipReveal'
import {
  ModalOrchestrationMagneticHover as CssModalOrchestrationMagneticHover,
  metadata as magneticHoverCssMetadata,
} from './css/ModalOrchestrationMagneticHover'
import {
  ModalOrchestrationSelectionGrid as CssModalOrchestrationSelectionGrid,
  metadata as selectionGridCssMetadata,
} from './css/ModalOrchestrationSelectionGrid'
import {
  ModalOrchestrationSpringPhysics as CssModalOrchestrationSpringPhysics,
  metadata as springPhysicsCssMetadata,
} from './css/ModalOrchestrationSpringPhysics'
import {
  ModalOrchestrationStaggerInview as CssModalOrchestrationStaggerInview,
  metadata as staggerInviewCssMetadata,
} from './css/ModalOrchestrationStaggerInview'
import {
  ModalOrchestrationTabMorph as CssModalOrchestrationTabMorph,
  metadata as tabMorphCssMetadata,
} from './css/ModalOrchestrationTabMorph'
import {
  ModalOrchestrationWizardFadeCross as CssModalOrchestrationWizardFadeCross,
  metadata as wizardFadeCrossCssMetadata,
} from './css/ModalOrchestrationWizardFadeCross'
import {
  ModalOrchestrationWizardScaleRotate as CssModalOrchestrationWizardScaleRotate,
  metadata as wizardScaleRotateCssMetadata,
} from './css/ModalOrchestrationWizardScaleRotate'
import {
  ModalOrchestrationWizardSlideStack as CssModalOrchestrationWizardSlideStack,
  metadata as wizardSlideStackCssMetadata,
} from './css/ModalOrchestrationWizardSlideStack'
import {
  ModalOrchestrationGridHighlight as CssModalOrchestrationGridHighlight,
  metadata as gridHighlightCssMetadata,
} from './css/ModalOrchestrationGridHighlight'
import {
  ModalOrchestrationMultiStepProgressive as CssModalOrchestrationMultiStepProgressive,
  metadata as multiStepProgressiveCssMetadata,
} from './css/ModalOrchestrationMultiStepProgressive'
import {
  ModalOrchestrationTabSlide as CssModalOrchestrationTabSlide,
  metadata as tabSlideCssMetadata,
} from './css/ModalOrchestrationTabSlide'
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
import {
  ModalOrchestrationGridHighlight,
  metadata as gridHighlightMetadata,
} from './framer/ModalOrchestrationGridHighlight'
import {
  ModalOrchestrationMultiStepProgressive,
  metadata as multiStepProgressiveMetadata,
} from './framer/ModalOrchestrationMultiStepProgressive'
import {
  ModalOrchestrationTabSlide,
  metadata as tabSlideMetadata,
} from './framer/ModalOrchestrationTabSlide'

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
    'modal-orchestration__grid-highlight': {
      component: ModalOrchestrationGridHighlight,
      metadata: gridHighlightMetadata,
    },
    'modal-orchestration__multi-step-progressive': {
      component: ModalOrchestrationMultiStepProgressive,
      metadata: multiStepProgressiveMetadata,
    },
    'modal-orchestration__tab-slide': {
      component: ModalOrchestrationTabSlide,
      metadata: tabSlideMetadata,
    },
  },
  css: {
    'modal-orchestration__wizard-slide-stack': {
      component: CssModalOrchestrationWizardSlideStack,
      metadata: wizardSlideStackCssMetadata,
    },
    'modal-orchestration__wizard-fade-cross': {
      component: CssModalOrchestrationWizardFadeCross,
      metadata: wizardFadeCrossCssMetadata,
    },
    'modal-orchestration__wizard-scale-rotate': {
      component: CssModalOrchestrationWizardScaleRotate,
      metadata: wizardScaleRotateCssMetadata,
    },
    'modal-orchestration__tab-morph': {
      component: CssModalOrchestrationTabMorph,
      metadata: tabMorphCssMetadata,
    },
    'modal-orchestration__selection-grid': {
      component: CssModalOrchestrationSelectionGrid,
      metadata: selectionGridCssMetadata,
    },
    'modal-orchestration__comparison-morph': {
      component: CssModalOrchestrationComparisonMorph,
      metadata: comparisonMorphCssMetadata,
    },
    'modal-orchestration__stagger-inview': {
      component: CssModalOrchestrationStaggerInview,
      metadata: staggerInviewCssMetadata,
    },
    'modal-orchestration__spring-physics': {
      component: CssModalOrchestrationSpringPhysics,
      metadata: springPhysicsCssMetadata,
    },
    'modal-orchestration__magnetic-hover': {
      component: CssModalOrchestrationMagneticHover,
      metadata: magneticHoverCssMetadata,
    },
    'modal-orchestration__flip-reveal': {
      component: CssModalOrchestrationFlipReveal,
      metadata: flipRevealCssMetadata,
    },
    'modal-orchestration__grid-highlight': {
      component: CssModalOrchestrationGridHighlight,
      metadata: gridHighlightCssMetadata,
    },
    'modal-orchestration__multi-step-progressive': {
      component: CssModalOrchestrationMultiStepProgressive,
      metadata: multiStepProgressiveCssMetadata,
    },
    'modal-orchestration__tab-slide': {
      component: CssModalOrchestrationTabSlide,
      metadata: tabSlideCssMetadata,
    },
  },
}
