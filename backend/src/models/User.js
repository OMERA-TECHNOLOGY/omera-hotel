// src/models/User.ts
import supabase from "../config/supabase";
import bcrypt from "bcryptjs";
import { User } from "../types";

class UserModel {
  static async create(
    userData: Omit<User, "id" | "created_at" | "updated_at">
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password_hash, 12);

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          ...userData,
          password_hash: hashedPassword,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) return null;
    return data;
  }

  static async findById(id: number): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return data;
  }

  static async update(id: number, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

export default UserModel;
