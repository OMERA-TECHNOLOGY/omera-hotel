// src/models/Payment.ts
const supabase = require("../config/supabase");

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

class PaymentModel {
  static async create(
    paymentData: Omit<Payment, "id" | "created_at">
  ): Promise<Payment> {
    const { data, error } = await supabase
      .from("payments")
      .insert([paymentData])
      .select(
        `
        *,
        bookings(*)
      `
      )
      .single();

    if (error) throw error;
    return data;
  }

  static async findById(id: number): Promise<Payment | null> {
    const { data, error } = await supabase
      .from("payments")
      .select(
        `
        *,
        bookings(*)
      `
      )
      .eq("id", id)
      .single();

    if (error) return null;
    return data;
  }

  static async getAll(): Promise<Payment[]> {
    const { data, error } = await supabase
      .from("payments")
      .select(
        `
        *,
        bookings(*)
      `
      )
      .order("payment_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async update(id: number, updates: Partial<Payment>): Promise<Payment> {
    const { data, error } = await supabase
      .from("payments")
      .update(updates)
      .eq("id", id)
      .select(
        `
        *,
        bookings(*)
      `
      )
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase.from("payments").delete().eq("id", id);

    if (error) throw error;
  }

  static async getByBooking(bookingId: number): Promise<Payment[]> {
    const { data, error } = await supabase
      .from("payments")
      .select(
        `
        *,
        bookings(*)
      `
      )
      .eq("booking_id", bookingId)
      .order("payment_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getTotalRevenue(
    startDate: string,
    endDate: string
  ): Promise<number> {
    const { data, error } = await supabase
      .from("payments")
      .select("amount")
      .gte("payment_date", startDate)
      .lte("payment_date", endDate)
      .eq("status", "completed");

    if (error) throw error;

    const total =
      data?.reduce((sum: any, payment: any) => sum + payment.amount, 0) || 0;
    return total;
  }
}

module.exports = PaymentModel;
