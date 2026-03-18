import './ModalCelebrationsJackpotCelebration.css'

// Utility function to generate random number between min and max
const randBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

const fireworkColors = ['#ffce1a', '#ff5981', '#47fff4', '#c6ff77']
const coinGradients = [
  'linear-gradient(135deg, #ffd966 0%, #ffb300 100%)',
  'linear-gradient(135deg, #ffe066 0%, #f59e00 100%)',
]

export function ModalCelebrationsJackpotCelebration() {
  const beamConfigs = [
    {
      left: '18%',
      rotate: '-26deg',
      width: '90px',
      height: '270px',
      gradient:
        'linear-gradient(180deg, rgba(255,206,26,0.06) 0%, rgba(255,206,26,0.88) 38%, rgba(255,206,26,0))',
      opacity: 0.92,
      swing: '16deg',
      blur: '1.4px',
    },
    {
      left: '34%',
      rotate: '-10deg',
      width: '110px',
      height: '300px',
      gradient:
        'linear-gradient(180deg, rgba(255,216,133,0.08) 0%, rgba(255,184,56,0.88) 42%, rgba(255,184,56,0))',
      opacity: 0.9,
      swing: '10deg',
      blur: '1.1px',
    },
    {
      left: '50%',
      rotate: '0deg',
      width: '140px',
      height: '320px',
      gradient:
        'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,206,26,0.92) 38%, rgba(255,149,0,0.78) 58%, rgba(255,255,255,0))',
      opacity: 0.97,
      swing: '3deg',
      origin: 'bottom center',
      blur: '1px',
    },
    {
      left: '66%',
      rotate: '12deg',
      width: '110px',
      height: '300px',
      gradient:
        'linear-gradient(180deg, rgba(255,216,133,0.08) 0%, rgba(255,184,56,0.88) 42%, rgba(255,184,56,0))',
      opacity: 0.9,
      swing: '-10deg',
      blur: '1.1px',
    },
    {
      left: '82%',
      rotate: '28deg',
      width: '90px',
      height: '270px',
      gradient:
        'linear-gradient(180deg, rgba(255,206,26,0.06) 0%, rgba(255,206,26,0.88) 38%, rgba(255,206,26,0))',
      opacity: 0.92,
      swing: '-16deg',
      blur: '1.4px',
    },
  ]

  const firstWaveCoins = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    tx: randBetween(-130, 130),
    ty: randBetween(-220, -120),
    delay: i * 50,
    duration: 1150,
    gradient: coinGradients[i % coinGradients.length],
  }))

  const secondWaveCoins = Array.from({ length: 8 }, (_, i) => ({
    id: i + 12,
    tx: randBetween(-120, 120),
    ty: randBetween(-200, -140),
    delay: 300 + i * 60,
    duration: 1250,
    gradient: coinGradients[(i + 2) % coinGradients.length],
  }))

  const popSparkles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: randBetween(30, 70),
    top: randBetween(14, 54),
    delay: i * 70,
    size: randBetween(6, 12),
    color: 'rgba(255, 236, 179, 0.95)',
  }))

  return (
    <div className="pf-celebration">
      <div className="pf-celebration__layer">
        {/* Stage */}
        <span
          className="pf-celebration__stage"
          style={
            {
              '--stage-width': '180px',
              '--stage-height': '56px',
              '--stage-color': 'rgba(255, 206, 26, 0.52)',
              background:
                'radial-gradient(circle at 50% 28%, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0)), radial-gradient(circle at 50% 100%, rgba(255, 206, 26, 0.52), rgba(255, 206, 26, 0))',
              animation: 'celebration-stage-rise 2000ms ease-out forwards',
            } as React.CSSProperties
          }
        >
          <span className="pf-celebration__stage-inner" />
        </span>

        {/* Stage Glow */}
        <span
          className="pf-celebration__stage-glow pf-celebration__stage-glow--gold"
          style={
            {
              '--duration': '2000ms',
              animation: 'celebration-stage-glow var(--duration) ease-out forwards',
            } as React.CSSProperties
          }
        />

        {/* Pulse effects */}
        <span
          className="pf-celebration__pulse"
          style={
            {
              '--delay': '0ms',
              '--duration': '1700ms',
              borderColor: 'rgba(255,206,26,0.6)',
              animation: 'celebration-pulse var(--duration) ease-out var(--delay) forwards',
            } as React.CSSProperties
          }
        />
        <span
          className="pf-celebration__pulse"
          style={
            {
              '--delay': '220ms',
              '--duration': '1900ms',
              borderColor: 'rgba(255,143,69,0.5)',
              animation: 'celebration-pulse var(--duration) ease-out var(--delay) forwards',
            } as React.CSSProperties
          }
        />
        <span
          className="pf-celebration__pulse"
          style={
            {
              '--delay': '520ms',
              '--duration': '2100ms',
              borderColor: 'rgba(255,255,255,0.45)',
              animation: 'celebration-pulse var(--duration) ease-out var(--delay) forwards',
            } as React.CSSProperties
          }
        />

        {/* Jackpot Glow */}
        <span
          className="pf-celebration__glow"
          style={
            {
              animation: 'celebration-jackpot-glow 2000ms ease-in-out infinite',
            } as React.CSSProperties
          }
        />

        {/* Fireworks */}
        {fireworkColors.map((color, index) => (
          <span
            key={`firework-${index}`}
            className="pf-celebration__firework"
            style={
              {
                '--size': `${24 + index * 10}px`,
                '--scale': `${1.8 + index * 0.5}`,
                '--delay': `${index * 140}ms`,
                '--color': color,
                borderColor: color,
                animation: `celebration-firework-pop 2000ms ease-out var(--delay) forwards`,
              } as React.CSSProperties
            }
          />
        ))}

        {/* Firework Rings */}
        <span
          className="pf-celebration__ring"
          style={
            {
              '--scale': '3.4',
              '--delay': '60ms',
              animation: `celebration-firework-ring 2000ms ease-out var(--delay) forwards`,
            } as React.CSSProperties
          }
        />
        <span
          className="pf-celebration__ring"
          style={
            {
              '--scale': '2.4',
              '--delay': '200ms',
              animation: `celebration-firework-ring 2000ms ease-out var(--delay) forwards`,
            } as React.CSSProperties
          }
        />

        {/* Beams */}
        {beamConfigs.map((config, index) => (
          <span
            key={`beam-${index}`}
            className="pf-celebration__beam"
            style={
              {
                left: config.left,
                '--rotate': config.rotate,
                '--swing': config.swing,
                '--beam-opacity': config.opacity,
                '--delay': `${index * 80}ms`,
                width: config.width,
                height: config.height,
                background: config.gradient,
                filter: `blur(${config.blur})`,
                transformOrigin: config.origin || 'bottom center',
                animation: `celebration-spotlight 2000ms ease-out var(--delay) forwards`,
              } as React.CSSProperties
            }
          />
        ))}

        {/* First Wave Coins */}
        {firstWaveCoins.map((coin) => (
          <span
            key={`coin1-${coin.id}`}
            className="pf-celebration__coin"
            style={
              {
                '--tx': `${coin.tx}px`,
                '--ty': `${coin.ty}px`,
                '--delay': `${coin.delay}ms`,
                '--duration': `${coin.duration}ms`,
                '--coin-color': coin.gradient,
                animation: `celebration-coin-fountain var(--duration) ease-out var(--delay) forwards`,
              } as React.CSSProperties
            }
          />
        ))}

        {/* Second Wave Coins */}
        {secondWaveCoins.map((coin) => (
          <span
            key={`coin2-${coin.id}`}
            className="pf-celebration__coin"
            style={
              {
                '--tx': `${coin.tx}px`,
                '--ty': `${coin.ty}px`,
                '--delay': `${coin.delay}ms`,
                '--duration': `${coin.duration}ms`,
                '--coin-color': coin.gradient,
                animation: `celebration-coin-fountain var(--duration) ease-out var(--delay) forwards`,
              } as React.CSSProperties
            }
          />
        ))}

        {/* Pop Sparkles */}
        {popSparkles.map((sparkle) => (
          <span
            key={sparkle.id}
            className="pf-celebration__sparkle"
            style={
              {
                left: `${sparkle.left}%`,
                top: `${sparkle.top}%`,
                '--delay': `${sparkle.delay}ms`,
                '--size': `${sparkle.size}px`,
                '--sparkle-color': sparkle.color,
                background: `radial-gradient(circle, ${sparkle.color} 0%, rgba(255, 255, 255, 0))`,
                animation: `celebration-sparkle-pop 1200ms ease-out var(--delay) forwards`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  )
}
