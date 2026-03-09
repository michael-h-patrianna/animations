import { memo } from 'react'
import { CardPackOpen as FramerCardPackOpen } from '../framer/CardPackOpen'

/**
 * CSS variant — delegates to Framer variant for now.
 * A pure CSS-keyframe implementation can replace this later.
 */
function CardPackOpenCssComponent({ prizeCount }: { prizeCount?: number }) {
  return <FramerCardPackOpen prizeCount={prizeCount} />
}

export const CardPackOpen = memo(CardPackOpenCssComponent)
