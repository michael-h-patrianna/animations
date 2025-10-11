import type { AnimationMetadata } from '@/types/animation'
import './LoadingStatesSpinnerGalaxy.css'

export function LoadingStatesSpinnerGalaxy() {
  return (
    <div data-animation-id="loading-states__spinner-galaxy" className="pf-loading-container">
      <div className="pf-spinner-galaxy"></div>
    </div>
  )
}

export const metadata = {
  id: 'loading-states__spinner-galaxy',
  title: 'Spinner Galaxy',
  description: 'Galaxy spinner with layered opacity twirls.',
  tags: ['css']
} satisfies AnimationMetadata
