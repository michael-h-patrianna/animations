import React, { useEffect, useRef } from 'react';
import './modal-base.css';

export function ModalBaseFadeGlow() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  
  useEffect(() => {
    const overlay = overlayRef.current;
    const modal = modalRef.current;
    const glow = glowRef.current;
    const particles = particlesRef.current;
    
    if (!overlay || !modal || !glow) return;
    
    // Performance optimizations
    modal.style.willChange = 'transform, opacity, filter';
    glow.style.willChange = 'transform, opacity';
    
    // Phase 1: Overlay fade-in (0-220ms)
    const overlayAnimation = overlay.animate([
      { backgroundColor: 'rgba(29, 9, 47, 0)' },
      { backgroundColor: 'rgba(29, 9, 47, 0.78)' }
    ], {
      duration: 220,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      fill: 'forwards'
    });
    
    // Phase 2: Modal fade-in with glow (100-520ms)
    const modalAnimation = modal.animate([
      { 
        transform: 'translate(-50%, -50%) scale(0.92)',
        opacity: 0,
        filter: 'blur(24px) brightness(1.2)',
        boxShadow: '0 0 0 rgba(236, 195, 255, 0), 0 18px 40px rgba(0, 0, 0, 0)'
      },
      { 
        transform: 'translate(-50%, -50%) scale(1.04)',
        opacity: 0.7,
        filter: 'blur(12px) brightness(1.4)',
        boxShadow: '0 0 60px rgba(236, 195, 255, 0.3), 0 18px 40px rgba(0, 0, 0, 0.2)',
        offset: 0.4
      },
      { 
        transform: 'translate(-50%, -50%) scale(1.01)',
        opacity: 0.95,
        filter: 'blur(4px) brightness(1.15)',
        boxShadow: '0 0 40px rgba(236, 195, 255, 0.2), 0 18px 40px rgba(0, 0, 0, 0.35)',
        offset: 0.7
      },
      { 
        transform: 'translate(-50%, -50%) scale(1)',
        opacity: 1,
        filter: 'blur(0) brightness(1)',
        boxShadow: '0 0 30px rgba(236, 195, 255, 0.15), 0 18px 40px rgba(0, 0, 0, 0.45)'
      }
    ], {
      duration: 420,
      delay: 100,
      easing: 'cubic-bezier(0.12, 0.75, 0.4, 1)',
      fill: 'forwards'
    });
    
    // Phase 3: Glow pulse effect (200-720ms)
    const glowAnimation = glow.animate([
      { 
        transform: 'translate(-50%, -50%) scale(0.5)',
        opacity: 0
      },
      { 
        transform: 'translate(-50%, -50%) scale(1.8)',
        opacity: 0.6,
        offset: 0.3
      },
      { 
        transform: 'translate(-50%, -50%) scale(2.2)',
        opacity: 0.3,
        offset: 0.6
      },
      { 
        transform: 'translate(-50%, -50%) scale(2.5)',
        opacity: 0
      }
    ], {
      duration: 520,
      delay: 200,
      easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      fill: 'forwards'
    });
    
    // Phase 4: Particle effects (300-900ms)
    particles.forEach((particle, index) => {
      if (!particle) return;
      
      const angle = (index / particles.length) * Math.PI * 2;
      const distance = 80 + Math.random() * 40;
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;
      
      particle.style.willChange = 'transform, opacity';
      
      particle.animate([
        { 
          transform: 'translate(-50%, -50%) scale(0)',
          opacity: 0
        },
        { 
          transform: `translate(calc(-50% + ${endX * 0.3}px), calc(-50% + ${endY * 0.3}px)) scale(1.2)`,
          opacity: 0.8,
          offset: 0.3
        },
        { 
          transform: `translate(calc(-50% + ${endX * 0.7}px), calc(-50% + ${endY * 0.7}px)) scale(0.8)`,
          opacity: 0.4,
          offset: 0.7
        },
        { 
          transform: `translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px)) scale(0)`,
          opacity: 0
        }
      ], {
        duration: 600,
        delay: 300 + index * 20,
        easing: 'cubic-bezier(0.12, 0.75, 0.4, 1)',
        fill: 'forwards'
      });
    });
    
    // Cleanup
    return () => {
      [overlayAnimation, modalAnimation, glowAnimation].forEach(anim => anim.cancel());
      modal.style.willChange = 'auto';
      glow.style.willChange = 'auto';
      particles.forEach(p => p && (p.style.willChange = 'auto'));
    };
  }, []);

  return (
    <div 
      ref={overlayRef}
      className="pf-modal-overlay"
      style={{
        backgroundColor: 'rgba(29, 9, 47, 0)'
      }}
    >
      {/* Glow effect layer */}
      <div 
        ref={glowRef}
        className="pf-modal-glow"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236, 195, 255, 0.4) 0%, rgba(198, 255, 119, 0.2) 40%, transparent 70%)',
          pointerEvents: 'none',
          opacity: 0
        }}
      />
      
      {/* Particle effects */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`particle-${i}`}
          ref={el => el && (particlesRef.current[i] = el)}
          className="pf-modal-particle"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #fff 0%, rgba(236, 195, 255, 0.8) 50%, transparent 70%)',
            boxShadow: '0 0 10px rgba(236, 195, 255, 0.6)',
            pointerEvents: 'none',
            opacity: 0
          }}
        />
      ))}
      
      <div 
        ref={modalRef}
        className="pf-modal"
        style={{
          transform: 'translate(-50%, -50%) scale(0.92)',
          opacity: 0,
          filter: 'blur(24px)'
        }}
      >
        <div className="pf-modal__header">
          <h3 className="pf-modal__title">New Creator Quest</h3>
          <span className="pf-badge-tech">Modal</span>
        </div>
        <div className="pf-modal__body">
          <p>Complete 3 live sessions to unlock rewards.</p>
        </div>
        <div className="pf-modal__footer">
          <button className="pf-button-primary">Accept</button>
          <button className="pf-button-secondary">Later</button>
        </div>
      </div>
    </div>
  );
}
