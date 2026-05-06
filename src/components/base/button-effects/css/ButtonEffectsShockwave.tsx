/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Shockwave — wraps any element with concentric rings expanding from click point.
 *
 * Copy-paste files: this file + ButtonEffectsShockwave.module.css
 * Runtime deps: react
 *
 * Usage:
 *   <ButtonEffectsShockwave ringCount={3}>
 *     <button className="my-btn">Activate</button>
 *   </ButtonEffectsShockwave>
 */

import { memo, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import styles from './ButtonEffectsShockwave.module.css'
import { DemoButton } from '@/components/demo-blocks'
import { SHOCKWAVE_COLOR } from '@/components/base/button-effects/SharedDefaults'

interface Shockwave {
  id: number
  x: number
  y: number
  size: number
}

interface ButtonEffectsShockwaveProps {
  children?: ReactNode
  /** Number of concentric rings per click. Default: 3 */
  ringCount?: number
  /** Ring border color. Default: 'rgb(255 255 255 / 50%)' */
  color?: string
  /** Ring expansion duration in ms. Default: 1000 */
  duration?: number
}

function ButtonEffectsShockwaveComponent({
  children,
  ringCount = 3,
  color = SHOCKWAVE_COLOR,
  duration = 1000,
}: ButtonEffectsShockwaveProps) {
  const [shockwaves, setShockwaves] = useState<Shockwave[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const nextIdRef = useRef(0)
  const timeoutIdsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())

  useEffect(() => {
    const timeoutIds = timeoutIdsRef.current
    return () => {
      timeoutIds.forEach(clearTimeout)
      timeoutIds.clear()
    }
  }, [])

  const style = {
    ['--pf-shockwave-color' as string]: color,
    ['--pf-shockwave-duration' as string]: `${duration}ms`,
  } as CSSProperties

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = nextIdRef.current++
    const dx = Math.max(x, rect.width - x)
    const dy = Math.max(y, rect.height - y)
    const size = Math.sqrt(dx * dx + dy * dy) * 2

    setShockwaves((prev) => [...prev, { id, x, y, size }])

    const cleanupMs = duration + ringCount * 100 + 200
    const timeoutId = setTimeout(() => {
      timeoutIdsRef.current.delete(timeoutId)
      setShockwaves((prev) => prev.filter((w) => w.id !== id))
    }, cleanupMs)
    timeoutIdsRef.current.add(timeoutId)
  }

  return (
    <div
      ref={containerRef}
      className={styles['pf-shockwave']}
      data-animation-id="button-effects__shockwave"
      onClick={handleClick}
      style={style}
    >
      {children ?? <DemoButton label="Click Me!" />}
      <span className={styles['pf-shockwave__overlay']} aria-hidden>
        {shockwaves.map((wave) => {
          const half = wave.size / 2
          const pos = {
            left: wave.x - half,
            top: wave.y - half,
            width: wave.size,
            height: wave.size,
          }
          return (
            <span key={wave.id} className={styles['pf-shockwave__group']}>
              {Array.from({ length: ringCount }, (_, i) => (
                <span
                  key={i}
                  className={styles['pf-shockwave__ring']}
                  style={{
                    ...pos,
                    animationDuration: `${duration}ms`,
                    animationDelay: `${i * 100}ms`,
                  }}
                />
              ))}
            </span>
          )
        })}
      </span>
    </div>
  )
}

export const ButtonEffectsShockwave = memo(ButtonEffectsShockwaveComponent)
