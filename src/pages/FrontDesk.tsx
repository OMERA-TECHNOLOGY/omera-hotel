import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserPlus, UserCheck, Search, Key, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const FrontDesk = () => {
  const [searchQuery, setSearchQuery] = useState("")

  const currentGuests = [
    { id: 1, name: "John Smith", room: "204", checkIn: "2025-10-20", checkOut: "2025-10-25", status: "Active" },
    { id: 2, name: "Sarah Johnson", room: "315", checkIn: "2025-10-21", checkOut: "2025-10-24", status: "Active" },
    { id: 3, name: "Michael Brown", room: "102", checkIn: "2025-10-19", checkOut: "2025-10-23", status: "Checking Out" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Front Desk</h1>
          <p className="text-muted-foreground">Manage check-ins, check-outs, and guest services</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                New Check-in
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Guest Check-in</DialogTitle>
                <DialogDescription>Complete the check-in process for a new guest</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Enter first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter last name" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="guest@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="+251 xxx xxx xxx" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="idType">ID Type</Label>
                    <Select>
                      <SelectTrigger id="idType">
                        <SelectValue placeholder="Select ID type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="id">ID Card</SelectItem>
                        <SelectItem value="driver">Driver's License</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idNumber">ID Number</Label>
                    <Input id="idNumber" placeholder="Enter ID number" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomType">Room Type</Label>
                    <Select>
                      <SelectTrigger id="roomType">
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="deluxe">Deluxe</SelectItem>
                        <SelectItem value="suite">Suite</SelectItem>
                        <SelectItem value="presidential">Presidential</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roomNumber">Room Number</Label>
                    <Select>
                      <SelectTrigger id="roomNumber">
                        <SelectValue placeholder="Select room" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="101">Room 101</SelectItem>
                        <SelectItem value="102">Room 102</SelectItem>
                        <SelectItem value="201">Room 201</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkIn">Check-in Date</Label>
                    <Input id="checkIn" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="checkOut">Check-out Date</Label>
                    <Input id="checkOut" type="date" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Complete Check-in</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">Current Guests</TabsTrigger>
          <TabsTrigger value="checkout">Check-out Today</TabsTrigger>
          <TabsTrigger value="arrivals">Expected Arrivals</TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search guests by name, room, or booking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <TabsContent value="current" className="space-y-4">
          <div className="grid gap-4">
            {currentGuests.map((guest) => (
              <Card key={guest.id} className="border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{guest.name}</CardTitle>
                      <CardDescription>Room {guest.room}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Key className="h-4 w-4 mr-2" />
                        Issue Key
                      </Button>
                      <Button variant="outline" size="sm">
                        <Clock className="h-4 w-4 mr-2" />
                        Extend Stay
                      </Button>
                      <Button size="sm">
                        <UserCheck className="h-4 w-4 mr-2" />
                        Check Out
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Check-in</p>
                      <p className="font-medium">{guest.checkIn}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Check-out</p>
                      <p className="font-medium">{guest.checkOut}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p className="font-medium">{guest.status}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="checkout">
          <Card className="border-border">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">3 guests scheduled to check out today</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="arrivals">
          <Card className="border-border">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">8 guests expected to arrive today</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default FrontDesk
