"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Send,
  Mail,
  MessageSquare,
  Plus,
  Search,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Sparkles,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  Eye,
  Calendar,
  Filter,
} from "lucide-react";

const campaigns = [
  {
    id: 1,
    name: "Welcome Sequence",
    status: "active",
    type: "automated",
    recipients: 847,
    openRate: 68,
    clickRate: 24,
    lastSent: "Ongoing",
  },
  {
    id: 2,
    name: "Re-engagement Campaign",
    status: "scheduled",
    type: "one-time",
    recipients: 1177,
    openRate: null,
    clickRate: null,
    lastSent: "Dec 20, 2024",
  },
  {
    id: 3,
    name: "Paid Upsell Series",
    status: "active",
    type: "automated",
    recipients: 3240,
    openRate: 52,
    clickRate: 18,
    lastSent: "Ongoing",
  },
  {
    id: 4,
    name: "Newsletter Survey",
    status: "completed",
    type: "one-time",
    recipients: 8500,
    openRate: 42,
    clickRate: 15,
    lastSent: "Dec 10, 2024",
  },
  {
    id: 5,
    name: "Holiday Special",
    status: "draft",
    type: "one-time",
    recipients: 12847,
    openRate: null,
    clickRate: null,
    lastSent: "Not sent",
  },
];

const templates = [
  {
    id: 1,
    name: "Welcome Email",
    category: "Onboarding",
    uses: 847,
    preview:
      "Welcome to [Newsletter]! I'm thrilled to have you here. Here's what you can expect...",
  },
  {
    id: 2,
    name: "Re-engagement",
    category: "Win-back",
    uses: 324,
    preview:
      "Hey [Name], I noticed you haven't opened my emails in a while. I wanted to check in...",
  },
  {
    id: 3,
    name: "Paid Upgrade",
    category: "Conversion",
    uses: 1205,
    preview:
      "You've been a loyal reader for [X] months. I wanted to share an exclusive opportunity...",
  },
  {
    id: 4,
    name: "Survey Request",
    category: "Engagement",
    uses: 456,
    preview:
      "I'd love your input! This quick 2-minute survey will help me create better content...",
  },
];

