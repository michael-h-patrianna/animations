import { memo, useRef, useState } from 'react'
import '../shared.css'
import './ButtonEffectsShockwave.css'

interface Shockwave {
  id: number
  x: number
  y: number
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
  const nextId = useRef(0)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = btnRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = nextId.current++

    setShockwaves((prev) => [...prev, { id, x, y }])

    setTimeout(() => {
      setShockwaves((prev) => prev.filter((w) => w.id !== id))
    }, 1000)
  }

  return (
    <div className="button-demo" data-animation-id="button-effects__shockwave">
      <button
        ref={btnRef}
        className="pf-btn pf-btn--primary bfx-shockwave"
        onClick={handleClick}
      >
        Click Me!
        <span className="bfx-shockwave__container" aria-hidden>
          {shockwaves.map((wave) => (
            <span key={wave.id} className="bfx-shockwave__group">
              <span
                className="bfx-shockwave__ring bfx-shockwave__ring--1"
                style={{ left: wave.x, top: wave.y }}
              />
              <span
                className="bfx-shockwave__ring bfx-shockwave__ring--2"
                style={{ left: wave.x, top: wave.y }}
              />
              <span
                className="bfx-shockwave__ring bfx-shockwave__ring--3"
                style={{ left: wave.x, top: wave.y }}
              />
            </span>
          ))}
        </span>
      </button>
    </div>
  )
}

export const ButtonEffectsShockwave = memo(ButtonEffectsShockwaveComponent)

