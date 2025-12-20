"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { users, subscribers, segments, campaigns, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateAvatar(imageUrl: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        await db.update(users)
            .set({ image: imageUrl })
            .where(eq(users.id, session.user.id));

        revalidatePath("/dashboard/settings");
        return { success: true };
    } catch (error) {
        console.error("Failed to update avatar:", error);
        return { success: false, error: "Failed to update avatar" };
    }
}

export async function updateProfile(data: { name?: string; newsletterName?: string; timezone?: string; substackUrl?: string }) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        // We only have 'name' in the user table for now. 
        // We can create a dedicated 'settings' table later if needed.
        // For now, we'll update the name.

        const updateData: any = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.substackUrl !== undefined) updateData.substackUrl = data.substackUrl;

        if (Object.keys(updateData).length === 0) return { success: true };

        await db.update(users)
            .set(updateData)
            .where(eq(users.id, session.user.id));

        revalidatePath("/dashboard/settings");
        return { success: true };
    } catch (error) {
        console.error("Failed to update profile:", error);
        return { success: false, error: "Failed to update profile" };
    }
}

export async function exportAccountData() {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        const userData = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
        });

        const userSubscribers = await db.select().from(subscribers).where(eq(subscribers.userId, session.user.id));
        const userSegments = await db.select().from(segments).where(eq(segments.userId, session.user.id));
        const userCampaigns = await db.select().from(campaigns).where(eq(campaigns.userId, session.user.id));
        const userProducts = await db.select().from(products).where(eq(products.userId, session.user.id));

        const exportData = {
            user: userData,
            subscribers: userSubscribers,
            segments: userSegments,
            campaigns: userCampaigns,
            products: userProducts,
            exportedAt: new Date().toISOString()
        };

        return { success: true, data: JSON.stringify(exportData, null, 2) };
    } catch (error) {
        console.error("Export error:", error);
        return { success: false, error: "Failed to export data" };
    }
}

export async function deleteAccount() {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        await db.delete(users).where(eq(users.id, session.user.id));

        return { success: true };
    } catch (error) {
        console.error("Delete account error:", error);
        return { success: false, error: "Failed to delete account" };
    }
}
