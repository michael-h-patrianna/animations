import React, { useEffect } from 'react'
import './ModalBaseSlideUpSoft.css'
import './shared.css'
import { MockModalContent } from './MockModalContent'

export function ModalBaseSlideUpSoft() {
  useEffect(() => {
    // Trigger animation on mount
  }, [])

  return (
    <div
      className="pf-modal-overlay"
      style={
        {
          '--animation-duration': '420ms',
          '--animation-easing': 'cubic-bezier(0.22, 0.61, 0.36, 1)',
          '--overlay-opacity': '0.7',
        } as React.CSSProperties
      }
    >
      <div
        className="pf-modal"
        style={{
          animation: 'pf-modal-slide-up-soft 420ms cubic-bezier(0.22, 0.61, 0.36, 1) forwards',
        }}
      >
        <MockModalContent />
      </div>
    </div>
  )
}
