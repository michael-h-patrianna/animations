import { useEffect, useRef } from 'react';
import './reward-mechanics.css';

export function RewardMechanicsJackpotRadiance() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const startAnimation = async () => {
      const stage = containerRef.current?.querySelector('.pf-jackpot-radiance__stage');
      const core = containerRef.current?.querySelector('.pf-jackpot-radiance__core');
      const rays = containerRef.current?.querySelectorAll('.pf-jackpot-radiance__ray');
      const particles = containerRef.current?.querySelectorAll('.pf-jackpot-radiance__particle');
      
      if (!stage || !core || isAnimatingRef.current) return;
      
      isAnimatingRef.current = true;
      
      // Reset all animations
      [stage, core].forEach(el => {
        if (el) el.getAnimations().forEach(anim => anim.cancel());
      });
      rays?.forEach(ray => ray.getAnimations().forEach(anim => anim.cancel()));
      particles?.forEach(particle => particle.getAnimations().forEach(anim => anim.cancel()));
      
      // Core glow animation - pulsing and scaling
      const coreAnimation = core.animate([
        { 
          transform: 'translate(-50%, -50%) scale(0)',
          opacity: 0
        },
        { 
          transform: 'translate(-50%, -50%) scale(1.2)',
          opacity: 1,
          offset: 0.3
        },
        { 
          transform: 'translate(-50%, -50%) scale(1)',
          opacity: 0.85,
          offset: 0.6
        },
        { 
          transform: 'translate(-50%, -50%) scale(1.1)',
          opacity: 1
        }
      ], {
        duration: 3000,
        easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
        fill: 'forwards'
      });
      
      // Rays animation - rotating and pulsing
      rays?.forEach((ray, index) => {
        ray.animate([
          { 
            transform: `rotate(${index * 45}deg) scaleY(0)`,
            opacity: 0
          },
          { 
            transform: `rotate(${index * 45}deg) scaleY(1.5)`,
            opacity: 0.8,
            offset: 0.4
          },
          { 
            transform: `rotate(${index * 45}deg) scaleY(1.2)`,
            opacity: 0.6
          }
        ], {
          duration: 3000,
          delay: index * 50,
          easing: 'cubic-bezier(0.12, 0.75, 0.4, 1)',
          fill: 'forwards'
        });
      });
      
      // Particles animation - exploding outward
      particles?.forEach((particle, index) => {
        const angle = (index / 12) * Math.PI * 2;
        const distance = 80 + Math.random() * 40;
        const endX = Math.cos(angle) * distance;
        const endY = Math.sin(angle) * distance;
        
        particle.animate([
          { 
            transform: 'translate(-50%, -50%) scale(0)',
            opacity: 0
          },
          { 
            transform: `translate(calc(-50% + ${endX * 0.3}px), calc(-50% + ${endY * 0.3}px)) scale(1.2)`,
            opacity: 1,
            offset: 0.3
          },
          { 
            transform: `translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px)) scale(0.3)`,
            opacity: 0
          }
        ], {
          duration: 3000,
          delay: 200 + index * 40,
          easing: 'cubic-bezier(0.12, 0.75, 0.4, 1)',
          fill: 'forwards'
        });
      });
      
      try {
        await coreAnimation.finished;
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
      className="pf-reward-mechanic pf-reward-mechanic--jackpot-radiance" 
      ref={containerRef}
      data-animation-id="reward-mechanics__jackpot-radiance"
    >
      <div className="pf-jackpot-radiance__stage">
        {/* Core glowing element */}
        <div className="pf-jackpot-radiance__core"></div>
        
        {/* Radiating rays */}
        {[...Array(8)].map((_, i) => (
          <div key={`ray-${i}`} className="pf-jackpot-radiance__ray"></div>
        ))}
        
        {/* Particles */}
        {[...Array(12)].map((_, i) => (
          <div key={`particle-${i}`} className="pf-jackpot-radiance__particle"></div>
        ))}
      </div>
    </div>
  );
}
