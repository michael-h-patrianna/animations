import { useEffect, useRef } from 'react';
import './reward-mechanics.css';

export function RewardMechanicsCardFan() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const startAnimation = async () => {
      const cards = containerRef.current?.querySelectorAll('.pf-reward-card');
      if (!cards || cards.length === 0 || isAnimatingRef.current) return;
      
      isAnimatingRef.current = true;
      
      // Cancel any existing animations
      cards.forEach(card => {
        card.getAnimations().forEach(anim => anim.cancel());
      });
      
      // Card fan specifications from the user:
      // Card 0: translateX(0px) translateY(0) rotate(0deg) → translateX(0px) translateY(-30px) rotate(-10deg)  
      // Card 1: translateX(10px) translateY(0) rotate(2deg) → translateX(10px) translateY(-30px) rotate(-5deg)
      // Card 2: translateX(20px) translateY(0) rotate(4deg) → translateX(20px) translateY(-30px) rotate(5deg)
      
      const cardSpecs = [
        { startX: 0, startY: 0, startRotate: 0, endX: 0, endY: -30, endRotate: -10 },
        { startX: 10, startY: 0, startRotate: 2, endX: 10, endY: -30, endRotate: -5 },
        { startX: 20, startY: 0, startRotate: 4, endX: 20, endY: -30, endRotate: 5 }
      ];
      
      // Reset cards to initial positions
      cards.forEach((card, index) => {
        const spec = cardSpecs[index];
        if (spec) {
          card.style.transform = `translateX(${spec.startX}px) translateY(${spec.startY}px) rotate(${spec.startRotate}deg)`;
        }
      });
      
      // Animate cards with specified delays - duration: 400ms per card, delay: index * 0.12s, entrance easing
      const animations = Array.from(cards).map((card, index) => {
        const spec = cardSpecs[index];
        if (!spec) return null;
        
        return card.animate([
          { transform: `translateX(${spec.startX}px) translateY(${spec.startY}px) rotate(${spec.startRotate}deg)` },
          { transform: `translateX(${spec.endX}px) translateY(${spec.endY}px) rotate(${spec.endRotate}deg)` }
        ], {
          duration: 400, // Duration: 400ms per card
          delay: index * 120, // Delay: index * 0.12s (120ms)
          easing: 'cubic-bezier(0.12, 0.75, 0.4, 1)', // entrance easing
          fill: 'forwards'
        });
      }).filter(Boolean);

      try {
        await Promise.all(animations.map(anim => anim!.finished));
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
      const cards = containerRef.current?.querySelectorAll('.pf-reward-card');
      if (cards) {
        cards.forEach(card => {
          card.getAnimations().forEach(anim => anim.cancel());
        });
      }
    };
  }, []);

  return (
    <div 
      className="pf-reward-mechanic pf-reward-mechanic--card-fan" 
      ref={containerRef}
      data-animation-id="reward-mechanics__card-fan"
    >
      <div className="pf-reward-cards">
        <div className="pf-reward-card"></div>
        <div className="pf-reward-card"></div>
        <div className="pf-reward-card"></div>
      </div>
    </div>
  );
}
