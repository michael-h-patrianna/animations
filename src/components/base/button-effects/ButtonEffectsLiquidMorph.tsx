import { useState } from 'react';
import './button-effects.css';

export function ButtonEffectsLiquidMorph() {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div className="button-liquid-morph-demo" data-animation-id="button-effects__liquid-morph">
      <button
        className={`pf-btn pf-btn--primary pf-btn--liquid-morph ${isAnimating ? 'liquid-morph-active' : ''}`}
        onClick={handleClick}
      >
        Click Me!
      </button>
    </div>
  );
}