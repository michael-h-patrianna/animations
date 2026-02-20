import * as m from 'motion/react-m'
import { easeOut } from 'motion/react'
import { useMemo } from 'react'

const randBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

/**
 *
 */
export function ModalCelebrationsRewardSpotlight() {
  const beamConfigs = [
    {
      left: '16%',
      rotate: -30,
      width: '90px',
      height: '260px',
      gradient:
        'linear-gradient(180deg, rgba(198,255,119,0.05) 0%, rgba(198,255,119,0.82) 32%, rgba(198,255,119,0))',
      opacity: 0.9,
      swing: 14,
    },
    {
      left: '32%',
      rotate: -12,
      width: '100px',
      height: '280px',
      gradient:
        'linear-gradient(180deg, rgba(71,255,244,0.06) 0%, rgba(71,255,244,0.78) 42%, rgba(71,255,244,0))',
      opacity: 0.88,
      swing: 8,
    },
    {
      left: '50%',
      rotate: 0,
      width: '132px',
      height: '300px',
      gradient:
        'linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(198,255,119,0.9) 35%, rgba(71,255,244,0.75) 65%, rgba(255,255,255,0))',
      opacity: 0.96,
      swing: 0,
    },
    {
      left: '68%',
      rotate: 12,
      width: '100px',
      height: '280px',
      gradient:
        'linear-gradient(180deg, rgba(71,255,244,0.06) 0%, rgba(71,255,244,0.78) 42%, rgba(71,255,244,0))',
      opacity: 0.88,
      swing: -8,
    },
    {
      left: '84%',
      rotate: 30,
      width: '90px',
      height: '260px',
      gradient:
        'linear-gradient(180deg, rgba(198,255,119,0.05) 0%, rgba(198,255,119,0.82) 32%, rgba(198,255,119,0))',
      opacity: 0.86,
      swing: -14,
    },
  ]

  const riseSparkles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: randBetween(32, 68),
        top: randBetween(18, 52),
        delay: i * 0.09,
        size: randBetween(6, 11),
      })),
    []
  )

  const topSparkles = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i + 14,
        left: randBetween(36, 64),
        top: randBetween(8, 18),
        delay: 0.4 + i * 0.12,
        size: randBetween(8, 14),
      })),
    []
  )

  return (
    <div className="pf-celebration">
      <div className="pf-celebration__layer">
        {/* Stage */}
        <m.span
          className="pf-celebration__stage"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(198,255,119,0.28) 100%)',
          }}
          initial={{ scaleX: 0, scaleY: 0, opacity: 0 }}
          animate={{
            scaleX: [0, 1.1, 1],
            scaleY: [0, 1.1, 1],
            opacity: [0, 1, 1],
          }}
          transition={{
            duration: 1.8,
            ease: easeOut,
            times: [0, 0.5, 1],
          }}
        >
          <span className="pf-celebration__stage-inner" />
        </m.span>

        {/* Stage Glow */}
        <m.span
          className="pf-celebration__stage-glow pf-celebration__stage-glow--emerald"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.8, 0.6], scale: [0.5, 1.2, 1] }}
          transition={{ duration: 1.8, ease: easeOut, times: [0, 0.4, 1] }}
        />

        {/* Pulse effects */}
        {[
          { delay: 0, duration: 1.6, color: 'var(--pf-anim-green)' },
          { delay: 0.26, duration: 1.8, color: 'var(--pf-anim-firework-cyan)' },
        ].map((pulse, i) => (
          <m.span
            key={`pulse-${i}`}
            className="pf-celebration__pulse"
            style={{ borderColor: pulse.color }}
            initial={{ scale: 0.3, opacity: 0.8 }}
            animate={{ scale: [0.3, 2.5], opacity: [0.8, 0] }}
            transition={{
              duration: pulse.duration,
              delay: pulse.delay,
              ease: easeOut,
            }}
          />
        ))}

        {/* Beams */}
        {beamConfigs.map((config, index) => (
          <m.span
            key={`beam-${index}`}
            className="pf-celebration__beam"
            style={{
              left: config.left,
              width: config.width,
              height: config.height,
              background: config.gradient,
              transformOrigin: 'bottom center',
            }}
            initial={{
              rotate: config.rotate,
              opacity: 0,
              scaleY: 0,
            }}
            animate={{
              rotate: [config.rotate, config.rotate + config.swing, config.rotate],
              opacity: [0, config.opacity, config.opacity * 0.6],
              scaleY: [0, 1, 1],
            }}
            transition={{
              duration: 1.8,
              delay: index * 0.09,
              ease: easeOut,
              times: [0, 0.4, 1],
            }}
          />
        ))}

        {/* Rise Sparkles */}
        {riseSparkles.map((sparkle) => (
          <m.span
            key={sparkle.id}
            className="pf-celebration__sparkle"
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              background: 'var(--pf-white)',
              borderRadius: '50%',
            }}
            initial={{ y: 0, scale: 0, opacity: 0 }}
            animate={{
              y: [0, -30, -50],
              scale: [0, 1.2, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.2,
              delay: sparkle.delay,
              ease: easeOut,
              times: [0, 0.4, 1],
            }}
          />
        ))}

        {/* Top Sparkles */}
        {topSparkles.map((sparkle) => (
          <m.span
            key={sparkle.id}
            className="pf-celebration__sparkle"
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              background: 'var(--pf-anim-firework-cyan)',
              borderRadius: '50%',
            }}
            initial={{ y: 0, scale: 0, opacity: 0 }}
            animate={{
              y: [0, -30, -50],
              scale: [0, 1.2, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.2,
              delay: sparkle.delay,
              ease: easeOut,
              times: [0, 0.4, 1],
            }}
          />
        ))}
      </div>
    </div>
  )
}
