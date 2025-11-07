import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { NaturalAppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSelector } from "@/components/language-selector";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="h-screen flex w-full">
        <NaturalAppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6 sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold">Omera Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 bg-background overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
