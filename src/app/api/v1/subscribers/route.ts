import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { subscribers, apiKeys } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

async function authenticate(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }

    const key = authHeader.split(" ")[1];

    // Find the key in DB
    // Note: In real app, we should hash the incoming key and compare with stored hash
    const apiKeyRecord = await db.query.apiKeys.findFirst({
        where: eq(apiKeys.key, key),
    });

    if (!apiKeyRecord) return null;

    // Update last used
    // We don't await this to be faster
    db.update(apiKeys).set({ lastUsed: new Date() }).where(eq(apiKeys.id, apiKeyRecord.id)).execute();

    return apiKeyRecord.userId;
}

export async function GET(req: NextRequest) {
    const userId = await authenticate(req);
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const searchParams = req.nextUrl.searchParams;
        const limit = parseInt(searchParams.get("limit") || "20");

        // Simple list endpoint
        const data = await db.select().from(subscribers)
            .where(eq(subscribers.userId, userId))
            .limit(limit)
            .orderBy(desc(subscribers.createdAt));

        return NextResponse.json({
            data: data.map(sub => ({
                id: sub.id,
                email: sub.email,
                name: sub.name,
                status: sub.status,
                joined_at: sub.joinDate
            }))
        });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const userId = await authenticate(req);
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();

        if (!body.email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Basic upsert logic
        // Check availability
        const existing = await db.query.subscribers.findFirst({
            where: (sub, { and, eq }) => and(eq(sub.email, body.email), eq(sub.userId, userId))
        });

        if (existing) {
            return NextResponse.json({ message: "Subscriber already exists", id: existing.id });
        }

        const [newSubscriber] = await db.insert(subscribers).values({
            userId,
            email: body.email,
            name: body.name,
            status: 'free',
            source: 'api',
            joinDate: new Date(),
        }).returning();

        return NextResponse.json({ data: newSubscriber }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
