import { CodeModeSwitch } from '@/components/ui/CodeModeSwitch'
import { CodeModeProvider, useCodeMode } from '@/contexts/CodeModeContext'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

/** Helper that renders CodeModeSwitch inside its required provider. */
function renderSwitch(onModeSelect = vi.fn()) {
  return {
    onModeSelect,
    ...render(
      <CodeModeProvider>
        <CodeModeSwitch onModeSelect={onModeSelect} />
      </CodeModeProvider>
    ),
  }
}

/** Renders a consumer of useCodeMode alongside the switch for integration tests. */
function renderSwitchWithConsumer(onModeSelect = vi.fn()) {
  function ModeDisplay() {
    const { codeMode } = useCodeMode()
    return <div data-testid="current-mode">{codeMode}</div>
  }

  return {
    onModeSelect,
    ...render(
      <CodeModeProvider>
        <CodeModeSwitch onModeSelect={onModeSelect} />
        <ModeDisplay />
      </CodeModeProvider>
    ),
  }
}

describe('CodeModeSwitch', () => {
  it('renders Framer and CSS buttons', () => {
    renderSwitch()

    expect(screen.getByRole('button', { name: 'Framer' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'CSS' })).toBeVisible()
  })

  it('defaults to Framer mode active', () => {
    renderSwitch()

    const framerBtn = screen.getByRole('button', { name: 'Framer' })
    const cssBtn = screen.getByRole('button', { name: 'CSS' })

    expect(framerBtn).toHaveAttribute('aria-pressed', 'true')
    expect(cssBtn).toHaveAttribute('aria-pressed', 'false')
    expect(framerBtn.className).toContain('is-active')
    expect(cssBtn.className).not.toContain('is-active')
  })

  it('toggles to CSS mode on click and updates aria-pressed', () => {
    renderSwitch()

    fireEvent.click(screen.getByRole('button', { name: 'CSS' }))

    expect(screen.getByRole('button', { name: 'CSS' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Framer' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls onModeSelect callback with the selected mode', () => {
    const { onModeSelect } = renderSwitch()

    fireEvent.click(screen.getByRole('button', { name: 'CSS' }))
    expect(onModeSelect).toHaveBeenCalledWith('CSS')

    fireEvent.click(screen.getByRole('button', { name: 'Framer' }))
    expect(onModeSelect).toHaveBeenCalledWith('Framer')
  })

  it('updates shared context so sibling consumers reflect the change', () => {
    renderSwitchWithConsumer()

    expect(screen.getByTestId('current-mode')).toHaveTextContent('Framer')

    fireEvent.click(screen.getByRole('button', { name: 'CSS' }))
    expect(screen.getByTestId('current-mode')).toHaveTextContent('CSS')

    fireEvent.click(screen.getByRole('button', { name: 'Framer' }))
    expect(screen.getByTestId('current-mode')).toHaveTextContent('Framer')
  })
})
