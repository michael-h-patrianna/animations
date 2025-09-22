import App from '@/App'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'

describe('App', () => {
  it('renders only the current category and its content', async () => {
    render(<App />)

    // Should show first group (from first category) by default
    const groupHeading = await screen.findByRole('heading', {
      level: 2,
      name: /Text effects/i,
    })
    expect(groupHeading).toBeInTheDocument()

    // Should not show groups from other categories in main content
    expect(
      screen.queryByRole('heading', { level: 2, name: /Base modal animations/i })
    ).not.toBeInTheDocument()
  })

  it('renders groups and animation cards for current category', async () => {
    render(<App />)

    const groupHeading = await screen.findByRole('heading', {
      level: 2,
      name: /Text effects/i,
    })
    const groupSection = groupHeading.closest('article')
    expect(groupSection).not.toBeNull()

    const groupQueries = within(groupSection!)

    // Check for at least one animation card
    expect(
      (await groupQueries.findAllByRole('button', { name: /replay/i })).length
    ).toBeGreaterThan(0)
  })

  it('switches categories when sidebar category is clicked', async () => {
    render(<App />)

    // Wait for initial load
    await screen.findByRole('heading', { level: 2, name: /Text effects/i })

    // Click on a different category in sidebar
    const dialogCategoryLink = screen.getByRole('button', {
      name: /Dialog & Modal Animations/i,
    })
    fireEvent.click(dialogCategoryLink)

    // Wait for category switch - assert via mobile header title which reflects current group
    const mobileHeader = document.querySelector('.pf-mobile-header') as HTMLElement
    await waitFor(() => {
      expect(within(mobileHeader).getByText(/Base modal animations/i)).toBeInTheDocument()
    })

    // Note: We don't assert the previous group's heading is removed because
    // exit animations may keep the element in the DOM during tests.
  })

  it('navigates to group when sidebar group is clicked', async () => {
    render(<App />)

    // Wait for initial load
    await screen.findByRole('heading', { level: 2, name: /Text effects/i })

    // Category should be active and show its groups
    const textEffectsGroup = await screen.findByRole('button', {
      name: /Text effects/i,
    })

    fireEvent.click(textEffectsGroup)

    // Should scroll the group into view (we can't test actual scrolling in jsdom)
    // But we can verify the group heading exists
    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          level: 2,
          name: /Text effects/i,
        })
      ).toBeInTheDocument()
    })
  })

  it('shows active state for current category in sidebar', async () => {
    render(<App />)

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

  it('handles category switching to show different groups', async () => {
    render(<App />)

    // Wait for initial category
    await screen.findByRole('heading', { level: 2, name: /Text effects/i })

    // Switch to a different category
    const progressCategory = screen.getByRole('button', {
      name: /Progress & Loading Animations/i,
    })
    fireEvent.click(progressCategory)

    // Wait for new category's first group ("Progress bars") to appear
    const mobileHeader = document.querySelector('.pf-mobile-header') as HTMLElement
    await waitFor(() => {
      expect(within(mobileHeader).getByText(/Progress bars/i)).toBeInTheDocument()
    })

    // Groups from new category should be in sidebar
    const progressGroups = screen.getByRole('button', {
      name: /Progress bars/i,
    })
    expect(progressGroups).toBeInTheDocument()
  })
})
