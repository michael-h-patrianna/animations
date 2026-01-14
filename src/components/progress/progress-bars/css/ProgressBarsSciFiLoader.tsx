import { useEffect, useState } from 'react'
import './ProgressBarsSciFiLoader.css'

export function ProgressBarsSciFiLoader() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => (p >= 100 ? 0 : p + 1))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="scifi-loader-container-css" data-animation-id="progress-bars__sci-fi-loader">
      <div className="scifi-loader-track-css">
        <div 
          className="scifi-loader-fill-css"
          style={{ width: `${progress}%` }}
        />
        <div className="scifi-loader-glint-css" />
      </div>
      <div className="scifi-loader-decor-top-css" />
      <div className="scifi-loader-decor-bottom-css" />
      <div className="scifi-loader-text-css">SYSTEM.INIT: {progress}%</div>
    </div>
  )
}
