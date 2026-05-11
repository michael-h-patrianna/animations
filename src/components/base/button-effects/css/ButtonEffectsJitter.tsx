/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Catalog display for the Jitter CSS effect.
 * Consumer product: ButtonEffectsJitter.module.css — import styles and apply styles['pf-jitter'].
 */
import {
  cloneElement,
  isValidElement,
  memo,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react'
import styles from './ButtonEffectsJitter.module.css'
import { DemoButton } from '@/components/demo-blocks'

interface ButtonEffectsJitterProps {
  children?: ReactNode
  duration?: number
}

type InteractiveChildProps = {
  className?: string
  style?: CSSProperties
  'data-animation-id'?: string
}

function ButtonEffectsJitterComponent({ children, duration = 4000 }: ButtonEffectsJitterProps) {
  const sharedClassName = styles['pf-jitter']
  const sharedStyle = {
    ['--pf-jitter-duration' as string]: `${duration}ms`,
  } as CSSProperties

  if (isValidElement(children)) {
    const child = children as ReactElement<InteractiveChildProps>

    return cloneElement(child, {
      className: [child.props.className, sharedClassName].filter(Boolean).join(' '),
      style: { ...sharedStyle, ...child.props.style },
      'data-animation-id': 'button-effects__jitter',
    })
  }

  return (
    <DemoButton
      className={sharedClassName}
      style={sharedStyle}
      label={typeof children === 'string' ? children : 'Click Me!'}
      data-animation-id="button-effects__jitter"
    />
  )
}

export const ButtonEffectsJitter = memo(ButtonEffectsJitterComponent)
