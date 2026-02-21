import { memo, useEffect, useRef, useState } from 'react'
import '../shared.css'
import './ButtonEffectsRipple.css'

interface Ripple {
  id: number
  x: number
  y: number
  size: number
}

/**
 * Material Design-style ripple effect emanating from click position.
 * Dynamically calculates ripple size to cover entire button from any click point.
 *
 * @returns Button with click-positioned ripple animations
 */
function ButtonEffectsRippleComponent() {
  const btnRef = useRef<HTMLButtonElement>(null)
  const [ripples, setRipples] = useState<Ripple[]>([])
  const nextId = useRef(0)
  const timeoutIdsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())

  useEffect(() => {
    const timeoutIds = timeoutIdsRef.current
    return () => {
      timeoutIds.forEach(clearTimeout)
      timeoutIds.clear()
    }
  }, [])

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const rect = btnRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const dx = Math.max(x, rect.width - x)
    const dy = Math.max(y, rect.height - y)
    const size = Math.sqrt(dx * dx + dy * dy) * 2

    const id = nextId.current++
    setRipples((prev) => [...prev, { id, x, y, size }])

    const timeoutId = setTimeout(() => {
      timeoutIdsRef.current.delete(timeoutId)
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 520)
    timeoutIdsRef.current.add(timeoutId)
  }

  return (
    <div className="button-demo" data-animation-id="button-effects__ripple">
      <button type="button" ref={btnRef} className="pf-btn pf-btn--primary bfx-ripple" onClick={handleClick}>
        Click Me!
        <span className="bfx-ripple__container" aria-hidden>
          {ripples.map((r) => {
            const half = r.size / 2
            return (
              <span
                key={r.id}
                className="bfx-ripple__wave"
                style={{ left: r.x - half, top: r.y - half, width: r.size, height: r.size }}
              />
            )
          })}
        </span>
      </button>
    </div>
  )
}

export const ButtonEffectsRipple = memo(ButtonEffectsRippleComponent)
