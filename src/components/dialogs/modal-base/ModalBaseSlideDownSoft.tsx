import React, { useEffect } from 'react'
import './ModalBaseSlideDownSoft.css'
import './shared.css'
import { MockModalContent } from './MockModalContent'

export function ModalBaseSlideDownSoft() {
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
          '--overlay-opacity': '0.68',
        } as React.CSSProperties
      }
    >
      <div
        className="pf-modal"
        style={{
          animation: 'pf-modal-slide-down-soft 420ms cubic-bezier(0.12, 0.75, 0.4, 1) forwards',
        }}
      >
        <MockModalContent />
      </div>
    </div>
  )
}
