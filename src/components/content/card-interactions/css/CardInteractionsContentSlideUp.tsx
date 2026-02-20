import '../shared-premium.css'
import './CardInteractionsContentSlideUp.css'

/**
 *
 */
export function CardInteractionsContentSlideUp() {
  return (
    <div className="premium-card-container pf-card-interactions--content-slide-up" data-animation-id="card-interactions__content-slide-up">
       <div className="pf-restricted-bg">
          <div className="text-4xl mb-4">🔒</div>
          <h3>RESTRICTED AREA</h3>
          <p>HOVER TO AUTHENTICATE</p>
       </div>

       <div className="pf-glass-drawer">
         <div className="pf-drawer-handle" />
         <div className="pf-drawer-content">
            <div className="pf-drawer-row">
               <span>Status</span>
               <span className="pf-status-granted">GRANTED</span>
            </div>
            <div className="pf-drawer-row">
               <span>Clearance</span>
               <span className="pf-mono">LEVEL 5</span>
            </div>
            <button className="pf-enter-btn">ENTER SYSTEM</button>
         </div>
       </div>
    </div>
  )
}