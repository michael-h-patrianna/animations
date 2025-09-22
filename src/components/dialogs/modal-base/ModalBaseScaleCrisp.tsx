import React, { useEffect } from 'react'
import { MockModalContent } from './MockModalContent'
import './ModalBaseScaleCrisp.css'
import './shared.css'

export function ModalBaseScaleCrisp() {
  useEffect(() => {
    // Trigger animation on mount
  }, [])

  return (
    <div
      className="pf-modal-overlay"
      style={
        {
          '--animation-duration': '240ms',
          '--animation-easing': 'cubic-bezier(0.16, 1, 0.3, 1)',
          '--overlay-opacity': '0.64',
        } as React.CSSProperties
      }
    >
      <div className="pf-modal pf-modal--scale-crisp">
        <MockModalContent />
      </div>
    </div>
  )
}
