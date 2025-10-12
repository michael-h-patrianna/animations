import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import './ModalBasePortalSwirl.css'


export function ModalBasePortalSwirl() {
  return (
    <div
      className="pf-modal-portal-swirl-overlay"
      data-animation-id="modal-base__portal-swirl"
    >
      <div className="pf-modal-portal-swirl-center">
        <div className="pf-modal-portal-swirl">
          <MockModalContent />
        </div>
      </div>
    </div>
  )
}

