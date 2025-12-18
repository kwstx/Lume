"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Mail,
  TrendingUp,
  TrendingDown,
  Star,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  UserPlus,
  Upload,
} from "lucide-react";

const subscribers = [
  {
    id: 1,
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    status: "paid",
    engagement: "high",
    openRate: 82,
    joinedDate: "2024-01-15",
    lastActive: "2 hours ago",
    tags: ["tech", "productivity"],
  },
  {
    id: 2,
    name: "Alex Thompson",
    email: "alex.t@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    status: "free",
    engagement: "medium",
    openRate: 65,
    joinedDate: "2024-02-20",
    lastActive: "1 day ago",
    tags: ["startup"],
  },
  {
    id: 3,
    name: "Sophie Chen",
    email: "sophie.chen@example.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    status: "paid",
    engagement: "high",
    openRate: 91,
    joinedDate: "2023-11-08",
    lastActive: "5 minutes ago",
    tags: ["ai", "tech", "investing"],
  },
  {
    id: 4,
    name: "Marcus Johnson",
    email: "marcus.j@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    status: "free",
    engagement: "low",
    openRate: 23,
    joinedDate: "2024-03-01",
    lastActive: "2 weeks ago",
    tags: ["casual"],
  },
  {
    id: 5,
    name: "Lisa Park",
    email: "lisa.park@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    status: "paid",
    engagement: "high",
    openRate: 88,
    joinedDate: "2023-09-22",
    lastActive: "30 minutes ago",
    tags: ["design", "creativity"],
  },
  {
    id: 6,
    name: "David Kim",
    email: "david.kim@example.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    status: "free",
    engagement: "at-risk",
    openRate: 12,
    joinedDate: "2024-01-30",
    lastActive: "1 month ago",
    tags: [],
  },
  {
    id: 7,
    name: "Rachel Green",
    email: "rachel.g@example.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
    status: "paid",
    engagement: "medium",
    openRate: 56,
    joinedDate: "2023-12-15",
    lastActive: "3 days ago",
    tags: ["lifestyle"],
  },
  {
    id: 8,
    name: "James Lee",
    email: "james.lee@example.com",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100",
    status: "free",
    engagement: "medium",
    openRate: 48,
    joinedDate: "2024-02-10",
    lastActive: "6 hours ago",
    tags: ["finance", "crypto"],
  },
];

const quickFilters = [
  { label: "All", value: "all", count: 12847 },
  { label: "Paid", value: "paid", count: 2340 },
  { label: "Free", value: "free", count: 10507 },
  { label: "High Engagement", value: "high", count: 3240 },
  { label: "At Risk", value: "at-risk", count: 1177 },
];

export default function SubscribersPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedSubscribers, setSelectedSubscribers] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSubscriber = (id: number) => {
    setSelectedSubscribers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedSubscribers.length === subscribers.length) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(subscribers.map((s) => s.id));
    }
  };

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case "high":
        return "text-emerald-600 bg-emerald-50";
      case "medium":
        return "text-amber-600 bg-amber-50";
      case "low":
        return "text-slate-600 bg-slate-100";
      case "at-risk":
        return "text-rose-600 bg-rose-50";
      default:
        return "text-slate-600 bg-slate-100";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Subscribers</h1>
          <p className="text-muted-foreground mt-1">
            Manage and segment your newsletter audience
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" className="rounded-xl">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Subscriber
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {quickFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setSelectedFilter(filter.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedFilter === filter.value
                ? "bg-violet-100 text-violet-700 border border-violet-200"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            }`}
          >
            {filter.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                selectedFilter === filter.value
                  ? "bg-violet-200 text-violet-800"
                  : "bg-background"
              }`}
            >
              {filter.count.toLocaleString()}
            </span>
          </button>
        ))}
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search subscribers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                />
              </div>
              <Select defaultValue="all-segments">
                <SelectTrigger className="w-[180px] rounded-xl">
                  <SelectValue placeholder="Segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-segments">All Segments</SelectItem>
                  <SelectItem value="highly-engaged">Highly Engaged</SelectItem>
                  <SelectItem value="active-readers">Active Readers</SelectItem>
                  <SelectItem value="occasional">Occasional</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all-tags">
                <SelectTrigger className="w-[140px] rounded-xl">
                  <SelectValue placeholder="Tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-tags">All Tags</SelectItem>
                  <SelectItem value="tech">Tech</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="productivity">Productivity</SelectItem>
                  <SelectItem value="lifestyle">Lifestyle</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="rounded-xl">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
            {selectedSubscribers.length > 0 && (
              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm text-muted-foreground">
                  {selectedSubscribers.length} selected
                </span>
                <Button variant="outline" size="sm" className="rounded-lg">
                  <Mail className="w-4 h-4 mr-1" />
                  Send Message
                </Button>
                <Button variant="outline" size="sm" className="rounded-lg">
                  Add to Segment
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <Checkbox
                      checked={selectedSubscribers.length === subscribers.length}
                      onCheckedChange={toggleAll}
                    />
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Subscriber
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Engagement
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Open Rate
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {subscribers.map((subscriber) => (
                  <tr
                    key={subscriber.id}
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selectedSubscribers.includes(subscriber.id)}
                        onCheckedChange={() => toggleSubscriber(subscriber.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9">
                          <AvatarImage
                            src={subscriber.avatar}
                            alt={subscriber.name}
                          />
                          <AvatarFallback>{subscriber.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{subscriber.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {subscriber.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={subscriber.status === "paid" ? "default" : "secondary"}
                        className={`text-xs ${
                          subscriber.status === "paid"
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                            : ""
                        }`}
                      >
                        {subscriber.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {subscriber.engagement === "high" && (
                          <Star className="w-4 h-4 text-emerald-500" />
                        )}
                        {subscriber.engagement === "at-risk" && (
                          <AlertCircle className="w-4 h-4 text-rose-500" />
                        )}
                        <Badge
                          variant="outline"
                          className={`text-xs capitalize ${getEngagementColor(
                            subscriber.engagement
                          )}`}
                        >
                          {subscriber.engagement}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              subscriber.openRate >= 70
                                ? "bg-emerald-500"
                                : subscriber.openRate >= 40
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                            style={{ width: `${subscriber.openRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {subscriber.openRate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {subscriber.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 h-5 bg-violet-50 text-violet-700 border-violet-200"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {subscriber.tags.length > 2 && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 h-5"
                          >
                            +{subscriber.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground">
                        {subscriber.lastActive}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing 1-8 of 12,847 subscribers
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-lg" disabled>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="sm" className="rounded-lg">
                1
              </Button>
              <Button variant="ghost" size="sm" className="rounded-lg">
                2
              </Button>
              <Button variant="ghost" size="sm" className="rounded-lg">
                3
              </Button>
              <span className="text-muted-foreground">...</span>
              <Button variant="ghost" size="sm" className="rounded-lg">
                1606
              </Button>
              <Button variant="outline" size="sm" className="rounded-lg">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
