"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Mail,
    Send,
    Calendar,
    FileEdit,
    BarChart2,
    Trash2
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { createCampaign } from "@/actions/campaigns";
import { toast } from "sonner";

export default function CampaignsPage({ initialCampaigns }: { initialCampaigns: any[] }) {
    const router = useRouter();
    const [campaigns, setCampaigns] = useState(initialCampaigns);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreateCampaign = async () => {
        setLoading(true);
        try {
            const result = await createCampaign({
                name: "Untitled Campaign",
                subject: "",
                content: "",
            });
            if (result.success && result.campaign) {
                toast.success("Campaign created");
                // Redirect to editor
                router.push(`/dashboard/campaigns/${result.campaign.id}`);
            } else {
                toast.error("Failed to create campaign");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'sent': return 'text-green-600 bg-green-50';
            case 'scheduled': return 'text-blue-600 bg-blue-50';
            case 'draft': return 'text-gray-600 bg-gray-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const filteredCampaigns = campaigns.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.subject?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Campaigns</h1>
                    <p className="text-sm text-gray-400 font-medium">Create and manage your email campaigns.</p>
                </div>
                <Button onClick={handleCreateCampaign} disabled={loading} className="gap-2 bg-black text-white hover:bg-gray-800 rounded-full">
                    <Plus className="h-4 w-4" />
                    New Campaign
                </Button>
            </div>

            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2.5rem] overflow-hidden border border-gray-100/50">
                <div className="p-4 md:p-8 border-b border-gray-50 bg-white">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                        <div className="relative flex-1 w-full md:max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search campaigns..."
                                className="w-full h-12 pl-12 pr-4 rounded-full border border-gray-100 bg-gray-50/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Future filters */}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50">
                                <th className="px-8 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Campaign</th>
                                <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stats</th>
                                <th className="px-4 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Update</th>
                                <th className="w-20 px-8 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredCampaigns.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-16 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-2">
                                                <Mail className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <p className="font-bold text-gray-900 text-lg">No campaigns found</p>
                                            <p className="text-sm text-gray-400 max-w-sm mx-auto mb-4">
                                                {search
                                                    ? "Try adjusting your search terms."
                                                    : "Draft your first newsletter to engage your audience."}
                                            </p>
                                            {!search && (
                                                <Button onClick={handleCreateCampaign} disabled={loading} className="rounded-full bg-black text-white px-6 font-bold shadow-lg shadow-black/10 hover:bg-gray-800">
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Create Campaign
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredCampaigns.map((campaign) => (
                                <tr key={campaign.id} className="group hover:bg-gray-50/30 transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/campaigns/${campaign.id}`)}>
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{campaign.name}</p>
                                                <p className="text-xs text-gray-400 font-medium truncate max-w-[200px]">
                                                    {campaign.subject || 'No subject'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <Badge variant="secondary" className={`${getStatusColor(campaign.status)} border-none font-bold rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider`}>
                                            {campaign.status}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="text-center">
                                                <p className="text-xs font-bold text-gray-900">{campaign.openRate || 0}%</p>
                                                <p className="text-[10px] text-gray-400 font-medium uppercase">Open</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs font-bold text-gray-900">{campaign.clickRate || 0}%</p>
                                                <p className="text-[10px] text-gray-400 font-medium uppercase">Click</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <p className="text-xs font-bold text-gray-500">
                                            {campaign.updatedAt ? formatDistanceToNow(new Date(campaign.updatedAt), { addSuffix: true }) : '-'}
                                        </p>
                                    </td>
                                    <td className="px-8 py-4" onClick={(e) => e.stopPropagation()}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl p-2 w-48">
                                                <DropdownMenuItem className="rounded-lg font-medium cursor-pointer" onClick={() => router.push(`/dashboard/campaigns/${campaign.id}`)}>
                                                    <FileEdit className="w-4 h-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="rounded-lg font-medium cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50" onClick={() => { }}>
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
