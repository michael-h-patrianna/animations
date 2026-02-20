
import * as m from 'motion/react-m'
import { animate, easeInOut, easeOut, useMotionValue, useTransform } from 'motion/react'
import { useEffect, memo } from 'react'

function TextEffectsComboCounterComponent() {
  const finalValue = 25
  const comboText = 'COMBO'

  // Milestones: [triggerValue, particleValue]
  const milestones = [
    { trigger: 1, value: 1 },
    { trigger: 6, value: 5 },
    { trigger: 15, value: 9 },
    { trigger: 25, value: 10 },
  ]

  // Motion value for the counter
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))

  // Start counting animation on mount
  useEffect(() => {
    const controls = animate(count, finalValue, {
      duration: 1.2,
      ease: [0.25, 0.1, 0.25, 1] as const, // Custom easing - slow start, accelerate, slow finish
      delay: 0.35,
    })
    return controls.stop
  }, [count, finalValue])

  return (
    <div className="combo-counter-container" data-animation-id="text-effects__combo-counter">
      {/* Main combo container */}
      <div className="combo-main-container">
        {/* Number counter with × */}
        <m.div
          className="combo-number-wrapper"
          initial={{ scale: 0, rotate: -180 }}
          animate={{
            scale: [0, 1.2, 0.95, 1],
            rotate: [180, 10, -5, 0],
          }}
          transition={{
            duration: 0.5,
            times: [0, 0.4, 0.7, 1],
            ease: [0.25, 0.46, 0.45, 0.94] as const,
          }}
        >
          <div className="combo-number-container">
            {/* Counting number with proper styling */}
            <m.div className="combo-current-number">
              <m.span
                className="combo-digit"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  duration: 0.2,
                  delay: 0.25,
                }}
                style={{
                  display: 'inline-block',
                  position: 'relative',
                }}
              >
                <m.span
                  animate={{
                    textShadow: [
                      '0 2px 4px rgba(0, 0, 0, 0.3)',
                      '0 2px 8px rgba(239, 68, 68, 0.4)',
                      '0 2px 4px rgba(0, 0, 0, 0.3)',
                    ],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 1.2,
                    delay: 0.35,
                    ease: easeInOut,
                  }}
                >
                  {rounded}
                </m.span>
              </m.span>
            </m.div>

            {/* Milestone particles emitting from the number */}
            {milestones.map((milestone, i) => {
              const angle = -90 + i * 30 - 45 // Spread upward in tighter arc
              const distance = 70 + i * 12
              const xOffset = Math.cos((angle * Math.PI) / 180) * distance
              const yOffset = Math.sin((angle * Math.PI) / 180) * distance

              // Calculate exact timing based on the easing curve
              // With our easing [0.25, 0.1, 0.25, 1], values accelerate in middle
              const triggerProgress = milestone.trigger / finalValue
              const adjustedDelay = triggerProgress * 0.8 // Slightly compress timing

              return (
                <m.div
                  key={i}
                  className="combo-milestone-particle"
                  data-value={milestone.value}
                  initial={{
                    opacity: 0,
                    x: 0,
                    y: 0,
                    scale: 0,
                  }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    x: xOffset,
                    y: yOffset,
                    scale: [0, 1.4, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.0,
                    delay: 0.35 + adjustedDelay,
                    ease: easeOut,
                  }}
                >
                  <span className="combo-milestone-particle__text">+{milestone.value}</span>
                  {milestone.value === 10 && (
                    <span aria-hidden="true" className="combo-milestone-particle__glow">
                      +{milestone.value}
                    </span>
                  )}
                </m.div>
              )
            })}
          </div>

          {/* Hit multiplier marker */}
          <m.div
            className="combo-hit-marker"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.3, 1],
              opacity: [0, 1, 0.9],
            }}
            transition={{
              duration: 0.3,
              delay: 0.15,
              ease: easeOut,
            }}
          >
            ×
          </m.div>
        </m.div>

        {/* Combo text with stagger animation */}
        <m.div
          className="combo-text-wrapper"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.2,
            delay: 0.1,
          }}
        >
          {comboText.split('').map((char, index) => (
            <m.span
              key={index}
              className="combo-text-char"
              initial={{
                opacity: 0,
                scale: 0,
                rotate: -180,
              }}
              animate={{
                opacity: 1,
                scale: [0, 1.2, 1],
                rotate: [180, -10, 0],
              }}
              transition={{
                duration: 0.4,
                delay: 0.2 + index * 0.04,
                ease: [0.25, 0.46, 0.45, 0.94] as const,
              }}
            >
              {char}
            </m.span>
          ))}
        </m.div>
      </div>

      {/* Perfect text */}
      <m.div
        className="combo-bonus"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: [0, 1, 1],
          scale: [0.5, 1.1, 1],
        }}
        transition={{
          duration: 0.4,
          delay: 1.6,
          times: [0, 0.6, 1],
          ease: easeOut,
        }}
      >
        PERFECT!
      </m.div>
    </div>
  )
}

/**
 * Memoized TextEffectsComboCounter to prevent unnecessary re-renders in grid layouts.
 */
export const TextEffectsComboCounter = memo(TextEffectsComboCounterComponent)

