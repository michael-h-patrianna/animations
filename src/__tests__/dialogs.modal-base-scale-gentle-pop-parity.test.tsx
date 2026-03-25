import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ModalBaseScaleGentlePop as CssModalBaseScaleGentlePop } from '@/components/dialogs/modal-base/css/ModalBaseScaleGentlePop'
import { metadata as cssMetadata } from '@/components/dialogs/modal-base/css/ModalBaseScaleGentlePop.meta'
import { metadata as framerMetadata } from '@/components/dialogs/modal-base/framer/ModalBaseScaleGentlePop.meta'

function hasOnAnimationCompleteProp(
  props: ReadonlyArray<{
    name: string
  }> = []
) {
  return props.some((prop) => prop.name === 'onAnimationComplete')
}

describe('modal-base scale gentle pop parity', () => {
  it('keeps onAnimationComplete advertised in both metadata variants', () => {
    expect(hasOnAnimationCompleteProp(framerMetadata.props)).toBe(true)
    expect(hasOnAnimationCompleteProp(cssMetadata.props)).toBe(true)
  })

  it('fires onAnimationComplete when the CSS wrapper animation finishes', () => {
    const onAnimationComplete = vi.fn()
    const { container } = render(
      <CssModalBaseScaleGentlePop onAnimationComplete={onAnimationComplete} />
    )

    const wrapper = container.querySelector('.pf-modal-scale-pop')

    expect(wrapper).toBeInTheDocument()

    fireEvent.animationEnd(wrapper as Element)

    expect(onAnimationComplete).toHaveBeenCalledOnce()
  })
})
