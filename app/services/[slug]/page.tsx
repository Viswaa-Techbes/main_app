import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { ServiceDetailView } from "@/components/services/service-detail-view";
import { getServiceBySlug, services } from "@/lib/marketplace-data";
import { cctvApi, managedServiceToMarketplaceService } from "@/lib/cctv-api";

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
    try {
      const managed = await cctvApi.subcategory(slug);
      return {
        title: `${managed.name} | Techbes Marketplace`,
        description: managed.shortDescription || managed.overview,
      };
    } catch {}
  }
  
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
  let service = getServiceBySlug(slug) as any;

  try {
    const managed = await cctvApi.subcategory(slug);
    if (managed) {
      if (!service) {
        service = managedServiceToMarketplaceService(managed, 0);
      } else {
        service = {
          ...service,
          managedService: managed,
          priceValue: managed.pricingStartsFrom || service.priceValue,
        };
      }
    }
  } catch (err) {
    console.error("Failed to load managed service configurations for slug:", slug, err);
  }

  if (!service) {
    notFound();
  }

  return (
    <PageShell>
      <ServiceDetailView service={service} />
    </PageShell>
  );
}

