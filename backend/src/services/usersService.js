import supabase from "../config/supabase.js";
import bcrypt from "bcryptjs";

class UsersService {
  static async create({
    full_name,
    email,
    password,
    role = "staff",
    status = "active",
  }) {
    const password_hash = await bcrypt.hash(password, 12);
    const { data, error } = await supabase
      .from("users")
      .insert([{ full_name, email, password_hash, role, status }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  static async findByEmail(email) {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();
    return data || null;
  }
  static async findById(id) {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();
    return data || null;
  }
  static async update(id, updates) {
    if (updates.password) {
      updates.password_hash = await bcrypt.hash(updates.password, 12);
      delete updates.password;
    }
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  static async verifyPassword(plain, hash) {
    return bcrypt.compare(plain, hash);
  }
}
export default UsersService;
