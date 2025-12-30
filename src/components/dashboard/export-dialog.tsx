"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Download, FileJson, FileSpreadsheet, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createExportJob } from "@/actions/export";

interface ExportDialogProps {
    trigger?: React.ReactNode;
    defaultType?: 'subscribers' | 'segments' | 'campaigns';
}

export function ExportDialog({ trigger, defaultType = 'subscribers' }: ExportDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState<string>(defaultType);
    const [format, setFormat] = useState<string>('csv');

    const handleExport = async () => {
        setLoading(true);
        try {
            // Option A: Trigger server action to start job (if queueing)
            // await createExportJob(type as any, format as any);

            // Option B: Direct download link for immediate gratification
            // Since we implemented the Route Handler for direct download:

            const response = await fetch(`/api/export/${type}?format=${format}`);
            if (!response.ok) throw new Error("Export failed");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${type}-${new Date().toISOString().split('T')[0]}.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success("Export downloaded successfully");
            setOpen(false);
        } catch (error) {
            toast.error("Failed to download export");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Export Data</DialogTitle>
                    <DialogDescription>
                        Download your data in CSV or JSON format.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                            Data Type
                        </Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select data to export" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="subscribers">Subscribers</SelectItem>
                                <SelectItem value="segments">Segments</SelectItem>
                                <SelectItem value="campaigns">Campaigns</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="format" className="text-right">
                            Format
                        </Label>
                        <Select value={format} onValueChange={setFormat}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="csv">
                                    <div className="flex items-center gap-2">
                                        <FileSpreadsheet className="h-4 w-4" />
                                        <span>CSV (Spreadsheet)</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="json">
                                    <div className="flex items-center gap-2">
                                        <FileJson className="h-4 w-4" />
                                        <span>JSON (Raw Data)</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleExport} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Download
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
