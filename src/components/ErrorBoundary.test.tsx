import ErrorBoundary from '@/components/ErrorBoundary'
import * as errorTracking from '@/services/errorTracking'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const ThrowOnRender = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Boundary test crash')
  }

  return <div>Recovered content</div>
}

const RecoverableHarness = () => {
  const [shouldThrow, setShouldThrow] = useState(true)

  return (
    <ErrorBoundary
      fallback={(_error, reset) => (
        <button
          type="button"
          onClick={() => {
            setShouldThrow(false)
            reset()
          }}
        >
          Recover
        </button>
      )}
    >
      <ThrowOnRender shouldThrow={shouldThrow} />
    </ErrorBoundary>
  )
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders default fallback UI when child render crashes', () => {
    render(
      <ErrorBoundary>
        <ThrowOnRender />
      </ErrorBoundary>
    )

    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument()
  })

  it('resets error boundary state when custom fallback calls reset', async () => {
    render(<RecoverableHarness />)

    fireEvent.click(screen.getByRole('button', { name: 'Recover' }))

    await waitFor(() => {
      expect(screen.getByText('Recovered content')).toBeInTheDocument()
    })
  })

  it('reports caught errors through errorTracking adapter', async () => {
    const reportSpy = vi.spyOn(errorTracking, 'reportRuntimeError').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowOnRender />
      </ErrorBoundary>
    )

    await waitFor(() => {
      expect(reportSpy).toHaveBeenCalled()
    })

    const [reportedError, reportedErrorInfo] = reportSpy.mock.calls[0]
    expect(reportedError).toBeInstanceOf(Error)
    expect(reportedErrorInfo).toEqual(expect.objectContaining({ componentStack: expect.any(String) }))
  })
})
