import { useEffect, useRef } from 'react';
import './reward-basic.css';

export function RewardBasicStarBurst() {
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const icon = iconRef.current;
    if (!icon) return;

    // Cancel any existing animations
    icon.getAnimations().forEach((anim) => anim.cancel());
    icon.style.transform = 'none';
    icon.style.opacity = '1';

    // Start the animation - plays once on mount
    const duration = 320; // durations.md from showcase.html
    const animation = icon.animate([
      {
        transform: 'scale(0.7)',
        opacity: '0.8'
      },
      {
        transform: 'scale(1.22)',
        opacity: '1'
      },
      {
        transform: 'scale(1)',
        opacity: '1'
      }
    ], {
      duration,
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // easingCurves.vibrant
      fill: 'forwards'
    });

    return () => {
      animation.cancel();
    };
  }, []); // Empty dependency array - only runs on mount

  return (
    <div
      className="pf-reward-basic"
      data-animation-id="reward-basic__star-burst"
    >
      <div
        ref={iconRef}
        className="pf-reward-basic__icon"
        style={{
          background: 'linear-gradient(135deg, #ecc3ff 0%, #ff5981 100%)',
          color: '#1d092f'
        }}
      >
        ✶
      </div>
      <span className="pf-reward-basic__label">Star Burst</span>
    </div>
  );
}
