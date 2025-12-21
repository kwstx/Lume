"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Search, Globe, Menu } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

export function LandingNavbar() {
    return (
        <div className="fixed top-6 inset-x-0 z-50 flex justify-center">
            <nav className="w-full max-w-5xl mx-4 bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-lg shadow-gray-200/5 rounded-full px-5 h-14 flex items-center justify-between transition-all hover:bg-white/90">
                <Link href="/" className="flex items-center gap-2">
                    <Logo className="w-6 h-6 text-gray-900" />
                    <span className="font-display text-lg font-bold tracking-tight text-gray-900">Lume</span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                    <Link href="/#features" className="hover:text-gray-900 transition-colors">Features</Link>
                    <Link href="/pricing" className="hover:text-gray-900 transition-colors">Pricing</Link>
                    <Link href="/community" className="hover:text-gray-900 transition-colors">Community</Link>
                    <Link href="/contact" className="hover:text-gray-900 transition-colors">Contact</Link>
                </div>

                <div className="flex items-center gap-2">
                    <div className="hidden md:flex">
                        <Link href="/dashboard">
                            <Button size="sm" className="rounded-full bg-black hover:bg-gray-900 text-white px-5 font-medium h-9 shadow-lg shadow-black/5">
                                Dashboard
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu */}
                    <div className="md:hidden flex items-center gap-2">
                        <Link href="/dashboard">
                            <Button size="sm" className="rounded-full bg-black hover:bg-gray-900 text-white px-4 font-medium h-9 shadow-lg shadow-black/5">
                                Dashboard
                            </Button>
                        </Link>

                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
                                    <Menu className="w-5 h-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <div className="flex flex-col gap-8 mt-8">
                                    <div className="flex flex-col gap-4">
                                        <Link href="/#features" className="text-lg font-medium hover:text-violet-600 transition-colors">Features</Link>
                                        <Link href="/pricing" className="text-lg font-medium hover:text-violet-600 transition-colors">Pricing</Link>
                                        <Link href="/community" className="text-lg font-medium hover:text-violet-600 transition-colors">Community</Link>
                                        <Link href="/contact" className="text-lg font-medium hover:text-violet-600 transition-colors">Contact</Link>
                                    </div>
                                    <div className="h-px bg-gray-100" />
                                    <div className="flex flex-col gap-4">
                                        <Link href="/login">
                                            <Button variant="outline" className="w-full rounded-full h-11">Log In</Button>
                                        </Link>
                                        <Link href="/dashboard">
                                            <Button className="w-full rounded-full h-11 bg-black text-white hover:bg-gray-800">Get Started</Button>
                                        </Link>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </nav >
        </div >
    );
}
