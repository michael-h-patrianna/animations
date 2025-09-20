import { useEffect, useRef } from 'react';
import './reward-mechanics.css';

export function RewardMechanicsWheelSpinFast() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wheel = containerRef.current?.querySelector('.pf-reward-wheel') as HTMLElement;
    if (!wheel) return;
      
    // Cancel any existing animations
    wheel.getAnimations().forEach(anim => anim.cancel());
    
    // Reset rotation
    wheel.style.transform = 'rotate(0deg)';
    
    // Start wheel spin animation - plays once on mount
    // According to showcase.html: 1080deg then settle at 1110deg
    const animation = wheel.animate([
      { transform: 'rotate(0deg)' },
      { transform: 'rotate(1080deg)', offset: 0.85 },
      { transform: 'rotate(1110deg)' }
    ], {
      duration: 2800,
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // vibrant easing
      fill: 'forwards'
    });
    
    return () => {
      animation.cancel();
    };
  }, []); // Empty dependency array - only runs on mount

  return (
    <div 
      className="pf-reward-mechanic pf-reward-mechanic--wheel-spin-fast" 
      ref={containerRef}
      data-animation-id="reward-mechanics__wheel-spin-fast"
    >
      <div className="pf-reward-wheel">
        <span className="pf-reward-wheel__slice">1</span>
        <span className="pf-reward-wheel__slice">2</span>
        <span className="pf-reward-wheel__slice">3</span>
        <span className="pf-reward-wheel__slice">4</span>
        <span className="pf-reward-wheel__slice">5</span>
        <span className="pf-reward-wheel__slice">6</span>
        <div className="pf-reward-wheel__pointer"></div>
      </div>
    </div>
  );
}
