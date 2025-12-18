"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Mail,
  MousePointer,
  Users,
  DollarSign,
  Calendar,
  Download,
  Lightbulb,
  ChevronRight,
  BarChart3,
  PieChart,
  Activity,
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const kpiCards = [
  {
    title: "Open Rate",
    value: "48.6%",
    change: "+5.2%",
    trend: "up",
    benchmark: "Industry avg: 21.5%",
    icon: Mail,
    color: "violet",
  },
  {
    title: "Click Rate",
    value: "12.8%",
    change: "+2.1%",
    trend: "up",
    benchmark: "Industry avg: 2.6%",
    icon: MousePointer,
    color: "blue",
  },
  {
    title: "Subscriber Growth",
    value: "+847",
    change: "+18.3%",
    trend: "up",
    benchmark: "This month",
    icon: Users,
    color: "emerald",
  },
  {
    title: "Revenue",
    value: "$12,480",
    change: "-3.2%",
    trend: "down",
    benchmark: "From paid subs",
    icon: DollarSign,
    color: "amber",
  },
];

const growthData = [
  { month: "Jul", total: 8200, paid: 1650, free: 6550 },
  { month: "Aug", total: 9100, paid: 1820, free: 7280 },
  { month: "Sep", total: 9800, paid: 1960, free: 7840 },
  { month: "Oct", total: 10600, paid: 2120, free: 8480 },
  { month: "Nov", total: 11800, paid: 2240, free: 9560 },
  { month: "Dec", total: 12847, paid: 2340, free: 10507 },
];

const engagementTrend = [
  { week: "W1", openRate: 45, clickRate: 10 },
  { week: "W2", openRate: 48, clickRate: 11 },
  { week: "W3", openRate: 42, clickRate: 9 },
  { week: "W4", openRate: 52, clickRate: 14 },
  { week: "W5", openRate: 49, clickRate: 13 },
  { week: "W6", openRate: 51, clickRate: 12 },
];

const contentPerformance = [
  { topic: "Tech Tutorials", opens: 62, clicks: 18, conversions: 4 },
  { topic: "Industry News", opens: 48, clicks: 12, conversions: 2 },
  { topic: "Productivity Tips", opens: 55, clicks: 15, conversions: 3 },
  { topic: "Case Studies", opens: 58, clicks: 20, conversions: 5 },
  { topic: "Opinion Pieces", opens: 40, clicks: 8, conversions: 1 },
];

const deviceData = [
  { name: "Mobile", value: 58, color: "#8b5cf6" },
  { name: "Desktop", value: 35, color: "#3b82f6" },
  { name: "Tablet", value: 7, color: "#10b981" },
];

const conversionFunnel = [
  { stage: "Email Sent", value: 12847, percent: 100 },
  { stage: "Opened", value: 6244, percent: 48.6 },
  { stage: "Clicked", value: 1644, percent: 12.8 },
  { stage: "Converted", value: 234, percent: 1.8 },
];

const insights = [
  {
    type: "success",
    title: "Case Studies drive highest conversions",
    description:
      "Your case study content has 5x higher conversion rate. Consider publishing more case studies.",
    action: "View Top Performing Posts",
  },
  {
    type: "warning",
    title: "20% inactive subscribers detected",
    description:
      "1,177 subscribers haven't opened in 30+ days. Send a re-engagement campaign to win them back.",
    action: "Create Re-engagement Campaign",
  },
  {
    type: "info",
    title: "Best send time: Tuesday 9 AM",
    description:
      "Your emails sent on Tuesday mornings have 23% higher open rates than other days.",
    action: "Schedule Next Email",
  },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track performance and discover growth opportunities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="30d">
            <SelectTrigger className="w-[150px] rounded-xl">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="rounded-xl">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title} className="border-border/50 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                  <p className="text-3xl font-bold mt-1">{kpi.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {kpi.trend === "up" ? (
                      <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-rose-500" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        kpi.trend === "up" ? "text-emerald-500" : "text-rose-500"
                      }`}
                    >
                      {kpi.change}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{kpi.benchmark}</p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    kpi.color === "violet"
                      ? "bg-violet-100 text-violet-600"
                      : kpi.color === "blue"
                      ? "bg-blue-100 text-blue-600"
                      : kpi.color === "emerald"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-amber-100 text-amber-600"
                  }`}
                >
                  <kpi.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {insights.map((insight, i) => (
          <Card
            key={i}
            className={`border-border/50 shadow-sm ${
              insight.type === "success"
                ? "border-l-4 border-l-emerald-500"
                : insight.type === "warning"
                ? "border-l-4 border-l-amber-500"
                : "border-l-4 border-l-blue-500"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    insight.type === "success"
                      ? "bg-emerald-100"
                      : insight.type === "warning"
                      ? "bg-amber-100"
                      : "bg-blue-100"
                  }`}
                >
                  <Lightbulb
                    className={`w-4 h-4 ${
                      insight.type === "success"
                        ? "text-emerald-600"
                        : insight.type === "warning"
                        ? "text-amber-600"
                        : "text-blue-600"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{insight.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-xs text-violet-600 mt-2"
                  >
                    {insight.action}
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-violet-600" />
              Subscriber Growth
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button variant="secondary" size="sm" className="text-xs h-7 rounded-lg">
                Total
              </Button>
              <Button variant="ghost" size="sm" className="text-xs h-7 rounded-lg">
                Paid
              </Button>
              <Button variant="ghost" size="sm" className="text-xs h-7 rounded-lg">
                Free
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
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
                    dataKey="total"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="url(#totalGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Engagement Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementTrend}>
                  <XAxis
                    dataKey="week"
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
                  <Line
                    type="monotone"
                    dataKey="openRate"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: "#8b5cf6", strokeWidth: 0 }}
                    name="Open Rate %"
                  />
                  <Line
                    type="monotone"
                    dataKey="clickRate"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", strokeWidth: 0 }}
                    name="Click Rate %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-violet-500" />
                <span className="text-sm text-muted-foreground">Open Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm text-muted-foreground">Click Rate</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-600" />
              Device Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-4 mt-4">
              {deviceData.map((device) => (
                <div key={device.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: device.color }}
                  />
                  <span className="text-sm">
                    {device.name} ({device.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Content Performance</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {contentPerformance.map((content) => (
                <div key={content.topic} className="flex items-center gap-4">
                  <div className="w-32 text-sm font-medium truncate">{content.topic}</div>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Opens</span>
                        <span>{content.opens}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-violet-500"
                          style={{ width: `${content.opens}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Clicks</span>
                        <span>{content.clicks}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${content.clicks * 5}%` }}
                        />
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                      {content.conversions} conv.
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between gap-4">
            {conversionFunnel.map((stage, i) => (
              <div key={stage.stage} className="flex-1 text-center">
                <div
                  className={`mx-auto mb-3 rounded-xl flex items-center justify-center ${
                    i === 0
                      ? "w-full h-20 bg-violet-500"
                      : i === 1
                      ? "w-[85%] h-20 bg-violet-400"
                      : i === 2
                      ? "w-[70%] h-20 bg-violet-300"
                      : "w-[55%] h-20 bg-emerald-500"
                  }`}
                >
                  <span className="text-white font-bold">{stage.percent}%</span>
                </div>
                <div className="font-medium text-sm">{stage.stage}</div>
                <div className="text-xs text-muted-foreground">
                  {stage.value.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
