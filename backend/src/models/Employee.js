// src/models/Employee.ts
import supabase from "../config/supabase";
import { Employee } from "../types";

class EmployeeModel {
  static async create(
    employeeData: Omit<Employee, "id" | "created_at">
  ): Promise<Employee> {
    const { data, error } = await supabase
      .from("employees")
      .insert([employeeData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findById(id: number): Promise<Employee | null> {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return data;
  }

  static async getAll(): Promise<Employee[]> {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("hire_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async update(
    id: number,
    updates: Partial<Employee>
  ): Promise<Employee> {
    const { data, error } = await supabase
      .from("employees")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase.from("employees").delete().eq("id", id);

    if (error) throw error;
  }

  static async getByDepartment(department: string): Promise<Employee[]> {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("department", department)
      .order("hire_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }
}

export default EmployeeModel;
