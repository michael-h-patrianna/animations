import { Slot } from '@radix-ui/react-slot'
import { type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { buttonVariants } from './button-variants'

import { cn } from '@/lib/utils'

/** Props for the Button component, extending native button props with CVA variants. */
export interface ButtonProps
  extends React.ComponentPropsWithRef<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = ({ className, variant, size, asChild = false, ref, ...props }: ButtonProps) => {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
}
Button.displayName = 'Button'

export { Button }
