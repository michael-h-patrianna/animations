import React, { useEffect } from 'react'
import { MockModalContent } from './MockModalContent'
import './ModalBaseShatterAssemble.css'
import './shared.css'

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
      <div className="pf-modal pf-modal--shatter">
        <MockModalContent />
      </div>
    </div>
  )
}
