import { useEffect, useRef } from 'react';
import './reward-mechanics.css';

export function RewardMechanicsScratchCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const startAnimation = async () => {
      const mask = containerRef.current?.querySelector('.pf-reward-scratch__mask') as HTMLElement;
      if (!mask || isAnimatingRef.current) return;
      
      isAnimatingRef.current = true;
      
      // Cancel any existing animations
      mask.getAnimations().forEach(anim => anim.cancel());
      
      // Reset mask width
      mask.style.width = '100%';
      
      // Animate mask width from 100% to 0%
      const animation = mask.animate([
        { width: '100%' },
        { width: '0%' }
      ], {
        duration: 800, // Duration: 800ms
        easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)', // standard easing
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
      const mask = containerRef.current?.querySelector('.pf-reward-scratch__mask') as HTMLElement;
      if (mask) {
        mask.getAnimations().forEach(anim => anim.cancel());
      }
    };
  }, []);

  return (
    <div 
      className="pf-reward-mechanic pf-reward-mechanic--scratch-card" 
      ref={containerRef}
      data-animation-id="reward-mechanics__scratch-card"
    >
      <div className="pf-reward-scratch">
        <div className="pf-reward-scratch__mask"></div>
      </div>
    </div>
  );
}
