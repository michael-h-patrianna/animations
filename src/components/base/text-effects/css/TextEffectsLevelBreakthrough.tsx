import { useEffect, useRef } from 'react'
import type { AnimationMetadata } from '@/types/animation'
import './TextEffectsLevelBreakthrough.css'

export function TextEffectsLevelBreakthrough() {
  const levelRef = useRef<HTMLDivElement>(null)
  const surge1Ref = useRef<HTMLDivElement>(null)
  const surge2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const level = levelRef.current
    const surge1 = surge1Ref.current
    const surge2 = surge2Ref.current

    if (!level || !surge1 || !surge2) return

    // Reset initial state
    level.textContent = 'LEVEL 1'
    level.style.textShadow = ''

    // Level shake and breakthrough animation
    const levelAnimation = level.animate(
      [
        { transform: 'scale(1) rotate(0deg)' },
        { transform: 'scale(0.9) rotate(-2deg)' },
        { transform: 'scale(0.9) rotate(2deg)' },
        { transform: 'scale(0.9) rotate(-2deg)' },
        { transform: 'scale(1.5) rotate(0deg)' },
        { transform: 'scale(1) rotate(0deg)' },
      ],
      {
        duration: 1000,
        easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        fill: 'forwards',
      }
    )

    // First surge ring animation
    const surge1Animation = surge1.animate(
      [
        { opacity: 0, transform: 'scale(0.5)' },
        { opacity: 1, transform: 'scale(1.5)' },
        { opacity: 0, transform: 'scale(2)' },
      ],
      {
        duration: 800,
        easing: 'ease-out',
        fill: 'forwards',
      }
    )

    // Second surge ring animation with slight delay
    const surge2Animation = surge2.animate(
      [
        { opacity: 0, transform: 'scale(0.5)' },
        { opacity: 1, transform: 'scale(1.5)' },
        { opacity: 0, transform: 'scale(2)' },
      ],
      {
        duration: 800,
        delay: 100,
        easing: 'ease-out',
        fill: 'forwards',
      }
    )

    // Change level text and add glow after breakthrough peaks
    const changeTextTimer = setTimeout(() => {
      if (level) {
        level.textContent = 'LEVEL 2'
        level.style.textShadow = '0 0 30px rgba(255, 206, 26, 0.8)'
      }
    }, 600)

    return () => {
      clearTimeout(changeTextTimer)
      levelAnimation.cancel()
      surge1Animation.cancel()
      surge2Animation.cancel()
    }
  }, [])

  return (
    <div className="pf-breakthrough-container" data-animation-id="text-effects__level-breakthrough">
      {/* First surge ring - outer ring with 4-6px thick bands */}
      <div
        ref={surge1Ref}
        className="pf-surge-lines pf-surge-lines-outer"
        style={{ opacity: 0 }}
      />

      {/* Second surge ring - inner ring with 4-6px thick bands */}
      <div
        ref={surge2Ref}
        className="pf-surge-lines pf-surge-lines-inner"
        style={{ opacity: 0 }}
      />

      {/* Level display */}
      <div ref={levelRef} className="pf-level-breakthrough">
        LEVEL 1
      </div>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'text-effects__level-breakthrough',
  title: 'Level Breakthrough',
  description: 'Level breakthrough shakes frame with surge lines explosion effect.',
  tags: ['css'],
  disableReplay: false
}
