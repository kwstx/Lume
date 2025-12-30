"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Save,
    Send,
    LayoutTemplate,
    Eye,
    Settings,
    Users,
    ArrowLeft,
    CheckCircle2,
    Loader2
} from "lucide-react";
import { toast } from "sonner";
import { updateCampaign, sendTestEmail, sendCampaign } from "@/actions/campaigns";

interface CampaignEditorProps {
    campaign: any;
    segments: any[];
}

export default function CampaignEditor({ campaign, segments }: CampaignEditorProps) {
    const router = useRouter();
    const [name, setName] = useState(campaign.name);
    const [subject, setSubject] = useState(campaign.subject || "");
    const [content, setContent] = useState(campaign.content || "");
    const [selectedSegment, setSelectedSegment] = useState<string>("all");

    const [isSaving, setIsSaving] = useState(false);
    const [isSendingTest, setIsSendingTest] = useState(false);
    const [isSending, setIsSending] = useState(false);

    // Test email state
    const [testEmail, setTestEmail] = useState("");

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const result = await updateCampaign(campaign.id, {
                name,
                subject,
                content,
            });
            if (result.success) {
                toast.success("Campaign saved");
            } else {
                toast.error("Failed to save campaign");
            }
        } catch (error) {
            toast.error("Error saving campaign");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSendTest = async () => {
        if (!testEmail) {
            toast.error("Please enter a test email address");
            return;
        }
        setIsSendingTest(true);
        try {
            // First save current content
            await updateCampaign(campaign.id, { subject, content });

            const result = await sendTestEmail(campaign.id, testEmail);
            if (result.success) {
                toast.success(`Test email sent to ${testEmail}`);
            } else {
                toast.error("Failed to send test email");
            }
        } catch (error) {
            toast.error("Error sending test email");
        } finally {
            setIsSendingTest(false);
        }
    };

    const handleSendCampaign = async () => {
        if (!confirm("Are you sure you want to send this campaign to all recipients? This action cannot be undone.")) {
            return;
        }

        setIsSending(true);
        try {
            const result = await sendCampaign(campaign.id, selectedSegment === 'all' ? undefined : selectedSegment);
            if (result.success) {
                toast.success(`Campaign sent successfully to ${result.count} recipients!`);
                router.push("/dashboard/campaigns");
            } else {
                toast.error(result.error || "Failed to send campaign");
            }
        } catch (error) {
            toast.error("Error sending campaign");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/campaigns")} className="rounded-full">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="text-xl font-bold bg-transparent border-none p-0 h-auto focus-visible:ring-0 px-2 -ml-2 w-[300px]"
                            />
                            <Badge variant="secondary" className="uppercase text-[10px] tracking-wider">{campaign.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-400 font-medium">Last edited just now</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handleSave} disabled={isSaving} className="gap-2 rounded-full font-bold">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save
                    </Button>
                    <Button onClick={() => {
                        const tabs = document.querySelector('[role="tablist"]');
                        if (tabs) {
                            (tabs.lastChild as HTMLElement)?.click();
                        }
                    }} className="gap-2 bg-black text-white hover:bg-gray-800 rounded-full font-bold">
                        Review & Send
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Editor Area */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2rem] overflow-hidden">
                        <Tabs defaultValue="editor" className="w-full">
                            <div className="border-b border-gray-50 px-6 pt-6">
                                <TabsList className="bg-gray-50/50 p-1 rounded-full">
                                    <TabsTrigger value="editor" className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Editor</TabsTrigger>
                                    <TabsTrigger value="preview" className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Preview</TabsTrigger>
                                    <TabsTrigger value="settings" className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Settings</TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="editor" className="p-0 m-0">
                                <div className="p-6 space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold text-gray-700">Subject Line</Label>
                                        <Input
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            placeholder="Enter a compelling subject line..."
                                            className="h-12 rounded-xl text-lg"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold text-gray-700">Email Content</Label>
                                        <div className="relative">
                                            <Textarea
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                placeholder="Write your email content here (HTML supported)..."
                                                className="min-h-[400px] rounded-xl font-mono text-sm leading-relaxed p-4 resize-none"
                                            />
                                            {/* Toolbar placeholders */}
                                            <div className="absolute bottom-4 right-4 flex gap-2">
                                                <Button size="sm" variant="secondary" className="rounded-lg h-8 text-xs font-bold">
                                                    <LayoutTemplate className="w-3 h-3 mr-2" />
                                                    Templates
                                                </Button>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400">Basic HTML tags are supported.</p>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="preview" className="p-0 m-0">
                                <div className="p-8 bg-gray-50 min-h-[500px]">
                                    <div className="bg-white rounded-xl shadow-sm p-8 max-w-2xl mx-auto border border-gray-100">
                                        <div className="border-b border-gray-100 pb-4 mb-6">
                                            <h1 className="text-xl font-bold text-gray-900 mb-2">{subject || "No Subject"}</h1>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <div className="w-8 h-8 rounded-full bg-gray-200" />
                                                <span>Stackly Team</span>
                                            </div>
                                        </div>
                                        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: content || "<p>No content yet.</p>" }} />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="settings" className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Preheader Text</Label>
                                        <Input placeholder="Text shown after the subject line in email clients" className="rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Sender Name</Label>
                                        <Input defaultValue="Stackly Team" className="rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Reply-To Email</Label>
                                        <Input defaultValue="hello@stackly.app" className="rounded-xl" />
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2rem] p-6">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Send className="w-4 h-4" />
                            Sending Options
                        </h3>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-gray-500 uppercase">Recipients</Label>
                                <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                                    <SelectTrigger className="w-full rounded-xl h-10">
                                        <SelectValue placeholder="Select audience" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Subscribers</SelectItem>
                                        <SelectItem value="paid">Paid Subscribers</SelectItem>
                                        <SelectItem value="free">Free Subscribers</SelectItem>
                                        {segments.map(s => (
                                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                                    <Users className="w-3 h-3" />
                                    <span>Est. Audience: 1,234 recipients</span>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-gray-500 uppercase">Test Email</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="email@example.com"
                                        className="rounded-xl h-9 text-sm"
                                        value={testEmail}
                                        onChange={(e) => setTestEmail(e.target.value)}
                                    />
                                    <Button size="sm" variant="outline" onClick={handleSendTest} disabled={isSendingTest} className="rounded-xl h-9">
                                        {isSendingTest ? <Loader2 className="w-3 h-3 animate-spin" /> : "Send"}
                                    </Button>
                                </div>
                            </div>

                            <Button onClick={handleSendCampaign} disabled={isSending} className="w-full rounded-xl font-bold h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">
                                {isSending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Campaign Now
                                        <Send className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </Card>

                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2rem] p-6">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            Pre-send Checklist
                        </h3>
                        <div className="space-y-3">
                            {[
                                { label: "Subject line added", done: !!subject },
                                { label: "Content added", done: !!content && content.length > 20 },
                                { label: "Test email sent", done: false }, // Could track this state
                                { label: "Audience selected", done: true },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.done ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-300'}`}>
                                        <CheckCircle2 className="w-3 h-3" />
                                    </div>
                                    <span className={item.done ? 'text-gray-700 font-medium' : 'text-gray-400'}>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
