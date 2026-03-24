import React, { useEffect } from 'react'
import { AnimationInspectorProvider, useAnimationInspector } from '@/contexts/AnimationInspectorContext'
import { EditorRightPanel } from '@/demo-ui/components/layout/EditorRightPanel'
import type { Group } from '@/types/animation'
import { render, screen } from '@testing-library/react'
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
})
