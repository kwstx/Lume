"use server";

import { db } from "@/db";
import { webhooks, webhookEvents } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

export async function getWebhooks() {
    try {
        const session = await auth();
        if (!session?.user?.id) return { data: [], error: "Unauthorized" };

        const data = await db.select().from(webhooks)
            .where(eq(webhooks.userId, session.user.id))
            .orderBy(desc(webhooks.createdAt));

        return { data, error: null };
    } catch (error) {
        return { data: [], error: "Failed to fetch webhooks" };
    }
}

export async function createWebhook(url: string, events: string[]) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        // Basic URL validation
        try {
            new URL(url);
        } catch {
            return { success: false, error: "Invalid URL" };
        }

        const secret = `wh_sec_${crypto.randomBytes(24).toString('hex')}`;

        await db.insert(webhooks).values({
            userId: session.user.id,
            url,
            events,
            secret,
            isActive: true, // explicit default
        });

        revalidatePath("/dashboard/settings/webhooks");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to create webhook" };
    }
}

export async function deleteWebhook(id: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        await db.delete(webhooks)
            .where(and(eq(webhooks.id, id), eq(webhooks.userId, session.user.id)));

        revalidatePath("/dashboard/settings/webhooks");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete webhook" };
    }
}

export async function getWebhookEvents(webhookId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { data: [], error: "Unauthorized" };

        // Verify ownership first
        const webhook = await db.query.webhooks.findFirst({
            where: and(eq(webhooks.id, webhookId), eq(webhooks.userId, session.user.id))
        });

        if (!webhook) return { data: [], error: "Webhook not found" };

        const events = await db.select().from(webhookEvents)
            .where(eq(webhookEvents.webhookId, webhookId))
            .orderBy(desc(webhookEvents.createdAt))
            .limit(20);

        return { data: events, error: null };
    } catch (error) {
        return { data: [], error: "Failed to fetch events" };
    }
}
