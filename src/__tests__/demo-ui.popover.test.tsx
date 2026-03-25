import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

const startDragMock = vi.fn()

vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>()

  return {
    ...actual,
    useDragControls: () => ({
      start: startDragMock,
    }),
  }
})

import { Popover } from '@/demo-ui/components/ui/Popover'

const originalMatches = HTMLElement.prototype.matches
const originalShowPopover = HTMLElement.prototype.showPopover
const originalHidePopover = HTMLElement.prototype.hidePopover

function makeRect({
  left,
  top,
  width,
  height,
}: {
  left: number
  top: number
  width: number
  height: number
}): DOMRect {
  return {
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON() {
      return {}
    },
  } as DOMRect
}

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'showPopover', {
    configurable: true,
    value: function showPopoverMock(this: HTMLElement) {
      this.dataset.popoverOpen = 'true'
      const event = new Event('toggle')
      Object.assign(event, { newState: 'open' })
      this.dispatchEvent(event)
    },
  })

  Object.defineProperty(HTMLElement.prototype, 'hidePopover', {
    configurable: true,
    value: function hidePopoverMock(this: HTMLElement) {
      delete this.dataset.popoverOpen
      const event = new Event('toggle')
      Object.assign(event, { newState: 'closed' })
      this.dispatchEvent(event)
    },
  })

  Object.defineProperty(HTMLElement.prototype, 'matches', {
    configurable: true,
    value: function matchesMock(this: HTMLElement, selector: string) {
      if (selector === ':popover-open') {
        return this.dataset.popoverOpen === 'true'
      }

      return originalMatches.call(this, selector)
    },
  })
})

afterAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'showPopover', {
    configurable: true,
    value: originalShowPopover,
  })

  Object.defineProperty(HTMLElement.prototype, 'hidePopover', {
    configurable: true,
    value: originalHidePopover,
  })

  Object.defineProperty(HTMLElement.prototype, 'matches', {
    configurable: true,
    value: originalMatches,
  })
})

describe('Popover', () => {
  it('keeps the popover fully visible when the trigger opens near viewport edges', () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 320 })
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 240 })

    render(
      <Popover
        open={true}
        onOpenChange={vi.fn()}
        offset={8}
        trigger={<span>Open</span>}
        content={<div data-testid="panel-content">Panel</div>}
      />
    )

    const trigger = screen.getByTestId('popover-open-change')
    const popover = document.querySelector('[popover]') as HTMLDivElement
    const panelContent = screen.getByTestId('panel-content')
    const surface = panelContent.closest('.glass-panel') as HTMLDivElement

    trigger.getBoundingClientRect = () => makeRect({ left: 260, top: 20, width: 40, height: 20 })
    surface.getBoundingClientRect = () => {
      const left = Number.parseFloat(popover.style.left || '0')
      const top = Number.parseFloat(popover.style.top || '0')
      return makeRect({ left, top, width: 180, height: 220 })
    }

    act(() => {
      window.dispatchEvent(new Event('resize'))
    })

    expect(Number.parseFloat(popover.style.left)).toBe(132)
    expect(Number.parseFloat(popover.style.top)).toBe(12)
  })

  it('starts Motion drag controls from the drag handle', () => {
    startDragMock.mockClear()

    render(
      <Popover
        open={true}
        onOpenChange={vi.fn()}
        offset={8}
        draggable
        trigger={<span>Open</span>}
        content={
          <div data-popover-drag-handle="true" data-testid="drag-handle">
            Drag handle
          </div>
        }
      />
    )

    const handle = screen.getByTestId('drag-handle')

    fireEvent.pointerDown(handle, { button: 0, clientX: 120, clientY: 120 })

    expect(startDragMock).toHaveBeenCalledOnce()
  })
})
