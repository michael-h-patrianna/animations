import { useEffect, useRef } from 'react';
import './reward-mechanics.css';

export function RewardMechanicsLootDrop() {
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
      
      // Reset position and opacity
      container.style.transform = 'translateY(-60px)';
      container.style.opacity = '0';
      
      // Loot drop animation: translateY(-60px) opacity:0 → translateY(0) opacity:1
      // Duration: 600ms, bounce easing
      const animation = container.animate([
        { transform: 'translateY(-60px)', opacity: '0' },
        { transform: 'translateY(0)', opacity: '1' }
      ], {
        duration: 600, // Duration: 600ms
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // bounce easing
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
      className="pf-reward-mechanic pf-reward-mechanic--loot-drop" 
      ref={containerRef}
      data-animation-id="reward-mechanics__loot-drop"
    >
      <div className="pf-reward-generic">
        Loot Drop
      </div>
    </div>
  );
}
