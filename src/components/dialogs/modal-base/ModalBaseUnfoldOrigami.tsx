import React, { useEffect } from 'react'
import './ModalBaseUnfoldOrigami.css'
import './shared.css'
import { MockModalContent } from './MockModalContent'

export function ModalBaseUnfoldOrigami() {
  useEffect(() => {
    // Trigger animation on mount
  }, [])

  return (
    <div
      className="pf-modal-overlay"
      style={
        {
          '--animation-duration': '900ms',
          '--animation-easing': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          '--overlay-opacity': '0.68',
          perspective: '1000px',
        } as React.CSSProperties
      }
    >
      <div
        className="pf-modal pf-modal--unfold"
        style={{
          animation: 'pf-modal-unfold 900ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
          transformStyle: 'preserve-3d',
        }}
      >
        <MockModalContent />
      </div>
    </div>
  )
}
