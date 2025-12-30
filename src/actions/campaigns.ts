"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { campaigns, subscribers, subscriberSegments, campaignAnalytics } from "@/db/schema";
import { eq, and, desc, inArray, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email/sendgrid";

/**
 * Get all campaigns for the current user
 */
export async function getCampaigns() {
    try {
        const session = await auth();
        if (!session?.user?.id) return { data: [], error: "Unauthorized" };

        const data = await db.select()
            .from(campaigns)
            .where(eq(campaigns.userId, session.user.id))
            .orderBy(desc(campaigns.createdAt));

        return { data, error: null };
    } catch (error) {
        console.error("Fetch campaigns error:", error);
        return { data: [], error: "Failed to fetch campaigns" };
    }
}

/**
 * Create a new draft campaign
 */
export async function createCampaign(data: { name: string; subject: string; content: string }) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        const [campaign] = await db.insert(campaigns).values({
            userId: session.user.id,
            name: data.name,
            subject: data.subject,
            content: data.content,
            status: "draft",
            type: "one-time"
        }).returning();

        revalidatePath("/dashboard/campaigns");
        return { success: true, campaign };
    } catch (error) {
        console.error("Create campaign error:", error);
        return { success: false, error: "Failed to create campaign" };
    }
}

/**
 * Update an existing campaign
 */
export async function updateCampaign(id: string, data: Partial<typeof campaigns.$inferInsert>) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        await db.update(campaigns)
            .set({ ...data, updatedAt: new Date() } as any) // Type assertion due to schema limitations in this context
            .where(and(eq(campaigns.id, id), eq(campaigns.userId, session.user.id)));

        revalidatePath("/dashboard/campaigns");
        revalidatePath(`/dashboard/campaigns/${id}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update campaign" };
    }
}

/**
 * Send a test email
 */
export async function sendTestEmail(campaignId: string, email: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        const [campaign] = await db.select()
            .from(campaigns)
            .where(and(eq(campaigns.id, campaignId), eq(campaigns.userId, session.user.id)));

        if (!campaign) return { success: false, error: "Campaign not found" };

        const result = await sendEmail({
            to: email,
            subject: `[TEST] ${campaign.subject}`,
            html: campaign.content || "",
        });

        return result;
    } catch (error) {
        return { success: false, error: "Failed to send test email" };
    }
}

/**
 * Send or Schedule Campaign
 */
export async function sendCampaign(campaignId: string, segmentId?: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        const [campaign] = await db.select()
            .from(campaigns)
            .where(and(eq(campaigns.id, campaignId), eq(campaigns.userId, session.user.id)));

        if (!campaign) return { success: false, error: "Campaign not found" };

        // 1. Fetch Recipients
        let recipients = [];
        if (segmentId) {
            // Fetch subscribers in segment
            // Complex join or subquery
            const segmentSubs = await db.select({
                email: subscribers.email,
                id: subscribers.id,
                name: subscribers.name
            })
                .from(subscribers)
                .innerJoin(subscriberSegments, eq(subscriberSegments.subscriberId, subscribers.id))
                .where(eq(subscriberSegments.segmentId, segmentId));
            recipients = segmentSubs;
        } else {
            // All subscribers
            recipients = await db.select({
                email: subscribers.email,
                id: subscribers.id,
                name: subscribers.name
            })
                .from(subscribers)
                .where(eq(subscribers.userId, session.user.id));
        }

        if (recipients.length === 0) {
            return { success: false, error: "No recipients found" };
        }

        // 2. Mock Sending Process (In production, use a queue)
        // We'll just create the analytics records and update status for now

        await db.update(campaigns)
            .set({
                status: "sent",
                sentCount: recipients.length,
                // sentAt: new Date() // if we had this column
            })
            .where(eq(campaigns.id, campaignId));

        // Bulk insert analytics placeholders
        if (recipients.length > 0) {
            const analyticsRecords = recipients.map(sub => ({
                campaignId: campaign.id,
                subscriberId: sub.id,
                sent: true,
                sentAt: new Date(),
            }));

            // Insert in chunks
            const chunkSize = 500;
            for (let i = 0; i < analyticsRecords.length; i += chunkSize) {
                await db.insert(campaignAnalytics).values(analyticsRecords.slice(i, i + chunkSize));
            }
        }

        // Actually trigger sends async if using real API
        // For each recipient, sendEmail(...)
        // Since this can be slow, we typically offload to background worker.
        // We'll assume the cron/worker picks up "sending" status campaigns if we were building full infra.

        revalidatePath("/dashboard/campaigns");
        return { success: true, count: recipients.length };

    } catch (error) {
        console.error("Send campaign error:", error);
        return { success: false, error: "Failed to send campaign" };
    }
}
