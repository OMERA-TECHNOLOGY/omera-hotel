// Models mapped to database schema in `backend/database.sql`

// `users` table (simplified view)
export interface DbUser {
  id: string; // uuid
  employee_id?: string | null; // references employees.id
  email: string;
  role?: string | null; // 'admin' | 'manager' | 'receptionist'
  is_active?: boolean;
  last_login?: string | null; // timestamptz
  created_at?: string;
  updated_at?: string;
}

// `employees` table (fields available for profile)
export interface Employee {
  id: string;
  user_id?: string | null;
  first_name: string;
  father_name?: string | null;
  last_name: string;
  email: string;
  phone?: string | null;
  role?: string | null; // role within hotel (e.g., 'receptionist')
  department?: string | null;
  shift?: string | null;
  salary_birr?: string | null;
  hire_date?: string | null;
  status?: string | null;
  created_at?: string;
}

// Combined shape the frontend uses for 'current user/profile'
export interface UserProfile {
  user: DbUser;
  employee?: Employee | null;
  // optional convenience flattened fields (may be provided by backend)
  id?: string; // alias to user.id for convenience
  first_name?: string;
  father_name?: string | null;
  last_name?: string;
  email?: string;
  phone?: string | null;
  avatar_url?: string | null; // not present in schema by default; commonly stored in user metadata/storage
  created_at?: string;
}

export interface SecuritySettings {
  two_factor_enabled: boolean;
  last_password_change?: string;
}

export interface ConnectedAccount {
  provider: string;
  provider_id: string;
  display_name?: string;
}

// Payload accepted by profile update endpoints. Keep fields optional to allow partial updates.
export interface ProfileUpdatePayload {
  first_name?: string;
  father_name?: string | null;
  last_name?: string;
  phone?: string | null;
  department?: string | null;
  avatar?: string | File | null; // base64, URL or File
}
