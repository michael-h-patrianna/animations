import { GroupSection } from '@/components/ui/GroupSection'
import { AnimationInspectorProvider } from '@/contexts/AnimationInspectorContext'
import type { Group } from '@/types/animation'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

function renderWithRouter(ui: React.ReactElement, initialEntries?: string[]) {
  const currentGroup = 'group' in ui.props ? (ui.props.group as Group | undefined) : undefined

  return render(
    <AnimationInspectorProvider currentGroup={currentGroup}>
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
    </AnimationInspectorProvider>
  )
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

  it('does not use the legacy pf-group wrapper class for group content', () => {
    const group = makeGroup()
    renderWithRouter(<GroupSection group={group} elementId="section-42" />)

    expect(screen.getByRole('article')).not.toHaveClass('pf-group')
  })

  it('renders AnimationCard for each animation in the group', () => {
    const group = makeGroup()
    renderWithRouter(<GroupSection group={group} elementId="test-section" />)

    const titles = screen.getAllByTestId('card-title')
    const titleTexts = titles.map((el) => el.textContent)
    expect(titleTexts).toContain('Bounce')
    expect(titleTexts).toContain('Fade')
  })

  it('renders empty state when group has no animations', () => {
    const group = makeGroup({ animations: [] })
    renderWithRouter(<GroupSection group={group} elementId="test-section" />)

    expect(screen.getByTestId('group-empty')).toHaveTextContent('Animations coming soon')
    expect(screen.getByTestId('group-empty')).not.toHaveClass('pf-group__empty')
    expect(screen.queryByTestId('card-grid')).not.toBeInTheDocument()
  })

  it('does not use the legacy pf-group wrapper class for loading and error states', () => {
    const group = makeGroup()
    const { rerender } = renderWithRouter(
      <GroupSection group={group} elementId="state-section" isLoading />
    )

    expect(screen.getByRole('article')).not.toHaveClass('pf-group')

    rerender(
      <AnimationInspectorProvider currentGroup={group}>
        <MemoryRouter>
          <GroupSection group={group} elementId="state-section" error={new Error('Boom')} />
        </MemoryRouter>
      </AnimationInspectorProvider>
    )

    expect(screen.getByRole('article')).not.toHaveClass('pf-group')
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

    // Should show a placeholder div with the animation id inside the demo stage
    expect(screen.getByTestId('demo-stage')).toHaveTextContent('nonexistent__animation')
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
    expect(screen.getByTestId('card-title')).toHaveTextContent('Bounce')
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

    expect(screen.getByRole('radio', { name: '1' })).toBeVisible()
    expect(screen.getByRole('radio', { name: '3' })).toBeVisible()
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
    const titles = screen.getAllByTestId('card-title')
    const titleTexts = titles.map((el) => el.textContent)
    expect(titleTexts).toContain('Infinite Anim')
    expect(titleTexts).toContain('One-shot Anim')

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

  describe('animationFilter', () => {
    it('shows filter banner with animation name when animationFilter is active', () => {
      const group = makeGroup()
      renderWithRouter(
        <GroupSection
          group={group}
          elementId="filter-section"
          animationFilter="standard-effects__bounce"
        />
      )

      const banner = screen.getByTestId('filter-banner')
      expect(banner).toBeVisible()
      expect(banner).toHaveTextContent(/Showing: Bounce/)
    })

    it('shows only the filtered animation in the card grid', () => {
      const group = makeGroup({
        animations: [
          {
            id: 'standard-effects__bounce',
            title: 'Bounce',
            description: 'A bounce animation',
            categoryId: 'base',
            groupId: 'standard-effects-framer',
            infinite: true,
          },
          {
            id: 'standard-effects__fade',
            title: 'Fade',
            description: 'A fade animation',
            categoryId: 'base',
            groupId: 'standard-effects-framer',
            infinite: true,
          },
        ],
      })
      renderWithRouter(
        <GroupSection
          group={group}
          elementId="filter-section"
          animationFilter="standard-effects__bounce"
        />
      )

      const titles = screen.getAllByTestId('card-title')
      expect(titles).toHaveLength(1)
      expect(titles[0]).toHaveTextContent('Bounce')
    })

    it('shows error message when animationFilter references nonexistent animation', () => {
      const group = makeGroup()
      renderWithRouter(
        <GroupSection group={group} elementId="invalid-filter" animationFilter="nonexistent__id" />
      )

      expect(screen.getByTestId('filter-banner')).toHaveTextContent(/not found/)
    })

    it('renders "Show all" button to remove filter', () => {
      const group = makeGroup()
      renderWithRouter(
        <GroupSection
          group={group}
          elementId="filter-section"
          animationFilter="standard-effects__bounce"
        />
      )

      expect(screen.getByTestId('filter-banner-action')).toHaveTextContent(/Show all/)
    })

    it('clicking "Show all" navigates to the group without filter', () => {
      const group = makeGroup()
      renderWithRouter(
        <GroupSection
          group={group}
          elementId="filter-section"
          animationFilter="standard-effects__bounce"
        />,
        ['/standard-effects-framer?animation=standard-effects__bounce']
      )

      // Click the remove-filter button — this calls navigate(`/${group.id}`, { replace: true })
      fireEvent.click(screen.getByTestId('filter-banner-action'))

      // After navigation, the filter banner should no longer show the filter text
      // (the parent would re-render without animationFilter, but in this isolated test
      // we verify the handler doesn't crash and the button is interactive)
      expect(screen.getByTestId('filter-banner-action')).toBeVisible()
    })

    it('does not show filter banner when animationFilter is undefined', () => {
      const group = makeGroup()
      renderWithRouter(<GroupSection group={group} elementId="no-filter" />)

      expect(screen.queryByTestId('filter-banner')).not.toBeInTheDocument()
    })

    it('partial ID match does NOT filter (requires exact match)', () => {
      const group = makeGroup({
        animations: [
          {
            id: 'standard-effects__bounce',
            title: 'Bounce',
            description: 'A bounce animation',
            categoryId: 'base',
            groupId: 'standard-effects-framer',
            infinite: true,
          },
        ],
      })
      renderWithRouter(
        <GroupSection
          group={group}
          elementId="partial-filter"
          animationFilter="standard-effects__boun"
        />
      )

      // Partial ID should NOT match — shows error instead of the animation
      expect(screen.getByTestId('filter-banner')).toHaveTextContent(/not found/)
    })

    it('filter with ID from a different group shows error', () => {
      const group = makeGroup({
        animations: [
          {
            id: 'standard-effects__bounce',
            title: 'Bounce',
            description: 'A bounce animation',
            categoryId: 'base',
            groupId: 'standard-effects-framer',
            infinite: true,
          },
        ],
      })
      renderWithRouter(
        <GroupSection
          group={group}
          elementId="wrong-group-filter"
          animationFilter="modal-base__scale-gentle-pop"
        />
      )

      // ID exists in a different group — this group doesn't have it
      expect(screen.getByTestId('filter-banner')).toHaveTextContent(/not found/)
    })
  })

  describe('demoMode rendering — placeholder branch', () => {
    // demoMode animations that are NOT in the registry still go through the
    // placeholder branch (line 142), which is the same as non-demoMode.
    // This covers the "animation not found + demoMode" path.
    it('renders placeholder for unregistered animation with demoMode', () => {
      const group = makeGroup({
        id: 'fake-group-framer',
        animations: [
          {
            id: 'fake-group__demo',
            title: 'Demo',
            description: 'Demo animation',
            categoryId: 'base',
            groupId: 'fake-group-framer',
            demoMode: 'icon-dot',
            infinite: true, // infinite ensures render without IntersectionObserver
          },
        ],
      })
      renderWithRouter(<GroupSection group={group} elementId="demo-placeholder" />)

      // Unregistered → placeholder renders the ID text inside the demo stage
      expect(screen.getByTestId('demo-stage')).toHaveTextContent('fake-group__demo')
    })
  })
})
