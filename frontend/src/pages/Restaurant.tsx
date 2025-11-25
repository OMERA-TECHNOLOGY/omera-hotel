import { useEffect, useState } from "react";
import { BubblingPlaceholder } from "@/components/ui/bubbling-placeholder";
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
  Plus,
  Utensils,
  Clock,
  CheckCircle,
  Search,
  ChefHat,
  Coffee,
  Star,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Restaurant = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLanguage();

  interface MenuItemDto {
    id: string;
    name_english: string;
    category?: string;
    price_birr: number;
    description_english?: string;
    is_available?: boolean;
    created_at?: string;
  }
  interface OrderDto {
    id: string;
    order_number: string;
    room_number?: string;
    guest_name?: string;
    status: string;
    total_amount_birr: number;
    created_at: string;
  }
  interface UiOrder {
    id: string;
    orderNumber: string;
    room: string;
    guest: string;
    items: { name: string; quantity: number; price: number }[];
    total: number;
    status: string;
    time: string;
    priority: string;
  }

  const [menuItems, setMenuItems] = useState<MenuItemDto[]>([]);
  const [orders, setOrders] = useState<UiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const token = undefined; // TODO: plug in auth token from context
        const [menuRes, ordersRes] = await Promise.all([
          import("@/lib/api").then((m: any) => m.apiGet("/restaurant/menu")),
          import("@/lib/api").then((m: any) => m.apiGet("/restaurant/orders")),
        ]);
        if (!isMounted) return;
        setMenuItems((menuRes as any).data?.menu || []);
        // Map order shape for UI
        const mapped = ((ordersRes as any).data?.orders || []).map(
          (o: OrderDto) => ({
            id: o.id,
            orderNumber: o.order_number,
            room: o.room_number || "",
            guest: o.guest_name || "",
            items: [],
            total: o.total_amount_birr,
            status: o.status,
            time: new Date(o.created_at).toLocaleTimeString(),
            priority: "normal",
          })
        );
        setOrders(mapped);
      } catch (e) {
        console.error("Failed to load restaurant data", e);
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "received":
        return "bg-slate-100 text-slate-800 border-slate-200";
      case "preparing":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "ready":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusGradient = (status: string) => {
    switch (status) {
      case "preparing":
        return "from-amber-500 to-yellow-500";
      case "ready":
        return "from-orange-500 to-amber-500";
      case "delivered":
        return "from-emerald-500 to-green-500";
      default:
        return "from-slate-500 to-slate-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "preparing":
        return <Clock className="h-4 w-4" />;
      case "ready":
        return <Utensils className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getPopularityBadge = (popularity: string) => {
    switch (popularity) {
      case "bestseller":
        return (
          <Badge className="bg-amber-500 text-white border-0">Bestseller</Badge>
        );
      case "featured":
        return (
          <Badge className="bg-orange-500 text-white border-0">Featured</Badge>
        );
      default:
        return null;
    }
  };

  if (loading)
    return (
      <div className="p-6">
        <BubblingPlaceholder variant="page" />
      </div>
    );
  if (error)
    return (
      <div className="p-6 text-red-600">
        Error loading restaurant data: {String(error)}
      </div>
    );

  return (
    <div className="space-y-8 p-6">
      {/* Unique Header Structure - Not in Card Style */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-orange-900 to-amber-900 p-8 text-white border border-orange-500/20">
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-orange-500/20 rounded-2xl border border-orange-400/30">
                  <ChefHat className="h-8 w-8 text-orange-400" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-200 to-amber-200 bg-clip-text text-transparent">
                    Culinary Excellence
                  </h1>
                  <p className="text-orange-100 text-lg mt-2">
                    Craft unforgettable dining experiences with precision and
                    passion
                  </p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <Zap className="h-6 w-6 text-amber-400" />
                  <div>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-orange-200">Active Orders</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <Star className="h-6 w-6 text-orange-400" />
                  <div>
                    <p className="text-2xl font-bold">4.8</p>
                    <p className="text-xs text-orange-200">Guest Rating</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <Coffee className="h-6 w-6 text-amber-400" />
                  <div>
                    <p className="text-2xl font-bold">45</p>
                    <p className="text-xs text-orange-200">Today's Covers</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 border-0 shadow-2xl rounded-2xl px-6 py-3">
                    <Plus className="h-5 w-5 mr-2" />
                    New Order
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-0 shadow-2xl rounded-3xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-2xl">
                      <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl">
                        <Plus className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div>Create Premium Order</div>
                        <div className="text-sm font-normal text-slate-500">
                          Place a new room service order with attention to
                          detail
                        </div>
                      </div>
                    </DialogTitle>
                  </DialogHeader>

                  <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label
                          htmlFor="orderRoom"
                          className="text-sm font-semibold"
                        >
                          Room Details
                        </Label>
                        <Input
                          id="orderRoom"
                          placeholder="Enter room number and type"
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="orderGuest"
                          className="text-sm font-semibold"
                        >
                          Guest Information
                        </Label>
                        <Input
                          id="orderGuest"
                          placeholder="Guest full name"
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">
                        Select Menu Items
                      </Label>
                      <div className="border border-slate-200 dark:border-slate-600 rounded-2xl p-4 max-h-64 overflow-y-auto space-y-3">
                        {menuItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 bg-white dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <p className="font-semibold text-slate-800 dark:text-white">
                                  {item.name}
                                </p>
                                {getPopularityBadge(item.popularity)}
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {item.description}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                                  {item.price} ETB
                                </span>
                                <span className="text-sm text-slate-500">
                                  ⏱️ {item.preparationTime}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-xl border-orange-300 dark:border-orange-600 text-orange-600 dark:text-orange-400"
                            >
                              Add to Order
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">
                        Order Summary
                      </Label>
                      <div className="border border-slate-200 dark:border-slate-600 rounded-2xl p-4 bg-slate-50 dark:bg-slate-800/50">
                        <p className="text-sm text-slate-500 text-center py-8">
                          Select items from the menu to build your order
                        </p>
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600 hidden">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-lg">
                              Total Amount:
                            </span>
                            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                              0 ETB
                            </span>
                          </div>
                        </div>
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
                    <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl">
                      Place Premium Order
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Unique Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-amber-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-amber-500/5 to-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Enhanced Search & Filters */}
      <div className="flex items-center gap-4 p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search orders by room number, guest name, or order ID..."
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
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="preparing">Preparing</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-0 shadow-2xl rounded-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <ChefHat className="h-6 w-6 text-orange-500" />
                Add Culinary Creation
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-3">
                <Label htmlFor="itemName" className="text-sm font-semibold">
                  Dish Name
                </Label>
                <Input
                  id="itemName"
                  placeholder="Enter signature dish name"
                  className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label
                    htmlFor="itemCategory"
                    className="text-sm font-semibold"
                  >
                    Category
                  </Label>
                  <Select>
                    <SelectTrigger
                      id="itemCategory"
                      className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl"
                    >
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
                <div className="space-y-3">
                  <Label htmlFor="itemPrice" className="text-sm font-semibold">
                    Price (ETB)
                  </Label>
                  <Input
                    id="itemPrice"
                    type="number"
                    placeholder="0.00"
                    className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label
                  htmlFor="itemDescription"
                  className="text-sm font-semibold"
                >
                  Description
                </Label>
                <Input
                  id="itemDescription"
                  placeholder="Craft an enticing description"
                  className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="border-slate-300 dark:border-slate-600 rounded-xl"
              >
                Cancel
              </Button>
              <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl">
                Add to Menu
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 p-2 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <TabsTrigger
            value="orders"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700"
          >
            Active Orders
            <span className="ml-2 px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
              {orders.filter((o) => o.status !== "delivered").length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="menu"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700"
          >
            Menu Management
            <span className="ml-2 px-2 py-1 bg-amber-500 text-white text-xs rounded-full">
              {menuItems.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="kitchen"
            className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700"
          >
            Kitchen Display
            <span className="ml-2 px-2 py-1 bg-emerald-500 text-white text-xs rounded-full">
              {orders.filter((o) => o.status === "preparing").length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <div className="grid gap-6">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="relative overflow-hidden bg-white dark:bg-slate-800 shadow-2xl hover:shadow-3xl transition-all duration-500 group rounded-3xl border border-slate-200 dark:border-slate-700"
              >
                {/* Status Indicator */}
                <div
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-white text-xs font-semibold bg-gradient-to-r ${getStatusGradient(
                    order.status
                  )} shadow-lg`}
                >
                  {order.status.toUpperCase()}
                </div>

                {/* Priority Indicator */}
                {order.priority === "high" && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                      High Priority
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-4 pt-16">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div
                          className={`p-3 rounded-2xl ${
                            order.priority === "high"
                              ? "bg-gradient-to-r from-red-500 to-orange-500"
                              : "bg-gradient-to-r from-slate-500 to-slate-600"
                          }`}
                        >
                          <div className="text-white font-bold text-lg">
                            {order.orderNumber.split("-")[1]}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl font-bold text-slate-800 dark:text-white">
                              {order.orderNumber}
                            </CardTitle>
                          </div>
                          <CardDescription className="text-slate-600 dark:text-slate-400">
                            {order.room} • {order.guest} • {order.time}
                          </CardDescription>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-3">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Order Details:
                        </p>
                        <div className="grid gap-2">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-white dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600"
                            >
                              <div>
                                <p className="font-medium text-slate-800 dark:text-white">
                                  {item.name}
                                </p>
                                <p className="text-sm text-slate-500">
                                  Qty: {item.quantity} × {item.price} ETB
                                </p>
                              </div>
                              <p className="font-semibold text-slate-800 dark:text-white">
                                {item.quantity * item.price} ETB
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-right">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Total Amount
                      </p>
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {order.total} ETB
                      </p>
                    </div>
                    {order.status !== "delivered" && (
                      <Button
                        className={`rounded-xl ${
                          order.status === "preparing"
                            ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                            : "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                        }`}
                      >
                        {order.status === "preparing"
                          ? "Mark Ready"
                          : "Mark Delivered"}
                      </Button>
                    )}
                  </div>
                </CardContent>

                {/* Hover Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${getStatusGradient(
                    order.status
                  )} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}
                ></div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="menu" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Card
                key={item.id}
                className="relative overflow-hidden bg-white dark:bg-slate-800 shadow-xl hover:shadow-2xl transition-all duration-500 group rounded-3xl border border-slate-200 dark:border-slate-700"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-bold text-slate-800 dark:text-white">
                      {item.name}
                    </CardTitle>
                    {getPopularityBadge(item.popularity)}
                  </div>
                  <Badge
                    variant="outline"
                    className="border-slate-300 dark:border-slate-600 text-xs"
                  >
                    {item.category}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="h-4 w-4" />
                      {item.preparationTime}
                    </div>
                    <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                      {item.price} ETB
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-xl border-slate-300 dark:border-slate-600"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-xl border-red-300 dark:border-red-600 text-red-600 dark:text-red-400"
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="kitchen" className="space-y-4">
          <Card className="border-0 bg-white dark:bg-slate-800 shadow-2xl rounded-3xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-white text-2xl">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl">
                  <ChefHat className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div>Kitchen Command Center</div>
                  <CardDescription className="text-lg">
                    Live order tracking and preparation status
                  </CardDescription>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {orders
                  .filter(
                    (order) =>
                      order.status === "preparing" || order.status === "ready"
                  )
                  .map((order) => (
                    <Card
                      key={order.id}
                      className={`border-0 shadow-2xl rounded-3xl ${
                        order.status === "ready"
                          ? "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-2 border-orange-300 dark:border-orange-600"
                          : "bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-2 border-amber-300 dark:border-amber-600"
                      }`}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">
                            {order.orderNumber}
                          </CardTitle>
                          <Badge
                            className={`text-lg ${
                              order.status === "ready"
                                ? "bg-orange-500 text-white"
                                : "bg-amber-500 text-white"
                            }`}
                          >
                            {order.time}
                          </Badge>
                        </div>
                        <CardDescription className="text-lg text-slate-600 dark:text-slate-400">
                          {order.room} • {order.guest}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3 text-lg mb-6">
                          {order.items.map((item, index) => (
                            <li
                              key={index}
                              className="font-semibold text-slate-800 dark:text-white flex items-center gap-2"
                            >
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  order.status === "ready"
                                    ? "bg-orange-500"
                                    : "bg-amber-500"
                                }`}
                              ></div>
                              {item.name} × {item.quantity}
                            </li>
                          ))}
                        </ul>
                        <Button
                          className={`w-full rounded-xl text-lg py-3 ${
                            order.status === "ready"
                              ? "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                              : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                          }`}
                        >
                          {order.status === "preparing"
                            ? "Mark as Ready"
                            : "Complete Order"}
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
  );
};

export default Restaurant;
