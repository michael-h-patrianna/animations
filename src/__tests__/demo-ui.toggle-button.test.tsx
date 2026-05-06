import { ToggleButton } from '@/demo-ui/components/ui/ToggleButton'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('ToggleButton', () => {
  it('shows pointer cursor for enabled toggle buttons', () => {
    render(
      <ToggleButton pressed={false} onToggle={() => {}} ariaLabel="Toggle render profiler">
        Profiler
      </ToggleButton>
    )

    const button = screen.getByRole('button', { name: 'Toggle render profiler' })
    expect(button).toHaveClass('cursor-pointer')
    expect(button).toHaveClass('disabled:cursor-not-allowed')
  })
})
