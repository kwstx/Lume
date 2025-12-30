"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { subscribers, segments, subscriberSegments } from "@/db/schema";
import { eq, and, desc, sql, inArray } from "drizzle-orm";
import { calculateRFM } from "@/lib/segmentation/rfm";
import Papa from "papaparse";
import { revalidatePath } from "next/cache";

export type ImportResult = {
    success: boolean;
    message: string;
    count?: number;
    errors?: number;
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
        let newCount = 0;
        let updateCount = 0;

        // Fetch existing emails to minimize DB queries during loop
        // LIMITATION: If user has 100k subscribers, this array might get big. 
        // For V1, fetching ID & Email is acceptable.
        const existingSubs = await db.select({
            id: subscribers.id,
            email: subscribers.email
        })
            .from(subscribers)
            .where(eq(subscribers.userId, session.user.id));

        const existingEmailMap = new Map(existingSubs.map(s => [s.email, s.id]));

        const toInsert = [];
        const toUpdatePromises = [];

        for (const record of records) {
            const email = record.user_email || record.email;
            if (!email) continue;

            // Map Substack fields
            const status = (record.subscription_status || record.status || 'free').toLowerCase();
            const tier = (record.membership_tier || record.tier || 'free').toLowerCase();
            // const engagement = (record.activity_level || 'medium').toLowerCase(); // Substack sometimes has this

            // Dates
            const joinDate = record.signup_date ? new Date(record.signup_date) : new Date();
            const lastActive = record.last_seen ? new Date(record.last_seen) : null; // Ensure this mapping exists if CSV has it
            const totalOpens = parseInt(record.opens_count || '0');
            const totalClicks = parseInt(record.clicks_count || '0');

            // Calculate RFM & Risk
            const { score, risk, engagement } = calculateRFM({
                joinDate,
                lastActive, // Substack export might imply last active via opens, but here we pass raw dates
                totalOpens,
                totalClicks,
                status,
                tier
            });

            const subscriberData = {
                userId: session.user.id,
                email: email.toLowerCase(),
                name: record.user_name || record.name || email.split('@')[0],
                status,
                tier,
                source: "import",
                joinDate,
                engagementLevel: engagement,
                rfmScore: score,
                churnRisk: risk,
                totalOpens,
                totalClicks,
                updatedAt: new Date(),
                // Substack specific but mapped to JSON tags or notes if needed
                substackId: record.subscriber_id,
            };

            if (existingEmailMap.has(email)) {
                // Update existing
                const existingId = existingEmailMap.get(email)!;
                toUpdatePromises.push(
                    db.update(subscribers)
                        .set({
                            ...subscriberData,
                            updatedAt: new Date()
                        })
                        .where(eq(subscribers.id, existingId))
                );
                updateCount++;
            } else {
                // Insert new
                toInsert.push(subscriberData);
                newCount++;
            }
        }

        // Execute Batch Inserts
        if (toInsert.length > 0) {
            // Drizzle doesn't support bulk insert with returning in all drivers perfectly, 
            // but for simple insert it works. Process in chunks of 500 to be safe.
            const chunkSize = 500;
            for (let i = 0; i < toInsert.length; i += chunkSize) {
                await db.insert(subscribers).values(toInsert.slice(i, i + chunkSize));
            }
        }

        // Execute Updates (Parallelize)
        if (toUpdatePromises.length > 0) {
            // Limit concurrency if needed, but Promise.all for a few hundred is fine.
            // For thousands, we'd want to chunk this too.
            const updateChunkSize = 100;
            for (let i = 0; i < toUpdatePromises.length; i += updateChunkSize) {
                await Promise.all(toUpdatePromises.slice(i, i + updateChunkSize));
            }
        }

        revalidatePath("/dashboard/subscribers");
        return {
            success: true,
            message: `Imported ${newCount} new, updated ${updateCount} existing subscribers.`,
            count: newCount + updateCount
        };

    } catch (error: any) {
        console.error("Import error:", error);
        return { success: false, message: error.message || "Import failed" };
    }
}

