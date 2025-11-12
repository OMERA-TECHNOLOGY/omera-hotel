import supabase from "../config/supabase.js";

class RoomsService {
  // list supports basic filters and pagination; returns { rows, total }
  static async list({
    limit = 100,
    offset = 0,
    status,
    room_type_id,
    search,
  } = {}) {
    // Build base select with room_type relationship if present in supabase
    let query = supabase
      .from("rooms")
      .select("*, room_types(*)", { count: "exact" })
      .order("room_number", { ascending: true });

    if (typeof status !== "undefined" && status !== "all")
      query = query.eq("status", status);
    if (room_type_id) query = query.eq("room_type_id", room_type_id);
    if (search) query = query.ilike("room_number", `%${search}%`);

    // apply range for pagination
    const from = Number(offset) || 0;
    const to = from + (Number(limit) || 100) - 1;
    const { data, error, count } = await query.range(from, to);
    if (error) throw error;
    return { rows: data || [], total: count || 0 };
  }

  static async find(id) {
    const { data, error } = await supabase
      .from("rooms")
      .select("*, room_types(*)")
      .eq("id", id)
      .single();
    if (error) return null;
    return data;
  }

  static async create(payload) {
    const { data, error } = await supabase
      .from("rooms")
      .insert([payload])
      .select("*, room_types(*)")
      .single();
    if (error) throw error;
    return data;
  }

  static async update(id, updates) {
    const { data, error } = await supabase
      .from("rooms")
      .update(updates)
      .eq("id", id)
      .select("*, room_types(*)")
      .single();
    if (error) throw error;
    return data;
  }

  static async remove(id) {
    // return deleted row to caller if needed
    const { data, error } = await supabase
      .from("rooms")
      .delete()
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data || true;
  }
}

export default RoomsService;
