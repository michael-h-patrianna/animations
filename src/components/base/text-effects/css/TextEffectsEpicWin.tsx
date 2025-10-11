import { useEffect, useRef } from 'react'
import type { AnimationMetadata } from '@/types/animation'
import './TextEffectsEpicWin.css'

export function TextEffectsEpicWin() {
  const mainText = 'EPIC WIN'

  const shadowFarRef = useRef<HTMLDivElement>(null)
  const shadowMidRef = useRef<HTMLDivElement>(null)
  const mainTextRef = useRef<HTMLDivElement>(null)
  const charsRef = useRef<HTMLSpanElement[]>([])
  const glowsRef = useRef<HTMLSpanElement[]>([])

  useEffect(() => {
    // Far shadow animation
    if (shadowFarRef.current) {
      shadowFarRef.current.animate(
        [
          { opacity: 0, transform: 'scale(1.2) translateY(10px)' },
          { opacity: 0.2, transform: 'scale(1) translateY(6px)' },
        ],
        {
          duration: 500,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          fill: 'forwards',
        }
      )
    }

    // Mid shadow animation
    if (shadowMidRef.current) {
      shadowMidRef.current.animate(
        [
          { opacity: 0, transform: 'scale(1.1) translateY(5px)' },
          { opacity: 0.3, transform: 'scale(1) translateY(3px)' },
        ],
        {
          duration: 450,
          delay: 50,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          fill: 'forwards',
        }
      )
    }

    // Main text container fade
    if (mainTextRef.current) {
      mainTextRef.current.animate(
        [
          { opacity: 0 },
          { opacity: 1 },
        ],
        {
          duration: 200,
          fill: 'forwards',
        }
      )
    }

    // Character animations
    charsRef.current.forEach((char, index) => {
      if (!char) return
      char.animate(
        [
          { opacity: 0, transform: 'translateY(30px) scale(0.5) rotateY(-90deg)' },
          { opacity: 1, transform: 'translateY(0) scale(1) rotateY(0deg)' },
        ],
        {
          duration: 600,
          delay: 100 + index * 40,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          fill: 'forwards',
        }
      )
    })

    // Character glow bursts
    glowsRef.current.forEach((glow, index) => {
      if (!glow) return
      glow.animate(
        [
          { opacity: 0, transform: 'scale(0.8)' },
          { opacity: 1, transform: 'scale(1.4)' },
          { opacity: 0.3, transform: 'scale(1)' },
        ],
        {
          duration: 600,
          delay: 500 + index * 40,
          easing: 'ease-out',
          fill: 'forwards',
        }
      )
    })
  }, [])

  return (
    <div className="epic-win-container" data-animation-id="text-effects__epic-win">
      <div className="epic-text-container">
        {/* Multiple shadow layers for premium depth */}
        <div ref={shadowFarRef} className="epic-shadow-far" style={{ opacity: 0 }}>
          {mainText}
        </div>

        <div ref={shadowMidRef} className="epic-shadow-mid" style={{ opacity: 0 }}>
          {mainText}
        </div>

        {/* Main metallic text */}
        <div ref={mainTextRef} className="epic-main-text" style={{ opacity: 0 }}>
          {mainText.split('').map((char, index) => (
            <span
              key={index}
              ref={(el) => {
                if (el) charsRef.current[index] = el
              }}
              className="epic-char"
              style={{ opacity: 0 }}
            >
              <span className="epic-char-inner">
                {char === ' ' ? '\u00A0' : char}

                {/* Individual character glow burst on arrival */}
                <span
                  ref={(el) => {
                    if (el) glowsRef.current[index] = el
                  }}
                  className="epic-char-glow"
                  style={{ opacity: 0 }}
                />
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'text-effects__epic-win',
  title: 'Epic Win',
  description: 'Metallic 3D text with rotating entrance, layered shadows, and victory flare effect.',
  tags: ['css'],
  disableReplay: false
}
