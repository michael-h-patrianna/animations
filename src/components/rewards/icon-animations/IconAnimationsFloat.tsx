// React import not required for JSX in React 17+
import balloonImage from '@/assets/present_box_balloon.png'
import './IconAnimationsFloat.css'

export function IconAnimationsFloat() {
  return (
    <div className="icon-demo-container">
      <img src={balloonImage} alt="Floating balloon" className="icon-float-element" />
    </div>
  )
}
