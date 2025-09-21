import { useEffect, useRef } from 'react';
import './modal-dismiss.css';

export function ModalDismissToastSlideRight() {
  const toastRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  // Removed unused state

  useEffect(() => {
    const toast = toastRef.current;
    const progress = progressRef.current;
    if (!toast || !progress) return;

    // Set initial state
    toast.style.opacity = '0';
    toast.style.transform = 'translate3d(140%, 0, 0) scale(0.96)';
    progress.style.transform = 'scaleX(1)';

    const entryDuration = 320;
    const autoDismissMs = 3800;
    const exitDuration = Math.min(360, Math.max(220, Math.round(entryDuration * 0.75)));

    // Entrance animation (slides from right with overshoot to -6%)
    const enterKeyframes = [
      { transform: 'translate3d(140%, 0, 0) scale(0.96)', opacity: '0' },
      { transform: 'translate3d(-6%, 0, 0) scale(1.02)', opacity: '1', offset: 0.7 },
      { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '1' }
    ];

    toast.animate(enterKeyframes, {
      duration: entryDuration,
      easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      fill: 'forwards'
    });

    // Progress bar animation (scaleX from 1 to 0)
    progress.animate(
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
        { transform: 'translate3d(8%, 0, 0) scale(0.98)', opacity: '0.9', offset: 0.5 },
        { transform: 'translate3d(160%, 0, 0) scale(0.9)', opacity: '0' }
      ];

      toast.animate(exitKeyframes, {
        duration: exitDuration,
        easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        fill: 'forwards'
      });
    }, autoDismissMs);

    return () => {
      clearTimeout(exitTimer);
      toast.getAnimations().forEach(anim => anim.cancel());
      progress.getAnimations().forEach(anim => anim.cancel());
    };
  }, []);

  return (
    <div className="pf-toast-preview">
      <div
        ref={toastRef}
        className="pf-toast"
        data-animation-id="modal-dismiss__toast-slide-right"
      >
        <div className="pf-toast__title">Action Complete</div>
        <div className="pf-toast__body">Your changes have been saved</div>
        <div className="pf-toast__progress">
          <div ref={progressRef} className="pf-toast__progress-bar"></div>
        </div>
      </div>
    </div>
  );
}
