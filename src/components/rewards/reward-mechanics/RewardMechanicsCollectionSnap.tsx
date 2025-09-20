import { useEffect, useRef } from 'react';
import './reward-mechanics.css';

export function RewardMechanicsCollectionSnap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const startAnimation = async () => {
      const container = containerRef.current;
      if (!container || isAnimatingRef.current) return;
      
      isAnimatingRef.current = true;
      
      // Cancel any existing animations
      container.getAnimations().forEach(anim => anim.cancel());
      
      // Reset scale
      container.style.transform = 'scale(0.8)';
      
      // Generic animation: scale(0.8) → scale(1.05) → scale(1)
      // Duration: 600ms, pop easing
      const animation = container.animate([
        { transform: 'scale(0.8)' },
        { transform: 'scale(1.05)', offset: 0.5 },
        { transform: 'scale(1)' }
      ], {
        duration: 600, // Duration: 600ms
        easing: 'cubic-bezier(0.34, 1.25, 0.64, 1)', // pop easing
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
      const container = containerRef.current;
      if (container) {
        container.getAnimations().forEach(anim => anim.cancel());
      }
    };
  }, []);

  return (
    <div 
      className="pf-reward-mechanic pf-reward-mechanic--collection-snap" 
      ref={containerRef}
      data-animation-id="reward-mechanics__collection-snap"
    >
      <div className="pf-reward-generic">
        Collection Snap
      </div>
    </div>
  );
}
