import React from 'react';
import './standard-effects.css';
import bounceSuccess from '@/assets/animations/standard-effects/bounce-success.png';

export function StandardEffectsBounce() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element bounce-element">
        <img src={bounceSuccess} alt="Bounce success" className="demo-icon-image" />
        <div className="demo-text">Success!</div>
      </div>
    </div>
  );
}