// React import not required for JSX in React 17+
import pulseScroll from '@/assets/pulse_scroll.png';
import './icon-animations.css';

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
