import { notFound, redirect } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { ServiceDetailView } from "@/components/services/service-detail-view";
import { getServiceBySlug, services } from "@/lib/marketplace-data";
import { managedServiceToMarketplaceService } from "@/lib/cctv-api";
import { fetchSubcategoryDetail } from "@/lib/catalog-api";

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
      const catalogSub = await fetchSubcategoryDetail(slug);
      if (catalogSub) {
        return {
          title: `${catalogSub.name} | Techbes Marketplace`,
          description: catalogSub.description || catalogSub.name,
        };
      }
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

  const cctvSlugs = ["install-new-cctv", "repair-existing-cctv", "cctv-repair", "maintenance-amc", "cctv-maintenance", "upgrade-existing-cctv", "buy-cctv-products", "free-site-survey"];
  if (cctvSlugs.includes(slug)) {
    redirect(`/services?category=cctv&booking=${slug}`);
  }

  let service = getServiceBySlug(slug) as any;

  try {
    // Use the new catalog API — works for ALL categories, not just CCTV
    const catalogSub = await fetchSubcategoryDetail(slug);
    if (catalogSub) {
      if (!service) {
        // Build a full marketplace service from the catalog subcategory
        service = managedServiceToMarketplaceService(catalogSub as any, 0);
      } else {
        // Enrich the static service with live catalog data
        const pricingStartsFrom =
          (catalogSub.packages && catalogSub.packages.length > 0
            ? catalogSub.packages[0].price
            : 0) || service.priceValue;

        service = {
          ...service,
          managedService: catalogSub,
          priceValue: pricingStartsFrom || service.priceValue,
          price: pricingStartsFrom
            ? `From Rs. ${pricingStartsFrom.toLocaleString("en-IN")}`
            : service.price,
        };
      }
    }
  } catch (err) {
    // Catalog lookup failed — fall back to static data only (no CCTV endpoint)
    console.error("Catalog API lookup failed for slug:", slug, err);
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
