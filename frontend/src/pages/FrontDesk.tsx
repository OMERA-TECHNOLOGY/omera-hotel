import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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

  const { data: statsData } = useQuery({
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

  // Removed static currentGuests sample; now using API data.

  // Removed static upcomingArrivals; fetched from API.

  // Removed static todaysCheckouts; fetched from API.

  return (
    <div className="space-y-8 p-6">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-purple-900 to-blue-900 p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                {t.frontDesk}
              </h1>
              <p className="mt-2 text-blue-200 text-lg">
                Premium Guest Experience Management
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="p-2 bg-amber-400/20 rounded-xl">
                  <Crown className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold">VIP Lounge Active</p>
                  <p className="text-xs text-blue-200">3 premium guests</p>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-0 shadow-2xl">
                    <UserPlus className="h-5 w-5 mr-2" />
                    {t.newCheckIn}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-0 shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                        <UserPlus className="h-6 w-6 text-white" />
                      </div>
                      {t.guestCheckIn}
                    </DialogTitle>
                    <DialogDescription className="text-lg">
                      Complete the premium check-in experience
                    </DialogDescription>
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
                          placeholder="Enter first name"
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
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
                          placeholder="Enter last name"
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label
                          htmlFor="email"
                          className="text-sm font-semibold flex items-center gap-2"
                        >
                          <Mail className="h-4 w-4" />
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="guest@example.com"
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="phone"
                          className="text-sm font-semibold flex items-center gap-2"
                        >
                          <Phone className="h-4 w-4" />
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          placeholder="+251 xxx xxx xxx"
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label
                          htmlFor="idType"
                          className="text-sm font-semibold flex items-center gap-2"
                        >
                          <Shield className="h-4 w-4" />
                          ID Type
                        </Label>
                        <Select>
                          <SelectTrigger
                            id="idType"
                            className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                          >
                            <SelectValue placeholder="Select ID type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="passport">Passport</SelectItem>
                            <SelectItem value="id">ID Card</SelectItem>
                            <SelectItem value="driver">
                              Driver's License
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="idNumber"
                          className="text-sm font-semibold"
                        >
                          ID Number
                        </Label>
                        <Input
                          id="idNumber"
                          placeholder="Enter ID number"
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label
                          htmlFor="roomType"
                          className="text-sm font-semibold"
                        >
                          Room Type
                        </Label>
                        <Select>
                          <SelectTrigger
                            id="roomType"
                            className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                          >
                            <SelectValue placeholder="Select room type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">Single Room</SelectItem>
                            <SelectItem value="deluxe">Deluxe Room</SelectItem>
                            <SelectItem value="suite">
                              Executive Suite
                            </SelectItem>
                            <SelectItem value="presidential">
                              Presidential Suite
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="roomNumber"
                          className="text-sm font-semibold"
                        >
                          Room Number
                        </Label>
                        <Select>
                          <SelectTrigger
                            id="roomNumber"
                            className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                          >
                            <SelectValue placeholder="Select room" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="101">
                              Room 101 • Single
                            </SelectItem>
                            <SelectItem value="102">
                              Room 102 • Deluxe
                            </SelectItem>
                            <SelectItem value="201">
                              Suite 201 • Executive
                            </SelectItem>
                            <SelectItem value="301">
                              Suite 301 • Presidential
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label
                          htmlFor="checkIn"
                          className="text-sm font-semibold flex items-center gap-2"
                        >
                          <Calendar className="h-4 w-4" />
                          Check-in Date
                        </Label>
                        <Input
                          id="checkIn"
                          type="date"
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="checkOut"
                          className="text-sm font-semibold flex items-center gap-2"
                        >
                          <Calendar className="h-4 w-4" />
                          Check-out Date
                        </Label>
                        <Input
                          id="checkOut"
                          type="date"
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      className="border-slate-300 dark:border-slate-600"
                    >
                      {t.cancel}
                    </Button>
                    <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                      Complete Premium Check-in
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/20 to-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Enhanced Search Bar */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent blur-xl"></div>
        <div className="relative flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search guests by name, room number, or booking reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-2xl rounded-2xl"
            />
          </div>
          <Button
            variant="outline"
            className="border-slate-300 dark:border-slate-600 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-2xl rounded-2xl"
          >
            <Zap className="h-5 w-5 mr-2" />
            Quick Actions
          </Button>
        </div>
      </div>

      {/* Enhanced Tabs Section */}
      <Tabs defaultValue="current" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 p-2 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <TabsTrigger
            value="current"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700"
          >
            Current Guests
            <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
              3
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="checkout"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700"
          >
            Check-out Today
            <span className="ml-2 px-2 py-1 bg-amber-500 text-white text-xs rounded-full">
              2
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="arrivals"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700"
          >
            Expected Arrivals
            <span className="ml-2 px-2 py-1 bg-emerald-500 text-white text-xs rounded-full">
              2
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Current Guests Tab */}
        <TabsContent value="current" className="space-y-4">
          <div className="grid gap-6">
            {currentGuestsLoading && (
              <div className="text-sm text-muted-foreground">
                Loading current guests...
              </div>
            )}
            {currentGuestsError && (
              <div className="text-sm text-red-600">
                {extractError(currentGuestsError)}
              </div>
            )}
            {(currentGuestsData?.data ?? []).map((guest) => (
              <Card
                key={guest.id}
                className="border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-2xl hover:shadow-3xl transition-all duration-500 group"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-4 rounded-2xl ${
                          guest.priority === "vip"
                            ? "bg-gradient-to-r from-amber-500 to-orange-500"
                            : guest.priority === "premium"
                            ? "bg-gradient-to-r from-purple-500 to-pink-500"
                            : "bg-gradient-to-r from-blue-500 to-cyan-500"
                        }`}
                      >
                        <div className="text-white font-bold text-lg">
                          {guest.avatar}
                        </div>
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-3">
                          {guest.name}
                          {guest.priority === "vip" && (
                            <Crown className="h-5 w-5 text-amber-500" />
                          )}
                          {guest.priority === "premium" && (
                            <Star className="h-5 w-5 text-purple-500" />
                          )}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4" />
                          {guest.room}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-slate-300 dark:border-slate-600"
                      >
                        <Key className="h-4 w-4 mr-2" />
                        {t.issueKey}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-slate-300 dark:border-slate-600"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        {t.extendStay}
                      </Button>
                      <Button
                        size="sm"
                        className={`rounded-xl ${
                          guest.status === "Checking Out"
                            ? "bg-gradient-to-r from-amber-500 to-orange-500"
                            : "bg-gradient-to-r from-emerald-500 to-green-500"
                        }`}
                      >
                        <UserCheck className="h-4 w-4 mr-2" />
                        {guest.status === "Checking Out"
                          ? "Process Check-out"
                          : t.checkOut}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-6 text-sm">
                    <div>
                      <p className="text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Check-in
                      </p>
                      <p className="font-semibold text-lg">{guest.checkIn}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Check-out
                      </p>
                      <p className="font-semibold text-lg">{guest.checkOut}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Stay</p>
                      <p className="font-semibold text-lg">
                        {guest.nights} nights
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Amount
                      </p>
                      <p className="font-semibold text-lg text-emerald-600 dark:text-emerald-400">
                        {guest.amount}
                      </p>
                    </div>
                  </div>

                  {/* Services Section */}
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-muted-foreground mb-2">
                      Active Services:
                    </p>
                    <div className="flex gap-2">
                      {guest.services.map((service, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm rounded-full border border-blue-500/20"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Check-out Today Tab */}
        <TabsContent value="checkout" className="space-y-4">
          <div className="grid gap-6">
            {departuresLoading && (
              <div className="text-sm text-muted-foreground">
                Loading departures...
              </div>
            )}
            {departuresError && (
              <div className="text-sm text-red-600">
                {extractError(departuresError)}
              </div>
            )}
            {(departuresData?.data ?? []).map((guest) => (
              <Card
                key={guest.id}
                className="border-0 bg-gradient-to-br from-white to-amber-50 dark:from-slate-800 dark:to-amber-900/20 shadow-2xl"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-amber-500 rounded-2xl">
                        <UserCheck className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{guest.name}</h3>
                        <p className="text-muted-foreground">{guest.room}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-800 dark:text-white">
                        {guest.balance}
                      </p>
                      <p
                        className={`text-sm ${
                          guest.status === "Pending Payment"
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {guest.status}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-muted-foreground">
                      Scheduled: {guest.time}
                    </p>
                    <Button className="bg-gradient-to-r from-amber-500 to-orange-500">
                      Process Check-out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Expected Arrivals Tab */}
        <TabsContent value="arrivals" className="space-y-4">
          <div className="grid gap-6">
            {arrivalsLoading && (
              <div className="text-sm text-muted-foreground">
                Loading arrivals...
              </div>
            )}
            {arrivalsError && (
              <div className="text-sm text-red-600">
                {extractError(arrivalsError)}
              </div>
            )}
            {(arrivalsData?.data ?? []).map((guest) => (
              <Card
                key={guest.id}
                className="border-0 bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-emerald-900/20 shadow-2xl"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-500 rounded-2xl">
                        <Sparkles className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{guest.name}</h3>
                        <p className="text-muted-foreground">{guest.room}</p>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          {guest.special}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-800 dark:text-white">
                        {guest.time}
                      </p>
                      <p className="text-sm text-muted-foreground">
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
