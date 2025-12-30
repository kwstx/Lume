"use client";

import { useState } from "react";
import { getApiKeys, createApiKey, deleteApiKey } from "@/actions/api-keys";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Copy, Plus, Trash2, Key, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ApiKey {
    id: string;
    name: string;
    key: string;
    lastUsed: Date | null;
    createdAt: Date | null;
}

interface ApiKeysListProps {
    initialKeys: ApiKey[];
}

export default function ApiKeysList({ initialKeys }: ApiKeysListProps) {
    const [keys, setKeys] = useState(initialKeys);
    const [createOpen, setCreateOpen] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [createdKey, setCreatedKey] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!newKeyName) return;
        setLoading(true);

        const result = await createApiKey(newKeyName);

        if (result.success && result.key) {
            setCreatedKey(result.key);
            setKeys([{
                id: result.id,
                name: newKeyName,
                key: `sk_live_...${result.key.slice(-4)}`,
                lastUsed: null,
                createdAt: new Date()
            } as ApiKey, ...keys]);
            setNewKeyName("");
            toast.success("API Key created");
        } else {
            toast.error(result.error);
        }

        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        const result = await deleteApiKey(id);
        if (result.success) {
            setKeys(keys.filter(k => k.id !== id));
            toast.success("API Key deleted");
        } else {
            toast.error("Failed to delete key");
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">API Keys</h3>
                    <p className="text-sm text-gray-500">Manage API keys for accessing your Stackly data programmatically.</p>
                </div>
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 bg-black text-white rounded-full font-bold">
                            <Plus className="w-4 h-4" />
                            Create New Key
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create API Key</DialogTitle>
                            <DialogDescription>
                                Give your API key a name. You will only see the key once.
                            </DialogDescription>
                        </DialogHeader>

                        {!createdKey ? (
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Key Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Zapier Integration"
                                        value={newKeyName}
                                        onChange={(e) => setNewKeyName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="py-4 space-y-4">
                                <div className="p-4 bg-green-50 border border-green-100 rounded-lg space-y-2">
                                    <div className="flex items-center gap-2 text-green-700 font-bold text-sm">
                                        <Key className="w-4 h-4" />
                                        Key Created Successfully
                                    </div>
                                    <p className="text-xs text-green-600">Copy this key now. You won't be able to see it again.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Input value={createdKey} readOnly className="font-mono text-xs" />
                                    <Button size="icon" variant="outline" onClick={() => copyToClipboard(createdKey)}>
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            {!createdKey ? (
                                <Button onClick={handleCreate} disabled={loading || !newKeyName}>
                                    {loading ? "Creating..." : "Create Key"}
                                </Button>
                            ) : (
                                <Button onClick={() => { setCreateOpen(false); setCreatedKey(null); }}>
                                    Done
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="w-[300px]">Name</TableHead>
                                <TableHead>Key Prefix</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Last Used</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {keys.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                        No API keys found. Create one to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                keys.map((key) => (
                                    <TableRow key={key.id} className="hover:bg-gray-50/50 transition-colors">
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                    <Key className="w-4 h-4" />
                                                </div>
                                                {key.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-gray-500">
                                            {key.key}
                                        </TableCell>
                                        <TableCell className="text-gray-500 text-xs">
                                            {key.createdAt ? new Date(key.createdAt).toLocaleDateString() : '-'}
                                        </TableCell>
                                        <TableCell className="text-gray-500 text-xs">
                                            {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDelete(key.id)}
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
