import coinImage from '@/assets/coin.png'
import './ModalCelebrationsCoinsSwirl.css'

// Utility function to generate random number between min and max
const randBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

export function ModalCelebrationsCoinsSwirl() {
  const coins = Array.from({ length: 10 }, (_, i) => {
    const startAngle = randBetween(0, 360)
    const spin = randBetween(240, 360)
    const radius = randBetween(60, 110)
    const delay = i * 70
    const duration = 1200

    return {
      id: i,
      startAngle,
      spin,
      radius,
      delay,
      duration,
    }
  })

  return (
    <div className="pf-celebration">
      <div className="pf-celebration__layer">
        {coins.map((coin) => (
          <img
            key={coin.id}
            src={coinImage}
            alt="coin"
            className="pf-celebration__coin"
            style={
              {
                '--start-angle': `${coin.startAngle}deg`,
                '--spin': `${coin.spin}deg`,
                '--radius': `${coin.radius}px`,
                '--delay': `${coin.delay}ms`,
                '--duration': `${coin.duration}ms`,
                width: '24px',
                height: '24px',
                position: 'absolute',
                animation: `celebration-coin-swirl var(--duration) ease-out var(--delay) forwards`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  )
}
