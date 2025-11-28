import { useState } from "react";
import { BubblingPlaceholder } from "@/components/ui/bubbling-placeholder";
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
  MoreVertical,
  Phone,
  Mail,
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
import type {
  Booking,
  CreateBookingInput,
  UpdateBookingInput,
  Guest,
} from "@/types/bookings";
import type { Room } from "@/types/rooms";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Bookings = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLanguage();

  // Fetch bookings from API - KEEP ALL ORIGINAL FETCHING LOGIC
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const {
    data: bookingsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await apiGet<{
        success: true;
        data: { bookings: Booking[] };
      }>("/bookings");
      return res?.data?.bookings || [];
    },
  });

  // Fetch rooms for selection
  const { data: roomsData } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await apiGet<{ success: true; data: { rooms: Room[] } }>(
        "/rooms"
      );
      return res?.data?.rooms || [];
    },
  });

  // Fetch guests for selection (receptionists/admins)
  const { data: guestsData } = useQuery({
    queryKey: ["guests"],
    queryFn: async () => {
      const res = await apiGet<{ success: true; data: { guests: Guest[] } }>(
        "/guests"
      );
      return res?.data?.guests || [];
    },
    retry: 1,
  });

  // Local form state for create/edit booking - KEEP ALL ORIGINAL STATE
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  type BookingForm = {
    guestId?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    email?: string | undefined;
    phone?: string | undefined;
    numberOfGuests: number;
    checkIn: string;
    checkOut: string;
    roomId?: string | undefined;
    source?: string | undefined;
    specialRequests?: string | undefined;
  };

  const [formData, setFormData] = useState<BookingForm>({
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
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  function openEditFor(booking: Booking | { raw?: Booking }) {
    const b = (booking as { raw?: Booking }).raw || (booking as Booking);
    setEditingBooking(b);
    setFormData({
      guestId: b.guest_id || undefined,
      firstName: b.guests?.first_name || undefined,
      lastName: b.guests?.last_name || undefined,
      email: b.guests?.email || undefined,
      phone: b.guests?.phone || undefined,
      numberOfGuests: b.number_of_guests ?? 1,
      checkIn: b.check_in || "",
      checkOut: b.check_out || "",
      roomId: b.room_id || undefined,
      source: b.source || "website",
      specialRequests: b.special_requests || undefined,
    });
    setIsEditOpen(true);
  }

  function openViewFor(booking: Booking) {
    setViewingBooking(booking);
    setIsViewOpen(true);
  }

  function confirmDelete(id: string) {
    setDeleteTargetId(id);
    setDeleteDialogOpen(true);
  }

  // Dashboard metrics for header stats (database-driven)
  const { data: metricsData } = useQuery({
    queryKey: ["dashboard", "metrics"],
    queryFn: async () =>
      apiGet<{ success: boolean; data: Record<string, unknown> }>(
        "/dashboard/metrics"
      ),
    staleTime: 1000 * 60 * 2,
  });

  // Map bookings from backend shape to UI-friendly shape - KEEP ALL ORIGINAL MAPPING
  const mappedBookings = (bookingsData || []).map((b: Booking) => {
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
      guests: b.number_of_guests ?? 1,
      nights,
      checkIn: b.check_in ? new Date(b.check_in).toLocaleDateString() : "-",
      checkOut: b.check_out ? new Date(b.check_out).toLocaleDateString() : "-",
      source: b.source || "-",
      totalPrice: Number(b.total_price_birr ?? b.total_price ?? 0),
      specialRequests: b.special_requests || b.specialRequests || "",
      raw: b,
      typed: b as Booking,
    };
  });

  // Simple search filtering - KEEP ALL ORIGINAL FILTERING
  const filteredBookings = mappedBookings.filter((bk) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      String(bk.guestName).toLowerCase().includes(q) ||
      String(bk.room).toLowerCase().includes(q) ||
      String(bk.id).toLowerCase().includes(q)
    );
  });

  // Mutations for create/edit/delete - KEEP ALL ORIGINAL MUTATIONS
  const createBookingMutation = useMutation({
    mutationFn: async (payload: CreateBookingInput) =>
      apiPost<
        { success: true; data: { booking: Booking } },
        CreateBookingInput
      >("/bookings", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
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
  });

  const updateBookingMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateBookingInput;
    }) =>
      apiPut<{ success: true; data: { booking: Booking } }, UpdateBookingInput>(
        `/bookings/${id}`,
        payload
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
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
  });

  const deleteBookingMutation = useMutation({
    mutationFn: async (id: string) =>
      apiDelete<{ success: boolean }>(`/bookings/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
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
  });

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

  if (isLoading)
    return (
      <div className="p-4 sm:p-6">
        <BubblingPlaceholder variant="page" />
      </div>
    );

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Mobile-Optimized Header - SAME CONTENT, BETTER LAYOUT */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-amber-900 p-4 sm:p-6 md:p-8 text-white border border-amber-500/20">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div className="p-2 sm:p-3 bg-amber-500/20 rounded-xl sm:rounded-2xl border border-amber-400/30 flex-shrink-0">
                  <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-200 to-white bg-clip-text text-transparent">
                    {t.bookingsTitle}
                  </h1>
                  <p className="text-amber-100 text-sm sm:text-base md:text-lg mt-1 sm:mt-2">
                    {t.bookingsSubtitle}
                  </p>
                </div>
              </div>

              {/* Stats Row - SAME CONTENT, BETTER MOBILE LAYOUT */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:flex lg:items-center mt-4 sm:mt-6">
                <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-white/20">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold">
                      89%
                    </p>
                    <p className="text-xs text-amber-200 truncate">
                      {t.occupancyRate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-white/20">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold">
                      4.8
                    </p>
                    <p className="text-xs text-amber-200 truncate">
                      {t.guestRating}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-white/20">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold">
                      24
                    </p>
                    <p className="text-xs text-amber-200 truncate">
                      {t.activeStays}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:text-right lg:self-start">
              <Button
                onClick={() => {
                  setIsCreateOpen(true);
                  setFormError(null);
                }}
                className="w-full lg:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-0 shadow-xl lg:shadow-2xl rounded-xl lg:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                {t.createReservation}
              </Button>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-orange-500/5 to-amber-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Enhanced Search & Filters - SAME FUNCTIONALITY, BETTER MOBILE LAYOUT */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-slate-200 dark:border-slate-700">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
          <Input
            placeholder={t.searchBookingsPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border-0 bg-white dark:bg-slate-700 shadow-lg rounded-xl"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[200px] bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-xl text-sm sm:text-base">
            <SelectValue placeholder={t.filterByStatus} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.allReservations}</SelectItem>
            <SelectItem value="confirmed">{t.statusConfirmed}</SelectItem>
            <SelectItem value="pending">{t.statusPending}</SelectItem>
            <SelectItem value="cancelled">{t.statusCancelled}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Enhanced Tabs - SAME CONTENT, MOBILE OPTIMIZED */}
      <Tabs defaultValue="list" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 p-1 sm:p-2 bg-slate-100 dark:bg-slate-800 rounded-xl sm:rounded-2xl">
          <TabsTrigger
            value="list"
            className="rounded-lg sm:rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700 text-xs sm:text-sm"
          >
            {t.reservationList}
          </TabsTrigger>
          <TabsTrigger
            value="calendar"
            className="rounded-lg sm:rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700 text-xs sm:text-sm"
          >
            {t.calendarOverview}
          </TabsTrigger>
        </TabsList>

        {/* Enhanced Booking List - SAME CONTENT, BETTER MOBILE LAYOUT */}
        <TabsContent value="list" className="space-y-3 sm:space-y-4">
          <div className="grid gap-3 sm:gap-6">
            {filteredBookings.map((booking) => (
              <Card
                key={booking.id}
                className="relative overflow-hidden bg-white dark:bg-slate-800 shadow-lg sm:shadow-xl hover:shadow-xl sm:hover:shadow-3xl transition-all duration-300 group rounded-xl sm:rounded-3xl border border-slate-200 dark:border-slate-700"
              >
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 sm:gap-4 mb-2 sm:mb-3">
                        <div
                          className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl flex-shrink-0 ${
                            booking.priority === "vip"
                              ? "bg-gradient-to-r from-amber-500 to-orange-500"
                              : booking.priority === "premium"
                              ? "bg-gradient-to-r from-emerald-500 to-green-500"
                              : "bg-gradient-to-r from-slate-500 to-slate-600"
                          }`}
                        >
                          <div className="text-white font-bold text-sm sm:text-lg">
                            {booking.guestName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2 flex-wrap">
                            <CardTitle className="text-base sm:text-lg md:text-xl font-bold text-slate-800 dark:text-white truncate">
                              {booking.guestName}
                            </CardTitle>
                            {booking.priority === "vip" && (
                              <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 flex-shrink-0" />
                            )}
                            <Badge
                              className={`${getStatusColor(
                                booking.status
                              )} text-xs sm:text-sm`}
                            >
                              {booking.status}
                            </Badge>
                          </div>
                          <CardDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                            {booking.room} • {booking.guests}{" "}
                            {booking.guests === 1
                              ? t.guestSingular
                              : t.guestPlural}{" "}
                            • {booking.nights} {t.nightsLabel}
                          </CardDescription>
                        </div>
                      </div>

                      {/* Booking Details Grid - SAME DATA, BETTER MOBILE LAYOUT */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 sm:gap-6 text-xs sm:text-sm">
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 text-xs">
                            {t.checkInLabel}
                          </p>
                          <p className="font-semibold text-slate-800 dark:text-white truncate">
                            {booking.checkIn}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 text-xs">
                            {t.checkOutLabel}
                          </p>
                          <p className="font-semibold text-slate-800 dark:text-white truncate">
                            {booking.checkOut}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 text-xs">
                            {t.sourceLabel}
                          </p>
                          <p className="font-semibold text-slate-800 dark:text-white truncate">
                            {booking.source}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 text-xs">
                            {t.totalAmount}
                          </p>
                          <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm sm:text-base md:text-lg">
                            {booking.totalPrice.toLocaleString()} ETB
                          </p>
                        </div>
                      </div>

                      {/* Special Requests - SAME CONTENT */}
                      {booking.specialRequests && (
                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-200 dark:border-slate-700">
                          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-2">
                            {t.specialRequestsLabel}
                          </p>
                          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl">
                            {booking.specialRequests}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons - DROPDOWN ON MOBILE, BUTTONS ON DESKTOP */}
                    <div className="flex sm:hidden">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openViewFor(booking.typed)}
                          >
                            {t.viewDetails}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openEditFor(booking)}
                          >
                            {t.editBooking}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => confirmDelete(booking.id)}
                            className="text-red-600"
                          >
                            {t.cancelBooking}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Desktop Action Buttons - SAME FUNCTIONALITY */}
                    <div className="hidden sm:flex flex-col gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg sm:rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-all text-xs sm:text-sm"
                        onClick={() => openViewFor(booking.typed)}
                      >
                        {t.view}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-amber-300 dark:border-amber-600 text-amber-600 dark:text-amber-400 rounded-lg sm:rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all text-xs sm:text-sm"
                        onClick={() => openEditFor(booking)}
                      >
                        {t.edit}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg sm:rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-xs sm:text-sm"
                        onClick={() => confirmDelete(booking.id)}
                      >
                        {t.cancel}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Enhanced Calendar View - SAME CONTENT, BETTER MOBILE LAYOUT */}
        <TabsContent value="calendar" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <Card className="border-0 bg-white dark:bg-slate-800 shadow-lg sm:shadow-xl rounded-xl sm:rounded-3xl">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-slate-800 dark:text-white text-lg sm:text-xl">
                  <div className="p-2 sm:p-3 bg-amber-500 rounded-xl sm:rounded-2xl">
                    <CalendarIcon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <span>{t.bookingCalendar}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-2 sm:p-4 shadow-lg"
                />
              </CardContent>
            </Card>

            <Card className="border-0 bg-white dark:bg-slate-800 shadow-lg sm:shadow-xl rounded-xl sm:rounded-3xl">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-slate-800 dark:text-white text-lg sm:text-xl">
                  <div className="p-2 sm:p-3 bg-emerald-500 rounded-xl sm:rounded-2xl">
                    <Users className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <span>
                    {t.arrivalsOn} {selectedDate?.toLocaleDateString()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4">
                <div className="space-y-3 sm:space-y-4">
                  {filteredBookings.slice(0, 3).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-3 sm:p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-800 dark:text-white text-sm sm:text-base truncate">
                          {booking.guestName}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 truncate">
                          {booking.room}
                        </p>
                      </div>
                      <Badge
                        className={`${getStatusColor(
                          booking.status
                        )} text-xs sm:text-sm`}
                      >
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

      {/* ALL ORIGINAL DIALOGS - SAME FUNCTIONALITY, MOBILE OPTIMIZED */}

      {/* Create Booking Dialog - FULL FUNCTIONALITY PRESERVED */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-0 shadow-2xl rounded-xl sm:rounded-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-inherit z-10 pb-4 border-b border-slate-200 dark:border-slate-700">
            <DialogTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-2xl">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl sm:rounded-2xl">
                <Plus className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <div>New Reservation</div>
                <div className="text-xs sm:text-sm font-normal text-slate-500">
                  Create a premium booking experience
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 sm:gap-6 py-4">
            {/* ALL ORIGINAL FORM FIELDS PRESERVED */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2 sm:space-y-3">
                <Label
                  htmlFor="firstName"
                  className="text-xs sm:text-sm font-semibold"
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
                  className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2 sm:space-y-3">
                <Label
                  htmlFor="lastName"
                  className="text-xs sm:text-sm font-semibold"
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
                  className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2 sm:space-y-3">
                <Label
                  htmlFor="guestPhone"
                  className="text-xs sm:text-sm font-semibold"
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
                  className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2 sm:space-y-3">
                <Label
                  htmlFor="guestEmail"
                  className="text-xs sm:text-sm font-semibold"
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
                  className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2 sm:space-y-3">
                <Label
                  htmlFor="numberOfGuests"
                  className="text-xs sm:text-sm font-semibold"
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
                  className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2 sm:space-y-3">
                <Label
                  htmlFor="bookingSource"
                  className="text-xs sm:text-sm font-semibold"
                >
                  Booking Source
                </Label>
                <Select>
                  <SelectTrigger
                    id="bookingSource"
                    className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2 sm:space-y-3">
                <Label
                  htmlFor="bookingCheckIn"
                  className="text-xs sm:text-sm font-semibold"
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
                  className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2 sm:space-y-3">
                <Label
                  htmlFor="bookingCheckOut"
                  className="text-xs sm:text-sm font-semibold"
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
                  className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2 sm:space-y-3">
                <Label
                  htmlFor="bookingRoomType"
                  className="text-xs sm:text-sm font-semibold"
                >
                  Room
                </Label>
                <Select>
                  <SelectTrigger
                    id="bookingRoomType"
                    className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                  >
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    {(roomsData || []).map((r: Room) => (
                      <SelectItem
                        key={r.id}
                        value={r.id}
                        onClick={() =>
                          setFormData({ ...formData, roomId: r.id })
                        }
                      >
                        {`Room ${r.room_number || r.id} - ${
                          r.base_price_birr
                            ? `${Number(
                                r.base_price_birr
                              ).toLocaleString()} ETB`
                            : ""
                        }`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <Label
                htmlFor="specialRequests"
                className="text-xs sm:text-sm font-semibold"
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
                className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
              />
            </div>
          </div>

          {formError && (
            <div className="px-4 sm:px-6">
              <p className="text-sm text-red-600">{formError}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 sticky bottom-0 bg-inherit pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              variant="outline"
              onClick={() => setIsCreateOpen(false)}
              className="border-slate-300 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              disabled={createBookingMutation.isLoading}
              onClick={async () => {
                setFormError(null);
                // ALL ORIGINAL VALIDATION LOGIC PRESERVED
                if (!formData.roomId)
                  return setFormError("Please select a room");
                if (!formData.checkIn || !formData.checkOut)
                  return setFormError(
                    "Please select check-in and check-out dates"
                  );
                setFormLoading(true);
                try {
                  let guestId = formData.guestId;
                  // If no guestId provided, create guest - ORIGINAL LOGIC PRESERVED
                  if (!guestId) {
                    const guestPayload: Partial<Guest> = {
                      first_name: formData.firstName || undefined,
                      last_name: formData.lastName || undefined,
                      email: formData.email || undefined,
                      phone: formData.phone || undefined,
                    };
                    const g = await apiPost<
                      { success: true; data: { guest: Guest } },
                      Partial<Guest>
                    >("/guests", guestPayload);
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
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-lg sm:rounded-xl text-sm sm:text-base order-1 sm:order-2"
            >
              {createBookingMutation.isLoading
                ? "Creating..."
                : "Create Reservation"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Booking Dialog - ALL ORIGINAL CONTENT PRESERVED */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl rounded-xl sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Booking Details
            </DialogTitle>
            <DialogDescription className="text-sm">
              Full booking information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {viewingBooking ? (
              <div className="grid gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {viewingBooking.guests?.first_name?.[0]}
                      {viewingBooking.guests?.last_name?.[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {viewingBooking.guests?.first_name}{" "}
                      {viewingBooking.guests?.last_name}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                      {viewingBooking.guests?.phone && (
                        <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                          <Phone className="h-3 w-3" />
                          {viewingBooking.guests.phone}
                        </div>
                      )}
                      {viewingBooking.guests?.email && (
                        <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                          <Mail className="h-3 w-3" />
                          {viewingBooking.guests.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                      Room
                    </p>
                    <p className="font-semibold">
                      {viewingBooking.rooms?.room_number ||
                        viewingBooking.room_id}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                      Guests
                    </p>
                    <p className="font-semibold">
                      {viewingBooking.number_of_guests}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                      Check-in
                    </p>
                    <p className="font-semibold">{viewingBooking.check_in}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                      Check-out
                    </p>
                    <p className="font-semibold">{viewingBooking.check_out}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                      Status
                    </p>
                    <p className="font-semibold">{viewingBooking.status}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                      Total
                    </p>
                    <p className="font-semibold text-emerald-600">
                      {viewingBooking.total_price_birr ?? 0} ETB
                    </p>
                  </div>
                </div>

                {viewingBooking.special_requests && (
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mb-2">
                      Special Requests
                    </p>
                    <p className="text-sm bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                      {viewingBooking.special_requests}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p>No booking selected</p>
            )}
          </div>
          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setIsViewOpen(false)}
              className="text-sm"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Booking Dialog - ALL ORIGINAL FUNCTIONALITY PRESERVED */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl rounded-xl sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Edit Reservation
            </DialogTitle>
            <DialogDescription className="text-sm">
              Update booking details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:gap-6 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="editCheckIn" className="text-xs sm:text-sm">
                  Check-in Date
                </Label>
                <Input
                  id="editCheckIn"
                  type="date"
                  value={formData.checkIn}
                  onChange={(e) =>
                    setFormData({ ...formData, checkIn: e.target.value })
                  }
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="editCheckOut" className="text-xs sm:text-sm">
                  Check-out Date
                </Label>
                <Input
                  id="editCheckOut"
                  type="date"
                  value={formData.checkOut}
                  onChange={(e) =>
                    setFormData({ ...formData, checkOut: e.target.value })
                  }
                  className="text-sm sm:text-base"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="editRoom" className="text-xs sm:text-sm">
                  Room
                </Label>
                <Select>
                  <SelectTrigger id="editRoom" className="text-sm sm:text-base">
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    {(roomsData || []).map((r: Room) => (
                      <SelectItem
                        key={r.id}
                        value={r.id}
                        onClick={() =>
                          setFormData({ ...formData, roomId: r.id })
                        }
                      >
                        {`Room ${r.room_number || r.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="editGuests" className="text-xs sm:text-sm">
                  Number of Guests
                </Label>
                <Input
                  id="editGuests"
                  type="number"
                  min={1}
                  value={formData.numberOfGuests}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      numberOfGuests: Number(e.target.value),
                    })
                  }
                  className="text-sm sm:text-base"
                />
              </div>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <Label htmlFor="editSpecial" className="text-xs sm:text-sm">
                Special Requests
              </Label>
              <Input
                id="editSpecial"
                value={formData.specialRequests}
                onChange={(e) =>
                  setFormData({ ...formData, specialRequests: e.target.value })
                }
                className="text-sm sm:text-base"
              />
            </div>
          </div>
          {formError && (
            <p className="text-sm text-red-600 px-4 sm:px-6">{formError}</p>
          )}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsEditOpen(false)}
              className="text-sm order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                setFormError(null);
                if (!editingBooking) return setFormError("No booking selected");
                if (!formData.checkIn || !formData.checkOut)
                  return setFormError("Please provide dates");
                try {
                  await updateBookingMutation.mutateAsync({
                    id: editingBooking.id,
                    payload: {
                      check_in: formData.checkIn,
                      check_out: formData.checkOut,
                      room_id: formData.roomId,
                      number_of_guests: formData.numberOfGuests,
                      special_requests: formData.specialRequests,
                    } as UpdateBookingInput,
                  });
                } catch (err) {
                  const message = extractError(err);
                  setFormError(message);
                }
              }}
              className="text-sm order-1 sm:order-2"
            >
              {updateBookingMutation.isLoading ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog - ALL ORIGINAL FUNCTIONALITY PRESERVED */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md rounded-xl sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Confirm cancellation
            </DialogTitle>
            <DialogDescription className="text-sm">
              Are you sure you want to cancel this reservation? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="text-sm order-2 sm:order-1"
            >
              No, keep booking
            </Button>
            <Button
              className="bg-red-600 text-white text-sm order-1 sm:order-2"
              onClick={async () => {
                if (!deleteTargetId) return;
                try {
                  await deleteBookingMutation.mutateAsync(deleteTargetId);
                } catch (err) {
                  // handled in mutation
                } finally {
                  setDeleteDialogOpen(false);
                  setDeleteTargetId(null);
                }
              }}
            >
              {deleteBookingMutation.isLoading
                ? "Cancelling..."
                : "Yes, cancel booking"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Bookings;
