import type { AnimationMetadata } from '@/types/animation'
import './LoadingStatesDotsPortal.css'

export function LoadingStatesDotsPortal() {
  return (
    <div data-animation-id="loading-states__dots-portal" className="pf-loading-container">
      <div className="pf-dots pf-dots-portal">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  )
}

export const metadata = {
  id: 'loading-states__dots-portal',
  title: 'Dots Portal',
  description: 'Dots fold into portal centre to indicate processing.',
  tags: ['css']
} satisfies AnimationMetadata
