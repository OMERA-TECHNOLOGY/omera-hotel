import supabase from "../config/supabase.js";
import RoomsService from "./roomsService.js";

class BookingsService {
  static async list(filters = {}) {
    let q = supabase.from("bookings").select("*");
    if (filters.status) q = q.eq("status", filters.status);
    if (filters.guest_id) q = q.eq("guest_id", filters.guest_id);
    if (filters.room_id) q = q.eq("room_id", filters.room_id);
    const { data, error } = await q.order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  }
  static async find(id) {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return data;
  }
  static async create(payload) {
    const { data, error } = await supabase
      .from("bookings")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    // Update room status if booking confirmed
    if (
      data?.room_id &&
      (data?.status === "confirmed" || data?.status === "active")
    ) {
      await RoomsService.update(data.room_id, { status: "occupied" }).catch(
        () => {}
      );
    }
    return data;
  }
  static async update(id, updates) {
    const { data, error } = await supabase
      .from("bookings")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  static async remove(id) {
    const existing = await this.find(id);
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) throw error;
    if (existing?.room_id) {
      await RoomsService.update(existing.room_id, { status: "vacant" }).catch(
        () => {}
      );
    }
    return true;
  }
}
export default BookingsService;
