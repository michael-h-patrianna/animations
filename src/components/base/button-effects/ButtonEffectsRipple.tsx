import { useRef, useState } from 'react'
import './ButtonEffectsRipple.css'

interface Ripple {
  id: number
  x: number // click x relative to button
  y: number // click y relative to button
  size: number // diameter to cover the button
}

export function ButtonEffectsRipple() {
  const btnRef = useRef<HTMLButtonElement>(null)
  const [ripples, setRipples] = useState<Ripple[]>([])
  const nextId = useRef(0)

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const rect = btnRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    // compute diameter large enough to cover from click to farthest corner
    const dx = Math.max(x, rect.width - x)
    const dy = Math.max(y, rect.height - y)
    const radius = Math.sqrt(dx * dx + dy * dy)
    const size = radius * 2
    const id = nextId.current++
    setRipples((prev) => [...prev, { id, x, y, size }])
    // cleanup ripple after animation ends
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 520)
  }

  return (
    <div className="button-ripple-demo" data-animation-id="button-effects__ripple">
      <button ref={btnRef} className="pf-btn pf-btn--primary pf-btn--ripple" onClick={handleClick}>
        Ripple Button
        <span className="pf-btn__ripples" aria-hidden>
          {ripples.map((r) => {
            const half = r.size / 2
            return (
              <span
                key={r.id}
                className="pf-btn__ripple"
                style={{ left: r.x - half, top: r.y - half, width: r.size, height: r.size }}
              />
            )
          })}
        </span>
      </button>
    </div>
  )
}
