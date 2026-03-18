import type { ErrorInfo, ReactNode } from 'react'
import { Component } from 'react'
import { reportRuntimeError } from '@/services/errorTracking'
/**
 * Props for ErrorBoundary component
 */ interface ErrorBoundaryProps {
  /** Child components to render */ children: ReactNode
  /** Optional fallback UI to display on error */ fallback?: (
    error: Error,
    reset: () => void
  ) => ReactNode
}
/**
 * State for ErrorBoundary component
 */ interface ErrorBoundaryState {
  /** Whether an error has been caught */ hasError: boolean
  /** The error that was caught */ error: Error | null
}
function ErrorDevDetails({ error }: { error: Error }) {
  if (import.meta.env.PROD) return null
  return (
    <details
      style={{
        marginBottom: '1.5rem',
        textAlign: 'left',
        padding: '1rem',
        backgroundColor: 'var(--pf-anim-surface-light)',
        borderRadius: '4px',
        fontSize: '0.875rem',
      }}
    >
      <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
        Error Details (Development Only)
      </summary>
      <pre style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {error.toString()}
        {error.stack && '\n\n' + error.stack}
      </pre>
    </details>
  )
}

function DefaultErrorFallback({ error, onReset }: { error: Error; onReset: () => void }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: 'var(--pf-anim-surface-light)',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          padding: '2rem',
          backgroundColor: 'var(--pf-white)',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgb(0 0 0 / 0.1)',
        }}
      >
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: 'var(--pf-anim-error)',
          }}
        >
          Something went wrong
        </h1>
        <p style={{ marginBottom: '1rem', color: 'var(--pf-anim-muted)' }}>
          We're sorry, but something unexpected happened. The error has been logged and we'll look
          into it.
        </p>
        <ErrorDevDetails error={error} />
        <button
          type="button"
          onClick={onReset}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            color: 'var(--pf-white)',
            backgroundColor: 'var(--pf-anim-link)',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--pf-anim-link-hover)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--pf-anim-link)'
          }}
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
 * user feedback and recovery mechanisms.
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 */ class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  /**
   * Update state when an error is caught
   */ static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }
  /**
   * Log error information when component catches an error
   */ componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    reportRuntimeError(error, errorInfo)
  }
  /**
   * Reset error state and attempt to recover
   */ handleReset = (): void => {
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
export default ErrorBoundary
