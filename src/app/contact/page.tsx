"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, Mail, MessageSquare, Twitter, MapPin } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ContactPage() {
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
            <Link href="/about" className="px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-background">
              About
            </Link>
            <Link href="/contact" className="px-4 py-1.5 text-sm font-medium text-foreground bg-background transition-colors rounded-full">
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
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Get in touch</h1>
              <p className="text-muted-foreground text-lg mb-12">
                Have questions about Stackly? We're here to help you grow your Substack.
              </p>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-bold">Email us</h3>
                    <p className="text-muted-foreground">support@stackly.so</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <Twitter className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-bold">Twitter</h3>
                    <p className="text-muted-foreground">@stacklyhq</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-bold">Office</h3>
                    <p className="text-muted-foreground">Remote-first team, based in SF & NYC</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-secondary/30 p-8 rounded-3xl border border-border"
            >
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <input className="w-full h-10 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-violet-500/30 outline-none" placeholder="Jane" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <input className="w-full h-10 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-violet-500/30 outline-none" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input className="w-full h-10 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-violet-500/30 outline-none" placeholder="jane@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <textarea className="w-full h-32 p-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-violet-500/30 outline-none resize-none" placeholder="How can we help?" />
                </div>
                <Button className="w-full h-12 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium">
                  Send Message
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
