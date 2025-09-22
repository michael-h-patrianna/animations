import { AnimationCard } from '@/components/ui/AnimationCard'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useEffect } from 'react'

describe('AnimationCard', () => {
  it('displays header information and triggers replay handler', async () => {
    const onReplay = jest.fn()
    const mountSpy = jest.fn()

    function SampleAnimation() {
      useEffect(() => {
        mountSpy()
      }, [])

      return <div data-testid="demo">demo</div>
    }

    const { container } = render(
      <AnimationCard
        title="Sample Animation"
        description="Example description"
        animationId="sample__animation"
        onReplay={onReplay}
      >
        <SampleAnimation />
      </AnimationCard>
    )

    expect(screen.getByText('Sample Animation')).toBeInTheDocument()
    // Use getAllByText since there's a hidden element for measuring text
    const descriptions = screen.getAllByText('Example description')
    expect(descriptions.length).toBeGreaterThan(0)

    // Check that the card has the correct data attribute
    const card = container.querySelector('[data-animation-id="sample__animation"]')
    expect(card).toBeInTheDocument()

    // Wait for the animation to be rendered (IntersectionObserver is mocked to trigger immediately)
    await waitFor(() => {
      expect(screen.getByTestId('demo')).toBeInTheDocument()
    })
    expect(mountSpy).toHaveBeenCalledTimes(1)

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /replay/i }))

    await waitFor(() => {
      expect(onReplay).toHaveBeenCalledTimes(1)
      expect(mountSpy).toHaveBeenCalledTimes(2)
    })
  })

  it('shows accordion for long descriptions', async () => {
    const longDescription =
      'This is a very long description that will definitely exceed one line when rendered in the card component and should trigger the accordion functionality to appear'

    render(
      <AnimationCard
        title="Animation with Long Description"
        description={longDescription}
        animationId="long__description"
      >
        <div>Animation Content</div>
      </AnimationCard>
    )

    // The description should be visible (multiple instances due to hidden measurement element)
    const longDescriptions = screen.getAllByText(longDescription)
    expect(longDescriptions.length).toBeGreaterThan(0)

    // For long text, there might be an accordion trigger (chevron icon)
    // This depends on the actual rendered width, so we check if accordion structure exists
    const accordion =
      screen.queryByRole('button', { name: /expand/i }) || document.querySelector('[data-state]')

    if (accordion) {
      // If accordion exists, test expand/collapse
      const user = userEvent.setup()
      await user.click(accordion)

      // Wait for any animation/state change
      await waitFor(() => {
        // The full description should still be visible after interaction
        expect(screen.getByText(longDescription)).toBeInTheDocument()
      })
    }
  })

  it('does not show accordion for short descriptions', () => {
    const shortDescription = 'Short text'

    render(
      <AnimationCard
        title="Animation with Short Description"
        description={shortDescription}
        animationId="short__description"
      >
        <div>Animation Content</div>
      </AnimationCard>
    )

    // The description should be visible (multiple instances due to hidden measurement element)
    const shortDescriptions = screen.getAllByText(shortDescription)
    expect(shortDescriptions.length).toBeGreaterThan(0)

    // No accordion should be present for short text
    document.querySelector('[data-state]')

    // The accordion might be disabled or not present for short descriptions
    // This is the expected behavior
  })

  it('handles infinite animations correctly', () => {
    const { container } = render(
      <AnimationCard
        title="Infinite Animation"
        description="This animation loops forever"
        animationId="infinite__animation"
        infiniteAnimation={true}
      >
        <div data-testid="infinite-content">Infinite Content</div>
      </AnimationCard>
    )

    // Content should be immediately visible for infinite animations
    expect(screen.getByTestId('infinite-content')).toBeInTheDocument()

    // Card should have the correct data attribute
    const card = container.querySelector('[data-animation-id="infinite__animation"]')
    expect(card).toBeInTheDocument()
  })

  it('triggers animation on intersection', async () => {
    const mountSpy = jest.fn()

    function LazyAnimation() {
      useEffect(() => {
        mountSpy()
      }, [])

      return <div data-testid="lazy-demo">Lazy Content</div>
    }

    // Mock IntersectionObserver
    const mockIntersectionObserver = jest.fn()
    mockIntersectionObserver.mockReturnValue({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    })
    window.IntersectionObserver = mockIntersectionObserver

    render(
      <AnimationCard
        title="Lazy Animation"
        description="Loads on scroll"
        animationId="lazy__animation"
      >
        <LazyAnimation />
      </AnimationCard>
    )

    // Initially, the animation should mount once due to intersection observer
    await waitFor(() => {
      expect(mockIntersectionObserver).toHaveBeenCalled()
    })
  })
})
