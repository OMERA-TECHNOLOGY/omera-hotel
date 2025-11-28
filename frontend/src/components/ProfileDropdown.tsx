import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";

export const ProfileDropdown: React.FC = () => {
  const { profile } = useProfile();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const id = "profile";

  useEffect(() => {
    const onExternalOpen = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail !== id) setOpen(false);
    };
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node | null;
      const el = rootRef.current;
      if (!el) return;
      if (target && !el.contains(target)) setOpen(false);
    };

    window.addEventListener(
      "omera:dropdown:open",
      onExternalOpen as EventListener
    );
    document.addEventListener("click", onDocClick);
    return () => {
      window.removeEventListener(
        "omera:dropdown:open",
        onExternalOpen as EventListener
      );
      document.removeEventListener("click", onDocClick);
    };
  }, []);

  const onLogout = async () => {
    // simple logout call
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    } catch (err) {
      console.error("logout", err);
    }
  };

  return (
    <div className="relative">
      <div ref={rootRef}>
        <button
          onClick={() => {
            const next = !open;
            setOpen(next);
            if (next)
              window.dispatchEvent(
                new CustomEvent("omera:dropdown:open", { detail: id })
              );
          }}
          className="flex items-center gap-2 p-1 rounded hover:bg-gray-100"
        >
          {(() => {
            const name =
              profile?.first_name ??
              profile?.employee?.first_name ??
              profile?.user?.email ??
              null;
            const initials = name
              ? name
                  .toString()
                  .trim()
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((p) => p.charAt(0).toUpperCase())
                  .join("")
              : null;

            const avatarUrl =
              profile?.avatar_url ?? profile?.user?.avatar_url ?? null;

            if (avatarUrl) {
              return (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="h-8 w-8 rounded-full object-cover"
                />
              );
            }

            if (initials) {
              return (
                <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-medium">
                  {initials}
                </div>
              );
            }

            return (
              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 21c0-4.418-3.582-8-8-8H11c-4.418 0-8 3.582-8 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            );
          })()}
          <span className="hidden md:block text-sm">
            {profile
              ? `${
                  profile.first_name ??
                  profile.employee?.first_name ??
                  profile.user?.email ??
                  "Account"
                } ${
                  profile.last_name ?? profile.employee?.last_name ?? ""
                }`.trim()
              : "Account"}
          </span>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border rounded shadow-lg z-50">
            <div className="p-4 border-b">
              <div className="font-semibold">
                {
                  (profile?.first_name ??
                    profile?.employee?.first_name ??
                    profile?.user?.email) as string
                }
                {profile?.last_name ?? profile?.employee?.last_name
                  ? ` ${profile?.last_name ?? profile?.employee?.last_name}`
                  : ""}
              </div>
              <div className="text-sm text-gray-500">
                {profile?.email ??
                  profile?.employee?.email ??
                  profile?.user?.email}
              </div>
            </div>
            <div className="flex flex-col">
              <Link to="/profile" className="px-4 py-2 hover:bg-gray-50">
                Profile Settings
              </Link>
              <Link to="/notifications" className="px-4 py-2 hover:bg-gray-50">
                Notifications
              </Link>
              <Link to="/billing" className="px-4 py-2 hover:bg-gray-50">
                Billing
              </Link>
              <Link to="/connected" className="px-4 py-2 hover:bg-gray-50">
                Connected Accounts
              </Link>
              <div className="border-t mt-2" />
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDropdown;
