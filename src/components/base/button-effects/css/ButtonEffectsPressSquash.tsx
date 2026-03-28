/**
 * Catalog display for the Press Squash CSS effect.
 * Consumer product: ButtonEffectsPressSquash.css — apply .pf-press-squash + toggle --active.
 */
import {
  cloneElement,
  isValidElement,
  memo,
  useEffect,
  useState,
  type CSSProperties,
  type MouseEventHandler,
  type ReactElement,
  type ReactNode,
} from 'react'
import styles from './ButtonEffectsPressSquash.module.css'
import { DemoButton } from '@/components/demo-blocks'

interface ButtonEffectsPressSquashProps {
  children?: ReactNode
  duration?: number
}

type InteractiveChildProps = {
  className?: string
  style?: CSSProperties
  onClick?: MouseEventHandler<HTMLElement>
  'data-animation-id'?: string
}

function ButtonEffectsPressSquashComponent({
  children,
  duration = 300,
}: ButtonEffectsPressSquashProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (!isAnimating) return
    const timer = setTimeout(() => setIsAnimating(false), duration)
    return () => clearTimeout(timer)
  }, [duration, isAnimating])

  const sharedClassName = `${styles['pf-press-squash']}${isAnimating ? ` ${styles['pf-press-squash--active']}` : ''}`
  const sharedStyle = {
    ['--pf-press-squash-duration' as string]: `${duration}ms`,
  } as CSSProperties

  if (isValidElement(children)) {
    const child = children as ReactElement<InteractiveChildProps>

    return cloneElement(child, {
      className: [child.props.className, sharedClassName].filter(Boolean).join(' '),
      style: { ...sharedStyle, ...child.props.style },
      onClick: (event) => {
        child.props.onClick?.(event)
        setIsAnimating(true)
      },
      'data-animation-id': 'button-effects__press-squash',
    })
  }

  return (
    <DemoButton
      data-animation-id="button-effects__press-squash"
      className={sharedClassName}
      style={sharedStyle}
      onClick={() => setIsAnimating(true)}
      label={typeof children === 'string' ? children : 'Click Me!'}
    />
  )
}

export const ButtonEffectsPressSquash = memo(ButtonEffectsPressSquashComponent)
