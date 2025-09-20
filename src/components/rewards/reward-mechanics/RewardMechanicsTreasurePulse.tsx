import { useEffect, useRef } from 'react';
import './reward-mechanics.css';

export function RewardMechanicsTreasurePulse() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const startAnimation = async () => {
      const chest = containerRef.current?.querySelector('.pf-treasure-pulse__chest');
      const lid = containerRef.current?.querySelector('.pf-treasure-pulse__lid');
      const glow = containerRef.current?.querySelector('.pf-treasure-pulse__glow');
      const coins = containerRef.current?.querySelectorAll('.pf-treasure-pulse__coin');
      const sparkles = containerRef.current?.querySelectorAll('.pf-treasure-pulse__sparkle');
      
      if (!chest || !lid || !glow || isAnimatingRef.current) return;
      
      isAnimatingRef.current = true;
      
      // Cancel existing animations
      [chest, lid, glow].forEach(el => {
        if (el) el.getAnimations().forEach(anim => anim.cancel());
      });
      coins?.forEach(coin => coin.getAnimations().forEach(anim => anim.cancel()));
      sparkles?.forEach(sparkle => sparkle.getAnimations().forEach(anim => anim.cancel()));
      
      // Chest pulse animation
      const chestAnimation = chest.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.05)', offset: 0.3 },
        { transform: 'scale(0.98)', offset: 0.5 },
        { transform: 'scale(1.02)', offset: 0.7 },
        { transform: 'scale(1)' }
      ], {
        duration: 2300,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
      });
      
      // Lid opening animation
      lid.animate([
        { transform: 'rotateX(0deg) translateY(0)' },
        { transform: 'rotateX(-15deg) translateY(-2px)', offset: 0.3 },
        { transform: 'rotateX(-25deg) translateY(-5px)', offset: 0.5 },
        { transform: 'rotateX(-20deg) translateY(-4px)', offset: 0.7 },
        { transform: 'rotateX(-22deg) translateY(-4px)' }
      ], {
        duration: 2300,
        easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
        fill: 'forwards'
      });
      
      // Glow pulsing animation
      glow.animate([
        { 
          opacity: 0,
          transform: 'translate(-50%, -50%) scale(0.5)'
        },
        { 
          opacity: 1,
          transform: 'translate(-50%, -50%) scale(1.2)',
          offset: 0.3
        },
        { 
          opacity: 0.8,
          transform: 'translate(-50%, -50%) scale(1.4)',
          offset: 0.6
        },
        { 
          opacity: 0.6,
          transform: 'translate(-50%, -50%) scale(1.6)'
        }
      ], {
        duration: 2300,
        easing: 'cubic-bezier(0.12, 0.75, 0.4, 1)',
        fill: 'forwards'
      });
      
      // Coins popping out animation
      coins?.forEach((coin, index) => {
        const angle = (index / 6) * Math.PI * 2;
        const distance = 40 + Math.random() * 20;
        const endX = Math.cos(angle) * distance;
        const endY = -20 - Math.abs(Math.sin(angle) * distance);
        
        coin.animate([
          { 
            transform: 'translate(-50%, -50%) scale(0)',
            opacity: 0
          },
          { 
            transform: `translate(calc(-50% + ${endX * 0.5}px), calc(-50% + ${endY * 0.5}px)) scale(1)`,
            opacity: 1,
            offset: 0.4
          },
          { 
            transform: `translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px)) scale(0.8)`,
            opacity: 0.8,
            offset: 0.7
          },
          { 
            transform: `translate(calc(-50% + ${endX * 1.2}px), calc(-50% + ${endY * 0.8}px)) scale(0.6)`,
            opacity: 0
          }
        ], {
          duration: 2300,
          delay: 300 + index * 50,
          easing: 'cubic-bezier(0.12, 0.75, 0.4, 1)',
          fill: 'forwards'
        });
      });
      
      // Sparkles animation
      sparkles?.forEach((sparkle, index) => {
        const angle = (index / 8) * Math.PI * 2;
        const distance = 60 + Math.random() * 30;
        const endX = Math.cos(angle) * distance;
        const endY = Math.sin(angle) * distance - 20;
        
        sparkle.animate([
          { 
            transform: 'translate(-50%, -50%) scale(0)',
            opacity: 0
          },
          { 
            transform: 'translate(-50%, -50%) scale(1.5)',
            opacity: 1,
            offset: 0.2
          },
          { 
            transform: `translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px)) scale(0.5)`,
            opacity: 0
          }
        ], {
          duration: 1500,
          delay: 400 + index * 30,
          easing: 'cubic-bezier(0.12, 0.75, 0.4, 1)',
          fill: 'forwards'
        });
      });
      
      try {
        await chestAnimation.finished;
        isAnimatingRef.current = false;
        
        // Auto-restart after delay
        timeoutId = setTimeout(() => {
          startAnimation();
        }, 2000);
      } catch (error) {
        isAnimatingRef.current = false;
      }
    };

    startAnimation();
    
    return () => {
      clearTimeout(timeoutId);
      // Cleanup animations
      const allElements = containerRef.current?.querySelectorAll('*');
      allElements?.forEach(el => {
        el.getAnimations().forEach(anim => anim.cancel());
      });
    };
  }, []);

  return (
    <div 
      className="pf-reward-mechanic pf-reward-mechanic--treasure-pulse" 
      ref={containerRef}
      data-animation-id="reward-mechanics__treasure-pulse"
    >
      <div className="pf-treasure-pulse__chest">
        <div className="pf-treasure-pulse__lid"></div>
        <div className="pf-treasure-pulse__base"></div>
      </div>
      
      {/* Glow effect behind chest */}
      <div className="pf-treasure-pulse__glow"></div>
      
      {/* Coins that pop out */}
      {[...Array(6)].map((_, i) => (
        <div 
          key={`coin-${i}`} 
          className="pf-treasure-pulse__coin"
          style={{
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        ></div>
      ))}
      
      {/* Sparkles */}
      {[...Array(8)].map((_, i) => (
        <div 
          key={`sparkle-${i}`} 
          className="pf-treasure-pulse__sparkle"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        ></div>
      ))}
    </div>
  );
}