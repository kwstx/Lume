"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Users,
  BarChart3,
  MessageSquare,
  Zap,
  TrendingUp,
  Target,
  ArrowRight,
  ChevronRight,
  Plus,
  Activity,
  MoreHorizontal,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";

const features = [
  {
    title: "Advanced Segmentation",
    description: "Filter and group your readers by behavior, interests, and engagement levels.",
    icon: Users,
  },
  {
    title: "Growth Analytics",
    description: "Deep dive into your subscriber acquisition and retention metrics in real-time.",
    icon: BarChart3,
  },
  {
    title: "Campaign Management",
    description: "Draft and send personalized campaigns directly from your dashboard.",
    icon: MessageSquare,
  },
  {
    title: "Platform Integrations",
    description: "Seamlessly connect and sync directly with your Substack newsletter data.",
    icon: Zap,
  },
  {
    title: "Revenue Tracking",
    description: "Understand exactly which pieces of content are driving the most paid conversions.",
    icon: TrendingUp,
  },
  {
    title: "Custom Personas",
    description: "Generate reader profiles using your own Local AI for maximum privacy.",
    icon: Target,
  },
];


const DashboardPreview = () => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5, duration: 0.8 }}
    className="relative w-full max-w-5xl mx-auto mt-8"
  >
    {/* Mac Window Container */}
    <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
      {/* Top Bar */}
      <div className="h-14 border-b border-gray-50 flex items-center px-6 justify-between bg-white/50 backdrop-blur-md">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400/20" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/20" />
          <div className="w-3 h-3 rounded-full bg-green-400/20" />
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
            <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Live: Jan 01 - Jul 31</span>
          </div>
          <div className="hidden md:flex gap-4">
            {['Home', 'Subscribers', 'Analytics', 'Personas'].map((item) => (
              <span key={item} className="text-xs font-medium text-gray-400 cursor-default">{item}</span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100" />
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-4 md:p-8 bg-[#FAFAFB]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">Good morning, Creator</h3>
            <p className="text-sm text-gray-400 font-medium">Here's what's happening with your newsletter today.</p>
          </div>
          <Button size="sm" className="rounded-full bg-black hover:bg-black/90 text-white px-5">
            <Plus className="w-4 h-4 mr-1.5" />
            New Campaign
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Chart Card */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-gray-100/50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-gray-900">Activity</span>
                  <p className="text-[10px] text-gray-400 font-medium">You logged <span className="text-gray-900">32.2 hours</span> this<br />week — up <span className="text-gray-900">4.3 hours</span> from<br />last month.</p>
                </div>
                <div className="flex gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-100">
                  {['Week', 'Month', 'Year'].map((t, i) => (
                    <button key={t} className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${i === 0 ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-8">
                <div className="pt-0 sm:pt-4 w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start">
                  <div className="text-4xl font-bold tracking-tight text-gray-900">32.2h</div>
                  <div className="mt-0 sm:mt-2 flex items-center gap-1.5 px-2 py-0.5 bg-green-50 rounded-full border border-green-100 w-fit">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-[10px] font-bold text-green-500">15%</span>
                    <span className="text-[10px] font-medium text-gray-400">vs last month</span>
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <div className="h-44 w-full relative flex items-end gap-3 px-2">
                    {[45, 60, 85, 45, 75, 55, 65].map((h, i) => (
                      <div key={i} className="flex-1 relative group h-full flex flex-col justify-end">
                        {/* Tooltip on Wednesday (i=2) */}
                        {i === 2 && (
                          <div className="absolute -top-8 md:-top-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10">
                            <div className="bg-gray-900 text-white text-[9px] font-bold px-2 py-1 rounded-md shadow-lg">
                              8.2h
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full border-2 border-blue-500 bg-white" />
                          </div>
                        )}

                        {/* Phantom Bar with Stripes */}
                        <div
                          className="absolute inset-x-0 top-0 bottom-0 rounded-full opacity-40 transition-opacity group-hover:opacity-60"
                          style={{
                            background: `repeating-linear-gradient(135deg, transparent, transparent 4px, #3b82f6 4px, #3b82f6 5px)`,
                            opacity: 0.1
                          }}
                        />

                        {/* Blue Candle */}
                        <div
                          className={`w-full rounded-full transition-all duration-700 relative z-0 bg-gradient-to-t from-blue-600 to-blue-400 shadow-[0_4px_12px_rgba(37,99,235,0.2)] ${i === 2 ? 'ring-4 ring-blue-500/10' : ''
                            }`}
                          style={{ height: `${h}%` }}
                        >
                          {/* Inner Shine */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 px-1">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(m => (
                      <span key={m} className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">{m}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 group hover:border-blue-100 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Subscribers</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-900 tracking-tight">12,842</div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-xs font-bold text-green-500">+12%</span>
                      <span className="text-[10px] font-medium text-gray-400">vs last month</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 group hover:border-violet-100 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Open Rate</span>
                  <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center text-violet-500 group-hover:bg-violet-500 group-hover:text-white transition-all">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-900 tracking-tight">48.6%</div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-xs font-bold text-green-500">+4.2%</span>
                      <span className="text-[10px] font-medium text-gray-400">vs average</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Cards */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-violet-600 to-purple-600 rounded-3xl p-6 text-white shadow-lg shadow-violet-200">
              <div className="text-xs font-bold opacity-80 uppercase tracking-wider mb-2">Total Volume</div>
              <div className="text-4xl font-bold mb-6">$42,500</div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="opacity-70">Payouts</span>
                  <span>$38,200</span>
                </div>
                <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Top Personas</span>
                <MoreHorizontal className="w-4 h-4 text-gray-300" />
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Tech Leads', val: 75, color: 'bg-violet-500' },
                  { name: 'Founders', val: 45, color: 'bg-blue-400' },
                  { name: 'Writers', val: 30, color: 'bg-pink-400' }
                ].map(p => (
                  <div key={p.name} className="space-y-2">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-gray-900">{p.name}</span>
                      <span className="text-gray-400">{p.val}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                      <div className={`h-full ${p.color} rounded-full`} style={{ width: `${p.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Decorative Elements */}
    <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
  </motion.div>
);

export default function HomePage() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Designs */}
      <div className="absolute inset-0 z-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Concentric Arcs */}
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] pointer-events-none opacity-50">
          <div className="absolute inset-0 rounded-full border border-violet-500/[0.03] scale-[0.4]" />
          <div className="absolute inset-0 rounded-full border border-violet-500/[0.05] scale-[0.6]" />
          <div className="absolute inset-0 rounded-full border border-violet-500/[0.07] scale-[0.8]" />
          <div className="absolute inset-0 rounded-full border border-violet-500/[0.09] scale-[1.0]" />
        </div>

        {/* Gradient Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -z-10" />
      </div>

      <LandingNavbar />

      <main>
        <section className="pt-32 pb-20 px-6 relative overflow-visible">
          <div className="max-w-6xl mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-xs font-semibold mb-10 border border-border/50 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                <span>Built for Substack</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-8">
                Know Your Readers.
                <br />
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
                  Grow Your Stack.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
                The CRM that turns your Substack subscribers into lasting relationships.
                Segment audiences, track engagement, and boost conversions all in one place.
              </p>

              <div className="relative max-w-lg mx-auto mb-16 w-full">
                <div className="flex items-center p-1.5 bg-white rounded-full border border-gray-200 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-500/5 transition-all w-full">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        router.push(`/login?email=${encodeURIComponent(email)}`);
                      }
                    }}
                    className="flex-1 bg-transparent border-0 focus:ring-0 px-4 md:px-6 text-sm outline-none text-gray-900 placeholder:text-gray-400 min-w-0"
                  />
                  <Button
                    className="rounded-full bg-black hover:bg-black/90 text-white px-5 md:px-8 h-12 text-sm font-bold shrink-0"
                    onClick={() => router.push(`/login?email=${encodeURIComponent(email)}`)}
                  >
                    Get Started
                  </Button>
                </div>
              </div>

            </motion.div>

            <DashboardPreview />
          </div>
        </section >

        <section id="features" className="py-24 px-6 bg-gradient-to-b from-transparent to-secondary/20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Everything you need to grow
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Turn subscriber data into meaningful connections with tools designed for newsletter creators.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group p-6 bg-background rounded-2xl border border-border hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center mb-4 group-hover:from-violet-500 group-hover:to-purple-500 transition-all duration-300">
                    <feature.icon className="w-6 h-6 text-violet-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6 relative overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative bg-gradient-to-br from-violet-600 to-purple-700 rounded-[3rem] p-12 md:p-24 text-center overflow-hidden shadow-2xl shadow-violet-200/50"
            >
              {/* Inner Shadows */}
              <div className="absolute inset-0 shadow-[inset_0_2px_40px_rgba(0,0,0,0.1),inset_0_0_100px_rgba(0,0,0,0.1)] pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto text-white">
                <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-[1.1]">
                  Ready to understand your readers?
                </h2>

                <p className="text-white/80 text-lg md:text-xl mb-12 font-medium">
                  Stop guessing and start growing. Get the deep insights you need to turn your newsletter into a powerful platform.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="h-14 rounded-full px-10 bg-white text-violet-600 hover:bg-gray-100 font-bold transition-all"
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/how-it-works">
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-14 rounded-full px-10 border-white/20 text-white hover:bg-white/10 font-bold bg-transparent"
                    >
                      How It Works
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main >

      <LandingFooter />
    </div >
  );
}
