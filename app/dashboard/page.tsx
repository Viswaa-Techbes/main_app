import dynamic from "next/dynamic";

import { PageStatus } from "@/shared/components/feedback/page-status";

export const metadata = {
  title: "Dashboard | Techbes Marketplace",
  description: "View upcoming bookings, order history, and saved service addresses.",
};

const DashboardOverview = dynamic(
  () => import("@/features/dashboard/components/dashboard-overview").then((module) => module.DashboardOverview),
  {
    loading: () => <PageStatus message="Loading dashboard modules..." className="min-h-[70vh]" />,
  },
);

export default function DashboardPage() {
  return <DashboardOverview />;
}
