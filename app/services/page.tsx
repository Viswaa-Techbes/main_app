import { PageShell } from "@/components/layout/page-shell";
import { ServiceCatalog } from "@/components/services/service-catalog";
import { getSeoMetadata } from "@/lib/seo-helpers";

export const metadata = getSeoMetadata({
  title: "All IT Services & CCTV Solutions in Bangalore | TechBes",
  description:
    "Explore our catalog of certified IT services, home automation, and security camera solutions in Bangalore. Transparent pricing and verified technicians.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <PageShell>
      <ServiceCatalog />
    </PageShell>
  );
}
