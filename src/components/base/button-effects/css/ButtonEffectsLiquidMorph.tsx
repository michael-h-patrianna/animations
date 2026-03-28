/**
 * Catalog display for the Liquid Morph CSS effect.
 * Consumer product: ButtonEffectsLiquidMorph.module.css — import styles and apply styles['pf-liquid-morph'], toggle --active.
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
import styles from './ButtonEffectsLiquidMorph.module.css'
import { DemoButton } from '@/components/demo-blocks'

interface ButtonEffectsLiquidMorphProps {
  children?: ReactNode
  duration?: number
}

type InteractiveChildProps = {
  className?: string
  style?: CSSProperties
  onClick?: MouseEventHandler<HTMLElement>
  'data-animation-id'?: string
}

function ButtonEffectsLiquidMorphComponent({
  children,
  duration = 600,
}: ButtonEffectsLiquidMorphProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (!isAnimating) return
    const timer = setTimeout(() => setIsAnimating(false), duration)
    return () => clearTimeout(timer)
  }, [duration, isAnimating])

  const sharedClassName = `${styles['pf-liquid-morph']}${isAnimating ? ` ${styles['pf-liquid-morph--active']}` : ''}`
  const sharedStyle = {
    ['--pf-liquid-morph-duration' as string]: `${duration}ms`,
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
      'data-animation-id': 'button-effects__liquid-morph',
    })
  }

  return (
    <DemoButton
      data-animation-id="button-effects__liquid-morph"
      className={sharedClassName}
      style={sharedStyle}
      onClick={() => setIsAnimating(true)}
      label={typeof children === 'string' ? children : 'Click Me!'}
    />
  )
}

export const ButtonEffectsLiquidMorph = memo(ButtonEffectsLiquidMorphComponent)
