import { getDashboardMetrics } from "@/actions/analytics";
import DashboardContent from "./dashboard-content";

// @ts-ignore
export default async function DashboardPage({ searchParams }: { searchParams: { range?: string } }) {
  const range = searchParams?.range || "week";

  const metrics = await getDashboardMetrics(range);

  return <DashboardContent metrics={metrics} range={range} />;
}
