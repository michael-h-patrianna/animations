import coinImage from '@/assets/coin.png';
import './modal-celebrations.css';

// Utility function to generate random number between min and max
const randBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export function ModalCelebrationsCoinsArc() {
  const coins = Array.from({ length: 14 }, (_, i) => {
    const tx = randBetween(-120, 120);
    const ty = randBetween(-160, -60);
    const delay = i * 40;
    const duration = 900;
    
    return {
      id: i,
      tx,
      ty,
      delay,
      duration,
    };
  });

  return (
    <div className="pf-celebration">
      <div className="pf-celebration__layer">
        {coins.map((coin) => (
          <img
            key={coin.id}
            src={coinImage}
            alt="coin"
            className="pf-celebration__coin"
            style={{
              '--tx': `${coin.tx}px`,
              '--ty': `${coin.ty}px`,
              '--delay': `${coin.delay}ms`,
              '--duration': `${coin.duration}ms`,
              width: '24px',
              height: '24px',
              position: 'absolute',
              animation: `celebration-coin-arc var(--duration) ease-out var(--delay) forwards`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
