import { useEffect, useRef } from 'react';
import './reward-basic.css';

export function RewardBasicGlowPulse() {
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const icon = iconRef.current;
    if (!icon) return;

    // Cancel any existing animations
    icon.getAnimations().forEach((anim) => anim.cancel());
    icon.style.transform = 'none';
    icon.style.boxShadow = 'none';

    // Start the animation - plays once on mount
    const duration = 420; // durations.lg from showcase.html
    const animation = icon.animate([
      {
        transform: 'scale(0.92)',
        boxShadow: '0 0 0 rgba(236,195,255,0)'
      },
      {
        transform: 'scale(1.08)',
        boxShadow: '0 0 24px rgba(236,195,255,0.55)'
      },
      {
        transform: 'scale(1)',
        boxShadow: '0 0 0 rgba(236,195,255,0)'
      }
    ], {
      duration,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // easingCurves.gentle
      fill: 'forwards'
    });

    return () => {
      animation.cancel();
    };
  }, []); // Empty dependency array - only runs on mount

  return (
    <div
      className="pf-reward-basic"
      data-animation-id="reward-basic__glow-pulse"
    >
      <div
        ref={iconRef}
        className="pf-reward-basic__icon"
        style={{
          background: 'linear-gradient(135deg, #c47ae5 0%, #ecc3ff 100%)',
          color: '#1d092f'
        }}
      >
        ◎
      </div>
      <span className="pf-reward-basic__label">Glow Pulse</span>
    </div>
  );
}
