"use client";

import { useState } from "react";
import { getWebhooks, createWebhook, deleteWebhook } from "@/actions/webhooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, Webhook as WebhookIcon, Globe, CheckCircle2, XCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface Webhook {
    id: string;
    url: string;
    events: string[] | null;
    secret: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
}

interface WebhooksListProps {
    initialWebhooks: Webhook[];
}

const AVAILABLE_EVENTS = [
    { id: "subscriber.created", label: "Subscriber Created" },
    { id: "subscriber.updated", label: "Subscriber Updated" },
    { id: "campaign.sent", label: "Campaign Sent" },
];

export default function WebhooksList({ initialWebhooks }: WebhooksListProps) {
    const [webhooks, setWebhooks] = useState(initialWebhooks);
    const [createOpen, setCreateOpen] = useState(false);
    const [newUrl, setNewUrl] = useState("");
    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!newUrl) return;
        setLoading(true);

        const result = await createWebhook(newUrl, selectedEvents.length > 0 ? selectedEvents : AVAILABLE_EVENTS.map(e => e.id));

        if (result.success) {
            toast.success("Webhook created");
            setCreateOpen(false);
            setNewUrl("");
            setSelectedEvents([]);
            // Refresh list via router refresh ideally, or optimistic update if we returned the obj
            // simpler: refresh page
            window.location.reload();
        } else {
            toast.error(result.error);
        }

        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        const result = await deleteWebhook(id);
        if (result.success) {
            setWebhooks(webhooks.filter(w => w.id !== id));
            toast.success("Webhook deleted");
        } else {
            toast.error("Failed to delete webhook");
        }
    };

    const toggleEvent = (eventId: string) => {
        setSelectedEvents(prev =>
            prev.includes(eventId) ? prev.filter(e => e !== eventId) : [...prev, eventId]
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Webhooks</h3>
                    <p className="text-sm text-gray-500">Receive real-time notifications about events in your account.</p>
                </div>
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 bg-black text-white rounded-full font-bold">
                            <Plus className="w-4 h-4" />
                            Add Endpoint
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Webhook Endpoint</DialogTitle>
                            <DialogDescription>
                                Enter the URL where you want to receive event payloads.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="url">Endpoint URL</Label>
                                <Input
                                    id="url"
                                    placeholder="https://your-api.com/webhooks"
                                    value={newUrl}
                                    onChange={(e) => setNewUrl(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Events</Label>
                                <div className="grid gap-2 border rounded-lg p-4 bg-gray-50/50">
                                    {AVAILABLE_EVENTS.map(event => (
                                        <div key={event.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={event.id}
                                                checked={selectedEvents.includes(event.id)}
                                                onCheckedChange={() => toggleEvent(event.id)}
                                            />
                                            <Label htmlFor={event.id} className="font-normal cursor-pointer">{event.label}</Label>
                                        </div>
                                    ))}
                                    <p className="text-xs text-muted-foreground mt-2">Leave all unchecked to subscribe to all events.</p>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button onClick={handleCreate} disabled={loading || !newUrl}>
                                {loading ? "Creating..." : "Create Webhook"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="w-[300px]">URL</TableHead>
                                <TableHead>Events</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {webhooks.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                        No webhooks configured.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                webhooks.map((webhook) => (
                                    <TableRow key={webhook.id} className="hover:bg-gray-50/50 transition-colors">
                                        <TableCell className="font-medium max-w-[300px] truncate">
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                                                <span className="truncate" title={webhook.url}>{webhook.url}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {webhook.events?.slice(0, 2).map(e => (
                                                    <Badge key={e} variant="secondary" className="text-[10px]">{e}</Badge>
                                                ))}
                                                {webhook.events && webhook.events.length > 2 && (
                                                    <Badge variant="outline" className="text-[10px]">+{webhook.events.length - 2}</Badge>
                                                )}
                                                {(!webhook.events || webhook.events.length === 0) && (
                                                    <Badge variant="outline" className="text-[10px]">All Events</Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {webhook.isActive ? (
                                                <div className="flex items-center gap-1.5 text-green-600 text-xs font-medium">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Active
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                                                    <XCircle className="w-3.5 h-3.5" />
                                                    Inactive
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-500 text-xs">
                                            {webhook.createdAt ? new Date(webhook.createdAt).toLocaleDateString() : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDelete(webhook.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    );
}
