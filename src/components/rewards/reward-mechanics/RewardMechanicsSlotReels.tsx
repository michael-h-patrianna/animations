import { useEffect, useRef } from 'react';
import './reward-mechanics.css';

export function RewardMechanicsSlotReels() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reels = containerRef.current?.querySelectorAll('.pf-reward-slot__reel');
    if (!reels || reels.length === 0) return;
    
    // Reset reel positions
    reels.forEach(reel => {
      reel.style.transform = 'translateY(0)';
    });
    
    // 3 reels, each translateY(0) → translateY(-75%)
    // Reel durations: 0.9s, 1.02s, 1.14s (0.9 + index * 0.12)
    // Vibrant easing
    const animations = Array.from(reels).map((reel, index) => {
      const duration = (0.9 + index * 0.12) * 1000; // Convert to milliseconds
      
      return reel.animate([
        { transform: 'translateY(0)' },
        { transform: 'translateY(-75%)' }
      ], {
        duration: duration,
        easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // vibrant easing
        fill: 'forwards'
      });
    });

    return () => {
      animations.forEach(anim => anim.cancel());
    };
  }, []);

  return (
    <div 
      className="pf-reward-mechanic pf-reward-mechanic--slot-reels" 
      ref={containerRef}
      data-animation-id="reward-mechanics__slot-reels"
    >
      <div className="pf-reward-slot">
        <div className="pf-reward-slot__reel">
          <span>🍒</span>
          <span>⭐️</span>
          <span>💎</span>
          <span>7</span>
        </div>
        <div className="pf-reward-slot__reel">
          <span>🍒</span>
          <span>⭐️</span>
          <span>💎</span>
          <span>7</span>
        </div>
        <div className="pf-reward-slot__reel">
          <span>🍒</span>
          <span>⭐️</span>
          <span>💎</span>
          <span>7</span>
        </div>
      </div>
    </div>
  );
}
