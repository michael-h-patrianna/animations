// React import not required for JSX in React 17+
import './icon-animations.css';
import pulseScroll from '@/assets/pulse_scroll.png';

export function IconAnimationsPulse() {
  return (
    <div className="icon-demo-container">
      <div style={{ position: 'relative' }}>
        <img 
          src={pulseScroll} 
          alt="Pulsing scroll" 
          className="icon-pulse-element"
          style={{ width: '140px', height: 'auto', position: 'relative' }}
        />
      </div>
    </div>
  );
}