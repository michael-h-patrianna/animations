import React, { useEffect } from 'react'
import { MockModalContent } from './MockModalContent'
import './ModalBaseSlideRightDrift.css'
import './shared.css'

export function ModalBaseSlideRightDrift() {
  useEffect(() => {
    // Trigger animation on mount
  }, [])

  return (
    <div
      className="pf-modal-overlay"
      style={
        {
          '--animation-duration': '420ms',
          '--animation-easing': 'cubic-bezier(0.22, 0.61, 0.36, 1)',
          '--overlay-opacity': '0.68',
        } as React.CSSProperties
      }
    >
      <div className="pf-modal pf-modal--slide-right-drift">
        <MockModalContent />
      </div>
    </div>
  )
}
