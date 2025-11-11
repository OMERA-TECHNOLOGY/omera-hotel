// src/models/Booking.ts
import supabase from "../config/supabase";
import { Booking } from "../types";

class BookingModel {
  static async create(
    bookingData: Omit<Booking, "id" | "created_at">
  ): Promise<Booking> {
    const { data, error } = await supabase
      .from("bookings")
      .insert([bookingData])
      .select(
        `
        *,
        rooms (*)
      `
      )
      .single();

    if (error) throw error;
    return data;
  }

  static async findById(id: number): Promise<Booking | null> {
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        *,
        rooms (*)
      `
      )
      .eq("id", id)
      .single();

    if (error) return null;
    return data;
  }

  static async getAll(): Promise<Booking[]> {
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        *,
        rooms (*)
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async update(id: number, updates: Partial<Booking>): Promise<Booking> {
    const { data, error } = await supabase
      .from("bookings")
      .update(updates)
      .eq("id", id)
      .select(
        `
        *,
        rooms (*)
      `
      )
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase.from("bookings").delete().eq("id", id);

    if (error) throw error;
  }

  static async getByDateRange(
    checkIn: string,
    checkOut: string
  ): Promise<Booking[]> {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .or(`check_in_date.lte.${checkOut},check_out_date.gte.${checkIn}`)
      .neq("booking_status", "cancelled");

    if (error) throw error;
    return data || [];
  }
}

export default BookingModel;
