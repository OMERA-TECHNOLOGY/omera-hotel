import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Calendar as CalendarIcon,
  Users,
  Search,
  BookOpen,
  TrendingUp,
  Star,
  Crown,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiPut, apiDelete, extractError } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Bookings = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLanguage();

  // Fetch bookings from API
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const {
    data: bookingsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await apiGet<{ success: boolean; data: { bookings: any[] } }>(
        "/bookings"
      );
      return res.data.bookings;
    },
  });

  // Fetch rooms for selection
  const { data: roomsData } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await apiGet<{ success: boolean; data: { rooms: any[] } }>(
        "/rooms"
      );
      // backend returns { success: true, data: { rooms } } OR { success: true, data: rooms }
      // normalize
      if (res && (res as any).data && (res as any).data.rooms)
        return (res as any).data.rooms;
      return (res as any).data || [];
    },
  });

  // Fetch guests for selection (receptionists/admins)
  const { data: guestsData } = useQuery({
    queryKey: ["guests"],
    queryFn: async () => {
      const res = await apiGet<{ success: boolean; data: { guests: any[] } }>(
        "/guests"
      );
      if (res && (res as any).data && (res as any).data.guests)
        return (res as any).data.guests;
      return (res as any).data || [];
    },
    // guests may be protected; avoid failing the whole page
    retry: 1,
  });

  // Local form state for create/edit booking
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({
    guestId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    numberOfGuests: 1,
    checkIn: "",
    checkOut: "",
    roomId: "",
    source: "website",
    specialRequests: "",
  });
  const [editingBooking, setEditingBooking] = useState<any | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  function openEditFor(booking: any) {
    setEditingBooking(booking);
    setFormData({
      guestId: booking.raw?.guest_id || booking.raw?.guest?.id || "",
      firstName:
        booking.raw?.guests?.first_name || booking.raw?.guest?.first_name || "",
      lastName:
        booking.raw?.guests?.last_name || booking.raw?.guest?.last_name || "",
      email: booking.raw?.guests?.email || booking.raw?.guest?.email || "",
      phone: booking.raw?.guests?.phone || booking.raw?.guest?.phone || "",
      numberOfGuests: booking.guests || 1,
      checkIn: booking.raw?.check_in || "",
      checkOut: booking.raw?.check_out || "",
      roomId: booking.raw?.room_id || booking.raw?.room?.id || "",
      source: booking.raw?.source || booking.source || "website",
      specialRequests:
        booking.raw?.special_requests || booking.specialRequests || "",
    });
    setIsEditOpen(true);
  }

  function confirmDelete(id: string) {
    setDeleteTargetId(id);
    setDeleteDialogOpen(true);
  }

  // Dashboard metrics for header stats (database-driven)
  const { data: metricsData } = useQuery({
    queryKey: ["dashboard", "metrics"],
    queryFn: async () =>
      apiGet<{ success: boolean; data: any }>("/dashboard/metrics"),
    staleTime: 1000 * 60 * 2,
  });

  // Map bookings from backend shape to UI-friendly shape
  const mappedBookings = (bookingsData || []).map((b: any) => {
    const guest = b.guests || b.guest || null;
    const room = b.rooms || b.room || null;
    const guestName = guest
      ? `${guest.first_name || ""} ${guest.last_name || ""}`.trim()
      : "Guest";
    const roomLabel = room
      ? `Room ${room.room_number || room.room_number}`
      : b.room_id;
    const nights = b.total_nights
      ? Number(b.total_nights)
      : b.check_in && b.check_out
      ? Math.max(
          1,
          Math.round(
            (new Date(b.check_out).getTime() - new Date(b.check_in).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 1;
    const statusMap: Record<string, string> = {
      confirmed: "Confirmed",
      active: "Active",
      checking_out: "Checking Out",
      completed: "Completed",
      cancelled: "Cancelled",
    };
    const status = statusMap[b.status] || b.status || "Unknown";
    const priority = guest?.is_vip ? "vip" : "standard";
    return {
      id: b.id,
      guestName,
      priority,
      status,
      room: roomLabel,
      guests: b.number_of_guests ?? b.guests ?? 1,
      nights,
      checkIn: b.check_in ? new Date(b.check_in).toLocaleDateString() : "-",
      checkOut: b.check_out ? new Date(b.check_out).toLocaleDateString() : "-",
      source: b.source || "-",
      totalPrice: Number(b.total_price_birr ?? b.total_price ?? 0),
      specialRequests: b.special_requests || b.specialRequests || "",
      raw: b,
    };
  });

  // Simple search filtering
  const filteredBookings = mappedBookings.filter((bk) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      String(bk.guestName).toLowerCase().includes(q) ||
      String(bk.room).toLowerCase().includes(q) ||
      String(bk.id).toLowerCase().includes(q)
    );
  });

  // Mutations for create/edit/delete can be added here
  // Create booking mutation (handles creating guest if necessary)
  const createBookingMutation = useMutation(
    async (payload: any) => {
      return apiPost("/bookings", payload);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["bookings"]);
        setIsCreateOpen(false);
        toast({
          title: "Booking created",
          description: "Reservation created successfully",
          duration: 4000,
        });
      },
      onError: (err) => {
        const message = extractError(err);
        setFormError(message);
        toast({
          title: "Error creating booking",
          description: message,
          duration: 6000,
        });
      },
    }
  );

  const updateBookingMutation = useMutation(
    async ({ id, payload }: any) => {
      return apiPut(`/bookings/${id}`, payload);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["bookings"]);
        setIsEditOpen(false);
        setEditingBooking(null);
        toast({
          title: "Booking updated",
          description: "Reservation updated successfully",
          duration: 3000,
        });
      },
      onError: (err) => {
        const message = extractError(err);
        toast({
          title: "Error updating booking",
          description: message,
          duration: 6000,
        });
      },
    }
  );

  const deleteBookingMutation = useMutation(
    async (id: string) => apiDelete(`/bookings/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["bookings"]);
        toast({
          title: "Booking removed",
          description: "Reservation cancelled",
          duration: 3000,
        });
      },
      onError: (err) => {
        const message = extractError(err);
        toast({
          title: "Error deleting booking",
          description: message,
          duration: 6000,
        });
      },
    }
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusGradient = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "from-emerald-500 to-green-500";
      case "Pending":
        return "from-amber-500 to-yellow-500";
      case "Cancelled":
        return "from-red-500 to-orange-500";
      default:
        return "from-slate-500 to-slate-600";
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Unique Header Structure - Different from previous designs */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-amber-900 p-8 text-white border border-amber-500/20">
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-amber-500/20 rounded-2xl border border-amber-400/30">
                  <BookOpen className="h-8 w-8 text-amber-400" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-200 to-white bg-clip-text text-transparent">
                    Booking Management
                  </h1>
                  <p className="text-amber-100 text-lg mt-2">
                    Orchestrate exceptional guest experiences with precision
                  </p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <TrendingUp className="h-6 w-6 text-emerald-400" />
                  <div>
                    <p className="text-2xl font-bold">89%</p>
                    <p className="text-xs text-amber-200">Occupancy Rate</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <Star className="h-6 w-6 text-amber-400" />
                  <div>
                    <p className="text-2xl font-bold">4.8</p>
                    <p className="text-xs text-amber-200">Guest Rating</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <Users className="h-6 w-6 text-blue-400" />
                  <div>
                    <p className="text-2xl font-bold">24</p>
                    <p className="text-xs text-amber-200">Active Stays</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <Button
                onClick={() => {
                  setIsCreateOpen(true);
                  setFormError(null);
                }}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-0 shadow-2xl rounded-2xl px-6 py-3"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Reservation
              </Button>

              {/* Controlled create dialog */}
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-w-4xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-0 shadow-2xl rounded-3xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-2xl">
                      <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl">
                        <Plus className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div>New Reservation</div>
                        <div className="text-sm font-normal text-slate-500">
                          Create a premium booking experience
                        </div>
                      </div>
                    </DialogTitle>
                  </DialogHeader>

                  <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label
                          htmlFor="firstName"
                          className="text-sm font-semibold"
                        >
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              firstName: e.target.value,
                            })
                          }
                          placeholder="First name"
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="lastName"
                          className="text-sm font-semibold"
                        >
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              lastName: e.target.value,
                            })
                          }
                          placeholder="Last name"
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="guestPhone"
                          className="text-sm font-semibold"
                        >
                          Phone Number
                        </Label>
                        <Input
                          id="guestPhone"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="+251 xxx xxx xxx"
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label
                          htmlFor="guestEmail"
                          className="text-sm font-semibold"
                        >
                          Email Address
                        </Label>
                        <Input
                          id="guestEmail"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="guest@example.com"
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="numberOfGuests"
                          className="text-sm font-semibold"
                        >
                          Number of Guests
                        </Label>
                        <Input
                          id="numberOfGuests"
                          type="number"
                          min="1"
                          value={formData.numberOfGuests}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              numberOfGuests: Number(e.target.value),
                            })
                          }
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label
                          htmlFor="bookingCheckIn"
                          className="text-sm font-semibold"
                        >
                          Check-in Date
                        </Label>
                        <Input
                          id="bookingCheckIn"
                          type="date"
                          value={formData.checkIn}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              checkIn: e.target.value,
                            })
                          }
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="bookingCheckOut"
                          className="text-sm font-semibold"
                        >
                          Check-out Date
                        </Label>
                        <Input
                          id="bookingCheckOut"
                          type="date"
                          value={formData.checkOut}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              checkOut: e.target.value,
                            })
                          }
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label
                          htmlFor="bookingRoomType"
                          className="text-sm font-semibold"
                        >
                          Room
                        </Label>
                        <Select>
                          <SelectTrigger
                            id="bookingRoomType"
                            className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl"
                          >
                            <SelectValue placeholder="Select room" />
                          </SelectTrigger>
                          <SelectContent>
                            {(roomsData || []).map((r: any) => (
                              <SelectItem
                                key={r.id}
                                value={r.id}
                                onClick={() =>
                                  setFormData({ ...formData, roomId: r.id })
                                }
                              >
                                {`Room ${r.room_number || r.id} - ${
                                  r.price_per_night
                                    ? `${Number(
                                        r.price_per_night
                                      ).toLocaleString()} ETB`
                                    : ""
                                }`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="bookingSource"
                          className="text-sm font-semibold"
                        >
                          Booking Source
                        </Label>
                        <Select>
                          <SelectTrigger
                            id="bookingSource"
                            className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl"
                          >
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              value="website"
                              onClick={() =>
                                setFormData({ ...formData, source: "website" })
                              }
                            >
                              Website
                            </SelectItem>
                            <SelectItem
                              value="phone"
                              onClick={() =>
                                setFormData({ ...formData, source: "phone" })
                              }
                            >
                              Phone
                            </SelectItem>
                            <SelectItem
                              value="walk-in"
                              onClick={() =>
                                setFormData({ ...formData, source: "walk-in" })
                              }
                            >
                              Walk-in
                            </SelectItem>
                            <SelectItem
                              value="agent"
                              onClick={() =>
                                setFormData({ ...formData, source: "agent" })
                              }
                            >
                              Travel Agent
                            </SelectItem>
                            <SelectItem
                              value="other"
                              onClick={() =>
                                setFormData({ ...formData, source: "other" })
                              }
                            >
                              Other
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="specialRequests"
                        className="text-sm font-semibold"
                      >
                        Special Requests & Notes
                      </Label>
                      <Input
                        id="specialRequests"
                        value={formData.specialRequests}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            specialRequests: e.target.value,
                          })
                        }
                        placeholder="Any special requirements, celebrations, or additional notes"
                        className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateOpen(false)}
                      className="border-slate-300 dark:border-slate-600 rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={createBookingMutation.isLoading}
                      onClick={async () => {
                        setFormError(null);
                        // basic validation
                        if (!formData.roomId)
                          return setFormError("Please select a room");
                        if (!formData.checkIn || !formData.checkOut)
                          return setFormError(
                            "Please select check-in and check-out dates"
                          );
                        setFormLoading(true);
                        try {
                          let guestId = formData.guestId;
                          // If no guestId provided, create guest
                          if (!guestId) {
                            const guestPayload: any = {
                              first_name: formData.firstName || undefined,
                              last_name: formData.lastName || undefined,
                              email: formData.email || undefined,
                              phone: formData.phone || undefined,
                            };
                            const g = await apiPost("/guests", guestPayload);
                            // g may be { success, data: { guest } }
                            guestId =
                              g?.data?.guest?.id ||
                              g?.guest?.id ||
                              g?.data?.id ||
                              g?.id;
                          }

                          const payload = {
                            guest_id: guestId,
                            room_id: formData.roomId,
                            check_in: formData.checkIn,
                            check_out: formData.checkOut,
                            number_of_guests: formData.numberOfGuests,
                            source: formData.source,
                            special_requests: formData.specialRequests,
                            total_price_birr: 0,
                          };

                          await createBookingMutation.mutateAsync(payload);
                        } catch (err) {
                          const message = extractError(err);
                          setFormError(message);
                          toast({
                            title: "Error",
                            description: message,
                            duration: 6000,
                          });
                        } finally {
                          setFormLoading(false);
                        }
                      }}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl"
                    >
                      {createBookingMutation.isLoading
                        ? "Creating..."
                        : "Create Reservation"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Unique Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-orange-500/5 to-amber-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Enhanced Search & Filters */}
      <div className="flex items-center gap-4 p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search reservations by guest name, room number, or booking reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-3 text-lg border-0 bg-white dark:bg-slate-700 shadow-lg rounded-2xl"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[200px] bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-xl">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reservations</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Enhanced Tabs */}
      <Tabs defaultValue="list" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <TabsTrigger
            value="list"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700"
          >
            Reservation List
          </TabsTrigger>
          <TabsTrigger
            value="calendar"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700"
          >
            Calendar Overview
          </TabsTrigger>
        </TabsList>

        {/* Enhanced Booking List */}
        <TabsContent value="list" className="space-y-4">
          <div className="grid gap-6">
            {filteredBookings.map((booking) => (
              <Card
                key={booking.id}
                className="relative overflow-hidden bg-white dark:bg-slate-800 shadow-2xl hover:shadow-3xl transition-all duration-500 group rounded-3xl border border-slate-200 dark:border-slate-700"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div
                          className={`p-3 rounded-2xl ${
                            booking.priority === "vip"
                              ? "bg-gradient-to-r from-amber-500 to-orange-500"
                              : booking.priority === "premium"
                              ? "bg-gradient-to-r from-emerald-500 to-green-500"
                              : "bg-gradient-to-r from-slate-500 to-slate-600"
                          }`}
                        >
                          <div className="text-white font-bold text-lg">
                            {booking.guestName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl font-bold text-slate-800 dark:text-white">
                              {booking.guestName}
                            </CardTitle>
                            {booking.priority === "vip" && (
                              <Crown className="h-5 w-5 text-amber-500" />
                            )}
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                          <CardDescription className="text-slate-600 dark:text-slate-400">
                            {booking.room} • {booking.guests}{" "}
                            {booking.guests === 1 ? "Guest" : "Guests"} •{" "}
                            {booking.nights} nights
                          </CardDescription>
                        </div>
                      </div>

                      {/* Booking Details Grid */}
                      <div className="grid grid-cols-4 gap-6 text-sm">
                        <div>
                          <p className="text-slate-500 dark:text-slate-400">
                            Check-in
                          </p>
                          <p className="font-semibold text-slate-800 dark:text-white">
                            {booking.checkIn}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-slate-400">
                            Check-out
                          </p>
                          <p className="font-semibold text-slate-800 dark:text-white">
                            {booking.checkOut}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-slate-400">
                            Source
                          </p>
                          <p className="font-semibold text-slate-800 dark:text-white">
                            {booking.source}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-slate-400">
                            Total Amount
                          </p>
                          <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-lg">
                            {booking.totalPrice.toLocaleString()} ETB
                          </p>
                        </div>
                      </div>

                      {/* Special Requests */}
                      {booking.specialRequests && (
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                            Special Requests:
                          </p>
                          <p className="text-sm text-slate-700 dark:text-slate-300 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl">
                            {booking.specialRequests}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons - Two buttons on the right side */}
                    <div className="flex flex-col gap-3 ml-6">
                      <Button
                        variant="outline"
                        className="border-amber-300 dark:border-amber-600 text-amber-600 dark:text-amber-400 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all cursor-pointer"
                        onClick={() => openEditFor(booking)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        className="border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer"
                        onClick={() => confirmDelete(booking.id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Enhanced Calendar View */}
        <TabsContent value="calendar" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 bg-white dark:bg-slate-800 shadow-2xl rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white">
                  <div className="p-3 bg-amber-500 rounded-2xl">
                    <CalendarIcon className="h-6 w-6 text-white" />
                  </div>
                  <span>Reservation Calendar</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 shadow-lg"
                />
              </CardContent>
            </Card>

            <Card className="border-0 bg-white dark:bg-slate-800 shadow-2xl rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white">
                  <div className="p-3 bg-emerald-500 rounded-2xl">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <span>Arrivals on {selectedDate?.toLocaleDateString()}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredBookings.slice(0, 3).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all"
                    >
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white">
                          {booking.guestName}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {booking.room}
                        </p>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Bookings;
