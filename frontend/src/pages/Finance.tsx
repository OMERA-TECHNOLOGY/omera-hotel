import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGet, extractError } from "@/lib/api";
import { BubblingPlaceholder } from "@/components/ui/bubbling-placeholder";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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

// API types
interface InvoiceApi {
  id: string;
  guest_name?: string;
  room?: string;
  subtotal_birr: number;
  vat_amount_birr: number;
  total_amount_birr: number;
  payment_status: string;
  invoice_date: string;
  payment_method?: string;
  due_date?: string;
  priority?: string;
}

interface ExpenseApi {
  id: string;
  category: string;
  description: string;
  amount_birr: number;
  expense_date: string;
  status: string;
  type?: string;
}

const Finance = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLanguage();

  // Fetch invoices and expenses from backend
  const {
    data: invoicesData,
    isLoading: invoicesLoading,
    isError: invoicesError,
    error: invoicesErrorObj,
  } = useQuery({
    queryKey: ["invoices"],
    queryFn: () => apiGet<{ invoices: InvoiceApi[] }>("/api/finance/invoices"),
  });

  const {
    data: expensesData,
    isLoading: expensesLoading,
    isError: expensesError,
    error: expensesErrorObj,
  } = useQuery({
    queryKey: ["expenses"],
    queryFn: () => apiGet<{ expenses: ExpenseApi[] }>("/api/finance/expenses"),
  });

  const invoices = invoicesData?.invoices || [];
  const expenses = expensesData?.expenses || [];

  // derive summary stats from invoices/expenses when available
  const totalInvoiceAmount = invoices.reduce(
    (s, inv) => s + (inv.total_amount_birr || 0),
    0
  );
  const pendingPaymentsCount = invoices.filter(
    (inv) => (inv.payment_status || "").toLowerCase() !== "paid"
  ).length;
  const totalExpenses = expenses.reduce((s, e) => s + (e.amount_birr || 0), 0);

  const stats = [
    {
      title: "Today's Revenue",
      value: `${totalInvoiceAmount.toLocaleString()} ETB`,
      change: "+0%",
      icon: DollarSign,
      gradient: "from-emerald-500 to-green-500",
      trend: "up",
    },
    {
      title: "Pending Payments",
      value: `${pendingPaymentsCount} invoices`,
      change: "",
      icon: Receipt,
      color: "text-amber-500",
      gradient: "from-amber-500 to-yellow-500",
      trend: "pending",
    },
    {
      title: "Monthly Revenue",
      value: `${totalInvoiceAmount.toLocaleString()} ETB`,
      change: "+0%",
      icon: TrendingUp,
      color: "text-blue-500",
      gradient: "from-blue-500 to-cyan-500",
      trend: "up",
    },
    {
      title: "Monthly Expenses",
      value: `${totalExpenses.toLocaleString()} ETB`,
      change: "",
      icon: CreditCard,
      color: "text-orange-500",
      gradient: "from-orange-500 to-red-500",
      trend: "down",
    },
  ];

  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "completed":
      case "active":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "pending":
      case "processing":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "failed":
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  // Fetch data using React Query (commented out for now, using mock data)
  // const { data: invoicesData, isLoading: invoicesLoading } = useQuery({
  //   queryKey: ['invoices'],
  //   queryFn: () => apiGet('/api/finance/invoices')
  // });

  // const { data: expensesData, isLoading: expensesLoading } = useQuery({
  //   queryKey: ['expenses'],
  //   queryFn: () => apiGet('/api/finance/expenses')
  // });

  return (
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-purple-900 to-blue-900 p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Finance Dashboard
              </h1>
              <p className="mt-2 text-blue-200">
                Manage invoices, payments, and expenses in real-time
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="p-2 bg-white/20 rounded-xl">
                <BarChart3 className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold">Financial Overview</p>
                <p className="text-xs text-blue-200">All systems optimal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/20 to-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Enhanced Financial Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
            className="relative overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-xl hover:shadow-2xl transition-all duration-500 group rounded-3xl"
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
              {invoicesLoading ? "..." : invoices.length}
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
              {expensesLoading ? "..." : expenses.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          {invoicesLoading ? (
            <div className="p-6">
              <BubblingPlaceholder variant="cardList" count={3} />
            </div>
          ) : invoicesError ? (
            <div className="p-8 text-center text-lg text-red-500">
              {extractError(invoicesErrorObj)}
            </div>
          ) : (
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
                              {(invoice.guest_name || "?")
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
                              <Badge
                                className={getStatusColor(
                                  invoice.payment_status
                                )}
                              >
                                {invoice.payment_status}
                              </Badge>
                            </div>
                            <CardDescription className="text-slate-600 dark:text-slate-400">
                              {invoice.guest_name} • {invoice.room} • Due:{" "}
                              {invoice.due_date}
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
                              {invoice.invoice_date}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500 dark:text-slate-400">
                              Subtotal
                            </p>
                            <p className="font-semibold text-slate-800 dark:text-white">
                              {invoice.subtotal_birr?.toLocaleString?.() ??
                                invoice.subtotal_birr}{" "}
                              ETB
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500 dark:text-slate-400">
                              VAT (15%)
                            </p>
                            <p className="font-semibold text-slate-800 dark:text-white">
                              {invoice.vat_amount_birr?.toLocaleString?.() ??
                                invoice.vat_amount_birr}{" "}
                              ETB
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500 dark:text-slate-400">
                              Payment Method
                            </p>
                            <p className="font-semibold text-slate-800 dark:text-white">
                              {invoice.payment_method}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500 dark:text-slate-400">
                              Total Amount
                            </p>
                            <p className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">
                              {invoice.total_amount_birr?.toLocaleString?.() ??
                                invoice.total_amount_birr}{" "}
                              ETB
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
                          onClick={() =>
                            console.log("View details:", invoice.id)
                          }
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
          )}
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
          {expensesLoading ? (
            <div className="p-6">
              <BubblingPlaceholder variant="list" count={4} />
            </div>
          ) : expensesError ? (
            <div className="p-8 text-center text-lg text-red-500">
              {extractError(expensesErrorObj)}
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    placeholder="Search expense records..."
                    className="pl-12 pr-4 py-3 border-0 bg-white dark:bg-slate-700 shadow-lg rounded-2xl"
                  />
                </div>
                {/* ...existing code for dialog... */}
              </div>
              <div className="grid gap-6">
                {expenses.map((expense) => (
                  <Card
                    key={expense.id}
                    className="bg-white dark:bg-slate-800 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl border border-slate-200 dark:border-slate-700"
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
                            {expense.category} • {expense.type} •{" "}
                            {expense.expense_date}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                            {expense.amount_birr?.toLocaleString?.() ??
                              expense.amount_birr}{" "}
                            ETB
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
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finance;
