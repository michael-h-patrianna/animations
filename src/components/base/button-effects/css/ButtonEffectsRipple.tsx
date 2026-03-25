/**
 * Ripple — wraps any element with Material Design-style click ripple expansion.
 *
 * Copy-paste files: this file + ButtonEffectsRipple.css
 * Runtime deps: react
 *
 * Usage:
 *   <ButtonEffectsRipple>
 *     <button className="my-btn">Buy Now</button>
 *   </ButtonEffectsRipple>
 */

import { memo, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import './ButtonEffectsRipple.css'
import { DemoButton } from '@/components/demo-blocks'

interface Ripple {
  id: number
  x: number
  y: number
  size: number
}

interface ButtonEffectsRippleProps {
  children?: ReactNode
  color?: string
  /** Ripple animation duration in ms. Default: 520 */
  duration?: number
}

function ButtonEffectsRippleComponent({
  children,
  color = 'rgb(255 255 255 / 40%)',
  duration = 520,
}: ButtonEffectsRippleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [ripples, setRipples] = useState<Ripple[]>([])
  const nextIdRef = useRef(0)
  const timeoutIdsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())
  const style = {
    ['--pf-ripple-color' as string]: color,
    ['--pf-ripple-duration' as string]: `${duration}ms`,
  } as CSSProperties

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

  return (
    <div
      ref={containerRef}
      className="pf-ripple"
      data-animation-id="button-effects__ripple"
      onClick={handleClick}
      style={style}
    >
      {children ?? <DemoButton label="Click Me!" />}
      <span className="pf-ripple__overlay" aria-hidden>
        {ripples.map((r) => {
          const half = r.size / 2
          return (
            <span
              key={r.id}
              className="pf-ripple__wave"
              style={{
                left: r.x - half,
                top: r.y - half,
                width: r.size,
                height: r.size,
                animationDuration: `${duration}ms`,
              }}
            />
          )
        })}
      </span>
    </div>
  )
}

export const ButtonEffectsRipple = memo(ButtonEffectsRippleComponent)
