import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { render } from '@testing-library/react'

describe('UI • Sidebar', () => {
  it('renders structure with groups and menu items', () => {
    const { getByText } = render(
      <Sidebar>
        <SidebarHeader>Header</SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Label</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenuItem>Item A</SidebarMenuItem>
              <SidebarMenuSub>
                <SidebarMenuSubItem>Sub A</SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>Footer</SidebarFooter>
      </Sidebar>
    )
    expect(getByText('Header')).toBeInTheDocument()
    expect(getByText('Label')).toBeInTheDocument()
    expect(getByText('Item A')).toBeInTheDocument()
    expect(getByText('Sub A')).toBeInTheDocument()
    expect(getByText('Footer')).toBeInTheDocument()
  })
})

describe('UI • Accordion', () => {
  it('renders trigger and content', () => {
    const { getByText } = render(
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Trigger</AccordionTrigger>
          <AccordionContent>Panel</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    expect(getByText('Trigger')).toBeInTheDocument()
    expect(getByText('Panel')).toBeInTheDocument()
  })
})
