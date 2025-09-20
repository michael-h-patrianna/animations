import React, { useEffect, useRef, useState } from 'react';
import './timer-effects.css';

export function TimerEffectsTimerTick() {
  const [value, setValue] = useState(10);
  const [isAnimating, setIsAnimating] = useState(false);
  const valueRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    let animationId: number;
    let timeoutId: NodeJS.Timeout;
    let tickTimeouts: NodeJS.Timeout[] = [];

    const startAnimation = () => {
      if (isAnimating) return;
      
      setIsAnimating(true);
      setValue(10);
      
      const valueEl = valueRef.current;
      const underline = underlineRef.current;
      const path = pathRef.current;
      
      if (!valueEl || !underline || !path) return;

      // Reset styles
      underline.style.transform = 'scaleX(1)';
      valueEl.style.transform = 'rotate(0deg)';
      path.style.strokeDashoffset = '97';

      const duration = 2500; // 2.5 seconds
      const startTime = Date.now();
      const step = duration / 10;

      // Set up tick animations for each second
      for (let i = 0; i < 10; i++) {
        const tickTimeout = setTimeout(() => {
          // Rotate value element
          const rotation = i % 2 === 0 ? 3 : -3;
          valueEl.style.transform = `rotate(${rotation}deg)`;
          setTimeout(() => {
            valueEl.style.transform = 'rotate(0deg)';
          }, 250);
          
          // Update arc progress
          const portion = 97 - (97 / 10) * (i + 1);
          path.style.strokeDashoffset = portion.toString();
        }, step * i);
        
        tickTimeouts.push(tickTimeout);
      }

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Update countdown value
        const currentValue = Math.max(0, Math.ceil(10 * (1 - progress)));
        setValue(currentValue);
        
        // Update underline scale
        underline.style.transform = `scaleX(${1 - progress})`;
        
        if (progress < 1) {
          animationId = requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          // Auto-restart after a brief pause
          timeoutId = setTimeout(startAnimation, 1000);
        }
      };

      animationId = requestAnimationFrame(animate);
    };

    // Start animation immediately
    startAnimation();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (timeoutId) clearTimeout(timeoutId);
      tickTimeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div 
      className="pf-timer" 
      data-animation-id="timer-effects__timer-tick"
    >
      <div ref={valueRef} className="pf-timer__value" style={{ transition: 'transform 0.25s ease' }}>{value}</div>
      <span className="pf-timer__label">Seconds left</span>
      <div ref={underlineRef} className="pf-timer__underline"></div>
      <div className="pf-timer__arc">
        <svg viewBox="0 0 36 36">
          <path 
            ref={pathRef}
            className="pf-timer__path" 
            d="M18 2.5a15.5 15.5 0 1 1 0 31 15.5 15.5 0 0 1 0-31" 
          />
        </svg>
      </div>
    </div>
  );
}
