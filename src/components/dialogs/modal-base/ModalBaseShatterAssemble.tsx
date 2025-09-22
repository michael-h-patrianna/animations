import React, { useEffect } from 'react'
import './ModalBaseShatterAssemble.css'
import './shared.css'
import { MockModalContent } from './MockModalContent'

export function ModalBaseShatterAssemble() {
  useEffect(() => {
    // Trigger animation on mount
  }, [])

  return (
    <div
      className="pf-modal-overlay"
      style={
        {
          '--animation-duration': '850ms',
          '--animation-easing': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          '--overlay-opacity': '0.68',
        } as React.CSSProperties
      }
    >
      <div
        className="pf-modal"
        style={{
          animation: 'pf-modal-shatter 850ms cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
        }}
      >
        <MockModalContent />
      </div>
    </div>
  )
}
