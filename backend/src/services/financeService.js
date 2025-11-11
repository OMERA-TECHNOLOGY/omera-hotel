import supabase from "../config/supabase.js";

class FinanceService {
  // Invoices
  static async listInvoices(filters = {}) {
    let q = supabase.from("invoices").select("*");
    if (filters.payment_status)
      q = q.eq("payment_status", filters.payment_status);
    const { data, error } = await q.order("invoice_date", { ascending: false });
    if (error) throw error;
    return data || [];
  }
  static async findInvoice(id) {
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return data;
  }
  static async createInvoice(payload) {
    const { data, error } = await supabase
      .from("invoices")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  static async updateInvoice(id, updates) {
    const { data, error } = await supabase
      .from("invoices")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  static async removeInvoice(id) {
    const { error } = await supabase.from("invoices").delete().eq("id", id);
    if (error) throw error;
    return true;
  }

  // Payments
  static async listPayments(filters = {}) {
    let q = supabase.from("payments").select("*");
    if (filters.payment_status)
      q = q.eq("payment_status", filters.payment_status);
    const { data, error } = await q.order("payment_date", { ascending: false });
    if (error) throw error;
    return data || [];
  }
  static async findPayment(id) {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return data;
  }
  static async createPayment(payload) {
    const { data, error } = await supabase
      .from("payments")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  static async updatePayment(id, updates) {
    const { data, error } = await supabase
      .from("payments")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  static async removePayment(id) {
    const { error } = await supabase.from("payments").delete().eq("id", id);
    if (error) throw error;
    return true;
  }

  // Expenses
  static async listExpenses(filters = {}) {
    let q = supabase.from("expenses").select("*");
    if (filters.category) q = q.eq("category", filters.category);
    const { data, error } = await q.order("expense_date", { ascending: false });
    if (error) throw error;
    return data || [];
  }
  static async findExpense(id) {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return data;
  }
  static async createExpense(payload) {
    const { data, error } = await supabase
      .from("expenses")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  static async updateExpense(id, updates) {
    const { data, error } = await supabase
      .from("expenses")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  static async removeExpense(id) {
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) throw error;
    return true;
  }
}
export default FinanceService;
