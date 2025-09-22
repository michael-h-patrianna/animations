import React, { useEffect } from 'react'
import { MockModalContent } from './MockModalContent'
import './ModalBaseSlideDownSoft.css'
import './shared.css'

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
      <div className="pf-modal pf-modal--slide-down-soft">
        <MockModalContent />
      </div>
    </div>
  )
}
