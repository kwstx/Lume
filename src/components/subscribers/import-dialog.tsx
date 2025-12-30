"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { importSubscribers } from "@/actions/subscribers";
import { toast } from "sonner";
import { Upload, FileUp, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ImportDialogProps {
    trigger?: React.ReactNode;
}

export function ImportDialog({ trigger }: ImportDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleImport = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const result = await importSubscribers(formData);

            if (result.success) {
                toast.success(result.message);
                setOpen(false);
                router.refresh();
            } else {
                toast.error(result.message || "Import failed");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" className="gap-2">
                        <FileUp className="w-4 h-4" />
                        <span>Import CSV</span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Import Subscribers</DialogTitle>
                    <DialogDescription>
                        Upload your Substack CSV export file to import subscribers.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleImport} className="grid gap-4 py-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="file">CSV File</Label>
                        <Input id="file" name="file" type="file" accept=".csv" required />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Importing...
                                </>
                            ) : (
                                "Import Subscribers"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
