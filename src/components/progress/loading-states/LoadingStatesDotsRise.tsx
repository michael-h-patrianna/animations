import type { AnimationMetadata } from '@/types/animation'
import './LoadingStatesDotsRise.css'

export function LoadingStatesDotsRise() {
  return (
    <div data-animation-id="loading-states__dots-rise" className="pf-loading-container">
      <div className="pf-dots pf-dots-rise">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  )
}

export const metadata = {
  id: 'loading-states__dots-rise',
  title: 'Dots Rise',
  description: 'Three-dot rise cadence for subtle loading feedback.',
  tags: ['css']
} satisfies AnimationMetadata
