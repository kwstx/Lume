"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Search, Globe, Menu, ChevronRight } from "lucide-react";
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
                            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white/95 backdrop-blur-xl border-l border-gray-100 p-6">
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center gap-2 mb-8">
                                        <Logo className="w-5 h-5 text-gray-900" />
                                        <span className="font-display text-lg font-bold tracking-tight text-gray-900">Lume</span>
                                    </div>

                                    <div className="flex flex-col gap-1 flex-1">
                                        {[
                                            { href: "/#features", label: "Features" },
                                            { href: "/pricing", label: "Pricing" },
                                            { href: "/community", label: "Community" },
                                            { href: "/contact", label: "Contact" }
                                        ].map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all group"
                                            >
                                                <span className="text-base font-medium text-gray-600 group-hover:text-gray-900">{link.label}</span>
                                                <div className="w-7 h-7 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-300 group-hover:text-violet-600 group-hover:border-violet-100 transition-all">
                                                    <ChevronRight className="w-3.5 h-3.5" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    <div className="flex flex-col gap-3 mt-auto pt-6 border-t border-gray-100">
                                        <Link href="/login" className="w-full">
                                            <Button variant="outline" className="w-full rounded-full h-10 text-sm font-semibold border-gray-200 hover:bg-gray-50 hover:text-gray-900">
                                                Log In
                                            </Button>
                                        </Link>
                                        <Link href="/dashboard" className="w-full">
                                            <Button className="w-full rounded-full h-10 bg-black text-white hover:bg-gray-900 text-sm font-semibold shadow-md shadow-black/5">
                                                Get Started
                                            </Button>
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
