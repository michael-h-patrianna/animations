import { animate, type AnimationPlaybackControls } from 'motion/react'
import * as m from 'motion/react-m'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface Particle {
  id: number
  milestoneIndex: number
  angle: number
}

interface MilestoneAnimation {
  id: number
  index: number
}

/**
 *
 */
export function ProgressBarsCelebrationBurst() {
  const [activatedMilestones, setActivatedMilestones] = useState<Set<number>>(new Set())
  const [particles, setParticles] = useState<Particle[]>([])
  const [milestoneAnimations, setMilestoneAnimations] = useState<MilestoneAnimation[]>([])
  const [progressDisplay, setProgressDisplay] = useState(0)

  const milestonePositions = useMemo(() => [0, 0.25, 0.5, 0.75, 1], [])

  const particleIdRef = useRef(0)
  const milestoneIdRef = useRef(0)
  const reachedMilestonesRef = useRef<Set<number>>(new Set())
  const lastProgressRef = useRef(0)
  const timeoutHandlesRef = useRef<Array<ReturnType<typeof setTimeout>>>([])
  const animationControlsRef = useRef<AnimationPlaybackControls[]>([])

  const registerTimeout = useCallback((callback: () => void, delay: number) => {
    const handle = setTimeout(() => {
      timeoutHandlesRef.current = timeoutHandlesRef.current.filter((h) => h !== handle)
      callback()
    }, delay)
    timeoutHandlesRef.current.push(handle)
    return handle
  }, [])

  const registerAnimation = useCallback((control: AnimationPlaybackControls) => {
    animationControlsRef.current.push(control)
    return control
  }, [])

  const clearScheduledWork = useCallback(() => {
    timeoutHandlesRef.current.forEach(clearTimeout)
    timeoutHandlesRef.current = []
    animationControlsRef.current.forEach((control) => control.stop?.())
    animationControlsRef.current = []
  }, [])

  const triggerMilestone = useCallback(
    (index: number) => {
      const milestoneId = milestoneIdRef.current++
      setMilestoneAnimations((prev) => [...prev, { id: milestoneId, index }])

      // Create particles for this milestone
      const newParticles: Particle[] = [0, 90, 180, 270].map((angle) => ({
        id: particleIdRef.current++,
        milestoneIndex: index,
        angle,
      }))

      setParticles((prev) => [...prev, ...newParticles])

      // Remove particles after animation completes
      registerTimeout(() => {
        setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)))
      }, 500)

      // Remove milestone animation marker
      registerTimeout(() => {
        setMilestoneAnimations((prev) => prev.filter((m) => m.id !== milestoneId))
      }, 500)
    },
    [registerTimeout]
  )

  const updateProgress = useCallback(
    (latest: number) => {
      const previous = lastProgressRef.current
      setProgressDisplay(latest)

      if (latest < previous - 1) {
        // Progress reset
        reachedMilestonesRef.current.clear()
        setMilestoneAnimations([])
        setActivatedMilestones(new Set())
      } else {
        // Check each milestone for crossing
        milestonePositions.forEach((pos, index) => {
          const progressPercent = latest
          const milestonePercent = pos * 100

          if (
            !reachedMilestonesRef.current.has(index) &&
            previous < milestonePercent &&
            progressPercent >= milestonePercent
          ) {
            reachedMilestonesRef.current.add(index)
            setActivatedMilestones((prev) => new Set(prev).add(index))
            triggerMilestone(index)
          }
        })
      }

      lastProgressRef.current = latest
    },
    [milestonePositions, triggerMilestone]
  )

  useEffect(() => {
    let stopped = false

    const resetAnimation = () => {
      clearScheduledWork()
      reachedMilestonesRef.current.clear()
      particleIdRef.current = 0
      milestoneIdRef.current = 0
      lastProgressRef.current = 0

      setParticles([])
      setMilestoneAnimations([])
      setActivatedMilestones(new Set())
      setProgressDisplay(0)
    }

    const startAnimation = () => {
      if (stopped) return

      resetAnimation()

      // Animate from 0 to 100% over 4 seconds
      const control = animate(0, 100, {
        duration: 4,
        ease: [0.4, 0.0, 0.2, 1],
        onUpdate: (latest) => {
          if (!stopped) {
            updateProgress(latest)
          }
        },
        onComplete: () => {
          if (!stopped) {
            // Reset and restart after delay
            registerTimeout(startAnimation, 2000)
          }
        },
      })

      registerAnimation(control)
    }

    startAnimation()

    return () => {
      stopped = true
      clearScheduledWork()
    }
  }, [clearScheduledWork, registerAnimation, registerTimeout, updateProgress])

  const fillVariants = {
    initial: { scaleX: 0 },
    animate: {
      scaleX: progressDisplay / 100,
      transition: { duration: 0.01, ease: 'linear' as const },
    },
  }

  const markerVariants = (isActive: boolean) => ({
    scale: isActive ? 1 : 0.6,
    opacity: isActive ? 1 : 0.6,
    backgroundColor: isActive ? 'var(--pf-anim-purple)' : 'var(--pf-anim-purple-dark)',
    transition: {
      duration: 0.25,
      ease: 'easeOut' as const,
    },
  })

  const burstRingVariants = (delay: number) => ({
    inactive: { scale: 0.8, opacity: 0 },
    active: {
      scale: 2.0,
      opacity: [0.6, 0],
      transition: {
        duration: 0.3,
        delay,
        ease: [0.2, 0.8, 0.2, 1] as const,
      },
    },
  })

  const particleVariants = (angle: number) => {
    const radians = (angle * Math.PI) / 180
    const distance = 30
    const x = Math.cos(radians) * distance
    const y = Math.sin(radians) * distance

    return {
      initial: {
        scale: 0.5,
        opacity: 0,
        x: 0,
        y: 0,
      },
      animate: {
        scale: [0.5, 1, 0],
        opacity: [0, 1, 0],
        x,
        y,
        transition: {
          duration: 0.4,
          times: [0, 0.3, 1],
          ease: 'easeOut' as const,
        },
      },
    }
  }

  return (
    <div
      className="pf-progress-demo pf-celebration-burst"
      data-animation-id="progress-bars__celebration-burst"
    >
      <div className="track-container" style={{ position: 'relative' }}>
        <div className="pf-progress-track">
          <m.div
            className="pf-progress-fill"
            variants={fillVariants}
            initial="initial"
            animate="animate"
            style={{ transformOrigin: 'left center' }}
          />
        </div>

        {/* Milestone markers */}
        {milestonePositions.map((pos, i) => {
          const isActive = activatedMilestones.has(i)
          const hasAnimation = milestoneAnimations.some((m) => m.index === i)

          return (
            <div
              key={i}
              className="milestone-container"
              style={{
                position: 'absolute',
                left: `${pos * 100}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '24px',
                height: '24px',
              }}
            >
              {/* Main marker */}
              <m.div
                className="milestone-marker"
                animate={markerVariants(isActive)}
                style={{
                  position: 'absolute',
                  inset: 0,
                  border: '2px solid rgb(168 85 247 / 0.8)',
                  borderRadius: '50%',
                }}
              />

              {/* Burst rings */}
              {hasAnimation && (
                <>
                  <m.div
                    className="burst-ring"
                    variants={burstRingVariants(0.04)}
                    initial="inactive"
                    animate="active"
                    style={{
                      position: 'absolute',
                      inset: '-4px',
                      border: '2px solid rgb(168 85 247 / 0.8)',
                      borderRadius: '50%',
                      pointerEvents: 'none',
                    }}
                  />
                  <m.div
                    className="burst-ring"
                    variants={burstRingVariants(0.08)}
                    initial="inactive"
                    animate="active"
                    style={{
                      position: 'absolute',
                      inset: '-4px',
                      border: '2px solid rgb(168 85 247 / 0.6)',
                      borderRadius: '50%',
                      pointerEvents: 'none',
                    }}
                  />
                </>
              )}

              {/* Particles */}
              {particles
                .filter((p) => p.milestoneIndex === i)
                .map((particle) => (
                  <m.div
                    key={particle.id}
                    className="particle"
                    variants={particleVariants(particle.angle)}
                    initial="initial"
                    animate="animate"
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: '6px',
                      height: '6px',
                      marginLeft: '-3px',
                      marginTop: '-3px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--pf-anim-purple)',
                      pointerEvents: 'none',
                    }}
                  />
                ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
