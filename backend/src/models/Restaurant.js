// src/models/Restaurant.ts
const supabase = require("../config/supabase");
import { RestaurantOrder } from "../types";

class RestaurantModel {
  static async create(
    orderData: Omit<RestaurantOrder, "id" | "order_time">
  ): Promise<RestaurantOrder> {
    const { data, error } = await supabase
      .from("restaurant_orders")
      .insert([orderData])
      .select(
        `
        *,
        bookings(customer_name, customer_email)
      `
      )
      .single();

    if (error) throw error;
    return data;
  }

  static async findById(id: number): Promise<RestaurantOrder | null> {
    const { data, error } = await supabase
      .from("restaurant_orders")
      .select(
        `
        *,
        bookings(customer_name, customer_email)
      `
      )
      .eq("id", id)
      .single();

    if (error) return null;
    return data;
  }

  static async getAll(): Promise<RestaurantOrder[]> {
    const { data, error } = await supabase
      .from("restaurant_orders")
      .select(
        `
        *,
        bookings(customer_name, customer_email)
      `
      )
      .order("order_time", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async update(
    id: number,
    updates: Partial<RestaurantOrder>
  ): Promise<RestaurantOrder> {
    const { data, error } = await supabase
      .from("restaurant_orders")
      .update(updates)
      .eq("id", id)
      .select(
        `
        *,
        bookings(customer_name, customer_email)
      `
      )
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from("restaurant_orders")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  static async getByBooking(bookingId: number): Promise<RestaurantOrder[]> {
    const { data, error } = await supabase
      .from("restaurant_orders")
      .select(
        `
        *,
        bookings(customer_name, customer_email)
      `
      )
      .eq("booking_id", bookingId)
      .order("order_time", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getRevenueByDate(
    startDate: string,
    endDate: string
  ): Promise<number> {
    const { data, error } = await supabase
      .from("restaurant_orders")
      .select("price, quantity")
      .gte("order_time", startDate)
      .lte("order_time", endDate)
      .neq("status", "cancelled");

    if (error) throw error;

    const total =
      data?.reduce(
        (sum: any, order: any) => sum + order.price * order.quantity,
        0
      ) || 0;
    return total;
  }
}

module.exports = RestaurantModel;
