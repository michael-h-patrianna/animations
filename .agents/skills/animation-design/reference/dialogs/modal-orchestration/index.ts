import type { GroupExport, GroupMetadata } from '@/types/animation'
import { lazy } from 'react'

// Framer Motion - Import metadata only
import { metadata as comparisonMorphMetadata } from './framer/ModalOrchestrationComparisonMorph.meta'
import { metadata as flipRevealMetadata } from './framer/ModalOrchestrationFlipReveal.meta'
import { metadata as gridHighlightMetadata } from './framer/ModalOrchestrationGridHighlight.meta'
import { metadata as magneticHoverMetadata } from './framer/ModalOrchestrationMagneticHover.meta'
import { metadata as selectionGridMetadata } from './framer/ModalOrchestrationSelectionGrid.meta'
import { metadata as springPhysicsMetadata } from './framer/ModalOrchestrationSpringPhysics.meta'
import { metadata as staggerInviewMetadata } from './framer/ModalOrchestrationStaggerInview.meta'
import { metadata as tabMorphMetadata } from './framer/ModalOrchestrationTabMorph.meta'
import { metadata as wizardFadeCrossMetadata } from './framer/ModalOrchestrationWizardFadeCross.meta'
import { metadata as wizardScaleRotateMetadata } from './framer/ModalOrchestrationWizardScaleRotate.meta'
import { metadata as wizardSlideStackMetadata } from './framer/ModalOrchestrationWizardSlideStack.meta'

// CSS - Import metadata only
import { metadata as comparisonMorphCssMetadata } from './css/ModalOrchestrationComparisonMorph.meta'
import { metadata as flipRevealCssMetadata } from './css/ModalOrchestrationFlipReveal.meta'
import { metadata as gridHighlightCssMetadata } from './css/ModalOrchestrationGridHighlight.meta'
import { metadata as magneticHoverCssMetadata } from './css/ModalOrchestrationMagneticHover.meta'
import { metadata as selectionGridCssMetadata } from './css/ModalOrchestrationSelectionGrid.meta'
import { metadata as springPhysicsCssMetadata } from './css/ModalOrchestrationSpringPhysics.meta'
import { metadata as staggerInviewCssMetadata } from './css/ModalOrchestrationStaggerInview.meta'
import { metadata as tabMorphCssMetadata } from './css/ModalOrchestrationTabMorph.meta'
import { metadata as wizardFadeCrossCssMetadata } from './css/ModalOrchestrationWizardFadeCross.meta'
import { metadata as wizardScaleRotateCssMetadata } from './css/ModalOrchestrationWizardScaleRotate.meta'
import { metadata as wizardSlideStackCssMetadata } from './css/ModalOrchestrationWizardSlideStack.meta'

// Framer Motion - Lazy load components
const ModalOrchestrationComparisonMorph = lazy(() =>
  import('./framer/ModalOrchestrationComparisonMorph').then((m) => ({
    default: m.ModalOrchestrationComparisonMorph,
  }))
)
const ModalOrchestrationSelectionGrid = lazy(() =>
  import('./framer/ModalOrchestrationSelectionGrid').then((m) => ({
    default: m.ModalOrchestrationSelectionGrid,
  }))
)
const ModalOrchestrationTabMorph = lazy(() =>
  import('./framer/ModalOrchestrationTabMorph').then((m) => ({
    default: m.ModalOrchestrationTabMorph,
  }))
)
const ModalOrchestrationFlipReveal = lazy(() =>
  import('./framer/ModalOrchestrationFlipReveal').then((m) => ({
    default: m.ModalOrchestrationFlipReveal,
  }))
)
const ModalOrchestrationGridHighlight = lazy(() =>
  import('./framer/ModalOrchestrationGridHighlight').then((m) => ({
    default: m.ModalOrchestrationGridHighlight,
  }))
)
const ModalOrchestrationMagneticHover = lazy(() =>
  import('./framer/ModalOrchestrationMagneticHover').then((m) => ({
    default: m.ModalOrchestrationMagneticHover,
  }))
)
const ModalOrchestrationSpringPhysics = lazy(() =>
  import('./framer/ModalOrchestrationSpringPhysics').then((m) => ({
    default: m.ModalOrchestrationSpringPhysics,
  }))
)
const ModalOrchestrationStaggerInview = lazy(() =>
  import('./framer/ModalOrchestrationStaggerInview').then((m) => ({
    default: m.ModalOrchestrationStaggerInview,
  }))
)
const ModalOrchestrationWizardFadeCross = lazy(() =>
  import('./framer/ModalOrchestrationWizardFadeCross').then((m) => ({
    default: m.ModalOrchestrationWizardFadeCross,
  }))
)
const ModalOrchestrationWizardScaleRotate = lazy(() =>
  import('./framer/ModalOrchestrationWizardScaleRotate').then((m) => ({
    default: m.ModalOrchestrationWizardScaleRotate,
  }))
)
const ModalOrchestrationWizardSlideStack = lazy(() =>
  import('./framer/ModalOrchestrationWizardSlideStack').then((m) => ({
    default: m.ModalOrchestrationWizardSlideStack,
  }))
)

// CSS - Lazy load components
const CssModalOrchestrationComparisonMorph = lazy(() =>
  import('./css/ModalOrchestrationComparisonMorph').then((m) => ({
    default: m.ModalOrchestrationComparisonMorph,
  }))
)
const CssModalOrchestrationFlipReveal = lazy(() =>
  import('./css/ModalOrchestrationFlipReveal').then((m) => ({
    default: m.ModalOrchestrationFlipReveal,
  }))
)
const CssModalOrchestrationGridHighlight = lazy(() =>
  import('./css/ModalOrchestrationGridHighlight').then((m) => ({
    default: m.ModalOrchestrationGridHighlight,
  }))
)
const CssModalOrchestrationMagneticHover = lazy(() =>
  import('./css/ModalOrchestrationMagneticHover').then((m) => ({
    default: m.ModalOrchestrationMagneticHover,
  }))
)
const CssModalOrchestrationSelectionGrid = lazy(() =>
  import('./css/ModalOrchestrationSelectionGrid').then((m) => ({
    default: m.ModalOrchestrationSelectionGrid,
  }))
)
const CssModalOrchestrationSpringPhysics = lazy(() =>
  import('./css/ModalOrchestrationSpringPhysics').then((m) => ({
    default: m.ModalOrchestrationSpringPhysics,
  }))
)
const CssModalOrchestrationStaggerInview = lazy(() =>
  import('./css/ModalOrchestrationStaggerInview').then((m) => ({
    default: m.ModalOrchestrationStaggerInview,
  }))
)
const CssModalOrchestrationTabMorph = lazy(() =>
  import('./css/ModalOrchestrationTabMorph').then((m) => ({
    default: m.ModalOrchestrationTabMorph,
  }))
)
const CssModalOrchestrationWizardFadeCross = lazy(() =>
  import('./css/ModalOrchestrationWizardFadeCross').then((m) => ({
    default: m.ModalOrchestrationWizardFadeCross,
  }))
)
const CssModalOrchestrationWizardScaleRotate = lazy(() =>
  import('./css/ModalOrchestrationWizardScaleRotate').then((m) => ({
    default: m.ModalOrchestrationWizardScaleRotate,
  }))
)
const CssModalOrchestrationWizardSlideStack = lazy(() =>
  import('./css/ModalOrchestrationWizardSlideStack').then((m) => ({
    default: m.ModalOrchestrationWizardSlideStack,
  }))
)

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
  },
}
