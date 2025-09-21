import { useEffect, useRef } from 'react';
import './reward-basic.css';

export function RewardBasicCoinSpinSoft() {
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const icon = iconRef.current;
    if (!icon) return;

    // Cancel any existing animations
    icon.getAnimations().forEach((anim) => anim.cancel());
    icon.style.transform = 'none';

    // Start the animation - plays once on mount
    const duration = 1200; // proper duration from showcase.html
    const animation = icon.animate([
      { transform: 'rotateY(0deg) scale(0.9)' },
      { transform: 'rotateY(360deg) scale(1.05)', offset: 0.6 },
      { transform: 'rotateY(360deg) scale(0.98)', offset: 0.8 },
      { transform: 'rotateY(360deg) scale(1)' }
    ], {
      duration,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // easingCurves.entrance
      fill: 'forwards'
    });

    return () => {
      animation.cancel();
    };
  }, []);

  return (
    <div
      className="pf-reward-basic"
      data-animation-id="reward-basic__coin-spin-soft"
    >
      <div
        ref={iconRef}
        className="pf-reward-basic__icon"
        style={{
          background: 'linear-gradient(135deg, #ffd966 0%, #ffb300 100%)',
          color: '#1d092f'
        }}
      >
        ◎
      </div>
      <span className="pf-reward-basic__label">Soft Coin Spin</span>
    </div>
  );
}
