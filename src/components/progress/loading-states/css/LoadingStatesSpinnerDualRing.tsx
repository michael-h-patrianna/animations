import type { AnimationMetadata } from '@/types/animation'
import './LoadingStatesSpinnerDualRing.css'

export function LoadingStatesSpinnerDualRing() {
  return (
    <div data-animation-id="loading-states__spinner-dual-ring" className="pf-loading-container">
      <div className="pf-spinner-dual-ring"></div>
    </div>
  )
}

export const metadata = {
  id: 'loading-states__spinner-dual-ring',
  title: 'Spinner Dual Ring',
  description: 'Dual ring spinner with consistent velocity.',
  tags: ['css']
} satisfies AnimationMetadata
