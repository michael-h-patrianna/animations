import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import './ModalBaseRippleExpand.css'


/**
 *
 */
export function ModalBaseRippleExpand() {
  return (
    <div className="pf-modal-base-ripple-expand" data-animation-id="modal-base__ripple-expand">
      <div className="pf-modal-base-ripple-expand__overlay" />
      <div className="pf-modal-base-ripple-expand__modal">
        <MockModalContent />
      </div>
    </div>
  )
}

