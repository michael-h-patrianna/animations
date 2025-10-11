import type { AnimationMetadata } from '@/types/animation'
import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import './ModalBaseSpringBounce.css'

export const metadata: AnimationMetadata = {
  id: 'modal-base__spring-bounce',
  title: 'Spring Bounce',
  description:
    'Elastic spring entrance with dynamic bounce physics and smooth overlay transition. GPU-accelerated CSS keyframes.',
  tags: ['css'],
}

export function ModalBaseSpringBounce() {
  return (
    <div
      className="pf-modal-overlay pf-modal-overlay--spring-bounce"
      data-animation-id="modal-base__spring-bounce"
    >
      <div className="pf-modal-center">
        <div className="pf-modal pf-modal--spring-bounce">
          <MockModalContent />
        </div>
      </div>
    </div>
  )
}
