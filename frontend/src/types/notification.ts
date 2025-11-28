export type NotificationType = "info" | "warning" | "success" | "error";

export interface Notification {
  id: string;
  user_id?: string; // references users.id
  title: string;
  description?: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string; // ISO timestamp
  metadata?: Record<string, unknown> | null;
}

export interface NotificationsResponse {
  notifications: Notification[];
}
