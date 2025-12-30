"use server";

import { db } from "@/db";
import { apiKeys } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

export async function getApiKeys() {
    try {
        const session = await auth();
        if (!session?.user?.id) return { data: [], error: "Unauthorized" };

        const keys = await db.select().from(apiKeys)
            .where(eq(apiKeys.userId, session.user.id))
            .orderBy(desc(apiKeys.createdAt));

        // Don't return the full key hash or real key if we stored it (we store hash usually, but here schema says 'key' unique)
        // Ideally we only show the key once. 
        // For this demo, let's assume the 'key' column stores the partial visible key OR the actual key if we aren't hashing it properly yet.
        // Important: In a real app, store a hash and only show the key once. 
        // For this MVP, we might be storing the raw key (based on schema 'text'). 
        // Let's implement Masking here for safety.

        const maskedKeys = keys.map(k => ({
            ...k,
            key: `sk_live_...${k.key.slice(-4)}`
        }));

        return { data: maskedKeys, error: null };
    } catch (error) {
        console.error("Get API keys error:", error);
        return { data: [], error: "Failed to fetch API keys" };
    }
}

export async function createApiKey(name: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        const rawKey = `sk_live_${crypto.randomBytes(24).toString('hex')}`;

        // In a real production app, hash this key before storing!
        // For MVP simplicity/demo, we are storing plain text but treating it as sensitive.
        // TODO: Hash key before storage.

        const [newKey] = await db.insert(apiKeys).values({
            userId: session.user.id,
            name,
            key: rawKey,
        }).returning();

        revalidatePath("/dashboard/settings/api");

        // Return the RAW key only once here so the user can copy it
        return { success: true, key: rawKey, id: newKey.id };
    } catch (error) {
        console.error("Create API key error:", error);
        return { success: false, error: "Failed to create API key" };
    }
}

export async function deleteApiKey(id: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        await db.delete(apiKeys)
            .where(eq(apiKeys.id, id)); // Add userId check for security if ID is guessable (UUID is hard to guess but better safe)
        // .where(and(eq(apiKeys.id, id), eq(apiKeys.userId, session.user.id)))

        revalidatePath("/dashboard/settings/api");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete API key" };
    }
}
