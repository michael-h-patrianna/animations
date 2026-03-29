import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { DemoModeWrapper } from '@/components/ui/DemoModeWrappers'

/** Serializes props safely, replacing non-serializable values (refs, ReactNode) with type tags. */
function safeSerializeProps(props: Record<string, unknown>): string {
  return JSON.stringify(props, (_key, value) => {
    if (value !== null && typeof value === 'object' && 'current' in value) return '[ref]'
    if (typeof value === 'function') return '[function]'
    // React elements
    if (value !== null && typeof value === 'object' && '$$typeof' in value) return '[ReactNode]'
    return value
  })
}

function StubComponent(props: Record<string, unknown>) {
  return <div data-testid="stub" data-props={safeSerializeProps(props)} />
}

describe('DemoModeWrapper', () => {
  // ── Standalone modes ──────────────────────────────────────────────────

  it('renders icon-dot demo layout', () => {
    render(<DemoModeWrapper mode="icon-dot" Component={StubComponent} controlProps={{}} />)
    expect(screen.getByTestId('demo-icon-dot')).toHaveAttribute('data-testid', 'demo-icon-dot')
    // Stub component receives props
    expect(screen.getByTestId('stub')).toHaveAttribute('data-testid', 'stub')
  })

  it('renders status-row demo layout with dot and text', () => {
    render(<DemoModeWrapper mode="status-row" Component={StubComponent} controlProps={{}} />)
    expect(screen.getByTestId('demo-status-row')).toHaveAttribute('data-testid', 'demo-status-row')
    expect(screen.getByTestId('demo-status-row-dot')).toHaveAttribute(
      'data-testid',
      'demo-status-row-dot'
    )
    expect(screen.getByTestId('demo-status-row-text').textContent).toBe('Content update arrived')
  })

  it('renders list-rotate via DataCycleDemoWrappers', () => {
    render(<DemoModeWrapper mode="list-rotate" Component={StubComponent} controlProps={{}} />)
    // ListRotateDemo renders the Component with items prop
    expect(screen.getByTestId('stub')).toHaveAttribute('data-testid', 'stub')
  })

  it('renders score-pulse via DataCycleDemoWrappers', () => {
    render(<DemoModeWrapper mode="score-pulse" Component={StubComponent} controlProps={{}} />)
    expect(screen.getByTestId('stub')).toHaveAttribute('data-testid', 'stub')
  })

  it('renders visibility-cycle via DataCycleDemoWrappers', () => {
    render(<DemoModeWrapper mode="visibility-cycle" Component={StubComponent} controlProps={{}} />)
    expect(screen.getByTestId('stub')).toHaveAttribute('data-testid', 'stub')
  })

  // ── Anchor modes ──────────────────────────────────────────────────────

  it('renders burst anchor mode with from/to refs passed to component', () => {
    render(<DemoModeWrapper mode="burst" Component={StubComponent} controlProps={{ x: 1 }} />)
    const stub = screen.getByTestId('stub')
    const props = JSON.parse(stub.getAttribute('data-props')!)
    // AnchorDemo passes from and to as refs (serialized as '[ref]')
    expect(props.from).toBe('[ref]')
    expect(props.to).toBe('[ref]')
    expect(props.x).toBe(1)
  })

  it('renders magnet anchor mode with refs', () => {
    render(<DemoModeWrapper mode="magnet" Component={StubComponent} controlProps={{}} />)
    const stub = screen.getByTestId('stub')
    const props = JSON.parse(stub.getAttribute('data-props')!)
    expect(props.from).toBe('[ref]')
    expect(props.to).toBe('[ref]')
  })

  it('renders trail anchor mode with refs', () => {
    render(<DemoModeWrapper mode="trail" Component={StubComponent} controlProps={{}} />)
    const stub = screen.getByTestId('stub')
    const props = JSON.parse(stub.getAttribute('data-props')!)
    expect(props.from).toBe('[ref]')
    expect(props.to).toBe('[ref]')
  })

  it('renders fountain anchor mode with refs', () => {
    render(<DemoModeWrapper mode="fountain" Component={StubComponent} controlProps={{}} />)
    const stub = screen.getByTestId('stub')
    const props = JSON.parse(stub.getAttribute('data-props')!)
    expect(props.from).toBe('[ref]')
    expect(props.to).toBe('[ref]')
  })
})
