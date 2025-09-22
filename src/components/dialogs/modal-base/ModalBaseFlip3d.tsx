import React, { useEffect } from 'react'
import { MockModalContent } from './MockModalContent'
import './ModalBaseFlip3d.css'
import './shared.css'

export function ModalBaseFlip3d() {
  useEffect(() => {
    // Trigger animation on mount
  }, [])

  return (
    <div
      className="pf-modal-overlay pf-modal-overlay--flip-3d"
      style={
        {
          '--animation-duration': '800ms',
          '--animation-easing': 'cubic-bezier(0.175, 0.885, 0.32, 1)',
          '--overlay-opacity': '0.76',
        } as React.CSSProperties
      }
    >
      <div className="pf-modal pf-modal--flip-3d">
        <MockModalContent />
      </div>
    </div>
  )
}
