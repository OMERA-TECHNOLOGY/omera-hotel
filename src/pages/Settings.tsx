import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings as SettingsIcon, Globe, DollarSign, Shield, Bell } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <SettingsIcon className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">Configure hotel management system preferences</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="localization">Localization</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Hotel Information</CardTitle>
              <CardDescription>Basic information about your hotel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hotelName">Hotel Name</Label>
                  <Input id="hotelName" defaultValue="Kerayu Hotel" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hotelEmail">Contact Email</Label>
                  <Input id="hotelEmail" type="email" defaultValue="info@kerayuhotel.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hotelPhone">Phone Number</Label>
                  <Input id="hotelPhone" defaultValue="+251 11 123 4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hotelWebsite">Website</Label>
                  <Input id="hotelWebsite" defaultValue="www.kerayuhotel.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hotelAddress">Address</Label>
                <Input id="hotelAddress" defaultValue="Bole Road, Addis Ababa, Ethiopia" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalRooms">Total Rooms</Label>
                  <Input id="totalRooms" type="number" defaultValue="60" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="starRating">Star Rating</Label>
                  <Select defaultValue="5">
                    <SelectTrigger id="starRating">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Star</SelectItem>
                      <SelectItem value="4">4 Star</SelectItem>
                      <SelectItem value="5">5 Star</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="localization" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <CardTitle>Language & Regional Settings</CardTitle>
              </div>
              <CardDescription>Configure language and calendar preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultLanguage">Default System Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="defaultLanguage">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="am">አማርኛ (Amharic)</SelectItem>
                    <SelectItem value="om">Afaan Oromoo (Oromo)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Multi-language Support</Label>
                  <p className="text-sm text-muted-foreground">Allow users to switch languages</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="calendarSystem">Calendar System</Label>
                <Select defaultValue="both">
                  <SelectTrigger id="calendarSystem">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gregorian">Gregorian Only</SelectItem>
                    <SelectItem value="ethiopian">Ethiopian Only</SelectItem>
                    <SelectItem value="both">Both Calendars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Time Zone</Label>
                <Select defaultValue="eat">
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eat">East Africa Time (EAT) - UTC+3</SelectItem>
                    <SelectItem value="utc">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                <CardTitle>Financial Configuration</CardTitle>
              </div>
              <CardDescription>VAT, currency, and payment settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryCurrency">Primary Currency</Label>
                  <Select defaultValue="etb">
                    <SelectTrigger id="primaryCurrency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="etb">Ethiopian Birr (ETB)</SelectItem>
                      <SelectItem value="usd">US Dollar (USD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vatRate">VAT Rate (%)</Label>
                  <Input id="vatRate" type="number" defaultValue="15" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vatNumber">VAT Registration Number</Label>
                <Input id="vatNumber" placeholder="Enter VAT registration number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tinNumber">TIN Number</Label>
                <Input id="tinNumber" placeholder="Enter Tax Identification Number" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exchangeRate">USD to ETB Exchange Rate</Label>
                  <Input id="exchangeRate" type="number" step="0.01" defaultValue="56.50" />
                </div>
                <div className="flex items-center justify-between pt-7">
                  <Label>Auto-update Exchange Rate</Label>
                  <Switch />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Multi-Currency Transactions</Label>
                  <p className="text-sm text-muted-foreground">Accept payments in ETB and USD</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button>Save Settings</Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Invoice Configuration</CardTitle>
              <CardDescription>Invoice format and compliance settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invoicePrefix">Invoice Number Prefix</Label>
                <Input id="invoicePrefix" defaultValue="INV-" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Ethiopian VAT Compliant Format</Label>
                  <p className="text-sm text-muted-foreground">Include all required VAT information</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <CardTitle>Notification Preferences</CardTitle>
              </div>
              <CardDescription>Configure system notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Booking Notifications</Label>
                  <p className="text-sm text-muted-foreground">Alert when new booking is created</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Check-in/Check-out Alerts</Label>
                  <p className="text-sm text-muted-foreground">Notify front desk of arrivals and departures</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Low Inventory Alerts</Label>
                  <p className="text-sm text-muted-foreground">Notify when supplies are running low</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Request Notifications</Label>
                  <p className="text-sm text-muted-foreground">Alert maintenance team of reported issues</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send SMS alerts (requires integration)</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Telegram Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send alerts via Telegram bot</p>
                </div>
                <Switch />
              </div>
              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <CardTitle>Security Settings</CardTitle>
              </div>
              <CardDescription>Authentication and access control</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication (2FA)</Label>
                  <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Session Timeout</Label>
                  <p className="text-sm text-muted-foreground">Auto logout after inactivity</p>
                </div>
                <Select defaultValue="30">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Activity Logging</Label>
                  <p className="text-sm text-muted-foreground">Track all user actions</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minPasswordLength">Minimum Password Length</Label>
                <Input id="minPasswordLength" type="number" min="6" max="20" defaultValue="8" />
              </div>
              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Settings
