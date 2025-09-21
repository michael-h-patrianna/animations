import './modal-celebrations.css';

const confettiColors = ['#ff5981', '#c6ff77', '#47fff4', '#ffce1a', '#ecc3ff'];

// Utility function to generate random number between min and max
const randBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export function ModalCelebrationsConfettiPulse() {
  const pulses = Array.from({ length: 3 }, (_, i) => ({
    id: i,
    delay: i * 180,
    color: confettiColors[i % confettiColors.length],
    duration: 1400,
  }));

  const confettiParticles = Array.from({ length: 20 }, (_, i) => {
    const tx = randBetween(-120, 120);
    const ty = randBetween(-160, -60);
    const rot = randBetween(-220, 220);
    const delay = 450 + i * 20; // Start confetti after pulse rings begin
    const duration = 780;
    
    return {
      id: i,
      color: confettiColors[i % confettiColors.length],
      tx,
      ty,
      rot,
      delay,
      duration,
    };
  });

  return (
    <div className="pf-celebration">
      <div className="pf-celebration__layer">
        {/* Pulse effects */}
        {pulses.map((pulse) => (
          <span
            key={pulse.id}
            className="pf-celebration__pulse"
            style={{
              '--delay': `${pulse.delay}ms`,
              '--color': pulse.color,
              '--duration': `${pulse.duration}ms`,
              borderColor: pulse.color,
              animation: `celebration-pulse var(--duration) ease-out var(--delay) forwards`,
            } as React.CSSProperties}
          />
        ))}

        {/* Confetti particles */}
        {confettiParticles.map((particle) => (
          <span
            key={particle.id}
            className="pf-celebration__confetti"
            style={{
              left: '50%',
              top: '55%',
              '--tx': `${particle.tx}px`,
              '--ty': `${particle.ty}px`,
              '--rot': `${particle.rot}deg`,
              '--delay': `${particle.delay}ms`,
              '--duration': `${particle.duration}ms`,
              background: particle.color,
              animation: `celebration-confetti-burst var(--duration) ease-out var(--delay) forwards`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}