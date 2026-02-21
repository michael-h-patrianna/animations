import App from '@/App'
import { CodeModeProvider } from '@/contexts/CodeModeContext'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

const refreshAnimationsMock = vi.hoisted(() => vi.fn<() => Promise<void>>())

vi.mock('@/hooks/useAnimations', () => ({
  useAnimations: () => ({
    categories: [],
    isLoading: false,
    error: 'Service unavailable',
    refreshAnimations: refreshAnimationsMock,
  }),
}))

vi.mock('@/hooks/useKeyboardShortcut', () => ({
  useKeyboardShortcut: () => undefined,
}))

vi.mock('@/hooks/useScrollLock', () => ({
  useScrollLock: () => undefined,
}))

vi.mock('@/hooks/useScrollToGroup', () => ({
  useScrollToGroup: () => undefined,
}))

describe('App error retry behavior', () => {
  afterEach(() => {
    refreshAnimationsMock.mockReset()
  })

  it('retries in-app via refreshAnimations when Retry is clicked', async () => {
    const user = userEvent.setup()
    refreshAnimationsMock.mockResolvedValue(undefined)

    render(
      <CodeModeProvider>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/:groupId" element={<App />} />
          </Routes>
        </MemoryRouter>
      </CodeModeProvider>
    )

    expect(screen.getByRole('heading', { name: /Error Loading Animations/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Retry' }))

    expect(refreshAnimationsMock).toHaveBeenCalledTimes(1)
  })
})
