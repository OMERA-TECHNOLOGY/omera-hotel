// src/models/Housekeeping.ts
const supabase = require("../config/supabase");
import { HousekeepingTask } from "../types";

class HousekeepingModel {
  static async create(
    taskData: Omit<HousekeepingTask, "id" | "created_at">
  ): Promise<HousekeepingTask> {
    const { data, error } = await supabase
      .from("housekeeping_tasks")
      .insert([taskData])
      .select(
        `
        *,
        rooms (*),
        users!assigned_to(full_name, email)
      `
      )
      .single();

    if (error) throw error;
    return data;
  }

  static async findById(id: number): Promise<HousekeepingTask | null> {
    const { data, error } = await supabase
      .from("housekeeping_tasks")
      .select(
        `
        *,
        rooms (*),
        users!assigned_to(full_name, email)
      `
      )
      .eq("id", id)
      .single();

    if (error) return null;
    return data;
  }

  static async getAll(): Promise<HousekeepingTask[]> {
    const { data, error } = await supabase
      .from("housekeeping_tasks")
      .select(
        `
        *,
        rooms (*),
        users!assigned_to(full_name, email)
      `
      )
      .order("date_assigned", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async update(
    id: number,
    updates: Partial<HousekeepingTask>
  ): Promise<HousekeepingTask> {
    const { data, error } = await supabase
      .from("housekeeping_tasks")
      .update(updates)
      .eq("id", id)
      .select(
        `
        *,
        rooms (*),
        users!assigned_to(full_name, email)
      `
      )
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from("housekeeping_tasks")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  static async getByStatus(status: string): Promise<HousekeepingTask[]> {
    const { data, error } = await supabase
      .from("housekeeping_tasks")
      .select(
        `
        *,
        rooms (*),
        users!assigned_to(full_name, email)
      `
      )
      .eq("status", status)
      .order("date_assigned", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async completeTask(id: number): Promise<HousekeepingTask> {
    const { data, error } = await supabase
      .from("housekeeping_tasks")
      .update({
        status: "completed",
        date_completed: new Date().toISOString(),
      })
      .eq("id", id)
      .select(
        `
        *,
        rooms (*),
        users!assigned_to(full_name, email)
      `
      )
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = HousekeepingModel;