import { useEffect, useRef } from 'react';
import './reward-mechanics.css';

export function RewardMechanicsMysteryBox() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const startAnimation = async () => {
      const lid = containerRef.current?.querySelector('.pf-reward-box__lid') as HTMLElement;
      if (!lid || isAnimatingRef.current) return;
      
      isAnimatingRef.current = true;
      
      // Cancel any existing animations
      lid.getAnimations().forEach(anim => anim.cancel());
      
      // Reset lid position
      lid.style.transform = 'translateY(0)';
      
      // Animate lid opening - Lid translateY(0) → translateY(-40px)
      // Duration: 600ms, entrance easing
      const animation = lid.animate([
        { transform: 'translateY(0)' },
        { transform: 'translateY(-40px)' }
      ], {
        duration: 600, // Duration: 600ms
        easing: 'cubic-bezier(0.12, 0.75, 0.4, 1)', // entrance easing
        fill: 'forwards'
      });

      try {
        await animation.finished;
        isAnimatingRef.current = false;
        
        // Auto-restart after 2 second delay
        timeoutId = setTimeout(() => {
          startAnimation();
        }, 2000);
      } catch (error) {
        // Animation was cancelled
        isAnimatingRef.current = false;
      }
    };

    startAnimation();
    
    return () => {
      clearTimeout(timeoutId);
      const lid = containerRef.current?.querySelector('.pf-reward-box__lid') as HTMLElement;
      if (lid) {
        lid.getAnimations().forEach(anim => anim.cancel());
      }
    };
  }, []);

  return (
    <div 
      className="pf-reward-mechanic pf-reward-mechanic--mystery-box" 
      ref={containerRef}
      data-animation-id="reward-mechanics__mystery-box"
    >
      <div className="pf-reward-box">
        <div className="pf-reward-box__lid"></div>
        <div className="pf-reward-box__body"></div>
      </div>
    </div>
  );
}
