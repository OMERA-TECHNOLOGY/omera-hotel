import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BubblingPlaceholder } from "@/components/ui/bubbling-placeholder";
import { apiGet, extractError } from "@/lib/api";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UserPlus,
  UserCheck,
  Search,
  Key,
  Clock,
  Zap,
  Crown,
  Sparkles,
  MapPin,
  Calendar,
  Phone,
  Mail,
  CreditCard,
  Shield,
  Star,
  MoreVertical,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FrontDesk = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLanguage();

  type CurrentGuest = {
    booking_id: string;
    guest_name?: string;
    room_number?: string;
    room_type?: string;
    check_in: string;
    check_out: string;
    status: string;
    amount_birr?: number;
    nights?: number;
  };

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["frontdesk", "stats"],
    queryFn: () => apiGet<{ success: true; data: any }>("/frontdesk/stats"),
  });

  const {
    data: currentGuestsData,
    isLoading: currentGuestsLoading,
    error: currentGuestsError,
  } = useQuery({
    queryKey: ["frontdesk", "current"],
    queryFn: () =>
      apiGet<{ success: true; data: CurrentGuest[] }>("/frontdesk/current"),
  });

  const {
    data: arrivalsData,
    isLoading: arrivalsLoading,
    error: arrivalsError,
  } = useQuery({
    queryKey: ["frontdesk", "arrivals"],
    queryFn: () =>
      apiGet<{ success: true; data: any[] }>("/frontdesk/arrivals"),
  });

  const {
    data: departuresData,
    isLoading: departuresLoading,
    error: departuresError,
  } = useQuery({
    queryKey: ["frontdesk", "departures"],
    queryFn: () =>
      apiGet<{ success: true; data: any[] }>("/frontdesk/departures"),
  });

  // Fetch rooms for room selection in check-in dialog
  const { data: roomsData, isLoading: roomsLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await apiGet("/rooms");
      return res.data?.rooms || res.rooms || res.data || res;
    },
  });

  const rooms = Array.isArray(roomsData)
    ? roomsData
    : roomsData?.rooms || roomsData?.data || [];

  // Show a full-page placeholder while main front-desk data is loading
  const pageLoading =
    statsLoading ||
    currentGuestsLoading ||
    arrivalsLoading ||
    departuresLoading;

  if (pageLoading) {
    return (
      <div className="p-4 sm:p-6">
        <BubblingPlaceholder variant="page" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Mobile-Optimized Header Section */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-slate-900 via-purple-900 to-blue-900 p-4 sm:p-6 md:p-8 text-white">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                {t.frontDesk}
              </h1>
              <p className="mt-1 sm:mt-2 text-blue-200 text-sm sm:text-base md:text-lg">
                {t.frontDeskPremiumDescription}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 lg:gap-6">
              {statsLoading ? (
                <div className="w-full sm:w-[300px] lg:w-[480px]">
                  <BubblingPlaceholder variant="stats" />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20">
                    <div className="p-1.5 sm:p-2 bg-amber-400/20 rounded-lg sm:rounded-xl">
                      <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold">
                        {t.vipLoungeActive}
                      </p>
                      <p className="text-xs text-blue-200">
                        {statsData?.data?.vipCount ?? 3} {t.premiumGuests}
                      </p>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-0 shadow-xl sm:shadow-2xl rounded-xl sm:rounded-2xl text-sm sm:text-base">
                        <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        {t.newCheckIn}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[95vw] sm:max-w-4xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-0 shadow-2xl rounded-xl sm:rounded-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader className="sticky top-0 bg-inherit z-10 pb-4 border-b border-slate-200 dark:border-slate-700">
                        <DialogTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-2xl">
                          <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl">
                            <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 sm:h-6 sm:w-6 text-white" />
                          </div>
                          {t.guestCheckIn}
                        </DialogTitle>
                        <DialogDescription className="text-sm sm:text-base">
                          {t.premiumCheckinDesc}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-4 sm:gap-6 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="space-y-2 sm:space-y-3">
                            <Label
                              htmlFor="firstName"
                              className="text-xs sm:text-sm font-semibold"
                            >
                              {t.firstName}
                            </Label>
                            <Input
                              id="firstName"
                              placeholder={t.placeholderFirstName}
                              className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                            />
                          </div>
                          <div className="space-y-2 sm:space-y-3">
                            <Label
                              htmlFor="lastName"
                              className="text-xs sm:text-sm font-semibold"
                            >
                              {t.lastName}
                            </Label>
                            <Input
                              id="lastName"
                              placeholder={t.placeholderLastName}
                              className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="space-y-2 sm:space-y-3">
                            <Label
                              htmlFor="email"
                              className="text-xs sm:text-sm font-semibold flex items-center gap-2"
                            >
                              <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                              {t.email}
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder={t.emailPlaceholder}
                              className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                            />
                          </div>
                          <div className="space-y-2 sm:space-y-3">
                            <Label
                              htmlFor="phone"
                              className="text-xs sm:text-sm font-semibold flex items-center gap-2"
                            >
                              <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                              {t.phone}
                            </Label>
                            <Input
                              id="phone"
                              placeholder={t.placeholderPhone}
                              className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="space-y-2 sm:space-y-3">
                            <Label
                              htmlFor="idType"
                              className="text-xs sm:text-sm font-semibold flex items-center gap-2"
                            >
                              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                              {t.idType}
                            </Label>
                            <Select>
                              <SelectTrigger
                                id="idType"
                                className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                              >
                                <SelectValue
                                  placeholder={t.selectIdTypePlaceholder}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="passport">
                                  {t.idTypePassport}
                                </SelectItem>
                                <SelectItem value="id">
                                  {t.idTypeCard}
                                </SelectItem>
                                <SelectItem value="driver">
                                  {t.idTypeDriver}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2 sm:space-y-3">
                            <Label
                              htmlFor="idNumber"
                              className="text-xs sm:text-sm font-semibold"
                            >
                              {t.idNumber}
                            </Label>
                            <Input
                              id="idNumber"
                              placeholder={t.placeholderIdNumber}
                              className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="space-y-2 sm:space-y-3">
                            <Label
                              htmlFor="roomType"
                              className="text-xs sm:text-sm font-semibold"
                            >
                              {t.roomType}
                            </Label>
                            <Select>
                              <SelectTrigger
                                id="roomType"
                                className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                              >
                                <SelectValue
                                  placeholder={t.selectRoomTypePlaceholder}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="single">
                                  {t.roomTypeSingle}
                                </SelectItem>
                                <SelectItem value="deluxe">
                                  {t.roomTypeDeluxe}
                                </SelectItem>
                                <SelectItem value="suite">
                                  {t.roomTypeExecutive}
                                </SelectItem>
                                <SelectItem value="presidential">
                                  {t.roomTypePresidential}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2 sm:space-y-3">
                            <Label
                              htmlFor="roomNumber"
                              className="text-xs sm:text-sm font-semibold"
                            >
                              Room Number
                            </Label>
                            <Select>
                              <SelectTrigger
                                id="roomNumber"
                                className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                              >
                                <SelectValue
                                  placeholder={t.selectRoomPlaceholder}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {roomsLoading ? (
                                  <div className="p-2 sm:p-3">
                                    <BubblingPlaceholder
                                      variant="small"
                                      count={2}
                                    />
                                  </div>
                                ) : rooms && rooms.length > 0 ? (
                                  rooms.map((r: any) => (
                                    <SelectItem
                                      key={r.id || r.room_number}
                                      value={r.room_number || r.id}
                                    >
                                      {`Room ${r.room_number || r.id} • ${
                                        r.room_type_name || r.type || ""
                                      }`}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="none">
                                    {t.noRoomsAvailable}
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="space-y-2 sm:space-y-3">
                            <Label
                              htmlFor="checkIn"
                              className="text-xs sm:text-sm font-semibold flex items-center gap-2"
                            >
                              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                              {t.checkInLabel}
                            </Label>
                            <Input
                              id="checkIn"
                              type="date"
                              className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                            />
                          </div>
                          <div className="space-y-2 sm:space-y-3">
                            <Label
                              htmlFor="checkOut"
                              className="text-xs sm:text-sm font-semibold flex items-center gap-2"
                            >
                              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                              {t.checkOutLabel}
                            </Label>
                            <Input
                              id="checkOut"
                              type="date"
                              className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 sticky bottom-0 bg-inherit pt-4 border-t border-slate-200 dark:border-slate-700">
                        <Button
                          variant="outline"
                          className="border-slate-300 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base order-2 sm:order-1"
                        >
                          {t.cancel}
                        </Button>
                        <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg sm:rounded-xl text-sm sm:text-base order-1 sm:order-2">
                          {t.completePremiumCheckin}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gradient-to-br from-amber-400/20 to-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Mobile-Optimized Search Bar */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent blur-xl"></div>
        <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
            <Input
              placeholder={t.searchGuestsPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl sm:shadow-2xl rounded-xl sm:rounded-2xl"
            />
          </div>
          <Button
            variant="outline"
            className="border-slate-300 dark:border-slate-600 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-xl sm:shadow-2xl rounded-xl sm:rounded-2xl text-sm sm:text-base"
          >
            <Zap className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Quick Actions
          </Button>
        </div>
      </div>

      {/* Mobile-Optimized Tabs Section */}
      <Tabs defaultValue="current" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3 p-1 sm:p-2 bg-slate-100 dark:bg-slate-800 rounded-xl sm:rounded-2xl">
          <TabsTrigger
            value="current"
            className="rounded-lg sm:rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700 text-xs sm:text-sm"
          >
            <span className="truncate">{t.tabCurrent}</span>
            <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-500 text-white text-xs rounded-full">
              3
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="checkout"
            className="rounded-lg sm:rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700 text-xs sm:text-sm"
          >
            <span className="truncate">{t.tabCheckout}</span>
            <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-amber-500 text-white text-xs rounded-full">
              2
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="arrivals"
            className="rounded-lg sm:rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700 text-xs sm:text-sm"
          >
            <span className="truncate">{t.tabArrivals}</span>
            <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-emerald-500 text-white text-xs rounded-full">
              2
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Current Guests Tab - Mobile Optimized */}
        <TabsContent value="current" className="space-y-3 sm:space-y-4">
          <div className="grid gap-4 sm:gap-6">
            {currentGuestsLoading ? (
              <BubblingPlaceholder variant="cardList" count={3} />
            ) : currentGuestsError ? (
              <div className="text-sm text-red-600 p-4">
                {extractError(currentGuestsError)}
              </div>
            ) : null}
            {(currentGuestsData?.data ?? []).map((guest) => (
              <Card
                key={guest.booking_id}
                className="border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-lg sm:shadow-xl hover:shadow-xl sm:hover:shadow-3xl transition-all duration-300 group rounded-xl sm:rounded-3xl"
              >
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 sm:gap-4 mb-2 sm:mb-3">
                        <div
                          className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl flex-shrink-0 ${
                            guest.priority === "vip"
                              ? "bg-gradient-to-r from-amber-500 to-orange-500"
                              : guest.priority === "premium"
                              ? "bg-gradient-to-r from-purple-500 to-pink-500"
                              : "bg-gradient-to-r from-blue-500 to-cyan-500"
                          }`}
                        >
                          <div className="text-white font-bold text-sm sm:text-lg">
                            {(guest.guest_name || "?")
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2 flex-wrap">
                            <span className="text-base sm:text-lg md:text-xl font-bold text-slate-800 dark:text-white truncate">
                              {guest.guest_name}
                            </span>
                            {guest.priority === "vip" && (
                              <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 flex-shrink-0" />
                            )}
                            {guest.priority === "premium" && (
                              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 flex-shrink-0" />
                            )}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 text-xs sm:text-sm">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="truncate">
                              {guest.room_number}
                            </span>
                          </CardDescription>
                        </div>
                      </div>

                      {/* Mobile Action Dropdown */}
                      <div className="flex sm:hidden mb-3">
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
                            <DropdownMenuItem>
                              <Key className="h-4 w-4 mr-2" />
                              {t.issueKey}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Clock className="h-4 w-4 mr-2" />
                              {t.extendStay}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserCheck className="h-4 w-4 mr-2" />
                              {guest.status === "Checking Out"
                                ? t.processCheckout
                                : t.checkOut}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Mobile-Optimized Guest Details */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:gap-6 text-xs sm:text-sm">
                        <div>
                            <p className="text-slate-600 dark:text-slate-400 text-xs flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {t.checkInLabel}
                            </p>
                          <p className="font-semibold text-slate-800 dark:text-white text-sm">
                            {guest.check_in}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-600 dark:text-slate-400 text-xs flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {t.checkOutLabel}
                          </p>
                          <p className="font-semibold text-slate-800 dark:text-white text-sm">
                            {guest.check_out}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 text-xs">
                            {t.totalStay}
                          </p>
                          <p className="font-semibold text-slate-800 dark:text-white text-sm">
                            {guest.nights || 1} {t.nightsLabel}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1">
                            <CreditCard className="h-3 w-3" />
                            Amount
                          </p>
                          <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm">
                            {guest.amount_birr?.toLocaleString() || "0"} ETB
                          </p>
                        </div>
                      </div>

                      {/* Services Section */}
                      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-2">
                          {t.activeServicesLabel}
                        </p>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {(guest.services || []).map((service, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs rounded-full border border-blue-500/20"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Desktop Action Buttons */}
                    <div className="hidden sm:flex flex-col gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg sm:rounded-xl border-slate-300 dark:border-slate-600 text-xs sm:text-sm"
                      >
                        <Key className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        {t.issueKey}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg sm:rounded-xl border-slate-300 dark:border-slate-600 text-xs sm:text-sm"
                      >
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        {t.extendStay}
                      </Button>
                      <Button
                        size="sm"
                        className={`rounded-lg sm:rounded-xl text-xs sm:text-sm ${
                          guest.status === "Checking Out"
                            ? "bg-gradient-to-r from-amber-500 to-orange-500"
                            : "bg-gradient-to-r from-emerald-500 to-green-500"
                        }`}
                      >
                        <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        {guest.status === "Checking Out"
                          ? t.processCheckout
                          : t.checkOut}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Check-out Today Tab - Mobile Optimized */}
        <TabsContent value="checkout" className="space-y-3 sm:space-y-4">
          <div className="grid gap-4 sm:gap-6">
            {departuresLoading ? (
              <BubblingPlaceholder variant="list" count={2} />
            ) : departuresError ? (
              <div className="text-sm text-red-600 p-4">
                {extractError(departuresError)}
              </div>
            ) : null}
            {(departuresData?.data ?? []).map((guest) => (
              <Card
                key={guest.id}
                className="border-0 bg-gradient-to-br from-white to-amber-50 dark:from-slate-800 dark:to-amber-900/20 shadow-lg sm:shadow-xl rounded-xl sm:rounded-3xl"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="p-2 sm:p-3 bg-amber-500 rounded-xl sm:rounded-2xl">
                        <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base sm:text-lg text-slate-800 dark:text-white truncate">
                          {guest.name}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm truncate">
                          {guest.room}
                        </p>
                      </div>
                    </div>
                    <div className="text-right sm:text-left">
                      <p className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
                        {guest.balance}
                      </p>
                      <p
                        className={`text-xs sm:text-sm ${
                          guest.status === "Pending Payment"
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {guest.status}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      {t.scheduled} {guest.time}
                    </p>
                    <Button className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 text-sm">
                      {t.processCheckout}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Expected Arrivals Tab - Mobile Optimized */}
        <TabsContent value="arrivals" className="space-y-3 sm:space-y-4">
          <div className="grid gap-4 sm:gap-6">
            {arrivalsLoading ? (
              <BubblingPlaceholder variant="list" count={2} />
            ) : arrivalsError ? (
              <div className="text-sm text-red-600 p-4">
                {extractError(arrivalsError)}
              </div>
            ) : null}
            {(arrivalsData?.data ?? []).map((guest) => (
              <Card
                key={guest.id}
                className="border-0 bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-emerald-900/20 shadow-lg sm:shadow-xl rounded-xl sm:rounded-3xl"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="p-2 sm:p-3 bg-emerald-500 rounded-xl sm:rounded-2xl">
                        <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base sm:text-lg text-slate-800 dark:text-white truncate">
                          {guest.name}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm truncate">
                          {guest.room}
                        </p>
                        <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                          {guest.special}
                        </p>
                      </div>
                    </div>
                    <div className="text-right sm:text-left">
                      <p className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
                        {guest.time}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                        {guest.duration}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FrontDesk;
