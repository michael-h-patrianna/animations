import type { AnimationMetadata } from '@/types/animation'
import { easeOut, motion, useReducedMotion } from 'framer-motion'
import { useRef, useState } from 'react'
import '../shared.css'
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
  const shouldReduceMotion = useReducedMotion()

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

  const rippleVariants = {
    initial: {
      scale: 0.2,
      opacity: 0.6,
    },
    animate: {
      scale: 1,
      opacity: [0.6, 0.45, 0],
      transition: {
        duration: 0.52,
        ease: easeOut,
        times: [0, 0.6, 1],
      },
    },
  }

  return (
    <div className="button-demo" data-animation-id="button-effects__ripple">
      <button ref={btnRef} className="pf-btn pf-btn--primary pf-btn--ripple" onClick={handleClick}>
        Ripple Button
        <span className="pf-btn__ripples" aria-hidden>
          {ripples.map((r) => {
            const half = r.size / 2
            return shouldReduceMotion ? (
              <span
                key={r.id}
                className="pf-btn__ripple"
                style={{ left: r.x - half, top: r.y - half, width: r.size, height: r.size }}
              />
            ) : (
              <motion.span
                key={r.id}
                className="pf-btn__ripple"
                style={{ left: r.x - half, top: r.y - half, width: r.size, height: r.size }}
                variants={rippleVariants}
                initial="initial"
                animate="animate"
              />
            )
          })}
        </span>
      </button>
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: AnimationMetadata = {
  id: 'button-effects__ripple',
  title: 'Ripple Button',
  description: 'Themed button with Material-style click ripple expansion.',
  tags: ['framer'],
  disableReplay: true,
}
