"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    MoreHorizontal,
    Plus,
    TrendingUp,
    Users,
    Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OnboardingWidget } from "@/components/onboarding/onboarding-widget";

const retentionData = [
    { name: "Jan", value: 0 },
    { name: "Feb", value: 0 },
    { name: "Mar", value: 0 },
    { name: "Apr", value: 0 },
    { name: "May", value: 0 },
    { name: "Jun", value: 0 },
    { name: "Jul", value: 0 },
];

const transactionsData = [
    { name: "M", value: 0 },
    { name: "T", value: 0 },
    { name: "W", value: 0 },
    { name: "T", value: 0 },
    { name: "F", value: 0 },
    { name: "S", value: 0 },
    { name: "S", value: 0 },
];

const customersData = [
    { name: "M", value: 0 },
    { name: "T", value: 0 },
    { name: "W", value: 0 },
    { name: "T", value: 0 },
    { name: "F", value: 0 },
    { name: "S", value: 0 },
    { name: "S", value: 0 },
];

interface DashboardContentProps {
    metrics: {
        totalSubscribers: number;
        subscriberTrend: string;
        paidSubscribers: number;
        paidTrend: string;
        grossVolume: number;
        volumeTrend: string;
        openRate: string;
        openRateTrend: string;
        clickRate: string;
        clickRateTrend: string;
        activity: { name: string; value: number }[];
        topPersonas: { name: string; val: number; color: string }[];
        trends?: any[]; // optional if still used elsewhere
    };
    range?: string;
    onboardingProgress?: any;
}

