import { useEffect, useRef } from 'react';
import './reward-mechanics.css';

export function RewardMechanicsChestDeluxe() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lid = containerRef.current?.querySelector('.pf-reward-chest__lid') as HTMLElement;
    if (!lid) return;
      
    // Cancel any existing animations
    lid.getAnimations().forEach(anim => anim.cancel());
    
    // Reset lid position
    lid.style.transform = 'rotateX(0deg)';
    
    // Animate lid opening - plays once on mount
    const animation = lid.animate([
      { transform: 'rotateX(0deg)' },
      { transform: 'rotateX(-70deg)' }
    ], {
      duration: 2800, // Deluxe version has longer duration
      easing: 'cubic-bezier(0.12, 0.75, 0.4, 1)', // entrance easing
      fill: 'forwards'
    });
    
    return () => {
      animation.cancel();
    };
  }, []); // Empty dependency array - only runs on mount

  return (
    <div 
      className="pf-reward-mechanic pf-reward-mechanic--chest-deluxe" 
      ref={containerRef}
      data-animation-id="reward-mechanics__chest-deluxe"
    >
      <div className="pf-reward-chest">
        <div className="pf-reward-chest__lid"></div>
        <div className="pf-reward-chest__body"></div>
      </div>
    </div>
  );
}
