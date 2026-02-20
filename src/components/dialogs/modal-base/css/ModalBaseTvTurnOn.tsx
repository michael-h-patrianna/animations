import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import './ModalBaseTvTurnOn.css'


/**
 *
 */
export function ModalBaseTvTurnOn() {
  return (
    <div
      className="pf-modal-overlay pf-modal-overlay--tv-turn-on"
      data-animation-id="modal-base__tv-turn-on"
    >
      <div className="pf-modal-center">
        <div className="pf-modal pf-modal--tv-turn-on">
          <MockModalContent />
        </div>
      </div>
    </div>
  )
}

