"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  Heart,
  Clock,
  BookOpen,
  Lightbulb,
  MoreHorizontal,
  Users,
  Mail,
  Zap,
  ChevronRight,
  Edit3,
  Trash2,
} from "lucide-react";

const personas = [
  {
    id: 1,
    name: "Tech Enthusiast Taylor",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    age: "28-35",
    occupation: "Software Developer",
    subscriberCount: 2840,
    engagementRate: 78,
    color: "violet",
    interests: ["AI/ML", "Productivity", "Startup Culture", "Code Tutorials"],
    behaviors: [
      "Opens emails within 2 hours",
      "High click-through on technical content",
      "Likely to share on Twitter",
    ],
    preferredContent: "In-depth technical deep dives",
    bestSendTime: "Tuesday, 9 AM",
    conversionPotential: 85,
    description:
      "Tech-savvy professionals who consume content to stay ahead in their career. They value actionable insights and detailed tutorials.",
  },
  {
    id: 2,
    name: "Curious Creator Casey",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    age: "25-32",
    occupation: "Content Creator / Designer",
    subscriberCount: 1920,
    engagementRate: 82,
    color: "pink",
    interests: ["Design", "Creativity", "Side Projects", "Personal Branding"],
    behaviors: [
      "Engages heavily with visual content",
      "Frequently comments on posts",
      "Subscribes to multiple newsletters",
    ],
    preferredContent: "Creative inspiration and case studies",
    bestSendTime: "Thursday, 11 AM",
    conversionPotential: 72,
    description:
      "Creative professionals looking for inspiration and practical tips to grow their personal brand and creative business.",
  },
  {
    id: 3,
    name: "Executive Emma",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    age: "35-45",
    occupation: "Business Leader / Manager",
    subscriberCount: 1450,
    engagementRate: 65,
    color: "emerald",
    interests: ["Leadership", "Strategy", "Industry Trends", "Productivity"],
    behaviors: [
      "Prefers concise summaries",
      "Opens on mobile during commute",
      "High paid conversion rate",
    ],
    preferredContent: "Quick insights and executive summaries",
    bestSendTime: "Monday, 7 AM",
    conversionPotential: 92,
    description:
      "Time-strapped executives who need efficient, high-value content that helps them make better decisions.",
  },
  {
    id: 4,
    name: "Aspiring Investor Alex",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    age: "30-40",
    occupation: "Finance Professional",
    subscriberCount: 980,
    engagementRate: 71,
    color: "amber",
    interests: ["Investing", "Market Analysis", "Crypto", "Personal Finance"],
    behaviors: [
      "High engagement with data-driven content",
      "Reads long-form analysis",
      "Saves emails for reference",
    ],
    preferredContent: "Market analysis and investment insights",
    bestSendTime: "Sunday, 8 PM",
    conversionPotential: 78,
    description:
      "Finance-minded readers who want to make informed investment decisions and stay updated on market trends.",
  },
];

const insights = [
  {
    icon: TrendingUp,
    title: "Highest Engagement",
    value: "Curious Creator Casey",
    detail: "82% open rate",
    color: "text-emerald-600",
  },
  {
    icon: Target,
    title: "Best Conversion",
    value: "Executive Emma",
    detail: "92% potential",
    color: "text-violet-600",
  },
  {
    icon: Users,
    title: "Largest Segment",
    value: "Tech Enthusiast Taylor",
    detail: "2,840 subscribers",
    color: "text-blue-600",
  },
];

export default function PersonasPage() {
  const [selectedPersona, setSelectedPersona] = useState(personas[0]);

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string; light: string }> = {
      violet: {
        bg: "bg-violet-500",
        text: "text-violet-700",
        border: "border-violet-200",
        light: "bg-violet-50",
      },
      pink: {
        bg: "bg-pink-500",
        text: "text-pink-700",
        border: "border-pink-200",
        light: "bg-pink-50",
      },
      emerald: {
        bg: "bg-emerald-500",
        text: "text-emerald-700",
        border: "border-emerald-200",
        light: "bg-emerald-50",
      },
      amber: {
        bg: "bg-amber-500",
        text: "text-amber-700",
        border: "border-amber-200",
        light: "bg-amber-50",
      },
    };
    return colors[color] || colors.violet;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Audience Personas</h1>
          <p className="text-muted-foreground mt-1">
            Understand your readers with AI-generated personas
          </p>
        </div>
        <Button className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white">
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Persona
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight) => (
          <Card key={insight.title} className="border-border/50 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-secondary ${insight.color}`}>
                  <insight.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{insight.title}</p>
                  <p className="font-semibold text-sm">{insight.value}</p>
                  <p className="text-xs text-muted-foreground">{insight.detail}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Your Personas</h2>
          {personas.map((persona) => {
            const colors = getColorClasses(persona.color);
            const isSelected = selectedPersona.id === persona.id;
            return (
              <Card
                key={persona.id}
                onClick={() => setSelectedPersona(persona)}
                className={`border-border/50 shadow-sm cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? `ring-2 ring-${persona.color}-500 ${colors.light}` : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12 ring-2 ring-offset-2 ring-offset-background ring-border">
                      <AvatarImage src={persona.avatar} alt={persona.name} />
                      <AvatarFallback>{persona.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm truncate">{persona.name}</h3>
                        <ChevronRight
                          className={`w-4 h-4 text-muted-foreground transition-transform ${
                            isSelected ? "rotate-90" : ""
                          }`}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {persona.occupation}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs">
                            {persona.subscriberCount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs">{persona.engagementRate}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          <Button variant="outline" className="w-full rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            Create Custom Persona
          </Button>
        </div>

        <div className="lg:col-span-2">
          <Card className="border-border/50 shadow-sm h-full">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 ring-4 ring-offset-2 ring-offset-background ring-violet-200">
                    <AvatarImage src={selectedPersona.avatar} alt={selectedPersona.name} />
                    <AvatarFallback>{selectedPersona.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{selectedPersona.name}</CardTitle>
                    <p className="text-muted-foreground">
                      {selectedPersona.occupation} • Age {selectedPersona.age}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant="outline"
                        className={`${getColorClasses(selectedPersona.color).light} ${
                          getColorClasses(selectedPersona.color).text
                        } ${getColorClasses(selectedPersona.color).border}`}
                      >
                        {selectedPersona.subscriberCount.toLocaleString()} subscribers
                      </Badge>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        {selectedPersona.engagementRate}% engagement
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="rounded-xl">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-xl">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-violet-600" />
                  About This Persona
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedPersona.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-pink-500" />
                    Key Interests
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPersona.interests.map((interest) => (
                      <Badge key={interest} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    Behaviors
                  </h4>
                  <ul className="space-y-2">
                    {selectedPersona.behaviors.map((behavior, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 flex-shrink-0" />
                        {behavior}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-secondary/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-medium">Best Content</span>
                  </div>
                  <p className="text-sm">{selectedPersona.preferredContent}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-medium">Best Send Time</span>
                  </div>
                  <p className="text-sm">{selectedPersona.bestSendTime}</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-medium">Conversion Potential</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={selectedPersona.conversionPotential} className="h-2 flex-1" />
                    <span className="text-sm font-medium">
                      {selectedPersona.conversionPotential}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t flex items-center gap-3">
                <Button className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white">
                  <Mail className="w-4 h-4 mr-2" />
                  Create Campaign for Persona
                </Button>
                <Button variant="outline" className="rounded-xl">
                  <Users className="w-4 h-4 mr-2" />
                  View Matching Subscribers
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
