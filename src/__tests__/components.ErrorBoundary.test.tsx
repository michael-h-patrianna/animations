import ErrorBoundary from '@/components/ErrorBoundary'
import { fireEvent, render, screen } from '@testing-library/react'
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

    expect(screen.getByText('Something went wrong')).toBeVisible()
    expect(screen.getByText(/unexpected happened/)).toBeVisible()
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeVisible()
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

    expect(screen.getByText('Something went wrong')).toBeVisible()

    // Fix the error condition before clicking Try Again
    shouldThrow = false
    fireEvent.click(screen.getByRole('button', { name: 'Try Again' }))

    // After reset, the child should render successfully
    expect(screen.getByTestId('recovered')).toBeVisible()
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()

    consoleErrorSpy.mockRestore()
  })

  it('logs error via logger when child throws', () => {
    // In test (non-PROD) mode the logger delegates to console, so spy still works
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    )

    // React itself logs, plus our componentDidCatch logs via logger
    const errorCalls = consoleSpy.mock.calls.filter(
      (call) => typeof call[0] === 'string' && call[0].includes('ErrorBoundary caught')
    )
    expect(errorCalls.length).toBe(1)
    expect(errorCalls[0]![1].message).toBe('Test error from child')

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
    expect(screen.getByText('Custom: Test error from child')).toBeVisible()
    // Default fallback should NOT be rendered
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()

    consoleErrorSpy.mockRestore()
  })

  it('shows error details in dev mode', () => {
    consoleErrorSpy.mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    )

    // In non-prod (test env), ErrorDevDetails should render
    const details = screen.getByText('Error Details (Development Only)')
    expect(details).toBeInTheDocument()

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

    expect(screen.getByText('Something went wrong')).toBeVisible()
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
})
