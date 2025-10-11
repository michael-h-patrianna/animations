import type { AnimationMetadata } from '@/types/animation'
import './LoadingStatesSkeletonTile.css'

export function LoadingStatesSkeletonTile() {
  return (
    <div data-animation-id="loading-states__skeleton-tile" className="pf-loading-container">
      <div className="pf-skeleton-tile">
        <div className="pf-skeleton__tile"></div>
        <div className="pf-skeleton__tile"></div>
        <div className="pf-skeleton__tile"></div>
        <div className="pf-skeleton__tile"></div>
        <div className="pf-skeleton__tile"></div>
        <div className="pf-skeleton__tile"></div>
      </div>
    </div>
  )
}

export const metadata = {
  id: 'loading-states__skeleton-tile',
  title: 'Skeleton Tile Grid',
  description: 'Grid skeleton effect for gallery loading.',
  tags: ['css']
} satisfies AnimationMetadata
