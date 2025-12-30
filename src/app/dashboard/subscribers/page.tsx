import { auth } from "@/auth";
import { getSubscribers, getSegments } from "@/actions/subscribers";
import SubscribersContent from "./subscribers-content";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();
  // if (!session) redirect("/login"); 

  const resolvedSearchParams = await searchParams;

  const page = Number(resolvedSearchParams?.page) || 1;
  const limit = 20;

  const { data: rawSubscribers, count, error } = await getSubscribers({
    query: typeof resolvedSearchParams.query === 'string' ? resolvedSearchParams.query : undefined,
    status: typeof resolvedSearchParams.status === 'string' ? resolvedSearchParams.status : undefined,
    engagement: typeof resolvedSearchParams.engagement === 'string' ? resolvedSearchParams.engagement : undefined,
    segmentId: typeof resolvedSearchParams.segmentId === 'string' ? resolvedSearchParams.segmentId : undefined,
    risk: typeof resolvedSearchParams.risk === 'string' ? resolvedSearchParams.risk : undefined,
    page,
    limit
  });

  const { data: segments } = await getSegments();

  // Map DB result to UI Interface
  const subscribers = rawSubscribers?.map(sub => ({
    id: sub.id,
    name: sub.name,
    email: sub.email,
    status: sub.status,
    engagementLevel: sub.engagementLevel,
    openRate: sub.totalOpens ? Math.min(100, Math.round((sub.totalOpens / 10) * 10)) : 0, // Mock calculation
    joinDate: sub.joinDate,
    lastActive: sub.lastActive,
    rfmScore: sub.rfmScore,
    churnRisk: sub.churnRisk,
    avatar: null
  })) || [];

  return (
    <SubscribersContent
      initialSubscribers={subscribers}
      totalCount={count || 0}
      initialSegments={segments || []}
      initialFilters={{
        query: typeof resolvedSearchParams.query === 'string' ? resolvedSearchParams.query : undefined,
        status: typeof resolvedSearchParams.status === 'string' ? resolvedSearchParams.status : undefined,
        engagement: typeof resolvedSearchParams.engagement === 'string' ? resolvedSearchParams.engagement : undefined,
        segmentId: typeof resolvedSearchParams.segmentId === 'string' ? resolvedSearchParams.segmentId : undefined,
        risk: typeof resolvedSearchParams.risk === 'string' ? resolvedSearchParams.risk : undefined,
        page
      }}
    />
  );
}
