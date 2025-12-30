import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed left-0 top-0 h-full z-30">
        <DashboardSidebar />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 flex items-center justify-between">
        <div className="font-bold text-lg">Stackly</div>
        <MobileNav />
      </div>

      <main className="md:pl-64 min-h-screen transition-all duration-300 ease-in-out">
        <div className="max-w-[1600px] mx-auto p-4 md:p-8 pt-6 md:pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>
    </div>
  );
}
