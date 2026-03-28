/**
 * Zoomed Progress
 *
 * Multi-level progress with a zooming/panning viewport. The track slides
 * and each level marker bounces when reached. In demo mode runs a scripted
 * level-up sequence. In controlled mode shows the given level and points.
 *
 * @example
 * ```tsx
 * <ProgressBarsZoomedProgress progress={0.5} />
 * ```
 *
 * Styleable CSS custom properties: inherits from ProgressBarsZoomedProgress.module.css
 *
 * Files to copy: this file + ProgressBarsZoomedProgress.module.css + ../SharedTypes.ts
 */
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'
import styles from './ProgressBarsZoomedProgress.module.css'

export function ProgressBarsZoomedProgress({ progress, className, style }: ProgressBarProps) {
  const prefersReducedMotion = useReducedMotion()
  const isControlled = progress !== undefined
  const [level, setLevel] = useState(1)
  const [levelPoints, setLevelPoints] = useState([0, 0, 0])
  const [levelReached, setLevelReached] = useState([true, false, false])
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Controlled mode: derive level from progress
  useEffect(() => {
    if (!isControlled) return
    const p = progress ?? 0
    if (p >= 1) {
      setLevel(3)
      setLevelPoints([3, 6, 9])
      setLevelReached([true, true, true])
    } else if (p >= 0.5) {
      setLevel(2)
      const lvl2 = Math.round((p - 0.5) * 2 * 6)
      setLevelPoints([3, lvl2, 0])
      setLevelReached([true, true, false])
    } else {
      setLevel(1)
      const lvl1 = Math.round(p * 2 * 3)
      setLevelPoints([lvl1, 0, 0])
      setLevelReached([true, false, false])
    }
  }, [isControlled, progress])

  // Demo mode: scripted level-up
  useEffect(() => {
    if (isControlled) return
    let currentLevel = 1
    let currentLevelPoints = [0, 0, 0]

    const update = () => {
      const rndPoints = Math.round(Math.random() * Math.max(currentLevel - 1, 0)) + 1

      if (currentLevel === 3) {
        animationRef.current = setTimeout(() => {
          currentLevel = 1
          currentLevelPoints = [0, 0, 0]
          setLevel(1)
          setLevelPoints([0, 0, 0])
          setLevelReached([true, false, false])
        }, 2000)
        return
      }

      currentLevelPoints[currentLevel - 1] = Math.min(
        currentLevelPoints[currentLevel - 1]! + rndPoints,
        currentLevel * 3
      )

      if (currentLevelPoints[currentLevel - 1]! >= 3 * currentLevel) {
        currentLevel += 1
        setLevel(currentLevel)
        const newReached = [false, false, false]
        for (let i = 0; i < currentLevel; i++) newReached[i] = true
        setLevelReached(newReached)
      }

      setLevelPoints([...currentLevelPoints])
      animationRef.current = setTimeout(update, 1000)
    }

    animationRef.current = setTimeout(update, 500)
    return () => {
      if (animationRef.current !== null) clearTimeout(animationRef.current)
    }
  }, [isControlled])

  const trackPosition = 25 - 40 * (level - 1)
  const progress1Scale = levelPoints[0]! / 3
  const progress2Scale = levelPoints[1]! / 6

  const levelBounceVariants = prefersReducedMotion
    ? {
        initial: { opacity: 0.5 },
        animate: { opacity: 1, transition: { duration: 0 } },
      }
    : {
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

  return (
    <div
      className={`${styles['pf-zoomed-progress-fm']}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__zoomed-progress"
    >
      <div className={styles['pf-zoomed-progress-fm__track']} style={{ left: `${trackPosition}%` }}>
        <div
          className={`${styles['pf-zoomed-progress-fm__bar']} ${styles['pf-zoomed-progress-fm__bar--one']}`}
        >
          <div
            className={styles['pf-zoomed-progress-fm__fill']}
            style={{ transform: `skew(-30deg) scaleX(${progress1Scale})` }}
          />
        </div>

        <m.div
          className={`${styles['pf-zoomed-progress-fm__level']} ${styles['pf-zoomed-progress-fm__level--one']}${levelReached[0] ? ` ${styles['reached']}` : ''}`}
          variants={levelBounceVariants}
          initial="initial"
          animate={levelReached[0] ? 'animate' : undefined}
          style={{ translateY: '-50%' }}
        >
          <span>1</span>
        </m.div>

        <m.div
          className={`${styles['pf-zoomed-progress-fm__level']} ${styles['pf-zoomed-progress-fm__level--two']}${levelReached[1] ? ` ${styles['reached']}` : ''}`}
          variants={levelBounceVariants}
          initial="initial"
          animate={levelReached[1] ? 'animate' : undefined}
          style={{ translateX: '-50%', translateY: '-50%' }}
        >
          <span>2</span>
        </m.div>

        <div
          className={`${styles['pf-zoomed-progress-fm__bar']} ${styles['pf-zoomed-progress-fm__bar--two']}`}
        >
          <div
            className={styles['pf-zoomed-progress-fm__fill']}
            style={{ transform: `skew(-30deg) scaleX(${progress2Scale})` }}
          />
        </div>

        <m.div
          className={`${styles['pf-zoomed-progress-fm__level']} ${styles['pf-zoomed-progress-fm__level--three']}${levelReached[2] ? ` ${styles['reached']}` : ''}`}
          variants={levelBounceVariants}
          initial="initial"
          animate={levelReached[2] ? 'animate' : undefined}
          style={{ translateY: '-50%' }}
        >
          <span>3</span>
        </m.div>
      </div>

      <div
        className={`${styles['pf-zoomed-progress-fm__mask']} ${styles[`pf-zoomed-progress-fm__mask--level-${level}`]}`}
      />
    </div>
  )
}
