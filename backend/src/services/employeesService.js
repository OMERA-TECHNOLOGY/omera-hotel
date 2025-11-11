import supabase from "../config/supabase.js";

class EmployeesService {
  static async list(filters = {}) {
    let q = supabase.from("employees").select("*");
    if (filters.department) q = q.eq("department", filters.department);
    const { data, error } = await q.order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  }
  static async find(id) {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return data;
  }
  static async create(payload) {
    const { data, error } = await supabase
      .from("employees")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  static async update(id, updates) {
    const { data, error } = await supabase
      .from("employees")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  static async remove(id) {
    const { error } = await supabase.from("employees").delete().eq("id", id);
    if (error) throw error;
    return true;
  }
}
export default EmployeesService;
