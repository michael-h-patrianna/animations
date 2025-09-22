import React, { useRef, useState } from 'react'
import './ButtonEffectsShockwave.css'

interface Shockwave {
  id: number
  x: number
  y: number
}

export function ButtonEffectsShockwave() {
  const [shockwaves, setShockwaves] = useState<Shockwave[]>([])
  const btnRef = useRef<HTMLButtonElement>(null)
  const nextId = useRef(0)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = btnRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = nextId.current++

    // Create multiple concentric rings
    const newWave = { id, x, y }
    setShockwaves((prev) => [...prev, newWave])

    // Clean up after animation
    setTimeout(() => {
      setShockwaves((prev) => prev.filter((w) => w.id !== id))
    }, 1000)
  }

  return (
    <div className="button-shockwave-demo" data-animation-id="button-effects__shockwave">
      <button
        ref={btnRef}
        className="pf-btn pf-btn--primary pf-btn--shockwave"
        onClick={handleClick}
      >
        Click Me!
        <span className="pf-btn__shockwaves" aria-hidden>
          {shockwaves.map((wave) => (
            <React.Fragment key={wave.id}>
              <span
                className="pf-btn__shockwave pf-btn__shockwave--1"
                style={{ left: wave.x, top: wave.y }}
              />
              <span
                className="pf-btn__shockwave pf-btn__shockwave--2"
                style={{ left: wave.x, top: wave.y }}
              />
              <span
                className="pf-btn__shockwave pf-btn__shockwave--3"
                style={{ left: wave.x, top: wave.y }}
              />
            </React.Fragment>
          ))}
        </span>
      </button>
    </div>
  )
}
