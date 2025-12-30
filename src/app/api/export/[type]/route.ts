import { auth } from "@/auth";
import { db } from "@/db";
import { subscribers, segments, campaigns, exportJobs } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { toCsv, cleanSubscriberForExport } from "@/lib/export/csv";
import { toJson } from "@/lib/export/json";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ type: string }> } // Params is a promise in Next.js 15
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const resolvedParams = await params;
        const type = resolvedParams.type;
        const searchParams = request.nextUrl.searchParams;
        const format = searchParams.get('format') || 'csv';

        let data: any = null;
        let content = "";
        let contentType = "";
        let filename = `${type}-${new Date().toISOString().split('T')[0]}`;

        // Fetch data based on type
        if (type === 'subscribers') {
            const result = await db.select().from(subscribers).where(eq(subscribers.userId, session.user.id));
            if (format === 'csv') {
                data = result.map(cleanSubscriberForExport);
                content = toCsv(data);
                contentType = 'text/csv';
                filename += '.csv';
            } else {
                data = result;
                content = toJson(data);
                contentType = 'application/json';
                filename += '.json';
            }
        }
        else if (type === 'segments') {
            data = await db.select().from(segments).where(eq(segments.userId, session.user.id));
            content = format === 'csv' ? toCsv(data) : toJson(data);
            contentType = format === 'csv' ? 'text/csv' : 'application/json';
            filename += format === 'csv' ? '.csv' : '.json';
        }
        else if (type === 'campaigns') {
            data = await db.select().from(campaigns).where(eq(campaigns.userId, session.user.id));
            content = format === 'csv' ? toCsv(data) : toJson(data);
            contentType = format === 'csv' ? 'text/csv' : 'application/json';
            filename += format === 'csv' ? '.csv' : '.json';
        }
        else {
            return new NextResponse("Invalid export type", { status: 400 });
        }

        // Return file download
        return new NextResponse(content, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });

    } catch (error) {
        console.error("Download error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
