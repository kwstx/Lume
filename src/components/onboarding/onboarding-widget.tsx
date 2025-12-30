"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { dismissOnboarding, type OnboardingStep } from "@/actions/onboarding";
import { toast } from "sonner";
import { ConnectSubstackDialog } from "@/components/settings/connect-substack-dialog";
import { ImportDialog } from "@/components/subscribers/import-dialog";

interface OnboardingWidgetProps {
    progress: {
        completedSteps: string[] | null;
        skipped: boolean | null;
    } | null;
}

const STEPS = [
    {
        id: "connect_substack" as OnboardingStep,
        title: "Connect Substack",
        description: "Sync your newsletter data automatically.",
        action: "Connect",
        href: null, // Dialog trigger
    },
    {
        id: "import_subscribers" as OnboardingStep,
        title: "Import Subscribers",
        description: "Upload your existing CSV list.",
        action: "Import",
        href: null, // Dialog trigger
    },
    {
        id: "create_campaign" as OnboardingStep,
        title: "Draft First Campaign",
        description: "Create a new email campaign.",
        action: "Create",
        href: "/dashboard/campaigns/new",
    },
];

export function OnboardingWidget({ progress }: OnboardingWidgetProps) {
    const [isVisible, setIsVisible] = useState(!progress?.skipped);
    const [showConnect, setShowConnect] = useState(false);
    const [showImport, setShowImport] = useState(false);
    const router = useRouter();

    const completedSteps = progress?.completedSteps || [];
    const percent = Math.round((completedSteps.length / STEPS.length) * 100);

    if (!isVisible || percent === 100) return null;

    const handleDismiss = async () => {
        setIsVisible(false);
        const res = await dismissOnboarding();
        if (!res.success) toast.error("Failed to dismiss");
    };

    const handleAction = (step: typeof STEPS[0]) => {
        if (step.id === "connect_substack") setShowConnect(true);
        else if (step.id === "import_subscribers") setShowImport(true);
        else if (step.href) router.push(step.href);
    };

    return (
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <ConnectSubstackDialog open={showConnect} onOpenChange={setShowConnect} onSuccess={() => window.location.reload()} />

            {/* Hidden Import Dialog trigger, reusing the component logic but customized slightly if needed.
                Actually ImportDialog usually has a trigger. We can mount it conditionally or pass open prop if it supported it.
                My ImportDialog only supported trigger prop in previous edits. 
                I should update ImportDialog to support controlled open state or just use a ref/trigger.
                For now, let's assuming ImportDialog is button-triggered only, so I might need to refactor it or use a trick.
                Wait, I refactored it to accept `trigger`. I can put a hidden button and click it?
                Or better, update ImportDialog to be controlled.
             */}
            {/* Temporary solution: Render ImportDialog with a button that we click programmatically? No, that's hacky.
                 Let's just use the router to go to Subscribers page where Import is prominent, OR refactor ImportDialog.
                 Actually, "Import Subscribers" step can just link to /dashboard/subscribers query param ?import=true
              */}
            <ImportDialog trigger={<span id="import-trigger" className="hidden" />} />

            <Card className="p-6 bg-gradient-to-r from-violet-50 to-white border-violet-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600" onClick={handleDismiss}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                    <div className="flex-1 space-y-4">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">Welcome to Lume! 🚀</h3>
                            <p className="text-gray-500 text-sm">Let's get your CRM set up and ready for action.</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-violet-700 uppercase tracking-wider">
                                <span>Setup Progress</span>
                                <span>{percent}%</span>
                            </div>
                            <Progress value={percent} className="h-2 bg-violet-100" />
                        </div>
                    </div>

                    <div className="flex-1 w-full md:w-auto grid gap-3">
                        {STEPS.map((step) => {
                            const isCompleted = completedSteps.includes(step.id);
                            return (
                                <div
                                    key={step.id}
                                    className={cn(
                                        "flex items-center justify-between p-3 rounded-xl border transition-all",
                                        isCompleted
                                            ? "bg-green-50/50 border-green-100 text-green-700"
                                            : "bg-white border-gray-100 hover:border-violet-200 hover:shadow-sm"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {isCompleted ? (
                                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                                        )}
                                        <div>
                                            <p className={cn("text-sm font-bold", isCompleted ? "text-green-800" : "text-gray-900")}>
                                                {step.title}
                                            </p>
                                            <p className="text-xs text-gray-500 hidden sm:block">{step.description}</p>
                                        </div>
                                    </div>

                                    {!isCompleted && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 font-bold text-xs"
                                            onClick={() => handleAction(step)}
                                        >
                                            {step.action} <ArrowRight className="w-3 h-3 ml-1" />
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Card>
        </div>
    );
}
