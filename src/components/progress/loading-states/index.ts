import type { AnimationComponentMap } from '@/types/animation'

import { LoadingStatesDotsPortal } from './LoadingStatesDotsPortal'
import { LoadingStatesDotsRise } from './LoadingStatesDotsRise'
import { LoadingStatesRingMulti } from './LoadingStatesRingMulti'
import { LoadingStatesRingProgress } from './LoadingStatesRingProgress'
import { LoadingStatesSkeletonCard } from './LoadingStatesSkeletonCard'
import { LoadingStatesSkeletonHorizontal } from './LoadingStatesSkeletonHorizontal'
import { LoadingStatesSkeletonTile } from './LoadingStatesSkeletonTile'
import { LoadingStatesSkeletonVertical } from './LoadingStatesSkeletonVertical'
import { LoadingStatesSpinnerDualRing } from './LoadingStatesSpinnerDualRing'
import { LoadingStatesSpinnerGalaxy } from './LoadingStatesSpinnerGalaxy'
import { LoadingStatesSpinnerOrbital } from './LoadingStatesSpinnerOrbital'

export { LoadingStatesDotsPortal } from './LoadingStatesDotsPortal'
export { LoadingStatesDotsRise } from './LoadingStatesDotsRise'
export { LoadingStatesRingMulti } from './LoadingStatesRingMulti'
export { LoadingStatesRingProgress } from './LoadingStatesRingProgress'
export { LoadingStatesSkeletonCard } from './LoadingStatesSkeletonCard'
export { LoadingStatesSkeletonHorizontal } from './LoadingStatesSkeletonHorizontal'
export { LoadingStatesSkeletonTile } from './LoadingStatesSkeletonTile'
export { LoadingStatesSkeletonVertical } from './LoadingStatesSkeletonVertical'
export { LoadingStatesSpinnerDualRing } from './LoadingStatesSpinnerDualRing'
export { LoadingStatesSpinnerGalaxy } from './LoadingStatesSpinnerGalaxy'
export { LoadingStatesSpinnerOrbital } from './LoadingStatesSpinnerOrbital'

export const progressLoadingStatesAnimations: AnimationComponentMap = {
  'loading-states__dots-portal': LoadingStatesDotsPortal,
  'loading-states__dots-rise': LoadingStatesDotsRise,
  'loading-states__ring-multi': LoadingStatesRingMulti,
  'loading-states__ring-progress': LoadingStatesRingProgress,
  'loading-states__skeleton-card': LoadingStatesSkeletonCard,
  'loading-states__skeleton-horizontal': LoadingStatesSkeletonHorizontal,
  'loading-states__skeleton-tile': LoadingStatesSkeletonTile,
  'loading-states__skeleton-vertical': LoadingStatesSkeletonVertical,
  'loading-states__spinner-dual-ring': LoadingStatesSpinnerDualRing,
  'loading-states__spinner-galaxy': LoadingStatesSpinnerGalaxy,
  'loading-states__spinner-orbital': LoadingStatesSpinnerOrbital,
}
