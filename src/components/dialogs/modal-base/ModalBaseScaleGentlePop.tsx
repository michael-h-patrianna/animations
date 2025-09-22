import React, { useEffect } from 'react'
import './ModalBaseScaleGentlePop.css'
import './shared.css'
import { MockModalContent } from './MockModalContent'

export function ModalBaseScaleGentlePop() {
  useEffect(() => {
    // Trigger animation on mount
  }, [])

  return (
    <div
      className="pf-modal-overlay"
      style={
        {
          '--animation-duration': '420ms',
          '--animation-easing': 'cubic-bezier(0.12, 0.75, 0.4, 1)',
          '--overlay-opacity': '0.72',
        } as React.CSSProperties
      }
    >
      <div
        className="pf-modal"
        style={{
          animation: 'pf-modal-scale-gentle-pop 420ms cubic-bezier(0.12, 0.75, 0.4, 1) forwards',
        }}
      >
        <MockModalContent />
      </div>
    </div>
  )
}
