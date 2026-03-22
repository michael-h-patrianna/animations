/**
 * Zoomed Progress (CSS variant)
 *
 * Files to copy: this file + ProgressBarsZoomedProgress.css + ../SharedTypes.ts
 */
import { useEffect, useRef, useState } from 'react'
import type { ProgressBarProps } from '../SharedTypes'
import './ProgressBarsZoomedProgress.css'

export function ProgressBarsZoomedProgress({
  progress,
  className,
  style,
}: ProgressBarProps) {
  const isControlled = progress !== undefined
  const [level, setLevel] = useState(1)
  const [levelPoints, setLevelPoints] = useState([0, 0, 0])
  const [levelReached, setLevelReached] = useState([true, false, false])
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!isControlled) return
    const p = progress ?? 0
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
  }, [isControlled, progress])

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

  const getTrackPosition = () => 25 - 40 * (level - 1)
  const progress1Width = (levelPoints[0]! / 3) * 100
  const progress2Width = (levelPoints[1]! / 6) * 100

  return (
    <div
      className={`pf-zoomed-progress${className ? ` ${className}` : ''}`}
      style={style}
      data-animation-id="progress-bars__zoomed-progress"
    >
      <div className="pf-zoomed-progress__track" style={{ left: `${getTrackPosition()}%` }}>
        <div className="pf-zoomed-progress__bar pf-zoomed-progress__bar--one">
          <div className="pf-zoomed-progress__fill" style={{ width: `${progress1Width}%` }} />
        </div>
        <div className={`pf-zoomed-progress__level pf-zoomed-progress__level--one${levelReached[0] === true ? ' reached' : ''}`}>
          <span>1</span>
        </div>
        <div className={`pf-zoomed-progress__level pf-zoomed-progress__level--two${levelReached[1] === true ? ' reached' : ''}`}>
          <span>2</span>
        </div>
        <div className="pf-zoomed-progress__bar pf-zoomed-progress__bar--two">
          <div className="pf-zoomed-progress__fill" style={{ width: `${progress2Width}%` }} />
        </div>
        <div className={`pf-zoomed-progress__level pf-zoomed-progress__level--three${levelReached[2] === true ? ' reached' : ''}`}>
          <span>3</span>
        </div>
      </div>
      <div className={`pf-zoomed-progress__mask pf-zoomed-progress__mask--level-${level}`} />
    </div>
  )
}
