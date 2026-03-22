import * as m from 'motion/react-m'
import { easeOut } from 'motion/react'
import React, { useRef, useState, memo, useEffect } from 'react'

const RING_DELAYS = [0, 0.1, 0.2] as const

interface Shockwave {
  id: number
  x: number
  y: number
  size: number
}

function ButtonEffectsShockwaveComponent() {
  const [shockwaves, setShockwaves] = useState<Shockwave[]>([])
  const btnRef = useRef<HTMLButtonElement>(null)
  const nextIdRef = useRef(0)
  const timeoutIdsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())

  useEffect(() => {
    const timeoutIds = timeoutIdsRef.current
    return () => {
      timeoutIds.forEach(clearTimeout)
      timeoutIds.clear()
    }
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = btnRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = nextIdRef.current++

    // Compute ring diameter from farthest corner (same approach as Ripple)
    const dx = Math.max(x, rect.width - x)
    const dy = Math.max(y, rect.height - y)
    const size = Math.sqrt(dx * dx + dy * dy) * 2

    setShockwaves((prev) => [...prev, { id, x, y, size }])

    const timeoutId = setTimeout(() => {
      timeoutIdsRef.current.delete(timeoutId)
      setShockwaves((prev) => prev.filter((w) => w.id !== id))
    }, 1200)
    timeoutIdsRef.current.add(timeoutId)
  }

  return (
    <div className="button-demo" data-animation-id="button-effects__shockwave">
      <button
        type="button"
        ref={btnRef}
        className="pf-btn pf-btn--primary pf-btn--shockwave"
        onClick={handleClick}
      >
        Click Me!
        <span className="pf-btn__shockwaves" aria-hidden>
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
                {RING_DELAYS.map((delay, i) => (
                  <m.span
                    key={i}
                    className={`pf-btn__shockwave pf-btn__shockwave--${i + 1}`}
                    style={pos}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 1, opacity: 0 }}
                    transition={{ duration: 1, ease: easeOut, delay }}
                  />
                ))}
              </React.Fragment>
            )
          })}
        </span>
      </button>
    </div>
  )
}

/**
 * Memoized ButtonEffectsShockwave to prevent unnecessary re-renders in grid layouts.
 */
export const ButtonEffectsShockwave = memo(ButtonEffectsShockwaveComponent)
