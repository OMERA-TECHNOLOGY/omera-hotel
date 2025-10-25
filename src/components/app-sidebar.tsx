import {
  Home,
  Users,
  Bed,
  Calendar,
  CreditCard,
  Utensils,
  Settings,
  ClipboardList,
  UserCog,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "@/contexts/language-context";
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
} from "@/components/ui/sidebar";
import OmeraLogo from "@/assets/Omera-logo.png";

export function AppSidebar() {
  const { state } = useSidebar();
  const { t } = useLanguage();
  const isCollapsed = state === "collapsed";

  const menuItems = [
    { title: t.dashboard, url: "/dashboard", icon: Home },
    { title: t.frontDesk, url: "/front-desk", icon: Users },
    { title: t.rooms, url: "/rooms", icon: Bed },
    { title: t.bookings, url: "/bookings", icon: Calendar },
    { title: t.finance, url: "/finance", icon: CreditCard },
    { title: t.housekeeping, url: "/housekeeping", icon: ClipboardList },
    { title: t.restaurant, url: "/restaurant", icon: Utensils },
    { title: t.employees, url: "/employees", icon: UserCog },
    { title: t.settings, url: "/settings", icon: Settings },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <img
            src={OmeraLogo}
            alt="Omera"
            className={`transition-all ${
              isCollapsed ? "h-8 w-8" : "h-10 w-auto"
            }`}
          />
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-semibold text-sidebar-foreground">
                Omera
              </h2>
              <p className="text-xs text-muted-foreground">Hotel Management</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t.dashboard}</SidebarGroupLabel>
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
  );
}
