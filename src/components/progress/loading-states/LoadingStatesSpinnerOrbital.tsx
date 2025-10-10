import type { AnimationMetadata } from '@/types/animation'
import './LoadingStatesSpinnerOrbital.css'

export function LoadingStatesSpinnerOrbital() {
  return (
    <div data-animation-id="loading-states__spinner-orbital" className="pf-loading-container">
      <div className="pf-spinner-orbital"></div>
    </div>
  )
}

export const metadata = {
  id: 'loading-states__spinner-orbital',
  title: 'Spinner Orbital',
  description: 'Orbital spinner around centre mass.',
  tags: ['css']
} satisfies AnimationMetadata
