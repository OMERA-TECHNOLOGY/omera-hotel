import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ClipboardList, CheckCircle, AlertCircle, Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const Housekeeping = () => {
  const tasks = [
    {
      id: 1,
      room: "204",
      housekeeper: "Anna Tesfaye",
      status: "pending",
      priority: "high",
      checkOut: "11:00 AM",
      tasks: ["Change linens", "Restock minibar", "Clean bathroom", "Vacuum floor"],
    },
    {
      id: 2,
      room: "315",
      housekeeper: "Marta Lemma",
      status: "in-progress",
      priority: "normal",
      checkOut: "12:00 PM",
      tasks: ["Change linens", "Restock amenities", "Clean bathroom"],
    },
    {
      id: 3,
      room: "102",
      housekeeper: "Sara Bekele",
      status: "completed",
      priority: "normal",
      checkOut: "10:00 AM",
      tasks: ["Change linens", "Restock minibar", "Clean bathroom", "Polish fixtures"],
    },
  ]

  const inventory = [
    { item: "Bath Towels", current: 145, minimum: 100, status: "good" },
    { item: "Bed Sheets", current: 85, minimum: 80, status: "good" },
    { item: "Shampoo Bottles", current: 45, minimum: 60, status: "low" },
    { item: "Soap Bars", current: 32, minimum: 50, status: "low" },
    { item: "Toilet Paper", current: 156, minimum: 100, status: "good" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-primary/10 text-primary"
      case "in-progress":
        return "bg-accent/10 text-accent"
      case "pending":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "pending":
        return <ClipboardList className="h-4 w-4" />
      default:
        return null
    }
  }

  const getPriorityColor = (priority: string) => {
    return priority === "high" ? "bg-destructive/10 text-destructive" : "bg-secondary/10 text-secondary"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Housekeeping</h1>
          <p className="text-muted-foreground">Manage cleaning tasks and room maintenance</p>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">
              {tasks.filter((t) => t.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {tasks.filter((t) => t.status === "in-progress").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {tasks.filter((t) => t.status === "completed").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {inventory.filter((i) => i.status === "low").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cleaning Tasks */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Today's Cleaning Tasks</CardTitle>
          <CardDescription>Room cleaning assignments and progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.id} className="border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Room {task.room}</CardTitle>
                      <CardDescription>{task.housekeeper}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority === "high" ? "High Priority" : "Normal"}
                      </Badge>
                      <Badge className={getStatusColor(task.status)}>
                        <span className="mr-1">{getStatusIcon(task.status)}</span>
                        {task.status.replace("-", " ").toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Guest Check-out: {task.checkOut}</span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Checklist:</p>
                      {task.tasks.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Checkbox
                            id={`task-${task.id}-${index}`}
                            defaultChecked={task.status === "completed"}
                          />
                          <label
                            htmlFor={`task-${task.id}-${index}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {item}
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2">
                      {task.status !== "completed" && (
                        <Button size="sm" variant="outline">
                          {task.status === "pending" ? "Start Cleaning" : "Mark Complete"}
                        </Button>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Report Issue
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Report Damage or Issue</DialogTitle>
                            <DialogDescription>
                              Report any damages or maintenance issues found in Room {task.room}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="issueType">Issue Type</Label>
                              <select
                                id="issueType"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                              >
                                <option>Damage</option>
                                <option>Maintenance Required</option>
                                <option>Missing Item</option>
                                <option>Other</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="issueDescription">Description</Label>
                              <Textarea
                                id="issueDescription"
                                placeholder="Describe the issue in detail..."
                                rows={4}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline">Cancel</Button>
                            <Button>Submit Report</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Inventory */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Inventory Status</CardTitle>
          <CardDescription>Current stock levels and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventory.map((item, index) => (
              <div key={index} className="flex items-center justify-between pb-3 border-b border-border last:border-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{item.item}</p>
                    {item.status === "low" && (
                      <Badge variant="destructive" className="text-xs">Low Stock</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Current: {item.current} | Minimum: {item.minimum}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        item.status === "low" ? "bg-destructive" : "bg-primary"
                      }`}
                      style={{
                        width: `${Math.min((item.current / item.minimum) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <Button variant="outline" size="sm">Restock</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Housekeeping
