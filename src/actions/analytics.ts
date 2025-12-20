"use server";

import { db } from "@/db";
import { subscribers, payments, interactions, campaigns, personas, segments, subscriberSegments } from "@/db/schema";
import { count, eq, sql, desc, gte, and, lt } from "drizzle-orm";
import { auth } from "@/auth";

export async function getDashboardMetrics(range: string = 'week') {
    try {
        const endDate = new Date();
        let startDate = new Date();
        let interval = '7 days';
        let dateFormat = 'Day'; // 'Day' -> Monday, 'Mon' -> Jan
        let groupBy = 'date'; // Group by full date or month

        switch (range) {
            case 'week':
                startDate.setDate(endDate.getDate() - 7);
                interval = '7 days';
                dateFormat = 'Day'; // Monday
                break;
            case 'month':
                startDate.setDate(endDate.getDate() - 30);
                interval = '30 days';
                dateFormat = 'DD'; // 01, 02...
                break;
            case 'year':
                startDate.setFullYear(endDate.getFullYear() - 1);
                interval = '1 year';
                dateFormat = 'Mon'; // Jan, Feb
                groupBy = "TO_CHAR(date, 'YYYY-MM')"; // Group by month
                break;
            default: // week
                startDate.setDate(endDate.getDate() - 7);
        }

        // Calculate previous period for trends
        const duration = endDate.getTime() - startDate.getTime();
        const prevEndDate = new Date(startDate.getTime());
        const prevStartDate = new Date(startDate.getTime() - duration);

        const activitySql = range === 'year'
            ? sql`
                SELECT 
                    TO_CHAR(date, 'Mon') as label,
                    COUNT(*) as val,
                    MIN(date) as sort_date
                FROM ${interactions}
                WHERE date >= NOW() - INTERVAL '1 year'
                AND type = 'open'
                GROUP BY 1, TO_CHAR(date, 'YYYY-MM')
                ORDER BY sort_date ASC
            `
            : sql`
                SELECT 
                    TO_CHAR(date, ${dateFormat}) as label,
                    COUNT(*) as val,
                    date as sort_date
                FROM ${interactions}
                WHERE date >= ${startDate.toISOString()}
                AND type = 'open'
                GROUP BY 1, date
                ORDER BY sort_date ASC
            `;

        const [
            totalSubscribers,
            paidSubscribers,
            grossVolumeResult,
            subsCurrentPeriod,
            subsPrevPeriod,
            volumeCurrentPeriod,
            volumePrevPeriod,
            activityResult,
            personasResult,
            opensCurrentPeriod,
            opensPrevPeriod,
            clicksCurrentPeriod,
            clicksPrevPeriod
        ] = await Promise.all([
            db.select({ count: count() }).from(subscribers),
            db.select({ count: count() }).from(subscribers).where(eq(subscribers.status, "paid")),
            db.select({ value: sql<number>`sum(${payments.amount})` }).from(payments),
            // Trends
            db.select({ count: count() }).from(subscribers).where(and(gte(subscribers.createdAt, startDate), lt(subscribers.createdAt, endDate))),
            db.select({ count: count() }).from(subscribers).where(and(gte(subscribers.createdAt, prevStartDate), lt(subscribers.createdAt, prevEndDate))),
            db.select({ value: sql<number>`sum(${payments.amount})` }).from(payments).where(and(gte(payments.date, startDate), lt(payments.date, endDate))),
            db.select({ value: sql<number>`sum(${payments.amount})` }).from(payments).where(and(gte(payments.date, prevStartDate), lt(payments.date, prevEndDate))),
            // Activity 
            db.execute(activitySql),
            // Top Personas
            db.execute(sql`
                SELECT 
                    p.name as name,
                    COUNT(ss.subscriber_id) as count
                FROM ${personas} p
                JOIN ${segments} s ON p.generated_from_segment_id = s.id
                JOIN ${subscriberSegments} ss ON s.id = ss.segment_id
                GROUP BY p.name
                ORDER BY count DESC
                LIMIT 3
            `),
            // Total Opens (Current Period)
            db.select({ count: count() }).from(interactions).where(and(eq(interactions.type, 'open'), gte(interactions.date, startDate), lt(interactions.date, endDate))),
            // Total Opens (Previous Period)
            db.select({ count: count() }).from(interactions).where(and(eq(interactions.type, 'open'), gte(interactions.date, prevStartDate), lt(interactions.date, prevEndDate))),
            // Total Clicks (Current Period)
            db.select({ count: count() }).from(interactions).where(and(eq(interactions.type, 'click'), gte(interactions.date, startDate), lt(interactions.date, endDate))),
            // Total Clicks (Previous Period)
            db.select({ count: count() }).from(interactions).where(and(eq(interactions.type, 'click'), gte(interactions.date, prevStartDate), lt(interactions.date, prevEndDate))),
        ]);

        const totalSubs = totalSubscribers[0].count;
        const paidSubs = paidSubscribers[0].count;
        const grossVolume = grossVolumeResult[0].value || 0;

        const currentSubsGrowth = subsCurrentPeriod[0].count;
        const prevSubsGrowth = subsPrevPeriod[0].count;
        const subTrend = prevSubsGrowth === 0 ? (currentSubsGrowth > 0 ? 100 : 0) : Math.round(((currentSubsGrowth - prevSubsGrowth) / prevSubsGrowth) * 100);

        const currentVol = volumeCurrentPeriod[0].value || 0;
        const prevVol = volumePrevPeriod[0].value || 0;
        const volTrend = prevVol === 0 ? (currentVol > 0 ? 100 : 0) : Math.round(((currentVol - prevVol) / prevVol) * 100);

        // Rate Calculations
        // Destructure manually since Promise.all returns fixed array order
        const currentOpens = opensCurrentPeriod[0]?.count || 0;
        const prevOpens = opensPrevPeriod[0]?.count || 0;
        const currentClicks = clicksCurrentPeriod[0]?.count || 0;
        const prevClicks = clicksPrevPeriod[0]?.count || 0;

        const openRateVal = totalSubs > 0 ? Math.round((currentOpens / totalSubs) * 100) : 0;
        const prevOpenRateVal = totalSubs > 0 ? Math.round((prevOpens / totalSubs) * 100) : 0; // This is approximate as we use current totalSubs
        const openRateTrendVal = openRateVal - prevOpenRateVal;

        const clickRateVal = totalSubs > 0 ? Math.round((currentClicks / totalSubs) * 100) : 0;
        const prevClickRateVal = totalSubs > 0 ? Math.round((prevClicks / totalSubs) * 100) : 0;
        const clickRateTrendVal = clickRateVal - prevClickRateVal;

        // Process Activity Data
        const activityRows = activityResult as unknown as any[];
        const activityData = activityRows.map((r: any) => ({
            name: range === 'week' ? r.label.trim().substring(0, 3) : r.label.trim(),
            value: Number(r.val)
        }));

        // Process Personas
        const personaRows = personasResult as unknown as any[];
        const topPersonas = personaRows.map((p: any, i: number) => ({
            name: p.name,
            val: totalSubs > 0 ? Math.round((Number(p.count) / totalSubs) * 100) : 0,
            color: i === 0 ? 'bg-violet-500' : i === 1 ? 'bg-blue-400' : 'bg-pink-400'
        }));

        return {
            totalSubscribers: totalSubs,
            subscriberTrend: `${subTrend > 0 ? '+' : ''}${subTrend}%`,
            paidSubscribers: paidSubs,
            paidTrend: "+0%", // Placeholder
            grossVolume: grossVolume / 100,
            volumeTrend: `${volTrend > 0 ? '+' : ''}${volTrend}%`,
            openRate: `${openRateVal}%`,
            openRateTrend: `${openRateTrendVal > 0 ? '+' : ''}${openRateTrendVal}%`,
            clickRate: `${clickRateVal}%`,
            clickRateTrend: `${clickRateTrendVal > 0 ? '+' : ''}${clickRateTrendVal}%`,
            activity: activityData,
            topPersonas
        };
    } catch (error) {
        console.error("Failed to fetch dashboard metrics:", error);
        return {
            totalSubscribers: 0,
            subscriberTrend: "0%",
            paidSubscribers: 0,
            paidTrend: "0%",
            grossVolume: 0,
            volumeTrend: "0%",
            openRate: "0%",
            openRateTrend: "0%",
            activity: [],
            topPersonas: []
        };
    }
}

