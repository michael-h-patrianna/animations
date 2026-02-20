import { memo } from 'react'
import '../shared.css'
import './StandardEffectsTada.css'

function StandardEffectsTadaComponent() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element tada-element">
        <div className="demo-text">Tada</div>
      </div>
    </div>
  )
}

/**
 * Memoized StandardEffectsTada to prevent unnecessary re-renders in grid layouts.
 */
export const StandardEffectsTada = memo(StandardEffectsTadaComponent)

