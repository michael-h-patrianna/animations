import { CategorySection } from '@/components/ui/CategorySection'
import type { Category } from '@/types/animation'
import { render } from '@testing-library/react'

describe('UI • CategorySection', () => {
  it('renders empty state when no groups', () => {
    const category: Category = { id: 'cat', title: 'Empty', groups: [] }
    const { getByText } = render(<CategorySection category={category} elementId="cat-1" />)
    expect(getByText('Groups coming soon')).toBeInTheDocument()
  })

  it('renders group list and animation count', () => {
    const category: Category = {
      id: 'base',
      title: 'Base',
      groups: [
        { id: 'g1', title: 'G1', animations: [{ id: 'a1', title: 't', description: 'd', categoryId: 'base', groupId: 'g1' }] },
        { id: 'g2', title: 'G2', animations: [{ id: 'a2', title: 't', description: 'd', categoryId: 'base', groupId: 'g2' }] },
      ],
    }
    const { container, getByText } = render(<CategorySection category={category} elementId="base-1" />)
    expect(getByText(/Base \(2 animations\)/)).toBeInTheDocument()
    // Two group sections rendered
    expect(container.querySelectorAll('[id^="group-"]').length).toBe(2)
  })
})
