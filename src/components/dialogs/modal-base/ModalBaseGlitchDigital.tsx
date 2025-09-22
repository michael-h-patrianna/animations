import React, { useEffect } from 'react'
import './ModalBaseGlitchDigital.css'
import './shared.css'
import { MockModalContent } from './MockModalContent'

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
      <div
        className="pf-modal pf-modal-glitch"
        style={{
          animation: 'pf-modal-glitch 600ms ease-in-out forwards',
        }}
      >
        <MockModalContent />
      </div>
    </div>
  )
}
