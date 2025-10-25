import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Search, UserCog, Clock } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Employees = () => {
  const [searchQuery, setSearchQuery] = useState("")

  const employees = [
    {
      id: 1,
      name: "Anna Tesfaye",
      email: "anna.t@kerayu.com",
      phone: "+251 91 234 5678",
      role: "Housekeeper",
      department: "Housekeeping",
      shift: "Morning (6 AM - 2 PM)",
      status: "Active",
    },
    {
      id: 2,
      name: "Dawit Assefa",
      email: "dawit.a@kerayu.com",
      phone: "+251 91 345 6789",
      role: "Receptionist",
      department: "Front Desk",
      shift: "Day (10 AM - 6 PM)",
      status: "Active",
    },
    {
      id: 3,
      name: "Marta Lemma",
      email: "marta.l@kerayu.com",
      phone: "+251 91 456 7890",
      role: "Housekeeper",
      department: "Housekeeping",
      shift: "Afternoon (2 PM - 10 PM)",
      status: "Active",
    },
    {
      id: 4,
      name: "Yonas Bekele",
      email: "yonas.b@kerayu.com",
      phone: "+251 91 567 8901",
      role: "Chef",
      department: "Restaurant",
      shift: "Split (7 AM - 3 PM, 6 PM - 10 PM)",
      status: "Active",
    },
  ]

  const activityLogs = [
    { user: "Anna Tesfaye", action: "Completed cleaning Room 204", time: "10 mins ago" },
    { user: "Dawit Assefa", action: "Checked in guest John Smith to Room 315", time: "25 mins ago" },
    { user: "Admin", action: "Generated end-of-day financial report", time: "1 hour ago" },
    { user: "Marta Lemma", action: "Reported maintenance issue in Room 402", time: "2 hours ago" },
    { user: "Yonas Bekele", action: "Updated restaurant menu items", time: "3 hours ago" },
  ]

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-destructive/10 text-destructive"
      case "Manager":
        return "bg-secondary/10 text-secondary"
      case "Receptionist":
        return "bg-primary/10 text-primary"
      default:
        return "bg-accent/10 text-accent"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employee Management</h1>
          <p className="text-muted-foreground">Manage staff, roles, and work schedules</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>Create a new employee account and assign role</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="empFirstName">First Name</Label>
                  <Input id="empFirstName" placeholder="Enter first name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empLastName">Last Name</Label>
                  <Input id="empLastName" placeholder="Enter last name" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="empEmail">Email</Label>
                  <Input id="empEmail" type="email" placeholder="employee@kerayu.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empPhone">Phone</Label>
                  <Input id="empPhone" placeholder="+251 xxx xxx xxx" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="empRole">Role</Label>
                  <Select>
                    <SelectTrigger id="empRole">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="receptionist">Receptionist</SelectItem>
                      <SelectItem value="housekeeper">Housekeeper</SelectItem>
                      <SelectItem value="chef">Chef</SelectItem>
                      <SelectItem value="waiter">Waiter/Waitress</SelectItem>
                      <SelectItem value="accountant">Accountant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empDepartment">Department</Label>
                  <Select>
                    <SelectTrigger id="empDepartment">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="administration">Administration</SelectItem>
                      <SelectItem value="front-desk">Front Desk</SelectItem>
                      <SelectItem value="housekeeping">Housekeeping</SelectItem>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="empShift">Work Shift</Label>
                <Select>
                  <SelectTrigger id="empShift">
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (6 AM - 2 PM)</SelectItem>
                    <SelectItem value="day">Day (10 AM - 6 PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (2 PM - 10 PM)</SelectItem>
                    <SelectItem value="night">Night (10 PM - 6 AM)</SelectItem>
                    <SelectItem value="split">Split Shift</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Add Employee</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList>
          <TabsTrigger value="employees">All Employees</TabsTrigger>
          <TabsTrigger value="shifts">Shift Management</TabsTrigger>
          <TabsTrigger value="activity">Activity Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees by name, role, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="front-desk">Front Desk</SelectItem>
                <SelectItem value="housekeeping">Housekeeping</SelectItem>
                <SelectItem value="restaurant">Restaurant</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {employees.map((employee) => (
              <Card key={employee.id} className="border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{employee.name}</CardTitle>
                      <CardDescription>{employee.department}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRoleBadgeColor(employee.role)}>{employee.role}</Badge>
                      <Badge className="bg-primary/10 text-primary">{employee.status}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium">{employee.email}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">{employee.phone}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Shift</p>
                      <p className="font-medium">{employee.shift}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <UserCog className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">Reset Password</Button>
                    <Button variant="outline" size="sm">View Activity</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shifts" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <CardTitle>Shift Schedule</CardTitle>
              </div>
              <CardDescription>Current week shift assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Morning", "Day", "Afternoon", "Night"].map((shift) => (
                  <div key={shift} className="border border-border rounded-lg p-4">
                    <h4 className="font-semibold mb-3">{shift} Shift</h4>
                    <div className="grid md:grid-cols-3 gap-2">
                      {employees
                        .filter((emp) => emp.shift.includes(shift))
                        .map((emp) => (
                          <div key={emp.id} className="flex items-center gap-2 p-2 bg-accent/5 rounded">
                            <UserCog className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{emp.name}</p>
                              <p className="text-xs text-muted-foreground">{emp.role}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
              <CardDescription>Recent employee actions and system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityLogs.map((log, index) => (
                  <div key={index} className="flex items-start justify-between pb-3 border-b border-border last:border-0">
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">{log.user}</span> {log.action}
                      </p>
                      <p className="text-xs text-muted-foreground">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Employees
