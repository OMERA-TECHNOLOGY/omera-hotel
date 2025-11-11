import supabase from "../config/supabase.js";

class FrontDeskService {
  static async stats() {
    // Derive basic occupancy & arrival/departure metrics
    const [roomsRes, arrivalsRes, departuresRes, activeRes] = await Promise.all(
      [
        supabase.from("rooms").select("status"),
        supabase
          .from("bookings")
          .select("id")
          .eq("check_in", new Date().toISOString().substring(0, 10)),
        supabase
          .from("bookings")
          .select("id")
          .eq("check_out", new Date().toISOString().substring(0, 10)),
        supabase.from("bookings").select("id").eq("status", "active"),
      ]
    );

    const rooms = roomsRes.data || [];
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter((r) => r.status === "occupied").length;
    const vacantRooms = rooms.filter((r) => r.status === "vacant").length;
    const cleaningRooms = rooms.filter((r) => r.status === "cleaning").length;
    const maintenanceRooms = rooms.filter(
      (r) => r.status === "maintenance"
    ).length;

    return {
      totalRooms,
      occupiedRooms,
      vacantRooms,
      cleaningRooms,
      maintenanceRooms,
      todayArrivals: arrivalsRes.data?.length || 0,
      todayDepartures: departuresRes.data?.length || 0,
      activeBookings: activeRes.data?.length || 0,
      occupancyRate: totalRooms
        ? Number(((occupiedRooms / totalRooms) * 100).toFixed(2))
        : 0,
    };
  }

  static async currentGuests() {
    const { data, error } = await supabase
      .from("bookings")
      .select("id, guest_id, room_id, check_in, check_out, status")
      .eq("status", "active")
      .order("check_out", { ascending: true });
    if (error) throw error;
    return data || [];
  }

  static async currentGuestsFromView() {
    const { data, error } = await supabase
      .from("frontdesk_current_guests")
      .select("*")
      .order("check_out", { ascending: true });
    if (error) throw error;
    return data || [];
  }

  static async arrivals(date) {
    const theDate = date || new Date().toISOString().substring(0, 10);
    const { data, error } = await supabase
      .from("bookings")
      .select("id, guest_id, room_id, check_in, check_out, status")
      .eq("check_in", theDate)
      .in("status", ["confirmed", "active"])
      .order("check_in", { ascending: true });
    if (error) throw error;
    return data || [];
  }

  static async departures(date) {
    const theDate = date || new Date().toISOString().substring(0, 10);
    const { data, error } = await supabase
      .from("bookings")
      .select("id, guest_id, room_id, check_out, status")
      .eq("check_out", theDate)
      .in("status", ["active", "checking_out", "confirmed"])
      .order("check_out", { ascending: true });
    if (error) throw error;
    return data || [];
  }

  static async availability(date) {
    // Simple availability: rooms marked vacant.
    const { data, error } = await supabase
      .from("rooms")
      .select("id, room_number, status, floor")
      .eq("status", "vacant")
      .order("room_number", { ascending: true });
    if (error) throw error;
    return data || [];
  }
}

export default FrontDeskService;
