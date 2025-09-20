import React, { useEffect, useRef } from 'react';
import './update-indicators.css';

export function UpdateIndicatorsTickerScroll() {
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const startAnimation = () => {
      const copy = copyRef.current;
      if (!copy) return;

      const originalText = 'Content update arrived';
      
      // Create ticker element
      const ticker = document.createElement('div');
      ticker.className = 'pf-update-indicator__ticker';
      ticker.textContent = originalText;
      ticker.style.transform = 'translateX(0%)';
      
      copy.innerHTML = '';
      copy.appendChild(ticker);
      
      // Start scroll animation
      ticker.style.transition = 'transform 4s linear';
      requestAnimationFrame(() => {
        ticker.style.transform = 'translateX(-60%)';
      });
      
      // Reset after animation
      setTimeout(() => {
        copy.textContent = originalText;
      }, 4000);
      
      timeoutId = setTimeout(startAnimation, 6000);
    };

    startAnimation();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="pf-update-indicator" data-animation-id="update-indicators__ticker-scroll">
      <div className="pf-update-indicator__icon"></div>
      <div ref={copyRef} className="pf-update-indicator__copy">Content update arrived</div>
      <div className="pf-update-indicator__badge">New</div>
    </div>
  );
}
