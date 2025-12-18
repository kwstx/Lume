"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Link2,
  Mail,
  Smartphone,
  Globe,
  Key,
  Trash2,
  Download,
  ChevronRight,
  Check,
  ExternalLink,
} from "lucide-react";

const integrations = [
  {
    name: "Substack",
    description: "Connect your Substack account to sync subscribers",
    icon: "https://substackcdn.com/image/fetch/w_256,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack.com%2Fimg%2Fsubstack.png",
    connected: true,
    lastSync: "2 minutes ago",
  },
  {
    name: "Zapier",
    description: "Automate workflows with 5,000+ apps",
    icon: "https://cdn.zapier.com/zapier/images/favicon.ico",
    connected: false,
    lastSync: null,
  },
  {
    name: "Google Sheets",
    description: "Export subscriber data to spreadsheets",
    icon: "https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png",
    connected: true,
    lastSync: "1 day ago",
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-violet-600" />
            Profile
          </CardTitle>
          <CardDescription>Your personal information and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm" className="rounded-lg">
                Change Photo
              </Button>
              <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Full Name</label>
              <input
                type="text"
                defaultValue="John Doe"
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <input
                type="email"
                defaultValue="john@newsletter.co"
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Newsletter Name</label>
              <input
                type="text"
                defaultValue="The Tech Insider"
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Timezone</label>
              <input
                type="text"
                defaultValue="America/New_York (EST)"
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              />
            </div>
          </div>
          <Button className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white">
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-violet-600" />
            Notifications
          </CardTitle>
          <CardDescription>Configure how you want to be notified</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email Notifications</p>
                <p className="text-xs text-muted-foreground">Receive updates via email</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Push Notifications</p>
                <p className="text-xs text-muted-foreground">Get instant alerts on your device</p>
              </div>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Weekly Digest</p>
                <p className="text-xs text-muted-foreground">Weekly summary of your metrics</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-violet-600" />
            Integrations
          </CardTitle>
          <CardDescription>Connect external services and tools</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center overflow-hidden">
                  <img
                    src={integration.icon}
                    alt={integration.name}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{integration.name}</p>
                    {integration.connected && (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                        <Check className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{integration.description}</p>
                  {integration.lastSync && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Last synced: {integration.lastSync}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant={integration.connected ? "outline" : "default"}
                size="sm"
                className={`rounded-lg ${
                  !integration.connected
                    ? "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                    : ""
                }`}
              >
                {integration.connected ? "Manage" : "Connect"}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-violet-600" />
            Billing
          </CardTitle>
          <CardDescription>Manage your subscription and payment methods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-200 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Pro Plan</span>
                  <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100">Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  $29/month • Renews on Jan 15, 2025
                </p>
              </div>
              <Button variant="outline" size="sm" className="rounded-lg">
                Manage Plan
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                <p className="text-xs text-muted-foreground">Expires 12/2025</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">
              Update
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-violet-600" />
            Security
          </CardTitle>
          <CardDescription>Protect your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Password</p>
                <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-lg">
              Change
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-lg">
              Enable
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm border-rose-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-rose-600">
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl border border-rose-200 bg-rose-50">
            <div>
              <p className="text-sm font-medium">Export All Data</p>
              <p className="text-xs text-muted-foreground">Download all your subscriber data</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-lg">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl border border-rose-200 bg-rose-50">
            <div>
              <p className="text-sm font-medium text-rose-600">Delete Account</p>
              <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
            </div>
            <Button variant="destructive" size="sm" className="rounded-lg">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
