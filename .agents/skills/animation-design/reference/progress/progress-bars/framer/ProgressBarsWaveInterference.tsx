import * as m from 'motion/react-m'
import { useEffect, useRef } from 'react'
import './ProgressBarsWaveInterference.css'

interface WaveSegment {
  index: number
  position: number // 0-1 position along bar
}

export function ProgressBarsWaveInterference() {
  const nodesContainerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<{ cleanup: () => void }>({ cleanup: () => {} })

  // 25 wave segments distributed along the bar
  const segments: WaveSegment[] = Array.from({ length: 25 }, (_, i) => ({
    index: i,
    position: i / 24 // 0 to 1
  }))

  // Create interference node at milestone
  const createInterferenceNode = (positionPercent: number, delay: number) => {
    setTimeout(() => {
      if (!nodesContainerRef.current) return

      const node = document.createElement('div')
      node.className = 'pb-wi-interference-node'
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

    animationRef.current.cleanup = () => {
      timeouts.forEach(clearTimeout)
      if (nodesContainerRef.current) {
        nodesContainerRef.current.innerHTML = ''
      }
    }

    return () => {
      animationRef.current.cleanup()
    }
  }, [])

  return (
    <div className="progress-bars-wave-interference" data-animation-id="progress-bars__wave-interference">
      <div className="pb-wi-container">
        <div className="pb-wi-track">
          {/* Fill bar */}
          <m.div
            className="pb-wi-fill"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: 3.7,
              ease: [0.42, 0, 0.58, 1]
            }}
            style={{ transformOrigin: 'left center' }}
          />
        </div>

        {/* Wave segments layer */}
        <div className="pb-wi-waves">
          {segments.map((segment) => {
            // Create wave oscillation using keyframes based on segment position
            // Phase offset creates the wave traveling effect
            const phaseOffset = segment.position * 2 * Math.PI
            const createWaveKeyframes = () => {
              const keyframes: number[] = []
              const numKeyframes = 20
              for (let i = 0; i <= numKeyframes; i++) {
                const t = i / numKeyframes
                const time = t * 3.7

                // Amplitude increases with progress
                let amplitude = 8
                if (t >= 0.75) amplitude = 20
                else if (t >= 0.5) amplitude = 16
                else if (t >= 0.25) amplitude = 12

                // Wave displacement using simplified interference pattern
                const leftWave = amplitude * 0.7 * Math.sin(2 * Math.PI * (segment.position * 4 - time / 2.5) + phaseOffset)
                const rightWave = t > 0.25
                  ? amplitude * 0.7 * Math.sin(2 * Math.PI * (segment.position * 4 + (time - 0.925) / 2.5) - phaseOffset)
                  : 0

                keyframes.push(leftWave + rightWave)
              }
              return keyframes
            }

            return (
              <m.div
                key={segment.index}
                className="pb-wi-segment"
                style={{
                  left: `${segment.position * 100}%`,
                }}
                animate={{
                  y: createWaveKeyframes()
                }}
                transition={{
                  duration: 3.7,
                  ease: 'linear' as const,
                  repeat: 0
                }}
              />
            )
          })}
        </div>

        {/* Interference nodes container */}
        <div ref={nodesContainerRef} className="pb-wi-nodes" />
      </div>
    </div>
  )
}
