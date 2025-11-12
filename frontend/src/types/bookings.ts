export interface Guest {
  id: string;
  first_name?: string;
  father_name?: string | null;
  last_name?: string;
  email?: string | null;
  phone?: string | null;
  nationality?: string | null;
  is_vip?: boolean;
  created_at?: string;
}

export type BookingStatus =
  | "confirmed"
  | "active"
  | "checking_out"
  | "completed"
  | "cancelled";

export interface Room {
  id: string;
  room_number?: string;
  room_type_id?: string | null;
  base_price_birr?: number;
  status?: string;
}

export interface Booking {
  id: string;
  guest_id?: string | null;
  room_id?: string | null;
  check_in: string;
  check_out: string;
  number_of_guests?: number;
  status?: BookingStatus;
  source?: string;
  total_price_birr?: number;
  advance_payment_birr?: number;
  special_requests?: string | null;
  actual_check_in?: string | null;
  actual_check_out?: string | null;
  total_nights?: number;
  created_at?: string;
  // optional joined relations returned by backend
  guests?: Guest | null;
  guest?: Guest | null; // alias - some APIs return `guest`
  rooms?: Room | null;
  room?: Room | null; // alias - some APIs return `room`
}

export interface CreateBookingInput {
  guest_id: string;
  room_id: string;
  check_in: string; // YYYY-MM-DD
  check_out: string; // YYYY-MM-DD
  number_of_guests?: number;
  status?: BookingStatus;
  source?: string;
  total_price_birr: number;
  advance_payment_birr?: number;
  special_requests?: string;
}

export type UpdateBookingInput = Partial<CreateBookingInput>;
