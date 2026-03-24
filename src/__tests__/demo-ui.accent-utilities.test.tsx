import demoUiStyles from '@/demo-ui/styles/index.css?raw'
import { Slider } from '@/demo-ui/components/ui/Slider'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('demo-ui accent utility migration', () => {
  it('defines the shared accent background, border, and focus utilities used by demo-ui controls', () => {
    expect(demoUiStyles).toContain('.bg-accent\\/15')
    expect(demoUiStyles).toContain('.bg-accent\\/20')
    expect(demoUiStyles).toContain('.bg-accent\\/60')
    expect(demoUiStyles).toContain('.border-accent\\/40')
    expect(demoUiStyles).toContain('.border-accent\\/50')
    expect(demoUiStyles).toContain('.focus\\:border-accent:focus')
    expect(demoUiStyles).toContain('.focus\\:ring-accent\\/50:focus')
    expect(demoUiStyles).toContain('.group:focus-within .group-focus-within\\:border-accent\\/50')
  })

  it('defines the shared panel border and header background utilities used by editor chrome', () => {
    expect(demoUiStyles).toContain('.border-panel-border')
    expect(demoUiStyles).toContain('.bg-panel-header\\/50')
    expect(demoUiStyles).toContain('.bg-panel-header\\/30')
    expect(demoUiStyles).toContain('.bg-panel\\/90')
    expect(demoUiStyles).toContain('.hover\\:bg-panel:hover')
  })

  it('uses a theme token border for slider thumbs instead of border-accent', () => {
    render(<Slider value={25} onChange={() => {}} label="Volume" />)

    const slider = screen.getByRole('slider', { name: 'Volume' })
    expect(slider.className).toContain('[&::-webkit-slider-thumb]:border-(--theme-accent)')
    expect(slider.className).toContain('[&::-moz-range-thumb]:border-(--theme-accent)')
  })
})
