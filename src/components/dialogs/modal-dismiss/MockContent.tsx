import type { RefObject } from 'react'
import './shared.css'

interface MockContentProps {
  toastRef: RefObject<HTMLDivElement | null>
  progressRef: RefObject<HTMLDivElement | null>
  animationId: string
}

export function MockContent({ toastRef, progressRef, animationId }: MockContentProps) {
  return (
    <div className="pf-toast-preview">
      <div ref={toastRef} className="pf-toast" data-animation-id={animationId}>
        <div className="pf-toast__title">Action Complete</div>
        <div className="pf-toast__body">Your changes have been saved</div>
        <div className="pf-toast__progress">
          <div ref={progressRef} className="pf-toast__progress-bar"></div>
        </div>
      </div>
    </div>
  )
}