"use client";

import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Starter",
    price: "$0",
    description: "Perfect for growing newsletters",
    features: ["Up to 1,000 subscribers", "Basic analytics", "Standard templates", "Community support"],
    buttonText: "Start for Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    description: "For serious creators building a business",
    features: ["Unlimited subscribers", "Advanced analytics", "Custom personas", "Priority support", "Smart segmentation"],
    buttonText: "Get Pro",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    description: "Scale your media empire with confidence",
    features: ["Multiple stacks", "API access", "White-glove migration", "Dedicated manager", "Custom contracts"],
    buttonText: "Contact Sales",
    highlight: false,
  },
];

export default function PricingPage() {
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
            <Link href="/pricing" className="px-4 py-1.5 text-sm font-medium text-foreground bg-background transition-colors rounded-full">
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

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Simple, transparent pricing</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose the plan that's right for your newsletter's growth stage.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-8 rounded-3xl border ${
                  plan.highlight
                    ? "border-violet-500 bg-violet-500/5 shadow-xl shadow-violet-500/10"
                    : "border-border bg-background"
                } flex flex-col text-left`}
              >
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </div>

                <div className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-violet-600" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className={`w-full rounded-full ${
                    plan.highlight
                      ? "bg-violet-600 hover:bg-violet-700 text-white"
                      : "variant-outline"
                  }`}
                  variant={plan.highlight ? "default" : "outline"}
                >
                  {plan.buttonText}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
