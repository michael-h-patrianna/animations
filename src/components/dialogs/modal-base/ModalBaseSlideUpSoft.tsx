import React, { useEffect } from 'react'
import { MockModalContent } from './MockModalContent'
import './ModalBaseSlideUpSoft.css'
import './shared.css'

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
      <div className="pf-modal pf-modal--slide-up-soft">
        <MockModalContent />
      </div>
    </div>
  )
}
