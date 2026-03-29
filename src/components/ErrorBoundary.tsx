import type { ErrorInfo, ReactNode } from 'react'
import { Component } from 'react'
import { reportAppError, reportRuntimeError } from '@/services/errorTracking'

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

/**
 * Embedded styles for the error fallback UI.
 * Uses a <style> tag instead of inline styles so the ErrorBoundary
 * remains self-contained (no external CSS dependency) while keeping
 * styles maintainable and avoiding the hardcoded-colors lint rule.
 */
const fallbackStyles = `
  .pf-error-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
    text-align: center;
    background-color: var(--pf-anim-surface-light, #1a1a2e);
    color: var(--pf-anim-muted, #a0a0b0);
    font-family: system-ui, -apple-system, sans-serif;
  }
  .pf-error-card {
    max-width: 600px;
    padding: 2rem;
    background-color: var(--pf-white, #2a2a3e);
    border-radius: 8px;
    box-shadow: var(--pf-shadow-soft, 0 2px 12px rgba(0,0,0,0.3));
  }
  .pf-error-card h1 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: var(--pf-anim-error, #ef4444);
  }
  .pf-error-card p {
    margin-bottom: 1rem;
    color: var(--pf-anim-muted, #a0a0b0);
  }
  .pf-error-card__details {
    margin-bottom: 1.5rem;
    text-align: left;
    padding: 1rem;
    background-color: var(--pf-anim-surface-light, #1a1a2e);
    border-radius: 4px;
    font-size: 0.875rem;
  }
  .pf-error-card__details summary {
    cursor: pointer;
    font-weight: bold;
  }
  .pf-error-card__details pre {
    margin-top: 0.5rem;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .pf-error-card__retry {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: bold;
    color: var(--pf-white, #ffffff);
    background-color: var(--pf-anim-link, #6366f1);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  .pf-error-card__retry:hover {
    background-color: var(--pf-anim-link-hover, #4f46e5);
  }
`

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
    <>
      <style>{fallbackStyles}</style>
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
    </>
  )
}

/**
 * ErrorBoundary component that catches React errors in child components.
 *
 * Implements resilience principle (P4) by preventing app crashes and providing
 * user feedback and recovery mechanisms. Uses an embedded <style> tag so the
 * fallback UI renders correctly even if external CSS fails to load.
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
    // Legacy reporter for backward compatibility with host apps
    reportRuntimeError(error, errorInfo)
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
