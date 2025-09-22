import React, { useEffect } from 'react'
import { MockModalContent } from './MockModalContent'
import './ModalBaseZoomElastic.css'
import './shared.css'

export function ModalBaseZoomElastic() {
  useEffect(() => {
    // Trigger animation on mount
  }, [])

  return (
    <div
      className="pf-modal-overlay"
      style={
        {
          '--animation-duration': '720ms',
          '--animation-easing': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          '--overlay-opacity': '0.68',
        } as React.CSSProperties
      }
    >
      <div className="pf-modal pf-modal--zoom-elastic">
        <MockModalContent />
      </div>
    </div>
  )
}
