/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Zoomed Progress (CSS variant)
 *
 * Files to copy: this file + ProgressBarsZoomedProgress.module.css + ../SharedTypes.ts
 */
import { useEffect, useRef, useState } from 'react'
import type { ProgressBarProps } from '@/components/progress/progress-bars/SharedTypes'
import styles from './ProgressBarsZoomedProgress.module.css'

export function ProgressBarsZoomedProgress({ progress, className, style }: ProgressBarProps) {
  const isControlled = progress !== undefined
  const clampedProgress = Math.max(0, Math.min(1, progress ?? 0))
  const [level, setLevel] = useState(1)
  const [levelPoints, setLevelPoints] = useState([0, 0, 0])
  const [levelReached, setLevelReached] = useState([true, false, false])
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!isControlled) return
    const p = clampedProgress
    if (p >= 1) {
      setLevel(3)
      setLevelPoints([3, 6, 9])
      setLevelReached([true, true, true])
    } else if (p >= 0.5) {
      setLevel(2)
      setLevelPoints([3, Math.round((p - 0.5) * 2 * 6), 0])
      setLevelReached([true, true, false])
    } else {
      setLevel(1)
      setLevelPoints([Math.round(p * 2 * 3), 0, 0])
      setLevelReached([true, false, false])
    }
  }, [isControlled, clampedProgress])

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

  const trackTranslateX = ((-40 * (level - 1)) / 75) * 100
  const progress1Scale = levelPoints[0]! / 3
  const ariaPercent = isControlled
    ? Math.round(clampedProgress * 100)
    : Math.round(((levelPoints[0]! + levelPoints[1]! + levelPoints[2]!) / 18) * 100)
  const progress2Scale = levelPoints[1]! / 6

  return (
    <div
      className={`${styles['pf-zoomed-progress']}${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__zoomed-progress"
    >
      <div
        className={styles['pf-zoomed-progress__track']}
        role="progressbar"
        aria-label="Progress"
        aria-valuenow={ariaPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{ transform: `translateX(${trackTranslateX}%) translateY(-50%) scale(1.2)` }}
      >
        <div
          className={`${styles['pf-zoomed-progress__bar']} ${styles['pf-zoomed-progress__bar--one']}`}
        >
          <div
            className={styles['pf-zoomed-progress__fill']}
            style={{ transform: `skew(-30deg) scaleX(${progress1Scale})` }}
          />
        </div>
        <div
          className={`${styles['pf-zoomed-progress__level']} ${styles['pf-zoomed-progress__level--one']}${levelReached[0] ? ` ${styles['reached']}` : ''}`}
        >
          <span>1</span>
        </div>
        <div
          className={`${styles['pf-zoomed-progress__level']} ${styles['pf-zoomed-progress__level--two']}${levelReached[1] ? ` ${styles['reached']}` : ''}`}
        >
          <span>2</span>
        </div>
        <div
          className={`${styles['pf-zoomed-progress__bar']} ${styles['pf-zoomed-progress__bar--two']}`}
        >
          <div
            className={styles['pf-zoomed-progress__fill']}
            style={{ transform: `skew(-30deg) scaleX(${progress2Scale})` }}
          />
        </div>
        <div
          className={`${styles['pf-zoomed-progress__level']} ${styles['pf-zoomed-progress__level--three']}${levelReached[2] ? ` ${styles['reached']}` : ''}`}
        >
          <span>3</span>
        </div>
      </div>
      <div
        className={`${styles['pf-zoomed-progress__mask']} ${styles[`pf-zoomed-progress__mask--level-${level}`]}`}
      />
    </div>
  )
}
