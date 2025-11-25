import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Bed,
  DollarSign,
  Calendar,
  TrendingUp,
  Clock,
  Star,
  MapPin,
  Coffee,
  Wifi,
  Car,
  Utensils,
  Shield,
  Eye,
  Zap,
  Crown,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { BubblingPlaceholder } from "@/components/ui/bubbling-placeholder";
import { useLanguage } from "@/contexts/language-context";
import { apiGet } from "@/lib/api";

const Dashboard = () => {
  const { t } = useLanguage();

  type Metrics = {
    occupied_rooms?: number;
    total_rooms?: number;
    today_revenue?: number;
    today_checkins?: number;
    pending_arrivals?: number;
    [key: string]: unknown;
  } | null;
  type RoomStatusRow = { status: string } & Record<string, unknown>;
  const [metrics, setMetrics] = useState<Metrics>(null);
  const [roomStatusData, setRoomStatusData] = useState<RoomStatusRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const [metricsRes, roomStatusRes] = await Promise.all([
          apiGet("/dashboard/metrics"),
          apiGet("/dashboard/room-status"),
        ]);
        if (!isMounted) return;
        setMetrics(metricsRes.data || metricsRes);
        setRoomStatusData(
          (metricsRes.data ? roomStatusRes.data : roomStatusRes) || []
        );
      } catch (e) {
        const err = e as Error;
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // Premium Stats with enhanced data
  const stats = [
    {
      title: t.totalGuests,
      value: metrics?.total_guests ?? "-",
      change: metrics ? `+${metrics?.guests_change || 0}%` : "",
      icon: Users,
      color: "text-blue-500",
      gradient: "from-blue-500 to-cyan-500",
      trend: "up",
    },
    {
      title: t.occupiedRooms,
      value: String(
        metrics ? `${metrics.occupied_rooms}/${metrics.total_rooms}` : "-"
      ),
      change: metrics
        ? `${Math.round(
            ((metrics.occupied_rooms || 0) / (metrics.total_rooms || 1)) * 100
          )}% occupancy`
        : "",
      icon: Bed,
      color: "text-emerald-500",
      gradient: "from-emerald-500 to-green-500",
      trend: "up",
    },
    {
      title: t.todayRevenue,
      value: metrics
        ? `${(metrics.today_revenue || 0).toLocaleString()} ETB`
        : "-",
      change: "",
      icon: DollarSign,
      color: "text-amber-500",
      gradient: "from-amber-500 to-orange-500",
      trend: "up",
    },
    {
      title: t.checkInsToday,
      value: String(metrics?.today_checkins ?? "-"),
      change: metrics
        ? `${metrics.pending_arrivals || 0} pending arrivals`
        : "",
      icon: Calendar,
      color: "text-purple-500",
      gradient: "from-purple-500 to-pink-500",
      trend: "stable",
    },
  ];

  // Enhanced recent activities
  const recentActivities = metrics?.recent_activities || [];

  // Room status overview
  const counts = roomStatusData.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const totalRooms = metrics?.total_rooms || roomStatusData.length || 1;
  const roomStatus = [
    {
      status: "Available",
      count: counts["vacant"] || 0,
      color: "bg-emerald-500",
      percentage: Math.round(((counts["vacant"] || 0) / totalRooms) * 100),
    },
    {
      status: "Occupied",
      count: counts["occupied"] || 0,
      color: "bg-blue-500",
      percentage: Math.round(((counts["occupied"] || 0) / totalRooms) * 100),
    },
    {
      status: "Cleaning",
      count: counts["cleaning"] || 0,
      color: "bg-amber-500",
      percentage: Math.round(((counts["cleaning"] || 0) / totalRooms) * 100),
    },
    {
      status: "Maintenance",
      count: counts["maintenance"] || 0,
      color: "bg-red-500",
      percentage: Math.round(((counts["maintenance"] || 0) / totalRooms) * 100),
    },
  ];

  const satisfactionMetrics = metrics?.satisfaction_metrics || [
    { metric: "Overall Rating", value: "-", trend: "", icon: Star },
    { metric: "Cleanliness", value: "-", trend: "", icon: Sparkles },
    { metric: "Service", value: "-", trend: "", icon: Users },
    { metric: "Amenities", value: "-", trend: "", icon: Wifi },
  ];

  const vipArrivals = metrics?.vip_arrivals || [];

  if (loading) {
    return (
      <div className="p-6">
        <BubblingPlaceholder variant="page" />
      </div>
    );
  }
  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }
  return (
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                {t.dashboard}
              </h1>
              <p className="mt-2 text-blue-200">
                Welcome back! Here's what's happening at Omera Luxury Resort
                today.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="p-2 bg-white/20 rounded-xl">
                <Zap className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold">Premium Mode</p>
                <p className="text-xs text-blue-200">All systems optimal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/20 to-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
            className="relative overflow-hidden border-0 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group"
          >
            {/* Animated Background */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
            ></div>

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                {stat.title}
              </CardTitle>
              <div className="relative">
                <div
                  className={`p-2 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}
                >
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                {stat.value}
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    stat.trend === "up" ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                ></div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {stat.change}
                </p>
              </div>
            </CardContent>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700">
              <div
                className={`h-full bg-gradient-to-r ${stat.gradient} transition-all duration-1000`}
                style={{ width: `${(index + 1) * 25}%` }}
              ></div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Room Status Overview */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white">
                <div className="p-2 bg-emerald-500 rounded-xl">
                  <Bed className="h-5 w-5 text-white" />
                </div>
                <span>Room Status Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roomStatus.map((room, index) => (
                  <div
                    key={room.status}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${room.color}`}
                      ></div>
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {room.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-slate-800 dark:text-white">
                        {room.count} rooms
                      </span>
                      <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${room.color} transition-all duration-1000`}
                          style={{ width: `${room.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-slate-500 dark:text-slate-400 w-8">
                        {room.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
