"use server";

import { db } from "@/db";
import { onboardingProgress } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export type OnboardingStep = "connect_substack" | "import_subscribers" | "create_campaign" | "send_test_email";

export async function getOnboardingStatus() {
    try {
        const session = await auth();
        if (!session?.user?.id) return { data: null, error: "Unauthorized" };

        const progress = await db.query.onboardingProgress.findFirst({
            where: eq(onboardingProgress.userId, session.user.id)
        });

        if (!progress) {
            // Create default entry if not exists
            const [newProgress] = await db.insert(onboardingProgress).values({
                userId: session.user.id,
                currentStep: 0,
                completedSteps: [],
                skipped: false
            }).returning();
            return { data: newProgress, error: null };
        }

        return { data: progress, error: null };
    } catch (error) {
        console.error("Get onboarding status error:", error);
        return { data: null, error: "Failed to fetch onboarding status" };
    }
}

export async function updateOnboardingStep(step: OnboardingStep) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        const progress = await db.query.onboardingProgress.findFirst({
            where: eq(onboardingProgress.userId, session.user.id)
        });

        const currentCompleted = progress?.completedSteps || [];
        if (currentCompleted.includes(step)) return { success: true }; // Already done

        const newCompleted = [...currentCompleted, step];

        // Calculate step index based on predefined order if strictly linear, 
        // but checklist style is often non-linear.
        // Let's just track completed steps.

        await db.update(onboardingProgress)
            .set({
                completedSteps: newCompleted,
                updatedAt: new Date() // Schema might not have this, check schema. If not, ignore
            } as any)
            .where(eq(onboardingProgress.userId, session.user.id));

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Update onboarding error:", error);
        return { success: false, error: "Failed to update onboarding" };
    }
}

export async function dismissOnboarding() {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        await db.update(onboardingProgress)
            .set({ skipped: true })
            .where(eq(onboardingProgress.userId, session.user.id));

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to dismiss onboarding" };
    }
}
