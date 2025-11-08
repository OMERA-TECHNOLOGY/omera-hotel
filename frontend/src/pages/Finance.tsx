import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  Receipt,
  TrendingUp,
  CreditCard,
  Download,
  Plus,
  Search,
  Zap,
  Crown,
  Shield,
  BarChart3,
  Calculator,
  FileText,
  Banknote,
  Wallet,
  PieChart,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Finance = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLanguage();

  const invoices = [
    {
      id: "INV-001",
      guestName: "John Smith",
      room: "204 • Premium Suite",
      amount: 24500,
      vat: 3675,
      total: 28175,
      status: "Paid",
      date: "2025-10-23",
      paymentMethod: "Cash",
      dueDate: "2025-10-23",
      priority: "vip",
    },
    {
      id: "INV-002",
      guestName: "Sarah Johnson",
      room: "315 • Deluxe Room",
      amount: 42000,
      vat: 6300,
      total: 48300,
      status: "Pending",
      date: "2025-10-23",
      paymentMethod: "Telebirr",
      dueDate: "2025-10-25",
      priority: "premium",
    },
    {
      id: "INV-003",
      guestName: "Michael Brown",
      room: "102 • Business Suite",
      amount: 18000,
      vat: 2700,
      total: 20700,
      status: "Paid",
      date: "2025-10-22",
      paymentMethod: "Bank Transfer",
      dueDate: "2025-10-22",
      priority: "standard",
    },
  ];

  const expenses = [
    {
      id: 1,
      category: "Utilities",
      description: "Electricity & Water Bill",
      amount: 15000,
      date: "2025-10-20",
      status: "Processed",
      type: "recurring",
    },
    {
      id: 2,
      category: "Supplies",
      description: "Premium Cleaning Materials",
      amount: 8500,
      date: "2025-10-21",
      status: "Processed",
      type: "operational",
    },
    {
      id: 3,
      category: "Maintenance",
      description: "AC System Repair - Room 305",
      amount: 12000,
      date: "2025-10-22",
      status: "Pending",
      type: "repair",
    },
    {
      id: 4,
      category: "Food & Beverage",
      description: "Restaurant & Bar Supplies",
      amount: 32500,
      date: "2025-10-23",
      status: "Processed",
      type: "inventory",
    },
  ];

  const stats = [
    {
      title: "Today's Revenue",
      value: "45,320 ETB",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-emerald-500",
      gradient: "from-emerald-500 to-green-500",
      trend: "up",
    },
    {
      title: "Pending Payments",
      value: "48,300 ETB",
      change: "3 invoices",
      icon: Receipt,
      color: "text-amber-500",
      gradient: "from-amber-500 to-yellow-500",
      trend: "pending",
    },
    {
      title: "Monthly Revenue",
      value: "1,245,500 ETB",
      change: "+8.3%",
      icon: TrendingUp,
      color: "text-blue-500",
      gradient: "from-blue-500 to-cyan-500",
      trend: "up",
    },
    {
      title: "Monthly Expenses",
      value: "351,500 ETB",
      change: "-2.1%",
      icon: CreditCard,
      color: "text-orange-500",
      gradient: "from-orange-500 to-red-500",
      trend: "down",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Processed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusGradient = (status: string) => {
    switch (status) {
      case "Paid":
        return "from-emerald-500 to-green-500";
      case "Pending":
        return "from-amber-500 to-yellow-500";
      case "Processed":
        return "from-blue-500 to-cyan-500";
      default:
        return "from-slate-500 to-slate-600";
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Unique Header Structure */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-blue-900 to-emerald-900 p-8 text-white border border-emerald-500/20">
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-400/30">
                  <Calculator className="h-8 w-8 text-emerald-400" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-200 to-cyan-200 bg-clip-text text-transparent">
                    Financial Management
                  </h1>
                  <p className="text-emerald-100 text-lg mt-2">
                    Master your hotel's financial performance with precision
                    analytics
                  </p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <BarChart3 className="h-6 w-6 text-cyan-400" />
                  <div>
                    <p className="text-2xl font-bold">78%</p>
                    <p className="text-xs text-emerald-200">Profit Margin</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <Shield className="h-6 w-6 text-emerald-400" />
                  <div>
                    <p className="text-2xl font-bold">94%</p>
                    <p className="text-xs text-emerald-200">Collections Rate</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <PieChart className="h-6 w-6 text-blue-400" />
                  <div>
                    <p className="text-2xl font-bold">12.5M</p>
                    <p className="text-xs text-emerald-200">
                      Quarterly Revenue
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 border-0 shadow-2xl rounded-2xl px-6 py-3">
                    <Plus className="h-5 w-5 mr-2" />
                    Generate Invoice
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-0 shadow-2xl rounded-3xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-2xl">
                      <div className="p-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div>Create Professional Invoice</div>
                        <div className="text-sm font-normal text-slate-500">
                          Generate detailed invoice for guest services
                        </div>
                      </div>
                    </DialogTitle>
                  </DialogHeader>

                  <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label
                          htmlFor="invoiceGuest"
                          className="text-sm font-semibold"
                        >
                          Guest Information
                        </Label>
                        <Input
                          id="invoiceGuest"
                          placeholder="Select or enter guest name"
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="invoiceRoom"
                          className="text-sm font-semibold"
                        >
                          Room Details
                        </Label>
                        <Input
                          id="invoiceRoom"
                          placeholder="Room number and type"
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">
                        Services & Charges
                      </Label>
                      <div className="grid grid-cols-4 gap-3">
                        <Input
                          placeholder="Service description"
                          className="rounded-xl"
                        />
                        <Input
                          type="number"
                          placeholder="Quantity"
                          className="rounded-xl"
                        />
                        <Input
                          type="number"
                          placeholder="Unit Price (ETB)"
                          className="rounded-xl"
                        />
                        <Button
                          variant="outline"
                          className="rounded-xl border-slate-300 dark:border-slate-600"
                        >
                          Add Line
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                      <div className="space-y-2">
                        <Label
                          htmlFor="subtotal"
                          className="text-sm font-semibold"
                        >
                          Subtotal
                        </Label>
                        <Input
                          id="subtotal"
                          readOnly
                          value="24,500 ETB"
                          className="bg-white dark:bg-slate-700 rounded-xl font-semibold"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vat" className="text-sm font-semibold">
                          VAT (15%)
                        </Label>
                        <Input
                          id="vat"
                          readOnly
                          value="3,675 ETB"
                          className="bg-white dark:bg-slate-700 rounded-xl font-semibold"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="total"
                          className="text-sm font-semibold"
                        >
                          Total Amount
                        </Label>
                        <Input
                          id="total"
                          readOnly
                          value="28,175 ETB"
                          className="bg-white dark:bg-slate-700 rounded-xl font-bold text-lg text-emerald-600 dark:text-emerald-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      className="border-slate-300 dark:border-slate-600 rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-xl">
                      Generate & Print
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Unique Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Enhanced Financial Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
            className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-xl hover:shadow-2xl transition-all duration-500 group rounded-3xl"
          >
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
                    stat.trend === "up"
                      ? "bg-emerald-500"
                      : stat.trend === "down"
                      ? "bg-red-500"
                      : "bg-amber-500"
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

      {/* Enhanced Search & Filters */}
      <div className="flex items-center gap-4 p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search financial records by invoice number, guest name, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-3 text-lg border-0 bg-white dark:bg-slate-700 shadow-lg rounded-2xl"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[200px] bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-xl">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Records</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processed">Processed</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <Tabs defaultValue="invoices" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 p-2 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <TabsTrigger
            value="invoices"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700"
          >
            Invoices
            <span className="ml-2 px-2 py-1 bg-emerald-500 text-white text-xs rounded-full">
              {invoices.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="payments"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700"
          >
            Payment Gateways
            <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
              4
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="expenses"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700"
          >
            Expense Tracking
            <span className="ml-2 px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
              {expenses.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          <div className="grid gap-6">
            {invoices.map((invoice) => (
              <Card
                key={invoice.id}
                className="relative overflow-hidden border-0 bg-white dark:bg-slate-800 shadow-2xl hover:shadow-3xl transition-all duration-500 group rounded-3xl border border-slate-200 dark:border-slate-700"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div
                          className={`p-3 rounded-2xl ${
                            invoice.priority === "vip"
                              ? "bg-gradient-to-r from-amber-500 to-orange-500"
                              : invoice.priority === "premium"
                              ? "bg-gradient-to-r from-emerald-500 to-green-500"
                              : "bg-gradient-to-r from-slate-500 to-slate-600"
                          }`}
                        >
                          <div className="text-white font-bold text-lg">
                            {invoice.guestName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl font-bold text-slate-800 dark:text-white">
                              {invoice.id}
                            </CardTitle>
                            {invoice.priority === "vip" && (
                              <Crown className="h-5 w-5 text-amber-500" />
                            )}
                            <Badge className={getStatusColor(invoice.status)}>
                              {invoice.status}
                            </Badge>
                          </div>
                          <CardDescription className="text-slate-600 dark:text-slate-400">
                            {invoice.guestName} • {invoice.room} • Due:{" "}
                            {invoice.dueDate}
                          </CardDescription>
                        </div>
                      </div>

                      {/* Invoice Details Grid */}
                      <div className="grid grid-cols-5 gap-6 text-sm">
                        <div>
                          <p className="text-slate-500 dark:text-slate-400">
                            Issue Date
                          </p>
                          <p className="font-semibold text-slate-800 dark:text-white">
                            {invoice.date}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-slate-400">
                            Subtotal
                          </p>
                          <p className="font-semibold text-slate-800 dark:text-white">
                            {invoice.amount.toLocaleString()} ETB
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-slate-400">
                            VAT (15%)
                          </p>
                          <p className="font-semibold text-slate-800 dark:text-white">
                            {invoice.vat.toLocaleString()} ETB
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-slate-400">
                            Payment Method
                          </p>
                          <p className="font-semibold text-slate-800 dark:text-white">
                            {invoice.paymentMethod}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-slate-400">
                            Total Amount
                          </p>
                          <p className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">
                            {invoice.total.toLocaleString()} ETB
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - Two buttons on the right side */}
                    <div className="flex flex-col gap-3 ml-6">
                      <Button
                        variant="outline"
                        className="border-emerald-300 dark:border-emerald-600 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all cursor-pointer"
                        onClick={() =>
                          console.log("Print invoice:", invoice.id)
                        }
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Print
                      </Button>
                      <Button
                        variant="outline"
                        className="border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all cursor-pointer"
                        onClick={() => console.log("View details:", invoice.id)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card className="border-0 bg-white dark:bg-slate-800 shadow-2xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white">
                <div className="p-3 bg-blue-500 rounded-2xl">
                  <Banknote className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div>Payment Gateway Integration</div>
                  <CardDescription>
                    Configure and manage digital payment methods
                  </CardDescription>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-0 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-slate-800 shadow-lg rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-emerald-500" />
                      Telebirr
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 mb-3">
                      Active
                    </Badge>
                    <Button className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600">
                      Configure Gateway
                    </Button>
                  </CardContent>
                </Card>
                <Card className="border-0 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-800 shadow-lg rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-500" />
                      CBE Birr
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 mb-3">
                      Active
                    </Badge>
                    <Button className="w-full rounded-xl bg-blue-500 hover:bg-blue-600">
                      Configure Gateway
                    </Button>
                  </CardContent>
                </Card>
                <Card className="border-0 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-slate-800 shadow-lg rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Zap className="h-5 w-5 text-purple-500" />
                      Chapa
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200 mb-3">
                      Available
                    </Badge>
                    <Button
                      variant="outline"
                      className="w-full rounded-xl border-purple-300 dark:border-purple-600"
                    >
                      Setup Required
                    </Button>
                  </CardContent>
                </Card>
                <Card className="border-0 bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-slate-800 shadow-lg rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-orange-500" />
                      Amole
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className="bg-orange-100 text-orange-800 border-orange-200 mb-3">
                      Available
                    </Badge>
                    <Button
                      variant="outline"
                      className="w-full rounded-xl border-orange-300 dark:border-orange-600"
                    >
                      Setup Required
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search expense records..."
                className="pl-12 pr-4 py-3 border-0 bg-white dark:bg-slate-700 shadow-lg rounded-2xl"
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 border-0 shadow-2xl rounded-2xl">
                  <Plus className="h-5 w-5 mr-2" />
                  Record Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-0 shadow-2xl rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl">
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                    Record Operational Expense
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="space-y-3">
                    <Label
                      htmlFor="expenseCategory"
                      className="text-sm font-semibold"
                    >
                      Expense Category
                    </Label>
                    <Select>
                      <SelectTrigger
                        id="expenseCategory"
                        className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl"
                      >
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
                  <div className="space-y-3">
                    <Label
                      htmlFor="expenseDesc"
                      className="text-sm font-semibold"
                    >
                      Expense Description
                    </Label>
                    <Input
                      id="expenseDesc"
                      placeholder="Enter detailed expense description"
                      className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="expenseAmount"
                        className="text-sm font-semibold"
                      >
                        Amount (ETB)
                      </Label>
                      <Input
                        id="expenseAmount"
                        type="number"
                        placeholder="0.00"
                        className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="expenseDate"
                        className="text-sm font-semibold"
                      >
                        Date Incurred
                      </Label>
                      <Input
                        id="expenseDate"
                        type="date"
                        className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    className="border-slate-300 dark:border-slate-600 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl">
                    Save Expense
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6">
            {expenses.map((expense) => (
              <Card
                key={expense.id}
                className="border-0 bg-white dark:bg-slate-800 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl border border-slate-200 dark:border-slate-700"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <p className="font-semibold text-slate-800 dark:text-white text-lg">
                          {expense.description}
                        </p>
                        <Badge className={getStatusColor(expense.status)}>
                          {expense.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {expense.category} • {expense.type} • {expense.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {expense.amount.toLocaleString()} ETB
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finance;
