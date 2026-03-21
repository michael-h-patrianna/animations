import { CategorySection } from '@/components/ui/CategorySection'
import { CodeModeProvider } from '@/contexts/CodeModeContext'
import type { Category } from '@/types/animation'
import { render, screen } from '@testing-library/react'

describe('UI • CategorySection', () => {
  it('renders empty state when no groups', () => {
    const category: Category = { id: 'cat', title: 'Empty', groups: [] }
    render(
      <CodeModeProvider>
        <CategorySection category={category} elementId="cat-1" />
      </CodeModeProvider>
    )
    expect(screen.getByText('Groups coming soon')).toHaveClass('pf-category__empty')
  })

  it('renders group list and animation count', () => {
    const category: Category = {
      id: 'base',
      title: 'Base',
      groups: [
        {
          id: 'g1',
          title: 'G1',
          animations: [
            { id: 'a1', title: 't', description: 'd', categoryId: 'base', groupId: 'g1' },
          ],
        },
        {
          id: 'g2',
          title: 'G2',
          animations: [
            { id: 'a2', title: 't', description: 'd', categoryId: 'base', groupId: 'g2' },
          ],
        },
      ],
    }
    render(
      <CodeModeProvider>
        <CategorySection category={category} elementId="base-1" />
      </CodeModeProvider>
    )
    expect(screen.getByText(/Base \(2 animations\)/)).toHaveClass('pf-category__title')
    // Both groups rendered — GroupSection renders "{title} ({count})"
    expect(screen.getByText('G1 (1)')).toHaveClass('pf-group__title')
    expect(screen.getByText('G2 (1)')).toHaveClass('pf-group__title')
  })

  it('sets the section id to the provided elementId', () => {
    const category: Category = {
      id: 'test-cat',
      title: 'Test Category',
      groups: [
        {
          id: 'tg',
          title: 'TG',
          animations: [
            { id: 'a1', title: 't', description: 'd', categoryId: 'test-cat', groupId: 'tg' },
          ],
        },
      ],
    }
    render(
      <CodeModeProvider>
        <CategorySection category={category} elementId="cat-section-42" />
      </CodeModeProvider>
    )
    expect(screen.getByTestId('category-section-test-cat')).toHaveAttribute('id', 'cat-section-42')
  })

  it('renders correct total animation count across multiple groups', () => {
    const category: Category = {
      id: 'multi',
      title: 'Multi Group',
      groups: [
        {
          id: 'mg1',
          title: 'MG1',
          animations: [
            { id: 'a1', title: 't', description: 'd', categoryId: 'multi', groupId: 'mg1' },
            { id: 'a2', title: 't', description: 'd', categoryId: 'multi', groupId: 'mg1' },
            { id: 'a3', title: 't', description: 'd', categoryId: 'multi', groupId: 'mg1' },
          ],
        },
        {
          id: 'mg2',
          title: 'MG2',
          animations: [
            { id: 'a4', title: 't', description: 'd', categoryId: 'multi', groupId: 'mg2' },
            { id: 'a5', title: 't', description: 'd', categoryId: 'multi', groupId: 'mg2' },
          ],
        },
      ],
    }
    render(
      <CodeModeProvider>
        <CategorySection category={category} elementId="multi-1" />
      </CodeModeProvider>
    )
    // Total: 3 + 2 = 5 animations
    expect(screen.getByText(/Multi Group \(5 animations\)/)).toHaveClass('pf-category__title')
  })

  it('renders singular "animation" label for single animation', () => {
    const category: Category = {
      id: 'single',
      title: 'Single',
      groups: [
        {
          id: 'sg',
          title: 'SG',
          animations: [
            { id: 'a1', title: 't', description: 'd', categoryId: 'single', groupId: 'sg' },
          ],
        },
      ],
    }
    render(
      <CodeModeProvider>
        <CategorySection category={category} elementId="single-1" />
      </CodeModeProvider>
    )
    // Should say "1 animation" (singular) not "1 animations"
    expect(screen.getByText(/Single \(1 animation/)).toHaveClass('pf-category__title')
  })
})
