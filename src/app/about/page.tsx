"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Rocket, Target } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const values = [
  {
    icon: Heart,
    title: "Reader First",
    description: "We believe newsletters are the most intimate way to connect with an audience. We build for the readers as much as the creators.",
  },
  {
    icon: Rocket,
    title: "Creator Growth",
    description: "Our mission is to help 1 million independent creators build sustainable, thriving media businesses on Substack.",
  },
  {
    icon: Target,
    title: "Data Integrity",
    description: "Your data is yours. We provide the insights, you maintain the relationship. We never sell or share creator data.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">Stackly</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-secondary/60 rounded-full px-1 py-1">
            <Link href="/#features" className="px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-background">
              Features
            </Link>
            <Link href="/pricing" className="px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-background">
              Pricing
            </Link>
            <Link href="/about" className="px-4 py-1.5 text-sm font-medium text-foreground bg-background transition-colors rounded-full">
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

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Our mission is to help creators thrive</h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Stackly was born out of a simple observation: Substack creators have amazing writing, but limited tools to understand who is actually reading their work. We built the CRM we wanted for ourselves.
            </p>
          </motion.div>

          <div className="grid gap-8 mb-20">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col md:flex-row gap-6 p-8 rounded-3xl border border-border hover:border-violet-500/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <value.icon className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center p-12 rounded-3xl bg-secondary/30 border border-border">
            <h2 className="text-2xl font-bold mb-4">Join the journey</h2>
            <p className="text-muted-foreground mb-8">We're just getting started and we'd love for you to be part of our community.</p>
            <Link href="/dashboard">
              <Button className="rounded-full px-8 bg-violet-600 hover:bg-violet-700 text-white">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
