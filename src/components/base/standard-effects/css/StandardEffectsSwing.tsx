import { memo } from 'react'
import '../shared.css'
import './StandardEffectsSwing.css'

function StandardEffectsSwingComponent() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element swing-element">
        <div className="demo-text">Swing</div>
      </div>
    </div>
  )
}

/**
 * Memoized StandardEffectsSwing to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsSwing = memo(StandardEffectsSwingComponent)

