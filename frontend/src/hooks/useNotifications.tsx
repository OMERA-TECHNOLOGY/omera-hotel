import { useEffect, useState, useCallback } from "react";
import { Notification } from "../types/notification";
import { apiGet, apiPost, apiPut, extractError } from "../lib/api";

export function useNotifications(pollInterval = 0) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<{ notifications: Notification[] }>(
        "/notifications"
      );
      setNotifications(data.notifications || []);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    if (pollInterval > 0) {
      const id = setInterval(fetchNotifications, pollInterval);
      return () => clearInterval(id);
    }
  }, [fetchNotifications, pollInterval]);

  const markAsRead = async (id: string) => {
    try {
      await apiPut(`/notifications/${id}/read`, {});
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("markAsRead", extractError(err));
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiPost("/notifications/mark_all_read", {});
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("markAllAsRead", extractError(err));
    }
  };

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    unreadCount: notifications.filter((n) => !n.is_read).length,
  };
}
