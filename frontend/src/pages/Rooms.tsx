import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Filter,
  Zap,
  Crown,
  Sparkles,
  MapPin,
  Star,
  Wifi,
  Tv,
  Wind,
  Martini,
  Home,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { apiGet } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type RoomStatus = "vacant" | "occupied" | "cleaning" | "maintenance";

interface RoomApi {
  id: string;
  room_number: string;
  room_type_id?: string;
  floor: number;
  status: RoomStatus;
  base_price_birr: number;
  view_type?: string;
}
interface RoomUI {
  id: string;
  number: string;
  type: string;
  floor: number;
  status: RoomStatus;
  price: number;
  features: string[];
  rating: number;
  size: string;
  view: string;
}

const Rooms = () => {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const { t } = useLanguage();

  const [rooms, setRooms] = useState<RoomUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadRooms() {
      try {
        const res = await apiGet("/rooms");
        const list: RoomApi[] = (res.data?.rooms ||
          res.rooms ||
          []) as RoomApi[];
        const mapped: RoomUI[] = list.map((r) => ({
          id: r.id,
          number: r.room_number,
          type: "Unknown", // could be expanded by joining room_types in API
          floor: r.floor,
          status: r.status,
          price: Number(r.base_price_birr),
          features: ["WiFi", "TV", "AC"],
          rating: 4.5,
          size: "-",
          view: r.view_type || "-",
        }));
        if (isMounted) setRooms(mapped);
      } catch (e) {
        const err = e as Error;
        setError(err.message || "Failed to load rooms");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadRooms();
    return () => {
      isMounted = false;
    };
  }, []);

  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case "vacant":
        return "bg-emerald-500";
      case "occupied":
        return "bg-amber-500";
      case "cleaning":
        return "bg-orange-500";
      case "maintenance":
        return "bg-red-500";
      default:
        return "bg-slate-500";
    }
  };

  const getStatusGradient = (status: RoomStatus) => {
    switch (status) {
      case "vacant":
        return "from-emerald-500 to-green-500";
      case "occupied":
        return "from-amber-500 to-yellow-500";
      case "cleaning":
        return "from-orange-500 to-amber-500";
      case "maintenance":
        return "from-red-500 to-orange-500";
      default:
        return "from-slate-500 to-slate-600";
    }
  };

  const getStatusLabel = (status: RoomStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case "WiFi":
        return Wifi;
      case "TV":
        return Tv;
      case "AC":
        return Wind;
      case "Mini Bar":
        return Martini;
      case "Balcony":
        return Home;
      case "Jacuzzi":
        return Sparkles;
      case "Butler":
        return Crown;
      case "Ocean View":
        return MapPin;
      default:
        return Star;
    }
  };

  const filteredRooms = rooms.filter((room) => {
    if (filterStatus !== "all" && room.status !== filterStatus) return false;
    if (filterType !== "all" && room.type !== filterType) return false;
    return true;
  });

  const statusCounts = {
    vacant: rooms.filter((r) => r.status === "vacant").length,
    occupied: rooms.filter((r) => r.status === "occupied").length,
    cleaning: rooms.filter((r) => r.status === "cleaning").length,
    maintenance: rooms.filter((r) => r.status === "maintenance").length,
  };

  const handleDeleteRoom = (roomId: number) => {
    // Add delete functionality here
    console.log("Delete room:", roomId);
  };

  const handleEditRoom = (roomId: number) => {
    // Add edit functionality here
    console.log("Edit room:", roomId);
  };

  const handleViewDetails = (roomId: number) => {
    // Add view details functionality here
    console.log("View details room:", roomId);
  };

  if (loading) return <div className="p-6">Loading rooms...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  return (
    <div className="space-y-8 p-6">
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-900 to-amber-900 p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                {t.roomManagement}
              </h1>
              <p className="mt-2 text-emerald-200 text-lg">
                Premium Room Inventory & Status Management
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="p-2 bg-emerald-400/20 rounded-xl">
                  <Home className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Room Analytics</p>
                  <p className="text-xs text-emerald-200">60 total rooms</p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-emerald-500 to-amber-500 hover:from-emerald-600 hover:to-amber-600 border-0 shadow-2xl">
                <Plus className="h-5 w-5 mr-2" />
                {t.addRoom}
              </Button>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-400/20 to-amber-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-amber-400/20 to-emerald-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Enhanced Status Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-emerald-900/20 shadow-xl group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {t.vacant}
              </CardTitle>
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {statusCounts.vacant}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Ready for check-in
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-1000"
              style={{
                width: `${(statusCounts.vacant / rooms.length) * 100}%`,
              }}
            ></div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-amber-50 dark:from-slate-800 dark:to-amber-900/20 shadow-xl group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {t.occupied}
              </CardTitle>
              <div className="p-2 bg-amber-500/10 rounded-xl">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {statusCounts.occupied}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Currently occupied
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-1000"
              style={{
                width: `${(statusCounts.occupied / rooms.length) * 100}%`,
              }}
            ></div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-orange-50 dark:from-slate-800 dark:to-orange-900/20 shadow-xl group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {t.cleaning}
              </CardTitle>
              <div className="p-2 bg-orange-500/10 rounded-xl">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {statusCounts.cleaning}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Being prepared
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-1000"
              style={{
                width: `${(statusCounts.cleaning / rooms.length) * 100}%`,
              }}
            ></div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-red-50 dark:from-slate-800 dark:to-red-900/20 shadow-xl group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {t.maintenance}
              </CardTitle>
              <div className="p-2 bg-red-500/10 rounded-xl">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              {statusCounts.maintenance}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Under maintenance
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-1000"
              style={{
                width: `${(statusCounts.maintenance / rooms.length) * 100}%`,
              }}
            ></div>
          </div>
        </Card>
      </div>

      {/* Enhanced Filters */}
      <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-xl border-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl">
            <Filter className="h-5 w-5 text-emerald-500" />
          </div>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Advanced Filters:
          </span>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[200px] bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border-slate-200 dark:border-slate-600 rounded-xl">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="vacant">Vacant</SelectItem>
            <SelectItem value="occupied">Occupied</SelectItem>
            <SelectItem value="cleaning">Cleaning</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[200px] bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border-slate-200 dark:border-slate-600 rounded-xl">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Single">Single Room</SelectItem>
            <SelectItem value="Deluxe">Deluxe Room</SelectItem>
            <SelectItem value="Executive Suite">Executive Suite</SelectItem>
            <SelectItem value="Presidential">Presidential Suite</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          className="ml-auto border-slate-300 dark:border-slate-600 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-xl"
        >
          <Zap className="h-4 w-4 mr-2" />
          Quick Actions
        </Button>
      </div>

      {/* Enhanced Room Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRooms.map((room) => {
          const FeatureIcon = getFeatureIcon;
          return (
            <Card
              key={room.id}
              className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 group"
            >
              {/* Status Indicator */}
              <div
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-white text-xs font-semibold bg-gradient-to-r ${getStatusGradient(
                  room.status
                )} shadow-lg`}
              >
                {getStatusLabel(room.status)}
              </div>

              {/* Room Type Badge */}
              <div className="absolute top-4 left-4">
                <Badge
                  variant="outline"
                  className={`backdrop-blur-sm border-slate-300 dark:border-slate-600 ${
                    room.type === "Presidential"
                      ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
                      : room.type === "Executive Suite"
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                      : room.type === "Deluxe"
                      ? "bg-orange-500/10 text-orange-700 dark:text-orange-300"
                      : "bg-slate-500/10 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {room.type.includes("Suite") && (
                    <Crown className="h-3 w-3 mr-1" />
                  )}
                  {room.type}
                </Badge>
              </div>

              <CardHeader className="pb-4 pt-16">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                      Room {room.number}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4" />
                      Floor {room.floor} • {room.view} • {room.size}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Price & Rating */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white">
                      {room.price.toLocaleString()} ETB
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      per night
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-500/10 px-3 py-1 rounded-full">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                      {room.rating}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    Premium Features:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {room.features.map((feature, index) => {
                      const IconComponent = getFeatureIcon(feature);
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-1 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs rounded-full border border-emerald-500/20"
                        >
                          <IconComponent className="h-3 w-3" />
                          {feature}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-slate-300 dark:border-slate-600 transition-all hover:scale-105"
                    onClick={() => handleViewDetails(room.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-amber-300 dark:border-amber-600 text-amber-600 dark:text-amber-400 transition-all hover:scale-105"
                    onClick={() => handleEditRoom(room.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 transition-all hover:scale-105"
                    onClick={() => handleDeleteRoom(room.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>

              {/* Hover Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${getStatusGradient(
                  room.status
                )} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-xl`}
              ></div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Rooms;
