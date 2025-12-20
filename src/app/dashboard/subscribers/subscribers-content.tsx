"use client";


import { useState } from "react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useRouter, useSearchParams } from "next/navigation";
import { createSegment, deleteSegment } from "@/actions/subscribers";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Trash2,
    UserPlus,
    Search,
    Filter,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    Users,
    Activity
} from "lucide-react";
import { ImportDialog } from "@/components/subscribers/import-dialog";
import { AddSubscriberDialog } from "@/components/subscribers/add-subscriber-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface Subscriber {
    id: string;
    name: string | null;
    email: string;
    status: string | null;
    engagement: string | null;
    openRate: number | null;
    joinedDate: Date | null;
    lastActive: Date | null;
    avatar?: string | null;
}

interface SubscribersContentProps {
    initialSubscribers: Subscriber[];
    initialSegments: any[];
    initialFilters: {
        query?: string;
        status?: string;
        engagement?: string;
        segmentId?: string;
    }
}

export default function SubscribersContent({ initialSubscribers, initialSegments, initialFilters }: SubscribersContentProps) {
    const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Filter State
    const [filters, setFilters] = useState(initialFilters);
    const [segments, setSegments] = useState(initialSegments);

    // Segment Dialog State
    const [saveSegmentOpen, setSaveSegmentOpen] = useState(false);
    const [segmentName, setSegmentName] = useState("");

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        // If changing manual filters, clear segment selection to avoid confusion
        if (key !== 'segmentId') {
            newFilters.segmentId = undefined;
        }
        setFilters(newFilters);
        updateUrl(newFilters);
    };

    const handleSegmentSelect = (segmentId: string) => {
        // Find criteria for this segment if needed, or just filter by ID
        // For simplicity, we just filter by segment ID primarily
        const newFilters = { ...filters, segmentId: segmentId === 'all' ? undefined : segmentId };
        setFilters(newFilters);
        updateUrl(newFilters);
    };

    const updateUrl = (currentFilters: any) => {
        const params = new URLSearchParams();
        if (currentFilters.query) params.set("query", currentFilters.query);
        if (currentFilters.status && currentFilters.status !== 'all') params.set("status", currentFilters.status);
        if (currentFilters.engagement && currentFilters.engagement !== 'all') params.set("engagement", currentFilters.engagement);
        if (currentFilters.segmentId) params.set("segment", currentFilters.segmentId);
        router.push(`?${params.toString()}`);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Debounce could be added here
        handleFilterChange("query", e.target.value);
    };

    const handleSaveSegment = async () => {
        if (!segmentName) return;
        const result = await createSegment(segmentName, {
            status: filters.status,
            engagement: filters.engagement
        }, filters);

        if (result.success) {
            toast.success("Segment saved!");
            setSegments([...segments, result.segment]);
            setSaveSegmentOpen(false);
            setSegmentName("");
        } else {
            toast.error("Failed to save segment");
        }
    };

    const handleDeleteSegment = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const result = await deleteSegment(id);
        if (result.success) {
            toast.success("Segment deleted");
            setSegments(segments.filter(s => s.id !== id));
            if (filters.segmentId === id) {
                handleFilterChange("segmentId", "");
            }
        }
    };

    const toggleSubscriber = (id: string) => {
        setSelectedSubscribers((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    // Clear filters helper
    const clearFilters = () => {
        const empty = { query: "", status: undefined, engagement: undefined, segmentId: undefined };
        setFilters(empty);
        updateUrl(empty);
    };

    const hasActiveFilters = filters.status || filters.engagement || filters.query;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Customers</h1>
                        {filters.segmentId && (
                            <Badge variant="outline" className="text-xs px-2.5 py-0.5 bg-blue-50 text-blue-700 border-blue-200 rounded-full">
                                {segments.find(s => s.id === filters.segmentId)?.name || 'Segment'}
                                <button onClick={clearFilters} className="ml-1.5 hover:text-blue-900">×</button>
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm text-gray-400 font-medium">Manage and segment your subscriber base.</p>
                </div>
                <div className="flex items-center gap-3">
                    <ImportDialog />
                    <AddSubscriberDialog />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Audience", value: initialSubscribers.length.toString(), growth: "+0%", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Paid Subs", value: initialSubscribers.filter(s => s.status === 'paid').length.toString(), growth: "+0%", icon: Checkbox, color: "text-green-600", bg: "bg-green-50" }, // Using Checkbox as placeholder icon
                    { label: "High Engagement", value: initialSubscribers.filter(s => s.engagement === 'high').length.toString(), growth: "+0%", icon: Activity, color: "text-pink-600", bg: "bg-pink-50" }, // Using Activity as placeholder
                    { label: "Churn Risk", value: "0", growth: "-0%", icon: Trash2, color: "text-orange-600", bg: "bg-orange-50" },
                ].map((stat) => (
                    <Card key={stat.label} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-3xl p-6 group cursor-default hover:border-gray-100 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
                            <div className={`w-8 h-8 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex items-end justify-between">
                            <p className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</p>
                            <Badge className={`${stat.growth.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-pink-50 text-pink-600'} border-none font-bold rounded-lg`}>
                                {stat.growth}
                            </Badge>
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2.5rem] overflow-hidden border border-gray-100/50">
                <div className="p-8 border-b border-gray-50 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email or tag..."
                                className="w-full h-12 pl-12 pr-4 rounded-full border border-gray-100 bg-gray-50/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                value={filters.query || ''}
                                onChange={handleSearch}
                            />
                        </div>

                        {/* Filters Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className={`rounded-full border-gray-100 h-11 px-6 font-bold ${hasActiveFilters ? 'text-blue-600 bg-blue-50 border-blue-200' : 'text-gray-600'}`}>
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filters
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56 rounded-2xl p-2">
                                <DropdownMenuLabel className="px-2 py-1.5 text-xs text-gray-400 uppercase">Status</DropdownMenuLabel>
                                <DropdownMenuCheckboxItem className="rounded-xl px-2 py-1.5" checked={filters.status === 'paid'} onCheckedChange={() => handleFilterChange('status', filters.status === 'paid' ? 'all' : 'paid')}>Paid</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem className="rounded-xl px-2 py-1.5" checked={filters.status === 'free'} onCheckedChange={() => handleFilterChange('status', filters.status === 'free' ? 'all' : 'free')}>Free</DropdownMenuCheckboxItem>
                                <DropdownMenuSeparator className="my-1" />
                                <DropdownMenuLabel className="px-2 py-1.5 text-xs text-gray-400 uppercase">Engagement</DropdownMenuLabel>
                                <DropdownMenuCheckboxItem className="rounded-xl px-2 py-1.5" checked={filters.engagement === 'high'} onCheckedChange={() => handleFilterChange('engagement', filters.engagement === 'high' ? 'all' : 'high')}>High</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem className="rounded-xl px-2 py-1.5" checked={filters.engagement === 'medium'} onCheckedChange={() => handleFilterChange('engagement', filters.engagement === 'medium' ? 'all' : 'medium')}>Medium</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem className="rounded-xl px-2 py-1.5" checked={filters.engagement === 'low'} onCheckedChange={() => handleFilterChange('engagement', filters.engagement === 'low' ? 'all' : 'low')}>Low</DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Segments Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="rounded-full border-gray-100 h-11 px-6 font-bold text-gray-600">
                                    Segments
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-64 rounded-2xl p-2">
                                <DropdownMenuLabel className="px-2 py-1.5 text-xs text-gray-400 uppercase">My Segments</DropdownMenuLabel>
                                {segments.length === 0 && <span className="p-3 text-xs text-muted-foreground block text-center">No segments saved.</span>}
                                {segments.map(segment => (
                                    <DropdownMenuItem key={segment.id} onClick={() => handleSegmentSelect(segment.id)} className="flex justify-between max-w-full rounded-xl px-2 py-2 cursor-pointer">
                                        <span className="truncate flex-1 font-medium">{segment.name}</span>
                                        <div onClick={(e) => handleDeleteSegment(segment.id, e)} className="p-1 hover:bg-red-100 rounded-lg text-gray-400 hover:text-red-500 cursor-pointer transition-colors">
                                            <Trash2 className="w-3 h-3" />
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                                {segments.length > 0 && <DropdownMenuSeparator className="my-1" />}
                                <DropdownMenuItem className="rounded-xl px-2 py-2 cursor-pointer font-medium text-gray-500" onClick={() => handleSegmentSelect('all')}>
                                    All Subscribers
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {hasActiveFilters && !filters.segmentId && (
                            <Button variant="ghost" onClick={() => setSaveSegmentOpen(true)} className="text-blue-600 font-bold text-sm rounded-full hover:bg-blue-50">
                                Save Segment
                            </Button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50">
                                <th className="w-16 px-8 py-4 text-left">
                                    <Checkbox className="rounded-md border-gray-200" />
                                </th>
                                <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subscriber</th>
                                <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Engagement</th>
                                <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Open Rate</th>
                                <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joined</th>
                                <th className="w-20 px-8 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {initialSubscribers?.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-12 text-center text-gray-500">
                                        No subscribers found matching your criteria.
                                    </td>
                                </tr>
                            ) : initialSubscribers?.map((sub) => (
                                <tr key={sub.id} className="group hover:bg-gray-50/30 transition-colors">
                                    <td className="px-8 py-4">
                                        <Checkbox
                                            className="rounded-md border-gray-200"
                                            checked={selectedSubscribers.includes(sub.id)}
                                            onCheckedChange={() => toggleSubscriber(sub.id)}
                                        />
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="w-9 h-9 ring-2 ring-white shadow-sm">
                                                <AvatarImage src={sub.avatar || undefined} />
                                                <AvatarFallback className="bg-gray-100 text-gray-500 font-bold text-xs">{sub.name?.[0] || sub.email[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{sub.name || 'Unknown'}</p>
                                                <p className="text-xs text-gray-400 font-medium">{sub.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <Badge variant="secondary" className={`${sub.status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'} border-none font-bold rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider`}>
                                            {sub.status || 'free'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${sub.engagement === 'high' ? 'bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                                sub.engagement === 'medium' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' :
                                                    'bg-pink-500 shadow-[0_0_8px_rgba(244,114,182,0.5)]'
                                                }`} />
                                            <span className="text-sm font-bold text-gray-700 capitalize">{sub.engagement || 'low'}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-1.5 w-20 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${sub.openRate || 0}%` }} />
                                            </div>
                                            <span className="text-xs font-bold text-gray-900">{sub.openRate || 0}%</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <p className="text-xs font-bold text-gray-500">{sub.joinedDate ? new Date(sub.joinedDate).toLocaleDateString() : '-'}</p>
                                    </td>
                                    <td className="px-8 py-4">
                                        <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 border-t border-gray-50 bg-white flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-400">
                        Showing <span className="text-gray-900">1-{initialSubscribers.length}</span> of <span className="text-gray-900">{initialSubscribers.length}</span>
                    </p>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="rounded-full border-gray-100 font-bold text-gray-600 w-9 h-9 p-0 hover:bg-gray-50" disabled>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            className="rounded-full w-9 h-9 font-bold bg-black text-white shadow-lg shadow-black/10"
                        >
                            1
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-full border-gray-100 font-bold text-gray-600 w-9 h-9 p-0 hover:bg-gray-50">
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Save Segment Dialog */}
            <Dialog open={saveSegmentOpen} onOpenChange={setSaveSegmentOpen}>
                <DialogContent className="sm:max-w-md rounded-3xl">
                    <DialogHeader>
                        <DialogTitle>Save Segment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Segment Name</Label>
                            <Input
                                placeholder="e.g. Paid & High Engagement"
                                value={segmentName}
                                onChange={(e) => setSegmentName(e.target.value)}
                                className="rounded-xl"
                            />
                        </div>
                        <div className="text-sm text-muted-foreground bg-gray-50 p-4 rounded-xl">
                            <p className="font-medium text-gray-900 mb-2">Filters to save:</p>
                            <ul className="space-y-1">
                                {filters.status && <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" />Status: {filters.status}</li>}
                                {filters.engagement && <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" />Engagement: {filters.engagement}</li>}
                                {filters.query && <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" />Search: {filters.query}</li>}
                            </ul>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSaveSegmentOpen(false)} className="rounded-full">Cancel</Button>
                        <Button onClick={handleSaveSegment} disabled={!segmentName} className="rounded-full bg-black text-white">Save Segment</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

