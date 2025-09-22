import React, { useEffect } from 'react'
import './ModalBaseTvTurnOn.css'
import './shared.css'
import { MockModalContent } from './MockModalContent'

export function ModalBaseTvTurnOn() {
  useEffect(() => {
    // Trigger animation on mount
  }, [])

  return (
    <div
      className="pf-modal-overlay"
      style={
        {
          '--animation-duration': '650ms',
          '--animation-easing': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          '--overlay-opacity': '0.68',
        } as React.CSSProperties
      }
    >
      <div
        className="pf-modal"
        style={{
          animation: 'pf-modal-tv-on 650ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        }}
      >
        <MockModalContent />
      </div>
    </div>
  )
}
