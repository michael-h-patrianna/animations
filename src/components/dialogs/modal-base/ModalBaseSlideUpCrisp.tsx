import React, { useEffect } from 'react'
import { MockModalContent } from './MockModalContent'
import './ModalBaseSlideUpCrisp.css'
import './shared.css'

export function ModalBaseSlideUpCrisp() {
  useEffect(() => {
    // Trigger animation on mount
  }, [])

  return (
    <div
      className="pf-modal-overlay"
      style={
        {
          '--animation-duration': '320ms',
          '--animation-easing': 'cubic-bezier(0.16, 1, 0.3, 1)',
          '--overlay-opacity': '0.62',
        } as React.CSSProperties
      }
    >
      <div className="pf-modal pf-modal--slide-up-crisp">
        <MockModalContent />
      </div>
    </div>
  )
}
