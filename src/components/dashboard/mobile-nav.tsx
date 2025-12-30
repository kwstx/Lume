"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function MobileNav() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // Close on route change
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
                {/* Reuse the existing sidebar component but ensuring it fits in the sheet */}
                <div className="h-full">
                    <DashboardSidebar />
                </div>
            </SheetContent>
        </Sheet>
    );
}
