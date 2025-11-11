// src/models/Room.ts
const supabase = require("../config/supabase");
import { Room } from "../types";

class RoomModel {
  static async create(
    roomData: Omit<Room, "id" | "created_at">
  ): Promise<Room> {
    const { data, error } = await supabase
      .from("rooms")
      .insert([roomData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findById(id: number): Promise<Room | null> {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return data;
  }

  static async getAll(): Promise<Room[]> {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .order("room_number", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async update(id: number, updates: Partial<Room>): Promise<Room> {
    const { data, error } = await supabase
      .from("rooms")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id: number): Promise<void> {
    const { error } = await supabase.from("rooms").delete().eq("id", id);

    if (error) throw error;
  }

  static async getAvailableRooms(
    checkIn: string,
    checkOut: string
  ): Promise<Room[]> {
    const { data: bookedRooms, error: bookedError } = await supabase
      .from("bookings")
      .select("room_id")
      .or(`check_in_date.lte.${checkOut},check_out_date.gte.${checkIn}`)
      .neq("booking_status", "cancelled");

    if (bookedError) throw bookedError;

    const bookedRoomIds =
      bookedRooms?.map((booking: any) => booking.room_id) || [];

    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .not("id", "in", `(${bookedRoomIds.join(",")})`)
      .eq("status", "available");

    if (error) throw error;
    return data || [];
  }
}

module.exports = RoomModel;
