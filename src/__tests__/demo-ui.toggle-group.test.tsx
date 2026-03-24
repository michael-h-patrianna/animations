import { ToggleGroup } from '@/demo-ui/components/ui/ToggleGroup'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('ToggleGroup', () => {
  it('styles the selected indicator from theme tokens instead of unresolved accent border utilities', () => {
    const { container } = render(
      <ToggleGroup
        options={[
          { value: 'framer', label: 'Framer' },
          { value: 'css', label: 'CSS' },
        ]}
        value="framer"
        onChange={() => {}}
        ariaLabel="Code mode"
      />
    )

    expect(screen.getByRole('radiogroup', { name: 'Code mode' })).toBeInTheDocument()

    const selectedIndicator = container.querySelector('.pointer-events-none')
    expect(selectedIndicator).not.toBeNull()
    const indicatorStyle = selectedIndicator?.getAttribute('style') ?? ''
    expect(indicatorStyle).toContain('var(--accent-subtle)')
    expect(indicatorStyle).toContain('border-color')
    expect(indicatorStyle).toContain('background-color')
    expect(indicatorStyle).toContain('var(--accent-muted)')
  })
})
