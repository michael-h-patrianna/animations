import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import './ModalBaseGlitchDigital.css'


/**
 *
 */
export function ModalBaseGlitchDigital() {
  return (
    <div
      className="modal-base-tfx-glitchdigital"
      data-animation-id="modal-base__tfx-glitchdigital"
    >
      <div className="modal-base-tfx-glitchdigital__center">
        {/* Ghost layers behind the modal for RGB channel separation effect */}
        <div
          className="modal-base-tfx-glitchdigital__ghost modal-base-tfx-glitchdigital__ghost--green"
          aria-hidden="true"
        >
          <MockModalContent />
        </div>
        <div
          className="modal-base-tfx-glitchdigital__ghost modal-base-tfx-glitchdigital__ghost--pink"
          aria-hidden="true"
        >
          <MockModalContent />
        </div>

        {/* Main modal with glitch skew animation */}
        <div className="modal-base-tfx-glitchdigital__modal">
          <MockModalContent />
        </div>
      </div>
    </div>
  )
}
