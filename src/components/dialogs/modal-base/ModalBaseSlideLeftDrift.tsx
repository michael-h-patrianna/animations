import React, { useEffect } from 'react'
import { MockModalContent } from './MockModalContent'
import './ModalBaseSlideLeftDrift.css'
import './shared.css'

export function ModalBaseSlideLeftDrift() {
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
      <div className="pf-modal pf-modal--slide-left-drift">
        <MockModalContent />
      </div>
    </div>
  )
}
