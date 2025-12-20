"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { subscribers, segments, subscriberSegments } from "@/db/schema";
import { eq, and, or, desc, sql, inArray } from "drizzle-orm";
import Papa from "papaparse";
import { revalidatePath } from "next/cache";

export type ImportResult = {
    success: boolean;
    count?: number;
    errors?: number;
    message?: string;
};

export async function importSubscribers(formData: FormData): Promise<ImportResult> {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, message: "Unauthorized" };
        }

        const file = formData.get("file") as File;
        if (!file) {
            return { success: false, message: "No file provided" };
        }

        const text = await file.text();

        // Parse CSV
        const parseResult = Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header) => header.toLowerCase().trim().replace(/[\s_-]+/g, '_'),
        });

        if (parseResult.errors.length > 0 && parseResult.data.length === 0) {
            return { success: false, message: "Failed to parse CSV", errors: parseResult.errors.length };
        }

        const records = parseResult.data as any[];
        const newSubscribers: any[] = [];
        let updatedCount = 0;

        // Fetch existing emails for this user to avoid duplicates or update them
        // For large datasets, we might want to do this in chunks, but for now fetching all is reasonable for typical usage.
        const existingSubs = await db.query.subscribers.findMany({
            where: and(eq(subscribers.userId, session.user.id)),
            columns: {
                id: true,
                email: true,
            }
        });

        const existingEmailMap = new Map(existingSubs.map(s => [s.email, s.id]));

        for (const record of records) {
            // Map CSV fields to schema
            // Common Substack fields: "User Email", "User Name", "Subscription Status", "Subscription Type", "Sign up date"
            const email = record['user_email'] || record['email'] || record['subscriber_email'];

            if (!email || typeof email !== 'string' || !email.includes('@')) {
                continue; // Skip invalid emails
            }

            const name = record['user_name'] || record['name'] || record['full_name'] || email.split('@')[0];
            const status = mapStatus(record['subscription_status'] || record['status']);
            const tier = mapTier(record['subscription_type'] || record['tier']);
            const joinDateStr = record['sign_up_date'] || record['join_date'] || record['created_at'];
            const joinDate = joinDateStr ? new Date(joinDateStr) : new Date();
            const source = "import";

            const subscriberData = {
                userId: session.user.id,
                email: email.toLowerCase(),
                name,
                status,
                tier,
                source,
                joinDate,
                updatedAt: new Date(),
            };

            if (existingEmailMap.has(subscriberData.email)) {
                // Update existing (Optional: strictly speaking we could just skip, but updating status is useful)
                await db.update(subscribers)
                    .set(subscriberData)
                    .where(eq(subscribers.id, existingEmailMap.get(subscriberData.email)!));
                updatedCount++;
            } else {
                newSubscribers.push(subscriberData);
            }
        }

        // Bulk insert new
        if (newSubscribers.length > 0) {
            // Drizzle allows bulk insert
            // Insert in chunks of 500 to be safe with query size limits
            const chunkSize = 500;
            for (let i = 0; i < newSubscribers.length; i += chunkSize) {
                const chunk = newSubscribers.slice(i, i + chunkSize);
                await db.insert(subscribers).values(chunk);
            }
        }

        revalidatePath("/dashboard/subscribers");
        revalidatePath("/dashboard");

        return {
            success: true,
            count: newSubscribers.length + updatedCount,
            message: `Imported ${newSubscribers.length} new, updated ${updatedCount} existing subscribers.`
        };

    } catch (error) {
        console.error("Import error:", error);
        return { success: false, message: "Internal server error" };
    }
}

function mapStatus(status: string): "free" | "paid" | "comp" {
    if (!status) return "free";
    const s = status.toLowerCase();
    if (s.includes("paid") || s.includes("premium")) return "paid";
    if (s.includes("comp") || s.includes("omplimentary")) return "comp";
    return "free"; // Default
}


function mapTier(tier: string): string {
    if (!tier) return "free";
    return tier.toLowerCase();
}


export type SubscriberFilters = {
    query?: string;
    status?: string;
    engagement?: string;
    segmentId?: string;
};

