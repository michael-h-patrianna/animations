import React, { useEffect } from 'react'
import { MockModalContent } from './MockModalContent'
import './ModalBaseRippleExpand.css'
import './shared.css'

export function ModalBaseRippleExpand() {
  useEffect(() => {
    // Trigger animation on mount
  }, [])

  return (
    <div
      className="pf-modal-overlay"
      style={
        {
          '--animation-duration': '550ms',
          '--animation-easing': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          '--overlay-opacity': '0.68',
        } as React.CSSProperties
      }
    >
      <div className="pf-modal pf-modal--ripple">
        <MockModalContent />
      </div>
    </div>
  )
}
