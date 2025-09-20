import * as React from 'react';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

const sidebarVariants = cva(
  'flex h-full w-[240px] flex-col border-r bg-background',
  {
    variants: {
      side: {
        left: 'border-r',
        right: 'border-l',
      },
    },
    defaultVariants: {
      side: 'left',
    },
  }
);

interface SidebarContextValue {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

const SidebarContext = React.createContext<SidebarContextValue>({
  expanded: true,
  setExpanded: () => {},
});

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof sidebarVariants> {
  defaultExpanded?: boolean;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, side, defaultExpanded = true, ...props }, ref) => {
    const [expanded, setExpanded] = React.useState(defaultExpanded);

    return (
      <SidebarContext.Provider value={{ expanded, setExpanded }}>
        <aside
          ref={ref}
          data-sidebar="true"
          className={cn(sidebarVariants({ side }), className)}
          {...props}
        />
      </SidebarContext.Provider>
    );
  }
);
Sidebar.displayName = 'Sidebar';

const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center border-b px-4 py-3', className)} {...props} />
  )
);
SidebarHeader.displayName = 'SidebarHeader';

const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex-1 overflow-auto py-2', className)} {...props} />
  )
);
SidebarContent.displayName = 'SidebarContent';

const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('border-t px-4 py-3', className)} {...props} />
  )
);
SidebarFooter.displayName = 'SidebarFooter';

const SidebarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-3 py-2', className)} {...props} />
  )
);
SidebarGroup.displayName = 'SidebarGroup';

const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-2 py-1 text-xs font-semibold text-muted-foreground', className)}
      {...props}
    />
  )
);
SidebarGroupLabel.displayName = 'SidebarGroupLabel';

const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-1', className)} {...props} />
  )
);
SidebarGroupContent.displayName = 'SidebarGroupContent';

interface SidebarMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  active?: boolean;
}

const SidebarMenuItem = React.forwardRef<HTMLButtonElement, SidebarMenuItemProps>(
  ({ className, asChild = false, active, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(
          'flex w-full items-center rounded-md px-2 py-1.5 text-sm font-medium transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          active && 'bg-accent text-accent-foreground',
          className
        )}
        {...props}
      />
    );
  }
);
SidebarMenuItem.displayName = 'SidebarMenuItem';

const SidebarMenuSub = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('ml-3 border-l pl-3', className)} {...props} />
  )
);
SidebarMenuSub.displayName = 'SidebarMenuSub';

const SidebarMenuSubItem = React.forwardRef<HTMLButtonElement, SidebarMenuItemProps>(
  ({ className, asChild = false, active, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(
          'flex w-full items-center rounded-md px-2 py-1 text-sm transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          active && 'bg-accent text-accent-foreground',
          className
        )}
        {...props}
      />
    );
  }
);
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem';

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarContext,
};