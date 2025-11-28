import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
  ChevronRight,
  Moon,
  Sun,
  Building,
  Leaf,
  Waves,
  X,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useLanguage } from "@/contexts/language-context";
import { useSidebar } from "@/components/ui/sidebar";

// Simple Earth-toned icon component
const EarthIcon = ({
  icon: Icon,
  isActive,
}: {
  icon: any;
  isActive: boolean;
}) => (
  <div className="relative flex items-center justify-center">
    <Icon
      className={`h-5 w-5 transition-all duration-300 ${
        isActive
          ? "text-sidebar-primary-foreground scale-110"
          : "text-sidebar-foreground dark:text-sidebar-foreground group-hover:text-sidebar-accent dark:group-hover:text-sidebar-accent"
      }`}
    />
  </div>
);

// Simple natural navigation link
const NaturalNavLink = ({
  item,
  isActive,
  isCollapsed,
  onClick,
}: {
  item: any;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}) => {
  return (
    <NavLink
      to={item.url}
      onClick={onClick}
      title={isCollapsed ? item.title : undefined}
      className={`
          group relative flex items-center rounded-xl 
          transition-all duration-300 overflow-hidden
          border border-sidebar-border/50 dark:border-sidebar-border/50
          ${
            isActive
              ? "text-sidebar-primary-foreground shadow-lg border-sidebar-border/30 bg-sidebar-primary dark:bg-sidebar-primary"
              : "text-sidebar-foreground dark:text-sidebar-foreground bg-sidebar/50 dark:bg-sidebar/80 hover:bg-sidebar/70 dark:hover:bg-sidebar/70"
          }
          ${
            isCollapsed ? "justify-center p-3" : "justify-start px-4 py-3 gap-3"
          }
          w-full
        `}
    >
      {/* Active state overlay */}
      {isActive && (
        <div className="absolute inset-0 bg-sidebar-primary/90 dark:bg-sidebar-primary/90 rounded-xl" />
      )}

      {/* Accent line */}
      <div
        className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full ${
          isActive
            ? "bg-amber-500 dark:bg-amber-400"
            : "bg-emerald-400/0 group-hover:bg-emerald-400/50"
        }`}
      />

      <EarthIcon icon={item.icon} isActive={isActive} />

      {/* Text content */}
      {!isCollapsed && (
        <div className="flex-1 min-w-0 flex items-center justify-between">
          <span className="font-medium relative z-10">{item.title}</span>

          {/* Right side elements */}
          {isActive ? (
            <Leaf className="w-4 h-4 text-amber-300 animate-soft-bounce" />
          ) : (
            <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300 text-sidebar-foreground" />
          )}
        </div>
      )}

      {/* Collapsed state active indicator */}
      {isCollapsed && isActive && (
        <div className="absolute -top-1 -right-1">
          <Leaf className="w-3 h-3 text-amber-300" />
        </div>
      )}
    </NavLink>
  );
};

// Simple theme toggle
const NaturalThemeToggle = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`
        relative rounded-xl transition-all duration-300
        bg-sidebar/90 dark:bg-sidebar/80
        hover:shadow-lg border border-sidebar-border/50 dark:border-sidebar-border/50
        ${isCollapsed ? "p-2" : "p-3"}
        flex items-center justify-center
      `}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-amber-500" />
      ) : (
        <Moon className="h-5 w-5 text-sidebar-foreground" />
      )}
    </button>
  );
};

// Enhanced logo component with toggle functionality
const OrganicLogo = ({
  isCollapsed,
  onToggle,
}: {
  isCollapsed: boolean;
  onToggle: () => void;
}) => (
  <div
    className="relative cursor-pointer transition-transform duration-300 hover:scale-105"
    onClick={onToggle}
  >
    <div className={`relative ${isCollapsed ? "w-10 h-10" : "w-12 h-12"}`}>
      <div
        className="absolute inset-0 bg-sidebar-primary dark:bg-sidebar-primary rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl"
        style={{ borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }}
      />
      <Building className="absolute inset-0 m-auto text-sidebar-primary-foreground h-5 w-5" />
      <div
        className="absolute -bottom-1 -right-1 w-3 h-3 bg-amber-500 rounded-full transition-all duration-300 hover:scale-110"
        style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
      />
    </div>
  </div>
);

export function NaturalSidebarContent() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const location = useLocation();
  const { state, toggleSidebar, isMobile, setOpenMobile } = useSidebar();
  const [activeIndex, setActiveIndex] = useState(0);

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

  useEffect(() => {
    const currentIndex = menuItems.findIndex((item) =>
      location.pathname.startsWith(item.url)
    );
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [location.pathname]);

  const isCollapsed = state === "collapsed";

  // Toggle function for the logo
  const handleLogoClick = () => {
    toggleSidebar();
  };

  // Mobile Section
  if (isMobile) {
    return (
      <div className="relative h-full flex flex-col bg-sidebar">
        {/* Header with close button */}
        <div className="p-6 border-b border-sidebar-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <OrganicLogo isCollapsed={false} onToggle={toggleSidebar} />
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-serif font-bold text-sidebar-foreground">
                  Omera
                </h2>
                <p className="text-sm text-sidebar-foreground font-medium mt-1 flex items-center gap-1">
                  <Waves className="w-3 h-3" />
                  Natural Retreat
                </p>
              </div>
            </div>
            {/* Close button - top right */}
            <button
              onClick={() => setOpenMobile(false)}
              className="p-2 rounded-lg hover:bg-sidebar/70 transition-colors"
            >
              <X className="h-5 w-5 text-sidebar-foreground" />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-6">
          <div className="space-y-2 px-4">
            {menuItems.map((item, index) => (
              <NaturalNavLink
                key={item.title}
                item={item}
                isActive={activeIndex === index}
                isCollapsed={false}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-sidebar-border/50">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground">
                {theme === "dark" ? "Evening Mode" : "Daylight Mode"}
              </p>
              <p className="text-xs text-sidebar-foreground">
                Natural lighting
              </p>
            </div>
            <NaturalThemeToggle isCollapsed={false} />
          </div>
        </div>
      </div>
    );
  }

  // Desktop Section
  return (
    <div className="h-full flex flex-col bg-sidebar border-r border-sidebar-border/80 dark:border-sidebar-border/80 w-full">
      {/* Header with clickable logo */}
      <div
        className={`p-6 border-b border-sidebar-border/50 ${
          isCollapsed ? "px-4" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <OrganicLogo isCollapsed={isCollapsed} onToggle={handleLogoClick} />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-serif font-bold text-sidebar-foreground">
                Omera
              </h2>
              <p className="text-sm text-sidebar-foreground font-medium mt-1 flex items-center gap-1">
                <Waves className="w-3 h-3" />
                Natural Retreat
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-6">
        <div className={`space-y-2 ${isCollapsed ? "px-3" : "px-4"}`}>
          {menuItems.map((item, index) => (
            <NaturalNavLink
              key={item.title}
              item={item}
              isActive={activeIndex === index}
              isCollapsed={isCollapsed}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        className={`p-6 border-t border-sidebar-border/50 ${
          isCollapsed ? "px-4" : ""
        }`}
      >
        <div
          className={`flex items-center gap-3 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground">
                {theme === "dark" ? "Evening Mode" : "Daylight Mode"}
              </p>
              <p className="text-xs text-sidebar-foreground">
                Natural lighting
              </p>
            </div>
          )}
          <NaturalThemeToggle isCollapsed={isCollapsed} />
        </div>
      </div>
    </div>
  );
}
