import { useEffect, useRef } from 'react'
import './ProgressBarsOrbitRing.css'

interface OrbitRing {
  radius: number
  particleCount: number
  duration: number
  ringIndex: number
}

interface Milestone {
  position: number
  rings: OrbitRing[]
}

export function ProgressBarsOrbitRing() {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationsRef = useRef<Animation[]>([])

  const duration = 4000 // milliseconds

  // Define orbit configuration for each milestone
  const milestoneConfigs: Milestone[] = [
    {
      position: 0,
      rings: [{ radius: 20, particleCount: 2, duration: 3000, ringIndex: 0 }],
    },
    {
      position: 0.25,
      rings: [
        { radius: 15, particleCount: 2, duration: 2500, ringIndex: 0 },
        { radius: 25, particleCount: 2, duration: 3500, ringIndex: 1 },
      ],
    },
    {
      position: 0.5,
      rings: [
        { radius: 12, particleCount: 2, duration: 2000, ringIndex: 0 },
        { radius: 20, particleCount: 3, duration: 3000, ringIndex: 1 },
        { radius: 28, particleCount: 2, duration: 4000, ringIndex: 2 },
      ],
    },
    {
      position: 0.75,
      rings: [
        { radius: 10, particleCount: 2, duration: 1800, ringIndex: 0 },
        { radius: 18, particleCount: 3, duration: 2600, ringIndex: 1 },
        { radius: 26, particleCount: 2, duration: 3400, ringIndex: 2 },
        { radius: 34, particleCount: 3, duration: 4200, ringIndex: 3 },
      ],
    },
    {
      position: 1,
      rings: [
        { radius: 8, particleCount: 3, duration: 1500, ringIndex: 0 },
        { radius: 16, particleCount: 3, duration: 2300, ringIndex: 1 },
        { radius: 24, particleCount: 3, duration: 3100, ringIndex: 2 },
        { radius: 32, particleCount: 3, duration: 3900, ringIndex: 3 },
        { radius: 40, particleCount: 3, duration: 4700, ringIndex: 4 },
      ],
    },
  ]

  // Generate particle positions around a circle
  const getParticlePositions = (count: number, radius: number) => {
    const positions = []
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      positions.push({ x, y })
    }
    return positions
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const track = container.querySelector('.pf-progress-track') as HTMLElement
    const fill = container.querySelector('.pf-progress-fill') as HTMLElement
    if (!track || !fill) return

    // Clean up any existing animations and elements
    animationsRef.current.forEach((anim) => anim.cancel())
    animationsRef.current = []
    const existingElements = container.querySelectorAll('.animation-element')
    existingElements.forEach((el) => el.remove())

    // Reset fill
    fill.style.transform = 'scaleX(0)'
    fill.style.transformOrigin = 'left center'

    // Create milestone containers with orbit systems
    const milestoneElements: Array<{
      container: HTMLElement
      marker: HTMLElement
      position: number
      index: number
      rings: OrbitRing[]
    }> = []

    milestoneConfigs.forEach((config, index) => {
      const milestoneContainer = document.createElement('div')
      milestoneContainer.className = 'animation-element milestone-container'
      milestoneContainer.style.left = `${config.position * 100}%`
      track.appendChild(milestoneContainer)

      // Create milestone marker
      const marker = document.createElement('div')
      marker.className = 'milestone-marker'
      milestoneContainer.appendChild(marker)

      milestoneElements.push({
        container: milestoneContainer,
        marker,
        position: config.position,
        index,
        rings: config.rings,
      })
    })

    // Main fill animation
    const fillAnim = fill.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
      duration,
      fill: 'forwards',
      easing: 'linear',
    })
    animationsRef.current.push(fillAnim)

    // Track animation progress and activate milestones with orbit systems
    const activatedMilestones = new Set<number>()
    const checkMilestones = () => {
      const current = (typeof fillAnim.currentTime === 'number' ? fillAnim.currentTime : 0) ?? 0
      const progress = current / duration

      milestoneElements.forEach(({ container, marker, position, index, rings }) => {
        if (progress >= position && !activatedMilestones.has(index)) {
          activatedMilestones.add(index)

          // Add active class to marker
          marker.classList.add('active')

          // Pulse animation for marker
          const pulseAnim = marker.animate(
            [
              { transform: 'translate(-50%, -50%) scale(1)', opacity: '0.5' },
              { transform: 'translate(-50%, -50%) scale(1.3)', opacity: '1' },
              { transform: 'translate(-50%, -50%) scale(1)', opacity: '1' },
            ],
            { duration: 300, fill: 'forwards', easing: 'ease-out' }
          )
          animationsRef.current.push(pulseAnim)

          // Create orbit systems for this milestone
          rings.forEach((ring) => {
            const orbitSystem = document.createElement('div')
            orbitSystem.className = 'animation-element orbit-system'
            container.appendChild(orbitSystem)

            // Create rotating orbit ring container
            const orbitRing = document.createElement('div')
            orbitRing.className = 'orbit-ring'
            orbitSystem.appendChild(orbitRing)

            // Create particles positioned around the orbit
            const particles = getParticlePositions(ring.particleCount, ring.radius)
            particles.forEach((particle) => {
              const particleEl = document.createElement('div')
              particleEl.className = 'orbit-particle'
              particleEl.style.transform = `translate(${particle.x}px, ${particle.y}px)`
              orbitRing.appendChild(particleEl)

              // Fade in particle
              const fadeInAnim = particleEl.animate(
                [{ opacity: '0' }, { opacity: '1' }],
                { duration: 300, fill: 'forwards' }
              )
              animationsRef.current.push(fadeInAnim)
            })

            // Rotate the orbit ring continuously
            const rotateAnim = orbitRing.animate(
              [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
              {
                duration: ring.duration,
                iterations: Infinity,
                easing: 'linear',
              }
            )
            animationsRef.current.push(rotateAnim)
          })
        }
      })

      if (fillAnim.playState === 'running') {
        requestAnimationFrame(checkMilestones)
      }
    }
    requestAnimationFrame(checkMilestones)

    // Cleanup function
    return () => {
      animationsRef.current.forEach((anim) => anim.cancel())
      animationsRef.current = []
      const elements = container.querySelectorAll('.animation-element')
      elements.forEach((el) => el.remove())
      activatedMilestones.clear()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="pf-progress-demo pf-orbit-ring"
      data-animation-id="progress-bars__orbit-ring"
    >
      <div className="track-container">
        <div className="pf-progress-track">
          <div className="pf-progress-fill"></div>
        </div>
      </div>
    </div>
  )
}
