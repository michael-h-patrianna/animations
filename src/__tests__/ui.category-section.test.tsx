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
})