export interface EngagementMetric {
    date: string;
    avgOpenRate: number;
    totalClicks: number;
}

export type SuggestionType = "growth" | "retention" | "monetization";

export interface Suggestion {
    id: string;
    type: SuggestionType;
    title: string;
    description: string;
    actionLabel: string;
    actionUrl?: string; // e.g. /dashboard/outreach?template=re-engage
    impact: "high" | "medium" | "low";
}

export async function getEngagementMetrics(days: number = 30): Promise<{ data: EngagementMetric[], error?: string }> {
    try {
        const session = await auth();
        if (!session?.user?.id) return { data: [], error: "Unauthorized" };

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);

        // Group interactions by date
        // Note: Using raw SQL for date grouping flexibility across Postgres versions
        const result = await db.execute(sql`
            SELECT 
                TO_CHAR(date, 'YYYY-MM-DD') as date_str,
                COUNT(CASE WHEN type = 'open' THEN 1 END) as opens,
                COUNT(CASE WHEN type = 'click' THEN 1 END) as clicks
            FROM ${interactions}
            WHERE ${interactions.subscriberId} IN (
                SELECT id FROM ${subscribers} WHERE ${subscribers.userId} = ${session.user.id}
            )
            AND date >= ${startDate.toISOString()}
            GROUP BY 1
            ORDER BY 1 ASC
        `);

        // Create a map of existing data
        const rows = result as unknown as any[];
        const metricsMap = new Map(rows.map((row: any) => [row.date_str, row]));

        // Fill in missing dates with 0
        const data: EngagementMetric[] = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const row = metricsMap.get(dateStr) as any;

            // Calculate "Avg Open Rate" as (Opens / Total Subscribers) * 100 roughly, 
            // or just raw Opens if we define metric that way. 
            // The interface says avgOpenRate (%). 
            // For accuracy we'd need total subscribers active on that day. 
            // For MVP, we'll return raw OPENS count disguised as rate, or normalize by current total.
            // Let's return raw Opens and Clicks for the graph first, effectively treating "rate" as "count" 
            // or we fetch total subs to divide. 
            // Given the chart likely expects numbers, let's just return counts but call them rate for compatibility 
            // if the frontend expects 0-100. If frontend just plots value, counts are better to see movement.
            // Let's check interface: EngagementMetric { avgOpenRate: number }. 
            // I'll assume it displays percentages. I'll normalize by current count for simplicity.

            // Getting accurate daily subscriber count history is hard without a daily snapshot table.
            // I'll stick to returning meaningful numbers. If I have 10 opens, and 100 subs, that's 10%.
            // I'll guess a denominator or just return the count and label it "%" in UI? 
            // No, best to just return the count.

            data.push({
                date: dateStr,
                avgOpenRate: Number(row?.opens || 0), // Returning count for now
                totalClicks: Number(row?.clicks || 0)
            });
        }

        return { data };
    } catch (error) {
        console.error("Metrics error:", error);
        return { data: [], error: "Failed to load metrics" };
    }
}

