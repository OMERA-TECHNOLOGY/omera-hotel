import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { BubblingPlaceholder } from "@/components/ui/bubbling-placeholder";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ClipboardList,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Home,
  Shield,
  Zap,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Housekeeping = () => {
  const { t } = useLanguage();
  type Task = {
    id: string;
    room_id: string;
    title: string;
    status: string;
    scheduled_date: string;
    type: string;
    priority?: string;
    room?: string;
  };
  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const token = undefined; // TODO: plug in auth token
        const res = await import("@/lib/api").then((m: any) =>
          m.apiGet("/housekeeping/maintenance")
        );
        if (!alive) return;
        interface RawTask {
          id: string;
          room_id: string;
          title: string;
          status: string;
          scheduled_date: string;
          type: string;
        }
        const mapped: Task[] = ((res as any).data?.tasks || []).map(
          (t: RawTask) => ({
            id: t.id,
            room_id: t.room_id,
            title: t.title,
            status: t.status,
            scheduled_date: t.scheduled_date,
            type: t.type,
          })
        );
        setTasks(mapped);
      } catch (e) {
        console.error("Failed to load housekeeping tasks", e);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, []);

  // Fetch inventory from backend (replaces static inventory)
  const {
    data: inventoryData,
    isLoading: inventoryLoading,
    error: inventoryError,
  } = useQuery({
    queryKey: ["housekeeping", "inventory"],
    queryFn: async () => {
      const res = await apiGet("/housekeeping/inventory");
      return (
        (res as any).data?.items ||
        (res as any).items ||
        (res as any).data ||
        res
      );
    },
  });

  const inventory = Array.isArray(inventoryData)
    ? inventoryData
    : inventoryData?.items || inventoryData?.data || [];

  const loading = inventoryLoading && tasks.length === 0;

  if (loading)
    return (
      <div className="p-4 sm:p-6">
        <BubblingPlaceholder variant="page" />
      </div>
    );
  if (inventoryError)
    return (
      <div className="p-4 sm:p-6 text-red-600 text-sm sm:text-base">
        Error loading inventory: {String(inventoryError)}
      </div>
    );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "in-progress":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "pending":
        return "bg-slate-100 text-slate-800 border-slate-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusGradient = (status: string) => {
    switch (status) {
      case "completed":
        return "from-emerald-500 to-green-500";
      case "in-progress":
        return "from-amber-500 to-yellow-500";
      case "pending":
        return "from-slate-500 to-slate-600";
      default:
        return "from-slate-500 to-slate-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "in-progress":
        return <Clock className="h-4 w-4" />;
      case "pending":
        return <ClipboardList className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    return priority === "high"
      ? "bg-red-100 text-red-800 border-red-200"
      : "bg-emerald-100 text-emerald-800 border-emerald-200";
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 sm:space-y-8">
      {/* Mobile-Optimized Header */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-800 via-amber-900 to-emerald-900 p-6 sm:p-8 text-white border border-amber-500/20">
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <div className="p-2 sm:p-3 bg-amber-500/20 rounded-xl sm:rounded-2xl border border-amber-400/30 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 sm:h-8 sm:w-8 text-amber-400" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-amber-200 to-emerald-200 bg-clip-text text-transparent">
                    Housekeeping Excellence
                  </h1>
                  <p className="text-amber-100 text-sm sm:text-lg mt-2">
                    Maintain pristine standards with precision cleaning
                    operations
                  </p>
                </div>
              </div>

              {/* Mobile-Optimized Stats Row */}
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 sm:gap-6">
                <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20">
                  <Shield className="h-4 w-4 sm:h-6 sm:w-6 text-emerald-400" />
                  <div>
                    <p className="text-lg sm:text-2xl font-bold">98%</p>
                    <p className="text-xs text-amber-200">Quality Score</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20">
                  <Zap className="h-4 w-4 sm:h-6 sm:w-6 text-amber-400" />
                  <div>
                    <p className="text-lg sm:text-2xl font-bold">24m</p>
                    <p className="text-xs text-amber-200">Avg. Clean Time</p>
                  </div>
                </div>
                <div className="col-span-2 sm:col-auto flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 justify-center sm:justify-start">
                  <Home className="h-4 w-4 sm:h-6 sm:w-6 text-green-400" />
                  <div>
                    <p className="text-lg sm:text-2xl font-bold">45</p>
                    <p className="text-xs text-amber-200">Rooms Today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-r from-green-500/5 to-amber-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Mobile-Optimized Status Overview */}
      <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-lg sm:shadow-xl group rounded-xl sm:rounded-3xl">
          <CardHeader className="pb-2 sm:pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
                Pending Tasks
              </CardTitle>
              <div className="p-1.5 sm:p-2 bg-slate-500/10 rounded-lg sm:rounded-xl">
                <ClipboardList className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-3xl font-bold text-slate-600 dark:text-slate-400">
              {tasks.filter((t) => t.status === "pending").length}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Awaiting assignment
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full bg-gradient-to-r from-slate-500 to-slate-600 transition-all duration-1000"
              style={{ width: "25%" }}
            ></div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-amber-50 dark:from-slate-800 dark:to-amber-900/20 shadow-lg sm:shadow-xl group rounded-xl sm:rounded-3xl">
          <CardHeader className="pb-2 sm:pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
                In Progress
              </CardTitle>
              <div className="p-1.5 sm:p-2 bg-amber-500/10 rounded-lg sm:rounded-xl">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">
              {tasks.filter((t) => t.status === "in-progress").length}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Currently cleaning
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-1000"
              style={{ width: "50%" }}
            ></div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-emerald-900/20 shadow-lg sm:shadow-xl group rounded-xl sm:rounded-3xl">
          <CardHeader className="pb-2 sm:pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
                Completed Today
              </CardTitle>
              <div className="p-1.5 sm:p-2 bg-emerald-500/10 rounded-lg sm:rounded-xl">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {tasks.filter((t) => t.status === "completed").length}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Ready for guests
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-1000"
              style={{ width: "75%" }}
            ></div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-red-50 dark:from-slate-800 dark:to-red-900/20 shadow-lg sm:shadow-xl group rounded-xl sm:rounded-3xl">
          <CardHeader className="pb-2 sm:pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
                Low Stock Items
              </CardTitle>
              <div className="p-1.5 sm:p-2 bg-red-500/10 rounded-lg sm:rounded-xl">
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-3xl font-bold text-red-600 dark:text-red-400">
              {inventory.filter((i) => i.status === "low").length}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Needs restocking
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-1000"
              style={{ width: "40%" }}
            ></div>
          </div>
        </Card>
      </div>

      {/* Mobile-Optimized Cleaning Tasks */}
      <Card className="border-0 bg-white dark:bg-slate-800 shadow-lg sm:shadow-2xl rounded-xl sm:rounded-3xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-3 text-slate-800 dark:text-white text-xl sm:text-2xl">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-amber-500 to-emerald-500 rounded-xl sm:rounded-2xl w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <div className="text-lg sm:text-2xl">
                Today's Cleaning Operations
              </div>
              <CardDescription className="text-sm sm:text-lg">
                Room cleaning assignments and real-time progress tracking
              </CardDescription>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 sm:space-y-6">
            {tasks.map((task) => (
              <Card
                key={task.id}
                className="relative overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-lg sm:shadow-xl hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 group rounded-xl sm:rounded-3xl border border-slate-200 dark:border-slate-700"
              >
                {/* Status Indicator */}
                <div
                  className={`absolute top-3 sm:top-4 right-3 sm:right-4 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-white text-xs font-semibold bg-gradient-to-r ${getStatusGradient(
                    task.status
                  )} shadow-lg`}
                >
                  {task.status.replace("-", " ").toUpperCase()}
                </div>

                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 sm:gap-4 mb-3">
                        <div
                          className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${
                            task.priority === "high"
                              ? "bg-gradient-to-r from-red-500 to-orange-500"
                              : "bg-gradient-to-r from-emerald-500 to-green-500"
                          }`}
                        >
                          <div className="text-white font-bold text-base sm:text-lg">
                            {task.room_id.slice(0, 4)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                            <CardTitle className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white truncate">
                              Room {task.room_id.slice(0, 4)} • {task.title}
                            </CardTitle>
                            <Badge
                              className={`${getPriorityColor(
                                task.priority
                              )} text-xs`}
                            >
                              {task.priority === "high"
                                ? "High Priority"
                                : "Standard"}
                            </Badge>
                          </div>
                          <CardDescription className="text-slate-600 dark:text-slate-400 text-sm">
                            Scheduled: {task.scheduled_date}
                          </CardDescription>
                        </div>
                      </div>

                      {/* Enhanced Checklist */}
                      <div className="space-y-2 sm:space-y-3">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Cleaning Checklist:
                        </p>
                        <div className="grid gap-1.5 sm:gap-2">
                          {[
                            "Change linens",
                            "Restock amenities",
                            "Clean bathroom",
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 sm:space-x-3 p-2 bg-white dark:bg-slate-700/50 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-600"
                            >
                              <Checkbox
                                id={`task-${task.id}-${index}`}
                                defaultChecked={task.status === "completed"}
                                className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 h-4 w-4 sm:h-5 sm:w-5"
                              />
                              <label
                                htmlFor={`task-${task.id}-${index}`}
                                className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1"
                              >
                                {item}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    {task.status !== "completed" && (
                      <Button
                        className={`rounded-lg sm:rounded-xl text-xs sm:text-sm ${
                          task.status === "pending"
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                            : "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                        }`}
                      >
                        {task.status === "pending"
                          ? "Start Cleaning"
                          : "Mark Complete"}
                      </Button>
                    )}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="rounded-lg sm:rounded-xl border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs sm:text-sm"
                        >
                          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Report Issue
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[95vw] sm:max-w-md bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-0 shadow-2xl rounded-xl sm:rounded-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                            <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
                            Report Room Issue
                          </DialogTitle>
                          <DialogDescription className="text-sm sm:text-base">
                            Document any damages or maintenance issues in{" "}
                            {task.room}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="issueType"
                              className="text-xs sm:text-sm font-semibold"
                            >
                              Issue Type
                            </Label>
                            <select
                              id="issueType"
                              className="w-full rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm"
                            >
                              <option>Damage</option>
                              <option>Maintenance Required</option>
                              <option>Missing Item</option>
                              <option>Cleaning Issue</option>
                              <option>Other</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="issueDescription"
                              className="text-xs sm:text-sm font-semibold"
                            >
                              Detailed Description
                            </Label>
                            <Textarea
                              id="issueDescription"
                              placeholder="Describe the issue in detail with specific locations and severity..."
                              rows={4}
                              className="rounded-lg sm:rounded-xl border-slate-200 dark:border-slate-600 text-sm"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                          <Button
                            variant="outline"
                            className="rounded-lg sm:rounded-xl border-slate-300 dark:border-slate-600 text-xs sm:text-sm order-2 sm:order-1"
                          >
                            Cancel
                          </Button>
                          <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 rounded-lg sm:rounded-xl text-xs sm:text-sm order-1 sm:order-2">
                            Submit Report
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>

                {/* Hover Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${getStatusGradient(
                    task.status
                  )} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-xl sm:rounded-3xl`}
                ></div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mobile-Optimized Inventory */}
      <Card className="border-0 bg-white dark:bg-slate-800 shadow-lg sm:shadow-2xl rounded-xl sm:rounded-3xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-3 text-slate-800 dark:text-white text-xl sm:text-2xl">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl sm:rounded-2xl w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <div className="text-lg sm:text-2xl">Inventory Management</div>
              <CardDescription className="text-sm sm:text-lg">
                Real-time stock levels and automated restocking alerts
              </CardDescription>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {inventory.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-white dark:bg-slate-700/50 rounded-lg sm:rounded-2xl border border-slate-200 dark:border-slate-600 hover:shadow-md sm:hover:shadow-lg transition-all duration-300 gap-3 sm:gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                    <p className="font-semibold text-slate-800 dark:text-white text-sm sm:text-base truncate">
                      {item.item}
                    </p>
                    <div className="flex gap-2">
                      {item.status === "low" && (
                        <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
                          Low Stock
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className="border-slate-300 dark:border-slate-600 text-xs"
                      >
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    Current:{" "}
                    <span className="font-semibold">{item.current}</span> |
                    Minimum:{" "}
                    <span className="font-semibold">{item.minimum}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  <div className="flex-1 sm:w-32 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        item.status === "low"
                          ? "bg-gradient-to-r from-red-500 to-orange-500"
                          : "bg-gradient-to-r from-emerald-500 to-green-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          (item.current / item.minimum) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <Button
                    variant="outline"
                    className={`rounded-lg sm:rounded-xl text-xs sm:text-sm whitespace-nowrap ${
                      item.status === "low"
                        ? "border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        : "border-emerald-300 dark:border-emerald-600 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                    }`}
                  >
                    {item.status === "low" ? "Urgent Restock" : "Restock"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Housekeeping;
