/**
 * Demo mode wrappers for the animation catalog.
 *
 * Wraps animation components with demo UI (anchors, icons, status rows)
 * based on the animation's `demoMode` metadata field. The animation
 * component itself stays standalone — demo rendering is handled here.
 *
 * Demo modes are classified into two categories:
 * - **Standalone**: render a self-contained demo layout (icon-dot, status-row,
 *   list-rotate, score-pulse, visibility-cycle)
 * - **Anchor**: render Source/Target pills and pass refs as `from`/`to` props
 *   (burst, magnet, trail, fountain)
 */

import { homeIcon1 } from '@/assets'
import {
  CombatTextDemo,
  ListRotateDemo,
  ScorePulseDemo,
  VisibilityCycleDemo,
} from '@/components/ui/DataCycleDemoWrappers'
import { DemoAnchors } from '@/components/ui/DemoAnchors'
import type { AnimationMetadata } from '@/types/animation'
import { assertNever } from '@/utils/assertNever'
import React, { useRef } from 'react'

type DemoMode = NonNullable<AnimationMetadata['demoMode']>

interface DemoComponentProps {
  Component: React.ComponentType<Record<string, unknown>>
  controlProps: Record<string, unknown>
}

/** Renders a demo icon with the dot-indicator component overlaid. */
function IconDotDemo({ Component, controlProps }: DemoComponentProps) {
  return (
    <div className="pf-demo-icon-dot" data-testid="demo-icon-dot">
      <Component {...controlProps}>
        <img src={homeIcon1} alt="Home" className="pf-demo-icon-dot__icon" />
      </Component>
    </div>
  )
}

/** Renders a status row (dot + text) with the badge/ping component at the end. */
function StatusRowDemo({ Component, controlProps }: DemoComponentProps) {
  return (
    <div className="pf-demo-status-row" data-testid="demo-status-row">
      <span className="pf-demo-status-row__dot" data-testid="demo-status-row-dot" />
      <span className="pf-demo-status-row__text" data-testid="demo-status-row-text">
        Content update arrived
      </span>
      <Component {...controlProps} />
    </div>
  )
}

/** Wraps component with Source/Target demo anchors and passes refs. */
function AnchorDemo({
  Component,
  controlProps,
  mode,
}: DemoComponentProps & { mode: 'burst' | 'magnet' | 'trail' | 'fountain' }) {
  const fromRef = useRef<HTMLDivElement>(null)
  const toRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <DemoAnchors fromRef={fromRef} toRef={toRef} mode={mode} />
      <Component {...controlProps} from={fromRef} to={toRef} />
    </>
  )
}

/** Standalone demo components indexed by mode. */
const STANDALONE_DEMOS: Record<
  'icon-dot' | 'status-row' | 'list-rotate' | 'score-pulse' | 'visibility-cycle' | 'combat-text',
  React.ComponentType<DemoComponentProps>
> = {
  'icon-dot': IconDotDemo,
  'status-row': StatusRowDemo,
  'list-rotate': ListRotateDemo,
  'score-pulse': ScorePulseDemo,
  'visibility-cycle': VisibilityCycleDemo,
  'combat-text': CombatTextDemo,
}

/**
 * Wraps an animation component with demo UI for the catalog.
 *
 * Standalone modes render a self-contained layout. Anchor modes render
 * Source/Target pills at random positions and pass their refs as
 * `from`/`to` props to the animation component.
 */
export function DemoModeWrapper({
  mode,
  Component,
  controlProps,
}: {
  mode: DemoMode
  Component: React.ComponentType<Record<string, unknown>>
  controlProps: Record<string, unknown>
}) {
  switch (mode) {
    case 'icon-dot':
    case 'status-row':
    case 'list-rotate':
    case 'score-pulse':
    case 'visibility-cycle':
    case 'combat-text': {
      const StandaloneDemo = STANDALONE_DEMOS[mode]
      return <StandaloneDemo Component={Component} controlProps={controlProps} />
    }
    case 'burst':
    case 'magnet':
    case 'trail':
    case 'fountain':
      return <AnchorDemo Component={Component} controlProps={controlProps} mode={mode} />
    default:
      return assertNever(mode)
  }
}
