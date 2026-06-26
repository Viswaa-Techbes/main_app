import { PageShell } from "@/components/layout/page-shell";
import { ServiceCatalog } from "@/components/services/service-catalog";

export const metadata = {
  title: "All Services | Techbes Marketplace",
  description: "Browse premium IT services like CCTV, networking, laptop, desktop, server setup, electronic contracts, home automation, website development, software licensing, and cyber security.",
};

export default function ServicesPage() {
  return (
    <PageShell>
      <ServiceCatalog />
    </PageShell>
  );
}
