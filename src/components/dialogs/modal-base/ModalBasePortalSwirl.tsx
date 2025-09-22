import React, { useEffect } from 'react'
import './ModalBasePortalSwirl.css'
import './shared.css'
import { MockModalContent } from './MockModalContent'

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
      <div
        className="pf-modal"
        style={{
          animation: 'pf-modal-portal-swirl 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        }}
      >
        <MockModalContent />
      </div>
    </div>
  )
}
