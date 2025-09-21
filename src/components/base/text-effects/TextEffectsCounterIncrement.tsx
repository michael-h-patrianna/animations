import { useEffect, useState, useRef } from 'react';
import './text-effects.css';
import diamondPng from '@/assets/Diamonds.png';

interface CounterIndicator {
  id: number;
  isAnimating: boolean;
}

export function TextEffectsCounterIncrement() {
  const [isDiamondAnimating, setIsDiamondAnimating] = useState(false);
  const [counters, setCounters] = useState<CounterIndicator[]>([]);
  const nextCounterIdRef = useRef(0);

  useEffect(() => {
    const animationCycle = () => {
      // Trigger diamond animation
      setIsDiamondAnimating(true);
      
      // Add a new counter with current id
      const currentId = nextCounterIdRef.current;
      setCounters([{ id: currentId, isAnimating: true }]);
      nextCounterIdRef.current += 1;

      // Reset diamond animation after 500ms
      setTimeout(() => {
        setIsDiamondAnimating(false);
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
      <div className="pf-counter-showcase__target">
        <img 
          src={diamondPng} 
          alt="Diamond" 
          className="pf-counter-showcase__diamond"
          style={{
            animation: isDiamondAnimating 
              ? 'pf-diamond-pickup 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
              : 'none'
          }}
        />
        
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
        
        /* Diamond pickup animation already defined in CSS */
        @keyframes pf-diamond-pickup {
          0% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
          25% {
            transform: scale(1.25) rotate(8deg);
            opacity: 1;
          }
          50% {
            transform: scale(1.05) rotate(-3deg);
            opacity: 0.9;
          }
          75% {
            transform: scale(1.15) rotate(2deg);
            opacity: 0.95;
          }
          100% {
            transform: scale(1.1) rotate(0deg);
            opacity: 0.85;
          }
        }
      `}</style>
    </div>
  );
}