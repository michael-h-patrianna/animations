import * as m from 'motion/react-m'
import { useEffect, useState } from 'react'
import './ProgressBarsSciFiLoader.css'

export const metadata = {
  id: 'progress-bars__sci-fi-loader',
  title: 'Sci-Fi Loader',
  description: 'Futuristic, angled progress bar with data accents',
  tags: ['scifi', 'future', 'tech', 'loading'],
}

export function ProgressBarsSciFiLoader() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => (p >= 100 ? 0 : p + 1))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="scifi-loader-container" data-animation-id="progress-bars__sci-fi-loader">
      <div className="scifi-loader-track">
        <m.div 
          className="scifi-loader-fill"
          animate={{ width: `${progress}%` }}
          transition={{ type: 'tween', ease: 'linear', duration: 0.05 }}
        />
        {/* Glint effect moving across */}
        <m.div 
          className="scifi-loader-glint"
          animate={{ left: ['-20%', '120%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <div className="scifi-loader-decor-top" />
      <div className="scifi-loader-decor-bottom" />
      <div className="scifi-loader-text">SYSTEM.INIT: {progress}%</div>
    </div>
  )
}
