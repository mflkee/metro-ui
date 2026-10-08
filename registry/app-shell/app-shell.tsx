import type { ComponentType, ReactNode } from "react"
import { NavLink, Outlet, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export interface NavItem {
  to: string
  label: string
  icon?: ComponentType<{ className?: string }>
  /** Match the path exactly (use for the index route). */
  end?: boolean
}

export interface NavSection {
  label?: string
  items: NavItem[]
}

type Nav = NavItem[] | NavSection[]

function isSections(nav: Nav): nav is NavSection[] {
  return nav.length > 0 && "items" in (nav[0] as object)
}

/**
 * Opinionated application shell for the metro fleet: shadcn sidebar + topbar
 * + scrolling content area. Mount it as a react-router layout route and render
 * pages into the <Outlet />, or pass children explicitly.
 */
export function AppShell({
  brand,
  nav,
  footer,
  topbarActions,
  children,
}: {
  brand: ReactNode
  nav: Nav
  footer?: ReactNode
  topbarActions?: ReactNode
  children?: ReactNode
}) {
  const { pathname } = useLocation()
  const sections: NavSection[] = isSections(nav) ? nav : [{ items: nav as NavItem[] }]

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2.5 px-2 py-1.5">{brand}</div>
        </SidebarHeader>
        <SidebarContent>
          {sections.map((section, index) => (
            <SidebarGroup key={section.label ?? index}>
              {section.label ? <SidebarGroupLabel>{section.label}</SidebarGroupLabel> : null}
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => {
                    const exact = item.end ?? item.to === "/"
                    const active = exact ? pathname === item.to : pathname.startsWith(item.to)
                    return (
                      <SidebarMenuItem key={item.to}>
                        <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                          <NavLink to={item.to} end={item.end ?? item.to === "/"}>
                            {item.icon ? <item.icon className="size-4" /> : null}
                            <span>{item.label}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        {footer ? <SidebarFooter>{footer}</SidebarFooter> : null}
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 !h-4" />
          <div className="ml-auto flex items-center gap-2">{topbarActions}</div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children ?? <Outlet />}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
