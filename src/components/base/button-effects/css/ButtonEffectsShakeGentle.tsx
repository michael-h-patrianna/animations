/**
 * Reduced-motion note: catalog-only data-reduced-motion mirroring supplements
 * OS @media (prefers-reduced-motion) rules; consumers do not need to copy it.
 * Catalog display for the Shake Gentle CSS effect.
 * Consumer product: ButtonEffectsShakeGentle.module.css — import styles and apply styles['pf-shake-gentle'], toggle --active.
 */
import {
  cloneElement,
  isValidElement,
  memo,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEventHandler,
  type ReactElement,
  type ReactNode,
} from 'react'
import styles from './ButtonEffectsShakeGentle.module.css'
import { DemoButton } from '@/components/demo-blocks'

interface ButtonEffectsShakeGentleProps {
  children?: ReactNode
  duration?: number
  trigger?: boolean
}

type InteractiveChildProps = {
  className?: string
  style?: CSSProperties
  onClick?: MouseEventHandler<HTMLElement>
  'data-animation-id'?: string
  'aria-label'?: string
  'aria-live'?: string
}

function ButtonEffectsShakeGentleComponent({
  children,
  duration = 400,
  trigger,
}: ButtonEffectsShakeGentleProps) {
  const [isAnimating, setIsAnimating] = useState(trigger === undefined)
  const prevTriggerRef = useRef(trigger)

  useEffect(() => {
    if (!isAnimating) return
    const timer = setTimeout(() => setIsAnimating(false), duration)
    return () => clearTimeout(timer)
  }, [duration, isAnimating])

  useEffect(() => {
    if (trigger === undefined) return
    if (trigger && !prevTriggerRef.current) {
      setIsAnimating(true)
    }
    prevTriggerRef.current = trigger
  }, [trigger])

  const sharedClassName = `${styles['pf-shake-gentle']}${isAnimating ? ` ${styles['pf-shake-gentle--active']}` : ''}`
  const sharedStyle = { ['--pf-shake-gentle-duration' as string]: `${duration}ms` } as CSSProperties

  if (isValidElement(children)) {
    const child = children as ReactElement<InteractiveChildProps>

    return cloneElement(child, {
      className: [child.props.className, sharedClassName].filter(Boolean).join(' '),
      style: { ...sharedStyle, ...child.props.style },
      onClick: (event) => {
        child.props.onClick?.(event)
        setIsAnimating(true)
      },
      'data-animation-id': 'button-effects__shake-gentle',
      'aria-label': child.props['aria-label'],
      'aria-live': child.props['aria-live'],
    })
  }

  return (
    <DemoButton
      data-animation-id="button-effects__shake-gentle"
      className={sharedClassName}
      style={sharedStyle}
      onClick={() => setIsAnimating(true)}
      aria-label="Insufficient funds"
      aria-live="polite"
      label={typeof children === 'string' ? children : 'Click Me'}
    />
  )
}

export const ButtonEffectsShakeGentle = memo(ButtonEffectsShakeGentleComponent)
