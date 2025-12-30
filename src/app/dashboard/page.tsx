import { getDashboardMetrics } from "@/actions/analytics";
import { getOnboardingStatus } from "@/actions/onboarding";
import DashboardContent from "./dashboard-content";

export default async function DashboardPage({
  searchParams
}: {
  searchParams: Promise<{ range?: string }>
}) {
  const resolvedParams = await searchParams;
  const range = resolvedParams?.range || "week";

  const [metrics, onboarding] = await Promise.all([
    getDashboardMetrics(range),
    getOnboardingStatus()
  ]);

  return <DashboardContent metrics={metrics} range={range} onboardingProgress={onboarding.data} />;
}
