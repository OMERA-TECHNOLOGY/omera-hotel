import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Utensils, Clock, CheckCircle, Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const Restaurant = () => {
  const [searchQuery, setSearchQuery] = useState("")

  const menuItems = [
    { id: 1, name: "Doro Wat", category: "Main Course", price: 350, description: "Traditional Ethiopian chicken stew" },
    { id: 2, name: "Kitfo", category: "Main Course", price: 400, description: "Seasoned raw beef dish" },
    { id: 3, name: "Tibs", category: "Main Course", price: 380, description: "Sautéed meat with vegetables" },
    { id: 4, name: "Shiro", category: "Main Course", price: 180, description: "Chickpea flour stew" },
    { id: 5, name: "Fresh Juice", category: "Beverage", price: 80, description: "Variety of fresh fruit juices" },
    { id: 6, name: "Ethiopian Coffee", category: "Beverage", price: 50, description: "Traditional coffee ceremony" },
  ]

  const orders = [
    {
      id: 1,
      orderNumber: "ORD-001",
      room: "204",
      guest: "John Smith",
      items: ["Doro Wat", "Ethiopian Coffee"],
      total: 400,
      status: "preparing",
      time: "10 mins ago",
    },
    {
      id: 2,
      orderNumber: "ORD-002",
      room: "315",
      guest: "Sarah Johnson",
      items: ["Kitfo", "Fresh Juice"],
      total: 480,
      status: "ready",
      time: "5 mins ago",
    },
    {
      id: 3,
      orderNumber: "ORD-003",
      room: "102",
      guest: "Michael Brown",
      items: ["Tibs", "Shiro", "Ethiopian Coffee"],
      total: 610,
      status: "delivered",
      time: "30 mins ago",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "received":
        return "bg-muted text-muted-foreground"
      case "preparing":
        return "bg-accent/10 text-accent"
      case "ready":
        return "bg-secondary/10 text-secondary"
      case "delivered":
        return "bg-primary/10 text-primary"
      default:
        return "bg-muted"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "preparing":
        return <Clock className="h-4 w-4" />
      case "ready":
        return <Utensils className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Restaurant & Room Service</h1>
          <p className="text-muted-foreground">Manage menu, orders, and kitchen operations</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Menu Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Menu Item</DialogTitle>
                <DialogDescription>Create a new item for the restaurant menu</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="itemName">Item Name</Label>
                  <Input id="itemName" placeholder="Enter dish name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="itemCategory">Category</Label>
                    <Select>
                      <SelectTrigger id="itemCategory">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="appetizer">Appetizer</SelectItem>
                        <SelectItem value="main">Main Course</SelectItem>
                        <SelectItem value="dessert">Dessert</SelectItem>
                        <SelectItem value="beverage">Beverage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="itemPrice">Price (ETB)</Label>
                    <Input id="itemPrice" type="number" placeholder="0.00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="itemDescription">Description</Label>
                  <Input id="itemDescription" placeholder="Brief description" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Add Item</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Room Service Order</DialogTitle>
                <DialogDescription>Place a new order for guest room service</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orderRoom">Room Number</Label>
                    <Input id="orderRoom" placeholder="Enter room number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orderGuest">Guest Name</Label>
                    <Input id="orderGuest" placeholder="Guest name" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Select Items</Label>
                  <div className="border border-border rounded-md p-4 max-h-64 overflow-y-auto space-y-2">
                    {menuItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 hover:bg-accent rounded-md">
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.price} ETB</p>
                        </div>
                        <Button variant="outline" size="sm">Add</Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Order Summary</Label>
                  <div className="border border-border rounded-md p-4">
                    <p className="text-sm text-muted-foreground">No items added yet</p>
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>0 ETB</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Place Order</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Active Orders</TabsTrigger>
          <TabsTrigger value="menu">Menu Management</TabsTrigger>
          <TabsTrigger value="kitchen">Kitchen Display</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders by room number or order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="grid gap-4">
            {orders.map((order) => (
              <Card key={order.id} className="border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                      <CardDescription>
                        Room {order.room} • {order.guest}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      <span className="mr-1">{getStatusIcon(order.status)}</span>
                      {order.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-2">Order Items:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {order.items.map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="text-sm text-muted-foreground">{order.time}</div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="text-lg font-bold">{order.total} ETB</p>
                        </div>
                        {order.status !== "delivered" && (
                          <Button size="sm">
                            {order.status === "preparing" ? "Mark Ready" : "Mark Delivered"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="menu" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.map((item) => (
              <Card key={item.id} className="border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{item.name}</CardTitle>
                    <Badge variant="outline">{item.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold">{item.price} ETB</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Delete</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="kitchen" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Kitchen Order Display</CardTitle>
              <CardDescription>Live view of orders being prepared</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {orders
                  .filter((order) => order.status === "preparing" || order.status === "ready")
                  .map((order) => (
                    <Card key={order.id} className="border-2 border-accent">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-2xl">{order.orderNumber}</CardTitle>
                          <Badge className="text-lg">{order.time}</Badge>
                        </div>
                        <CardDescription className="text-lg">Room {order.room}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-lg">
                          {order.items.map((item, index) => (
                            <li key={index} className="font-medium">• {item}</li>
                          ))}
                        </ul>
                        <Button className="w-full mt-4" size="lg">
                          {order.status === "preparing" ? "Mark as Ready" : "Complete Order"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Restaurant
