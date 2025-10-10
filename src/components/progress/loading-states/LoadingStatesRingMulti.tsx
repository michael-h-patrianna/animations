import type { AnimationMetadata } from '@/types/animation'
import './LoadingStatesRingMulti.css'

export function LoadingStatesRingMulti() {
  return (
    <div data-animation-id="loading-states__ring-multi" className="pf-loading-container">
      <div className="pf-ring-multi">
        <span className="pf-ring-multi__segment"></span>
        <span className="pf-ring-multi__segment"></span>
        <span className="pf-ring-multi__segment"></span>
      </div>
    </div>
  )
}

export const metadata = {
  id: 'loading-states__ring-multi',
  title: 'Multi Ring',
  description: 'Nested rings oscillate asynchronously.',
  tags: ['css']
} satisfies AnimationMetadata
