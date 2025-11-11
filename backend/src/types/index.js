import { Request } from "express";
// src/types/index.ts (updated)

export interface User {
  id: number;
  full_name: string;
  email: string;
  password_hash: string;
  role: "admin" | "manager" | "receptionist" | "housekeeping" | "finance";
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface Room {
  id: number;
  room_number: string;
  type: "single" | "double" | "suite";
  floor: number;
  price_per_night: number;
  status: "available" | "occupied" | "maintenance";
  description?: string;
  created_at: string;
}

export interface Booking {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  num_guests: number;
  booking_status: "confirmed" | "cancelled" | "checked_in" | "checked_out";
  total_amount: number;
  payment_status: "pending" | "paid" | "refunded";
  created_at: string;
  created_by?: number;
}

export interface Payment {
  id: number;
  booking_id: number;
  amount: number;
  method: "cash" | "card" | "online";
  payment_date: string;
  status: "completed" | "pending" | "failed";
  transaction_ref?: string;
  created_at: string;
}

export interface Employee {
  id: number;
  user_id: number;
  department:
    | "front desk"
    | "housekeeping"
    | "restaurant"
    | "finance"
    | "management";
  position: string;
  salary: number;
  hire_date: string;
  status: "active" | "terminated";
  contact_number: string;
  address?: string;
  created_at: string;
}

export interface HousekeepingTask {
  id: number;
  room_id: number;
  assigned_to: number;
  task_description: string;
  status: "pending" | "in_progress" | "completed";
  date_assigned: string;
  date_completed?: string;
  created_at: string;
}

export interface RestaurantOrder {
  id: number;
  booking_id: number;
  item_name: string;
  quantity: number;
  price: number;
  order_time: string;
  status: "ordered" | "served" | "cancelled";
}

export interface FinanceRecord {
  id: number;
  category: "income" | "expense";
  source: string;
  amount: number;
  description?: string;
  record_date: string;
  created_by: number;
  created_at: string;
}

export interface Setting {
  id: number;
  user_id?: number;
  key: string;
  value: string;
  updated_at: string;
}

export interface AuthRequest extends Request {
  user?: User;
}
