import React, { useEffect, useRef, useState } from 'react';
import './timer-effects.css';

export function TimerEffectsTimerArc() {
  const [value, setValue] = useState(10);
  const [isAnimating, setIsAnimating] = useState(false);
  const underlineRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    let animationId: number;
    let timeoutId: NodeJS.Timeout;

    const startAnimation = () => {
      if (isAnimating) return;
      
      setIsAnimating(true);
      setValue(10);
      
      const underline = underlineRef.current;
      const path = pathRef.current;
      
      if (!underline || !path) return;

      // Reset styles
      underline.style.transform = 'scaleX(1)';
      path.style.strokeDashoffset = '97';

      const duration = 3000; // 3 seconds for longer arc sweep
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Update countdown value
        const currentValue = Math.max(0, Math.ceil(10 * (1 - progress)));
        setValue(currentValue);
        
        // Update underline scale
        underline.style.transform = `scaleX(${1 - progress})`;
        
        // Update arc progress (smooth linear animation)
        const arcOffset = 97 * progress;
        path.style.strokeDashoffset = `${97 - arcOffset}`;
        
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
    };
  }, []);

  return (
    <div 
      className="pf-timer" 
      data-animation-id="timer-effects__timer-arc"
    >
      <div className="pf-timer__value">{value}</div>
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
