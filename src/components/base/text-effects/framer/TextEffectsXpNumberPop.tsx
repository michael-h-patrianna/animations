/**
 * Standalone: Copy this file + TextEffectsXpNumberPop.css into your app.
 * Runtime deps: react, motion
 * RN: Port with Moti — useMotionValue → useSharedValue, AnimatePresence → exitTransition.
 */

import * as m from 'motion/react-m'
import {
  animate,
  AnimatePresence,
  easeOut,
  useAnimation,
  useMotionValue,
  useTransform,
} from 'motion/react'
import { memo, useEffect, useMemo, useRef, useState } from 'react'

interface CountUpParticle {
  id: number
  x: number
  y: number
  value: number
  layer: number
  delay: number
}

interface TextEffectsXpNumberPopProps {
  /** Starting value of the count-up. @default 0 */
  from?: number
  /** Target value to count up to. @default 240 */
  to?: number
  /** Text before the number (e.g. "$", "+"). */
  prefix?: string
  /** Text after the number (e.g. " XP", " pts", " €"). @default ' XP' */
  suffix?: string
  /** Custom number formatting. Receives the current number, returns display string. @default Math.round(n).toLocaleString() */
  formatValue?: (n: number) => string
  /** Maximum floating particles. Auto-scales down for small ranges. @default 10 */
  maxParticles?: number
  /** Base color for number, particles, and label. Gradient stops are computed. @default '#c6ff77' */
  color?: string
}

const defaultFormat = (n: number): string => Math.round(n).toLocaleString()

function generateParticles(range: number, maxParticles: number): CountUpParticle[] {
  const absRange = Math.abs(range)
  const numParticles = Math.min(maxParticles, Math.max(1, Math.floor(absRange / 5)))
  const particlesPerLayer = 5
  const particles: CountUpParticle[] = []

  for (let i = 0; i < numParticles; i++) {
    const progress = (i + 1) / numParticles
    const cumulative = Math.round(absRange * progress)
    const prev = i > 0 ? Math.round(absRange * (i / numParticles)) : 0
    const increment = cumulative - prev

    const angleIndex = i % particlesPerLayer
    const angle = (angleIndex / particlesPerLayer) * Math.PI * 2
    const layer = Math.floor(i / particlesPerLayer)
    const radius = 60 + layer * 20

    particles.push({
      id: i,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      value: increment,
      layer,
      delay: layer * 0.1 + angleIndex * 0.05,
    })
  }

  return particles
}

function TextEffectsXpNumberPopComponent({
  from = 0,
  to = 240,
  prefix,
  suffix = ' XP',
  formatValue = defaultFormat,
  maxParticles = 10,
  color,
}: TextEffectsXpNumberPopProps) {
  const glowControls = useAnimation()
  const numberControls = useAnimation()
  const [showParticles, setShowParticles] = useState(false)
  const count = useMotionValue(from)
  const formatRef = useRef(formatValue)
  formatRef.current = formatValue

  const displayValue = useTransform(count, (latest) => formatRef.current(latest))

  const range = to - from
  const particles = useMemo(() => generateParticles(range, maxParticles), [range, maxParticles])

  useEffect(() => {
    count.set(from)
    const pendingTimeouts: ReturnType<typeof setTimeout>[] = []

    glowControls.start({
      opacity: [0, 0.8, 0.4, 0],
      scale: [0.5, 1.2, 1, 0.8],
      transition: { duration: 2.8, ease: easeOut, times: [0, 0.3, 0.6, 1] },
    })

    numberControls.start({
      scale: [0.3, 1.15, 1],
      y: [20, -5, 0],
      opacity: [0, 1, 1],
      transition: { duration: 1.6, ease: [0.25, 0.46, 0.45, 0.94] as const, times: [0, 0.6, 1] },
    })

    const countControls = animate(count, to, {
      duration: 2.5,
      ease: [0, 0.65, 0.35, 1] as const,
    })

    const showTimer = setTimeout(() => {
      setShowParticles(true)
      const hideTimer = setTimeout(() => setShowParticles(false), 3000)
      pendingTimeouts.push(hideTimer)
    }, 400)
    pendingTimeouts.push(showTimer)

    return () => {
      pendingTimeouts.forEach(clearTimeout)
      countControls.stop()
    }
  }, [glowControls, numberControls, count, from, to])

  return (
    <div
      className="pf-xp-pop"
      data-animation-id="text-effects__xp-number-pop"
      style={color !== undefined ? { '--pf-xp-pop-color': color } as React.CSSProperties : undefined}
    >
      <AnimatePresence>
        {showParticles &&
          particles.map((particle) => (
            <m.div
              key={particle.id}
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0.7],
                x: [0, particle.x, particle.x * 1.5],
                y: [0, particle.y, particle.y * 1.5 - 40],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2.6,
                delay: particle.delay,
                ease: easeOut,
                times: [0, 0.4, 1],
              }}
              className="pf-xp-pop__particle"
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                fontSize: particle.layer === 0 ? '18px' : '14px',
                fontWeight: '700',
                color:
                  particle.layer === 0
                    ? 'var(--pf-xp-pop-color-1)'
                    : 'var(--pf-xp-pop-color-2)',
                pointerEvents: 'none',
                zIndex: 3,
              }}
            >
              +{formatValue(particle.value)}
            </m.div>
          ))}
      </AnimatePresence>

      <m.div className="pf-xp-pop__number-wrapper" animate={numberControls}>
        {prefix !== undefined && <span className="pf-xp-pop__label">{prefix}</span>}
        <m.span className="pf-xp-pop__number-value">{displayValue}</m.span>
        {suffix !== undefined && <span className="pf-xp-pop__label">{suffix}</span>}
      </m.div>
    </div>
  )
}

export const TextEffectsXpNumberPop = memo(TextEffectsXpNumberPopComponent)
