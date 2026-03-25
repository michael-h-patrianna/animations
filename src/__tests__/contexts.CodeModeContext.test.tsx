import { CodeModeProvider, useCodeMode } from '@/contexts/CodeModeContext'
import { fireEvent, render, renderHook, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

describe('CodeModeContext', () => {
  it('throws when useCodeMode is called outside CodeModeProvider', () => {
    // Suppress React error boundary console output
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => useCodeMode())
    }).toThrow('useCodeMode must be used within a CodeModeProvider')

    spy.mockRestore()
  })

  it('provides default code mode of Framer', () => {
    function Consumer() {
      const { codeMode } = useCodeMode()
      return <div data-testid="mode">{codeMode}</div>
    }

    render(
      <CodeModeProvider>
        <Consumer />
      </CodeModeProvider>
    )

    expect(screen.getByTestId('mode')).toHaveTextContent('Framer')
  })

  it('provides setCodeMode that updates the shared state', () => {
    function Consumer() {
      const { codeMode, setCodeMode } = useCodeMode()
      return (
        <button data-testid="mode" onClick={() => setCodeMode('CSS')}>
          {codeMode}
        </button>
      )
    }

    render(
      <CodeModeProvider>
        <Consumer />
      </CodeModeProvider>
    )

    const btn = screen.getByTestId('mode')
    expect(btn).toHaveTextContent('Framer')
    fireEvent.click(btn)
    expect(btn).toHaveTextContent('CSS')
  })

  it('shares state between multiple consumers', () => {
    function ConsumerA() {
      const { codeMode, setCodeMode } = useCodeMode()
      return (
        <button data-testid="consumer-a" onClick={() => setCodeMode('CSS')}>
          A:{codeMode}
        </button>
      )
    }

    function ConsumerB() {
      const { codeMode } = useCodeMode()
      return <div data-testid="consumer-b">B:{codeMode}</div>
    }

    render(
      <CodeModeProvider>
        <ConsumerA />
        <ConsumerB />
      </CodeModeProvider>
    )

    expect(screen.getByTestId('consumer-a')).toHaveTextContent('A:Framer')
    expect(screen.getByTestId('consumer-b')).toHaveTextContent('B:Framer')

    fireEvent.click(screen.getByTestId('consumer-a'))

    expect(screen.getByTestId('consumer-a')).toHaveTextContent('A:CSS')
    expect(screen.getByTestId('consumer-b')).toHaveTextContent('B:CSS')
  })

  it('supports toggling back and forth between modes', () => {
    function ToggleConsumer() {
      const { codeMode, setCodeMode } = useCodeMode()
      return (
        <div>
          <span data-testid="current-mode">{codeMode}</span>
          <button data-testid="set-framer" onClick={() => setCodeMode('Framer')}>
            F
          </button>
          <button data-testid="set-css" onClick={() => setCodeMode('CSS')}>
            C
          </button>
        </div>
      )
    }

    render(
      <CodeModeProvider>
        <ToggleConsumer />
      </CodeModeProvider>
    )

    expect(screen.getByTestId('current-mode')).toHaveTextContent('Framer')

    fireEvent.click(screen.getByTestId('set-css'))
    expect(screen.getByTestId('current-mode')).toHaveTextContent('CSS')

    fireEvent.click(screen.getByTestId('set-framer'))
    expect(screen.getByTestId('current-mode')).toHaveTextContent('Framer')

    // Double-set to same mode should be idempotent
    fireEvent.click(screen.getByTestId('set-framer'))
    expect(screen.getByTestId('current-mode')).toHaveTextContent('Framer')
  })
})
