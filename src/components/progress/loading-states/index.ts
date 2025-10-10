import type { GroupExport, GroupMetadata } from '@/types/animation'

import { LoadingStatesDotsPortal, metadata as dotsPortalMeta } from './LoadingStatesDotsPortal'
import { LoadingStatesDotsRise, metadata as dotsRiseMeta } from './LoadingStatesDotsRise'
import { LoadingStatesRingMulti, metadata as ringMultiMeta } from './LoadingStatesRingMulti'
import { LoadingStatesRingProgress, metadata as ringProgressMeta } from './LoadingStatesRingProgress'
import { LoadingStatesSkeletonCard, metadata as skeletonCardMeta } from './LoadingStatesSkeletonCard'
import { LoadingStatesSkeletonHorizontal, metadata as skeletonHorizontalMeta } from './LoadingStatesSkeletonHorizontal'
import { LoadingStatesSkeletonTile, metadata as skeletonTileMeta } from './LoadingStatesSkeletonTile'
import { LoadingStatesSkeletonVertical, metadata as skeletonVerticalMeta } from './LoadingStatesSkeletonVertical'
import { LoadingStatesSpinnerDualRing, metadata as spinnerDualRingMeta } from './LoadingStatesSpinnerDualRing'
import { LoadingStatesSpinnerGalaxy, metadata as spinnerGalaxyMeta } from './LoadingStatesSpinnerGalaxy'
import { LoadingStatesSpinnerOrbital, metadata as spinnerOrbitalMeta } from './LoadingStatesSpinnerOrbital'


export const groupMetadata: GroupMetadata = {
  id: 'loading-states',
  title: 'Loading states',
  tech: 'css',
  demo: 'loader'
}

export const groupExport: GroupExport = {
  metadata: groupMetadata,
  animations: {
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
  }
}
