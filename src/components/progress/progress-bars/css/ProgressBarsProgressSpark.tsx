import { useEffect, useRef } from 'react'
import type { AnimationMetadata } from '@/types/animation'
import './ProgressBarsProgressSpark.css'

export const metadata: AnimationMetadata = {
  id: 'progress-bars__progress-spark',
  title: 'Progress Spark',
  description: 'Progress bar with spark trail and particle effects.',
  tags: ['css'],
}

export function ProgressBarsProgressSpark() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const track = container.querySelector('.pf-progress-track') as HTMLElement
    if (!track) return

    // Clean up any existing animation elements
    const existingElements = container.querySelectorAll('.animation-element')
    existingElements.forEach((el) => el.remove())

    // Create fill bar
    const fill = document.createElement('div')
    fill.className = 'animation-element pf-progress-fill'
    track.appendChild(fill)

    // Create trail gradient overlay
    const trailGradient = document.createElement('div')
    trailGradient.className = 'animation-element spark-trail-gradient'
    fill.appendChild(trailGradient)

    // Create spark leader container
    const sparkLeader = document.createElement('div')
    sparkLeader.className = 'animation-element spark-leader'
    fill.appendChild(sparkLeader)

    // Create spark core
    const sparkCore = document.createElement('div')
    sparkCore.className = 'animation-element spark-core'
    sparkLeader.appendChild(sparkCore)

    // Create spark halo
    const sparkHalo = document.createElement('div')
    sparkHalo.className = 'animation-element spark-halo'
    sparkLeader.appendChild(sparkHalo)

    // Create trailing particles container
    const particlesContainer = document.createElement('div')
    particlesContainer.className = 'animation-element trailing-particles'
    fill.appendChild(particlesContainer)

    // Generate 50 particles with staggered delays
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div')
      particle.className = 'animation-element spark-particle'
      particle.style.setProperty('--particle-delay', `${i * 50}ms`)
      particle.style.setProperty('--particle-left', `${(i / 50) * 100}%`)
      particlesContainer.appendChild(particle)
    }

    // Create final burst container
    const finalBurst = document.createElement('div')
    finalBurst.className = 'animation-element spark-final-burst'
    fill.appendChild(finalBurst)

    // Create 6 burst dots
    for (let i = 0; i < 6; i++) {
      const dot = document.createElement('div')
      dot.className = `animation-element spark-burst-dot dot-${i}`
      finalBurst.appendChild(dot)
    }

    // Cleanup function
    return () => {
      const elements = container.querySelectorAll('.animation-element')
      elements.forEach((el) => el.remove())
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="pf-progress-demo pf-progress-spark"
      data-animation-id="progress-bars__progress-spark"
    >
      <span className="pf-progress-demo__label">Spark Trail Progress</span>
      <div className="track-container track-container--spark">
        <div className="pf-progress-track"></div>
      </div>
    </div>
  )
}
