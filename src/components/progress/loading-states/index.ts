// Framer variant CSS (loaded at group level for no-css-in-motion compliance)
import './shared.css'
import './framer/LoadingStatesDotsPortal.css'
import './framer/LoadingStatesDotsRise.css'
import './framer/LoadingStatesRingMulti.css'
import './framer/LoadingStatesRingProgress.css'
import './framer/LoadingStatesSkeletonCard.css'
import './framer/LoadingStatesSkeletonHorizontal.css'
import './framer/LoadingStatesSkeletonTile.css'
import './framer/LoadingStatesSkeletonVertical.css'
import './framer/LoadingStatesSpinnerDualRing.css'
import './framer/LoadingStatesSpinnerGalaxy.css'
import './framer/LoadingStatesSpinnerOrbital.css'

import type { GroupExport, GroupMetadata } from '@/types/animation'
import { lazy } from 'react'

// Framer Motion - Import metadata only
import { metadata as dotsPortalMeta } from './framer/LoadingStatesDotsPortal.meta'
import { metadata as dotsRiseMeta } from './framer/LoadingStatesDotsRise.meta'
import { metadata as ringMultiMeta } from './framer/LoadingStatesRingMulti.meta'
import { metadata as ringProgressMeta } from './framer/LoadingStatesRingProgress.meta'
import { metadata as skeletonCardMeta } from './framer/LoadingStatesSkeletonCard.meta'
import { metadata as skeletonHorizontalMeta } from './framer/LoadingStatesSkeletonHorizontal.meta'
import { metadata as skeletonTileMeta } from './framer/LoadingStatesSkeletonTile.meta'
import { metadata as skeletonVerticalMeta } from './framer/LoadingStatesSkeletonVertical.meta'
import { metadata as spinnerDualRingMeta } from './framer/LoadingStatesSpinnerDualRing.meta'
import { metadata as spinnerGalaxyMeta } from './framer/LoadingStatesSpinnerGalaxy.meta'
import { metadata as spinnerOrbitalMeta } from './framer/LoadingStatesSpinnerOrbital.meta'

// CSS - Import metadata only
import { metadata as dotsPortalCssMeta } from './css/LoadingStatesDotsPortal.meta'
import { metadata as dotsRiseCssMeta } from './css/LoadingStatesDotsRise.meta'
import { metadata as ringMultiCssMeta } from './css/LoadingStatesRingMulti.meta'
import { metadata as ringProgressCssMeta } from './css/LoadingStatesRingProgress.meta'
import { metadata as skeletonCardCssMeta } from './css/LoadingStatesSkeletonCard.meta'
import { metadata as skeletonHorizontalCssMeta } from './css/LoadingStatesSkeletonHorizontal.meta'
import { metadata as skeletonTileCssMeta } from './css/LoadingStatesSkeletonTile.meta'
import { metadata as skeletonVerticalCssMeta } from './css/LoadingStatesSkeletonVertical.meta'
import { metadata as spinnerDualRingCssMeta } from './css/LoadingStatesSpinnerDualRing.meta'
import { metadata as spinnerGalaxyCssMeta } from './css/LoadingStatesSpinnerGalaxy.meta'
import { metadata as spinnerOrbitalCssMeta } from './css/LoadingStatesSpinnerOrbital.meta'

// Framer Motion - Lazy load components
const LoadingStatesDotsPortal = lazy(() =>
  import('./framer/LoadingStatesDotsPortal').then((m) => ({ default: m.LoadingStatesDotsPortal }))
)
const LoadingStatesDotsRise = lazy(() =>
  import('./framer/LoadingStatesDotsRise').then((m) => ({ default: m.LoadingStatesDotsRise }))
)
const LoadingStatesRingMulti = lazy(() =>
  import('./framer/LoadingStatesRingMulti').then((m) => ({ default: m.LoadingStatesRingMulti }))
)
const LoadingStatesRingProgress = lazy(() =>
  import('./framer/LoadingStatesRingProgress').then((m) => ({
    default: m.LoadingStatesRingProgress,
  }))
)
const LoadingStatesSkeletonCard = lazy(() =>
  import('./framer/LoadingStatesSkeletonCard').then((m) => ({
    default: m.LoadingStatesSkeletonCard,
  }))
)
const LoadingStatesSkeletonHorizontal = lazy(() =>
  import('./framer/LoadingStatesSkeletonHorizontal').then((m) => ({
    default: m.LoadingStatesSkeletonHorizontal,
  }))
)
const LoadingStatesSkeletonTile = lazy(() =>
  import('./framer/LoadingStatesSkeletonTile').then((m) => ({
    default: m.LoadingStatesSkeletonTile,
  }))
)
const LoadingStatesSkeletonVertical = lazy(() =>
  import('./framer/LoadingStatesSkeletonVertical').then((m) => ({
    default: m.LoadingStatesSkeletonVertical,
  }))
)
const LoadingStatesSpinnerDualRing = lazy(() =>
  import('./framer/LoadingStatesSpinnerDualRing').then((m) => ({
    default: m.LoadingStatesSpinnerDualRing,
  }))
)
const LoadingStatesSpinnerGalaxy = lazy(() =>
  import('./framer/LoadingStatesSpinnerGalaxy').then((m) => ({
    default: m.LoadingStatesSpinnerGalaxy,
  }))
)
const LoadingStatesSpinnerOrbital = lazy(() =>
  import('./framer/LoadingStatesSpinnerOrbital').then((m) => ({
    default: m.LoadingStatesSpinnerOrbital,
  }))
)

