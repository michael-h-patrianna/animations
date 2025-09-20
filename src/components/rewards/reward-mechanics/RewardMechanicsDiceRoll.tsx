import { useEffect, useRef } from 'react';
import './reward-mechanics.css';

export function RewardMechanicsDiceRoll() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dice = containerRef.current?.querySelector('.pf-reward-dice') as HTMLElement;
    if (!dice) return;
      
    // Cancel any existing animations
    dice.getAnimations().forEach(anim => anim.cancel());
    
    // Reset dice rotation
    dice.style.transform = 'rotateX(0deg) rotateY(0deg)';
    
    // Animate dice rolling - plays once on mount
    const animation = dice.animate([
      { transform: 'rotateX(0deg) rotateY(0deg)' },
      { transform: 'rotateX(360deg) rotateY(720deg)' }
    ], {
      duration: 1200, // Duration: 1200ms
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // vibrant easing
      fill: 'forwards'
    });
    
    return () => {
      animation.cancel();
    };
  }, []); // Empty dependency array - only runs on mount

  return (
    <div 
      className="pf-reward-mechanic pf-reward-mechanic--dice-roll" 
      ref={containerRef}
      data-animation-id="reward-mechanics__dice-roll"
    >
      <div className="pf-reward-dice">
        <span className="pf-reward-dice__pip"></span>
        <span className="pf-reward-dice__pip"></span>
        <span className="pf-reward-dice__pip"></span>
        <span className="pf-reward-dice__pip"></span>
        <span className="pf-reward-dice__pip"></span>
        <span className="pf-reward-dice__pip"></span>
      </div>
    </div>
  );
}
