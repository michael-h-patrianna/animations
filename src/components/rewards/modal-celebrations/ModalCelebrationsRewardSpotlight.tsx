import './ModalCelebrationsRewardSpotlight.css'

// Utility function to generate random number between min and max
const randBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

export function ModalCelebrationsRewardSpotlight() {
  const beamConfigs = [
    {
      left: '16%',
      rotate: '-30deg',
      width: '90px',
      height: '260px',
      gradient:
        'linear-gradient(180deg, rgba(198,255,119,0.05) 0%, rgba(198,255,119,0.82) 32%, rgba(198,255,119,0))',
      opacity: 0.9,
      swing: '14deg',
      blur: '1.2px',
    },
    {
      left: '32%',
      rotate: '-12deg',
      width: '100px',
      height: '280px',
      gradient:
        'linear-gradient(180deg, rgba(71,255,244,0.06) 0%, rgba(71,255,244,0.78) 42%, rgba(71,255,244,0))',
      opacity: 0.88,
      swing: '8deg',
      blur: '1px',
    },
    {
      left: '50%',
      rotate: '0deg',
      width: '132px',
      height: '300px',
      gradient:
        'linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(198,255,119,0.9) 35%, rgba(71,255,244,0.75) 65%, rgba(255,255,255,0))',
      opacity: 0.96,
      swing: '0deg',
      origin: 'bottom center',
      blur: '0.8px',
    },
    {
      left: '68%',
      rotate: '12deg',
      width: '100px',
      height: '280px',
      gradient:
        'linear-gradient(180deg, rgba(71,255,244,0.06) 0%, rgba(71,255,244,0.78) 42%, rgba(71,255,244,0))',
      opacity: 0.88,
      swing: '-8deg',
      blur: '1px',
    },
    {
      left: '84%',
      rotate: '30deg',
      width: '90px',
      height: '260px',
      gradient:
        'linear-gradient(180deg, rgba(198,255,119,0.05) 0%, rgba(198,255,119,0.82) 32%, rgba(198,255,119,0))',
      opacity: 0.86,
      swing: '-14deg',
      blur: '1.2px',
    },
  ]

  const riseSparkles = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: randBetween(32, 68),
    top: randBetween(18, 52),
    delay: i * 90,
    size: randBetween(6, 11),
    color: 'rgba(255, 255, 255, 0.95)',
  }))

  const topSparkles = Array.from({ length: 6 }, (_, i) => ({
    id: i + 14,
    left: randBetween(36, 64),
    top: randBetween(8, 18),
    delay: 400 + i * 120,
    size: randBetween(8, 14),
    color: 'rgba(198, 255, 249, 0.95)',
  }))

  return (
    <div className="pf-celebration">
      <div className="pf-celebration__layer">
        {/* Stage */}
        <span
          className="pf-celebration__stage"
          style={
            {
              '--stage-width': '152px',
              '--stage-height': '48px',
              '--stage-color': 'rgba(198, 255, 119, 0.36)',
              background:
                'radial-gradient(circle at 50% 28%, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0)), radial-gradient(circle at 50% 100%, rgba(198, 255, 119, 0.28), rgba(198, 255, 119, 0))',
              animation: 'celebration-stage-rise 1800ms ease-out forwards',
            } as React.CSSProperties
          }
        >
          <span className="pf-celebration__stage-inner" />
        </span>

        {/* Stage Glow */}
        <span
          className="pf-celebration__stage-glow pf-celebration__stage-glow--emerald"
          style={
            {
              '--duration': '1800ms',
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
              '--color': 'rgba(198,255,119,0.55)',
              '--duration': '1600ms',
              borderColor: 'rgba(198,255,119,0.55)',
              animation: 'celebration-pulse var(--duration) ease-out var(--delay) forwards',
            } as React.CSSProperties
          }
        />
        <span
          className="pf-celebration__pulse"
          style={
            {
              '--delay': '260ms',
              '--color': 'rgba(71,255,244,0.45)',
              '--duration': '1800ms',
              borderColor: 'rgba(71,255,244,0.45)',
              animation: 'celebration-pulse var(--duration) ease-out var(--delay) forwards',
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
                '--delay': `${index * 90}ms`,
                width: config.width,
                height: config.height,
                background: config.gradient,
                filter: `blur(${config.blur})`,
                transformOrigin: config.origin || 'bottom center',
                animation: `celebration-spotlight 1800ms ease-out var(--delay) forwards`,
              } as React.CSSProperties
            }
          />
        ))}

        {/* Rise Sparkles */}
        {riseSparkles.map((sparkle) => (
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
                animation: `celebration-sparkle-rise 1200ms ease-out var(--delay) forwards`,
              } as React.CSSProperties
            }
          />
        ))}

        {/* Top Sparkles */}
        {topSparkles.map((sparkle) => (
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
                animation: `celebration-sparkle-rise 1200ms ease-out var(--delay) forwards`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  )
}
