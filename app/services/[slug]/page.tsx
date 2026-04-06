import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { ServiceDetailView } from "@/components/services/service-detail-view";
import { getServiceBySlug, services } from "@/lib/marketplace-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  
  if (!service) {
    return {
      title: "Service Not Found | Techbes Marketplace",
    };
  }

  return {
    title: `${service.title} | Techbes Marketplace`,
    description: service.description,
  };
}

export default async function ServiceDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <PageShell>
      <ServiceDetailView service={service} />
    </PageShell>
  );
}
