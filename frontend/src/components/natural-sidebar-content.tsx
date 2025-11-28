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
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useLanguage } from "@/contexts/language-context";
import { useSidebar } from "@/components/ui/sidebar";

// Earth-toned icon component
const EarthIcon = ({
  icon: Icon,
  isActive,
}: {
  icon: any;
  isActive: boolean;
}) => (
  <div className="relative">
    <Icon
      className={`h-5 w-5 transition-all duration-300 ${
        isActive
          ? "text-stone-100 scale-110"
          : "text-stone-600 dark:text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-300"
      }`}
    />
    {isActive && (
      <div className="absolute -inset-2 bg-stone-700 dark:bg-stone-600 rounded-lg blur-sm opacity-30" />
    )}
  </div>
);

// Natural navigation link with organic feel
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
      className={`
        group relative flex items-center gap-3 px-4 py-3 rounded-xl 
        transition-all duration-500 overflow-hidden
        border border-stone-200/50 dark:border-stone-700/50
        ${
          isActive
            ? "text-stone-100 shadow-lg scale-100 border-stone-600/30 bg-stone-700 dark:bg-stone-600"
            : "text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 bg-white/30 dark:bg-stone-800/30 hover:bg-white/50 dark:hover:bg-stone-700/50 hover:shadow-md hover:scale-105 hover:border-stone-300/50 dark:hover:border-stone-600/50"
        }
        ${isCollapsed ? "justify-center px-3" : "justify-start"}
      `}
    >
      {/* Active state organic overlay */}
      {isActive && (
        <div className="absolute inset-0 bg-stone-600/80 dark:bg-stone-500/80 rounded-xl" />
      )}

      {/* Organic accent line */}
      <div
        className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full transition-all duration-500 ${
          isActive
            ? "bg-amber-500 dark:bg-amber-400"
            : "bg-emerald-400/0 group-hover:bg-emerald-400/50"
        }`}
      />

      <EarthIcon icon={item.icon} isActive={isActive} />

      {!isCollapsed && (
        <>
          <span
            className={`font-medium transition-all duration-300 relative z-10 ${
              isActive ? "text-stone-100" : "text-inherit"
            }`}
          >
            {item.title}
          </span>

          {/* Natural active indicator - leaf inspired */}
          {isActive && (
            <div className="ml-auto flex items-center gap-1">
              <Leaf className="w-4 h-4 text-amber-300 animate-soft-bounce" />
            </div>
          )}

          {/* Hover arrow with natural color */}
          {!isActive && (
            <ChevronRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300 text-stone-400" />
          )}
        </>
      )}
    </NavLink>
  );
};

// Earth-inspired theme toggle
const NaturalThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setTheme(theme === "dark" ? "light" : "dark");
      setTimeout(() => setIsAnimating(false), 300);
    }, 200);
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        group relative p-3 rounded-xl transition-all duration-500 overflow-hidden
        bg-stone-100 dark:bg-stone-800
        hover:shadow-lg hover:scale-105 transform-gpu
        border border-stone-200 dark:border-stone-700
        ${isAnimating ? "scale-110" : ""}
      `}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-amber-500 transition-transform duration-500" />
      ) : (
        <Moon className="h-5 w-5 text-stone-600 transition-transform duration-500" />
      )}
    </button>
  );
};

// Organic logo component
const OrganicLogo = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <div className="relative">
    <div
      className={`
      relative transition-all duration-500
      ${isCollapsed ? "w-10 h-10" : "w-12 h-12"}
    `}
    >
      {/* Organic shape background */}
      <div
        className="absolute inset-0 bg-stone-700 dark:bg-stone-600 rounded-2xl shadow-lg"
        style={{ borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }}
      />

      {/* Logo icon */}
      <Building className="absolute inset-0 m-auto text-stone-100 h-5 w-5" />

      {/* Organic accent */}
      <div
        className="absolute -bottom-1 -right-1 w-3 h-3 bg-amber-500 rounded-full"
        style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
      />
    </div>
  </div>
);

export function NaturalSidebarContent() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const location = useLocation();
  const { state } = useSidebar();
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

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 border-r border-stone-200/80 dark:border-stone-700/80">
      {/* Header */}
      <div className="p-6 border-b border-stone-200/50 dark:border-stone-700/50">
        <div className="flex items-center gap-3">
          <OrganicLogo isCollapsed={isCollapsed} />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-serif font-bold text-stone-800 dark:text-stone-200">
                Omera
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-400 font-medium mt-1 flex items-center gap-1">
                <Waves className="w-3 h-3" />
                Natural Retreat
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 premium-scrollbar">
        <div className="space-y-2 px-4">
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
      <div className="p-6 border-t border-stone-200/50 dark:border-stone-700/50">
        <div
          className={`
          flex items-center gap-3 transition-all duration-500
          ${isCollapsed ? "justify-center" : "justify-between"}
        `}
        >
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                {theme === "dark" ? "Evening Mode" : "Daylight Mode"}
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-500">
                Natural lighting
              </p>
            </div>
          )}
          <NaturalThemeToggle />
        </div>
      </div>
    </div>
  );
}
