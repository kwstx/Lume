"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateProfile } from "@/actions/user";

interface ConnectSubstackDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function ConnectSubstackDialog({ open, onOpenChange, onSuccess }: ConnectSubstackDialogProps) {
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleConnect = async () => {
        if (!url.includes("substack.com")) {
            toast.error("Please enter a valid Substack URL");
            return;
        }

        setIsLoading(true);
        try {
            // We use updateProfile to save the URL. optimize this later if needed.
            // But wait, updateProfile currently only accepts { name, newsletterName, timezone }.
            // I need to update updateProfile to accept substackUrl too.
            // OR create a specific action. Let's use a specific action to be cleaner or update the existing one.
            // For now, let's assume I will update the existing action in the next step.

            const result = await updateProfile({ substackUrl: url });

            if (result.success) {
                toast.success("Substack connected successfully!");
                onSuccess();
                onOpenChange(false);
            } else {
                toast.error("Failed to connect Substack");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Connect Substack</DialogTitle>
                    <DialogDescription>
                        Enter your Substack publication URL to sync your data.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="url">Substack URL</Label>
                        <Input
                            id="url"
                            placeholder="https://yourname.substack.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleConnect} disabled={isLoading}>
                        {isLoading ? "Connecting..." : "Connect"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
