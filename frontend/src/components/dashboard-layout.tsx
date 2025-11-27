import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { NaturalAppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSelector } from "@/components/language-selector";
import { Bell, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Mobile sidebar overlay component
const MobileSidebarOverlay = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar Overlay */}
      <div className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 lg:hidden">
        <NaturalAppSidebar onMobileClose={onClose} />
      </div>
    </>
  );
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="h-screen flex w-full">
        {/* Desktop Sidebar - hidden on mobile */}
        <div className="hidden lg:block">
          <NaturalAppSidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        <MobileSidebarOverlay
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col w-full">
          {/* Header */}
          <header className="h-16 border-b border-border bg-white flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 dark:bg-gray-900">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button - Always visible on mobile */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>

              {/* Desktop Sidebar Trigger - Hidden on mobile */}
              <div className="hidden lg:block">
                <SidebarTrigger />
              </div>

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
          <main className="flex-1 p-4 sm:p-6 bg-background overflow-auto dark:bg-gray-950">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
