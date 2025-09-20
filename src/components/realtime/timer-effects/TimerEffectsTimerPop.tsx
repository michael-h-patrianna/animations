import React, { useEffect, useRef, useState } from 'react';
import './timer-effects.css';

export function TimerEffectsTimerPop() {
  const [value, setValue] = useState(10);
  const [isAnimating, setIsAnimating] = useState(false);
  const valueRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationId: number;
    let timeoutId: NodeJS.Timeout;
    let popTimeout: NodeJS.Timeout;

    const startAnimation = () => {
      if (isAnimating) return;
      
      setIsAnimating(true);
      setValue(10);
      
      const valueEl = valueRef.current;
      const underline = underlineRef.current;
      
      if (!valueEl || !underline) return;

      // Reset styles
      underline.style.transform = 'scaleX(1)';
      valueEl.style.transform = 'scale(1)';

      const duration = 2500; // 2.5 seconds for pop effect
      const startTime = Date.now();

      // Schedule pop animation 400ms before end
      popTimeout = setTimeout(() => {
        // Pop animation: scale 1 → 1.35 → 0.92 → 1
        valueEl.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        valueEl.style.transform = 'scale(1.35)';
        
        setTimeout(() => {
          valueEl.style.transform = 'scale(0.92)';
        }, 200);
        
        setTimeout(() => {
          valueEl.style.transform = 'scale(1)';
        }, 400);
      }, duration - 400);

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
      if (popTimeout) clearTimeout(popTimeout);
    };
  }, []);

  return (
    <div 
      className="pf-timer" 
      data-animation-id="timer-effects__timer-pop"
    >
      <div ref={valueRef} className="pf-timer__value">{value}</div>
      <span className="pf-timer__label">Seconds left</span>
      <div ref={underlineRef} className="pf-timer__underline"></div>
    </div>
  );
}
