import { useAnimations } from '@/hooks/useAnimations'
import { animationDataService } from '@/services/animationData'
import { CodeModeProvider } from '@/contexts/CodeModeContext'
import { act, renderHook } from '@testing-library/react'
import { StrictMode, type ReactNode } from 'react'

const StrictCodeModeWrapper = ({ children }: { children: ReactNode }) => (
  <StrictMode>
    <CodeModeProvider>{children}</CodeModeProvider>
  </StrictMode>
)

describe('hooks • useAnimations', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    jest.useRealTimers()
  })

  it('loads categories on mount and exposes refresh', async () => {
    const { result } = renderHook(() => useAnimations(), {
      wrapper: StrictCodeModeWrapper,
    })

    // Initial loading true
    expect(result.current.isLoading).toBe(true)
    expect(result.current.categories).toEqual([])

    // Resolve initial load (animationDataService has 120ms delay)
    await act(async () => {
      jest.advanceTimersByTime(130)
      await Promise.resolve()
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.categories.length).toBeGreaterThan(0)

    // Trigger refresh path (60ms)
    await act(async () => {
      const p = result.current.refreshAnimations()
      jest.advanceTimersByTime(70)
      await p
    })
    expect(result.current.isLoading).toBe(false)
  })

  it('sets error on failure', async () => {
    const spy = jest.spyOn(animationDataService, 'loadAnimations').mockRejectedValueOnce(new Error('boom'))
    const { result } = renderHook(() => useAnimations(), {
      wrapper: StrictCodeModeWrapper,
    })
    await act(async () => {
      jest.advanceTimersByTime(130)
      await Promise.resolve()
    })
    expect(result.current.error).toBe('boom')
    spy.mockRestore()
  })

  it('ignores stale initial load error after a successful refresh', async () => {
    let rejectInitialLoad: ((reason?: unknown) => void) | null = null
    const staleError = new Error('stale-initial-load')
    const refreshedData = [{ id: 'test-cat', title: 'Test', groups: [] }]

    const loadSpy = jest
      .spyOn(animationDataService, 'loadAnimations')
      .mockImplementationOnce(
        () =>
          new Promise((_, reject) => {
            rejectInitialLoad = reject
          })
      )

    const refreshSpy = jest
      .spyOn(animationDataService, 'refreshCatalog')
      .mockResolvedValueOnce(refreshedData as never)

    const { result } = renderHook(() => useAnimations(), {
      wrapper: StrictCodeModeWrapper,
    })

    await act(async () => {
      await result.current.refreshAnimations()
    })

    expect(result.current.error).toBeNull()
    expect(result.current.categories).toEqual(refreshedData)

    await act(async () => {
      rejectInitialLoad?.(staleError)
      await Promise.resolve()
    })

    expect(result.current.error).toBeNull()
    expect(result.current.categories).toEqual(refreshedData)

    loadSpy.mockRestore()
    refreshSpy.mockRestore()
  })
})
