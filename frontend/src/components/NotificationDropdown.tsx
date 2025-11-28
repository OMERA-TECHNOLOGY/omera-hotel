import React, { useRef, useEffect, useState } from "react";
import { useNotifications } from "../hooks/useNotifications";
import { Notification } from "../types/notification";
import { formatDistanceToNowStrict, parseISO } from "date-fns";

function TypeBadge({ type }: { type: Notification["type"] }) {
  const map: Record<string, string> = {
    info: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
  };
  return (
    <span className={`px-2 py-0.5 text-xs rounded ${map[type]}`}>{type}</span>
  );
}

export const NotificationDropdown: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const id = "notifications";

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

  const onClickNotification = async (n: Notification) => {
    if (!n.is_read) await markAsRead(n.id);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        aria-label="Notifications"
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next)
            window.dispatchEvent(
              new CustomEvent("omera:dropdown:open", { detail: id })
            );
        }}
        className="relative p-2 rounded hover:bg-gray-100"
      >
        {/* Bell icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 border rounded shadow-lg z-50">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <div className="font-semibold">Notifications</div>
            <div className="flex items-center gap-2">
              <button
                className="text-sm text-gray-500 hover:text-gray-700"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
              <button
                className="p-1 hover:bg-gray-100 rounded text-gray-500"
                title="Notification settings"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-2.21 0-4 1.79-4 4a4 4 0 008 0c0-2.21-1.79-4-4-4z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div style={{ maxHeight: 320 }} className="overflow-auto">
            {notifications.length === 0 && (
              <div className="p-4 text-sm text-gray-500">No notifications</div>
            )}
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onClickNotification(n)}
                className={`flex gap-3 p-3 hover:bg-gray-50 cursor-pointer ${
                  n.is_read ? "opacity-80" : "bg-white"
                }`}
              >
                <div className="flex-shrink-0">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      n.is_read ? "bg-gray-100" : "bg-indigo-600 text-white"
                    }`}
                  >
                    {n.title.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">{n.title}</div>
                    <div className="text-xs text-gray-400">
                      {formatDistanceToNowStrict(parseISO(n.created_at))} ago
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">{n.description}</div>
                  <div className="mt-2">
                    <TypeBadge type={n.type} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t flex items-center justify-between">
            <a
              href="/notifications"
              className="text-sm text-indigo-600 hover:underline"
            >
              View all
            </a>
            <a
              href="/settings/notifications"
              className="text-sm text-gray-500 hover:underline"
            >
              Settings
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
