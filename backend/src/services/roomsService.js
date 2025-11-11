import supabase from "../config/supabase.js";

class RoomsService {
  static async list(filters = {}) {
    let query = supabase.from("rooms").select("*");
    if (filters.status) query = query.eq("status", filters.status);
    if (filters.room_type_id)
      query = query.eq("room_type_id", filters.room_type_id);
    const { data, error } = await query.order("room_number", {
      ascending: true,
    });
    if (error) throw error;
    return data || [];
  }
  static async find(id) {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return data;
  }
  static async create(payload) {
    const { data, error } = await supabase
      .from("rooms")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  static async update(id, updates) {
    const { data, error } = await supabase
      .from("rooms")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  static async remove(id) {
    const { error } = await supabase.from("rooms").delete().eq("id", id);
    if (error) throw error;
    return true;
  }
}
export default RoomsService;
