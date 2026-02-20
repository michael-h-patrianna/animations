import * as m from 'motion/react-m'
import { useEffect, useState } from 'react'
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
  const [activatedMilestones, setActivatedMilestones] = useState<Set<number>>(new Set())
  const milestonePositions = [0, 0.25, 0.5, 0.75, 1]
  const duration = 4 // seconds

  // Define orbit configuration for each milestone
  const milestoneConfigs: Milestone[] = [
    {
      position: 0,
      rings: [{ radius: 20, particleCount: 2, duration: 3, ringIndex: 0 }],
    },
    {
      position: 0.25,
      rings: [
        { radius: 15, particleCount: 2, duration: 2.5, ringIndex: 0 },
        { radius: 25, particleCount: 2, duration: 3.5, ringIndex: 1 },
      ],
    },
    {
      position: 0.5,
      rings: [
        { radius: 12, particleCount: 2, duration: 2, ringIndex: 0 },
        { radius: 20, particleCount: 3, duration: 3, ringIndex: 1 },
        { radius: 28, particleCount: 2, duration: 4, ringIndex: 2 },
      ],
    },
    {
      position: 0.75,
      rings: [
        { radius: 10, particleCount: 2, duration: 1.8, ringIndex: 0 },
        { radius: 18, particleCount: 3, duration: 2.6, ringIndex: 1 },
        { radius: 26, particleCount: 2, duration: 3.4, ringIndex: 2 },
        { radius: 34, particleCount: 3, duration: 4.2, ringIndex: 3 },
      ],
    },
    {
      position: 1,
      rings: [
        { radius: 8, particleCount: 3, duration: 1.5, ringIndex: 0 },
        { radius: 16, particleCount: 3, duration: 2.3, ringIndex: 1 },
        { radius: 24, particleCount: 3, duration: 3.1, ringIndex: 2 },
        { radius: 32, particleCount: 3, duration: 3.9, ringIndex: 3 },
        { radius: 40, particleCount: 3, duration: 4.7, ringIndex: 4 },
      ],
    },
  ]

  // Track milestone activation
  useEffect(() => {
    const startTime = Date.now()
    const totalDuration = duration * 1000

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime
      const currentProgress = Math.min(elapsed / totalDuration, 1)

      const newActivated = new Set(activatedMilestones)
      milestonePositions.forEach((pos, index) => {
        if (currentProgress >= pos && !newActivated.has(index)) {
          newActivated.add(index)
        }
      })

      setActivatedMilestones(newActivated)

      if (currentProgress >= 1) {
        clearInterval(intervalId)
      }
    }, 16) // ~60fps

    return () => clearInterval(intervalId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fill bar animation
  const fillVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { duration, ease: 'linear' as const },
    },
  }

  // Milestone marker pulse
  const milestoneVariants = {
    inactive: {
      scale: 1,
      opacity: 0.5,
    },
    pulse: {
      scale: [1, 1.3, 1],
      opacity: [0.5, 1, 1],
      transition: {
        scale: {
          duration: 0.3,
          ease: 'easeOut' as const,
        },
      },
    },
    active: {
      scale: 1,
      opacity: 1,
    },
  }

  // Generate particle positions around a circle
  const getParticlePositions = (count: number, radius: number) => {
    const positions = []
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      positions.push({ x, y, angle })
    }
    return positions
  }

  return (
    <div
      className="pf-progress-demo pf-orbit-ring"
      data-animation-id="progress-bars__orbit-ring"
    >
      <div className="track-container">
        <div className="pf-progress-track">
          {/* Main fill bar */}
          <m.div
            className="pf-progress-fill"
            variants={fillVariants}
            initial="hidden"
            animate="visible"
            style={{ transformOrigin: 'left center' }}
          />

          {/* Milestone markers with orbit systems */}
          {milestoneConfigs.map((milestone, milestoneIndex) => {
            const isActive = activatedMilestones.has(milestoneIndex)

            return (
              <div
                key={milestoneIndex}
                className="milestone-container"
                style={{ left: `${milestone.position * 100}%` }}
              >
                {/* Milestone marker */}
                <m.div
                  className={`milestone-marker ${isActive ? 'active' : ''}`}
                  variants={milestoneVariants}
                  initial="inactive"
                  animate={isActive ? 'pulse' : 'inactive'}
                />

                {/* Orbit rings - only show when milestone is active */}
                {isActive && milestone.rings.map((ring, ringIndex) => {
                  const particles = getParticlePositions(ring.particleCount, ring.radius)

                  return (
                    <div
                      key={ringIndex}
                      className="orbit-system"
                    >
                      {/* Rotating container for this orbit ring */}
                      <m.div
                        className="orbit-ring"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: ring.duration,
                          repeat: Infinity,
                          ease: 'linear' as const,
                        }}
                      >
                        {/* Particles positioned around the orbit */}
                        {particles.map((particle, particleIndex) => (
                          <m.div
                            key={particleIndex}
                            className="orbit-particle"
                            style={{
                              transform: `translate(${particle.x}px, ${particle.y}px)`,
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        ))}
                      </m.div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
