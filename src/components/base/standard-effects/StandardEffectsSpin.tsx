import React from 'react';
import './standard-effects.css';
import spinLoading from '@/assets/animations/standard-effects/spin-loading.png';

export function StandardEffectsSpin() {
  return (
    <div className="standard-demo-container">
      <div className="standard-demo-element spin-element">
        <img src={spinLoading} alt="Spin loading" className="demo-icon-image" />
        <div className="demo-text">Loading</div>
      </div>
    </div>
  );
}