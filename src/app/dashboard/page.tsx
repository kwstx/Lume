"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  TrendingUp,
  Mail,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Clock,
  Plus,
  Calendar,
  Bell,
  Search,
  Filter,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const statsCards = [
  {
    title: "Total Subscribers",
    value: "12,847",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "violet",
  },
  {
    title: "Paid Subscribers",
    value: "2,340",
    change: "+8.2%",
    trend: "up",
    icon: DollarSign,
    color: "emerald",
  },
  {
    title: "Open Rate",
    value: "48.6%",
    change: "+3.1%",
    trend: "up",
    icon: Mail,
    color: "blue",
  },
  {
    title: "Growth Rate",
    value: "+234",
    change: "-2.4%",
    trend: "down",
    icon: TrendingUp,
    color: "amber",
  },
];

const growthData = [
  { name: "Jan", subscribers: 8400, paid: 1800 },
  { name: "Feb", subscribers: 9100, paid: 1950 },
  { name: "Mar", subscribers: 9800, paid: 2050 },
  { name: "Apr", subscribers: 10200, paid: 2100 },
  { name: "May", subscribers: 11500, paid: 2200 },
  { name: "Jun", subscribers: 12847, paid: 2340 },
];

const engagementData = [
  { day: "Mon", opens: 65, clicks: 42 },
  { day: "Tue", opens: 72, clicks: 48 },
  { day: "Wed", opens: 58, clicks: 35 },
  { day: "Thu", opens: 84, clicks: 62 },
  { day: "Fri", opens: 78, clicks: 55 },
  { day: "Sat", opens: 45, clicks: 28 },
  { day: "Sun", opens: 52, clicks: 32 },
];

const recentSubscribers = [
  {
    name: "Emma Wilson",
    email: "emma@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    type: "paid",
    date: "2 min ago",
  },
  {
    name: "Alex Thompson",
    email: "alex@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    type: "free",
    date: "15 min ago",
  },
  {
    name: "Sophie Chen",
    email: "sophie@example.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    type: "paid",
    date: "1 hour ago",
  },
  {
    name: "Marcus Johnson",
    email: "marcus@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    type: "free",
    date: "3 hours ago",
  },
];

const upcomingTasks = [
  {
    title: "Re-engagement Campaign",
    description: "Send to 234 inactive subscribers",
    time: "Today, 2:00 PM",
    priority: "high",
  },
  {
    title: "Weekly Newsletter",
    description: "Draft due for review",
    time: "Tomorrow, 10:00 AM",
    priority: "medium",
  },
  {
    title: "Survey Follow-up",
    description: "Reach out to 45 respondents",
    time: "Dec 20, 9:00 AM",
    priority: "low",
  },
];

const segments = [
  { name: "Highly Engaged", count: 3240, percent: 25, color: "bg-emerald-500" },
  { name: "Active Readers", count: 5890, percent: 46, color: "bg-violet-500" },
  { name: "Occasional", count: 2540, percent: 20, color: "bg-amber-500" },
  { name: "At Risk", count: 1177, percent: 9, color: "bg-rose-500" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Good morning, John
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your newsletter today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="h-10 w-64 pl-9 pr-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-xl">
            <Bell className="w-4 h-4" />
          </Button>
          <Button className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-rose-500" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stat.trend === "up" ? "text-emerald-500" : "text-rose-500"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-xs text-muted-foreground">vs last month</span>
                  </div>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    stat.color === "violet"
                      ? "bg-violet-100 text-violet-600"
                      : stat.color === "emerald"
                      ? "bg-emerald-100 text-emerald-600"
                      : stat.color === "blue"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-amber-100 text-amber-600"
                  }`}
                >
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Subscriber Growth</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-xs h-8">
                Week
              </Button>
              <Button variant="secondary" size="sm" className="text-xs h-8">
                Month
              </Button>
              <Button variant="ghost" size="sm" className="text-xs h-8">
                Year
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="colorSubscribers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="subscribers"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSubscribers)"
                  />
                  <Area
                    type="monotone"
                    dataKey="paid"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorPaid)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-violet-500" />
                <span className="text-sm text-muted-foreground">Total Subscribers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-sm text-muted-foreground">Paid Subscribers</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Audience Segments</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-5">
              {segments.map((segment) => (
                <div key={segment.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{segment.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {segment.count.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={`h-full rounded-full ${segment.color}`}
                      style={{ width: `${segment.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-6 rounded-xl">
              View All Segments
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Weekly Engagement</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Filter className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData}>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar dataKey="opens" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="clicks" fill="#c4b5fd" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-violet-500" />
                <span className="text-xs text-muted-foreground">Opens</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-violet-300" />
                <span className="text-xs text-muted-foreground">Clicks</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Subscribers</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs h-8 text-violet-600">
              View All
            </Button>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-3">
              {recentSubscribers.map((subscriber, i) => (
                <div
                  key={subscriber.email}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/60 transition-colors"
                >
                  <Avatar className="w-9 h-9">
                    <AvatarImage src={subscriber.avatar} alt={subscriber.name} />
                    <AvatarFallback>{subscriber.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{subscriber.name}</span>
                      <Badge
                        variant={subscriber.type === "paid" ? "default" : "secondary"}
                        className={`text-[10px] px-1.5 py-0 h-4 ${
                          subscriber.type === "paid"
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                            : ""
                        }`}
                      >
                        {subscriber.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{subscriber.email}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {subscriber.date}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Upcoming Tasks</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Calendar className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-3">
              {upcomingTasks.map((task, i) => (
                <div
                  key={task.title}
                  className="p-3 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-sm font-medium">{task.title}</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 h-4 ${
                        task.priority === "high"
                          ? "border-rose-300 text-rose-600"
                          : task.priority === "medium"
                          ? "border-amber-300 text-amber-600"
                          : "border-slate-300 text-slate-600"
                      }`}
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {task.time}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
