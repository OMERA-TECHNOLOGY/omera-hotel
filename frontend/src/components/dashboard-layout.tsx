import {
  SidebarProvider,
  SidebarTrigger,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import { NaturalSidebarContent } from "@/components/natural-sidebar-content";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSelector } from "@/components/language-selector";
import { NotificationDropdown, ProfileDropdown } from "./index";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar
          collapsible="icon"
          variant="floating"
          className="!bg-transparent !border-none !shadow-none !p-0"
        >
          <div className="w-full h-full">
            <NaturalSidebarContent />
          </div>
        </Sidebar>
        <SidebarInset className="flex-1 flex flex-col min-w-0">
          <header className="flex h-16 items-center gap-4 border-b border-sidebar-border bg-sidebar px-6 sticky top-0 z-30 shrink-0">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold">Omera Dashboard</h1>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <LanguageSelector />
              <ThemeToggle />
              <div className="flex items-center gap-2">
                <NotificationDropdown />
                <ProfileDropdown />
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 bg-sidebar overflow-auto min-h-0">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
