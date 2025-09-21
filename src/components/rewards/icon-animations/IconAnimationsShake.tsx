// React import not required for JSX in React 17+
import './icon-animations.css';
import shakeIcon from '@/assets/shake_icon.png';

export function IconAnimationsShake() {
  return (
    <div className="icon-demo-container">
      <img 
        src={shakeIcon} 
        alt="Shake animation" 
        className="icon-shake-element"
        style={{ width: '120px', height: 'auto' }}
      />
    </div>
  );
}