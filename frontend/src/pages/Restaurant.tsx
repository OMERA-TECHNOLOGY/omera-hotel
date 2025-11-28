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
          <Badge className="bg-amber-500 text-white border-0 text-xs">
            {t.bestseller}
          </Badge>
        );
      case "featured":
        return (
          <Badge className="bg-orange-500 text-white border-0 text-xs">
            {t.featured}
          </Badge>
        );
      default:
        return null;
    }
  };

  if (loading)
    return (
      <div className="p-4 sm:p-6">
        <BubblingPlaceholder variant="page" />
      </div>
    );
  if (error)
    return (
      <div className="p-4 sm:p-6 text-red-600 text-sm sm:text-base">
        Error loading restaurant data: {String(error)}
      </div>
    );

  return (
    <div className="space-y-6 p-4 sm:p-6 sm:space-y-8">
      {/* Mobile-Optimized Header */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-800 via-orange-900 to-amber-900 p-6 sm:p-8 text-white border border-orange-500/20">
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <div className="p-2 sm:p-3 bg-orange-500/20 rounded-xl sm:rounded-2xl border border-orange-400/30 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                  <ChefHat className="h-5 w-5 sm:h-8 sm:w-8 text-orange-400" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-orange-200 to-amber-200 bg-clip-text text-transparent">
                    {t.restaurantTitle}
                  </h1>
                  <p className="text-orange-100 text-sm sm:text-lg mt-2">
                    {t.restaurantSubtitle}
                  </p>
                </div>
              </div>

              {/* Mobile-Optimized Stats Row */}
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 sm:gap-6">
                <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20">
                  <Zap className="h-4 w-4 sm:h-6 sm:w-6 text-amber-400" />
                  <div>
                    <p className="text-lg sm:text-2xl font-bold">12</p>
                    <p className="text-xs text-orange-200">
                      {t.statsActiveOrders}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20">
                  <Star className="h-4 w-4 sm:h-6 sm:w-6 text-orange-400" />
                  <div>
                    <p className="text-lg sm:text-2xl font-bold">4.8</p>
                    <p className="text-xs text-orange-200">
                      {t.statsGuestRating}
                    </p>
                  </div>
                </div>
                <div className="col-span-2 sm:col-auto flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 justify-center sm:justify-start">
                  <Coffee className="h-4 w-4 sm:h-6 sm:w-6 text-amber-400" />
                  <div>
                    <p className="text-lg sm:text-2xl font-bold">45</p>
                    <p className="text-xs text-orange-200">
                      {t.statsTodaysCovers}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right mt-4 sm:mt-0">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 border-0 shadow-xl sm:shadow-2xl rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base">
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    {t.newOrder}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] sm:max-w-4xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-0 shadow-2xl rounded-xl sm:rounded-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader className="sticky top-0 bg-inherit z-10 pb-4 border-b border-slate-200 dark:border-slate-700">
                    <DialogTitle className="flex flex-col sm:flex-row sm:items-center gap-3 text-lg sm:text-2xl">
                      <div className="p-2 sm:p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl sm:rounded-2xl w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                        <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-lg sm:text-2xl">
                          {t.createPremiumOrder}
                        </div>
                        <div className="text-xs sm:text-sm font-normal text-slate-500">
                          {t.createPremiumOrderDesc}
                        </div>
                      </div>
                    </DialogTitle>
                  </DialogHeader>

                  <div className="grid gap-4 sm:gap-6 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2 sm:space-y-3">
                        <Label
                          htmlFor="orderRoom"
                          className="text-xs sm:text-sm font-semibold"
                        >
                          {t.roomDetailsLabel}
                        </Label>
                        <Input
                          id="orderRoom"
                          placeholder={t.roomDetailsPlaceholder}
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                        />
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        <Label
                          htmlFor="orderGuest"
                          className="text-xs sm:text-sm font-semibold"
                        >
                          {t.guestInformationLabel}
                        </Label>
                        <Input
                          id="orderGuest"
                          placeholder={t.guestNamePlaceholder}
                          className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <Label className="text-xs sm:text-sm font-semibold">
                        {t.selectMenuItemsLabel}
                      </Label>
                      <div className="border border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-2xl p-3 sm:p-4 max-h-48 sm:max-h-64 overflow-y-auto space-y-2 sm:space-y-3">
                        {menuItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 bg-white dark:bg-slate-700/50 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-600 hover:shadow-md sm:hover:shadow-lg transition-all duration-300 gap-2 sm:gap-3"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                                <p className="font-semibold text-slate-800 dark:text-white text-sm sm:text-base truncate">
                                  {item.name}
                                </p>
                                {getPopularityBadge(item.popularity)}
                              </div>
                              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                                {item.description}
                              </p>
                              <div className="flex items-center gap-3 sm:gap-4 mt-1 sm:mt-2">
                                <span className="text-base sm:text-lg font-bold text-orange-600 dark:text-orange-400">
                                  {item.price} ETB
                                </span>
                                <span className="text-xs sm:text-sm text-slate-500">
                                  ⏱️ {item.preparationTime}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-lg sm:rounded-xl border-orange-300 dark:border-orange-600 text-orange-600 dark:text-orange-400 text-xs sm:text-sm mt-2 sm:mt-0"
                            >
                              {t.addToOrder}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <Label className="text-xs sm:text-sm font-semibold">
                        {t.orderSummaryLabel}
                      </Label>
                      <div className="border border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-2xl p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/50">
                        <p className="text-xs sm:text-sm text-slate-500 text-center py-4 sm:py-8">
                          {t.selectItemsBuildOrder}
                        </p>
                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-200 dark:border-slate-600 hidden">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-base sm:text-lg">
                              Total Amount:
                            </span>
                            <span className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                              0 ETB
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 sticky bottom-0 bg-inherit pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Button
                      variant="outline"
                      className="border-slate-300 dark:border-slate-600 rounded-lg sm:rounded-xl text-xs sm:text-base order-2 sm:order-1"
                    >
                      {t.cancel}
                    </Button>
                    <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-lg sm:rounded-xl text-xs sm:text-base order-1 sm:order-2">
                      {t.placePremiumOrder}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-tr from-amber-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-r from-amber-500/5 to-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Mobile-Optimized Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 p-4 sm:p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-slate-200 dark:border-slate-700">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
          <Input
            placeholder={t.searchOrdersPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border-0 bg-white dark:bg-slate-700 shadow-md sm:shadow-lg rounded-lg sm:rounded-xl"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[200px] bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base">
            <SelectValue placeholder={t.filterByStatusPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.allOrders}</SelectItem>
            <SelectItem value="preparing">{t.statusPreparing}</SelectItem>
            <SelectItem value="ready">{t.statusReady}</SelectItem>
            <SelectItem value="delivered">{t.statusDelivered}</SelectItem>
          </SelectContent>
        </Select>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg sm:rounded-xl text-xs sm:text-base"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              {t.addMenuItem}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-md bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border-0 shadow-2xl rounded-xl sm:rounded-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                <ChefHat className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
                {t.addCulinaryCreation}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
              <div className="space-y-2 sm:space-y-3">
                <Label
                  htmlFor="itemName"
                  className="text-xs sm:text-sm font-semibold"
                >
                  {t.dishName}
                </Label>
                <Input
                  id="itemName"
                  placeholder={t.dishNamePlaceholder}
                  className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2 sm:space-y-3">
                  <Label
                    htmlFor="itemCategory"
                    className="text-xs sm:text-sm font-semibold"
                  >
                    {t.categoryLabel}
                  </Label>
                  <Select>
                    <SelectTrigger
                      id="itemCategory"
                      className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                    >
                      <SelectValue placeholder={t.selectCategoryPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appetizer">
                        {t.catAppetizer}
                      </SelectItem>
                      <SelectItem value="main">{t.catMainCourse}</SelectItem>
                      <SelectItem value="dessert">{t.catDessert}</SelectItem>
                      <SelectItem value="beverage">{t.catBeverage}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <Label
                    htmlFor="itemPrice"
                    className="text-xs sm:text-sm font-semibold"
                  >
                    {t.priceLabel}
                  </Label>
                  <Input
                    id="itemPrice"
                    type="number"
                    placeholder={t.pricePlaceholder}
                    className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                  />
                </div>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <Label
                  htmlFor="itemDescription"
                  className="text-xs sm:text-sm font-semibold"
                >
                  {t.descriptionLabel}
                </Label>
                <Input
                  id="itemDescription"
                  placeholder={t.descriptionPlaceholder}
                  className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <Button
                variant="outline"
                className="border-slate-300 dark:border-slate-600 rounded-lg sm:rounded-xl text-xs sm:text-base order-2 sm:order-1"
              >
                {t.cancel}
              </Button>
              <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-lg sm:rounded-xl text-xs sm:text-base order-1 sm:order-2">
                {t.addToMenu}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="orders" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3 p-1 sm:p-2 bg-slate-100 dark:bg-slate-800 rounded-xl sm:rounded-2xl">
          <TabsTrigger
            value="orders"
            className="rounded-lg sm:rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700 text-xs sm:text-sm"
          >
            {t.tabActiveOrders}
            <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-orange-500 text-white text-xs rounded-full">
              {orders.filter((o) => o.status !== "delivered").length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="menu"
            className="rounded-lg sm:rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700 text-xs sm:text-sm"
          >
            {t.tabMenuManagement}
            <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-amber-500 text-white text-xs rounded-full">
              {menuItems.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="kitchen"
            className="rounded-lg sm:rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700 text-xs sm:text-sm"
          >
            {t.tabKitchenDisplay}
            <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-emerald-500 text-white text-xs rounded-full">
              {orders.filter((o) => o.status === "preparing").length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-3 sm:space-y-4">
          <div className="grid gap-4 sm:gap-6">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="relative overflow-hidden bg-white dark:bg-slate-800 shadow-lg sm:shadow-xl hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 group rounded-xl sm:rounded-3xl border border-slate-200 dark:border-slate-700"
              >
                {/* Status Indicator */}
                <div
                  className={`absolute top-3 sm:top-4 right-3 sm:right-4 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-white text-xs font-semibold bg-gradient-to-r ${getStatusGradient(
                    order.status
                  )} shadow-lg`}
                >
                  {order.status.toUpperCase()}
                </div>

                {/* Priority Indicator */}
                {order.priority === "high" && (
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                    <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
                      {t.highPriority}
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-3 sm:pb-4 pt-12 sm:pt-16">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 sm:gap-4 mb-3">
                        <div
                          className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${
                            order.priority === "high"
                              ? "bg-gradient-to-r from-red-500 to-orange-500"
                              : "bg-gradient-to-r from-slate-500 to-slate-600"
                          }`}
                        >
                          <div className="text-white font-bold text-base sm:text-lg">
                            {order.orderNumber.split("-")[1]}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 sm:gap-3 mb-2">
                            <CardTitle className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white truncate">
                              {order.orderNumber}
                            </CardTitle>
                          </div>
                          <CardDescription className="text-slate-600 dark:text-slate-400 text-sm">
                            {order.room} • {order.guest} • {order.time}
                          </CardDescription>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-2 sm:space-y-3">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {t.orderDetails}
                        </p>
                        <div className="grid gap-1.5 sm:gap-2">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-white dark:bg-slate-700/50 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-600"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-800 dark:text-white text-sm sm:text-base truncate">
                                  {item.name}
                                </p>
                                <p className="text-xs sm:text-sm text-slate-500">
                                  {t.qtyLabel} {item.quantity} × {item.price}{" "}
                                  ETB
                                </p>
                              </div>
                              <p className="font-semibold text-slate-800 dark:text-white text-sm sm:text-base ml-2">
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 pt-3 sm:pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-left sm:text-right">
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        {t.totalAmount}
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {order.total} ETB
                      </p>
                    </div>
                    {order.status !== "delivered" && (
                      <Button
                        className={`rounded-lg sm:rounded-xl text-xs sm:text-sm ${
                          order.status === "preparing"
                            ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                            : "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                        }`}
                      >
                        {order.status === "preparing"
                          ? t.orderMarkReady
                          : t.orderMarkDelivered}
                      </Button>
                    )}
                  </div>
                </CardContent>

                {/* Hover Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${getStatusGradient(
                    order.status
                  )} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-xl sm:rounded-3xl`}
                ></div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="menu" className="space-y-3 sm:space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {menuItems.map((item) => (
              <Card
                key={item.id}
                className="relative overflow-hidden bg-white dark:bg-slate-800 shadow-lg sm:shadow-xl hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 group rounded-xl sm:rounded-3xl border border-slate-200 dark:border-slate-700"
              >
                <CardHeader className="pb-2 sm:pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base sm:text-lg font-bold text-slate-800 dark:text-white truncate">
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
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-2 sm:mb-3">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-slate-500">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                      {item.preparationTime}
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-orange-600 dark:text-orange-400">
                      {item.price} ETB
                    </p>
                  </div>
                  <div className="flex gap-1.5 sm:gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-lg sm:rounded-xl border-slate-300 dark:border-slate-600 text-xs sm:text-sm"
                    >
                      {t.edit}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-lg sm:rounded-xl border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 text-xs sm:text-sm"
                    >
                      {t.delete}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="kitchen" className="space-y-3 sm:space-y-4">
          <Card className="border-0 bg-white dark:bg-slate-800 shadow-lg sm:shadow-2xl rounded-xl sm:rounded-3xl">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-3 text-slate-800 dark:text-white text-xl sm:text-2xl">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl sm:rounded-2xl w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                  <ChefHat className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl">
                    {t.kitchenCommandTitle}
                  </div>
                  <CardDescription className="text-sm sm:text-lg">
                    {t.kitchenCommandDesc}
                  </CardDescription>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:gap-6">
                {orders
                  .filter(
                    (order) =>
                      order.status === "preparing" || order.status === "ready"
                  )
                  .map((order) => (
                    <Card
                      key={order.id}
                      className={`border-0 shadow-lg sm:shadow-2xl rounded-xl sm:rounded-3xl ${
                        order.status === "ready"
                          ? "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-2 border-orange-300 dark:border-orange-600"
                          : "bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-2 border-amber-300 dark:border-amber-600"
                      }`}
                    >
                      <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                          <CardTitle className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
                            {order.orderNumber}
                          </CardTitle>
                          <Badge
                            className={`text-sm sm:text-lg ${
                              order.status === "ready"
                                ? "bg-orange-500 text-white"
                                : "bg-amber-500 text-white"
                            }`}
                          >
                            {order.time}
                          </Badge>
                        </div>
                        <CardDescription className="text-sm sm:text-lg text-slate-600 dark:text-slate-400">
                          {order.room} • {order.guest}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 sm:space-y-3 text-sm sm:text-lg mb-4 sm:mb-6">
                          {order.items.map((item, index) => (
                            <li
                              key={index}
                              className="font-semibold text-slate-800 dark:text-white flex items-center gap-1 sm:gap-2"
                            >
                              <div
                                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
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
                          className={`w-full rounded-lg sm:rounded-xl text-sm sm:text-lg py-2 sm:py-3 ${
                            order.status === "ready"
                              ? "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                              : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                          }`}
                        >
                          {order.status === "preparing"
                            ? t.orderMarkAsReady
                            : t.orderCompleteOrder}
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