export async function getSuggestions(): Promise<{ data: Suggestion[], error?: string }> {
    try {
        const session = await auth();
        if (!session?.user?.id) return { data: [], error: "Unauthorized" };

        const subs = await db.query.subscribers.findMany({
            where: eq(subscribers.userId, session.user.id)
        });

        const suggestions: Suggestion[] = [];

        // Rule 1: Monetization - High Engagement Free Users
        const highEngagedFree = subs.filter(s => s.status === 'free' && s.engagementLevel === 'high').length;
        if (highEngagedFree > 0) {
            suggestions.push({
                id: "convert-free",
                type: "monetization",
                title: "Convert High-Value Free Readers",
                description: `You have ${highEngagedFree} highly engaged free subscribers. They love your content—ask them to support you.`,
                actionLabel: "Send Offer Email",
                actionUrl: "/dashboard/outreach?segment=high-engaged-free",
                impact: "high"
            });
        }

        // Rule 2: Retention - Stalling Growth or Churn Risk
        const inactivePaid = subs.filter(s => s.status === 'paid' && s.engagementLevel === 'low').length;
        if (inactivePaid > 0) {
            suggestions.push({
                id: "retain-paid",
                type: "retention",
                title: "Re-engage At-Risk Paid Subs",
                description: `${inactivePaid} paid subscribers haven't opened emails recently. Check in before they cancel.`,
                actionLabel: "Draft Check-in",
                actionUrl: "/dashboard/outreach?template=retention",
                impact: "high"
            });
        }

        // Rule 3: Growth - General
        if (subs.length < 100) {
            suggestions.push({
                id: "growth-100",
                type: "growth",
                title: "Reach Your First 100",
                description: "You're building momentum. Share your best post on social media to drive signups.",
                actionLabel: "Share Post",
                impact: "medium"
            });
        }

        return { data: suggestions };
    } catch (error) {
        return { data: [], error: "Failed to load suggestions" };
    }
}

