import React, { useEffect, useRef, useState } from 'react';
import './modal-dismiss.css';

export function ModalDismissNotificationBurst() {
  const toastRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const burstOverlayRef = useRef<HTMLDivElement>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const toast = toastRef.current;
    const progress = progressRef.current;
    const burstOverlay = burstOverlayRef.current;
    if (!toast || !progress || !burstOverlay) return;

    // Set initial state
    toast.style.opacity = '0';
    toast.style.transform = 'translate3d(0, 18px, 0) scale(0.78)';
    toast.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(236, 195, 255, 0.16)';
    progress.style.transform = 'scaleX(1)';
    burstOverlay.style.opacity = '0';
    burstOverlay.innerHTML = '';

    const entryDuration = 520;
    const autoDismissMs = 4800;
    const exitDuration = Math.min(360, Math.max(220, Math.round(entryDuration * 0.75)));

    // Create burst overlay elements
    const createBurstEffects = () => {
      burstOverlay.innerHTML = '';
      burstOverlay.style.opacity = '1';
      toast.style.boxShadow = '0 18px 40px rgba(200, 53, 88, 0.32), inset 0 0 0 1px rgba(236, 195, 255, 0.16)';

      // Create halo
      const halo = document.createElement('span');
      halo.className = 'pf-toast__burst-halo';
      burstOverlay.appendChild(halo);
      
      halo.animate(
        [
          { transform: 'translate(-50%, -50%) scale(0.3)', opacity: '0' },
          { transform: 'translate(-50%, -50%) scale(1)', opacity: '0.6', filter: 'blur(0px)', offset: 0.45 },
          { transform: 'translate(-50%, -50%) scale(1.45)', opacity: '0', filter: 'blur(10px)' }
        ],
        { duration: entryDuration + 140, easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' }
      );

      // Create sparks (6 sparks in a circle)
      for (let i = 0; i < 6; i++) {
        const spark = document.createElement('span');
        spark.className = 'pf-toast__burst-spark';
        const angle = i * 60;
        spark.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scaleY(0.2)`;
        burstOverlay.appendChild(spark);
        
        spark.animate(
          [
            { opacity: '0', transform: `translate(-50%, -50%) rotate(${angle}deg) scaleY(0.2)` },
            { opacity: '1', transform: `translate(-50%, -50%) rotate(${angle}deg) scaleY(1)`, offset: 0.35 },
            { opacity: '0', transform: `translate(-50%, -50%) rotate(${angle}deg) scaleY(0.2)` }
          ],
          { duration: entryDuration + 120, easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', delay: i * 60 }
        );
      }

      // Create dots (4 dots at cardinal directions)
      for (let i = 0; i < 4; i++) {
        const dot = document.createElement('span');
        dot.className = 'pf-toast__burst-dot';
        const angle = (Math.PI / 2) * i;
        const radius = 70;
        const tx = Math.cos(angle) * radius;
        const ty = Math.sin(angle) * radius;
        dot.style.transform = `translate(-50%, -50%) translate(${tx}px, ${ty}px)`;
        burstOverlay.appendChild(dot);
        
        dot.animate(
          [
            { opacity: '0', transform: `translate(-50%, -50%) translate(${tx}px, ${ty}px) scale(0.6)` },
            { opacity: '1', transform: `translate(-50%, -50%) translate(${tx}px, ${ty}px) scale(1.1)`, offset: 0.4 },
            { opacity: '0', transform: `translate(-50%, -50%) translate(${tx * 1.25}px, ${ty * 1.25}px) scale(0.6)` }
          ],
          { duration: entryDuration + 200, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', delay: 120 + i * 80 }
        );
      }
    };

    // Entrance animation (burst effect with scale from 0.78 to 1.15 then 1)
    const enterKeyframes = [
      { transform: 'translate3d(0, 18px, 0) scale(0.78)', opacity: '0' },
      { transform: 'translate3d(0, -8px, 0) scale(1.15)', opacity: '1', offset: 0.55 },
      { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' }
    ];

    // Create burst effects
    createBurstEffects();

    const enterAnimation = toast.animate(enterKeyframes, {
      duration: entryDuration,
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // vibrant easing
      fill: 'forwards'
    });

    // Progress bar animation (scaleX from 1 to 0)
    const progressAnimation = progress.animate(
      [{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }],
      {
        duration: autoDismissMs,
        easing: 'linear',
        fill: 'forwards'
      }
    );

    // Progress spark animation
    const progressOuter = document.createElement('span');
    progressOuter.className = 'pf-toast__progress-outer';
    progress.appendChild(progressOuter);
    
    const progressSpark = document.createElement('span');
    progressSpark.className = 'pf-toast__progress-spark';
    progressOuter.appendChild(progressSpark);
    
    progressSpark.animate(
      [
        { opacity: '1', transform: 'translate(50%, -50%) scale(0.6)' },
        { opacity: '1', transform: 'translate(-40%, -50%) scale(1.05)', offset: 0.7 },
        { opacity: '0', transform: 'translate(-170%, -50%) scale(0.2)' }
      ],
      { duration: autoDismissMs, easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', fill: 'forwards' }
    );

    // Schedule exit animation
    const exitTimer = setTimeout(() => {
      const exitKeyframes = [
        { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' },
        { transform: 'translate3d(0, 8px, 0) scale(0.88)', opacity: '0.3', offset: 0.65 },
        { transform: 'translate3d(0, 20px, 0) scale(0.75)', opacity: '0' }
      ];

      toast.animate(exitKeyframes, {
        duration: exitDuration,
        easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        fill: 'forwards'
      });
    }, autoDismissMs);

    return () => {
      clearTimeout(exitTimer);
      toast.getAnimations().forEach(anim => anim.cancel());
      progress.getAnimations().forEach(anim => anim.cancel());
      burstOverlay.getAnimations().forEach(anim => anim.cancel());
      burstOverlay.querySelectorAll('*').forEach(node => node.getAnimations().forEach(anim => anim.cancel()));
    };
  }, [key]);

  return (
    <div className="pf-toast-preview">
      <div 
        ref={toastRef}
        className="pf-toast"
        data-animation-id="modal-dismiss__notification-burst"
      >
        <div className="pf-toast__title">Action Complete</div>
        <div>Your changes have been saved</div>
        <div className="pf-toast__progress">
          <div ref={progressRef} className="pf-toast__progress-bar"></div>
        </div>
        <div ref={burstOverlayRef} className="pf-toast__burst-overlay"></div>
      </div>
    </div>
  );
}
