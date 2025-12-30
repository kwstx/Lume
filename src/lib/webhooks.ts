import { db } from "@/db";
import { webhooks, webhookEvents } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

interface WebhookPayload {
    event: string;
    data: any;
    timestamp: number;
}

export async function triggerWebhook(userId: string, event: string, data: any) {
    try {
        // 1. Find active webhooks for this user that subscribe to this event (or all)
        // For simplicity, we assume if events is null it means ALL, or we check array inclusion

        // Drizzle array contains is tricky with JSONB. 
        // We will fetch all active webhooks for user and filter in code for MVP reliability
        const userWebhooks = await db.select().from(webhooks)
            .where(and(
                eq(webhooks.userId, userId),
                eq(webhooks.isActive, true)
            ));

        const matchedWebhooks = userWebhooks.filter(wh => {
            if (!wh.events || wh.events.length === 0) return true; // All events
            return wh.events.includes(event);
        });

        if (matchedWebhooks.length === 0) return;

        console.log(`[Webhook] Dispatching event ${event} to ${matchedWebhooks.length} endpoints`);

        // 2. Dispatch to all matched webhooks
        const promises = matchedWebhooks.map(async (wh) => {
            const payload: WebhookPayload = {
                event,
                data,
                timestamp: Date.now(),
            };

            // Log the attempt
            const [eventLog] = await db.insert(webhookEvents).values({
                webhookId: wh.id,
                event,
                payload,
                status: 'pending',
                attempts: 0
            }).returning();

            try {
                // Send request
                const response = await fetch(wh.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Stackly-Event': event,
                        // 'X-Stackly-Signature': ... (TODO: Implement HMAC signature with wh.secret)
                    },
                    body: JSON.stringify(payload),
                    signal: AbortSignal.timeout(5000) // 5s timeout
                });

                const status = response.ok ? 'delivered' : 'failed';

                await db.update(webhookEvents)
                    .set({
                        status,
                        deliveredAt: response.ok ? new Date() : null,
                        lastAttemptAt: new Date(),
                        attempts: 1
                    })
                    .where(eq(webhookEvents.id, eventLog.id));

            } catch (err) {
                console.error(`[Webhook] Failed to send to ${wh.url}`, err);
                await db.update(webhookEvents)
                    .set({
                        status: 'failed',
                        lastAttemptAt: new Date(),
                        attempts: 1
                    })
                    .where(eq(webhookEvents.id, eventLog.id));
            }
        });

        // Fire and forget (don't await all of them to block the main thread response)
        // But in Serverless/Next.js, we might need to await `waitUntil` or similar. 
        // For now, we await structure but maybe not execution if we had a queue.
        // Since we are in a Server Action context usually, better to await Promise.allSettled
        await Promise.allSettled(promises);

    } catch (error) {
        console.error("Trigger webhook error:", error);
    }
}
