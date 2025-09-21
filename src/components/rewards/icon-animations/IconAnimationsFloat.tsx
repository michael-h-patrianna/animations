// React import not required for JSX in React 17+
import './icon-animations.css';
import balloonImage from '@/assets/present_box_balloon.png';

export function IconAnimationsFloat() {
  return (
    <div className="icon-demo-container">
      <img 
        src={balloonImage} 
        alt="Floating balloon" 
        className="icon-float-element"
        style={{ width: '120px', height: 'auto' }}
      />
    </div>
  );
}