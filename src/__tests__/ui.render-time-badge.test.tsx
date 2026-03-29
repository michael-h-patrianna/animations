import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { RenderTimeBadge } from '@/components/ui/RenderTimeBadge'

describe('RenderTimeBadge', () => {
  it('returns null when profile is null', () => {
    render(<RenderTimeBadge profile={null} />)
    expect(screen.queryByTestId('render-time-badge')).toBeNull()
  })

  it('displays actual duration formatted to 1 decimal', () => {
    render(<RenderTimeBadge profile={{ actualDuration: 2.345, baseDuration: 5.0 }} />)
    const badge = screen.getByTestId('render-time-badge')
    expect(badge.textContent).toBe('2.3ms')
  })

  it('applies green color for sub-4ms renders', () => {
    render(<RenderTimeBadge profile={{ actualDuration: 1.5, baseDuration: 3.0 }} />)
    const badge = screen.getByTestId('render-time-badge')
    const style = badge.getAttribute('style') ?? ''
    expect(style).toContain('--text-success')
  })

  it('applies yellow color for 4-16ms renders', () => {
    render(<RenderTimeBadge profile={{ actualDuration: 8.0, baseDuration: 10.0 }} />)
    const badge = screen.getByTestId('render-time-badge')
    const style = badge.getAttribute('style') ?? ''
    expect(style).toContain('--text-warning')
  })

  it('applies red color for >16ms renders', () => {
    render(<RenderTimeBadge profile={{ actualDuration: 20.0, baseDuration: 25.0 }} />)
    const badge = screen.getByTestId('render-time-badge')
    const style = badge.getAttribute('style') ?? ''
    expect(style).toContain('--text-danger')
  })
})
