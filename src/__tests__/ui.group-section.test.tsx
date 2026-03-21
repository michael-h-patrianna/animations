import { GroupSection } from '@/components/ui/GroupSection'
import type { Group } from '@/types/animation'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

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
  it('sets the article id to the provided elementId', () => {
    const group = makeGroup()
    renderWithRouter(<GroupSection group={group} elementId="section-42" />)

    const article = screen.getByRole('article')
    expect(article).toHaveAttribute('id', 'section-42')
  })

  it('renders AnimationCard for each animation in the group', () => {
    const group = makeGroup()
    renderWithRouter(<GroupSection group={group} elementId="test-section" />)

    expect(screen.getByText('Bounce')).toBeVisible()
    expect(screen.getByText('Fade')).toBeVisible()
  })

  it('renders empty state when group has no animations', () => {
    const group = makeGroup({ animations: [] })
    renderWithRouter(<GroupSection group={group} elementId="test-section" />)

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
    renderWithRouter(<GroupSection group={group} elementId="test-section" />)

    // Should show a placeholder div with the animation id
    expect(screen.getByText('nonexistent__animation')).toHaveClass('pf-card__placeholder')
  })

  it('renders card grid container when animations are present', () => {
    const group = makeGroup()
    renderWithRouter(<GroupSection group={group} elementId="test-section" />)

    // Each animation should render a card with a title
    const cardTitles = screen.getAllByTestId('card-title')
    expect(cardTitles.length).toBeGreaterThanOrEqual(1)
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
    renderWithRouter(<GroupSection group={group} elementId="css-section" />)

    // Should render without error and show the animation title
    expect(screen.getByText('Bounce')).toBeVisible()
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
    renderWithRouter(<GroupSection group={group} elementId="lights-section" />)

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
    renderWithRouter(<GroupSection group={group} elementId="prize-section" />)

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

    renderWithRouter(<GroupSection group={group} elementId="mixed-section" />)

    // Both animation titles should be rendered in the cards
    expect(screen.getByText('Infinite Anim')).toBeVisible()
    expect(screen.getByText('One-shot Anim')).toBeVisible()

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

    renderWithRouter(<GroupSection group={group} elementId="no-replay-section" />)

    expect(screen.getByRole('button', { name: 'Replay' })).toBeDisabled()
  })
})
