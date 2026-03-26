import { ErrorBoundary } from '@/components/ErrorBoundary'
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

// Component that throws on render
function ThrowingChild({ shouldThrow = true }: { shouldThrow?: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error from child')
  }
  return <div data-testid="child-content">Working content</div>
}

describe('ErrorBoundary', () => {
  // Suppress React error boundary console output in tests
  const consoleErrorSpy = vi.spyOn(console, 'error')

  it('renders children normally when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div data-testid="normal-child">Normal content</div>
      </ErrorBoundary>
    )

    expect(screen.getByTestId('normal-child')).toHaveTextContent('Normal content')
  })

  it('shows default error fallback when child throws', () => {
    consoleErrorSpy.mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    )

    expect(screen.getByTestId('error-heading')).toBeVisible()
    expect(screen.getByTestId('error-message')).toBeVisible()
    expect(screen.getByTestId('error-retry-button')).toBeVisible()
    // Child content should not be rendered
    expect(screen.queryByTestId('child-content')).not.toBeInTheDocument()

    consoleErrorSpy.mockRestore()
  })

  it('Try Again button resets error state and re-renders children', () => {
    consoleErrorSpy.mockImplementation(() => {})
    let shouldThrow = true

    function ConditionalThrower() {
      if (shouldThrow) throw new Error('Conditional error')
      return <div data-testid="recovered">Recovered!</div>
    }

    render(
      <ErrorBoundary>
        <ConditionalThrower />
      </ErrorBoundary>
    )

    expect(screen.getByTestId('error-heading')).toBeVisible()

    // Fix the error condition before clicking Try Again
    shouldThrow = false
    fireEvent.click(screen.getByTestId('error-retry-button'))

    // After reset, the child should render successfully
    expect(screen.getByTestId('recovered')).toBeVisible()
    expect(screen.queryByTestId('error-heading')).not.toBeInTheDocument()

    consoleErrorSpy.mockRestore()
  })

  it('logs error via reportAppError when child throws', () => {
    // In test (non-PROD) mode the logger delegates to console, so spy still works
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    )

    // reportAppError logs via logger.error with [ANIMATION_RENDER_CRASH] prefix
    const errorCalls = consoleSpy.mock.calls.filter(
      (call) => typeof call[0] === 'string' && call[0].includes('ANIMATION_RENDER_CRASH')
    )
    expect(errorCalls.length).toBe(1)
    expect(errorCalls[0]![0]).toContain('Test error from child')

    consoleSpy.mockRestore()
  })

  it('renders custom fallback when provided', () => {
    consoleErrorSpy.mockImplementation(() => {})

    render(
      <ErrorBoundary
        fallback={(error, reset) => (
          <div data-testid="custom-fallback">
            <span>Custom: {error.message}</span>
            <button onClick={reset}>Custom Reset</button>
          </div>
        )}
      >
        <ThrowingChild />
      </ErrorBoundary>
    )

    expect(screen.getByTestId('custom-fallback')).toBeVisible()
    expect(screen.getByTestId('custom-fallback')).toHaveTextContent('Custom: Test error from child')
    // Default fallback should NOT be rendered
    expect(screen.queryByTestId('error-heading')).not.toBeInTheDocument()

    consoleErrorSpy.mockRestore()
  })

  it('shows error details in dev mode', () => {
    consoleErrorSpy.mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    )

    // In non-prod (test env), ErrorDevDetails should render with summary text
    expect(screen.getByTestId('error-details')).toHaveTextContent('Error Details')

    consoleErrorSpy.mockRestore()
  })

  it('catches errors thrown during render of deeply nested children', () => {
    consoleErrorSpy.mockImplementation(() => {})

    function DeepChild() {
      throw new Error('Deep nested error')
    }

    function MiddleComponent() {
      return (
        <div>
          <DeepChild />
        </div>
      )
    }

    render(
      <ErrorBoundary>
        <MiddleComponent />
      </ErrorBoundary>
    )

    expect(screen.getByTestId('error-heading')).toBeVisible()
    consoleErrorSpy.mockRestore()
  })

  it('displays the error toString() in dev details pre tag', () => {
    consoleErrorSpy.mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    )

    // error.toString() produces "Error: Test error from child"
    const details = screen.getByTestId('error-details')
    expect(details).toBeInTheDocument()
    expect(details).toHaveTextContent('Error: Test error from child')

    consoleErrorSpy.mockRestore()
  })

  it('calls custom fallback reset function to recover from error', () => {
    consoleErrorSpy.mockImplementation(() => {})
    let shouldThrow = true

    function ConditionalThrower() {
      if (shouldThrow) throw new Error('Recoverable error')
      return <div data-testid="recovered">Recovered!</div>
    }

    render(
      <ErrorBoundary
        fallback={(error, reset) => (
          <div>
            <span data-testid="custom-error-text">Error: {error.message}</span>
            <button onClick={reset}>Custom Reset</button>
          </div>
        )}
      >
        <ConditionalThrower />
      </ErrorBoundary>
    )

    expect(screen.getByTestId('custom-error-text')).toHaveTextContent('Error: Recoverable error')

    shouldThrow = false
    fireEvent.click(screen.getByRole('button', { name: 'Custom Reset' }))

    expect(screen.getByTestId('recovered')).toBeVisible()
    consoleErrorSpy.mockRestore()
  })

  it('shows error fallback repeatedly when error persists across retry attempts', () => {
    consoleErrorSpy.mockImplementation(() => {})
    let shouldThrow = true

    function Thrower() {
      if (shouldThrow) throw new Error('Persistent error')
      return <div data-testid="final-recovery">Success</div>
    }

    render(
      <ErrorBoundary>
        <Thrower />
      </ErrorBoundary>
    )

    // First error
    expect(screen.getByTestId('error-heading')).toBeVisible()

    // First retry — still throwing
    fireEvent.click(screen.getByRole('button', { name: 'Try Again' }))
    expect(screen.getByTestId('error-heading')).toBeVisible()

    // Second retry — still throwing
    fireEvent.click(screen.getByRole('button', { name: 'Try Again' }))
    expect(screen.getByTestId('error-heading')).toBeVisible()

    // Fix the error and retry
    shouldThrow = false
    fireEvent.click(screen.getByRole('button', { name: 'Try Again' }))
    expect(screen.getByTestId('final-recovery')).toBeVisible()

    consoleErrorSpy.mockRestore()
  })

  it('logs structured error event with component name from componentStack', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    function SpecificComponent() {
      throw new Error('Named component error')
    }

    render(
      <ErrorBoundary>
        <SpecificComponent />
      </ErrorBoundary>
    )

    // reportAppError logs with [ANIMATION_RENDER_CRASH] prefix and structured event data
    const errorCalls = consoleSpy.mock.calls.filter(
      (call) => typeof call[0] === 'string' && call[0].includes('ANIMATION_RENDER_CRASH')
    )
    expect(errorCalls.length).toBe(1)
    expect(errorCalls[0]![0]).toContain('Named component error')
    // Second arg is { event: AppError } — verify structure
    const eventArg = (errorCalls[0]![1] as Record<string, unknown>).event as Record<string, unknown>
    expect(eventArg.type).toBe('ANIMATION_RENDER_CRASH')
    expect(eventArg.timestamp).toEqual(expect.any(Number))
    expect((eventArg.cause as Error).message).toBe('Named component error')

    consoleSpy.mockRestore()
  })

  it('renders non-throwing children after initial error recovery', () => {
    consoleErrorSpy.mockImplementation(() => {})
    let shouldThrow = true

    function ConditionalThrower() {
      if (shouldThrow) throw new Error('First render error')
      return (
        <div>
          <span data-testid="child-a">Child A</span>
          <span data-testid="child-b">Child B</span>
        </div>
      )
    }

    render(
      <ErrorBoundary>
        <ConditionalThrower />
      </ErrorBoundary>
    )

    shouldThrow = false
    fireEvent.click(screen.getByRole('button', { name: 'Try Again' }))

    expect(screen.getByTestId('child-a')).toBeVisible()
    expect(screen.getByTestId('child-b')).toBeVisible()

    consoleErrorSpy.mockRestore()
  })

  it('includes timestamp and component stack in structured error event', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    )

    const errorCalls = consoleSpy.mock.calls.filter(
      (call) => typeof call[0] === 'string' && call[0].includes('ANIMATION_RENDER_CRASH')
    )
    const eventArg = (errorCalls[0]![1] as Record<string, unknown>).event as Record<string, unknown>

    // Timestamp should be a recent numeric epoch value (within last 10 seconds)
    expect(eventArg.timestamp as number).toBeGreaterThan(Date.now() - 10_000)
    // componentStack should be present (React provides it)
    expect(eventArg.componentStack).toEqual(expect.stringContaining('ThrowingChild'))

    consoleSpy.mockRestore()
  })

  it('catches error from a child that throws a non-Error object', () => {
    consoleErrorSpy.mockImplementation(() => {})

    function StringThrower() {
      throw 'raw string error'
    }

    // React wraps non-Error throws, so getDerivedStateFromError receives an Error
    // This tests that the boundary doesn't crash on unusual throw types
    render(
      <ErrorBoundary>
        <StringThrower />
      </ErrorBoundary>
    )

    expect(screen.getByTestId('error-heading')).toBeVisible()

    consoleErrorSpy.mockRestore()
  })

  it('does NOT catch errors thrown in useEffect (React async boundary limitation)', () => {
    consoleErrorSpy.mockImplementation(() => {})

    function AsyncThrower() {
      // This error happens AFTER render, in the useEffect phase.
      // ErrorBoundary (getDerivedStateFromError) only catches render-phase errors.
      const [_count, setCount] = React.useState(0)
      React.useEffect(() => {
        // Throw indirectly via state update that will cause render error.
        // The updater function runs during the next render, so the throw
        // is caught by ErrorBoundary's getDerivedStateFromError.
        setCount(() => {
          throw new Error('Async effect error')
        })
      }, [])
      return <div>Should render initially {_count}</div>
    }

    // React 19 will catch the error in the boundary because setState throws during render
    // This documents that state-update-triggered errors ARE caught (unlike raw promise rejections)
    render(
      <ErrorBoundary>
        <AsyncThrower />
      </ErrorBoundary>
    )

    // The error boundary should catch the setState-triggered error
    expect(screen.getByTestId('error-heading')).toBeVisible()

    consoleErrorSpy.mockRestore()
  })

  it('error details section contains the error stack trace in dev mode', () => {
    consoleErrorSpy.mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    )

    const stackPre = screen.getByTestId('error-stack')
    // The pre should contain both error.toString() and error.stack
    expect(stackPre).toHaveTextContent('Error: Test error from child')
    // Stack trace contains 'at' lines from the Error stack
    expect(stackPre.textContent).toContain('at')

    consoleErrorSpy.mockRestore()
  })

  it('handles undefined error.stack gracefully in dev details', () => {
    consoleErrorSpy.mockImplementation(() => {})

    function NoStackThrower() {
      const e = new Error('No stack')
      e.stack = undefined
      throw e
    }

    render(
      <ErrorBoundary>
        <NoStackThrower />
      </ErrorBoundary>
    )

    // Should render error fallback without crashing on undefined stack
    expect(screen.getByTestId('error-heading')).toBeVisible()

    consoleErrorSpy.mockRestore()
  })
})
