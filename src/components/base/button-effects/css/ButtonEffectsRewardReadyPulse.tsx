/**
 * Catalog display for the Reward Ready Pulse CSS effect.
 * Consumer product: ButtonEffectsRewardReadyPulse.css — apply .pf-reward-pulse to any element.
 */
import {
  cloneElement,
  isValidElement,
  memo,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react'
import './ButtonEffectsRewardReadyPulse.css'
import { DemoButton } from '@/components/demo-blocks'

interface ButtonEffectsRewardReadyPulseProps {
  children?: ReactNode
  duration?: number
  pulseScale?: number
  bobDistance?: number
}

type InteractiveChildProps = {
  className?: string
  style?: CSSProperties
  'data-animation-id'?: string
}

function ButtonEffectsRewardReadyPulseComponent({
  children,
  duration = 2000,
  pulseScale = 1.08,
  bobDistance = 4,
}: ButtonEffectsRewardReadyPulseProps) {
  const sharedClassName = 'pf-reward-pulse'
  const sharedStyle = {
    ['--pf-reward-pulse-duration' as string]: `${duration}ms`,
    ['--pf-reward-pulse-scale' as string]: String(pulseScale),
    ['--pf-reward-pulse-bob' as string]: `${bobDistance}px`,
  } as CSSProperties

  if (isValidElement(children)) {
    const child = children as ReactElement<InteractiveChildProps>

    return cloneElement(child, {
      className: [child.props.className, sharedClassName].filter(Boolean).join(' '),
      style: { ...sharedStyle, ...child.props.style },
      'data-animation-id': 'button-effects__reward-ready-pulse',
    })
  }

  return (
    <DemoButton
      className={sharedClassName}
      style={sharedStyle}
      label={typeof children === 'string' ? children : 'Claim Reward'}
      data-animation-id="button-effects__reward-ready-pulse"
    />
  )
}

export const ButtonEffectsRewardReadyPulse = memo(ButtonEffectsRewardReadyPulseComponent)
