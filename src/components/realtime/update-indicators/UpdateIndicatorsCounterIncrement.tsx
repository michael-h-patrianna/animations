import React, { useEffect, useRef } from 'react';
import './update-indicators.css';

export function UpdateIndicatorsCounterIncrement() {
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const startAnimation = () => {
      const copy = copyRef.current;
      if (!copy) return;

      // Create floating +1 element
      const counter = document.createElement('span');
      counter.className = 'pf-update-indicator__counter';
      counter.textContent = '+1';
      counter.style.transform = 'translateY(8px)';
      counter.style.opacity = '0';
      
      copy.appendChild(counter);
      
      // Animate the counter floating up
      counter.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      requestAnimationFrame(() => {
        counter.style.transform = 'translateY(-12px)';
        counter.style.opacity = '1';
        
        setTimeout(() => {
          counter.style.opacity = '0';
        }, 400);
        
        setTimeout(() => {
          if (counter.parentNode) {
            counter.remove();
          }
        }, 800);
      });
      
      timeoutId = setTimeout(startAnimation, 2000);
    };

    startAnimation();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="pf-update-indicator" data-animation-id="update-indicators__counter-increment">
      <div className="pf-update-indicator__icon"></div>
      <div ref={copyRef} className="pf-update-indicator__copy">Content update arrived</div>
      <div className="pf-update-indicator__badge">New</div>
    </div>
  );
}
