import supabase from "../config/supabase.js";

class GuestsService {
  static async list(filters = {}) {
    let q = supabase.from("guests").select("*");
    if (filters.email) q = q.eq("email", filters.email);
    const { data, error } = await q.order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  }

  static async find(id) {
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return data;
  }

  static async create(payload) {
    const { data, error } = await supabase
      .from("guests")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async update(id, updates) {
    const { data, error } = await supabase
      .from("guests")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async remove(id) {
    const { error } = await supabase.from("guests").delete().eq("id", id);
    if (error) throw error;
    return true;
  }
}

export default GuestsService;
