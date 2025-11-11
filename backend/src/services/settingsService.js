import supabase from "../config/supabase.js";

class SettingsService {
  static async getSettings() {
    const { data, error } = await supabase
      .from("hotel_settings")
      .select("*")
      .limit(1)
      .single();
    if (error && error.code !== "PGRST116") throw error; // PGRST116 = No rows found
    return data || null;
  }
  static async updateSettings(updates) {
    // If no row exists, insert; else update existing row
    const existing = await this.getSettings();
    if (!existing) {
      const { data, error } = await supabase
        .from("hotel_settings")
        .insert([updates])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const { data, error } = await supabase
      .from("hotel_settings")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
export default SettingsService;
