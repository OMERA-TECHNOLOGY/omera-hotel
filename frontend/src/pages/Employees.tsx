import { useState } from "react";
import { BubblingPlaceholder } from "@/components/ui/bubbling-placeholder";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  Plus,
  Search,
  UserCog,
  Clock,
  Users,
  Shield,
  TrendingUp,
  Eye,
  Edit,
  Key,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { apiGet, apiPost, apiDelete, extractError } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const Employees = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLanguage();

  interface EmployeeApi {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
    department: string;
    shift?: string;
    status?: string;
    join_date?: string;
    joinDate?: string;
    name?: string;
    performance?: string;
  }

  // Fetch activity logs from backend
  const {
    data: activityLogs = [],
    isLoading: activityLoading,
    isError: activityError,
  } = useQuery({
    queryKey: ["activityLogs"],
    queryFn: async () => {
      const res = await axios.get("/api/activity", { withCredentials: true });
      return res.data.data || [];
    },
  });

  // Fetch employees list from backend (replace any mock/static employees)
  const {
    data: employeesData,
    isLoading: employeesLoading,
    isError: employeesError,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await apiGet("/employees");
      return res.data?.employees || res.employees || res.data || res;
    },
  });

  const queryClient = useQueryClient();

  // simple form state for onboarding
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    shift: "",
  });

  const createEmployee = useMutation({
    mutationFn: async (body: typeof form) => {
      return await apiPost<Record<string, unknown>>("/employees", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
      toast({
        title: "Employee onboarded",
        description: "New employee created successfully",
      });
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        role: "",
        department: "",
        shift: "",
      });
    },
    onError: (err) => {
      toast({ title: "Failed to create", description: extractError(err) });
    },
  });

  const deleteEmployee = useMutation({
    mutationFn: async (id: string) => {
      return await apiDelete(`/employees/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
      toast({ title: "Deleted", description: "Employee removed" });
    },
    onError: (err) => {
      toast({ title: "Delete failed", description: extractError(err) });
    },
  });

  // normalize employees array (support multiple shapes) and map to UI shape
  const employeesRaw: EmployeeApi[] = Array.isArray(employeesData)
    ? (employeesData as EmployeeApi[])
    : (employeesData?.employees as EmployeeApi[]) ||
      (employeesData?.data as EmployeeApi[]) ||
      [];

  const employees = employeesRaw.map((e: EmployeeApi) => ({
    id: e.id,
    name:
      `${e.first_name || e.name || ""} ${e.last_name || ""}`.trim() ||
      e.email ||
      "Unknown",
    email: e.email || "",
    phone: e.phone || "",
    role: e.role || "",
    department: e.department || "",
    shift: e.shift || "",
    performance: e.performance || "",
    joinDate: e.join_date || e.joinDate || "",
    avatar: e.first_name ? e.first_name[0] : e.name ? e.name[0] : "U",
  }));

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Executive Chef":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Manager":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Receptionist":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Housekeeper":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "Outstanding":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Excellent":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Good":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "cleaning":
        return "🧹";
      case "checkin":
        return "🏨";
      case "system":
        return "⚙️";
      case "maintenance":
        return "🔧";
      case "menu":
        return "🍽️";
      default:
        return "📝";
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Unique Header Structure */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-purple-900 to-orange-900 p-8 text-white border border-purple-500/20">
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-500/20 rounded-2xl border border-purple-400/30">
                  <Users className="h-8 w-8 text-purple-400" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-200 to-orange-200 bg-clip-text text-transparent">
                    Team Excellence
                  </h1>
                  <p className="text-purple-100 text-lg mt-2">
                    Empower your workforce with precision management and growth
                    opportunities
                  </p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <Shield className="h-6 w-6 text-emerald-400" />
                  <div>
                    <p className="text-2xl font-bold">98%</p>
                    <p className="text-xs text-purple-200">Staff Retention</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <TrendingUp className="h-6 w-6 text-orange-400" />
                  <div>
                    <p className="text-2xl font-bold">4.7</p>
                    <p className="text-xs text-purple-200">Avg. Performance</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <Clock className="h-6 w-6 text-purple-400" />
                  <div>
                    <p className="text-2xl font-bold">24/7</p>
                    <p className="text-xs text-purple-200">Shift Coverage</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 border-0 shadow-2xl rounded-2xl px-6 py-3">
                    <Plus className="h-5 w-5 mr-2" />
                    Onboard Talent
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-0 shadow-2xl rounded-3xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-2xl">
                      <div className="p-3 bg-gradient-to-r from-purple-500 to-orange-500 rounded-2xl">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div>Onboard New Team Member</div>
                        <div className="text-sm font-normal text-slate-500">
                          Create comprehensive employee profile and system
                          access
                        </div>
                      </div>
                    </DialogTitle>
                  </DialogHeader>

                  <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label
                          htmlFor="empFirstName"
                          className="text-sm font-semibold"
                        >
                          First Name
                        </Label>
                        <Input
                          id="empFirstName"
                          value={form.first_name}
                          onChange={(e) =>
                            setForm({ ...form, first_name: e.target.value })
                          }
                          placeholder="Enter first name"
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="empLastName"
                          className="text-sm font-semibold"
                        >
                          Last Name
                        </Label>
                        <Input
                          id="empLastName"
                          value={form.last_name}
                          onChange={(e) =>
                            setForm({ ...form, last_name: e.target.value })
                          }
                          placeholder="Enter last name"
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label
                          htmlFor="empEmail"
                          className="text-sm font-semibold"
                        >
                          Professional Email
                        </Label>
                        <Input
                          id="empEmail"
                          type="email"
                          value={form.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                          placeholder="team.member@Omera.com"
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="empPhone"
                          className="text-sm font-semibold"
                        >
                          Contact Number
                        </Label>
                        <Input
                          id="empPhone"
                          value={form.phone}
                          onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                          }
                          placeholder="+251 xxx xxx xxx"
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label
                          htmlFor="empRole"
                          className="text-sm font-semibold"
                        >
                          Position & Role
                        </Label>
                        <Select
                          value={form.role}
                          onValueChange={(v) =>
                            setForm({ ...form, role: String(v) })
                          }
                        >
                          <SelectTrigger
                            id="empRole"
                            className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl"
                          >
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">
                              System Administrator
                            </SelectItem>
                            <SelectItem value="manager">
                              Department Manager
                            </SelectItem>
                            <SelectItem value="receptionist">
                              Front Desk Receptionist
                            </SelectItem>
                            <SelectItem value="housekeeper">
                              Housekeeping Specialist
                            </SelectItem>
                            <SelectItem value="chef">Executive Chef</SelectItem>
                            <SelectItem value="waiter">
                              Service Professional
                            </SelectItem>
                            <SelectItem value="accountant">
                              Finance Specialist
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="empDepartment"
                          className="text-sm font-semibold"
                        >
                          Department
                        </Label>
                        <Select
                          value={form.department}
                          onValueChange={(v) =>
                            setForm({ ...form, department: String(v) })
                          }
                        >
                          <SelectTrigger
                            id="empDepartment"
                            className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl"
                          >
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="administration">
                              Executive Administration
                            </SelectItem>
                            <SelectItem value="front-desk">
                              Front Desk Operations
                            </SelectItem>
                            <SelectItem value="housekeeping">
                              Housekeeping Excellence
                            </SelectItem>
                            <SelectItem value="restaurant">
                              Culinary Operations
                            </SelectItem>
                            <SelectItem value="finance">
                              Financial Management
                            </SelectItem>
                            <SelectItem value="maintenance">
                              Facility Maintenance
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="empShift"
                        className="text-sm font-semibold"
                      >
                        Work Schedule
                      </Label>
                      <Select
                        value={form.shift}
                        onValueChange={(v) =>
                          setForm({ ...form, shift: String(v) })
                        }
                      >
                        <SelectTrigger
                          id="empShift"
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl"
                        >
                          <SelectValue placeholder="Select shift pattern" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">
                            Morning Excellence (6 AM - 2 PM)
                          </SelectItem>
                          <SelectItem value="day">
                            Day Operations (10 AM - 6 PM)
                          </SelectItem>
                          <SelectItem value="afternoon">
                            Afternoon Service (2 PM - 10 PM)
                          </SelectItem>
                          <SelectItem value="night">
                            Night Operations (10 PM - 6 AM)
                          </SelectItem>
                          <SelectItem value="split">
                            Split Shift (Peak Coverage)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      className="border-slate-300 dark:border-slate-600 rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 rounded-xl"
                      onClick={() => createEmployee.mutate(form)}
                      disabled={createEmployee.isLoading}
                    >
                      {createEmployee.isLoading
                        ? "Onboarding..."
                        : "Onboard Team Member"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Unique Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-500/5 to-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Enhanced Search & Filters */}
      <div className="flex items-center gap-4 p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search team members by name, role, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-3 text-lg border-0 bg-white dark:bg-slate-700 shadow-lg rounded-2xl"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[200px] bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-xl">
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="front-desk">Front Desk Operations</SelectItem>
            <SelectItem value="housekeeping">
              Housekeeping Excellence
            </SelectItem>
            <SelectItem value="restaurant">Culinary Operations</SelectItem>
            <SelectItem value="finance">Financial Management</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="employees" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 p-2 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <TabsTrigger
            value="employees"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700"
          >
            Team Directory
            <span className="ml-2 px-2 py-1 bg-purple-500 text-white text-xs rounded-full">
              {employees.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="shifts"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700"
          >
            Shift Coordination
            <span className="ml-2 px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
              4
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700"
          >
            Activity Intelligence
            <span className="ml-2 px-2 py-1 bg-emerald-500 text-white text-xs rounded-full">
              {activityLoading ? "..." : activityLogs.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <div className="grid gap-6">
            {employeesLoading ? (
              <BubblingPlaceholder variant="cardList" count={3} />
            ) : (
              employees.map((employee) => (
                <Card
                  key={employee.id}
                  className="relative overflow-hidden bg-white dark:bg-slate-800 shadow-2xl hover:shadow-3xl transition-all duration-500 group rounded-3xl border border-slate-200 dark:border-slate-700"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="p-3 bg-gradient-to-r from-purple-500 to-orange-500 rounded-2xl">
                            <div className="text-white font-bold text-lg">
                              {employee.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <CardTitle className="text-xl font-bold text-slate-800 dark:text-white">
                                {employee.name}
                              </CardTitle>
                              <Badge
                                className={getRoleBadgeColor(employee.role)}
                              >
                                {employee.role}
                              </Badge>
                              <Badge
                                className={getPerformanceColor(
                                  employee.performance
                                )}
                              >
                                {employee.performance}
                              </Badge>
                            </div>
                            <CardDescription className="text-slate-600 dark:text-slate-400">
                              {employee.department} • Joined {employee.joinDate}
                            </CardDescription>
                          </div>
                        </div>

                        {/* Employee Details Grid */}
                        <div className="grid grid-cols-3 gap-6 text-sm mb-4">
                          <div>
                            <p className="text-slate-500 dark:text-slate-400">
                              Professional Email
                            </p>
                            <p className="font-semibold text-slate-800 dark:text-white">
                              {employee.email}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500 dark:text-slate-400">
                              Contact Number
                            </p>
                            <p className="font-semibold text-slate-800 dark:text-white">
                              {employee.phone}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500 dark:text-slate-400">
                              Work Schedule
                            </p>
                            <p className="font-semibold text-slate-800 dark:text-white">
                              {employee.shift}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-slate-300 dark:border-slate-600"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-amber-300 dark:border-amber-600 text-amber-600 dark:text-amber-400"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-red-300 dark:border-red-600 text-red-600 dark:text-red-400"
                        onClick={() =>
                          deleteEmployee.mutate(String(employee.id))
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-orange-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl"></div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="shifts" className="space-y-4">
          <Card className="border-0 bg-white dark:bg-slate-800 shadow-2xl rounded-3xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white text-2xl">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div>Shift Coordination Center</div>
                  <CardDescription className="text-lg">
                    Optimized workforce scheduling and coverage management
                  </CardDescription>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  "Morning Excellence",
                  "Day Operations",
                  "Afternoon Service",
                  "Night Operations",
                ].map((shift) => (
                  <div
                    key={shift}
                    className="border border-slate-200 dark:border-slate-600 rounded-2xl p-6 bg-white dark:bg-slate-700/50"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <h4 className="font-bold text-lg text-slate-800 dark:text-white">
                        {shift}
                      </h4>
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                        {
                          employees.filter((emp) =>
                            emp.shift.includes(shift.split(" ")[0])
                          ).length
                        }{" "}
                        Team Members
                      </Badge>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {employees
                        .filter((emp) =>
                          emp.shift.includes(shift.split(" ")[0])
                        )
                        .map((emp) => (
                          <div
                            key={emp.id}
                            className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-600/50 rounded-xl border border-slate-200 dark:border-slate-500"
                          >
                            <div className="p-2 bg-gradient-to-r from-purple-500 to-orange-500 rounded-lg">
                              <UserCog className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-slate-800 dark:text-white">
                                {emp.name}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {emp.role}
                              </p>
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
          <Card className="border-0 bg-white dark:bg-slate-800 shadow-2xl rounded-3xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white text-2xl">
                <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div>Activity Intelligence Dashboard</div>
                  <CardDescription className="text-lg">
                    Real-time team performance and system engagement metrics
                  </CardDescription>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activityLoading ? (
                <BubblingPlaceholder variant="list" count={4} />
              ) : activityError ? (
                <div className="text-center py-8 text-lg text-red-500">
                  Failed to load activity logs.
                </div>
              ) : (
                <div className="space-y-4">
                  {activityLogs.length === 0 ? (
                    <div className="text-center py-8 text-lg text-slate-500">
                      No activity logs found.
                    </div>
                  ) : (
                    activityLogs.map((log, index) => (
                      <div
                        key={log.id || index}
                        className="flex items-start gap-4 p-4 bg-white dark:bg-slate-700/50 rounded-2xl border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="text-2xl">
                          {getActivityIcon(
                            log.type ||
                              log.action_english
                                ?.toLowerCase()
                                .includes("clean")
                              ? "cleaning"
                              : "system"
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="font-semibold text-slate-800 dark:text-white">
                              {log.employees
                                ? `${log.employees.first_name} ${log.employees.last_name}`
                                : log.guest || "Unknown"}
                            </p>
                            <Badge
                              variant="outline"
                              className="border-slate-300 dark:border-slate-600 text-xs"
                            >
                              {log.room || log.type || "activity"}
                            </Badge>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 mb-2">
                            {log.action_english}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(log.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Employees;
