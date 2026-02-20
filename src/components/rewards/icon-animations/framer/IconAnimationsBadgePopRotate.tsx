import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'

/**
 *
 */
export function IconAnimationsBadgePopRotate() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
        position: 'relative',
      }}
    >
      {/* Glow layer */}
      {!shouldReduceMotion && (
        <m.div
          style={{
            position: 'absolute',
            width: 120,
            height: 120,
            // eslint-disable-next-line animation-rules/no-radial-angular-gradient -- radial effect required for visual design
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, transparent 70%)',
            borderRadius: '50%',
            zIndex: 0,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.8, 1.3, 1.5],
          }}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
            times: [0, 0.5, 1],
          }}
        />
      )}

      {/* Badge icon */}
      <m.div
        role="img"
        aria-label="Achievement unlocked"
        style={{
          position: 'relative',
          zIndex: 1,
          fontSize: 80,
          lineHeight: 1,
        }}
        animate={
          shouldReduceMotion
            ? { scale: 1, rotate: 0 }
            : {
                scale: [0, 0.9, 1.2, 0.95, 1.02, 1],
                rotate: [0, 0, 12, -4, 1, 0],
              }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
                duration: 0.6,
                ease: [0.68, -0.55, 0.265, 1.55],
                times: [0, 0.15, 0.5, 0.7, 0.85, 1],
              }
        }
      >
        🏆
      </m.div>
    </div>
  )
}
