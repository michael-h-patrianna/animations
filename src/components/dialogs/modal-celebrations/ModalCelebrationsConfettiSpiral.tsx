import './modal-celebrations.css';

const confettiColors = ['#ff5981', '#c6ff77', '#47fff4', '#ffce1a', '#ecc3ff'];

// Utility function to generate random number between min and max
const randBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export function ModalCelebrationsConfettiSpiral() {
  const particles = Array.from({ length: 26 }, (_, i) => {
    const angle = randBetween(0, 360);
    const spin = randBetween(360, 540);
    const radius = randBetween(90, 140);
    const delay = i * 18;
    const duration = 1000;
    
    return {
      id: i,
      color: confettiColors[i % confettiColors.length],
      angle,
      spin,
      radius,
      delay,
      duration,
    };
  });

  return (
    <div className="pf-celebration">
      <div className="pf-celebration__layer">
        {particles.map((particle) => (
          <span
            key={particle.id}
            className="pf-celebration__confetti"
            style={{
              left: '50%',
              top: '50%',
              '--angle': `${particle.angle}deg`,
              '--spin': `${particle.spin}deg`,
              '--radius': `${particle.radius}px`,
              '--delay': `${particle.delay}ms`,
              '--duration': `${particle.duration}ms`,
              background: particle.color,
              animation: `celebration-confetti-spiral var(--duration) ease-out var(--delay) forwards`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
