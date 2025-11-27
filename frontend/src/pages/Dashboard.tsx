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
      <div className="p-4 sm:p-6">
        <BubblingPlaceholder variant="page" />
      </div>
    );
  }
  if (error) {
    return <div className="p-4 sm:p-6 text-red-600">{error}</div>;
  }
  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 p-4 sm:p-6 md:p-8 text-white">
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                {t.dashboard}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-blue-200">
                Welcome back! Here's what's happening at Omera Luxury Resort
                today.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-white/20">
              <div className="p-2 bg-white/20 rounded-xl">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold">Premium Mode</p>
                <p className="text-xs text-blue-200">All systems optimal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gradient-to-br from-amber-400/20 to-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
            className="relative overflow-hidden border-0 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group"
          >
            {/* Animated Background */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
            ></div>

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4">
              <CardTitle className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                {stat.title}
              </CardTitle>
              <div className="relative">
                <div
                  className={`p-1.5 sm:p-2 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}
                >
                  <stat.icon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-1 sm:mb-2">
                {stat.value}
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
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
          <Card className="border-0 shadow-lg sm:shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white">
                <div className="p-2 bg-emerald-500 rounded-xl">
                  <Bed className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl">Room Status Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {roomStatus.map((room, index) => (
                  <div
                    key={room.status}
                    className="flex items-center justify-between gap-2 sm:gap-4"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div
                        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${room.color}`}
                      ></div>
                      <span className="font-medium text-slate-700 dark:text-slate-300 text-sm sm:text-base truncate">
                        {room.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                      <span className="font-semibold text-slate-800 dark:text-white text-sm sm:text-base whitespace-nowrap">
                        {room.count} rooms
                      </span>
                      <div className="w-16 sm:w-20 md:w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${room.color} transition-all duration-1000`}
                          style={{ width: `${room.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 w-6 sm:w-8 text-right whitespace-nowrap">
                        {room.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Mobile-optimized sections can be added here */}

          {/* Recent Activities Section (Example) */}
          <Card className="border-0 shadow-lg sm:shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 lg:hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white">
                <div className="p-2 bg-blue-500 rounded-xl">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl">Recent Activities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.length > 0 ? (
                  recentActivities.slice(0, 3).map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800"
                    >
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                          {activity.description || "Activity update"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {activity.time || "Just now"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-slate-500 dark:text-slate-400">
                      No recent activities
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Hidden on mobile, visible on lg and above */}
        <div className="hidden lg:block space-y-6">
          {/* Satisfaction Metrics */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white">
                <div className="p-2 bg-amber-500 rounded-xl">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <span>Guest Satisfaction</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {satisfactionMetrics.map((metric, index) => (
                  <div
                    key={metric.metric}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <metric.icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {metric.metric}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800 dark:text-white">
                        {metric.value}
                      </span>
                      {metric.trend && (
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* VIP Arrivals */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white">
                <div className="p-2 bg-purple-500 rounded-xl">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <span>VIP Arrivals Today</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {vipArrivals.length > 0 ? (
                  vipArrivals.slice(0, 3).map((vip, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {(vip.name || "VIP").charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800 dark:text-slate-200">
                          {vip.name || "VIP Guest"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Room {vip.room || "---"} • {vip.time || "Today"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-slate-500 dark:text-slate-400">
                      No VIP arrivals today
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile-only bottom section */}
      <div className="lg:hidden grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
        {/* Mobile Satisfaction Metrics */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white">
              <div className="p-2 bg-amber-500 rounded-xl">
                <Star className="h-4 w-4 text-white" />
              </div>
              <span className="text-base">Satisfaction</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {satisfactionMetrics.slice(0, 2).map((metric, index) => (
                <div
                  key={metric.metric}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {metric.metric}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-white">
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mobile VIP Arrivals */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white">
              <div className="p-2 bg-purple-500 rounded-xl">
                <Crown className="h-4 w-4 text-white" />
              </div>
              <span className="text-base">VIP Arrivals</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {vipArrivals.length} VIP guests today
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
