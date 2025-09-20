import React, { useEffect, useRef, useState } from 'react';
import './timer-effects.css';

export function TimerEffectsTimerUnderline() {
  const [value, setValue] = useState(10);
  const [isAnimating, setIsAnimating] = useState(false);
  const underlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationId: number;
    let timeoutId: NodeJS.Timeout;

    const startAnimation = () => {
      if (isAnimating) return;
      
      setIsAnimating(true);
      setValue(10);
      
      const underline = underlineRef.current;
      
      if (!underline) return;

      // Reset styles
      underline.style.transform = 'scaleX(1)';
      underline.style.background = 'rgba(236, 195, 255, 0.16)';

      const duration = 2500; // 2.5 seconds
      const startTime = Date.now();

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

      // Start underline sweep animation
      underline.style.animation = 'timer-underline-sweep 900ms infinite ease-in-out';
      
      animationId = requestAnimationFrame(animate);
    };

    // Start animation immediately
    startAnimation();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (timeoutId) clearTimeout(timeoutId);
      if (underlineRef.current) {
        underlineRef.current.style.animation = '';
      }
    };
  }, []);

  return (
    <div 
      className="pf-timer" 
      data-animation-id="timer-effects__timer-underline"
    >
      <div className="pf-timer__value">{value}</div>
      <span className="pf-timer__label">Seconds left</span>
      <div ref={underlineRef} className="pf-timer__underline"></div>
    </div>
  );
}
