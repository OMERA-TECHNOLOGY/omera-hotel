export type Theme = "light" | "dark" | "system";

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
}

export interface UserPreferences {
  theme: Theme;
  language: string; // e.g., 'en', 'am', 'om'
  notification_preferences: NotificationPreferences;
  privacy_opt_out?: boolean;
  reduced_motion?: boolean;
}
