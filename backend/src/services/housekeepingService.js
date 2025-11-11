import supabase from "../config/supabase.js";

class HousekeepingService {
  // Room maintenance tasks
  static async listMaintenance(filters = {}) {
    let q = supabase.from("room_maintenance").select("*");
    if (filters.status) q = q.eq("status", filters.status);
    if (filters.type) q = q.eq("type", filters.type);
    const { data, error } = await q.order("scheduled_date", {
      ascending: true,
    });
    if (error) throw error;
    return data || [];
  }
  static async findMaintenance(id) {
    const { data, error } = await supabase
      .from("room_maintenance")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return data;
  }
  static async createMaintenance(payload) {
    const { data, error } = await supabase
      .from("room_maintenance")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  static async updateMaintenance(id, updates) {
    const { data, error } = await supabase
      .from("room_maintenance")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  static async removeMaintenance(id) {
    const { error } = await supabase
      .from("room_maintenance")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return true;
  }

  // Special requests
  static async listRequests(filters = {}) {
    let q = supabase.from("special_requests").select("*");
    if (filters.status) q = q.eq("status", filters.status);
    if (filters.priority) q = q.eq("priority", filters.priority);
    const { data, error } = await q.order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  }
  static async findRequest(id) {
    const { data, error } = await supabase
      .from("special_requests")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return data;
  }
  static async createRequest(payload) {
    const { data, error } = await supabase
      .from("special_requests")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  static async updateRequest(id, updates) {
    const { data, error } = await supabase
      .from("special_requests")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  static async removeRequest(id) {
    const { error } = await supabase
      .from("special_requests")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return true;
  }
}
export default HousekeepingService;
