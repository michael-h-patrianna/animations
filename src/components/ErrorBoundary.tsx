import type { ErrorInfo, ReactNode } from 'react'
import { Component } from 'react'
import '@/components/ErrorBoundary.css'
import { reportAppError } from '@/services/errorTracking'

/**
 * Props for ErrorBoundary component
 */
interface ErrorBoundaryProps {
  /** Child components to render */
  children: ReactNode
  /** Optional fallback UI to display on error */
  fallback?: (error: Error, reset: () => void) => ReactNode
}

/**
 * State for ErrorBoundary component
 */
interface ErrorBoundaryState {
  /** Whether an error has been caught */
  hasError: boolean
  /** The error that was caught */
  error: Error | null
}

function ErrorDevDetails({ error }: { error: Error }) {
  if (import.meta.env.PROD) return null
  return (
    <details className="pf-error-card__details" data-testid="error-details">
      <summary>Error Details (Development Only)</summary>
      <pre data-testid="error-stack">
        {error.toString()}
        {error.stack && '\n\n' + error.stack}
      </pre>
    </details>
  )
}

function DefaultErrorFallback({ error, onReset }: { error: Error; onReset: () => void }) {
  return (
    <div className="pf-error-page" data-testid="error-fallback">
      <div className="pf-error-card">
        <h1 data-testid="error-heading">Something went wrong</h1>
        <p data-testid="error-message">
          We're sorry, but something unexpected happened. The error has been logged and we'll look
          into it.
        </p>
        <ErrorDevDetails error={error} />
        <button
          type="button"
          onClick={onReset}
          className="pf-error-card__retry"
          data-testid="error-retry-button"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

/**
 * ErrorBoundary component that catches React errors in child components.
 *
 * Implements resilience principle (P4) by preventing app crashes and providing
 * user feedback and recovery mechanisms. Fallback CSS is bundled as a stylesheet
 * so strict `style-src` CSP does not block recovery UI styling.
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  /** Update state when an error is caught */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  /** Log error information when component catches an error */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Extract the innermost component name from the React component stack
    // to help identify which animation or UI component caused the error.
    const componentName = errorInfo.componentStack?.match(/\n\s+at (\w+)/)?.[1] ?? 'unknown'

    reportAppError({
      type: 'ANIMATION_RENDER_CRASH',
      animationId: componentName,
      cause: error,
      componentStack: errorInfo.componentStack ?? undefined,
      timestamp: Date.now(),
    })
  }

  /** Reset error state and attempt to recover */
  handleReset = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset)
      }
      return <DefaultErrorFallback error={this.state.error} onReset={this.handleReset} />
    }
    return this.props.children
  }
}

export { ErrorBoundary }
