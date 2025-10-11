import type { AnimationMetadata } from '@/types/animation'
import { easeOut, motion } from 'framer-motion'
import React, { useRef, useState } from 'react'
import '../shared.css'
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
    }, 1200)
  }

  const shockwaveVariants = (delay: number) => ({
    initial: {
      width: 0,
      height: 0,
      opacity: 1,
    },
    animate: {
      width: 150,
      height: 150,
      opacity: 0,
      transition: {
        duration: 1,
        ease: easeOut,
        delay,
      },
    },
  })

  return (
    <div className="button-demo" data-animation-id="button-effects__shockwave">
      <button ref={btnRef} className="pf-btn pf-btn--primary pf-btn--shockwave" onClick={handleClick}>
        Click Me!
        <span className="pf-btn__shockwaves" aria-hidden>
          {shockwaves.map((wave) => (
            <React.Fragment key={wave.id}>
                <>
                  <motion.span
                    className="pf-btn__shockwave pf-btn__shockwave--1"
                    style={{ left: wave.x, top: wave.y }}
                    variants={shockwaveVariants(0)}
                    initial="initial"
                    animate="animate"
                  />
                  <motion.span
                    className="pf-btn__shockwave pf-btn__shockwave--2"
                    style={{ left: wave.x, top: wave.y }}
                    variants={shockwaveVariants(0.1)}
                    initial="initial"
                    animate="animate"
                  />
                  <motion.span
                    className="pf-btn__shockwave pf-btn__shockwave--3"
                    style={{ left: wave.x, top: wave.y }}
                    variants={shockwaveVariants(0.2)}
                    initial="initial"
                    animate="animate"
                  />
                </>
            </React.Fragment>
          ))}
        </span>
      </button>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'button-effects__shockwave',
  title: 'Shockwave',
  description: 'Concentric rings expand outward with distortion effects.',
  tags: ['framer'],
  disableReplay: true,
}
