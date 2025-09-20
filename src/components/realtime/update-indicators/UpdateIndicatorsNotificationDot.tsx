import React, { useEffect, useRef } from 'react';
import './update-indicators.css';

export function UpdateIndicatorsNotificationDot() {
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const icon = iconRef.current;
    if (!icon) return;

    icon.style.animation = 'update-notification-dot 800ms ease-in-out infinite';
  }, []);

  return (
    <div className="pf-update-indicator" data-animation-id="update-indicators__notification-dot">
      <div ref={iconRef} className="pf-update-indicator__icon"></div>
      <div className="pf-update-indicator__copy">Content update arrived</div>
      <div className="pf-update-indicator__badge">New</div>
    </div>
  );
}