// CSS - Lazy load components
const CssLoadingStatesDotsPortal = lazy(() =>
  import('./css/LoadingStatesDotsPortal').then((m) => ({ default: m.LoadingStatesDotsPortal }))
)
const CssLoadingStatesDotsRise = lazy(() =>
  import('./css/LoadingStatesDotsRise').then((m) => ({ default: m.LoadingStatesDotsRise }))
)
const CssLoadingStatesRingMulti = lazy(() =>
  import('./css/LoadingStatesRingMulti').then((m) => ({ default: m.LoadingStatesRingMulti }))
)
const CssLoadingStatesRingProgress = lazy(() =>
  import('./css/LoadingStatesRingProgress').then((m) => ({ default: m.LoadingStatesRingProgress }))
)
const CssLoadingStatesSkeletonCard = lazy(() =>
  import('./css/LoadingStatesSkeletonCard').then((m) => ({ default: m.LoadingStatesSkeletonCard }))
)
const CssLoadingStatesSkeletonHorizontal = lazy(() =>
  import('./css/LoadingStatesSkeletonHorizontal').then((m) => ({
    default: m.LoadingStatesSkeletonHorizontal,
  }))
)
const CssLoadingStatesSkeletonTile = lazy(() =>
  import('./css/LoadingStatesSkeletonTile').then((m) => ({ default: m.LoadingStatesSkeletonTile }))
)
const CssLoadingStatesSkeletonVertical = lazy(() =>
  import('./css/LoadingStatesSkeletonVertical').then((m) => ({
    default: m.LoadingStatesSkeletonVertical,
  }))
)
const CssLoadingStatesSpinnerDualRing = lazy(() =>
  import('./css/LoadingStatesSpinnerDualRing').then((m) => ({
    default: m.LoadingStatesSpinnerDualRing,
  }))
)
const CssLoadingStatesSpinnerGalaxy = lazy(() =>
  import('./css/LoadingStatesSpinnerGalaxy').then((m) => ({
    default: m.LoadingStatesSpinnerGalaxy,
  }))
)
const CssLoadingStatesSpinnerOrbital = lazy(() =>
  import('./css/LoadingStatesSpinnerOrbital').then((m) => ({
    default: m.LoadingStatesSpinnerOrbital,
  }))
)

export const groupMetadata: GroupMetadata = {
  id: 'loading-states',
  title: 'Loading states',
  tech: 'css',
  demo: 'loader',
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
    'loading-states__skeleton-horizontal': {
      component: LoadingStatesSkeletonHorizontal,
      metadata: skeletonHorizontalMeta,
    },
    'loading-states__skeleton-vertical': {
      component: LoadingStatesSkeletonVertical,
      metadata: skeletonVerticalMeta,
    },
    'loading-states__skeleton-tile': {
      component: LoadingStatesSkeletonTile,
      metadata: skeletonTileMeta,
    },
    'loading-states__skeleton-card': {
      component: LoadingStatesSkeletonCard,
      metadata: skeletonCardMeta,
    },
    'loading-states__spinner-dual-ring': {
      component: LoadingStatesSpinnerDualRing,
      metadata: spinnerDualRingMeta,
    },
    'loading-states__spinner-orbital': {
      component: LoadingStatesSpinnerOrbital,
      metadata: spinnerOrbitalMeta,
    },
    'loading-states__spinner-galaxy': {
      component: LoadingStatesSpinnerGalaxy,
      metadata: spinnerGalaxyMeta,
    },
    'loading-states__dots-rise': {
      component: LoadingStatesDotsRise,
      metadata: dotsRiseMeta,
    },
    'loading-states__dots-portal': {
      component: LoadingStatesDotsPortal,
      metadata: dotsPortalMeta,
    },
    'loading-states__ring-progress': {
      component: LoadingStatesRingProgress,
      metadata: ringProgressMeta,
    },
    'loading-states__ring-multi': {
      component: LoadingStatesRingMulti,
      metadata: ringMultiMeta,
    },
  },
  css: {
    'loading-states__skeleton-horizontal': {
      component: CssLoadingStatesSkeletonHorizontal,
      metadata: skeletonHorizontalCssMeta,
    },
    'loading-states__skeleton-vertical': {
      component: CssLoadingStatesSkeletonVertical,
      metadata: skeletonVerticalCssMeta,
    },
    'loading-states__skeleton-tile': {
      component: CssLoadingStatesSkeletonTile,
      metadata: skeletonTileCssMeta,
    },
    'loading-states__skeleton-card': {
      component: CssLoadingStatesSkeletonCard,
      metadata: skeletonCardCssMeta,
    },
    'loading-states__spinner-dual-ring': {
      component: CssLoadingStatesSpinnerDualRing,
      metadata: spinnerDualRingCssMeta,
    },
    'loading-states__spinner-orbital': {
      component: CssLoadingStatesSpinnerOrbital,
      metadata: spinnerOrbitalCssMeta,
    },
    'loading-states__spinner-galaxy': {
      component: CssLoadingStatesSpinnerGalaxy,
      metadata: spinnerGalaxyCssMeta,
    },
    'loading-states__dots-rise': {
      component: CssLoadingStatesDotsRise,
      metadata: dotsRiseCssMeta,
    },
    'loading-states__dots-portal': {
      component: CssLoadingStatesDotsPortal,
      metadata: dotsPortalCssMeta,
    },
    'loading-states__ring-progress': {
      component: CssLoadingStatesRingProgress,
      metadata: ringProgressCssMeta,
    },
    'loading-states__ring-multi': {
      component: CssLoadingStatesRingMulti,
      metadata: ringMultiCssMeta,
    },
  },
}
