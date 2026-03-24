/**
 * Shockwave — wraps any element with concentric rings expanding from click point.
 * Multiple staggered rings with different colors create a depth effect.
 *
 * Copy-paste files: this file + ButtonEffectsShockwave.css
 * Runtime deps: react, motion
 *
 * Usage:
 *   <ButtonEffectsShockwave ringCount={3} color="rgba(255,255,255,0.5)">
 *     <button className="my-btn">Activate</button>
 *   </ButtonEffectsShockwave>
 */

import * as m from 'motion/react-m'
import { easeOut } from 'motion/react'
import React, { useRef, useState, memo, useEffect, type ReactNode } from 'react'
import './ButtonEffectsShockwave.css'
import { DemoButton } from '@/components/demo-blocks'

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
  /** Base ring border color. Default: 'rgba(255,255,255,0.5)' */
  color?: string
  /** Ring expansion duration in ms. Default: 1000 */
  duration?: number
}

function ButtonEffectsShockwaveComponent({
  children,
  ringCount = 3,
  color,
  duration = 1000,
}: ButtonEffectsShockwaveProps) {
  const [shockwaves, setShockwaves] = useState<Shockwave[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const nextIdRef = useRef(0)
  const timeoutIdsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())

  const durationS = duration / 1000

  useEffect(() => {
    const timeoutIds = timeoutIdsRef.current
    return () => {
      timeoutIds.forEach(clearTimeout)
      timeoutIds.clear()
    }
  }, [])

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
      className="pf-shockwave"
      data-animation-id="button-effects__shockwave"
      onClick={handleClick}
      style={color !== undefined ? { ['--pf-shockwave-color' as string]: color } : undefined}
    >
      {children ?? <DemoButton label="Click Me!" />}
      <span className="pf-shockwave__overlay" aria-hidden>
        {shockwaves.map((wave) => {
          const half = wave.size / 2
          const pos = {
            left: wave.x - half,
            top: wave.y - half,
            width: wave.size,
            height: wave.size,
          }
          return (
            <React.Fragment key={wave.id}>
              {Array.from({ length: ringCount }, (_, i) => (
                <m.span
                  key={i}
                  className="pf-shockwave__ring"
                  style={{ ...pos, opacity: 1 - i * 0.15, animation: 'none' }}
                  initial={{ scale: 0, opacity: 1 - i * 0.15 }}
                  animate={{ scale: 1, opacity: 0 }}
                  transition={{ duration: durationS, ease: easeOut, delay: i * 0.1 }}
                />
              ))}
            </React.Fragment>
          )
        })}
      </span>
    </div>
  )
}

export const ButtonEffectsShockwave = memo(ButtonEffectsShockwaveComponent)