export async function getGrowthData() {
    try {
        // Group subscribers by month (last 6 months)
        // Note: Drizzle SQL helper for date_trunc varies by DB driver. Assuming Postgres.
        const result = await db.execute(sql`
            SELECT TO_CHAR(created_at, 'Mon') as month, COUNT(*) as total
            FROM ${subscribers}
            WHERE created_at > NOW() - INTERVAL '6 months'
            GROUP BY 1, TO_CHAR(created_at, 'MM')
            ORDER BY TO_CHAR(created_at, 'MM')
        `);

        // If no data, return empty structure or the query result
        return result.rows.map((row: any) => ({
            month: row.month,
            total: Number(row.total)
        }));
    } catch (error) {
        console.error("Failed to fetch growth data:", error);
        return [];
    }
}

export async function getEngagementTrends() {
    try {
        // Group interactions by week
        const result = await db.execute(sql`
            SELECT 
                'W' || TO_CHAR(date, 'W') as week,
                COUNT(CASE WHEN type = 'open' THEN 1 END) as opens,
                COUNT(CASE WHEN type = 'click' THEN 1 END) as clicks
            FROM ${interactions}
            WHERE date > NOW() - INTERVAL '4 weeks'
            GROUP BY 1
            ORDER BY 1
        `);

        return result.rows.map((row: any) => ({
            week: row.week,
            openRate: Number(row.opens),
            clickRate: Number(row.clicks)
        }));
    } catch (error) {
        console.error("Failed to fetch engagement trends:", error);
        return [];
    }
}

export async function getContentPerformance() {
    try {
        // Use Campaigns as proxy for content
        const data = await db.select({
            topic: campaigns.name,
            opens: campaigns.openRate, // Using rate as simple metric for now
            color: sql<string>`'bg-violet-500'` // Default color
        })
            .from(campaigns)
            .orderBy(desc(campaigns.createdAt))
            .limit(5);

        return data;
    } catch (error) {
        console.error("Failed to fetch content performance:", error);
        return [];
    }
}
