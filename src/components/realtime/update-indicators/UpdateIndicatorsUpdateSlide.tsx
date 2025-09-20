import React, { useEffect, useRef } from 'react';
import './update-indicators.css';

export function UpdateIndicatorsUpdateSlide() {
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const startAnimation = () => {
      const copy = copyRef.current;
      if (!copy) return;

      copy.style.transform = 'translateY(16px)';
      copy.style.opacity = '0';
      copy.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      
      requestAnimationFrame(() => {
        copy.style.transform = 'translateY(0)';
        copy.style.opacity = '1';
      });
      
      timeoutId = setTimeout(startAnimation, 2500);
    };

    startAnimation();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="pf-update-indicator" data-animation-id="update-indicators__update-slide">
      <div className="pf-update-indicator__icon"></div>
      <div ref={copyRef} className="pf-update-indicator__copy">Content update arrived</div>
      <div className="pf-update-indicator__badge">New</div>
    </div>
  );
}
