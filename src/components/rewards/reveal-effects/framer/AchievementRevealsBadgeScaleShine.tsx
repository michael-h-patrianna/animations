import * as m from 'motion/react-m'

/**
 *
 */
export function AchievementRevealsBadgeScaleShine() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        position: 'relative',
      }}
      data-animation-id="achievement-reveals__badge-scale-shine"
      role="status"
      aria-live="polite"
      aria-label="Achievement unlocked: Level 10 Badge"
    >
      <m.div
        style={{
          position: 'relative',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          // eslint-disable-next-line animation-rules/no-radial-angular-gradient -- radial effect required for visual design
          background: 'radial-gradient(circle at 30% 30%, #ffd700, #ffaa00)',
          border: '3px solid rgba(255, 215, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
        initial={{ scale: 0.8, rotate: -5, opacity: 0 }}
        animate={{
          scale: [0.8, 1.0, 1.2, 1.0],
          rotate: [-5, 0, 2, 0],
          opacity: [0, 1, 1, 1],
        }}
        transition={{
          duration: 0.8,
          times: [0, 0.125, 0.375, 1],
          ease: [0.34, 1.56, 0.64, 1],
        }}
      >
        <div
          style={{
            fontSize: '48px',
            lineHeight: 1,
            position: 'relative',
            zIndex: 1,
          }}
        >
          🏆
        </div>
        <m.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '50%',
            height: '100%',
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
          initial={{ x: '-150%', opacity: 0 }}
          animate={{
            x: ['-150%', '-100%', '150%'],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 0.4,
            delay: 0.4,
            times: [0, 0.1, 1],
            ease: 'linear',
          }}
        />
      </m.div>
    </div>
  )
}
