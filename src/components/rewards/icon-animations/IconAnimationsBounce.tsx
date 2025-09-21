import React from 'react';
import './icon-animations.css';
import giftBoxImage from '@/assets/present_box.png';

export function IconAnimationsBounce() {
  return (
    <div className="icon-demo-container">
      <img 
        src={giftBoxImage} 
        alt="Bouncing gift box" 
        className="icon-bounce-element"
        style={{ width: '120px', height: 'auto' }}
      />
    </div>
  );
}