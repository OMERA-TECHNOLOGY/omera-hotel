import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Receipt, TrendingUp, CreditCard, Download, Plus, Search } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const Finance = () => {
  const [searchQuery, setSearchQuery] = useState("")

  const invoices = [
    {
      id: "INV-001",
      guestName: "John Smith",
      room: "204",
      amount: 8500,
      vat: 1275,
      total: 9775,
      status: "Paid",
      date: "2025-10-23",
      paymentMethod: "Cash",
    },
    {
      id: "INV-002",
      guestName: "Sarah Johnson",
      room: "315",
      amount: 12000,
      vat: 1800,
      total: 13800,
      status: "Pending",
      date: "2025-10-23",
      paymentMethod: "Pending",
    },
    {
      id: "INV-003",
      guestName: "Michael Brown",
      room: "102",
      amount: 6000,
      vat: 900,
      total: 6900,
      status: "Paid",
      date: "2025-10-22",
      paymentMethod: "Telebirr",
    },
  ]

  const expenses = [
    { id: 1, category: "Utilities", description: "Electricity Bill", amount: 15000, date: "2025-10-20" },
    { id: 2, category: "Supplies", description: "Cleaning Materials", amount: 3500, date: "2025-10-21" },
    { id: 3, category: "Maintenance", description: "AC Repair Room 305", amount: 8000, date: "2025-10-22" },
    { id: 4, category: "Food & Beverage", description: "Restaurant Supplies", amount: 25000, date: "2025-10-23" },
  ]

  const stats = [
    {
      title: "Today's Revenue",
      value: "45,320 ETB",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-primary",
    },
    {
      title: "Pending Payments",
      value: "13,800 ETB",
      change: "2 invoices",
      icon: Receipt,
      color: "text-accent",
    },
    {
      title: "Monthly Revenue",
      value: "1,245,500 ETB",
      change: "+8.3%",
      icon: TrendingUp,
      color: "text-secondary",
    },
    {
      title: "Total Expenses",
      value: "51,500 ETB",
      change: "This month",
      icon: CreditCard,
      color: "text-muted-foreground",
    },
  ]

  const getStatusColor = (status: string) => {
    return status === "Paid" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Finance & Payments</h1>
          <p className="text-muted-foreground">Manage invoices, payments, and financial reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            End of Day Report
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Generate Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Generate New Invoice</DialogTitle>
                <DialogDescription>Create an invoice for guest services</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoiceGuest">Guest Name</Label>
                    <Input id="invoiceGuest" placeholder="Select or enter guest name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoiceRoom">Room Number</Label>
                    <Input id="invoiceRoom" placeholder="Room number" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Services & Charges</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input placeholder="Description" />
                    <Input type="number" placeholder="Amount (ETB)" />
                    <Button variant="outline" size="sm">Add Line</Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subtotal">Subtotal</Label>
                    <Input id="subtotal" readOnly value="8,500 ETB" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vat">VAT (15%)</Label>
                    <Input id="vat" readOnly value="1,275 ETB" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total">Total Amount</Label>
                  <Input id="total" readOnly value="9,775 ETB" className="font-bold text-lg" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Generate & Print</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Financial Stats */}
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

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices by guest name or invoice number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Invoices</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {invoices.map((invoice) => (
              <Card key={invoice.id} className="border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{invoice.id}</CardTitle>
                      <CardDescription>
                        {invoice.guestName} • Room {invoice.room}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p className="font-medium">{invoice.date}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Subtotal</p>
                      <p className="font-medium">{invoice.amount.toLocaleString()} ETB</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">VAT (15%)</p>
                      <p className="font-medium">{invoice.vat.toLocaleString()} ETB</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total</p>
                      <p className="font-bold text-lg">{invoice.total.toLocaleString()} ETB</p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3 mr-1" />
                        Print
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Configure payment gateway integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Telebirr</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">Configure</Button>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-base">CBE Birr</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">Configure</Button>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Chapa</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">Configure</Button>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Amole</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">Configure</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                className="pl-8"
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Record New Expense</DialogTitle>
                  <DialogDescription>Add a new operational expense</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="expenseCategory">Category</Label>
                    <Select>
                      <SelectTrigger id="expenseCategory">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="supplies">Supplies</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="food">Food & Beverage</SelectItem>
                        <SelectItem value="salary">Salaries</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expenseDesc">Description</Label>
                    <Input id="expenseDesc" placeholder="Enter expense description" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expenseAmount">Amount (ETB)</Label>
                      <Input id="expenseAmount" type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expenseDate">Date</Label>
                      <Input id="expenseDate" type="date" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Expense</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {expenses.map((expense) => (
              <Card key={expense.id} className="border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">{expense.category} • {expense.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{expense.amount.toLocaleString()} ETB</p>
                      <Button variant="ghost" size="sm">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Finance
