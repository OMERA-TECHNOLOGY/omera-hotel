import supabase from "../config/supabase.js";

class ActivityController {
  static async getAll(req, res) {
    try {
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*, employees(first_name, last_name, role)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

export default ActivityController;
