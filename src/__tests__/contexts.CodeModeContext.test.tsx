import { CodeModeProvider, useCodeMode } from '@/contexts/CodeModeContext'
import { fireEvent, render, renderHook, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

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
})
