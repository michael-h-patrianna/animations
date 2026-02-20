import * as m from 'motion/react-m'
import { useEffect, useState } from 'react'
import './ProgressBarsRetroBit.css'

export const metadata = {
  id: 'progress-bars__retro-bit',
  title: 'Retro Bit',
  description: '8-bit style segmented progress bar',
  tags: ['retro', 'pixel', 'game', 'segmented'],
}

export function ProgressBarsRetroBit() {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    // Simulate loading
    const interval = setInterval(() => {
      setProgress(p => (p >= 100 ? 0 : p + 10))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const segments = Array.from({ length: 10 })

  return (
    <div className="retro-bit-container" data-animation-id="progress-bars__retro-bit">
      <div className="retro-bit-frame">
        {segments.map((_, i) => (
          <m.div
            key={i}
            className="retro-bit-segment"
            initial={{ opacity: 0.1 }}
            animate={{ 
              opacity: (i + 1) * 10 <= progress ? 1 : 0.1,
              backgroundColor: (i + 1) * 10 <= progress ? '#4ade80' : '#14532d' 
            }}
            transition={{ duration: 0 }}
          />
        ))}
      </div>
      <div className="retro-bit-label">LOADING...</div>
    </div>
  )
}