export async function getSubscribers(filters?: SubscriberFilters) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { data: [], error: "Unauthorized" };
        }

        const conditions = [eq(subscribers.userId, session.user.id)];

        if (filters?.query) {
            const q = `%${filters.query.toLowerCase()}%`;
            // Drizzle doesn't export ilike in strict pg-core sometimes, check imports or use sql
            // Using sql for safe ILIKE behavior or simple undefined checks
            // For simplicity in this stack, assuming normal logical operators work
            conditions.push(or(
                // We'll use sql operator if simple like/ilike isn't available in this drizzle build, 
                // but let's try standard drizzle operators first.
                // Note: 'ilike' needs to be imported from drizzle-orm/pg-core or similar. 
                // If not available, we can filter in memory or use sql template.
                // Let's use a safe sql template approach for text search to be robust.
                sql`lower(${subscribers.name}) LIKE ${q}`,
                sql`lower(${subscribers.email}) LIKE ${q}`
            ));
        }

        if (filters?.status && filters.status !== 'all') {
            conditions.push(eq(subscribers.status, filters.status));
        }

        if (filters?.engagement && filters.engagement !== 'all') {
            conditions.push(eq(subscribers.engagementLevel, filters.engagement));
        }

        if (filters?.segmentId) {
            // Subquery or join to filter by segment
            // We can use the 'inArray' operator with a subquery
            const subQuery = db.select({ id: subscriberSegments.subscriberId })
                .from(subscriberSegments)
                .where(eq(subscriberSegments.segmentId, filters.segmentId));

            conditions.push(inArray(subscribers.id, subQuery));
        }

        const data = await db.select()
            .from(subscribers)
            .where(and(...conditions))
            .orderBy(desc(subscribers.createdAt));

        return { data, error: null };
    } catch (error) {
        console.error("Failed to fetch subscribers:", error);
        return { data: [], error: "Failed to fetch subscribers" };
    }
}

// --- Segments ---

export async function getSegments() {
    try {
        const session = await auth();
        if (!session?.user?.id) return { data: [], error: "Unauthorized" };

        const data = await db.select().from(segments).where(eq(segments.userId, session.user.id));
        return { data, error: null };
    } catch (error) {
        return { data: [], error: "Failed to fetch segments" };
    }
}

export async function createSegment(name: string, criteria: any, filtersApplied?: SubscriberFilters) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        // 1. Create Segment
        const [newSegment] = await db.insert(segments).values({
            userId: session.user.id,
            name,
            criteria,
            type: "manual", // or dynamic if we implemented that logic fully
        }).returning();

        // 2. Associate current matching subscribers to this segment (Snapshot)
        // Re-run the query to find who matches
        const { data: matchingSubs } = await getSubscribers(filtersApplied);

        if (matchingSubs && matchingSubs.length > 0) {
            const associations = matchingSubs.map(sub => ({
                subscriberId: sub.id,
                segmentId: newSegment.id
            }));

            // Bulk insert associations
            const chunkSize = 500;
            for (let i = 0; i < associations.length; i += chunkSize) {
                await db.insert(subscriberSegments).values(associations.slice(i, i + chunkSize));
            }
        }

        revalidatePath("/dashboard/subscribers");
        return { success: true, segment: newSegment };
    } catch (error) {
        console.error("Create segment error:", error);
        return { success: false, error: "Failed to create segment" };
    }
}

export async function deleteSegment(segmentId: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        await db.delete(segments).where(and(
            eq(segments.id, segmentId),
            eq(segments.userId, session.user.id)
        ));

        revalidatePath("/dashboard/subscribers");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete segment" };
    }
}


export async function createSubscriber(data: { email: string; name?: string; status?: string; tags?: string[] }) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        const [newSubscriber] = await db.insert(subscribers).values({
            userId: session.user.id,
            email: data.email,
            name: data.name,
            status: data.status || 'free',
            tags: data.tags,
            source: 'manual'
        }).returning();

        revalidatePath("/dashboard/subscribers");
        return { success: true, subscriber: newSubscriber };
    } catch (error) {
        console.error("Create subscriber error:", error);
        return { success: false, error: "Failed to create subscriber" };
    }
}

export async function syncSubstack() {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        // In a real app, this would trigger a background job or fetch from Substack API.
        // For now, we'll simulate a sync delay and perhaps update a "last synced" timestamp if we had one.
        // We can also revalidate relevant paths.

        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate work

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/subscribers");
        revalidatePath("/dashboard/analytics");

        return { success: true };
    } catch (error) {
        console.error("Sync error:", error);
        return { success: false, error: "Failed to sync" };
    }
}
