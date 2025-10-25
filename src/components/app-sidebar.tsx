import { 
  Home, 
  Users, 
  Bed, 
  Calendar, 
  CreditCard, 
  Utensils, 
  Settings,
  ClipboardList,
  UserCog
} from "lucide-react"
import { NavLink } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"
import kerayuLogo from "@/assets/kerayu-logo.png"

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Front Desk", url: "/front-desk", icon: Users },
  { title: "Rooms", url: "/rooms", icon: Bed },
  { title: "Bookings", url: "/bookings", icon: Calendar },
  { title: "Finance", url: "/finance", icon: CreditCard },
  { title: "Housekeeping", url: "/housekeeping", icon: ClipboardList },
  { title: "Restaurant", url: "/restaurant", icon: Utensils },
  { title: "Employees", url: "/employees", icon: UserCog },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <img 
            src={kerayuLogo} 
            alt="Kerayu" 
            className={`transition-all ${isCollapsed ? "h-8 w-8" : "h-10 w-auto"}`}
          />
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-semibold text-sidebar-foreground">KERAYU</h2>
              <p className="text-xs text-muted-foreground">Hotel Management</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "hover:bg-sidebar-accent/50"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
