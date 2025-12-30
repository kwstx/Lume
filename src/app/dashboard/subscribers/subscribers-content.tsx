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
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
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
    Activity,
    FileUp
} from "lucide-react";
import { ImportDialog } from "@/components/subscribers/import-dialog";
import { AddSubscriberDialog } from "@/components/subscribers/add-subscriber-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ExportDialog } from "@/components/dashboard/export-dialog";

interface Subscriber {
    id: string;
    name: string | null;
    email: string;
    status: string | null;
    engagementLevel: string | null;
    openRate: number | null;
    joinDate: Date | null;
    lastActive: Date | null;
    rfmScore?: number | null;
    churnRisk?: number | null;
    avatar?: string | null;
}

interface SubscribersContentProps {
    initialSubscribers: Subscriber[];
    totalCount: number;
    initialSegments: any[];
    initialFilters: {
        query?: string;
        status?: string;
        engagement?: string;
        segmentId?: string;
        risk?: string;
        page?: number;
    }
}

export default function SubscribersContent({ initialSubscribers, totalCount, initialSegments, initialFilters }: SubscribersContentProps) {
    const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    // Filter State
    const [filters, setFilters] = useState(initialFilters);
    const [segments, setSegments] = useState(initialSegments);

    // Segment Dialog State
    const [saveSegmentOpen, setSaveSegmentOpen] = useState(false);
    const [segmentName, setSegmentName] = useState("");

    // Pagination
    const page = initialFilters.page || 1;
    const limit = 20;
    const totalPages = Math.ceil(totalCount / limit);

    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("query", term);
        } else {
            params.delete("query");
        }
        params.set("page", "1");
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        replace(`${pathname}?${params.toString()}`);
    };

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        if (key !== 'segmentId') {
            newFilters.segmentId = undefined;
        }
        setFilters(newFilters);

        const params = new URLSearchParams(searchParams);
        if (value && value !== 'all') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set("page", "1");
        replace(`${pathname}?${params.toString()}`);
    };

    const handleSegmentSelect = (segmentId: string) => {
        const newFilters = { ...filters, segmentId: segmentId === 'all' ? undefined : segmentId };
        const hasActiveFilters = filters.status || filters.engagement || filters.query || filters.risk;
        setFilters(newFilters);

        const params = new URLSearchParams(searchParams);
        if (segmentId && segmentId !== 'all') {
            params.set("segmentId", segmentId);
        } else {
            params.delete("segmentId");
        }
        params.set("page", "1");
        replace(`${pathname}?${params.toString()}`);
    };

    // ... (rest of logic for segments, deleting, etc.)
    const handleCreateSegment = async () => {
        try {
            const result = await createSegment(segmentName, filters, filters);
            if (result.success && result.segment) {
                setSegments([...segments, result.segment]);
                toast.success("Segment saved");
                setSaveSegmentOpen(false);
            } else {
                toast.error("Failed to save segment");
            }
        } catch (error) {
            toast.error("Error saving segment");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Subscribers</h1>
                    <p className="text-sm text-gray-400 font-medium">Manage and track your audience growth.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <ImportDialog />
                    <ExportDialog />
                    <AddSubscriberDialog />
                </div>
            </div>

            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2.5rem] overflow-hidden border border-gray-100/50">
                <div className="p-4 md:p-8 border-b border-gray-50 bg-white">
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
                        <div className="relative flex-1 w-full lg:max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search by name or email..."
                                className="w-full h-12 pl-12 pr-4 rounded-full border border-gray-100 bg-gray-50/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                onChange={(e) => handleSearch(e.target.value)}
                                defaultValue={searchParams.get('query')?.toString()}
                            />
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="rounded-full border-gray-100 h-11 px-6 font-bold text-gray-600 gap-2 hover:bg-gray-50">
                                        <Filter className="w-4 h-4" />
                                        Filters
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
                                    <DropdownMenuLabel>Status</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {['all', 'paid', 'free', 'comp'].map((status) => (
                                        <DropdownMenuCheckboxItem
                                            key={status}
                                            checked={filters.status === status || (!filters.status && status === 'all')}
                                            onCheckedChange={() => handleFilterChange('status', status)}
                                            className="rounded-xl cursor-pointer"
                                        >
                                            <span className="capitalize">{status}</span>
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="rounded-full border-gray-100 h-11 px-6 font-bold text-gray-600 gap-2 hover:bg-gray-50">
                                        <Users className="w-4 h-4" />
                                        {filters.segmentId ? segments.find(s => s.id === filters.segmentId)?.name || 'Segment' : 'Segments'}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
                                    <DropdownMenuItem onClick={() => handleSegmentSelect('all')} className="rounded-xl cursor-pointer font-medium">
                                        All Subscribers
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {segments.map((segment) => (
                                        <div key={segment.id} className="flex items-center justify-between group px-2 py-1.5 hover:bg-accent rounded-xl">
                                            <span onClick={() => handleSegmentSelect(segment.id)} className="flex-1 cursor-pointer text-sm font-medium">
                                                {segment.name}
                                            </span>
                                            {/* Delete logic could go here */}
                                        </div>
                                    ))}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setSaveSegmentOpen(true); }} className="rounded-xl cursor-pointer text-blue-600 font-bold bg-blue-50 focus:bg-blue-100 focus:text-blue-700">
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Save Current Filter
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50">
                                <th className="w-12 px-8 py-4">
                                    <Checkbox
                                        className="rounded-md border-gray-300 data-[state=checked]:bg-black data-[state=checked]:border-black"
                                        checked={selectedSubscribers.length === initialSubscribers.length && initialSubscribers.length > 0}
                                        onCheckedChange={(checked) => {
                                            if (checked) setSelectedSubscribers(initialSubscribers.map(s => s.id));
                                            else setSelectedSubscribers([]);
                                        }}
                                    />
                                </th>
                                <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subscriber</th>
                                <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Engagement</th>
                                <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joined</th>
                                <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Risk</th>
                                <th className="w-20 px-8 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {initialSubscribers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-16 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-2">
                                                <Users className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <p className="font-bold text-gray-900 text-lg">No subscribers found</p>
                                            <p className="text-sm text-gray-400 max-w-sm mx-auto mb-4">
                                                {filters.query || filters.status || filters.segmentId
                                                    ? "Try adjusting your filters or search terms."
                                                    : "Get started by importing your existing audience."}
                                            </p>
                                            {!filters.query && !filters.status && !filters.segmentId && (
                                                <ImportDialog trigger={
                                                    <Button className="rounded-full bg-black text-white px-6 font-bold shadow-lg shadow-black/10 hover:bg-gray-800">
                                                        <FileUp className="w-4 h-4 mr-2" />
                                                        Import Subscribers
                                                    </Button>
                                                } />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : initialSubscribers.map((sub) => (
                                <tr key={sub.id} className="group hover:bg-gray-50/30 transition-colors cursor-pointer">
                                    <td className="px-8 py-4">
                                        <Checkbox
                                            className="rounded-md border-gray-300 data-[state=checked]:bg-black data-[state=checked]:border-black"
                                            checked={selectedSubscribers.includes(sub.id)}
                                            onCheckedChange={(checked) => {
                                                if (checked) setSelectedSubscribers([...selectedSubscribers, sub.id]);
                                                else setSelectedSubscribers(selectedSubscribers.filter(id => id !== sub.id));
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                                                <AvatarImage src={sub.avatar || undefined} />
                                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-white font-bold text-xs">
                                                    {sub.name?.[0]?.toUpperCase() || sub.email[0].toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{sub.name || 'Unknown'}</p>
                                                <p className="text-xs text-gray-400 font-medium">{sub.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <Badge variant="secondary" className={`
                                            ${sub.status === 'paid' ? 'bg-green-100 text-green-700' : ''}
                                            ${sub.status === 'free' ? 'bg-gray-100 text-gray-600' : ''}
                                            ${sub.status === 'comp' ? 'bg-purple-100 text-purple-700' : ''}
                                            font-bold rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider border-none
                                        `}>
                                            {sub.status || 'free'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3].map((bar) => (
                                                    <div
                                                        key={bar}
                                                        className={`w-1 h-3 rounded-full ${(sub.engagementLevel === 'high' && bar <= 3) ||
                                                            (sub.engagementLevel === 'medium' && bar <= 2) ||
                                                            (sub.engagementLevel === 'low' && bar === 1)
                                                            ? 'bg-blue-500'
                                                            : 'bg-gray-200'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs font-bold text-gray-900">{sub.openRate || 0}%</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <p className="text-xs font-bold text-gray-500">
                                            {sub.joinDate ? new Date(sub.joinDate).toLocaleDateString() : '-'}
                                        </p>
                                    </td>
                                    <td className="px-4 py-4">
                                        {sub.churnRisk ? (
                                            <Badge variant="outline" className={`
                                                ${sub.churnRisk >= 70 ? 'bg-red-50 text-red-600 border-red-100' : ''}
                                                ${sub.churnRisk >= 30 && sub.churnRisk < 70 ? 'bg-yellow-50 text-yellow-600 border-yellow-100' : ''}
                                                ${sub.churnRisk < 30 ? 'bg-green-50 text-green-600 border-green-100' : ''}
                                                font-bold rounded-lg border-none
                                            `}>
                                                {sub.churnRisk >= 70 ? 'High Risk' : sub.churnRisk >= 30 ? 'Med Risk' : 'Safe'}
                                            </Badge>
                                        ) : <span className="text-gray-300">-</span>}
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

                {/* Pagination Controls */}
                <div className="p-6 border-t border-gray-50 bg-white flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs font-bold text-gray-400 order-2 md:order-1">
                        Showing <span className="text-gray-900">{(page - 1) * limit + 1}-{Math.min(page * limit, totalCount)}</span> of <span className="text-gray-900">{totalCount}</span>
                    </p>
                    <div className="flex items-center gap-2 order-1 md:order-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full border-gray-100 font-bold text-gray-600 w-9 h-9 p-0 hover:bg-gray-50"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page <= 1}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-sm font-bold text-gray-900">
                            Page {page} of {totalPages || 1}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full border-gray-100 font-bold text-gray-600 w-9 h-9 p-0 hover:bg-gray-50"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page >= totalPages}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Card>

            <Dialog open={saveSegmentOpen} onOpenChange={setSaveSegmentOpen}>
                <DialogContent className="sm:max-w-md rounded-3xl">
                    <DialogHeader>
                        <DialogTitle>Save Segment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Segment Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g., Highly Active Paid Users"
                                value={segmentName}
                                onChange={(e) => setSegmentName(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleCreateSegment} className="w-full rounded-xl font-bold bg-black text-white hover:bg-gray-800">
                            Save Segment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
