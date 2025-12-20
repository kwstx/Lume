"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { createSubscriber } from "@/actions/subscribers";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AddSubscriberDialog() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [status, setStatus] = useState("free");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await createSubscriber({ email, name, status });

            if (result.success) {
                toast.success("Subscriber added successfully!");
                setOpen(false);
                // Reset form
                setEmail("");
                setName("");
                setStatus("free");
            } else {
                toast.error(result.error || "Failed to add subscriber");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="rounded-full bg-black hover:bg-black/90 text-white px-6 font-bold shadow-lg shadow-black/10">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Subscriber
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Add New Subscriber</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="subscriber@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="rounded-xl bg-gray-50/50 border-gray-100 h-10"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Name (Optional)</Label>
                        <Input
                            id="name"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="rounded-xl bg-gray-50/50 border-gray-100 h-10"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status" className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Status</Label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-full rounded-xl bg-gray-50/50 border-gray-100 h-10">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="free">Free</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="comp">Comp</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-full font-bold text-gray-500">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="rounded-full bg-black text-white font-bold px-6">
                            {isLoading ? "Adding..." : "Add Subscriber"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
