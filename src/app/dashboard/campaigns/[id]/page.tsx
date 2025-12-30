import { auth } from "@/auth";
import { db } from "@/db";
import { campaigns, segments } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import CampaignEditor from "@/components/campaigns/campaign-editor";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }

    const resolvedParams = await params;

    const [campaign] = await db.select()
        .from(campaigns)
        .where(and(eq(campaigns.id, resolvedParams.id), eq(campaigns.userId, session.user.id)));

    if (!campaign) {
        redirect("/dashboard/campaigns");
    }

    const availableSegments = await db.select()
        .from(segments)
        .where(eq(segments.userId, session.user.id));

    return <CampaignEditor campaign={campaign} segments={availableSegments} />;
}
