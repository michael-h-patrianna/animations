import React, { useEffect, useRef } from 'react';
import './update-indicators.css';

export function UpdateIndicatorsUpdateFlip() {
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const startAnimation = () => {
      const copy = copyRef.current;
      if (!copy) return;

      copy.style.transform = 'rotateX(-90deg)';
      copy.style.opacity = '0';
      copy.style.transition = 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
      copy.style.transformStyle = 'preserve-3d';
      
      requestAnimationFrame(() => {
        copy.style.transform = 'rotateX(0deg)';
        copy.style.opacity = '1';
      });
      
      timeoutId = setTimeout(startAnimation, 3000);
    };

    startAnimation();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="pf-update-indicator" data-animation-id="update-indicators__update-flip">
      <div className="pf-update-indicator__icon"></div>
      <div ref={copyRef} className="pf-update-indicator__copy">Content update arrived</div>
      <div className="pf-update-indicator__badge">New</div>
    </div>
  );
}
