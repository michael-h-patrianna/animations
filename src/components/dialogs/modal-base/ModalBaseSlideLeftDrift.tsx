import React, { useEffect } from 'react'
import './ModalBaseSlideLeftDrift.css'
import './shared.css'
import { MockModalContent } from './MockModalContent'

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
      <div
        className="pf-modal"
        style={{
          animation: 'pf-modal-slide-left-drift 420ms cubic-bezier(0.22, 0.61, 0.36, 1) forwards',
        }}
      >
        <MockModalContent />
      </div>
    </div>
  )
}
