import React, { useEffect } from 'react'
import { MockModalContent } from './MockModalContent'
import './ModalBasePortalSwirl.css'
import './shared.css'

export function ModalBasePortalSwirl() {
  useEffect(() => {
    // Trigger animation on mount
  }, [])

  return (
    <div
      className="pf-modal-overlay"
      style={
        {
          '--animation-duration': '800ms',
          '--animation-easing': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          '--overlay-opacity': '0.68',
        } as React.CSSProperties
      }
    >
      <div className="pf-modal pf-modal--portal-swirl">
        <MockModalContent />
      </div>
    </div>
  )
}
