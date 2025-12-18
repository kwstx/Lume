"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  BarChart3,
  MessageSquare,
  Zap,
  TrendingUp,
  Target,
  ArrowRight,
  Sparkles,
  ChevronRight,
  BarChart,
  LineChart,
  Activity,
  PieChart,
  Clock,
} from "lucide-react";

const stats = [
  { label: "Active Users", value: "12K+" },
  { label: "Subscribers Managed", value: "2.4M" },
  { label: "Open Rate", value: "48%" },
  { label: "Growth", value: "+22%" },
];

const recentUsers = [
  { name: "Sarah Chen", role: "Tech Writer", avatar: "https://i.pravatar.cc/150?u=sarah" },
  { name: "Marcus Miller", role: "Business Strategist", avatar: "https://i.pravatar.cc/150?u=marcus" },
  { name: "Elena Rodriguez", role: "Lifestyle Blogger", avatar: "https://i.pravatar.cc/150?u=elena" },
];

const features = [
  {
    title: "Advanced Segmentation",
    description: "Group your readers by behavior, interests, and engagement levels automatically.",
    icon: Users,
  },
  {
    title: "Growth Analytics",
    description: "Deep dive into your subscriber acquisition and retention metrics in real-time.",
    icon: BarChart3,
  },
  {
    title: "Automated Outreach",
    description: "Send personalized follow-ups and re-engagement campaigns without lifting a finger.",
    icon: MessageSquare,
  },
  {
    title: "Smart Automations",
    description: "Connect your Substack with 1000+ tools via our robust API and Zapier integration.",
    icon: Zap,
  },
  {
    title: "Revenue Tracking",
    description: "Understand exactly which pieces of content are driving the most paid conversions.",
    icon: TrendingUp,
  },
  {
    title: "Custom Personas",
    description: "AI-powered reader profiles that help you write content that actually resonates.",
    icon: Target,
  },
];

const FloatingWidget = ({ children, className, delay = 0 }: { children: React.ReactNode, className: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
      opacity: 1, 
      y: [0, -10, 0],
    }}
    transition={{ 
      opacity: { duration: 0.6, delay },
      y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay }
    }}
    className={`absolute z-10 hidden lg:block ${className}`}
  >
    {children}
  </motion.div>
);

export default function HomePage() {
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

      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">Stackly</span>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-secondary/60 rounded-full px-1 py-1">
            <Link href="#features" className="px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-background">
              Features
            </Link>
            <Link href="/pricing" className="px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-background">
              Pricing
            </Link>
            <Link href="/about" className="px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-background">
              About
            </Link>
            <Link href="/contact" className="px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-background">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-medium">
                Log In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="font-medium rounded-full px-5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="pt-32 pb-20 px-6 relative overflow-visible">
          <div className="max-w-6xl mx-auto relative">
            {/* Floating Widgets - Positioned around the hero text */}
            <FloatingWidget className="-left-12 top-[10%]" delay={0.2}>
              <div className="bg-white/80 backdrop-blur-md border border-border p-3 rounded-xl shadow-xl shadow-violet-500/5 flex flex-col gap-1 w-32">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Rate</span>
                  <Clock className="w-3 h-3 text-violet-500" />
                </div>
                <div className="text-lg font-bold">+31%</div>
                <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-[31%] bg-violet-500" />
                </div>
              </div>
            </FloatingWidget>

            <FloatingWidget className="-left-24 top-[40%]" delay={0.4}>
              <div className="bg-white/80 backdrop-blur-md border border-border p-2.5 rounded-xl shadow-xl shadow-violet-500/5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
              </div>
            </FloatingWidget>

            <FloatingWidget className="-left-8 top-[70%]" delay={0.6}>
              <div className="bg-white/80 backdrop-blur-md border border-border p-3 rounded-xl shadow-xl shadow-violet-500/5 w-40">
                <div className="text-[10px] font-medium text-muted-foreground mb-1 uppercase tracking-wider">Traffic</div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-lg font-bold">1.57K</span>
                  <span className="text-[10px] text-green-500 font-medium mb-1">+12%</span>
                </div>
                <div className="flex items-end gap-1 h-8">
                  {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                    <div key={i} className="flex-1 bg-violet-200 rounded-t-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </FloatingWidget>

            <FloatingWidget className="-right-12 top-[5%]" delay={0.3}>
              <div className="bg-white/80 backdrop-blur-md border border-border p-2 rounded-xl shadow-xl shadow-violet-500/5 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-1 bg-violet-400 rounded-full" style={{ height: `${10 + Math.random() * 20}px` }} />
                  ))}
                </div>
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </FloatingWidget>

            <FloatingWidget className="-right-20 top-[35%]" delay={0.5}>
              <div className="bg-white/80 backdrop-blur-md border border-border p-3 rounded-xl shadow-xl shadow-violet-500/5 flex flex-col items-center gap-1">
                <div className="relative w-12 h-12">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" strokeWidth="3" />
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="53, 100" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">53%</div>
                </div>
                <span className="text-[9px] font-medium text-muted-foreground uppercase">Progress</span>
              </div>
            </FloatingWidget>

            <FloatingWidget className="-right-10 top-[65%]" delay={0.7}>
              <div className="bg-white/80 backdrop-blur-md border border-border p-3 rounded-xl shadow-xl shadow-violet-500/5 w-36">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase">Data Loading</span>
                  <span className="text-[10px] font-bold text-violet-600">14%</span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full w-[14%] bg-violet-500" />
                  </div>
                  <div className="h-1 w-[80%] bg-secondary rounded-full" />
                  <div className="h-1 w-[60%] bg-secondary rounded-full" />
                </div>
              </div>
            </FloatingWidget>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4" />
                <span>Built exclusively for Substack creators</span>
              </div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
                Know Your Readers.
                <br />
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
                  Grow Your Stack.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                The CRM that turns your Substack subscribers into lasting relationships. 
                Segment audiences, track engagement, and boost conversions—all in one place.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <div className="relative w-full sm:w-auto">
                  <input
                    type="email"
                    placeholder="Enter your email to get started"
                    className="w-full sm:w-96 h-12 pl-5 pr-32 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500"
                  />
                  <Button
                    size="sm"
                    className="absolute right-1.5 top-1.5 rounded-full px-5 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-8 mb-12">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold font-display bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-background rounded-2xl border border-border shadow-2xl shadow-violet-500/5 p-6 max-w-2xl mx-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">Popular creators using Stackly</span>
                <span className="text-xs text-violet-600 font-medium">7,568 subscribers managed</span>
              </div>
              <div className="space-y-3">
                {recentUsers.map((user, i) => (
                  <motion.div
                    key={user.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/60 transition-colors cursor-pointer group"
                  >
                    <Avatar className="w-10 h-10 ring-2 ring-violet-500/20">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.role}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

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

        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-violet-700 rounded-3xl p-12 md:p-16 text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
              <div className="relative z-10">
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  Ready to understand your readers?
                </h2>
                <p className="text-white/80 max-w-lg mx-auto mb-8 text-lg">
                  Join thousands of Substack creators who use Stackly to build deeper connections with their audience.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="rounded-full px-8 bg-white text-violet-700 hover:bg-white/90 font-medium"
                    >
                      Start Free Trial
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 bg-transparent border-white/30 text-white hover:bg-white/10"
                  >
                    Book a Demo
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-lg font-bold">Stackly</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
              <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 Stackly. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
