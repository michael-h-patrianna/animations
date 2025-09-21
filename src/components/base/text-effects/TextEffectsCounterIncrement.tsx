import { useEffect, useRef, useState } from 'react';
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
      <div className="pf-counter-showcase__target">
        <span className={`pf-counter-showcase__value ${isValueAnimating ? 'pf-counter-showcase__value--popping' : ''}`}>
          {count}
        </span>

        {/* Render counter indicators */}
        {counters.map(counter => (
          <span
            key={counter.id}
            className={`pf-update-indicator__counter ${counter.isAnimating ? 'pf-update-indicator__counter--animating' : ''}`}
          >
            +1
          </span>
        ))}
      </div>

    </div>
  );
}
