import { PageShell } from "@/components/layout/page-shell";
import { DashboardOverview } from "@/components/services/dashboard-overview";

export const metadata = {
  title: "Dashboard | Techbes Marketplace",
  description: "View upcoming bookings, order history, and saved service addresses.",
};

export default function DashboardPage() {
  return (
    <PageShell>
      <DashboardOverview />
    </PageShell>
  );
}
