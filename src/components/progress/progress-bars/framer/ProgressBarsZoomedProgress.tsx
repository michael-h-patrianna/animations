import type { AnimationMetadata } from '@/types/animation'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import './ProgressBarsZoomedProgress.css'

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'progress-bars__zoomed-progress',
  title: 'Zoomed Progress',
  description:
    'Multi-level progress bar with zoomed viewport that shifts and scales as levels advance. Features numbered milestones, color transitions per level (blue to yellow to pink), radial gradient masking for zoom effect, and skewed progress fill animation.',
  tags: ['framer'],
}

export function ProgressBarsZoomedProgress() {
const [level, setLevel] = useState(1)
  const [levelPoints, setLevelPoints] = useState([0, 0, 0])
  const [levelReached, setLevelReached] = useState([true, false, false])
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const levelBounceVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1.3, 1.5, 1.3],
      transition: {
        duration: 0.7,
        ease: [0.68, -0.55, 0.265, 1.55] as const,
        times: [0, 0.5, 1],
      },
    },
  }

  useEffect(() => {
    let currentLevel = 1
    let currentLevelPoints = [0, 0, 0]

    const update = () => {
      // Calculate random points (1 to level-1, minimum 1)
      const rndPoints = Math.round(Math.random() * Math.max(currentLevel - 1, 0)) + 1

      if (currentLevel === 3) {
        // Reset after level 3
        setTimeout(() => {
          currentLevel = 1
          currentLevelPoints = [0, 0, 0]
          setLevel(1)
          setLevelPoints([0, 0, 0])
          setLevelReached([true, false, false])
        }, 2000)
        return
      } else {
        // Add points to current level
        currentLevelPoints[currentLevel - 1] = Math.min(
          currentLevelPoints[currentLevel - 1] + rndPoints,
          currentLevel * 3
        )
      }

      // Check if level is complete (levelPoints >= 3 * level)
      if (currentLevelPoints[currentLevel - 1] >= 3 * currentLevel) {
        currentLevel += 1
        setLevel(currentLevel)

        // Update level reached states
        const newLevelReached = [false, false, false]
        for (let i = 0; i < currentLevel; i++) {
          newLevelReached[i] = true
        }
        setLevelReached(newLevelReached)
      }

      setLevelPoints([...currentLevelPoints])

      // Continue animation
      animationRef.current = setTimeout(update, 1000)
    }

    // Start animation after mount
    animationRef.current = setTimeout(update, 500)

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [])

  // Calculate track position based on level (matching original: 25 - 40*(level-1))
  const getTrackPosition = () => {
    return 25 - 40 * (level - 1)
  }

  // Calculate progress bar widths
  const progress1Width = (levelPoints[0] / 3) * 100
  const progress2Width = (levelPoints[1] / 6) * 100

  return (
    <div className="pf-zoomed-progress" data-animation-id="progress-bars__zoomed-progress">
      {/* Progress track with zoom and pan */}
      <div
        className="pf-zoomed-progress__track"
        style={{
          left: `${getTrackPosition()}%`,
        }}
      >
        {/* First progress bar */}
        <div className="pf-zoomed-progress__bar pf-zoomed-progress__bar--1">
          <div className="pf-zoomed-progress__fill" style={{ width: `${progress1Width}%` }} />
        </div>

        {/* Level 1 marker */}
        <motion.div
          className={`pf-zoomed-progress__level pf-zoomed-progress__level--1 ${levelReached[0] ? 'reached' : ''}`}
          variants={levelBounceVariants}
          initial="initial"
          animate={levelReached[0] &&  'animate'}
          style={{ translateY: '-50%' }}
        >
          <span>1</span>
        </motion.div>

        {/* Level 2 marker */}
        <motion.div
          className={`pf-zoomed-progress__level pf-zoomed-progress__level--2 ${levelReached[1] ? 'reached' : ''}`}
          variants={ levelBounceVariants}
          initial="initial"
          animate={levelReached[1] &&  'animate'}
          style={{ translateX: '-50%', translateY: '-50%' }}
        >
          <span>2</span>
        </motion.div>

        {/* Second progress bar */}
        <div className="pf-zoomed-progress__bar pf-zoomed-progress__bar--2">
          <div className="pf-zoomed-progress__fill" style={{ width: `${progress2Width}%` }} />
        </div>

        {/* Level 3 marker */}
        <motion.div
          className={`pf-zoomed-progress__level pf-zoomed-progress__level--3 ${levelReached[2] ? 'reached' : ''}`}
          variants={levelBounceVariants}
          initial="initial"
          animate={levelReached[2] &&  'animate' }
          style={{ translateY: '-50%' }}
        >
          <span>3</span>
        </motion.div>
      </div>

      {/* Radial gradient mask for zoom effect */}
      <div className={`pf-zoomed-progress__mask pf-zoomed-progress__mask--level-${level}`} />
    </div>
  )
}
