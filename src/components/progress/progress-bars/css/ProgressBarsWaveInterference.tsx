import './ProgressBarsWaveInterference.css'
import { useEffect, useRef } from 'react'

/**
 *
 */
export function ProgressBarsWaveInterference() {
  const nodesContainerRef = useRef<HTMLDivElement>(null)

  // 25 wave segments distributed along the bar
  const segments = Array.from({ length: 25 }, (_, i) => ({
    index: i,
    position: i / 24 // 0 to 1
  }))

  // Create interference node at milestone
  const createInterferenceNode = (positionPercent: number, delay: number) => {
    setTimeout(() => {
      if (!nodesContainerRef.current) return

      const node = document.createElement('div')
      node.className = 'pb-wi-interference-node-css'
      node.style.left = `${positionPercent * 100}%`

      nodesContainerRef.current.appendChild(node)

      // Remove after animation (800ms)
      setTimeout(() => {
        if (nodesContainerRef.current?.contains(node)) {
          nodesContainerRef.current.removeChild(node)
        }
      }, 800)
    }, delay)
  }

  useEffect(() => {
    // Schedule interference nodes at milestones
    const nodeTimes = [
      { position: 0, delay: 0 },
      { position: 0.25, delay: 925 },
      { position: 0.5, delay: 1850 },
      { position: 0.75, delay: 2775 },
      { position: 1.0, delay: 3700 },
    ]

    const timeouts: NodeJS.Timeout[] = []
    nodeTimes.forEach(({ position, delay }) => {
      const timeout = setTimeout(() => createInterferenceNode(position, 0), delay)
      timeouts.push(timeout)
    })

    return () => {
      // Cleanup all timeouts
      timeouts.forEach(clearTimeout)
      // Clear any remaining nodes
      if (nodesContainerRef.current) {
        nodesContainerRef.current.innerHTML = ''
      }
    }
  }, [])

  return (
    <div className="progress-bars-wave-interference-css" data-animation-id="progress-bars__wave-interference">
      <div className="pb-wi-container-css">
        <div className="pb-wi-track-css">
          {/* Fill bar */}
          <div className="pb-wi-fill-css" />
        </div>

        {/* Wave segments layer - left wave */}
        <div className="pb-wi-waves-css">
          {segments.map((segment, i) => (
            <div
              key={`left-${i}`}
              className="pb-wi-segment-css pb-wi-segment-left"
              style={{
                left: `${segment.position * 100}%`,
                animationDelay: `${-segment.position * 2.5}s` // Phase offset for left-traveling wave
              }}
              data-phase="1"
            />
          ))}
        </div>

        {/* Wave segments layer - right wave (appears at 25% progress) */}
        <div className="pb-wi-waves-css pb-wi-waves-right">
          {segments.map((segment, i) => (
            <div
              key={`right-${i}`}
              className="pb-wi-segment-css pb-wi-segment-right"
              style={{
                left: `${segment.position * 100}%`,
                animationDelay: `${segment.position * 2.5 + 0.925}s` // Phase offset for right-traveling wave + 25% delay
              }}
              data-phase="2"
            />
          ))}
        </div>

        {/* Interference nodes container */}
        <div ref={nodesContainerRef} className="pb-wi-nodes-css" />
      </div>
    </div>
  )
}
