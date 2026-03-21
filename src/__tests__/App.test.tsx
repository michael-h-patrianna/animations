import App from '@/App'
import { CodeModeProvider } from '@/contexts/CodeModeContext'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

const renderApp = (initialRoute = '/') =>
  render(
    <CodeModeProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <App />
      </MemoryRouter>
    </CodeModeProvider>
  )

describe('App', () => {
  it('renders desktop sidebar and mobile header', () => {
    renderApp()

    // Desktop sidebar + mobile drawer both render AppSidebar, so there are 2
    const sidebars = screen.getAllByTestId('sidebar')
    expect(sidebars.length).toBe(2)

    expect(screen.getByTestId('mobile-header')).toBeVisible()
  })

  it('renders code mode switch with Framer active by default', () => {
    renderApp()

    // Two code mode switches: one in sidebar, one in drawer
    const switches = screen.getAllByTestId('code-mode-switch')
    expect(switches.length).toBe(2)

    // Desktop sidebar switch should show Framer as active
    const framerButtons = screen.getAllByTestId('code-mode-framer')
    expect(framerButtons[0]).toHaveAttribute('aria-pressed', 'true')
  })

  it('renders the mobile drawer in hidden state initially', () => {
    renderApp()

    const drawer = screen.getByRole('dialog', { hidden: true })
    expect(drawer).toHaveAttribute('hidden')
  })

  it('renders animation cards from the real catalog', () => {
    renderApp()

    // The app should render at least some animation cards from the real registry
    const cardTitles = screen.getAllByTestId('card-title')
    expect(cardTitles.length).toBeGreaterThanOrEqual(1)
  })

  it('renders with a specific group route parameter', () => {
    renderApp('/standard-effects-framer')

    // Should show the group in the mobile header
    expect(screen.getByTestId('mobile-header')).toBeVisible()
  })

  it('renders GitHub link in the app shell', () => {
    renderApp()

    const githubLinks = screen.getAllByRole('link', { name: 'View source on GitHub' })
    expect(githubLinks.length).toBeGreaterThanOrEqual(1)
    expect(githubLinks[0]).toHaveAttribute('target', '_blank')
    expect(githubLinks[0]).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
