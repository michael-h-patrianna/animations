/**
 * Ripple — wraps any element with Material Design-style click ripple expansion.
 * Click spawns a radial gradient circle at the click position that expands
 * to cover the element.
 *
 * Copy-paste files: this file + ButtonEffectsRipple.css
 * Runtime deps: react, motion
 *
 * Usage:
 *   <ButtonEffectsRipple color="rgba(255,255,255,0.4)">
 *     <button className="my-btn">Buy Now</button>
 *   </ButtonEffectsRipple>
 */

import * as m from 'motion/react-m'
import { easeOut } from 'motion/react'
import { useEffect, useRef, useState, memo, type ReactNode } from 'react'
import './ButtonEffectsRipple.css'

interface Ripple {
  id: number
  x: number
  y: number
  size: number
}

interface ButtonEffectsRippleProps {
  children?: ReactNode
  /** Ripple color. Default: 'rgba(255,255,255,0.4)' */
  color?: string
  /** Ripple animation duration in ms. Default: 520 */
  duration?: number
}

function ButtonEffectsRippleComponent({
  children,
  color,
  duration = 520,
}: ButtonEffectsRippleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [ripples, setRipples] = useState<Ripple[]>([])
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

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const dx = Math.max(x, rect.width - x)
    const dy = Math.max(y, rect.height - y)
    const size = Math.sqrt(dx * dx + dy * dy) * 2
    const id = nextIdRef.current++
    setRipples((prev) => [...prev, { id, x, y, size }])
    const timeoutId = setTimeout(() => {
      timeoutIdsRef.current.delete(timeoutId)
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, duration + 20)
    timeoutIdsRef.current.add(timeoutId)
  }

  const rippleVariants = {
    initial: { scale: 0.2, opacity: 0.6 },
    animate: {
      scale: 1,
      opacity: [0.6, 0.45, 0],
      transition: { duration: durationS, ease: easeOut, times: [0, 0.6, 1] },
    },
  }

  return (
    <div
      ref={containerRef}
      className="pf-ripple"
      data-animation-id="button-effects__ripple"
      onClick={handleClick}
      style={color !== undefined ? { ['--pf-ripple-color' as string]: color } : undefined}
    >
      {children ?? (
        <button type="button" className="pf-btn pf-btn--primary">
          Click Me!
        </button>
      )}
      <span className="pf-ripple__overlay" aria-hidden>
        {ripples.map((r) => {
          const half = r.size / 2
          return (
            <m.span
              key={r.id}
              className="pf-ripple__wave"
              style={{
                left: r.x - half,
                top: r.y - half,
                width: r.size,
                height: r.size,
                animation: 'none',
              }}
              variants={rippleVariants}
              initial="initial"
              animate="animate"
            />
          )
        })}
      </span>
    </div>
  )
}

export const ButtonEffectsRipple = memo(ButtonEffectsRippleComponent)
