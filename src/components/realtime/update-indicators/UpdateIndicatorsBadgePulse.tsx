import { useEffect, useRef } from 'react';
import './update-indicators.css';

export function UpdateIndicatorsBadgePulse() {
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  let timeoutId: ReturnType<typeof setTimeout>;

    const startAnimation = () => {
      const badge = badgeRef.current;
      if (!badge) return;

      // Start pulse animation
      badge.style.animation = 'update-badge-pulse 1000ms ease-in-out infinite';

      // Auto-restart (continuous for pulse)
      timeoutId = setTimeout(startAnimation, 3000);
    };

    // Start animation immediately
    startAnimation();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div
      className="pf-update-indicator"
      data-animation-id="update-indicators__badge-pulse"
    >
      <div className="pf-update-indicator__icon"></div>
      <div className="pf-update-indicator__copy">Content update arrived</div>
      <div ref={badgeRef} className="pf-update-indicator__badge">New</div>
    </div>
  );
}
