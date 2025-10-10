import type { AnimationMetadata } from '@/types/animation'
import './LoadingStatesSkeletonVertical.css'

export function LoadingStatesSkeletonVertical() {
  return (
    <div data-animation-id="loading-states__skeleton-vertical" className="pf-loading-container">
      <div className="pf-skeleton pf-skeleton-vertical">
        <div className="pf-skeleton__line"></div>
        <div className="pf-skeleton__line"></div>
        <div className="pf-skeleton__line"></div>
        <div className="pf-skeleton__line"></div>
        <div className="pf-skeleton__line"></div>
        <div className="pf-skeleton__line"></div>
      </div>
    </div>
  )
}

export const metadata = {
  id: 'loading-states__skeleton-vertical',
  title: 'Skeleton Vertical',
  description: 'Vertical skeleton stack simulating cards.',
  tags: ['css']
} satisfies AnimationMetadata
