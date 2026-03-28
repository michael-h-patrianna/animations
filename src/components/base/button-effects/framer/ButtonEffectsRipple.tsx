/**
 * Ripple — expanding circle on click via Motion scale + opacity.
 * A circular overlay scales from 0 to cover the button, then fades out.
 *
 * Copy-paste files: this file + ButtonEffectsRipple.module.css
 * Runtime deps: react, motion
 *
 * Usage:
 *   <ButtonEffectsRipple color="rgba(255,255,255,0.4)" />
 */

import * as m from 'motion/react-m'
import { easeOut, useReducedMotion } from 'motion/react'
import { memo, useEffect, useRef, useState, type MouseEvent } from 'react'
import styles from './ButtonEffectsRipple.module.css'
import { DemoButton } from '@/components/demo-blocks'

interface RippleData {
  id: number
  x: number
  y: number
  size: number
}

interface ButtonEffectsRippleProps {
  /** Ripple circle color. Default: 'rgb(255 255 255 / 30%)' */
  color?: string
  /** Ripple expansion duration in ms. Default: 600 */
  duration?: number
}

function ButtonEffectsRippleComponent({ color, duration = 600 }: ButtonEffectsRippleProps) {
  const prefersReducedMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const nextIdRef = useRef(0)
  const timeoutIdsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())
  const [ripples, setRipples] = useState<RippleData[]>([])

  const durationS = duration / 1000

  useEffect(() => {
    const ids = timeoutIdsRef.current
    return () => {
      ids.forEach(clearTimeout)
      ids.clear()
    }
  }, [])

  const handlePointerDown = (e: MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const dx = Math.max(x, rect.width - x)
    const dy = Math.max(y, rect.height - y)
    const size = Math.sqrt(dx * dx + dy * dy) * 2
    const id = nextIdRef.current++

    setRipples((prev) => [...prev, { id, x, y, size }])

    const cleanupMs = duration + 500
    const timeoutId = setTimeout(() => {
      timeoutIdsRef.current.delete(timeoutId)
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, cleanupMs)
    timeoutIdsRef.current.add(timeoutId)
  }

  return (
    <div
      ref={containerRef}
      className={styles['pf-ripple-fm']}
      data-animation-id="button-effects__ripple"
      onPointerDown={handlePointerDown}
      style={color != null ? { ['--pf-ripple-color' as string]: color } : undefined}
    >
      <DemoButton label="Click Me!" />
      <span className={styles['pf-ripple-fm__overlay']} aria-hidden>
        {ripples.map((ripple) => {
          const half = ripple.size / 2
          return (
            <m.span
              key={ripple.id}
              className={styles['pf-ripple-fm__circle']}
              style={{
                left: ripple.x - half,
                top: ripple.y - half,
                width: ripple.size,
                height: ripple.size,
              }}
              initial={prefersReducedMotion ? { opacity: 0.5 } : { scale: 0, opacity: 1 }}
              animate={prefersReducedMotion ? { opacity: 0 } : { scale: 1, opacity: 0 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0.15 }
                  : {
                      scale: { duration: durationS, ease: easeOut },
                      opacity: { duration: 0.3, ease: easeOut, delay: durationS * 0.65 },
                    }
              }
            />
          )
        })}
      </span>
    </div>
  )
}

export const ButtonEffectsRipple = memo(ButtonEffectsRippleComponent)
