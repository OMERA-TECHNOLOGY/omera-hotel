import supabase from "../config/supabase.js";

class RoomTypesService {
  static async list() {
    const { data, error } = await supabase
      .from("room_types")
      .select("*")
      .order("name", { ascending: true });
    if (error) throw error;
    return data || [];
  }

  static async find(id) {
    const { data, error } = await supabase
      .from("room_types")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return data;
  }
}

export default RoomTypesService;
