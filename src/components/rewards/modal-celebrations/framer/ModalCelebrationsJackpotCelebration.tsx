import * as m from 'motion/react-m'
import { easeOut } from 'motion/react'
import { useMemo } from 'react'

const randBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

const fireworkColors = ['var(--pf-anim-firework-gold)', 'var(--pf-anim-firework-pink)', 'var(--pf-anim-firework-cyan)', 'var(--pf-anim-green)']
const coinGradients = [
  'linear-gradient(135deg, #ffd966 0%, #ffb300 100%)',
  'linear-gradient(135deg, #ffe066 0%, #f59e00 100%)',
]

/**
 *
 */
export function ModalCelebrationsJackpotCelebration() {
  const beamConfigs = [
    {
      left: '18%',
      rotate: -26,
      width: '90px',
      height: '270px',
      gradient:
        'linear-gradient(180deg, rgba(255,206,26,0.06) 0%, rgba(255,206,26,0.88) 38%, rgba(255,206,26,0))',
      opacity: 0.92,
      swing: 16,
    },
    {
      left: '34%',
      rotate: -10,
      width: '110px',
      height: '300px',
      gradient:
        'linear-gradient(180deg, rgba(255,216,133,0.08) 0%, rgba(255,184,56,0.88) 42%, rgba(255,184,56,0))',
      opacity: 0.9,
      swing: 10,
    },
    {
      left: '50%',
      rotate: 0,
      width: '140px',
      height: '320px',
      gradient:
        'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,206,26,0.92) 38%, rgba(255,149,0,0.78) 58%, rgba(255,255,255,0))',
      opacity: 0.97,
      swing: 3,
    },
    {
      left: '66%',
      rotate: 12,
      width: '110px',
      height: '300px',
      gradient:
        'linear-gradient(180deg, rgba(255,216,133,0.08) 0%, rgba(255,184,56,0.88) 42%, rgba(255,184,56,0))',
      opacity: 0.9,
      swing: -10,
    },
    {
      left: '82%',
      rotate: 28,
      width: '90px',
      height: '270px',
      gradient:
        'linear-gradient(180deg, rgba(255,206,26,0.06) 0%, rgba(255,206,26,0.88) 38%, rgba(255,206,26,0))',
      opacity: 0.92,
      swing: -16,
    },
  ]

  const firstWaveCoins = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        tx: randBetween(-130, 130),
        ty: randBetween(-220, -120),
        delay: i * 0.05,
        duration: 1.15,
        gradient: coinGradients[i % coinGradients.length],
      })),
    []
  )

  const secondWaveCoins = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i + 12,
        tx: randBetween(-120, 120),
        ty: randBetween(-200, -140),
        delay: 0.3 + i * 0.06,
        duration: 1.25,
        gradient: coinGradients[(i + 2) % coinGradients.length],
      })),
    []
  )

  const popSparkles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: randBetween(30, 70),
        top: randBetween(14, 54),
        delay: i * 0.07,
        size: randBetween(6, 12),
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
              'linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(255,206,26,0.52) 100%)',
          }}
          initial={{ scaleX: 0, scaleY: 0, opacity: 0 }}
          animate={{
            scaleX: [0, 1.1, 1],
            scaleY: [0, 1.1, 1],
            opacity: [0, 1, 1],
          }}
          transition={{
            duration: 2.0,
            ease: easeOut,
            times: [0, 0.5, 1],
          }}
        >
          <span className="pf-celebration__stage-inner" />
        </m.span>

        {/* Stage Glow */}
        <m.span
          className="pf-celebration__stage-glow pf-celebration__stage-glow--gold"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.8, 0.6], scale: [0.5, 1.2, 1] }}
          transition={{ duration: 2.0, ease: easeOut, times: [0, 0.4, 1] }}
        />

        {/* Pulse effects */}
        {[
          { delay: 0, duration: 1.7, color: 'var(--pf-anim-firework-gold)' },
          { delay: 0.22, duration: 1.9, color: 'var(--pf-anim-orange)' },
          { delay: 0.52, duration: 2.1, color: 'var(--pf-anim-white-45)' },
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

        {/* Jackpot Glow */}
        <m.span
          className="pf-celebration__glow"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 0.9, 0.3] }}
          transition={{
            duration: 2.0,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        />

        {/* Fireworks */}
        {fireworkColors.map((color, index) => (
          <m.span
            key={`firework-${index}`}
            className="pf-celebration__firework"
            style={{ borderColor: color }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: [0, 1.8 + index * 0.5],
              opacity: [1, 0],
            }}
            transition={{
              duration: 2.0,
              delay: index * 0.14,
              ease: easeOut,
            }}
          />
        ))}

        {/* Firework Rings */}
        {[
          { scale: 3.4, delay: 0.06 },
          { scale: 2.4, delay: 0.2 },
        ].map((ring, i) => (
          <m.span
            key={`ring-${i}`}
            className="pf-celebration__ring"
            initial={{ scale: 0, opacity: 0.7 }}
            animate={{ scale: [0, ring.scale], opacity: [0.7, 0] }}
            transition={{
              duration: 2.0,
              delay: ring.delay,
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
              duration: 2.0,
              delay: index * 0.08,
              ease: easeOut,
              times: [0, 0.4, 1],
            }}
          />
        ))}

        {/* First Wave Coins */}
        {firstWaveCoins.map((coin) => (
          <m.span
            key={`coin1-${coin.id}`}
            className="pf-celebration__coin"
            style={{ background: coin.gradient }}
            initial={{ x: 0, y: 0, scale: 0.4, opacity: 0 }}
            animate={{
              x: [0, coin.tx * 0.6, coin.tx],
              y: [0, coin.ty * 0.8, coin.ty],
              scale: [0.4, 1.1, 0.6],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: coin.duration,
              delay: coin.delay,
              ease: easeOut,
              times: [0, 0.5, 1],
            }}
          />
        ))}

        {/* Second Wave Coins */}
        {secondWaveCoins.map((coin) => (
          <m.span
            key={`coin2-${coin.id}`}
            className="pf-celebration__coin"
            style={{ background: coin.gradient }}
            initial={{ x: 0, y: 0, scale: 0.4, opacity: 0 }}
            animate={{
              x: [0, coin.tx * 0.6, coin.tx],
              y: [0, coin.ty * 0.8, coin.ty],
              scale: [0.4, 1.1, 0.6],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: coin.duration,
              delay: coin.delay,
              ease: easeOut,
              times: [0, 0.5, 1],
            }}
          />
        ))}

        {/* Pop Sparkles */}
        {popSparkles.map((sparkle) => (
          <m.span
            key={sparkle.id}
            className="pf-celebration__sparkle"
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              background: 'var(--pf-anim-firework-gold)',
              borderRadius: '50%',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.2,
              delay: sparkle.delay,
              ease: easeOut,
            }}
          />
        ))}
      </div>
    </div>
  )
}
