import React, { useEffect } from 'react'
import { MockModalContent } from './MockModalContent'
import './ModalBaseGlitchDigital.css'
import './shared.css'

export function ModalBaseGlitchDigital() {
  useEffect(() => {
    // Trigger animation on mount
  }, [])

  return (
    <div
      className="pf-modal-overlay"
      style={
        {
          '--animation-duration': '600ms',
          '--animation-easing': 'ease-in-out',
          '--overlay-opacity': '0.68',
        } as React.CSSProperties
      }
    >
      <div className="pf-modal pf-modal--glitch">
        <MockModalContent />
      </div>
    </div>
  )
}
