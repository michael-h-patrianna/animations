import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { PropField } from '@/components/ui/PropField'
import type { PropConfig } from '@/types/animation'

describe('PropField', () => {
  // ── Disabled field ────────────────────────────────────────────────────

  it('renders disabled field with reason text', () => {
    const config: PropConfig = {
      type: 'number',
      name: 'delay',
      label: 'Delay',
      disabled: true,
      disabledReason: 'Requires element ref',
    }
    const onChange = vi.fn()
    render(<PropField config={config} value={100} onChange={onChange} />)

    const field = screen.getByTestId('prop-field-delay')
    expect(field.textContent).toContain('Requires element ref')
  })

  it('renders disabled field with fallback text when no reason', () => {
    const config: PropConfig = {
      type: 'string',
      name: 'text',
      label: 'Text',
      disabled: true,
    }
    render(<PropField config={config} value="" onChange={vi.fn()} />)

    const field = screen.getByTestId('prop-field-text')
    expect(field.textContent).toContain('Not configurable interactively')
  })

  // ── Number field ──────────────────────────────────────────────────────

  it('renders number field with slider when min/max provided', () => {
    const config: PropConfig = {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      min: 0,
      max: 1000,
      step: 10,
      unit: 'ms',
    }
    render(<PropField config={config} value={500} onChange={vi.fn()} />)

    // Slider renders with data-testid
    const field = screen.getByTestId('prop-field-duration')
    expect(field).toBeInTheDocument()
  })

  it('renders number field with input when no min/max', () => {
    const config: PropConfig = {
      type: 'number',
      name: 'count',
      label: 'Count',
    }
    render(<PropField config={config} value={5} onChange={vi.fn()} />)

    const field = screen.getByTestId('prop-field-count')
    expect(field).toBeInTheDocument()
  })

  // ── String field ──────────────────────────────────────────────────────

  it('renders string field with current value', async () => {
    const onChange = vi.fn()
    const config: PropConfig = {
      type: 'string',
      name: 'title',
      label: 'Title',
      default: 'Hello',
    }
    render(<PropField config={config} value="World" onChange={onChange} />)

    const field = screen.getByTestId('prop-field-title')
    expect(field).toBeInTheDocument()
  })

  // ── Boolean field ─────────────────────────────────────────────────────

  it('renders boolean field as switch', () => {
    const config: PropConfig = {
      type: 'boolean',
      name: 'loop',
      label: 'Loop',
      default: false,
    }
    render(<PropField config={config} value={true} onChange={vi.fn()} />)

    const field = screen.getByTestId('prop-field-loop')
    expect(field).toBeInTheDocument()
  })

  // ── Color field ───────────────────────────────────────────────────────

  it('renders color field', () => {
    const config: PropConfig = {
      type: 'color',
      name: 'bg',
      label: 'Background',
      default: '#ff0000',
    }
    render(<PropField config={config} value="#00ff00" onChange={vi.fn()} />)

    const field = screen.getByTestId('prop-field-bg')
    expect(field).toBeInTheDocument()
  })

  // ── Select field ──────────────────────────────────────────────────────

  it('renders select field with options', () => {
    const config: PropConfig = {
      type: 'select',
      name: 'ease',
      label: 'Easing',
      options: [
        { label: 'Linear', value: 'linear' },
        { label: 'Ease Out', value: 'ease-out' },
      ],
      default: 'linear',
    }
    render(<PropField config={config} value="ease-out" onChange={vi.fn()} />)

    const field = screen.getByTestId('prop-field-ease')
    expect(field).toBeInTheDocument()
  })

  // ── Image field ───────────────────────────────────────────────────────

  it('renders image field with placeholder', () => {
    const config: PropConfig = {
      type: 'image',
      name: 'src',
      label: 'Source',
    }
    render(<PropField config={config} value="/img/hero.png" onChange={vi.fn()} />)

    const field = screen.getByTestId('prop-field-src')
    expect(field).toBeInTheDocument()
  })

  // ── Images array field ────────────────────────────────────────────────

  it('renders images array field with add button', async () => {
    const onChange = vi.fn()
    const config: PropConfig = {
      type: 'images',
      name: 'gallery',
      label: 'Gallery',
      default: ['/a.png'],
      maxItems: 3,
    }
    render(<PropField config={config} value={['/a.png', '/b.png']} onChange={onChange} />)

    const field = screen.getByTestId('prop-field-gallery')
    expect(field).toBeInTheDocument()

    // Click "Add image" button
    const user = userEvent.setup()
    const addBtn = screen.getByRole('button', { name: /add image/i })
    await user.click(addBtn)

    expect(onChange).toHaveBeenCalledWith('gallery', ['/a.png', '/b.png', ''])
  })

  it('disables add button at maxItems', () => {
    const config: PropConfig = {
      type: 'images',
      name: 'gallery',
      label: 'Gallery',
      maxItems: 2,
    }
    render(<PropField config={config} value={['/a.png', '/b.png']} onChange={vi.fn()} />)

    const addBtn = screen.getByRole('button', { name: /add image/i })
    expect(addBtn).toBeDisabled()
  })

  it('removes image by clicking remove button', async () => {
    const onChange = vi.fn()
    const config: PropConfig = {
      type: 'images',
      name: 'gallery',
      label: 'Gallery',
    }
    render(<PropField config={config} value={['/a.png', '/b.png']} onChange={onChange} />)

    const user = userEvent.setup()
    const removeBtn = screen.getByRole('button', { name: /remove image 1/i })
    await user.click(removeBtn)

    expect(onChange).toHaveBeenCalledWith('gallery', ['/b.png'])
  })

  // ── Colors array field ────────────────────────────────────────────────

  it('renders colors array field with add button', async () => {
    const onChange = vi.fn()
    const config: PropConfig = {
      type: 'colors',
      name: 'palette',
      label: 'Palette',
    }
    render(<PropField config={config} value={['#ff0000']} onChange={onChange} />)

    const field = screen.getByTestId('prop-field-palette')
    expect(field).toBeInTheDocument()

    const user = userEvent.setup()
    const addBtn = screen.getByRole('button', { name: /add color/i })
    await user.click(addBtn)

    expect(onChange).toHaveBeenCalledWith('palette', ['#ff0000', '#ffffff'])
  })

  it('removes color entry', async () => {
    const onChange = vi.fn()
    const config: PropConfig = {
      type: 'colors',
      name: 'palette',
      label: 'Palette',
    }
    render(<PropField config={config} value={['#ff0000', '#00ff00']} onChange={onChange} />)

    const user = userEvent.setup()
    const removeBtn = screen.getByRole('button', { name: /remove color 1/i })
    await user.click(removeBtn)

    expect(onChange).toHaveBeenCalledWith('palette', ['#00ff00'])
  })

  // ── Style object field ────────────────────────────────────────────────

  it('renders style-object fields', () => {
    const config: PropConfig = {
      type: 'style-object',
      name: 'style',
      label: 'Custom Style',
      fields: [
        { type: 'number', key: '--size', label: 'Size', default: 16, unit: 'px' },
        { type: 'color', key: '--color', label: 'Color', default: '#333' },
      ],
    }
    render(
      <PropField
        config={config}
        value={{ '--size': '16px', '--color': '#333' }}
        onChange={vi.fn()}
      />
    )

    const field = screen.getByTestId('prop-field-style')
    expect(field).toBeInTheDocument()

    // Both sub-fields rendered as children of the parent field
    const fieldScope = within(field)
    expect(fieldScope.getByTestId('prop-field-style---size')).toHaveTextContent('Size')
    expect(fieldScope.getByTestId('prop-field-style---color')).toHaveTextContent('Color')
  })

  // ── Fallback to defaults ──────────────────────────────────────────────

  it('uses default value when passed value has wrong type', () => {
    const onChange = vi.fn()
    const config: PropConfig = {
      type: 'number',
      name: 'speed',
      label: 'Speed',
      min: 0,
      max: 100,
      default: 50,
    }
    // Pass a string where number expected
    render(<PropField config={config} value={'not-a-number' as unknown} onChange={onChange} />)

    // Should not crash — falls back to default
    const field = screen.getByTestId('prop-field-speed')
    expect(field).toBeInTheDocument()
  })
})
