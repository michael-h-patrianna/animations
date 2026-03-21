import App from '@/App'
import { CodeModeProvider } from '@/contexts/CodeModeContext'
import { fireEvent, render, screen } from '@testing-library/react'
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

    // The real registry has 100+ animations; a framer group alone has 5+.
    // If this drops below 5, something is broken in the import chain.
    const cardTitles = screen.getAllByTestId('card-title')
    expect(cardTitles.length).toBeGreaterThanOrEqual(5)
  })

  it('renders with a specific group route parameter', () => {
    renderApp('/standard-effects-framer')

    // Should show the group in the mobile header
    expect(screen.getByTestId('mobile-header')).toBeVisible()
  })

  it('renders GitHub link in the mobile header with security attributes', () => {
    renderApp()

    const githubLinks = screen.getAllByRole('link', { name: 'View source on GitHub' })
    expect(githubLinks.length).toBe(1)
    expect(githubLinks[0]).toHaveAttribute('target', '_blank')
    expect(githubLinks[0]).toHaveAttribute('rel', 'noopener noreferrer')
    expect(githubLinks[0]).toHaveAttribute('href', expect.stringContaining('github.com'))
  })

  it('opens drawer when hamburger is clicked and closes it', () => {
    renderApp()

    // Drawer should start hidden
    const drawer = screen.getByRole('dialog', { hidden: true })
    expect(drawer).toHaveAttribute('hidden')

    // Click hamburger to open
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))

    // Drawer should now be visible
    const openDrawer = screen.getByRole('dialog')
    expect(openDrawer).not.toHaveAttribute('hidden')

    // Click close button
    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }))

    // Drawer should be hidden again
    const closedDrawer = screen.getByRole('dialog', { hidden: true })
    expect(closedDrawer).toHaveAttribute('hidden')
  })

  it('closes drawer when Escape key is pressed', () => {
    renderApp()

    // Open drawer
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    expect(screen.getByRole('dialog')).not.toHaveAttribute('hidden')

    // Press Escape
    fireEvent.keyDown(window, { key: 'Escape' })

    // Drawer should close
    const closedDrawer = screen.getByRole('dialog', { hidden: true })
    expect(closedDrawer).toHaveAttribute('hidden')
  })

  it('locks scroll when drawer is open and restores on close', () => {
    document.body.style.overflow = ''
    renderApp()

    // Open drawer
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    expect(document.body.style.overflow).toBe('hidden')

    // Close drawer
    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }))
    expect(document.body.style.overflow).toBe('')
  })
})
