import { memo } from 'react'
import '../shared.css'
import './StandardEffectsFade.css'

function StandardEffectsFadeComponent() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element fade-element">
        <div className="demo-text">Fade</div>
      </div>
    </div>
  )
}

/**
 * Memoized StandardEffectsFade to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsFade = memo(StandardEffectsFadeComponent)

