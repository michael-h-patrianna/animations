import type { AnimationMetadata } from '@/types/animation'
import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import './ModalBaseGlitchDigital.css'

export const metadata: AnimationMetadata = {
  id: 'modal-base__glitch-digital',
  title: 'Digital Glitch',
  description: 'Cyberpunk-inspired RGB channel separation with digital distortion artifacts.',
  tags: ['css'],
}

export function ModalBaseGlitchDigital() {
  return (
    <div
      className="modal-base-glitch-digital"
      data-animation-id="modal-base__glitch-digital"
    >
      <div className="modal-base-glitch-digital__center">
        {/* Ghost layers behind the modal for RGB channel separation effect */}
        <div className="modal-base-glitch-digital__ghost modal-base-glitch-digital__ghost--green">
          <MockModalContent />
        </div>
        <div className="modal-base-glitch-digital__ghost modal-base-glitch-digital__ghost--pink">
          <MockModalContent />
        </div>

        {/* Main modal with glitch skew animation */}
        <div className="modal-base-glitch-digital__modal">
          <MockModalContent />
        </div>
      </div>
    </div>
  )
}
