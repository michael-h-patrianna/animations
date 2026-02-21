import { AnimationCard } from '@/components/ui/AnimationCard'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useEffect } from 'react'

describe('AnimationCard replay and visibility', () => {
  it('displays header info and triggers replay remount', async () => {
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
    expect(screen.getAllByText('Example description').length).toBeGreaterThan(0)
    expect(container.querySelector('[data-animation-id="sample__animation"]')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByTestId('demo')).toBeInTheDocument()
      expect(mountSpy).toHaveBeenCalledTimes(1)
    })

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /replay/i }))

    await waitFor(() => {
      expect(onReplay).toHaveBeenCalledTimes(1)
      expect(mountSpy).toHaveBeenCalledTimes(2)
    })
  })

  it('handles infinite animations correctly', () => {
    render(
      <AnimationCard
        title="Infinite Animation"
        description="This animation loops forever"
        animationId="infinite__animation"
        infiniteAnimation
      >
        <div data-testid="infinite-content">Infinite Content</div>
      </AnimationCard>
    )

    expect(screen.getByTestId('infinite-content')).toBeInTheDocument()
  })

  it('triggers animation render on intersection', async () => {
    const mountSpy = jest.fn()

    function LazyAnimation() {
      useEffect(() => {
        mountSpy()
      }, [])
      return <div data-testid="lazy-demo">Lazy Content</div>
    }

    render(
      <AnimationCard title="Lazy Animation" description="Loads on scroll" animationId="lazy__animation">
        <LazyAnimation />
      </AnimationCard>
    )

    await waitFor(() => {
      expect(screen.getByTestId('lazy-demo')).toBeInTheDocument()
      expect(mountSpy).toHaveBeenCalledTimes(1)
    })
  })
})

describe('AnimationCard description control', () => {
  it('toggles description expansion with chevron control', async () => {
    const user = userEvent.setup()

    render(
      <AnimationCard title="Desc Toggle" description="Long enough description to toggle" animationId="desc__toggle">
        <div>Animation Content</div>
      </AnimationCard>
    )

    const toggle = screen.getByRole('button', { name: /expand description/i })
    await user.click(toggle)
    expect(screen.getByRole('button', { name: /collapse description/i })).toBeInTheDocument()
  })
})

describe('AnimationCard lights controls', () => {
  it('uses a valid hex default for lights color picker', () => {
    document.documentElement.style.setProperty('--pf-anim-gold', '#ffd700')

    render(
      <AnimationCard
        title="Lights Animation"
        description="Lights preview"
        animationId="lights__picker"
        infiniteAnimation
      >
        {() => <div>Lights Content</div>}
      </AnimationCard>
    )

    const colorPicker = screen.getByLabelText('Bulb color') as HTMLInputElement
    expect(colorPicker.value).toBe('#ffd700')
  })

  it('does not submit parent form when internal controls are clicked', async () => {
    const user = userEvent.setup()
    const onSubmit = jest.fn((event: Event) => event.preventDefault())

    render(
      <form onSubmit={onSubmit}>
        <AnimationCard
          title="Form-safe controls"
          description="Card inside form"
          animationId="lights__form-safe"
          infiniteAnimation
        >
          {() => <div>Lights Content</div>}
        </AnimationCard>
      </form>
    )

    await user.click(screen.getByRole('button', { name: /expand description/i }))
    await user.click(screen.getByRole('button', { name: /decrease bulb count/i }))
    await user.click(screen.getByRole('button', { name: /increase bulb count/i }))
    await user.click(screen.getByRole('button', { name: /replay/i }))

    expect(onSubmit).not.toHaveBeenCalled()
  })
})
