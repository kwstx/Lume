"use client";

import { useState } from "react";

import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Mail,
    Smartphone,
    Globe,
    Trash2,
    Download,
    Settings,
    Sparkles,
} from "lucide-react";
import { AvatarUploader } from "@/components/settings/avatar-uploader";
import { ConnectSubstackDialog } from "@/components/settings/connect-substack-dialog";
import { updateProfile, exportAccountData, deleteAccount } from "@/actions/user";
import { syncSubstack } from "@/actions/subscribers";
import { toast } from "sonner";

interface User {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    substackUrl?: string | null;
}

interface SettingsContentProps {
    user: User;
}

interface Integration {
    name: string;
    description: string;
    icon: string;
    connected: boolean;
    key: string;
}

export default function SettingsContent({ user }: SettingsContentProps) {
    const [name, setName] = useState(user?.name || "");
    const [newsletterName, setNewsletterName] = useState(""); // TODO: Add to DB schema
    const [timezone, setTimezone] = useState("UTC"); // TODO: Add to DB schema
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const result = await updateProfile({ name, newsletterName, timezone });
            if (result.success) {
                toast.success("Profile updated successfully");
            } else {
                toast.error("Failed to update profile");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const [showConnectDialog, setShowConnectDialog] = useState(false);

    const integrations: Integration[] = [
        {
            name: "Substack",
            description: "Your primary data source. Syncs subscribers, revenue, and engagement metrics.",
            icon: "https://substackcdn.com/image/fetch/w_256,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack.com%2Fimg%2Fsubstack.png",
            connected: !!user?.substackUrl,
            key: 'substack'
        }
    ];

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <ConnectSubstackDialog
                open={showConnectDialog}
                onOpenChange={setShowConnectDialog}
                onSuccess={() => {
                    // Refresh is automatic via server action revalidation, 
                    // but we might want to manually refresh router locally if needed.
                    // For now, revalidatePath in action handles it.
                }}
            />
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Settings</h1>
                    </div>
                    <p className="text-sm text-gray-400 font-medium">Manage your profile and preferences.</p>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2.5rem] p-8 border border-gray-100/50">
                        <div className="flex items-center justify-between mb-8">
                            <CardTitle className="text-xl font-bold">Profile Settings</CardTitle>
                            <Badge variant="outline" className="rounded-full border-gray-100 text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-gray-50 text-gray-500">
                                Public Profile
                            </Badge>
                        </div>

                        <div className="flex items-center gap-8 mb-10">
                            <div className="relative group">
                                <Avatar className="w-24 h-24 ring-4 ring-gray-50/50 shadow-xl shadow-gray-100">
                                    <AvatarImage src={user?.image || undefined} />
                                    <AvatarFallback className="bg-gray-100 text-gray-400 text-2xl font-bold">{user?.name?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-[2px]">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <AvatarUploader currentImage={user?.image} />
                                <p className="text-xs text-gray-400 font-medium">JPG, PNG or GIF. Max 2MB.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-4">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full h-14 px-6 rounded-full border border-gray-100 bg-gray-50/50 text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all focus:bg-white placeholder:text-gray-300"
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
                                <input
                                    type="email"
                                    defaultValue={user?.email || ""}
                                    className="w-full h-14 px-6 rounded-full border border-gray-100 bg-gray-50/30 text-base font-medium text-gray-500 cursor-not-allowed"
                                    disabled
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-4">Newsletter Name</label>
                                <input
                                    type="text"
                                    placeholder="My Newsletter"
                                    className="w-full h-14 px-6 rounded-full border border-gray-100 bg-gray-50/50 text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all focus:bg-white placeholder:text-gray-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-4">Newsletter Name</label>
                                <input
                                    type="text"
                                    placeholder="My Newsletter"
                                    value={newsletterName}
                                    onChange={(e) => setNewsletterName(e.target.value)}
                                    className="w-full h-14 px-6 rounded-full border border-gray-100 bg-gray-50/50 text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all focus:bg-white placeholder:text-gray-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-4">Timezone</label>
                                <input
                                    type="text"
                                    value={timezone}
                                    onChange={(e) => setTimezone(e.target.value)}
                                    className="w-full h-14 px-6 rounded-full border border-gray-100 bg-gray-50/50 text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all focus:bg-white placeholder:text-gray-300"
                                />
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-gray-50 flex justify-end">
                            <Button
                                className="rounded-full bg-black text-white px-8 h-12 font-bold shadow-lg shadow-black/10 hover:bg-gray-900 transition-all hover:scale-105 active:scale-95"
                                onClick={handleSave}
                                disabled={isLoading}
                            >
                                {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </Card>

                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2.5rem] p-8 border border-gray-100/50">
                        <div className="flex items-center justify-between mb-8">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-bold">Substack Connection</CardTitle>
                                <p className="text-sm font-medium text-gray-400">Manage your connection to Substack.</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {integrations.map((integration) => (
                                <div
                                    key={integration.name}
                                    className="flex items-center justify-between p-6 rounded-[2rem] border border-gray-50 hover:border-orange-100 hover:bg-orange-50/10 transition-all group bg-white"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-3xl bg-[#FF6719]/10 shadow-sm border border-[#FF6719]/10 flex items-center justify-center overflow-hidden p-4 group-hover:scale-105 transition-transform">
                                            <img
                                                src={integration.icon}
                                                alt={integration.name}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <p className="font-bold text-gray-900 text-xl">{integration.name}</p>
                                                {integration.connected && (
                                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-100">
                                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                        <span className="text-[11px] font-extrabold text-green-600 uppercase tracking-wide">Sync Active</span>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 font-medium max-w-sm leading-relaxed">{integration.description}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant={integration.connected ? "outline" : "default"}
                                        className={`rounded-full px-8 h-12 font-bold transition-all ${integration.connected
                                            ? "border-gray-200 text-gray-600 hover:bg-gray-50"
                                            : "bg-[#FF6719] text-white shadow-lg shadow-[#FF6719]/20 hover:bg-[#FF6719]/90"
                                            }`}
                                        onClick={async () => {
                                            if (integration.key === 'substack') {
                                                if (integration.connected) {
                                                    const promise = syncSubstack();
                                                    toast.promise(promise, {
                                                        loading: 'Syncing with Substack...',
                                                        success: 'Synced successfully!',
                                                        error: 'Failed to sync',
                                                    });
                                                } else {
                                                    setShowConnectDialog(true);
                                                }
                                            }
                                        }}
                                    >
                                        {integration.connected ? "Manage Sync" : "Connect Account"}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2.5rem] p-8 border border-gray-100/50">
                        <CardTitle className="text-xl font-bold mb-8">Notifications</CardTitle>
                        <div className="space-y-4">
                            {[
                                { label: "Email Alerts", icon: Mail, checked: true, desc: "Get updates on new subscribers" },
                                { label: "Push Notifications", icon: Smartphone, checked: false, desc: "Real-time mobile alerts" },
                                { label: "Weekly Digest", icon: Globe, checked: true, desc: "Summary of your performance" },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center justify-between p-4 rounded-3xl bg-gray-50/50 border border-gray-100/50 hover:border-gray-200 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-gray-100 text-gray-500">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="text-sm font-bold text-gray-900 block">{item.label}</span>
                                            <span className="text-xs font-medium text-gray-400">{item.desc}</span>
                                        </div>
                                    </div>
                                    <Switch defaultChecked={item.checked} className="data-[state=checked]:bg-black" />
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2.5rem] p-8 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-orange-600 opacity-100 transition-transform duration-700" />
                        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/10 rounded-full blur-3xl opacity-50" />

                        <div className="relative z-10 space-y-6 text-white">
                            <div className="bg-white/20 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                                <Trash2 className="w-7 h-7" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold tracking-tight">Danger Zone</h3>
                                <p className="text-white/90 text-sm font-medium leading-relaxed">
                                    Irreversible actions. Deleting your account will permanently remove all your data.
                                </p>
                            </div>
                            <div className="space-y-3 pt-2">
                                <Button
                                    variant="outline"
                                    className="w-full h-12 rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20 font-bold backdrop-blur-sm border-2"
                                    onClick={async () => {
                                        toast.info("Preparing export...");
                                        const result = await exportAccountData();
                                        if (result.success && result.data) {
                                            const blob = new Blob([result.data], { type: 'application/json' });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = `orchids-crm-export-${new Date().toISOString().split('T')[0]}.json`;
                                            document.body.appendChild(a);
                                            a.click();
                                            document.body.removeChild(a);
                                            URL.revokeObjectURL(url);
                                            toast.success("Export downloaded!");
                                        } else {
                                            toast.error("Failed to export data");
                                        }
                                    }}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Export All Data
                                </Button>
                                <Button
                                    variant="destructive"
                                    className="w-full h-12 rounded-full bg-white text-rose-600 hover:bg-white/90 font-bold border-none shadow-xl shadow-black/10"
                                    onClick={async () => {
                                        if (confirm("Are you SURE you want to delete your account? This action is irreversible.")) {
                                            const result = await deleteAccount();
                                            if (result.success) {
                                                toast.success("Account deleted. Redirecting...");
                                                // Hard reload to force sign out / redirect to auth
                                                window.location.href = "/";
                                            } else {
                                                toast.error("Failed to delete account");
                                            }
                                        }
                                    }}
                                >
                                    Delete Account
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
