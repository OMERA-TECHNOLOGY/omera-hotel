import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { BubblingPlaceholder } from "@/components/ui/bubbling-placeholder";
import { apiGet, apiPut } from "@/lib/api";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings as SettingsIcon,
  Globe,
  DollarSign,
  Shield,
  Bell,
  Database,
  Cpu,
  Network,
  Save,
  RefreshCw,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Settings = () => {
  const { t } = useLanguage();
  interface SettingsDto {
    id?: string;
    hotel_name_english?: string;
    contact_email?: string;
    phone_numbers?: string[];
    address_english?: string;
    total_rooms?: number;
    star_rating?: number;
    vat_rate?: number;
    invoice_prefix?: string;
    usd_to_etb_rate?: number;
    primary_currency?: string;
  }
  const [settings, setSettings] = useState<SettingsDto | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const token = undefined; // plug auth later
        const res = await apiGet("/settings");
        if (active) setSettings(res.data.settings);
      } catch (e) {
        console.error("Failed to load settings", e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const updateField = (k: keyof SettingsDto, v: unknown) => {
    setSettings((prev) => ({ ...(prev || {}), [k]: v }));
  };
  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const token = undefined;
      const res = await apiPut("/settings", settings);
      setSettings(res.data.settings);
    } catch (e) {
      console.error("Failed to save settings", e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <BubblingPlaceholder variant="page" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-4 sm:p-6 text-red-600 text-sm sm:text-base">
        Failed to load settings
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 sm:space-y-8">
      {/* Mobile-Optimized Header */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-amber-900 p-6 sm:p-8 text-white border border-amber-500/20">
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <div className="p-2 sm:p-3 bg-amber-500/20 rounded-xl sm:rounded-2xl border border-amber-400/30 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                  <Cpu className="h-5 w-5 sm:h-8 sm:w-8 text-amber-400" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
                    System Configuration
                  </h1>
                  <p className="text-amber-100 text-sm sm:text-lg mt-2">
                    Fine-tune your hotel management ecosystem with precision
                    control
                  </p>
                </div>
              </div>

              {/* Mobile-Optimized Stats Row */}
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 sm:gap-6">
                <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20">
                  <Database className="h-4 w-4 sm:h-6 sm:w-6 text-emerald-400" />
                  <div>
                    <p className="text-lg sm:text-2xl font-bold">98.7%</p>
                    <p className="text-xs text-amber-200">System Uptime</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20">
                  <Zap className="h-4 w-4 sm:h-6 sm:w-6 text-amber-400" />
                  <div>
                    <p className="text-lg sm:text-2xl font-bold">45</p>
                    <p className="text-xs text-amber-200">Active Services</p>
                  </div>
                </div>
                <div className="col-span-2 sm:col-auto flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20 justify-center sm:justify-start">
                  <Network className="h-4 w-4 sm:h-6 sm:w-6 text-blue-400" />
                  <div>
                    <p className="text-lg sm:text-2xl font-bold">2.3s</p>
                    <p className="text-xs text-amber-200">Avg. Response</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-tr from-slate-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-r from-orange-500/5 to-amber-500/5 rounded-full blur-3xl"></div>
      </div>

      <Tabs defaultValue="general" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 p-1 sm:p-2 bg-slate-100 dark:bg-slate-800 rounded-xl sm:rounded-2xl gap-1 sm:gap-2">
          <TabsTrigger
            value="general"
            className="rounded-lg sm:rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700 text-xs sm:text-sm"
          >
            Core
          </TabsTrigger>
          <TabsTrigger
            value="localization"
            className="rounded-lg sm:rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700 text-xs sm:text-sm"
          >
            Regional
          </TabsTrigger>
          <TabsTrigger
            value="financial"
            className="rounded-lg sm:rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700 text-xs sm:text-sm"
          >
            Financial
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="rounded-lg sm:rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700 text-xs sm:text-sm"
          >
            Alerts
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-lg sm:rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:dark:bg-slate-700 text-xs sm:text-sm"
          >
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 sm:space-y-6">
          <Card className="border-0 bg-white dark:bg-slate-800 shadow-lg sm:shadow-2xl rounded-xl sm:rounded-3xl">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-3 text-slate-800 dark:text-white text-xl sm:text-2xl">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl sm:rounded-2xl w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                  <SettingsIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl">
                    Hotel Core Configuration
                  </div>
                  <CardDescription className="text-sm sm:text-lg">
                    Essential property information and operational parameters
                  </CardDescription>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2 sm:space-y-3">
                  <Label
                    htmlFor="hotelName"
                    className="text-xs sm:text-sm font-semibold"
                  >
                    Property Name
                  </Label>
                  <Input
                    id="hotelName"
                    value={settings?.hotel_name_english || ""}
                    onChange={(e) =>
                      updateField("hotel_name_english", e.target.value)
                    }
                    className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <Label
                    htmlFor="hotelEmail"
                    className="text-xs sm:text-sm font-semibold"
                  >
                    Primary Contact
                  </Label>
                  <Input
                    id="hotelEmail"
                    type="email"
                    value={settings?.contact_email || ""}
                    onChange={(e) =>
                      updateField("contact_email", e.target.value)
                    }
                    className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2 sm:space-y-3">
                  <Label
                    htmlFor="hotelPhone"
                    className="text-xs sm:text-sm font-semibold"
                  >
                    Contact Number
                  </Label>
                  <Input
                    id="hotelPhone"
                    value={
                      (settings?.phone_numbers && settings.phone_numbers[0]) ||
                      ""
                    }
                    onChange={(e) =>
                      updateField("phone_numbers", [e.target.value])
                    }
                    className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <Label
                    htmlFor="hotelWebsite"
                    className="text-xs sm:text-sm font-semibold"
                  >
                    Digital Presence
                  </Label>
                  <Input
                    id="hotelWebsite"
                    value={"www.Omeraluxury.com"}
                    readOnly
                    className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                  />
                </div>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <Label
                  htmlFor="hotelAddress"
                  className="text-xs sm:text-sm font-semibold"
                >
                  Property Address
                </Label>
                <Input
                  id="hotelAddress"
                  value={settings?.address_english || ""}
                  onChange={(e) =>
                    updateField("address_english", e.target.value)
                  }
                  className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2 sm:space-y-3">
                  <Label
                    htmlFor="totalRooms"
                    className="text-xs sm:text-sm font-semibold"
                  >
                    Room Inventory
                  </Label>
                  <Input
                    id="totalRooms"
                    type="number"
                    value={settings?.total_rooms ?? 0}
                    onChange={(e) =>
                      updateField("total_rooms", parseInt(e.target.value) || 0)
                    }
                    className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <Label
                    htmlFor="starRating"
                    className="text-xs sm:text-sm font-semibold"
                  >
                    Accreditation Level
                  </Label>
                  <Select
                    value={String(settings?.star_rating || 0)}
                    onValueChange={(v) =>
                      updateField("star_rating", parseInt(v))
                    }
                  >
                    <SelectTrigger
                      id="starRating"
                      className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">⭐ 3 Star Premium</SelectItem>
                      <SelectItem value="4">⭐⭐ 4 Star Luxury</SelectItem>
                      <SelectItem value="5">
                        ⭐⭐⭐ 5 Star Excellence
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
                <Button
                  disabled={saving}
                  onClick={handleSave}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-lg sm:rounded-xl text-sm sm:text-base order-1 sm:order-1"
                >
                  <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  {saving ? "Saving..." : "Apply Configuration"}
                </Button>
                <Button
                  variant="outline"
                  className="rounded-lg sm:rounded-xl border-slate-300 dark:border-slate-600 text-sm sm:text-base order-2 sm:order-2"
                >
                  <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="localization" className="space-y-4 sm:space-y-6">
          <Card className="border-0 bg-white dark:bg-slate-800 shadow-lg sm:shadow-2xl rounded-xl sm:rounded-3xl">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-3 text-slate-800 dark:text-white text-xl sm:text-2xl">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                  <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl">
                    Regional & Language Configuration
                  </div>
                  <CardDescription className="text-sm sm:text-lg">
                    Adapt system behavior to local requirements and preferences
                  </CardDescription>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="space-y-2 sm:space-y-3">
                <Label
                  htmlFor="defaultLanguage"
                  className="text-xs sm:text-sm font-semibold"
                >
                  Primary Interface Language
                </Label>
                <Select defaultValue="en">
                  <SelectTrigger
                    id="defaultLanguage"
                    className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English (International)</SelectItem>
                    <SelectItem value="am">አማርኛ (Amharic)</SelectItem>
                    <SelectItem value="om">Afaan Oromoo (Oromo)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg sm:rounded-2xl border border-slate-200 dark:border-slate-600">
                <div className="space-y-1">
                  <Label className="text-xs sm:text-sm font-semibold">
                    Multi-language Interface
                  </Label>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    Enable dynamic language switching for users
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2 sm:space-y-3">
                <Label
                  htmlFor="calendarSystem"
                  className="text-xs sm:text-sm font-semibold"
                >
                  Calendar System Preference
                </Label>
                <Select defaultValue="both">
                  <SelectTrigger
                    id="calendarSystem"
                    className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gregorian">
                      Gregorian International
                    </SelectItem>
                    <SelectItem value="ethiopian">
                      Ethiopian Traditional
                    </SelectItem>
                    <SelectItem value="both">Dual Calendar Display</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <Label
                  htmlFor="timezone"
                  className="text-xs sm:text-sm font-semibold"
                >
                  Operational Time Zone
                </Label>
                <Select defaultValue="eat">
                  <SelectTrigger
                    id="timezone"
                    className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eat">
                      East Africa Time (EAT) - UTC+3
                    </SelectItem>
                    <SelectItem value="utc">
                      Coordinated Universal Time (UTC)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg sm:rounded-xl text-sm sm:text-base">
                <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Update Regional Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4 sm:space-y-6">
          <Card className="border-0 bg-white dark:bg-slate-800 shadow-lg sm:shadow-2xl rounded-xl sm:rounded-3xl">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-3 text-slate-800 dark:text-white text-xl sm:text-2xl">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl sm:rounded-2xl w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl">
                    Financial Operations
                  </div>
                  <CardDescription className="text-sm sm:text-lg">
                    Tax, currency, and financial compliance configuration
                  </CardDescription>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2 sm:space-y-3">
                  <Label
                    htmlFor="primaryCurrency"
                    className="text-xs sm:text-sm font-semibold"
                  >
                    Primary Currency
                  </Label>
                  <Select defaultValue="etb">
                    <SelectTrigger
                      id="primaryCurrency"
                      className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="etb">Ethiopian Birr (ETB)</SelectItem>
                      <SelectItem value="usd">US Dollar (USD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <Label
                    htmlFor="vatRate"
                    className="text-xs sm:text-sm font-semibold"
                  >
                    VAT Rate (%)
                  </Label>
                  <Input
                    id="vatRate"
                    type="number"
                    defaultValue="15"
                    className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2 sm:space-y-3">
                  <Label
                    htmlFor="vatNumber"
                    className="text-xs sm:text-sm font-semibold"
                  >
                    VAT Registration
                  </Label>
                  <Input
                    id="vatNumber"
                    placeholder="Enter VAT registration number"
                    className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <Label
                    htmlFor="tinNumber"
                    className="text-xs sm:text-sm font-semibold"
                  >
                    Tax Identification
                  </Label>
                  <Input
                    id="tinNumber"
                    placeholder="Enter Tax Identification Number"
                    className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2 sm:space-y-3">
                  <Label
                    htmlFor="exchangeRate"
                    className="text-xs sm:text-sm font-semibold"
                  >
                    USD/ETB Exchange
                  </Label>
                  <Input
                    id="exchangeRate"
                    type="number"
                    step="0.01"
                    defaultValue="56.50"
                    className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                  />
                </div>
                <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg sm:rounded-2xl border border-slate-200 dark:border-slate-600">
                  <div className="space-y-1">
                    <Label className="text-xs sm:text-sm font-semibold">
                      Auto Currency Updates
                    </Label>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      Fetch live exchange rates
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg sm:rounded-2xl border border-slate-200 dark:border-slate-600">
                <div className="space-y-1">
                  <Label className="text-xs sm:text-sm font-semibold">
                    Multi-Currency Operations
                  </Label>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    Accept payments in ETB and USD simultaneously
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 rounded-lg sm:rounded-xl text-sm sm:text-base">
                <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Update Financial Settings
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white dark:bg-slate-800 shadow-lg sm:shadow-2xl rounded-xl sm:rounded-3xl">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-slate-800 dark:text-white text-lg sm:text-xl">
                Billing & Invoice Configuration
              </CardTitle>
              <CardDescription className="text-sm sm:text-lg">
                Invoice formatting and compliance requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="space-y-2 sm:space-y-3">
                <Label
                  htmlFor="invoicePrefix"
                  className="text-xs sm:text-sm font-semibold"
                >
                  Invoice Numbering
                </Label>
                <Input
                  id="invoicePrefix"
                  defaultValue="INV-"
                  className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                />
              </div>
              <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg sm:rounded-2xl border border-slate-200 dark:border-slate-600">
                <div className="space-y-1">
                  <Label className="text-xs sm:text-sm font-semibold">
                    Ethiopian VAT Compliance
                  </Label>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    Include all mandatory VAT information on invoices
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 rounded-lg sm:rounded-xl text-sm sm:text-base">
                <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Update Billing Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 sm:space-y-6">
          <Card className="border-0 bg-white dark:bg-slate-800 shadow-lg sm:shadow-2xl rounded-xl sm:rounded-3xl">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-3 text-slate-800 dark:text-white text-xl sm:text-2xl">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                  <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl">
                    Alert & Notification Center
                  </div>
                  <CardDescription className="text-sm sm:text-lg">
                    Configure system-wide notification preferences and channels
                  </CardDescription>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {[
                {
                  label: "New Booking Alerts",
                  desc: "Instant notification for new reservations",
                  default: true,
                },
                {
                  label: "Arrival/Departure Alerts",
                  desc: "Front desk notifications for guest movements",
                  default: true,
                },
                {
                  label: "Inventory Threshold Alerts",
                  desc: "Notify when supplies reach critical levels",
                  default: true,
                },
                {
                  label: "Maintenance Request Routing",
                  desc: "Direct maintenance issues to appropriate teams",
                  default: true,
                },
                {
                  label: "SMS Gateway Integration",
                  desc: "Enable SMS alerts (requires provider setup)",
                  default: false,
                },
                {
                  label: "Telegram Bot Integration",
                  desc: "Push notifications via Telegram",
                  default: false,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg sm:rounded-2xl border border-slate-200 dark:border-slate-600"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <Label className="text-xs sm:text-sm font-semibold">
                      {item.label}
                    </Label>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      {item.desc}
                    </p>
                  </div>
                  <Switch
                    defaultChecked={item.default}
                    className="ml-2 sm:ml-4 flex-shrink-0"
                  />
                </div>
              ))}
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg sm:rounded-xl text-sm sm:text-base">
                <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Update Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 sm:space-y-6">
          <Card className="border-0 bg-white dark:bg-slate-800 shadow-lg sm:shadow-2xl rounded-xl sm:rounded-3xl">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-3 text-slate-800 dark:text-white text-xl sm:text-2xl">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl sm:rounded-2xl w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl">
                    Security & Access Control
                  </div>
                  <CardDescription className="text-sm sm:text-lg">
                    Authentication, authorization, and security protocols
                  </CardDescription>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg sm:rounded-2xl border border-slate-200 dark:border-slate-600">
                <div className="space-y-1 flex-1 min-w-0">
                  <Label className="text-xs sm:text-sm font-semibold">
                    Two-Factor Authentication
                  </Label>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    Require 2FA for administrative accounts
                  </p>
                </div>
                <Switch className="ml-2 sm:ml-4 flex-shrink-0" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg sm:rounded-2xl border border-slate-200 dark:border-slate-600 gap-2 sm:gap-4">
                <div className="space-y-1 flex-1 min-w-0">
                  <Label className="text-xs sm:text-sm font-semibold">
                    Session Management
                  </Label>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    Auto logout after inactivity period
                  </p>
                </div>
                <Select defaultValue="30" className="w-full sm:w-[180px]">
                  <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="never">Continuous</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg sm:rounded-2xl border border-slate-200 dark:border-slate-600">
                <div className="space-y-1 flex-1 min-w-0">
                  <Label className="text-xs sm:text-sm font-semibold">
                    Activity Auditing
                  </Label>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    Comprehensive user action tracking
                  </p>
                </div>
                <Switch defaultChecked className="ml-2 sm:ml-4 flex-shrink-0" />
              </div>
              <div className="space-y-2 sm:space-y-3">
                <Label
                  htmlFor="minPasswordLength"
                  className="text-xs sm:text-sm font-semibold"
                >
                  Password Security Policy
                </Label>
                <Input
                  id="minPasswordLength"
                  type="number"
                  min="6"
                  max="20"
                  defaultValue="8"
                  className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base"
                />
              </div>
              <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 rounded-lg sm:rounded-xl text-sm sm:text-base">
                <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Update Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
