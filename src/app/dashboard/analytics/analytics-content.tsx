"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Mail,
    MousePointer,
    Users,
    DollarSign,
    Calendar,
    Download,
    Lightbulb,
    ChevronDown,
    Activity,
    Target,
    MoreHorizontal,
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";

interface AnalyticsContentProps {
    metrics: any;
    growthData: any[];
    engagementTrend: any[];
    contentPerformance: any[];
    engagementData: any[];
}

export default function AnalyticsContent({ metrics, growthData, engagementTrend, contentPerformance, engagementData }: AnalyticsContentProps) {

    const kpiCards = [
        {
            title: "Open Rate",
            value: metrics?.openRate || "0%",
            change: metrics?.openRateTrend || "0%",
            trend: "up",
            icon: Mail,
            color: "text-blue-600",
            bg: "bg-blue-50",
            hoverBorder: "hover:border-blue-100"
        },
        {
            title: "Click Rate",
            value: metrics?.clickRate || "0%",
            change: metrics?.clickRateTrend || "0%",
            trend: "up",
            icon: MousePointer,
            color: "text-pink-600",
            bg: "bg-pink-50",
            hoverBorder: "hover:border-pink-100"
        },
        {
            title: "Subscribers",
            value: (metrics?.totalSubscribers || 0).toLocaleString(),
            change: metrics?.subscriberTrend || "0%",
            trend: "up",
            icon: Users,
            color: "text-green-600",
            bg: "bg-green-50",
            hoverBorder: "hover:border-green-100"
        },
        {
            title: "Revenue",
            value: `$${(metrics?.grossVolume || 0).toLocaleString()}`,
            change: metrics?.volumeTrend || "0%",
            trend: "up",
            icon: DollarSign,
            color: "text-orange-600",
            bg: "bg-orange-50",
            hoverBorder: "hover:border-orange-100"
        },
    ];

    const handleExport = () => {
        // 1. Summary Metrics Headers
        let csvContent = "Metric,Value,Trend\n";
        csvContent += `Open Rate,${metrics?.openRate || "0%"},${metrics?.openRateTrend || "0%"}\n`;
        csvContent += `Growth,${metrics?.subscriberTrend || "0%"}\n`; // metrics doesn't have total numeric formatted cleanly here, but good enough
        csvContent += `Total Subscribers,${metrics?.totalSubscribers || 0},${metrics?.subscriberTrend || "0%"}\n`;
        csvContent += `Revenue,${metrics?.grossVolume || 0},${metrics?.volumeTrend || "0%"}\n`;

        csvContent += "\n\n";

        // 2. Daily Data Headers
        csvContent += "Date,Opens,Clicks\n";
        engagementData.forEach(row => {
            csvContent += `${row.date},${row.avgOpenRate},${row.totalClicks}\n`;
        });

        // 3. Create Download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `analytics_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Reports</h1>
                    </div>
                    <p className="text-sm text-gray-400 font-medium">Deep dive into your newsletter performance.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full border-gray-100 shadow-sm font-bold text-gray-600 h-9 px-4 hover:bg-gray-50"
                        onClick={handleExport}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {kpiCards?.map((kpi) => (
                    <Card key={kpi.title} className={`border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-3xl p-6 group cursor-default border border-gray-50 transition-all ${kpi.hoverBorder}`}>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{kpi.title}</span>
                            <div className={`w-8 h-8 rounded-xl ${kpi.bg} flex items-center justify-center ${kpi.color} group-hover:scale-110 transition-transform`}>
                                <kpi.icon className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex items-end justify-between">
                            <p className="text-3xl font-bold text-gray-900 tracking-tight">{kpi.value}</p>
                            <Badge className={`${kpi.trend === "up" ? 'bg-green-50 text-green-600' : 'bg-pink-50 text-pink-600'} border-none font-bold rounded-lg`}>
                                {kpi.change}
                            </Badge>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-12 gap-6">
                <Card className="col-span-12 lg:col-span-8 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2.5rem] p-8 border border-gray-100/50">
                    <div className="flex items-center justify-between mb-8">
                        <div className="space-y-1">
                            <CardTitle className="text-xl font-bold">Subscriber Growth</CardTitle>
                            <p className="text-sm font-medium text-gray-400">Total subscriber count over time</p>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-50">
                            <MoreHorizontal className="w-5 h-5 text-gray-400" />
                        </Button>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={growthData}>
                                <defs>
                                    <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 600 }}
                                />
                                <Tooltip
                                    cursor={{ stroke: '#E5E7EB' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#3B82F6"
                                    strokeWidth={3}
                                    fill="url(#growthGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Side Stats */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-3xl p-6 border border-gray-50">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center">
                                <Mail className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Avg Open Rate</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-2xl font-bold text-gray-900 tracking-tight">
                                        {engagementData.length > 0
                                            ? Math.round(engagementData.reduce((acc, curr) => acc + curr.avgOpenRate, 0) / engagementData.length)
                                            : 0}%
                                    </p>
                                    <span className="text-xs font-bold text-green-500">+1.2%</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-3xl p-6 border border-gray-50">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Churn Rate</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-2xl font-bold text-gray-900 tracking-tight">0.0%</p>
                                    <span className="text-xs font-bold text-gray-400">Stable</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 font-medium">Monthly average</p>
                    </Card>

                    {/* Fun Suggestion Card */}
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                        <div className="relative z-10">
                            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center mb-4 backdrop-blur-sm">
                                <Lightbulb className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-bold text-lg mb-2">Growth Tip</h3>
                            <p className="text-sm text-white/80 font-medium leading-relaxed mb-4">
                                {(() => {
                                    const openRate = parseInt(metrics?.openRate) || 0;
                                    const clickRate = parseInt(metrics?.clickRate) || 0;
                                    const subs = metrics?.totalSubscribers || 0;

                                    if (subs === 0) return "Start by importing your existing contacts or asking 5 friends to subscribe. Your first readers are crucial.";
                                    if (openRate < 15) return "Your open rate is under 15%. Try personalizing subject lines with the subscriber's name to boost curiosity.";
                                    if (clickRate < 1) return "Low click rate? Try placing your main link in the 'P.S.' section—it's often the most read part of an email.";
                                    if (parseInt(metrics?.subscriberTrend) < 0) return "Churn is normal, but high churn means mismatched expectations. Review your welcome email promise.";

                                    return "Tuesday mornings often see the highest engagement rates. Try scheduling your next post for 10 AM ET.";
                                })()}
                            </p>
                            <Button size="sm" variant="secondary" className="rounded-full bg-white text-violet-600 hover:bg-violet-50 font-bold border-none" onClick={() => window.location.href = '/dashboard/outreach'}>
                                Schedule Post
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