const conversations = [
  {
    id: 1,
    subscriber: {
      name: "Emma Wilson",
      email: "emma@example.com",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    },
    lastMessage: "Thanks for the great content! I have a question about...",
    time: "2 hours ago",
    unread: true,
    status: "paid",
  },
  {
    id: 2,
    subscriber: {
      name: "Alex Thompson",
      email: "alex@example.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    },
    lastMessage: "Would love to see more content about productivity tools",
    time: "5 hours ago",
    unread: true,
    status: "free",
  },
  {
    id: 3,
    subscriber: {
      name: "Sophie Chen",
      email: "sophie@example.com",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    },
    lastMessage: "Absolutely! Let me know if you need anything else.",
    time: "1 day ago",
    unread: false,
    status: "paid",
  },
  {
    id: 4,
    subscriber: {
      name: "Marcus Johnson",
      email: "marcus@example.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    },
    lastMessage: "I'd be interested in the premium tier. What's included?",
    time: "2 days ago",
    unread: false,
    status: "free",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "scheduled":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "completed":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "draft":
      return "bg-amber-100 text-amber-700 border-amber-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

export default function OutreachPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messageText, setMessageText] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Outreach Hub</h1>
          <p className="text-muted-foreground mt-1">
            Manage campaigns, templates, and subscriber conversations
          </p>
        </div>
        <Button className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="bg-secondary/60 p-1 rounded-xl">
          <TabsTrigger value="campaigns" className="rounded-lg data-[state=active]:bg-background">
            <Mail className="w-4 h-4 mr-2" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="templates" className="rounded-lg data-[state=active]:bg-background">
            <FileText className="w-4 h-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="messages" className="rounded-lg data-[state=active]:bg-background">
            <MessageSquare className="w-4 h-4 mr-2" />
            Messages
            <Badge className="ml-2 bg-violet-100 text-violet-700 hover:bg-violet-100">2</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  className="h-10 w-64 pl-9 pr-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                />
              </div>
              <Select defaultValue="all-status">
                <SelectTrigger className="w-[140px] rounded-xl">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          campaign.type === "automated"
                            ? "bg-violet-100 text-violet-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {campaign.type === "automated" ? (
                          <Sparkles className="w-5 h-5" />
                        ) : (
                          <Mail className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{campaign.name}</span>
                          <Badge variant="outline" className={`text-xs ${getStatusColor(campaign.status)}`}>
                            {campaign.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {campaign.recipients.toLocaleString()} recipients
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {campaign.lastSent}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      {campaign.openRate !== null && (
                        <div className="text-center">
                          <div className="text-sm font-medium">{campaign.openRate}%</div>
                          <div className="text-xs text-muted-foreground">Open Rate</div>
                        </div>
                      )}
                      {campaign.clickRate !== null && (
                        <div className="text-center">
                          <div className="text-sm font-medium">{campaign.clickRate}%</div>
                          <div className="text-xs text-muted-foreground">Click Rate</div>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  className="h-10 w-64 pl-9 pr-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                />
              </div>
            </div>
            <Button variant="outline" className="rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{template.name}</h3>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {template.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {template.preview}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Used {template.uses} times
                    </span>
                    <Button variant="outline" size="sm" className="rounded-lg text-xs">
                      Use Template
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="messages">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            <Card className="border-border/50 shadow-sm overflow-hidden">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Conversations</CardTitle>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    className="w-full h-9 pl-9 pr-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto" style={{ height: "calc(100% - 120px)" }}>
                <div className="divide-y divide-border">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-3 cursor-pointer transition-colors ${
                        selectedConversation.id === conversation.id
                          ? "bg-violet-50"
                          : "hover:bg-secondary/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={conversation.subscriber.avatar}
                              alt={conversation.subscriber.name}
                            />
                            <AvatarFallback>{conversation.subscriber.name[0]}</AvatarFallback>
                          </Avatar>
                          {conversation.unread && (
                            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-violet-500 border-2 border-background" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${conversation.unread ? "font-semibold" : "font-medium"}`}>
                              {conversation.subscriber.name}
                            </span>
                            <span className="text-xs text-muted-foreground">{conversation.time}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge
                              variant="outline"
                              className={`text-[10px] px-1 py-0 h-4 ${
                                conversation.status === "paid"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : ""
                              }`}
                            >
                              {conversation.status}
                            </Badge>
                          </div>
                          <p className={`text-xs mt-1 truncate ${conversation.unread ? "text-foreground" : "text-muted-foreground"}`}>
                            {conversation.lastMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-border/50 shadow-sm flex flex-col overflow-hidden">
              <CardHeader className="pb-3 border-b flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={selectedConversation.subscriber.avatar}
                        alt={selectedConversation.subscriber.name}
                      />
                      <AvatarFallback>{selectedConversation.subscriber.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{selectedConversation.subscriber.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {selectedConversation.subscriber.email}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    View Profile
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex justify-start">
                  <div className="max-w-[70%] bg-secondary rounded-2xl rounded-tl-sm p-3">
                    <p className="text-sm">{selectedConversation.lastMessage}</p>
                    <span className="text-xs text-muted-foreground mt-1 block">
                      {selectedConversation.time}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[70%] bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-2xl rounded-tr-sm p-3">
                    <p className="text-sm">
                      Thanks for reaching out! I'd be happy to help. What specific questions do you have?
                    </p>
                    <span className="text-xs text-white/70 mt-1 block">Just now</span>
                  </div>
                </div>
              </CardContent>
              <div className="p-4 border-t flex-shrink-0">
                <div className="flex items-end gap-3">
                  <Textarea
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="min-h-[60px] max-h-[120px] rounded-xl resize-none"
                  />
                  <Button
                    className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white h-[60px] px-6"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
