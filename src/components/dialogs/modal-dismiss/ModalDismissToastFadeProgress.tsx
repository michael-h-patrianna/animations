import React, { useEffect, useRef, useState } from 'react';
import './modal-dismiss.css';

export function ModalDismissToastFadeProgress() {
  const toastRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const toast = toastRef.current;
    const progress = progressRef.current;
    if (!toast || !progress) return;

    // Set initial state
    toast.style.opacity = '0';
    toast.style.transform = 'translate3d(0, 18px, 0) scale(0.94)';
    progress.style.transform = 'scaleX(1)';

    const entryDuration = 420;
    const autoDismissMs = 4600;
    const exitDuration = Math.min(360, Math.max(220, Math.round(entryDuration * 0.75)));

    // Entrance animation (fade with scale from 0.94 to 1)
    const enterKeyframes = [
      { transform: 'translate3d(0, 18px, 0) scale(0.94)', opacity: '0' },
      { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' }
    ];

    const enterAnimation = toast.animate(enterKeyframes, {
      duration: entryDuration,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // gentle easing
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

    // Schedule exit animation
    const exitTimer = setTimeout(() => {
      const exitKeyframes = [
        { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' },
        { transform: 'translate3d(0, 12px, 0) scale(0.92)', opacity: '0.4', offset: 0.6 },
        { transform: 'translate3d(0, 24px, 0) scale(0.88)', opacity: '0' }
      ];

      toast.animate(exitKeyframes, {
        duration: exitDuration,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fill: 'forwards'
      });
    }, autoDismissMs);

    return () => {
      clearTimeout(exitTimer);
      toast.getAnimations().forEach(anim => anim.cancel());
      progress.getAnimations().forEach(anim => anim.cancel());
    };
  }, [key]);

  return (
    <div className="pf-toast-preview">
      <div 
        ref={toastRef}
        className="pf-toast"
        data-animation-id="modal-dismiss__toast-fade-progress"
      >
        <div className="pf-toast__title">Action Complete</div>
        <div>Your changes have been saved</div>
        <div className="pf-toast__progress">
          <div ref={progressRef} className="pf-toast__progress-bar"></div>
        </div>
      </div>
    </div>
  );
}
