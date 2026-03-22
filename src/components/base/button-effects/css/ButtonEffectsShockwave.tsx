import { memo, useEffect, useRef, useState } from 'react'
import '../shared.css'
import './ButtonEffectsShockwave.css'

const RING_COUNT = 3

interface Shockwave {
  id: number
  x: number
  y: number
  size: number
}

/**
 * Concentric ring shockwave effect emanating from click position.
 * Creates three staggered waves with different colors for depth effect.
 *
 * @returns Button with click-positioned shockwave animations
 */
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

    // Compute ring diameter from farthest corner
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
        className="pf-btn pf-btn--primary bfx-shockwave"
        onClick={handleClick}
      >
        Click Me!
        <span className="bfx-shockwave__container" aria-hidden>
          {shockwaves.map((wave) => {
            const half = wave.size / 2
            const pos = {
              left: wave.x - half,
              top: wave.y - half,
              width: wave.size,
              height: wave.size,
            }
            return (
              <span key={wave.id} className="bfx-shockwave__group">
                {Array.from({ length: RING_COUNT }, (_, i) => (
                  <span
                    key={i}
                    className={`bfx-shockwave__ring bfx-shockwave__ring--${i + 1}`}
                    style={pos}
                  />
                ))}
              </span>
            )
          })}
        </span>
      </button>
    </div>
  )
}

export const ButtonEffectsShockwave = memo(ButtonEffectsShockwaveComponent)
