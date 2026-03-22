import * as m from 'motion/react-m'
import { easeOut, useAnimation } from 'motion/react'
import { useEffect, useRef, useState, memo } from 'react'

function TextEffectsLevelBreakthroughComponent() {
  const levelControls = useAnimation()
  const surge1Controls = useAnimation()
  const surge2Controls = useAnimation()
  const [level, setLevel] = useState(1)
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

    // Reset state
    setLevel(1)
    setShowGlow(false)
    surge1Controls.set({ opacity: 0, scale: 0.5 })
    surge2Controls.set({ opacity: 0, scale: 0.5 })

    // Shake and breakthrough
    levelControls.start({
      scale: [1, 0.9, 0.9, 0.9, 1.5, 1],
      rotate: [0, -2, 2, -2, 0, 0],
      transition: {
        duration: 1,
        ease: [0.68, -0.55, 0.265, 1.55] as const,
        times: [0, 0.1, 0.2, 0.3, 0.5, 1],
      },
    })

    // First surge ring
    surge1Controls.start({
      opacity: [0, 1, 0],
      scale: [0.5, 1.5, 2],
      transition: { duration: 0.8, ease: easeOut, times: [0, 0.5, 1] },
    })

    // Second surge ring (staggered)
    scheduleTimeout(() => {
      surge2Controls.start({
        opacity: [0, 1, 0],
        scale: [0.5, 1.5, 2],
        transition: { duration: 0.8, ease: easeOut, times: [0, 0.5, 1] },
      })
    }, 100)

    // Level transition after breakthrough peaks
    scheduleTimeout(() => {
      setLevel(2)
      setShowGlow(true)
    }, 600)

    return () => {
      mountedRef.current = false
      timersRef.current.forEach(clearTimeout)
      timersRef.current = []
      levelControls.stop()
      surge1Controls.stop()
      surge2Controls.stop()
    }
  }, [levelControls, surge1Controls, surge2Controls])

  return (
    <div className="pf-breakthrough-container" data-animation-id="text-effects__level-breakthrough">
      <m.div
        className="pf-surge-lines"
        animate={surge1Controls}
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle, transparent 75%, var(--pf-anim-firework-gold) 76%, transparent 82%)',
          opacity: 0,
        }}
      />

      <m.div
        className="pf-surge-lines"
        animate={surge2Controls}
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle, transparent 65%, var(--pf-anim-firework-gold) 66%, transparent 72%)',
          opacity: 0,
        }}
      />

      <m.div
        className={`pf-level-breakthrough${showGlow ? ' pf-level-breakthrough--glow' : ''}`}
        animate={levelControls}
      >
        LEVEL {level}
      </m.div>
    </div>
  )
}

export const TextEffectsLevelBreakthrough = memo(TextEffectsLevelBreakthroughComponent)
