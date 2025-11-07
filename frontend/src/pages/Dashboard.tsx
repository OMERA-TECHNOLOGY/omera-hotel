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
import { useLanguage } from "@/contexts/language-context";

const Dashboard = () => {
  const { t } = useLanguage();

  // Premium Stats with enhanced data
  const stats = [
    {
      title: t.totalGuests,
      value: "124",
      change: "+12% from last month",
      icon: Users,
      color: "text-blue-500",
      gradient: "from-blue-500 to-cyan-500",
      trend: "up",
    },
    {
      title: t.occupiedRooms,
      value: "45/60",
      change: "75% occupancy",
      icon: Bed,
      color: "text-emerald-500",
      gradient: "from-emerald-500 to-green-500",
      trend: "up",
    },
    {
      title: t.todayRevenue,
      value: "45,320 ETB",
      change: "+8% from yesterday",
      icon: DollarSign,
      color: "text-amber-500",
      gradient: "from-amber-500 to-orange-500",
      trend: "up",
    },
    {
      title: t.checkInsToday,
      value: "12",
      change: "8 pending arrivals",
      icon: Calendar,
      color: "text-purple-500",
      gradient: "from-purple-500 to-pink-500",
      trend: "stable",
    },
  ];

  // Enhanced recent activities
  const recentActivities = [
    {
      action: "VIP Check-in",
      room: "Suite 204 • Premium",
      time: "2 minutes ago",
      guest: "John Smith",
      icon: Crown,
      color: "text-amber-500",
      type: "checkin",
    },
    {
      action: "Room Service Completed",
      room: "Room 315 • Deluxe",
      time: "15 minutes ago",
      guest: "Housekeeping",
      icon: Coffee,
      color: "text-emerald-500",
      type: "service",
    },
    {
      action: "Payment Processed",
      room: "Room 102 • Business",
      time: "32 minutes ago",
      guest: "Sarah Johnson",
      icon: DollarSign,
      color: "text-blue-500",
      type: "payment",
    },
    {
      action: "Early Check-out",
      room: "Suite 401 • Premium",
      time: "1 hour ago",
      guest: "Michael Brown",
      icon: Shield,
      color: "text-purple-500",
      type: "checkout",
    },
  ];

  // Room status overview
  const roomStatus = [
    { status: "Available", count: 15, color: "bg-emerald-500", percentage: 25 },
    { status: "Occupied", count: 45, color: "bg-blue-500", percentage: 75 },
    { status: "Cleaning", count: 8, color: "bg-amber-500", percentage: 13 },
    { status: "Maintenance", count: 2, color: "bg-red-500", percentage: 3 },
  ];

  // Guest satisfaction metrics
  const satisfactionMetrics = [
    { metric: "Overall Rating", value: "4.8/5", trend: "+0.2", icon: Star },
    { metric: "Cleanliness", value: "4.9/5", trend: "+0.1", icon: Sparkles },
    { metric: "Service", value: "4.7/5", trend: "+0.3", icon: Users },
    { metric: "Amenities", value: "4.6/5", trend: "+0.1", icon: Wifi },
  ];

  // Upcoming VIP arrivals
  const vipArrivals = [
    {
      name: "Emma Wilson",
      room: "Presidential Suite",
      time: "2:00 PM",
      duration: "3 nights",
      special: "Anniversary",
    },
    {
      name: "James Rodriguez",
      room: "Executive Suite",
      time: "4:30 PM",
      duration: "5 nights",
      special: "Business",
    },
    {
      name: "Sophia Chen",
      room: "Premium Suite",
      time: "6:15 PM",
      duration: "2 nights",
      special: "Birthday",
    },
  ];

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
          {/* Enhanced Recent Activity */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700 dark:to-blue-900/20 border-b">
              <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white">
                <div className="p-2 bg-blue-500 rounded-xl">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <span>Real-time Activity Stream</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200 group"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-2 rounded-lg ${activity.color} bg-opacity-10 group-hover:scale-110 transition-transform duration-200`}
                      >
                        <activity.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-slate-800 dark:text-white">
                            {activity.action}
                          </p>
                          <span className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300">
                            {activity.room}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {activity.guest}
                        </p>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-500 whitespace-nowrap">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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

        {/* Right Column - Side Metrics */}
        <div className="space-y-6">
          {/* Guest Satisfaction */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white">
                <div className="p-2 bg-amber-500 rounded-xl">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <span>Guest Satisfaction</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {satisfactionMetrics.map((metric, index) => (
                <div
                  key={metric.metric}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <metric.icon className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {metric.metric}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-800 dark:text-white">
                      {metric.value}
                    </div>
                    <div className="text-xs text-emerald-500 font-semibold">
                      {metric.trend}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* VIP Arrivals Today */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-amber-900 dark:text-amber-100">
                <div className="p-2 bg-amber-500 rounded-xl">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <span>VIP Arrivals Today</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {vipArrivals.map((guest, index) => (
                <div
                  key={guest.name}
                  className="p-3 rounded-lg bg-white/50 dark:bg-amber-800/20 border border-amber-200 dark:border-amber-700/30"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-amber-900 dark:text-amber-100">
                      {guest.name}
                    </span>
                    <span className="text-xs bg-amber-500 text-white px-2 py-1 rounded-full">
                      {guest.time}
                    </span>
                  </div>
                  <div className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    <div>{guest.room}</div>
                    <div className="flex justify-between text-xs">
                      <span>{guest.duration}</span>
                      <span className="text-amber-600 dark:text-amber-400">
                        {guest.special}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-900 to-blue-900 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-amber-400" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  icon: Eye,
                  label: "View All Bookings",
                  color: "text-blue-400",
                },
                {
                  icon: Users,
                  label: "Manage Staff",
                  color: "text-emerald-400",
                },
                {
                  icon: DollarSign,
                  label: "Financial Report",
                  color: "text-amber-400",
                },
                {
                  icon: Bed,
                  label: "Room Assignment",
                  color: "text-purple-400",
                },
              ].map((action, index) => (
                <button
                  key={action.label}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 group"
                >
                  <action.icon
                    className={`h-4 w-4 ${action.color} group-hover:scale-110 transition-transform`}
                  />
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
