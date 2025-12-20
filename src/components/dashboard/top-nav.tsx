"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Bell,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

const navigation = [
  { name: "Home", href: "/dashboard" },
  { name: "Customers", href: "/dashboard/subscribers" },
  { name: "Reports", href: "/dashboard/analytics" },
  { name: "Connect", href: "/dashboard/outreach" },
  { name: "Personas", href: "/dashboard/personas" },
  { name: "Settings", href: "/dashboard/settings" },
];

export function DashboardTopNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F9FAFB]/80 backdrop-blur-xl border-b border-gray-200/50">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo className="w-6 h-6 text-gray-900" />
            <span className="font-display text-xl font-bold tracking-tight text-gray-900">Lume</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 bg-gray-100/80 rounded-full px-1 py-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-4 py-1.5 text-sm font-medium transition-all rounded-full",
                    isActive
                      ? "bg-black text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100/80 border border-gray-200/50 has-[:focus]:ring-2 has-[:focus]:ring-black/5 transition-all w-64">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search subscribers..."
                className="bg-transparent border-none outline-none text-sm placeholder:text-gray-400 w-full"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const target = e.target as HTMLInputElement;
                    if (target.value.trim()) {
                      window.location.href = `/dashboard/subscribers?query=${encodeURIComponent(target.value)}`;
                    }
                  }
                }}
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full relative">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b border-gray-100">
                  <h4 className="font-semibold text-sm">Notifications</h4>
                </div>
                <div className="p-4 text-center text-sm text-gray-500 py-8">
                  <Sparkles className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  No new notifications
                </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 p-1 pl-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer border border-transparent hover:border-gray-200">
                  <Avatar className="w-8 h-8 ring-2 ring-white">
                    <AvatarImage src={session?.user?.image || undefined} />
                    <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="w-4 h-4 text-gray-400 mr-1" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session?.user?.name || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="cursor-pointer font-medium text-gray-600">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/subscribers" className="cursor-pointer font-medium text-gray-600">
                    Subscribers
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 cursor-pointer font-medium focus:text-red-600 focus:bg-red-50"
                  onClick={() => signOut()}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
