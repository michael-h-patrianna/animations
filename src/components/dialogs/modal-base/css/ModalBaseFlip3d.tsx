import type { AnimationMetadata } from '@/types/animation'
import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import './ModalBaseFlip3d.css'

export function ModalBaseFlip3d() {
  return (
    <div className="modal-base-flip3d" data-animation-id="modal-base__flip-3d">
      <div className="modal-base-flip3d__center">
        <div className="modal-base-flip3d__modal">
          <MockModalContent />
        </div>
      </div>
    </div>
  )
}

export const metadata: AnimationMetadata = {
  id: 'modal-base__flip-3d',
  title: '3D Card Flip',
  description: 'Card game style 3D rotation reveal with perspective depth and overshoot.',
  tags: ['css'],
}
