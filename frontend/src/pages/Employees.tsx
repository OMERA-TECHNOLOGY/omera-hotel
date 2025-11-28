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
  MoreVertical,
  Phone,
  Mail,
  Calendar,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
        title: t.employeeOnboardedTitle,
        description: t.employeeOnboardedDesc,
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
      toast({ title: t.failedToCreateTitle, description: extractError(err) });
    },
  });

  const deleteEmployee = useMutation({
    mutationFn: async (id: string) => {
      return await apiDelete(`/employees/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
      toast({
        title: t.employeeDeletedTitle,
        description: t.employeeDeletedDesc,
      });
    },
    onError: (err) => {
      toast({ title: t.deleteFailedTitle, description: extractError(err) });
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
    <div className="space-y-6 p-4 sm:p-6">
      {/* Mobile-Optimized Header */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-800 via-purple-900 to-orange-900 p-4 sm:p-6 md:p-8 text-white border border-purple-500/20">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div className="p-2 sm:p-3 bg-purple-500/20 rounded-xl sm:rounded-2xl border border-purple-400/30 flex-shrink-0">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-200 to-orange-200 bg-clip-text text-transparent">
                    {t.employeesTitle}
                  </h1>
                  <p className="text-purple-100 text-sm sm:text-base md:text-lg mt-1 sm:mt-2">
                    {t.employeesSubtitle}
                  </p>
                </div>
              </div>

              {/* Mobile Stats Row */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:flex lg:items-center mt-4 sm:mt-6">
                <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-white/20">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold">
                      98%
                    </p>
                    <p className="text-xs text-purple-200 truncate">
                      {t.statsStaffRetention}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-white/20">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold">
                      4.7
                    </p>
                    <p className="text-xs text-purple-200 truncate">
                      {t.statsAvgPerformance}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-white/20">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold">
                      24/7
                    </p>
                    <p className="text-xs text-purple-200 truncate">
                      {t.statsShiftCoverage}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:text-right lg:self-start">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full lg:w-auto bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 border-0 shadow-xl lg:shadow-2xl rounded-xl lg:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base">
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    {t.onboardTalent}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] sm:max-w-4xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-0 shadow-2xl rounded-xl sm:rounded-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader className="sticky top-0 bg-inherit z-10 pb-4 border-b border-slate-200 dark:border-slate-700">
                    <DialogTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-2xl">
                      <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl sm:rounded-2xl">
                        <Users className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div>
                        <div>{t.onboardNewMember}</div>
                        <div className="text-xs sm:text-sm font-normal text-slate-500">
                          {t.onboardNewMemberDesc}
                        </div>
                      </div>
                    </DialogTitle>
                  </DialogHeader>

                  <div className="grid gap-4 sm:gap-6 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2 sm:space-y-3">
                        <Label
                          htmlFor="empFirstName"
                          className="text-xs sm:text-sm font-semibold"
                        >
                          {t.firstName}
                        </Label>
                        <Input
                          id="empFirstName"
                          value={form.first_name}
                          onChange={(e) =>
                            setForm({ ...form, first_name: e.target.value })
                          }
                          placeholder={t.firstNamePlaceholder}
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                        />
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        <Label
                          htmlFor="empLastName"
                          className="text-xs sm:text-sm font-semibold"
                        >
                          {t.lastName}
                        </Label>
                        <Input
                          id="empLastName"
                          value={form.last_name}
                          onChange={(e) =>
                            setForm({ ...form, last_name: e.target.value })
                          }
                          placeholder={t.lastNamePlaceholder}
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2 sm:space-y-3">
                        <Label
                          htmlFor="empEmail"
                          className="text-xs sm:text-sm font-semibold"
                        >
                          {t.professionalEmail}
                        </Label>
                        <Input
                          id="empEmail"
                          type="email"
                          value={form.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                          placeholder={t.emailPlaceholder}
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                        />
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        <Label
                          htmlFor="empPhone"
                          className="text-xs sm:text-sm font-semibold"
                        >
                          {t.contactNumber}
                        </Label>
                        <Input
                          id="empPhone"
                          value={form.phone}
                          onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                          }
                          placeholder={t.phonePlaceholder}
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2 sm:space-y-3">
                        <Label
                          htmlFor="empRole"
                          className="text-xs sm:text-sm font-semibold"
                        >
                          {t.positionRole}
                        </Label>
                        <Select
                          value={form.role}
                          onValueChange={(v) =>
                            setForm({ ...form, role: String(v) })
                          }
                        >
                          <SelectTrigger
                            id="empRole"
                            className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                          >
                            <SelectValue
                              placeholder={t.selectPositionPlaceholder}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">
                              {t.roleSystemAdmin}
                            </SelectItem>
                            <SelectItem value="manager">
                              {t.roleManager}
                            </SelectItem>
                            <SelectItem value="receptionist">
                              {t.roleReceptionist}
                            </SelectItem>
                            <SelectItem value="housekeeper">
                              {t.roleHousekeeper}
                            </SelectItem>
                            <SelectItem value="chef">{t.roleChef}</SelectItem>
                            <SelectItem value="waiter">
                              {t.roleWaiter}
                            </SelectItem>
                            <SelectItem value="accountant">
                              {t.roleAccountant}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        <Label
                          htmlFor="empDepartment"
                          className="text-xs sm:text-sm font-semibold"
                        >
                          {t.departmentLabel}
                        </Label>
                        <Select
                          value={form.department}
                          onValueChange={(v) =>
                            setForm({ ...form, department: String(v) })
                          }
                        >
                          <SelectTrigger
                            id="empDepartment"
                            className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                          >
                            <SelectValue
                              placeholder={t.selectDepartmentPlaceholder}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="administration">
                              {t.deptExecutiveAdministration}
                            </SelectItem>
                            <SelectItem value="front-desk">
                              {t.deptFrontDesk}
                            </SelectItem>
                            <SelectItem value="housekeeping">
                              {t.deptHousekeeping}
                            </SelectItem>
                            <SelectItem value="restaurant">
                              {t.deptRestaurant}
                            </SelectItem>
                            <SelectItem value="finance">
                              {t.deptFinance}
                            </SelectItem>
                            <SelectItem value="maintenance">
                              {t.deptMaintenance}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <Label
                        htmlFor="empShift"
                        className="text-xs sm:text-sm font-semibold"
                      >
                        {t.workSchedule}
                      </Label>
                      <Select
                        value={form.shift}
                        onValueChange={(v) =>
                          setForm({ ...form, shift: String(v) })
                        }
                      >
                        <SelectTrigger
                          id="empShift"
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                        >
                          <SelectValue placeholder={t.selectShiftPlaceholder} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">
                            {t.shiftMorning}
                          </SelectItem>
                          <SelectItem value="day">{t.shiftDay}</SelectItem>
                          <SelectItem value="afternoon">
                            {t.shiftAfternoon}
                          </SelectItem>
                          <SelectItem value="night">{t.shiftNight}</SelectItem>
                          <SelectItem value="split">{t.shiftSplit}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 sticky bottom-0 bg-inherit pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Button
                      variant="outline"
                      className="border-slate-300 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base order-2 sm:order-1"
                    >
                      {t.cancel}
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 rounded-lg sm:rounded-xl text-sm sm:text-base order-1 sm:order-2"
                      onClick={() => createEmployee.mutate(form)}
                      disabled={createEmployee.isLoading}
                    >
                      {createEmployee.isLoading
                        ? t.onboardingInProgress
                        : t.onboardTeamMember}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-500/5 to-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Mobile-Optimized Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-slate-200 dark:border-slate-700">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
          <Input
            placeholder={t.searchEmployeesPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border-0 bg-white dark:bg-slate-700 shadow-lg rounded-xl"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[200px] bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-xl text-sm sm:text-base">
            <SelectValue placeholder={t.filterByDepartmentPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.filterAllDepartments}</SelectItem>
            <SelectItem value="front-desk">{t.deptFrontDesk}</SelectItem>
            <SelectItem value="housekeeping">{t.deptHousekeeping}</SelectItem>
            <SelectItem value="restaurant">{t.deptRestaurant}</SelectItem>
            <SelectItem value="finance">{t.deptFinance}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mobile-Optimized Tabs */}
      <Tabs defaultValue="employees" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3 p-1 sm:p-2 bg-slate-100 dark:bg-slate-800 rounded-xl sm:rounded-2xl">
          <TabsTrigger
            value="employees"
            className="rounded-lg sm:rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700 text-xs sm:text-sm"
          >
            <span className="truncate">{t.tabDirectory}</span>
            <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-purple-500 text-white text-xs rounded-full">
              {employees.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="shifts"
            className="rounded-lg sm:rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700 text-xs sm:text-sm"
          >
            <span className="truncate">{t.tabShifts}</span>
            <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-orange-500 text-white text-xs rounded-full">
              4
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="rounded-lg sm:rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700 text-xs sm:text-sm"
          >
            <span className="truncate">{t.tabActivity}</span>
            <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-emerald-500 text-white text-xs rounded-full">
              {activityLoading ? "..." : activityLogs.length}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Mobile-Optimized Employees List */}
        <TabsContent value="employees" className="space-y-3 sm:space-y-4">
          <div className="grid gap-3 sm:gap-6">
            {employeesLoading ? (
              <BubblingPlaceholder variant="cardList" count={3} />
            ) : (
              employees.map((employee) => (
                <Card
                  key={employee.id}
                  className="relative overflow-hidden bg-white dark:bg-slate-800 shadow-lg sm:shadow-xl hover:shadow-xl sm:hover:shadow-3xl transition-all duration-300 group rounded-xl sm:rounded-3xl border border-slate-200 dark:border-slate-700"
                >
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 sm:gap-4 mb-2 sm:mb-3">
                          <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl sm:rounded-2xl flex-shrink-0">
                            <div className="text-white font-bold text-sm sm:text-lg">
                              {employee.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2 flex-wrap">
                              <CardTitle className="text-base sm:text-lg md:text-xl font-bold text-slate-800 dark:text-white truncate">
                                {employee.name}
                              </CardTitle>
                              <Badge
                                className={`${getRoleBadgeColor(
                                  employee.role
                                )} text-xs sm:text-sm`}
                              >
                                {employee.role}
                              </Badge>
                              {employee.performance && (
                                <Badge
                                  className={`${getPerformanceColor(
                                    employee.performance
                                  )} text-xs sm:text-sm`}
                                >
                                  {employee.performance}
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                              {employee.department} • {t.joinedLabel}{" "}
                              {employee.joinDate}
                            </CardDescription>
                          </div>
                        </div>

                        {/* Mobile-Optimized Employee Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 sm:gap-6 text-xs sm:text-sm mb-3 sm:mb-4">
                          <div>
                            <p className="text-slate-500 dark:text-slate-400 text-xs">
                              {t.emailLabel}
                            </p>
                            <p className="font-semibold text-slate-800 dark:text-white truncate">
                              {employee.email}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500 dark:text-slate-400 text-xs">
                              {t.phoneLabel}
                            </p>
                            <p className="font-semibold text-slate-800 dark:text-white truncate">
                              {employee.phone}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500 dark:text-slate-400 text-xs">
                              {t.scheduleLabel}
                            </p>
                            <p className="font-semibold text-slate-800 dark:text-white truncate">
                              {employee.shift}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Mobile Action Dropdown */}
                      <div className="flex sm:hidden">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              {t.actionViewProfile}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              {t.actionEditDetails}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                deleteEmployee.mutate(String(employee.id))
                              }
                              className="text-red-600"
                            >
                              {t.actionDeleteEmployee}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Desktop Action Buttons */}
                      <div className="hidden sm:flex flex-col gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg sm:rounded-xl border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-all text-xs sm:text-sm"
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          {t.actionView}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg sm:rounded-xl border-amber-300 dark:border-amber-600 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all text-xs sm:text-sm"
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          {t.actionEdit}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg sm:rounded-xl border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-xs sm:text-sm"
                          onClick={() =>
                            deleteEmployee.mutate(String(employee.id))
                          }
                        >
                          {t.actionDelete}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-orange-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-xl sm:rounded-3xl"></div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Mobile-Optimized Shifts Tab */}
        <TabsContent value="shifts" className="space-y-4">
          <Card className="border-0 bg-white dark:bg-slate-800 shadow-lg sm:shadow-xl rounded-xl sm:rounded-3xl">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-slate-800 dark:text-white text-lg sm:text-xl md:text-2xl">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl sm:rounded-2xl">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <div>{t.shiftsCenterTitle}</div>
                  <CardDescription className="text-sm sm:text-base md:text-lg">
                    {t.shiftsCenterDesc}
                  </CardDescription>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4">
              <div className="space-y-4 sm:space-y-6">
                {[
                  "Morning Excellence",
                  "Day Operations",
                  "Afternoon Service",
                  "Night Operations",
                ].map((shift) => (
                  <div
                    key={shift}
                    className="border border-slate-200 dark:border-slate-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-white dark:bg-slate-700/50"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <h4 className="font-bold text-base sm:text-lg text-slate-800 dark:text-white truncate">
                        {shift}
                      </h4>
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                        {
                          employees.filter((emp) =>
                            emp.shift.includes(shift.split(" ")[0])
                          ).length
                        }{" "}
                        {t.teamMembers}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {employees
                        .filter((emp) =>
                          emp.shift.includes(shift.split(" ")[0])
                        )
                        .map((emp) => (
                          <div
                            key={emp.id}
                            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 dark:bg-slate-600/50 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-500"
                          >
                            <div className="p-1.5 sm:p-2 bg-gradient-to-r from-purple-500 to-orange-500 rounded-lg">
                              <UserCog className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-800 dark:text-white text-sm truncate">
                                {emp.name}
                              </p>
                              <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
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

        {/* Mobile-Optimized Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card className="border-0 bg-white dark:bg-slate-800 shadow-lg sm:shadow-xl rounded-xl sm:rounded-3xl">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-slate-800 dark:text-white text-lg sm:text-xl md:text-2xl">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl sm:rounded-2xl">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <div>{t.activityDashboardTitle}</div>
                  <CardDescription className="text-sm sm:text-base md:text-lg">
                    {t.activityDashboardDesc}
                  </CardDescription>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4">
              {activityLoading ? (
                <BubblingPlaceholder variant="list" count={4} />
              ) : activityError ? (
                <div className="text-center py-6 sm:py-8 text-sm sm:text-lg text-red-500">
                  {t.failedToLoadActivity}
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {activityLogs.length === 0 ? (
                    <div className="text-center py-6 sm:py-8 text-sm sm:text-lg text-slate-500">
                      {t.noActivityLogs}
                    </div>
                  ) : (
                    activityLogs.map((log, index) => (
                      <div
                        key={log.id || index}
                        className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-slate-700/50 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="text-xl sm:text-2xl flex-shrink-0">
                          {getActivityIcon(
                            log.type ||
                              log.action_english
                                ?.toLowerCase()
                                .includes("clean")
                              ? "cleaning"
                              : "system"
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 sm:gap-3 mb-1 flex-wrap">
                            <p className="font-semibold text-slate-800 dark:text-white text-sm sm:text-base truncate">
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
                          <p className="text-slate-700 dark:text-slate-300 text-sm mb-2 line-clamp-2">
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
