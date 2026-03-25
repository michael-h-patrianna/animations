/**
 * Catalog display for the Slide CSS effect.
 * Consumer product: StandardEffectsSlide.css — apply .pf-slide to any element.
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import './StandardEffectsSlide.css'
import { DemoBox } from '@/components/demo-blocks'

interface StandardEffectsSlideProps {
  children?: ReactNode
  duration?: number
}

function StandardEffectsSlideComponent({ children, duration = 700 }: StandardEffectsSlideProps) {
  const style = {
    display: 'inline-flex',
    ['--pf-slide-duration' as string]: `${duration}ms`,
  } as CSSProperties

  return (
    <div className="pf-slide" data-animation-id="standard-effects__slide" style={style}>
      {children ?? <DemoBox label="Slide" />}
    </div>
  )
}

export const StandardEffectsSlide = memo(StandardEffectsSlideComponent)
