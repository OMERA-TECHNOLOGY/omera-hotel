import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Filter } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type RoomStatus = "vacant" | "occupied" | "cleaning" | "maintenance"

interface Room {
  id: number
  number: string
  type: string
  floor: number
  status: RoomStatus
  price: number
  features: string[]
}

const Rooms = () => {
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")

  const rooms: Room[] = [
    { id: 1, number: "101", type: "Single", floor: 1, status: "vacant", price: 1500, features: ["WiFi", "TV", "AC"] },
    { id: 2, number: "102", type: "Single", floor: 1, status: "occupied", price: 1500, features: ["WiFi", "TV", "AC"] },
    { id: 3, number: "201", type: "Deluxe", floor: 2, status: "cleaning", price: 2500, features: ["WiFi", "TV", "AC", "Mini Bar"] },
    { id: 4, number: "202", type: "Deluxe", floor: 2, status: "vacant", price: 2500, features: ["WiFi", "TV", "AC", "Mini Bar"] },
    { id: 5, number: "301", type: "Suite", floor: 3, status: "occupied", price: 4500, features: ["WiFi", "TV", "AC", "Mini Bar", "Balcony"] },
    { id: 6, number: "401", type: "Presidential", floor: 4, status: "maintenance", price: 8500, features: ["WiFi", "TV", "AC", "Mini Bar", "Balcony", "Jacuzzi"] },
  ]

  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case "vacant":
        return "bg-primary/10 text-primary hover:bg-primary/20"
      case "occupied":
        return "bg-secondary/10 text-secondary hover:bg-secondary/20"
      case "cleaning":
        return "bg-accent/10 text-accent hover:bg-accent/20"
      case "maintenance":
        return "bg-destructive/10 text-destructive hover:bg-destructive/20"
      default:
        return "bg-muted"
    }
  }

  const getStatusLabel = (status: RoomStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const filteredRooms = rooms.filter(room => {
    if (filterStatus !== "all" && room.status !== filterStatus) return false
    if (filterType !== "all" && room.type !== filterType) return false
    return true
  })

  const statusCounts = {
    vacant: rooms.filter(r => r.status === "vacant").length,
    occupied: rooms.filter(r => r.status === "occupied").length,
    cleaning: rooms.filter(r => r.status === "cleaning").length,
    maintenance: rooms.filter(r => r.status === "maintenance").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Room Management</h1>
          <p className="text-muted-foreground">View and manage all hotel rooms</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Room
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Vacant (Clean)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{statusCounts.vacant}</div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{statusCounts.occupied}</div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Cleaning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{statusCounts.cleaning}</div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{statusCounts.maintenance}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
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
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Single">Single</SelectItem>
            <SelectItem value="Deluxe">Deluxe</SelectItem>
            <SelectItem value="Suite">Suite</SelectItem>
            <SelectItem value="Presidential">Presidential</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Room Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRooms.map((room) => (
          <Card key={room.id} className="border-border hover:border-primary transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Room {room.number}</CardTitle>
                  <CardDescription>{room.type} • Floor {room.floor}</CardDescription>
                </div>
                <Badge className={getStatusColor(room.status)}>
                  {getStatusLabel(room.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-2xl font-bold">{room.price} ETB</p>
                <p className="text-xs text-muted-foreground">per night</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {room.features.map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Rooms
