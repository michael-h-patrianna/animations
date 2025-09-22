import React, { useEffect } from 'react'
import { MockModalContent } from './MockModalContent'
import './ModalBaseSlideDownHero.css'
import './shared.css'

export function ModalBaseSlideDownHero() {
  useEffect(() => {
    // Trigger animation on mount
  }, [])

  return (
    <div
      className="pf-modal-overlay"
      style={
        {
          '--animation-duration': '520ms',
          '--animation-easing': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          '--overlay-opacity': '0.72',
        } as React.CSSProperties
      }
    >
      <div className="pf-modal pf-modal--slide-down-hero">
        <MockModalContent />
      </div>
    </div>
  )
}
