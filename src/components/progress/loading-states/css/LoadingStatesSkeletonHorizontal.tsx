import type { AnimationMetadata } from '@/types/animation'
import './LoadingStatesSkeletonHorizontal.css'

export function LoadingStatesSkeletonHorizontal() {
  return (
    <div data-animation-id="loading-states__skeleton-horizontal" className="pf-loading-container">
      <div className="pf-skeleton pf-skeleton-horizontal">
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
  id: 'loading-states__skeleton-horizontal',
  title: 'Skeleton Horizontal',
  description: 'Horizontal skeleton shimmer for content placeholders.',
  tags: ['css']
} satisfies AnimationMetadata
