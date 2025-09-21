import { useEffect, useState, useRef } from 'react';
import './text-effects.css';

interface CounterIndicator {
  id: number;
  isAnimating: boolean;
}

export function TextEffectsCounterIncrement() {
  const [isValueAnimating, setIsValueAnimating] = useState(false);
  const [count, setCount] = useState(0);
  const [counters, setCounters] = useState<CounterIndicator[]>([]);
  const nextCounterIdRef = useRef(0);

  useEffect(() => {
    const animationCycle = () => {
      // Trigger number pop animation
      setIsValueAnimating(true);
      
      // Add a new counter with current id
      const currentId = nextCounterIdRef.current;
      setCounters([{ id: currentId, isAnimating: true }]);
      nextCounterIdRef.current += 1;

      // Increment the displayed count
      setCount((c) => c + 1);

      // Reset number pop animation after 500ms
      setTimeout(() => {
        setIsValueAnimating(false);
      }, 500);

      // Remove counter after animation completes
      setTimeout(() => {
        setCounters([]);
      }, 800);
    };

    // Start first animation
    animationCycle();

    // Set up repeating animation
    const intervalId = setInterval(animationCycle, 2000);

    return () => {
      clearInterval(intervalId);
      setCounters([]);
    };
  }, []);

  return (
    <div className="pf-counter-showcase" data-animation-id="text-effects__counter-increment">
      <div className="pf-counter-showcase__target" style={{ width: 'auto', height: 40 }}>
        <span
          className="pf-counter-showcase__value"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 40,
            padding: '0 6px',
            animation: isValueAnimating
              ? 'pf-number-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
              : 'none',
          }}
        >
          {count}
        </span>
        
        {/* Render counter indicators */}
        {counters.map(counter => (
          <span
            key={counter.id}
            className="pf-update-indicator__counter"
            style={{
              position: 'absolute',
              right: '-8px',
              top: '-8px',
              color: '#c6ff77',
              fontWeight: 600,
              fontSize: '0.875rem',
              pointerEvents: 'none',
              animation: counter.isAnimating
                ? 'counter-float-up 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                : 'none'
            }}
          >
            +1
          </span>
        ))}
      </div>
      
      <style>{`
        @keyframes counter-float-up {
          0% {
            transform: translateY(8px);
            opacity: 0;
          }
          20% {
            transform: translateY(-4px);
            opacity: 1;
          }
          50% {
            transform: translateY(-12px);
            opacity: 1;
          }
          100% {
            transform: translateY(-16px);
            opacity: 0;
          }
        }

        /* Number pop animation */
        @keyframes pf-number-pop {
          0% {
            transform: scale(1) rotate(0deg);
            filter: drop-shadow(0 0 0 rgba(255, 215, 0, 0));
          }
          25% {
            transform: scale(1.2) rotate(2deg);
            filter: drop-shadow(0 3px 8px rgba(255, 215, 0, 0.6));
          }
          50% {
            transform: scale(0.98) rotate(-2deg);
            filter: drop-shadow(0 2px 5px rgba(255, 215, 0, 0.4));
          }
          75% {
            transform: scale(1.08) rotate(1deg);
            filter: drop-shadow(0 2px 6px rgba(255, 215, 0, 0.5));
          }
          100% {
            transform: scale(1) rotate(0deg);
            filter: drop-shadow(0 0 0 rgba(255, 215, 0, 0));
          }
        }

        /* Professional, game-like number styling */
        .pf-counter-showcase__value {
          position: relative;
          font-size: 28px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: 1px;
          background: linear-gradient(
            180deg,
            #FFFFFF 0%,
            #FFF8DC 12%,
            #FFD700 38%,
            #FFA500 68%,
            #FF8C00 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 2px 0 rgba(0, 0, 0, 0.25), 0 0 8px rgba(255, 215, 0, 0.35);
          transform-origin: center bottom;
        }

        .pf-counter-showcase__value::after {
          content: '';
          position: absolute;
          inset: -6px;
          background: radial-gradient(circle, rgba(255, 215, 0, 0.22), transparent 60%);
          border-radius: 50%;
          z-index: -1;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}