import type { AnimationMetadata } from '@/types/animation'
import { MockModalContent } from '../MockModalContent'
import '../shared.css'
import './ModalBaseSlideUpSoft.css'

export const metadata: AnimationMetadata = {
  id: 'modal-base__slide-up-soft',
  title: 'Slide Up Soft',
  description:
    'Slides up from 64px with 92% scale and fade-in using CSS keyframes. GPU-accelerated with transform and opacity.',
  tags: ['css'],
}

export function ModalBaseSlideUpSoft() {
  return (
    <div
      className="pf-modal-overlay pf-modal-overlay--slide-up-soft"
      data-animation-id="modal-base__slide-up-soft"
    >
      <div className="pf-modal-center">
        <div className="pf-modal pf-modal--slide-up-soft">
          <MockModalContent />
        </div>
      </div>
    </div>
  )
}
