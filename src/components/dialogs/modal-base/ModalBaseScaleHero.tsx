import React, { useEffect } from 'react'
import { MockModalContent } from './MockModalContent'
import './ModalBaseScaleHero.css'
import './shared.css'

export function ModalBaseScaleHero() {
  useEffect(() => {
    // Trigger animation on mount
  }, [])

  return (
    <div
      className="pf-modal-overlay"
      style={
        {
          '--animation-duration': '520ms',
          '--animation-easing': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          '--overlay-opacity': '0.76',
        } as React.CSSProperties
      }
    >
      <div className="pf-modal pf-modal--scale-hero">
        <MockModalContent />
      </div>
    </div>
  )
}
