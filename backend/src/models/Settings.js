// src/models/Settings.ts
import supabase from "../config/supabase";
import { Setting } from "../types";

class SettingsModel {
  static async create(
    settingData: Omit<Setting, "id" | "updated_at">
  ): Promise<Setting> {
    const { data, error } = await supabase
      .from("settings")
      .insert([settingData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findByKey(key: string): Promise<Setting | null> {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("key", key)
      .single();

    if (error) return null;
    return data;
  }

  static async getAll(): Promise<Setting[]> {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .order("key", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async update(id: number, updates: Partial<Setting>): Promise<Setting> {
    const { data, error } = await supabase
      .from("settings")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async upsert(
    settingData: Omit<Setting, "id" | "updated_at">
  ): Promise<Setting> {
    // Check if setting exists
    const existing = await this.findByKey(settingData.key);

    if (existing) {
      return this.update(existing.id, { value: settingData.value });
    } else {
      return this.create(settingData);
    }
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase.from("settings").delete().eq("id", id);

    if (error) throw error;
  }
}

export default SettingsModel;
