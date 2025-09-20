import { useEffect, useRef } from 'react';
import './reward-mechanics.css';

export function RewardMechanicsCardFlip() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('.pf-reward-card');
    if (!cards || cards.length === 0) return;
      
    // Cancel any existing animations
    cards.forEach(card => {
      card.getAnimations().forEach(anim => anim.cancel());
    });
    
    // Reset cards position
    cards.forEach(card => {
      card.style.transform = 'rotateY(0deg)';
    });
    
    // Animate cards flipping - plays once on mount
    const animations = Array.from(cards).map(card => {
      return card.animate([
        { transform: 'rotateY(0deg)' },
        { transform: 'rotateY(180deg)' }
      ], {
        duration: 1800, // Duration 1800ms
        easing: 'cubic-bezier(0.12, 0.75, 0.4, 1)', // entrance easing
        fill: 'forwards'
      });
    });
    
    return () => {
      animations.forEach(anim => anim.cancel());
    };
  }, []); // Empty dependency array - only runs on mount

  return (
    <div 
      className="pf-reward-mechanic pf-reward-mechanic--card-flip" 
      ref={containerRef}
      data-animation-id="reward-mechanics__card-flip"
    >
      <div className="pf-reward-cards">
        <div className="pf-reward-card"></div>
        <div className="pf-reward-card"></div>
        <div className="pf-reward-card"></div>
      </div>
    </div>
  );
}
