import supabase from "../config/supabase.js";
import bcrypt from "bcryptjs";

class UsersService {
  static async create({
    email,
    password,
    role = "receptionist",
    is_active = true,
  }) {
    const password_hash = await bcrypt.hash(password, 12);
    const payload = { email, password_hash, role, is_active };
    const { data, error } = await supabase
      .from("users")
      .insert([payload])
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
    const allowed = ["email", "role", "is_active", "last_login", "password"];
    const safe = Object.fromEntries(
      Object.entries(updates || {}).filter(([k]) => allowed.includes(k))
    );
    if (safe.password) {
      safe.password_hash = await bcrypt.hash(safe.password, 12);
      delete safe.password;
    }
    const { data, error } = await supabase
      .from("users")
      .update(safe)
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