export async function getSubscribers(filters?: {
    query?: string;
    status?: string;
    engagement?: string;
    segmentId?: string;
    page?: number;
    limit?: number;
    risk?: string; // 'high', 'medium', 'low'
}) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { data: [], count: 0, error: "Unauthorized" };

        let conditions = [eq(subscribers.userId, session.user.id)];

        if (filters?.query) {
            conditions.push(sql`(
                ${subscribers.email} ILIKE ${`%${filters.query}%`} OR 
                ${subscribers.name} ILIKE ${`%${filters.query}%`}
            )`);
        }

        if (filters?.status && filters.status !== 'all') {
            conditions.push(eq(subscribers.status, filters.status));
        }

        if (filters?.engagement && filters.engagement !== 'all') {
            conditions.push(eq(subscribers.engagementLevel, filters.engagement));
        }

        if (filters?.risk) {
            const riskConditions = [];
            if (filters.risk === 'high') riskConditions.push(sql`${subscribers.churnRisk} >= 70`);
            else if (filters.risk === 'medium') riskConditions.push(and(sql`${subscribers.churnRisk} >= 30`, sql`${subscribers.churnRisk} < 70`));
            else if (filters.risk === 'low') riskConditions.push(sql`${subscribers.churnRisk} < 30`);

            if (riskConditions.length > 0) {
                // @ts-ignore - drizzle type complexity
                conditions.push(riskConditions[0]);
            }
        }

        // Handle Segment Filtering
        // If segmentId is provided, we need to join with subscriberSegments table
        // However, dizzles query builder with conditional joins is tricky.
        // Easiest is to use a subquery or IN clause if segment is selected.
        if (filters?.segmentId && filters.segmentId !== 'all') {
            const segmentSubscriberIds = db.select({ id: subscriberSegments.subscriberId })
                .from(subscriberSegments)
                .where(eq(subscriberSegments.segmentId, filters.segmentId));

            conditions.push(inArray(subscribers.id, segmentSubscriberIds));
        }

        const page = filters?.page || 1;
        const limit = filters?.limit || 20;
        const offset = (page - 1) * limit;

        // Get total count for pagination
        // Using a separate count query is safer/easier than window functions with Drizzle sometimes
        const [countResult] = await db.select({ count: sql<number>`cast(count(*) as integer)` })
            .from(subscribers)
            .where(and(...conditions));

        const totalCount = countResult?.count || 0;

        const data = await db.select()
            .from(subscribers)
            .where(and(...conditions))
            .orderBy(desc(subscribers.joinDate))
            .limit(limit)
            .offset(offset);

        return { data, count: totalCount, error: null };
    } catch (error) {
        console.error("Get subscribers error:", error);
        return { data: [], count: 0, error: "Failed to fetch subscribers" };
    }
}

// ... keep existing createSegment and deleteSegment ...

export async function getSegments() {
    try {
        const session = await auth();
        if (!session?.user?.id) return { data: [], error: "Unauthorized" };

        const data = await db.select().from(segments)
            .where(eq(segments.userId, session.user.id))
            .orderBy(desc(segments.createdAt));

        return { data, error: null };
    } catch (error) {
        console.error("Get segments error:", error);
        return { data: [], error: "Failed to fetch segments" };
    }
}

export async function createSegment(name: string, criteria: any, filtersApplied: any) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        const [segment] = await db.insert(segments).values({
            userId: session.user.id,
            name,
            criteria: criteria,
            description: `Auto-created from filters: ${JSON.stringify(filtersApplied)}`,
            type: "manual", // or dynamic if we implemented the logic engine
        }).returning();

        // If it's a manual snapshot, we should find all current matches and link them
        // For now, let's treat it as a "Folder" we manually add people to, 
        // OR as a "Saved Filter" (dynamic).
        // Let's implement Snapshot behavior for simplicity (add current matches to it)
        const { data: matchedSubs } = await getSubscribers(filtersApplied);

        if (matchedSubs && matchedSubs.length > 0) {
            const links = matchedSubs.map(sub => ({
                subscriberId: sub.id,
                segmentId: segment.id
            }));

            // Bulk insert links
            const chunkSize = 500;
            for (let i = 0; i < links.length; i += chunkSize) {
                await db.insert(subscriberSegments).values(links.slice(i, i + chunkSize));
            }
        }

        revalidatePath("/dashboard/subscribers");
        return { success: true, segment };
    } catch (error) {
        console.error("Create segment error:", error);
        return { success: false, error: "Failed to create segment" };
    }
}

// ...
export async function deleteSegment(id: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        await db.delete(segments)
            .where(and(eq(segments.id, id), eq(segments.userId, session.user.id)));

        revalidatePath("/dashboard/subscribers");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete segment" };
    }
}

export async function syncSubstack(): Promise<void> {
    // Placeholder for actual Substack sync logic
    // This would involve fetching data from Substack API if they had one, 
    // or scraping/checking RSS, or just marking the last sync time.

    // For now, let's just wait a bit to simulate work
    await new Promise(resolve => setTimeout(resolve, 2000));

    revalidatePath("/dashboard/settings");
    return;
}
