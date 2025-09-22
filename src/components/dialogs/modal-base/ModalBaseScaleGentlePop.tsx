import React, { useEffect } from 'react'
import { MockModalContent } from './MockModalContent'
import './ModalBaseScaleGentlePop.css'
import './shared.css'

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
      <div className="pf-modal pf-modal--scale-gentle-pop">
        <MockModalContent />
      </div>
    </div>
  )
}