export default function DashboardContent({ metrics, range = 'week', onboardingProgress }: DashboardContentProps) {
    const { totalSubscribers = 0, paidSubscribers = 0, grossVolume = 0 } = metrics || {};

    const openRate = metrics?.openRate || "0%";
    const subscriberGrowth = metrics?.subscriberTrend || "+0%";
    const topPersonas = metrics?.topPersonas || [];

    const rangeLabel = range === 'week' ? 'Past 7 days' : range === 'month' ? 'Past 30 days' : 'Past 12 months';

    const handleRangeChange = (newRange: string) => {
        window.location.href = `/dashboard?range=${newRange.toLowerCase()}`;
    };

    return (
        <div className="space-y-6">
            <OnboardingWidget progress={onboardingProgress} />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Good morning, Creator</h1>
                    <p className="text-sm text-gray-400 font-medium">Here's what's happening with your newsletter today.</p>
                </div>
                <Button size="sm" className="rounded-full bg-black hover:bg-black/90 text-white px-5" onClick={() => window.location.href = '/dashboard/outreach'}>
                    <Plus className="w-4 h-4 mr-1.5" />
                    New Campaign
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Activity Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Activity Card */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50">
                        <div className="flex items-center justify-between mb-8">
                            <div className="space-y-1">
                                <span className="text-sm font-bold text-gray-900">Activity</span>
                                <p className="text-[10px] text-gray-400 font-medium h-10">
                                    You had <span className="text-gray-900">{(metrics?.activity?.reduce((acc: number, curr: any) => acc + curr.value, 0) || 0).toLocaleString()} Opens</span> this<br />
                                    {range}.
                                </p>
                            </div>
                            <div className="flex gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-100 h-fit">
                                {['Week', 'Month', 'Year'].map((t, i) => {
                                    const isActive = range === t.toLowerCase();
                                    return (
                                        <button
                                            key={t}
                                            onClick={() => handleRangeChange(t)}
                                            className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${isActive ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                                        >
                                            {t}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start gap-8">
                            <div className="pt-4">
                                {/* Use actual interaction count from today or total of the week? Let's sum the week. */}
                                <div className="text-4xl font-bold tracking-tight text-gray-900">
                                    {(metrics?.activity?.reduce((acc: number, curr: any) => acc + curr.value, 0) || 0).toLocaleString()}
                                </div>
                                <div className="mt-2 flex items-center gap-1.5 px-2 py-0.5 bg-green-50 rounded-full border border-green-100 w-fit">
                                    <TrendingUp className="w-3 h-3 text-green-500" />
                                    <span className="text-[10px] font-bold text-green-500">Active</span>
                                    <span className="text-[10px] font-medium text-gray-400">{rangeLabel}</span>
                                </div>
                            </div>

                            <div className="flex-1 w-full">
                                <div className="h-44 w-full relative flex items-end gap-3 px-2">
                                    {/* Use passed activity data or default empty array */}
                                    {(metrics?.activity?.length ? metrics.activity : Array(7).fill({ value: 0, name: '' })).map((h: any, i: number) => {
                                        // Calculate percentage relative to max value for height
                                        const maxVal = Math.max(...(metrics?.activity?.map((a: any) => a.value) || [100]), 1);
                                        const heightPct = Math.max((h.value / maxVal) * 100, 5); // Min 5% height

                                        return (
                                            <div key={i} className="flex-1 relative group h-full flex flex-col justify-end">
                                                {/* Tooltip */}
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                    <div className="bg-gray-900 text-white text-[9px] font-bold px-2 py-1 rounded-md shadow-lg whitespace-nowrap">
                                                        {h.value} Opens
                                                    </div>
                                                    <div className="w-1.5 h-1.5 rounded-full border-2 border-blue-500 bg-white" />
                                                </div>

                                                {/* Phantom Bar with Stripes */}
                                                <div
                                                    className="absolute inset-x-0 top-0 bottom-0 rounded-full opacity-40 transition-opacity group-hover:opacity-60"
                                                    style={{
                                                        background: `repeating-linear-gradient(135deg, transparent, transparent 4px, #3b82f6 4px, #3b82f6 5px)`,
                                                        opacity: 0.1
                                                    }}
                                                />

                                                {/* Blue Candle */}
                                                <div
                                                    className={`w-full rounded-full transition-all duration-700 relative z-0 bg-gradient-to-t from-blue-600 to-blue-400 shadow-[0_4px_12px_rgba(37,99,235,0.2)] group-hover:ring-4 group-hover:ring-blue-500/10`}
                                                    style={{ height: `${heightPct}%` }}
                                                >
                                                    {/* Inner Shine */}
                                                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="flex justify-between mt-4 px-1">
                                    {(metrics?.activity?.length ? metrics.activity : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(n => ({ name: n }))).map((m: any, i: number) => (
                                        // Use index as key fallback if names are duplicated (unlikely for days)
                                        <span key={i} className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">{m.name}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Subscribers Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 group hover:border-blue-100 transition-all cursor-pointer" onClick={() => window.location.href = '/dashboard/subscribers'}>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Subscribers</span>
                                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                    <Users className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <div className="text-3xl font-bold text-gray-900 tracking-tight">{totalSubscribers.toLocaleString()}</div>
                                    <div className="mt-2 flex items-center gap-1.5">
                                        <span className={`text-xs font-bold ${subscriberGrowth.startsWith('+') ? 'text-green-500' : 'text-gray-500'}`}>{subscriberGrowth}</span>
                                        <span className="text-[10px] font-medium text-gray-400">vs last month</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Open Rate Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 group hover:border-violet-100 transition-all cursor-pointer" onClick={() => window.location.href = '/dashboard/analytics'}>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Open Rate</span>
                                <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center text-violet-500 group-hover:bg-violet-500 group-hover:text-white transition-all">
                                    <Activity className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <div className="text-3xl font-bold text-gray-900 tracking-tight">{openRate}</div>
                                    <div className="mt-2 flex items-center gap-1.5">
                                        <span className={`text-xs font-bold ${typeof metrics?.openRateTrend === 'string' && metrics.openRateTrend.startsWith('+') ? 'text-green-500' : 'text-gray-500'}`}>{metrics?.openRateTrend || "0%"}</span>
                                        <span className="text-[10px] font-medium text-gray-400">vs average</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Total Volume */}
                    <div className="bg-gradient-to-br from-violet-600 to-purple-600 rounded-3xl p-6 text-white shadow-lg shadow-violet-200">
                        <div className="text-xs font-bold opacity-80 uppercase tracking-wider mb-2">Total Volume</div>
                        <div className="text-4xl font-bold mb-6">${grossVolume.toLocaleString()}</div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs font-bold">
                                <span className="opacity-70">Payouts</span>
                                <span>${(grossVolume * 0.9).toLocaleString()}</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full w-[85%] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                            </div>
                        </div>
                    </div>

                    {/* Top Personas */}
                    <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 cursor-pointer" onClick={() => window.location.href = '/dashboard/personas'}>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Top Personas</span>
                            <MoreHorizontal className="w-4 h-4 text-gray-300" />
                        </div>
                        <div className="space-y-4">
                            {topPersonas.length === 0 ? (
                                <p className="text-xs text-gray-400 font-medium pt-2">No personas generated yet.</p>
                            ) : (
                                topPersonas.map(p => (
                                    <div key={p.name} className="space-y-2">
                                        <div className="flex justify-between text-[11px] font-bold">
                                            <span className="text-gray-900">{p.name}</span>
                                            <span className="text-gray-400">{p.val}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                                            <div className={`h-full ${p.color} rounded-full`} style={{ width: `${p.val}%` }} />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
