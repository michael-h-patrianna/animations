import { useEffect, useRef } from 'react';
import './text-effects.css';
import diamondPng from '@/assets/Diamonds.png';

export function TextEffectsCounterIncrement() {
  const targetRef = useRef<HTMLDivElement>(null);
  const diamondRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const startAnimation = () => {
      const target = targetRef.current;
      const diamond = diamondRef.current;
      if (!target || !diamond) return;

      // Clean up any existing counter elements
      const existingCounters = target.querySelectorAll('.pf-update-indicator__counter');
      existingCounters.forEach(el => el.remove());

      // Create floating +1 element
      const counter = document.createElement('span');
      counter.className = 'pf-update-indicator__counter';
      counter.textContent = '+1';
      counter.style.transform = 'translateY(8px)';
      counter.style.opacity = '0';

      // Append counter to the target container (diamond wrapper)
      target.appendChild(counter);

      // Add pickup animation to diamond
      diamond.style.animation = 'pf-diamond-pickup 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';

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

        // Reset diamond animation
        setTimeout(() => {
          diamond.style.animation = '';
        }, 500);
      });

      timeoutId = setTimeout(startAnimation, 2000);
    };

    startAnimation();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="pf-counter-showcase" data-animation-id="text-effects__counter-increment">
      <div ref={targetRef} className="pf-counter-showcase__target">
        <img 
          ref={diamondRef}
          src={diamondPng} 
          alt="Diamond" 
          className="pf-counter-showcase__diamond"
        />
      </div>
    </div>
  );
}
