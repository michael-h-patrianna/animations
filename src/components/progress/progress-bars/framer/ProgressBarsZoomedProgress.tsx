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
 * Styleable CSS custom properties: inherits from ProgressBarsZoomedProgress.css
 *
 * Files to copy: this file + ProgressBarsZoomedProgress.css + ../SharedTypes.ts
 */
import * as m from 'motion/react-m'
import { useEffect, useRef, useState } from 'react'
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'

export function ProgressBarsZoomedProgress({ progress, className, style }: ProgressBarProps) {
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
  const progress1Width = (levelPoints[0]! / 3) * 100
  const progress2Width = (levelPoints[1]! / 6) * 100

  const levelBounceVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1.3, 1.5, 1.3],
      transition: { duration: 0.7, ease: [0.68, -0.55, 0.265, 1.55] as const, times: [0, 0.5, 1] },
    },
  }

  return (
    <div
      className={`pf-zoomed-progress${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__zoomed-progress"
    >
      <div className="pf-zoomed-progress__track" style={{ left: `${trackPosition}%` }}>
        <div className="pf-zoomed-progress__bar pf-zoomed-progress__bar--one">
          <div className="pf-zoomed-progress__fill" style={{ width: `${progress1Width}%` }} />
        </div>

        <m.div
          className={`pf-zoomed-progress__level pf-zoomed-progress__level--one${levelReached[0] ? ' reached' : ''}`}
          variants={levelBounceVariants}
          initial="initial"
          animate={levelReached[0] ? 'animate' : undefined}
          style={{ translateY: '-50%', animation: 'none' }}
        >
          <span>1</span>
        </m.div>

        <m.div
          className={`pf-zoomed-progress__level pf-zoomed-progress__level--two${levelReached[1] ? ' reached' : ''}`}
          variants={levelBounceVariants}
          initial="initial"
          animate={levelReached[1] ? 'animate' : undefined}
          style={{ translateX: '-50%', translateY: '-50%', animation: 'none' }}
        >
          <span>2</span>
        </m.div>

        <div className="pf-zoomed-progress__bar pf-zoomed-progress__bar--two">
          <div className="pf-zoomed-progress__fill" style={{ width: `${progress2Width}%` }} />
        </div>

        <m.div
          className={`pf-zoomed-progress__level pf-zoomed-progress__level--three${levelReached[2] ? ' reached' : ''}`}
          variants={levelBounceVariants}
          initial="initial"
          animate={levelReached[2] ? 'animate' : undefined}
          style={{ translateY: '-50%', animation: 'none' }}
        >
          <span>3</span>
        </m.div>
      </div>

      <div className={`pf-zoomed-progress__mask pf-zoomed-progress__mask--level-${level}`} />
    </div>
  )
}
