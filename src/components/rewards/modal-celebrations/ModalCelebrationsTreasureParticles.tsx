import { useEffect, useRef } from 'react';
import './modal-celebrations.css';

export function ModalCelebrationsTreasureParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear any existing content
    container.innerHTML = '';

    const particleCount = 20;
    const gemCount = 6;
    const animations: Animation[] = [];

    // Create treasure particles (small golden particles)
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'pf-treasure-particles__particle';
      
      // Random starting position around center
      const centerX = 150;
      const centerY = 60;
      const startRadius = 20;
      const startAngle = Math.random() * 2 * Math.PI;
      const startX = centerX + Math.cos(startAngle) * startRadius;
      const startY = centerY + Math.sin(startAngle) * startRadius;
      
      particle.style.left = `${startX}px`;
      particle.style.top = `${startY}px`;
      particle.style.opacity = '0';
      
      container.appendChild(particle);

      // Staggered delays
      const delay = i * 50 + Math.random() * 200;
      
      // Particle animation: sparkly floating effect
      const endAngle = startAngle + (Math.random() - 0.5) * Math.PI;
      const endRadius = 60 + Math.random() * 40;
      const endX = centerX + Math.cos(endAngle) * endRadius;
      const endY = centerY + Math.sin(endAngle) * endRadius;
      
      const particleAnimation = particle.animate([
        { 
          transform: 'translate(0px, 0px) scale(0.1)',
          opacity: '0'
        },
        { 
          transform: `translate(${(endX - startX) * 0.3}px, ${(endY - startY) * 0.3}px) scale(1.5)`,
          opacity: '1',
          offset: 0.2
        },
        { 
          transform: `translate(${(endX - startX) * 0.7}px, ${(endY - startY) * 0.7}px) scale(1)`,
          opacity: '0.8',
          offset: 0.6
        },
        { 
          transform: `translate(${endX - startX}px, ${endY - startY}px) scale(0.2)`,
          opacity: '0'
        }
      ], {
        duration: 2600,
        delay,
        easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        fill: 'forwards'
      });

      animations.push(particleAnimation);
    }

    // Create treasure gems (larger colorful gems)
    for (let i = 0; i < gemCount; i++) {
      const gem = document.createElement('div');
      gem.className = 'pf-treasure-particles__gem';
      
      // Position gems in a circle around center
      const angle = (i / gemCount) * 2 * Math.PI;
      const radius = 25;
      const gemX = 150 + Math.cos(angle) * radius;
      const gemY = 60 + Math.sin(angle) * radius;
      
      gem.style.left = `${gemX}px`;
      gem.style.top = `${gemY}px`;
      gem.style.opacity = '0';
      
      container.appendChild(gem);

      // Gem animation: pulsing and rotating
      const gemDelay = i * 200 + 500;
      
      const gemAnimation = gem.animate([
        { 
          transform: 'scale(0.1) rotate(0deg)',
          opacity: '0'
        },
        { 
          transform: 'scale(1.3) rotate(180deg)',
          opacity: '1',
          offset: 0.3
        },
        { 
          transform: 'scale(1) rotate(360deg)',
          opacity: '1',
          offset: 0.7
        },
        { 
          transform: 'scale(0.2) rotate(540deg)',
          opacity: '0'
        }
      ], {
        duration: 2600,
        delay: gemDelay,
        easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        fill: 'forwards'
      });

      animations.push(gemAnimation);
    }

    return () => {
      animations.forEach(anim => anim.cancel());
    };
  }, []);

  return (
    <div className="pf-modal-celebration pf-modal-celebration--treasure-particles" data-animation-id="modal-celebrations__treasure-particles" ref={containerRef}>
      <div className="pf-treasure-particles"></div>
    </div>
  );
}
