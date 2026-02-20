import { useEffect, useState } from 'react'
import './ProgressBarsRetroBit.css'

export function ProgressBarsRetroBit() {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => (p >= 100 ? 0 : p + 10))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const segments = Array.from({ length: 10 })

  return (
    <div className="retro-bit-container-css" data-animation-id="progress-bars__retro-bit">
      <div className="retro-bit-frame-css">
        {segments.map((_, i) => (
          <div
            key={i}
            className="retro-bit-segment-css"
            style={{ 
              opacity: (i + 1) * 10 <= progress ? 1 : 0.1,
              backgroundColor: (i + 1) * 10 <= progress ? '#4ade80' : '#14532d' 
            }}
          />
        ))}
      </div>
      <div className="retro-bit-label-css">LOADING...</div>
    </div>
  )
}
