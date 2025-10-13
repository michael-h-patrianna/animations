import App from '@/App'
import { CodeModeProvider } from '@/contexts/CodeModeContext'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const renderApp = () => {
  return render(
    <CodeModeProvider>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </CodeModeProvider>
  )
}

describe('App', () => {
  it('renders the current group with animation cards', async () => {
    renderApp()

    // Should show first group (text-effects-framer) by default
    const groupHeading = await screen.findByRole('heading', {
      level: 2,
      name: /Text effects/i,
    })
    expect(groupHeading).toBeInTheDocument()

    // Should have animation cards with replay buttons
    const replayButtons = await screen.findAllByRole('button', { name: /replay/i })
    expect(replayButtons.length).toBeGreaterThan(0)
  })

  it('shows only the current group, not other groups', async () => {
    renderApp()

    // Wait for initial load
    await screen.findByRole('heading', { level: 2, name: /Text effects/i })

    // Should not show groups from other categories in main content
    // (App shows one group at a time now)
    expect(
      screen.queryByRole('heading', { level: 2, name: /Base modal animations/i })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { level: 2, name: /Progress bars/i })
    ).not.toBeInTheDocument()
  })

  it('shows active state for current category in sidebar', async () => {
    renderApp()

    // Wait for initial load
    await screen.findByRole('heading', { level: 2, name: /Text effects/i })

    const baseButton = screen.getByRole('button', {
      name: /Base effects/i,
    })

    // Should have active class
    expect(baseButton.className).toContain('pf-sidebar__link--active')

    const dialogsButton = screen.getByRole('button', {
      name: /Dialog & Modal Animations/i,
    })

    // Should not have active class
    expect(dialogsButton.className).not.toContain('pf-sidebar__link--active')
  })

  it('displays current group title in mobile header', async () => {
    renderApp()

    // Wait for initial load
    await screen.findByRole('heading', { level: 2, name: /Text effects/i })

    // Mobile header should show current group title
    const mobileHeader = document.querySelector('.pf-mobile-header') as HTMLElement
    expect(within(mobileHeader).getByText(/Text effects/i)).toBeInTheDocument()
  })
})
