import { useState, useEffect, useRef } from "react";
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
  Sparkles,
  Moon,
  Sun,
  Building,
  Menu,
  Leaf,
  Waves,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useLanguage } from "@/contexts/language-context";

// Organic floating elements - inspired by nature
const OrganicFloaters = () => {
  const floaters = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 4,
    size: Math.random() * 3 + 1,
    type: Math.random() > 0.5 ? "circle" : "blob",
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {floaters.map((floater) => (
        <div
          key={floater.id}
          className={`absolute ${
            floater.type === "blob"
              ? "bg-emerald-400/10 dark:bg-emerald-300/5"
              : "bg-amber-400/10 dark:bg-amber-300/5"
          }`}
          style={{
            left: `${floater.x}%`,
            top: `${floater.y}%`,
            width: `${floater.size * 8}px`,
            height: `${floater.size * 8}px`,
            borderRadius:
              floater.type === "blob"
                ? "40% 60% 60% 40% / 60% 30% 70% 40%"
                : "50%",
            animation: `organic-float ${
              15 + floater.id * 2
            }s ease-in-out infinite`,
            animationDelay: `${floater.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

// Natural texture background
const NaturalTexture = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 via-stone-50/20 to-emerald-50/30 dark:from-stone-900/30 dark:via-stone-800/20 dark:to-emerald-900/20" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-200/5 via-transparent to-emerald-200/5 dark:from-amber-900/5 dark:via-transparent dark:to-emerald-900/5" />
  </div>
);

// Smart sidebar state
const useNaturalSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  return {
    isCollapsed,
    setIsCollapsed,
    isHovered,
    setIsHovered,
    activeIndex,
    setActiveIndex,
  };
};

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
      {/* Natural texture overlay */}
      <div
        className={`absolute inset-0 bg-stone-300/10 dark:bg-stone-600/10 transition-opacity duration-500 ${
          isAnimating ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      />

      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-amber-500 transition-transform duration-500" />
      ) : (
        <Moon className="h-5 w-5 text-stone-600 transition-transform duration-500" />
      )}

      {/* Natural ripple effect */}
      {isAnimating && (
        <div className="absolute inset-0 bg-stone-400/20 dark:bg-stone-500/20 rounded-xl animate-organic-pulse" />
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

      {/* Natural texture overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-stone-600/20 to-stone-800/20 rounded-2xl"
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

// Main natural sidebar component
export function NaturalAppSidebar() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const location = useLocation();

  const {
    isCollapsed,
    setIsCollapsed,
    isHovered,
    setIsHovered,
    activeIndex,
    setActiveIndex,
  } = useNaturalSidebar();

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

  return (
    <div
      className={`
        relative h-screen transition-all duration-500 ease-in-out overflow-hidden
        bg-amber-50 dark:bg-stone-900
        border-r border-stone-200/80 dark:border-stone-700/80
        backdrop-blur-sm
        ${isCollapsed ? "w-20" : "w-80"}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Natural Background Effects */}
      <NaturalTexture />
      <OrganicFloaters />

      {/* Soft overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/40 to-stone-50/30 dark:from-stone-900/40 dark:to-stone-800/30 backdrop-blur-sm" />

      {/* Sidebar Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div
          className={`
          p-6 border-b border-stone-200/50 dark:border-stone-700/50 
          transition-all duration-500
          ${isHovered && "border-stone-300/50 dark:border-stone-600/50"}
        `}
        >
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

            {/* Organic Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`
                p-2 rounded-lg transition-all duration-500 group
                bg-white/50 dark:bg-stone-800/50 backdrop-blur-sm
                border border-stone-200/60 dark:border-stone-700/60
                hover:bg-white/70 dark:hover:bg-stone-700/70
                hover:shadow-lg hover:scale-105
                ${isHovered ? "opacity-100" : "opacity-80"}
              `}
            >
              <Menu
                className={`
                h-4 w-4 text-stone-600 dark:text-stone-400 transition-transform duration-500
                ${isCollapsed ? "rotate-0" : "rotate-90"}
              `}
              />
            </button>
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
        <div
          className={`
          p-6 border-t border-stone-200/50 dark:border-stone-700/50
          transition-all duration-500
          ${isHovered && "border-stone-300/50 dark:border-stone-600/50"}
        `}
        >
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

      {/* Hover expansion area for collapsed state */}
      {isCollapsed && (
        <div
          className="absolute inset-0 z-20 cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
        />
      )}
    </div>
  );
}

// Organic CSS animations
const organicStyles = `
@keyframes organic-float {
  0%, 100% { 
    transform: translateY(0px) translateX(0px) rotate(0deg);
    opacity: 0.3;
  }
  33% { 
    transform: translateY(-15px) translateX(8px) rotate(120deg);
    opacity: 0.5;
  }
  66% { 
    transform: translateY(10px) translateX(-8px) rotate(240deg);
    opacity: 0.4;
  }
}

@keyframes organic-pulse {
  0%, 100% { 
    transform: scale(1);
    opacity: 0.2;
  }
  50% { 
    transform: scale(1.1);
    opacity: 0.3;
  }
}

@keyframes soft-bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  40% {
    transform: translateY(-2px) rotate(5deg);
  }
  60% {
    transform: translateY(-1px) rotate(-3deg);
  }
}

.animate-organic-float {
  animation: organic-float 20s ease-in-out infinite;
}

.animate-organic-pulse {
  animation: organic-pulse 2s ease-in-out;
}

.animate-soft-bounce {
  animation: soft-bounce 3s ease-in-out infinite;
}

/* Custom scrollbar with natural colors */
.premium-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.premium-scrollbar::-webkit-scrollbar-track {
  background: rgba(120, 113, 108, 0.1);
  border-radius: 10px;
}

.premium-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #a8a29e, #78716c);
  border-radius: 10px;
}

.premium-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #78716c, #57534e);
}

/* Smooth natural transitions */
* {
  transition-property: color, background-color, border-color, opacity, transform, box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 400ms;
}

/* Natural color scheme adjustments */
@media (prefers-color-scheme: dark) {
  .dark\:scrollbar-thumb {
    background: linear-gradient(to bottom, #a8a29e, #d6d3d1);
  }
}
`;

// Add styles to document
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = organicStyles;
  document.head.appendChild(styleSheet);
}
