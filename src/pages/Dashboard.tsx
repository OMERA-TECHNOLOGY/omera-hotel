import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Bed, DollarSign, Calendar, TrendingUp, Clock } from "lucide-react"

const Dashboard = () => {
  const stats = [
    {
      title: "Total Guests",
      value: "124",
      change: "+12% from last month",
      icon: Users,
      color: "text-primary"
    },
    {
      title: "Occupied Rooms",
      value: "45/60",
      change: "75% occupancy",
      icon: Bed,
      color: "text-secondary"
    },
    {
      title: "Today's Revenue",
      value: "45,320 ETB",
      change: "+8% from yesterday",
      icon: DollarSign,
      color: "text-accent"
    },
    {
      title: "Check-ins Today",
      value: "12",
      change: "8 pending arrivals",
      icon: Calendar,
      color: "text-primary"
    },
  ]

  const recentActivities = [
    { action: "Guest Check-in", room: "Room 204", time: "2 minutes ago", guest: "John Smith" },
    { action: "Room Cleaned", room: "Room 315", time: "15 minutes ago", guest: "-" },
    { action: "Payment Received", room: "Room 102", time: "32 minutes ago", guest: "Sarah Johnson" },
    { action: "Guest Check-out", room: "Room 401", time: "1 hour ago", guest: "Michael Brown" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to Kerayu Hotel Management</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start justify-between border-b border-border pb-3 last:border-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{activity.room}</span>
                      {activity.guest !== "-" && (
                        <>
                          <span>•</span>
                          <span>{activity.guest}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Available Rooms</span>
              <span className="text-lg font-semibold">15</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Rooms in Cleaning</span>
              <span className="text-lg font-semibold">8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Maintenance</span>
              <span className="text-lg font-semibold">2</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Avg. Daily Rate</span>
              <span className="text-lg font-semibold">2,850 ETB</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
