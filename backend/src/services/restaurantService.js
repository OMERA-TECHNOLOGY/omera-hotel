import supabase from "../config/supabase.js";

class RestaurantService {
  // Menu Items
  static async listMenuItems(filters = {}) {
    let q = supabase.from("menu_items").select("*");
    if (filters.category) q = q.eq("category", filters.category);
    if (typeof filters.is_available !== "undefined")
      q = q.eq("is_available", filters.is_available);
    const { data, error } = await q.order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  }
  static async findMenuItem(id) {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return data;
  }
  static async createMenuItem(payload) {
    const { data, error } = await supabase
      .from("menu_items")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  static async updateMenuItem(id, updates) {
    const { data, error } = await supabase
      .from("menu_items")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  static async removeMenuItem(id) {
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) throw error;
    return true;
  }

  // Orders
  static async listOrders(filters = {}) {
    let q = supabase.from("restaurant_orders").select("*");
    if (filters.status) q = q.eq("status", filters.status);
    const { data, error } = await q.order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  }
  static async findOrder(id) {
    const { data, error } = await supabase
      .from("restaurant_orders")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return data;
  }
  static async createOrder(payload) {
    const { data, error } = await supabase
      .from("restaurant_orders")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  static async updateOrder(id, updates) {
    const { data, error } = await supabase
      .from("restaurant_orders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  static async removeOrder(id) {
    const { error } = await supabase
      .from("restaurant_orders")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return true;
  }

  // Order Items
  static async listOrderItems(order_id) {
    const { data, error } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order_id);
    if (error) throw error;
    return data || [];
  }
  static async addOrderItem(payload) {
    const { data, error } = await supabase
      .from("order_items")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  static async updateOrderItem(id, updates) {
    const { data, error } = await supabase
      .from("order_items")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  static async removeOrderItem(id) {
    const { error } = await supabase.from("order_items").delete().eq("id", id);
    if (error) throw error;
    return true;
  }
}
export default RestaurantService;
