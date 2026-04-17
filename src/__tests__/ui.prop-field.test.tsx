import { fireEvent, render, screen, within } from '@testing-library/react'
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

  it('renders a range slider with the current value, range, step, and unit — and forwards edits', () => {
    const onChange = vi.fn()
    const config: PropConfig = {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      min: 0,
      max: 1000,
      step: 10,
      unit: 'ms',
    }
    render(<PropField config={config} value={500} onChange={onChange} />)

    const range = screen.getByRole('slider') as HTMLInputElement
    expect(range.min).toBe('0')
    expect(range.max).toBe('1000')
    expect(range.step).toBe('10')
    expect(range.value).toBe('500')
    // Unit suffix is rendered next to the numeric display
    expect(document.body.textContent).toContain('ms')

    fireEvent.change(range, { target: { value: '250' } })
    expect(onChange).toHaveBeenLastCalledWith('duration', 250)
  })

  it('renders a bare number input (no slider) and forwards edits through onChange(name, value)', () => {
    const onChange = vi.fn()
    const config: PropConfig = {
      type: 'number',
      name: 'count',
      label: 'Count',
    }
    render(<PropField config={config} value={5} onChange={onChange} />)

    expect(screen.queryByRole('slider')).toBeNull()
    const input = screen.getByDisplayValue('5') as HTMLInputElement
    expect(input.value).toBe('5')

    // Pin the exact parsed value rather than `expect.any(Number)`, which would
    // silently accept NaN if the input-to-number coercion regressed.
    fireEvent.change(input, { target: { value: '7' } })
    expect(onChange).toHaveBeenLastCalledWith('count', 7)
  })

  // ── String field ──────────────────────────────────────────────────────

  it('renders a text input with the current value and forwards edits through onChange(name, value)', async () => {
    const onChange = vi.fn()
    const config: PropConfig = {
      type: 'string',
      name: 'title',
      label: 'Title',
      default: 'Hello',
    }
    render(<PropField config={config} value="World" onChange={onChange} />)

    const input = screen.getByDisplayValue('World') as HTMLInputElement
    expect(input.value).toBe('World')

    await userEvent.type(input, '!')
    expect(onChange).toHaveBeenLastCalledWith('title', 'World!')
  })

  // ── Boolean field ─────────────────────────────────────────────────────

  it('renders a switch with the correct checked state and toggles through onChange(name, value)', async () => {
    const onChange = vi.fn()
    const config: PropConfig = {
      type: 'boolean',
      name: 'loop',
      label: 'Loop',
      default: false,
    }
    render(<PropField config={config} value={true} onChange={onChange} />)

    const switchEl = screen.getByRole('switch')
    expect(switchEl).toHaveAttribute('aria-checked', 'true')

    await userEvent.click(switchEl)
    expect(onChange).toHaveBeenLastCalledWith('loop', false)
  })

  // ── Color field ───────────────────────────────────────────────────────

  it('renders a color picker populated with the current hex value', () => {
    const config: PropConfig = {
      type: 'color',
      name: 'bg',
      label: 'Background',
      default: '#ff0000',
    }
    render(<PropField config={config} value="#00ff00" onChange={vi.fn()} />)

    const field = screen.getByTestId('prop-field-bg')
    expect(field.textContent).toContain('Background')
    // The color picker exposes the hex either as an input value or as a style swatch.
    // eslint-disable-next-line testing-library/no-node-access -- color-picker internals have no data-testid
    const inputs = field.querySelectorAll<HTMLInputElement>('input')
    // eslint-disable-next-line testing-library/no-node-access -- color-picker internals have no data-testid
    const styled = field.querySelectorAll<HTMLElement>('[style]')
    const exposesValue =
      Array.from(inputs).some((el) => el.value.toLowerCase() === '#00ff00') ||
      Array.from(styled).some((el) =>
        (el.getAttribute('style') ?? '').toLowerCase().includes('00ff00')
      )
    expect(exposesValue).toBe(true)
  })

  // ── Select field ──────────────────────────────────────────────────────

  it('renders a select whose trigger exposes the currently selected option label', () => {
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
    expect(field.textContent).toContain('Ease Out')
  })

  // ── Image field ───────────────────────────────────────────────────────

  it('renders an image URL input pre-populated with the current value and updates via onChange(name, value)', async () => {
    const onChange = vi.fn()
    const config: PropConfig = {
      type: 'image',
      name: 'src',
      label: 'Source',
    }
    render(<PropField config={config} value="/img/hero.png" onChange={onChange} />)

    const input = screen.getByDisplayValue('/img/hero.png') as HTMLInputElement
    expect(input.value).toBe('/img/hero.png')

    await userEvent.type(input, '!')
    expect(onChange).toHaveBeenLastCalledWith('src', '/img/hero.png!')
  })

  // ── Images array field ────────────────────────────────────────────────

  it('renders one input per image in the array and appends a new entry via Add image', async () => {
    const onChange = vi.fn()
    const config: PropConfig = {
      type: 'images',
      name: 'gallery',
      label: 'Gallery',
      default: ['/a.png'],
      maxItems: 3,
    }
    render(<PropField config={config} value={['/a.png', '/b.png']} onChange={onChange} />)

    expect((screen.getByDisplayValue('/a.png') as HTMLInputElement).value).toBe('/a.png')
    expect((screen.getByDisplayValue('/b.png') as HTMLInputElement).value).toBe('/b.png')

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

  it('renders one color control per palette entry and appends via Add color', async () => {
    const onChange = vi.fn()
    const config: PropConfig = {
      type: 'colors',
      name: 'palette',
      label: 'Palette',
    }
    render(<PropField config={config} value={['#ff0000']} onChange={onChange} />)

    const field = screen.getByTestId('prop-field-palette')
    expect(field.textContent).toContain('Palette')

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

  it('renders style-object fields with per-field labels', () => {
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
    expect(field.textContent).toContain('Custom Style')

    // Both sub-fields rendered as children of the parent field
    const fieldScope = within(field)
    expect(fieldScope.getByTestId('prop-field-style---size')).toHaveTextContent('Size')
    expect(fieldScope.getByTestId('prop-field-style---color')).toHaveTextContent('Color')
  })

  // ── Fallback to defaults ──────────────────────────────────────────────

  it('falls back to the declared default when the incoming value is not a number', () => {
    const onChange = vi.fn()
    const config: PropConfig = {
      type: 'number',
      name: 'speed',
      label: 'Speed',
      min: 0,
      max: 100,
      default: 50,
    }
    // Pass a string where number expected — PropField should coerce to the default
    render(<PropField config={config} value={'not-a-number' as unknown} onChange={onChange} />)

    const range = screen.getByRole('slider') as HTMLInputElement
    expect(range.value).toBe('50')
  })
})
