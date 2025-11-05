// src/models/Finance.ts
const supabase = require("../config/supabase");
import { FinanceRecord } from "../types";

class FinanceModel {
  static async create(
    recordData: Omit<FinanceRecord, "id" | "created_at">
  ): Promise<FinanceRecord> {
    const { data, error } = await supabase
      .from("finance_records")
      .insert([recordData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findById(id: number): Promise<FinanceRecord | null> {
    const { data, error } = await supabase
      .from("finance_records")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return data;
  }

  static async getAll(): Promise<FinanceRecord[]> {
    const { data, error } = await supabase
      .from("finance_records")
      .select("*")
      .order("record_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async update(
    id: number,
    updates: Partial<FinanceRecord>
  ): Promise<FinanceRecord> {
    const { data, error } = await supabase
      .from("finance_records")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from("finance_records")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  static async getByCategory(category: string): Promise<FinanceRecord[]> {
    const { data, error } = await supabase
      .from("finance_records")
      .select("*")
      .eq("category", category)
      .order("record_date", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getFinancialSummary(
    startDate: string,
    endDate: string
  ): Promise<{
    totalIncome: number;
    totalExpenses: number;
    netProfit: number;
  }> {
    const { data, error } = await supabase
      .from("finance_records")
      .select("category, amount")
      .gte("record_date", startDate)
      .lte("record_date", endDate);

    if (error) throw error;

    const summary = data?.reduce(
      (acc: any, record: any) => {
        if (record.category === "income") {
          acc.totalIncome += record.amount;
        } else {
          acc.totalExpenses += record.amount;
        }
        return acc;
      },
      { totalIncome: 0, totalExpenses: 0 }
    );

    return {
      totalIncome: summary?.totalIncome || 0,
      totalExpenses: summary?.totalExpenses || 0,
      netProfit: (summary?.totalIncome || 0) - (summary?.totalExpenses || 0),
    };
  }
}

module.exports = FinanceModel;