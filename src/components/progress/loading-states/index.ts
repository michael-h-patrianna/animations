import type { GroupExport, GroupMetadata } from '@/types/animation'

import { LoadingStatesDotsPortal, metadata as dotsPortalMeta } from './framer/LoadingStatesDotsPortal'
import { LoadingStatesDotsRise, metadata as dotsRiseMeta } from './framer/LoadingStatesDotsRise'
import { LoadingStatesRingMulti, metadata as ringMultiMeta } from './framer/LoadingStatesRingMulti'
import { LoadingStatesRingProgress, metadata as ringProgressMeta } from './framer/LoadingStatesRingProgress'
import { LoadingStatesSkeletonCard, metadata as skeletonCardMeta } from './framer/LoadingStatesSkeletonCard'
import { LoadingStatesSkeletonHorizontal, metadata as skeletonHorizontalMeta } from './framer/LoadingStatesSkeletonHorizontal'
import { LoadingStatesSkeletonTile, metadata as skeletonTileMeta } from './framer/LoadingStatesSkeletonTile'
import { LoadingStatesSkeletonVertical, metadata as skeletonVerticalMeta } from './framer/LoadingStatesSkeletonVertical'
import { LoadingStatesSpinnerDualRing, metadata as spinnerDualRingMeta } from './framer/LoadingStatesSpinnerDualRing'
import { LoadingStatesSpinnerGalaxy, metadata as spinnerGalaxyMeta } from './framer/LoadingStatesSpinnerGalaxy'
import { LoadingStatesSpinnerOrbital, metadata as spinnerOrbitalMeta } from './framer/LoadingStatesSpinnerOrbital'

// CSS animations
import { LoadingStatesDotsPortal as CssLoadingStatesDotsPortal, metadata as dotsPortalCssMeta } from './css/LoadingStatesDotsPortal'
import { LoadingStatesDotsRise as CssLoadingStatesDotsRise, metadata as dotsRiseCssMeta } from './css/LoadingStatesDotsRise'
import { LoadingStatesRingMulti as CssLoadingStatesRingMulti, metadata as ringMultiCssMeta } from './css/LoadingStatesRingMulti'
import { LoadingStatesRingProgress as CssLoadingStatesRingProgress, metadata as ringProgressCssMeta } from './css/LoadingStatesRingProgress'
import { LoadingStatesSkeletonCard as CssLoadingStatesSkeletonCard, metadata as skeletonCardCssMeta } from './css/LoadingStatesSkeletonCard'
import { LoadingStatesSkeletonHorizontal as CssLoadingStatesSkeletonHorizontal, metadata as skeletonHorizontalCssMeta } from './css/LoadingStatesSkeletonHorizontal'
import { LoadingStatesSkeletonTile as CssLoadingStatesSkeletonTile, metadata as skeletonTileCssMeta } from './css/LoadingStatesSkeletonTile'
import { LoadingStatesSkeletonVertical as CssLoadingStatesSkeletonVertical, metadata as skeletonVerticalCssMeta } from './css/LoadingStatesSkeletonVertical'
import { LoadingStatesSpinnerDualRing as CssLoadingStatesSpinnerDualRing, metadata as spinnerDualRingCssMeta } from './css/LoadingStatesSpinnerDualRing'
import { LoadingStatesSpinnerGalaxy as CssLoadingStatesSpinnerGalaxy, metadata as spinnerGalaxyCssMeta } from './css/LoadingStatesSpinnerGalaxy'
import { LoadingStatesSpinnerOrbital as CssLoadingStatesSpinnerOrbital, metadata as spinnerOrbitalCssMeta } from './css/LoadingStatesSpinnerOrbital'


export const groupMetadata: GroupMetadata = {
  id: 'loading-states',
  title: 'Loading states',
  tech: 'css',
  demo: 'loader'
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  framer: {
    'loading-states__skeleton-horizontal': {
      component: LoadingStatesSkeletonHorizontal,
      metadata: skeletonHorizontalMeta
    },
    'loading-states__skeleton-vertical': {
      component: LoadingStatesSkeletonVertical,
      metadata: skeletonVerticalMeta
    },
    'loading-states__skeleton-tile': {
      component: LoadingStatesSkeletonTile,
      metadata: skeletonTileMeta
    },
    'loading-states__skeleton-card': {
      component: LoadingStatesSkeletonCard,
      metadata: skeletonCardMeta
    },
    'loading-states__spinner-dual-ring': {
      component: LoadingStatesSpinnerDualRing,
      metadata: spinnerDualRingMeta
    },
    'loading-states__spinner-orbital': {
      component: LoadingStatesSpinnerOrbital,
      metadata: spinnerOrbitalMeta
    },
    'loading-states__spinner-galaxy': {
      component: LoadingStatesSpinnerGalaxy,
      metadata: spinnerGalaxyMeta
    },
    'loading-states__dots-rise': {
      component: LoadingStatesDotsRise,
      metadata: dotsRiseMeta
    },
    'loading-states__dots-portal': {
      component: LoadingStatesDotsPortal,
      metadata: dotsPortalMeta
    },
    'loading-states__ring-progress': {
      component: LoadingStatesRingProgress,
      metadata: ringProgressMeta
    },
    'loading-states__ring-multi': {
      component: LoadingStatesRingMulti,
      metadata: ringMultiMeta
    }
  },
  css: {
    'loading-states__skeleton-horizontal': {
      component: CssLoadingStatesSkeletonHorizontal,
      metadata: skeletonHorizontalCssMeta
    },
    'loading-states__skeleton-vertical': {
      component: CssLoadingStatesSkeletonVertical,
      metadata: skeletonVerticalCssMeta
    },
    'loading-states__skeleton-tile': {
      component: CssLoadingStatesSkeletonTile,
      metadata: skeletonTileCssMeta
    },
    'loading-states__skeleton-card': {
      component: CssLoadingStatesSkeletonCard,
      metadata: skeletonCardCssMeta
    },
    'loading-states__spinner-dual-ring': {
      component: CssLoadingStatesSpinnerDualRing,
      metadata: spinnerDualRingCssMeta
    },
    'loading-states__spinner-orbital': {
      component: CssLoadingStatesSpinnerOrbital,
      metadata: spinnerOrbitalCssMeta
    },
    'loading-states__spinner-galaxy': {
      component: CssLoadingStatesSpinnerGalaxy,
      metadata: spinnerGalaxyCssMeta
    },
    'loading-states__dots-rise': {
      component: CssLoadingStatesDotsRise,
      metadata: dotsRiseCssMeta
    },
    'loading-states__dots-portal': {
      component: CssLoadingStatesDotsPortal,
      metadata: dotsPortalCssMeta
    },
    'loading-states__ring-progress': {
      component: CssLoadingStatesRingProgress,
      metadata: ringProgressCssMeta
    },
    'loading-states__ring-multi': {
      component: CssLoadingStatesRingMulti,
      metadata: ringMultiCssMeta
    }
  },
}
