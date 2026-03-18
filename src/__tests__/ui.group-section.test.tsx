import { GroupSection } from '@/components/ui/GroupSection'
import type { Group } from '@/types/animation'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

function makeGroup(overrides?: Partial<Group>): Group {
  return {
    id: 'standard-effects-framer',
    title: 'Standard effects (Framer)',
    tech: 'framer',
    animations: [
      {
        id: 'standard-effects__bounce',
        title: 'Bounce',
        description: 'A bounce animation',
        categoryId: 'base',
        groupId: 'standard-effects-framer',
      },
      {
        id: 'standard-effects__fade',
        title: 'Fade',
        description: 'A fade animation',
        categoryId: 'base',
        groupId: 'standard-effects-framer',
      },
    ],
    ...overrides,
  }
}

describe('GroupSection', () => {
  it('renders group title with animation count', () => {
    const group = makeGroup()
    render(<GroupSection group={group} elementId="test-section" />)

    expect(screen.getByText('Standard effects (Framer) (2)')).toHaveClass('pf-group__title')
  })

  it('sets the article id to the provided elementId', () => {
    const group = makeGroup()
    const { container } = render(<GroupSection group={group} elementId="section-42" />)

    const article = container.querySelector('#section-42')
    expect(article?.tagName).toBe('ARTICLE')
  })

  it('renders AnimationCard for each animation in the group', () => {
    const group = makeGroup()
    render(<GroupSection group={group} elementId="test-section" />)

    expect(screen.getByText('Bounce')).toBeVisible()
    expect(screen.getByText('Fade')).toBeVisible()
  })

  it('renders empty state when group has no animations', () => {
    const group = makeGroup({ animations: [] })
    render(<GroupSection group={group} elementId="test-section" />)

    expect(screen.getByText('Animations coming soon')).toHaveClass('pf-group__empty')
    expect(screen.queryByText('pf-card-grid')).not.toBeInTheDocument()
  })

  it('renders placeholder when animation component is not found in registry', () => {
    const group = makeGroup({
      animations: [
        {
          id: 'nonexistent__animation',
          title: 'Missing',
          description: 'Not in registry',
          categoryId: 'base',
          groupId: 'standard-effects-framer',
          infinite: true, // Must be infinite to render content immediately
        },
      ],
    })
    render(<GroupSection group={group} elementId="test-section" />)

    // Should show a placeholder div with the animation id
    expect(screen.getByText('nonexistent__animation')).toHaveClass('pf-card__placeholder')
  })

  it('renders card grid container when animations are present', () => {
    const group = makeGroup()
    const { container } = render(<GroupSection group={group} elementId="test-section" />)

    expect(container.querySelector('.pf-card-grid')?.childElementCount).toBeGreaterThanOrEqual(1)
  })

  it('shows animation count of zero in header for empty groups', () => {
    const group = makeGroup({ animations: [], title: 'Empty Group' })
    render(<GroupSection group={group} elementId="test-section" />)

    expect(screen.getByText('Empty Group (0)')).toHaveClass('pf-group__title')
  })

  it('resolves CSS group variant from registry', () => {
    const group = makeGroup({
      id: 'standard-effects-css',
      title: 'Standard effects (CSS)',
      tech: 'css',
      animations: [
        {
          id: 'standard-effects__bounce',
          title: 'Bounce',
          description: 'A bounce animation',
          categoryId: 'base',
          groupId: 'standard-effects-css',
          infinite: true,
        },
      ],
    })
    render(<GroupSection group={group} elementId="css-section" />)

    // Should render without error and show the animation title
    expect(screen.getByText('Bounce')).toBeVisible()
    expect(screen.getByText('Standard effects (CSS) (1)')).toHaveClass('pf-group__title')
  })

  it('passes lights control props to animation component when controls=lights', () => {
    const group = makeGroup({
      animations: [
        {
          id: 'standard-effects__bounce',
          title: 'Lights Animation',
          description: 'With lights controls',
          categoryId: 'base',
          groupId: 'standard-effects-framer',
          infinite: true,
          controls: 'lights',
        },
      ],
    })
    render(<GroupSection group={group} elementId="lights-section" />)

    // Should render lights controls in the AnimationCard
    expect(screen.getByLabelText('Number of bulbs')).toBeVisible()
    expect(screen.getByLabelText('Bulb color')).toBeVisible()
  })

  it('passes prizeCount control props to animation component when controls=prizeCount', () => {
    const group = makeGroup({
      animations: [
        {
          id: 'standard-effects__bounce',
          title: 'Prize Animation',
          description: 'With prize controls',
          categoryId: 'base',
          groupId: 'standard-effects-framer',
          infinite: true,
          controls: 'prizeCount',
          prizeCountMax: 3,
        },
      ],
    })
    render(<GroupSection group={group} elementId="prize-section" />)

    expect(screen.getByRole('button', { name: 'Show 1 prize' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Show 3 prizes' })).toBeVisible()
  })

  it('handles group with mixed infinite and non-infinite animations', () => {
    vi.useFakeTimers()

    const group = makeGroup({
      animations: [
        {
          id: 'standard-effects__bounce',
          title: 'Infinite Anim',
          description: 'Always visible',
          categoryId: 'base',
          groupId: 'standard-effects-framer',
          infinite: true,
        },
        {
          id: 'standard-effects__fade',
          title: 'One-shot Anim',
          description: 'Requires viewport entry',
          categoryId: 'base',
          groupId: 'standard-effects-framer',
          infinite: false,
        },
      ],
    })

    render(<GroupSection group={group} elementId="mixed-section" />)

    // Both animation titles should be rendered in the cards
    expect(screen.getByText('Infinite Anim')).toBeVisible()
    expect(screen.getByText('One-shot Anim')).toBeVisible()

    // Group header should show correct count
    expect(screen.getByText('Standard effects (Framer) (2)')).toHaveClass('pf-group__title')

    vi.useRealTimers()
  })

  it('renders disableReplay flag through to AnimationCard', () => {
    const group = makeGroup({
      animations: [
        {
          id: 'standard-effects__bounce',
          title: 'No Replay',
          description: 'Replay disabled',
          categoryId: 'base',
          groupId: 'standard-effects-framer',
          infinite: true,
          disableReplay: true,
        },
      ],
    })

    render(<GroupSection group={group} elementId="no-replay-section" />)

    expect(screen.getByRole('button', { name: 'Replay' })).toBeDisabled()
  })
})
