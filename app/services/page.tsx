import { PageShell } from "@/components/layout/page-shell";
import { ServiceCatalog } from "@/components/services/service-catalog";

export const metadata = {
  title: "All Services | Techbes Marketplace",
  description: "Browse premium IT services with advanced filters, ratings, booking flows, and AMC plans.",
};

export default function ServicesPage() {
  return (
    <PageShell>
      <ServiceCatalog />
    </PageShell>
  );
}
