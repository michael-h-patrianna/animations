import React, { useEffect } from 'react'
import { presentBox } from '@/assets'
import { AnimationInspectorProvider, useAnimationInspector } from '@/contexts/AnimationInspectorContext'
import { EditorRightPanel } from '@/demo-ui/components/layout/EditorRightPanel'
import type { Group } from '@/types/animation'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

const group: Group = {
  id: 'test-group-framer',
  title: 'Test Group',
  tech: 'framer',
  animations: [
    {
      id: 'test-group__editable',
      title: 'Editable Animation',
      description: 'Animation with editable props',
      categoryId: 'base',
      groupId: 'test-group-framer',
      urlSlugFramer: '/test-group-framer?animation=test-group__editable',
      urlSlugCss: '/test-group-css?animation=test-group__editable',
      props: [
        {
          name: 'labelText',
          label: 'Label text',
          type: 'string',
          default: 'Hello world',
          description: 'Shown beneath the field without extra card chrome.',
        },
      ],
    },
  ],
}

const starterImageGroup: Group = {
  id: 'icon-animations-framer',
  title: 'Icon Animations',
  tech: 'framer',
  animations: [
    {
      id: 'icon-animations__bounce',
      title: 'Bounce',
      description: 'Animated reward icon with starter preview image.',
      categoryId: 'rewards',
      groupId: 'icon-animations-framer',
      urlSlugFramer: '/icon-animations-framer?animation=icon-animations__bounce',
      urlSlugCss: '/icon-animations-css?animation=icon-animations__bounce',
      props: [
        { name: 'src', label: 'Image URL', type: 'image' },
        { name: 'alt', label: 'Alt Text', type: 'string', default: '' },
      ],
    },
  ],
}

function SelectAnimationOnMount() {
  const { selectAnimation } = useAnimationInspector()

  useEffect(() => {
    selectAnimation(group.animations[0])
  }, [selectAnimation])

  return null
}

describe('EditorRightPanel', () => {
  it('renders property fields inside bordered field cards', async () => {
    const view = (
      <AnimationInspectorProvider currentGroup={group}>
        <SelectAnimationOnMount />
        <EditorRightPanel />
      </AnimationInspectorProvider>
    )

    render(view)

    const input = await screen.findByTestId('prop-field-labelText')
    const fieldContainer = input.closest('[data-testid="input-container"]')

    expect(fieldContainer).not.toBeNull()
    expect(fieldContainer?.parentElement).toHaveClass('rounded-2xl')
    expect(fieldContainer?.parentElement).toHaveClass('border')
    expect(fieldContainer?.parentElement).toHaveClass('p-3')
    expect(screen.getByText('Shown beneath the field without extra card chrome.')).toBeVisible()
  })

  it('keeps starter image defaults clean while still allowing custom overrides', async () => {
    function SelectStarterAnimationOnMount() {
      const { selectAnimation } = useAnimationInspector()

      useEffect(() => {
        selectAnimation(starterImageGroup.animations[0])
      }, [selectAnimation])

      return null
    }

    render(
      <AnimationInspectorProvider currentGroup={starterImageGroup}>
        <SelectStarterAnimationOnMount />
        <EditorRightPanel />
      </AnimationInspectorProvider>
    )

    const srcInput = (await screen.findByTestId('prop-field-src')) as HTMLInputElement
    expect(srcInput.value).toBe(presentBox)
    expect(screen.queryByRole('button', { name: 'Reset' })).not.toBeInTheDocument()

    fireEvent.change(srcInput, { target: { value: 'https://example.com/custom.png' } })
    expect(srcInput.value).toBe('https://example.com/custom.png')
    expect(screen.getByRole('button', { name: 'Reset' })).toBeVisible()

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }))
    expect(srcInput.value).toBe(presentBox)
    expect(screen.queryByRole('button', { name: 'Reset' })).not.toBeInTheDocument()
  })
})
