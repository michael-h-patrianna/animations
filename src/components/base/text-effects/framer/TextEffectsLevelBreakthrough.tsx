/**
 * Standalone: Copy this file + TextEffectsLevelBreakthrough.css (from css/ dir) into your app.
 * Runtime deps: react, motion
 * RN: Port useAnimation → Moti useAnimatedStyle with shared values.
 */

import * as m from 'motion/react-m'
import { easeOut, useAnimation, useReducedMotion } from 'motion/react'
import { memo, useEffect, useRef, useState } from 'react'
import styles from './TextEffectsLevelBreakthrough.module.css'

interface TextEffectsLevelBreakthroughProps {
  /** Text shown before breakthrough. @default 'LEVEL 1' */
  startText?: string
  /** Text shown after breakthrough. @default 'LEVEL 2' */
  endText?: string
  /** Text and surge ring color. @default '#ffce1a' */
  color?: string
}

function TextEffectsLevelBreakthroughComponent({
  startText = 'LEVEL 1',
  endText = 'LEVEL 2',
  color,
}: TextEffectsLevelBreakthroughProps) {
  const prefersReducedMotion = useReducedMotion()
  const levelControls = useAnimation()
  const surge1Controls = useAnimation()
  const surge2Controls = useAnimation()
  const [showEnd, setShowEnd] = useState(false)
  const [showGlow, setShowGlow] = useState(false)
  const mountedRef = useRef(true)
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([])

  useEffect(() => {
    mountedRef.current = true

    const scheduleTimeout = (callback: () => void, delayMs: number) => {
      const t = setTimeout(() => {
        if (!mountedRef.current) return
        callback()
      }, delayMs)
      timersRef.current.push(t)
    }

    setShowEnd(false)
    setShowGlow(false)

    if (prefersReducedMotion) {
      levelControls.start({
        opacity: [1, 0.4, 1],
        scale: [1, 0.98, 1.02, 1],
        transition: { duration: 0.4, ease: 'easeInOut' },
      })

      scheduleTimeout(() => {
        setShowEnd(true)
      }, 300)
    } else {
      surge1Controls.set({ opacity: 0, scale: 0.5 })
      surge2Controls.set({ opacity: 0, scale: 0.5 })

      levelControls.start({
        scale: [1, 0.9, 0.9, 0.9, 1.5, 1],
        rotate: [0, -2, 2, -2, 0, 0],
        transition: {
          duration: 1,
          ease: [0.68, -0.55, 0.265, 1.55] as const,
          times: [0, 0.1, 0.2, 0.3, 0.5, 1],
        },
      })

      surge1Controls.start({
        opacity: [0, 1, 0],
        scale: [0.5, 1.5, 2],
        transition: { duration: 0.8, ease: easeOut, times: [0, 0.5, 1] },
      })

      scheduleTimeout(() => {
        surge2Controls.start({
          opacity: [0, 1, 0],
          scale: [0.5, 1.5, 2],
          transition: { duration: 0.8, ease: easeOut, times: [0, 0.5, 1] },
        })
      }, 100)

      scheduleTimeout(() => {
        setShowEnd(true)
        setShowGlow(true)
      }, 600)
    }

    return () => {
      mountedRef.current = false
      timersRef.current.forEach(clearTimeout)
      timersRef.current = []
      levelControls.stop()
      surge1Controls.stop()
      surge2Controls.stop()
    }
  }, [levelControls, surge1Controls, surge2Controls, prefersReducedMotion])

  return (
    <div
      className={styles['pf-breakthrough-container-fm']}
      data-animation-id="text-effects__level-breakthrough"
      style={
        color !== undefined
          ? ({ '--text-effects-level-breakthrough-color': color } as React.CSSProperties)
          : undefined
      }
    >
      <m.div
        className={styles['pf-surge-lines-fm']}
        animate={surge1Controls}
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle, transparent 75%, var(--text-effects-level-breakthrough-color) 76%, transparent 82%)',
          opacity: 0,
        }}
      />

      <m.div
        className={styles['pf-surge-lines-fm']}
        animate={surge2Controls}
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle, transparent 65%, var(--text-effects-level-breakthrough-color) 66%, transparent 72%)',
          opacity: 0,
        }}
      />

      <m.div
        className={`${styles['pf-level-breakthrough-fm']}${showGlow ? ` ${styles['pf-level-breakthrough-fm--glow']}` : ''}`}
        animate={levelControls}
      >
        {showEnd ? endText : startText}
      </m.div>
    </div>
  )
}

export const TextEffectsLevelBreakthrough = memo(TextEffectsLevelBreakthroughComponent)
