import { PremiumCard } from '../PremiumCard'
import '../shared-premium.css'
import './CardInteractionsFlip3D.css'

export function CardInteractionsFlip3D() {
  return (
    <div
      className="premium-card-container pf-card-interactions--flip-3d"
      data-animation-id="card-interactions__flip-3d"
    >
      <div className="pf-flip-inner">
        <div className="pf-flip-front">
          <PremiumCard />
        </div>
        <div className="pf-flip-back">
           <div className="pf-flip-back-content">
             <div className="pf-flip-icon">⚡</div>
             <h3>SYSTEM UNLOCKED</h3>
             <div className="pf-flip-data">
                ACCESS_LEVEL: ADMIN<br/>
                ENCRYPTION: 0<br/>
                DATA: REVEALED
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}