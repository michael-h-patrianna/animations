import React, { useEffect } from 'react'
import './ModalBaseScaleCrisp.css'
import './shared.css'
import { MockModalContent } from './MockModalContent'

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
      <div
        className="pf-modal"
        style={{
          animation: 'pf-modal-scale-crisp 240ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        <MockModalContent />
      </div>
    </div>
  )
}
