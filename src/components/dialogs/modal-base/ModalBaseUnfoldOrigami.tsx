import React, { useEffect } from 'react'
import { MockModalContent } from './MockModalContent'
import './ModalBaseUnfoldOrigami.css'
import './shared.css'

export function ModalBaseUnfoldOrigami() {
  useEffect(() => {
    // Trigger animation on mount
  }, [])

  return (
    <div
      className="pf-modal-overlay pf-modal-overlay--unfold"
      style={
        {
          '--animation-duration': '900ms',
          '--animation-easing': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          '--overlay-opacity': '0.68',
        } as React.CSSProperties
      }
    >
      <div className="pf-modal pf-modal--unfold">
        <MockModalContent />
      </div>
    </div>
  )
}
