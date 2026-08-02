import { notFound, permanentRedirect } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { ServiceDetailView } from "@/components/services/service-detail-view";
import { getServiceBySlug, services } from "@/lib/marketplace-data";
import { managedServiceToMarketplaceService } from "@/lib/cctv-api";
import { fetchSubcategoryDetail } from "@/lib/catalog-api";
import { getSeoMetadata, getServiceSeo } from "@/lib/seo-helpers";
import { JsonLd } from "@/components/seo/json-ld";

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

  // Normalize aliases for metadata lookup
  let canonicalSlug = slug;
  if (slug === "cctv-installation") canonicalSlug = "install-new-cctv";
  if (slug === "cctv-repair") canonicalSlug = "repair-existing-cctv";
  if (slug === "cctv-maintenance" || slug === "cctv-amc") canonicalSlug = "maintenance-amc";

  const service = getServiceBySlug(canonicalSlug);
  let name = service?.title;
  let description = service?.description;

  if (!service) {
    try {
      const catalogSub = await fetchSubcategoryDetail(canonicalSlug);
      if (catalogSub) {
        name = catalogSub.name;
        description = catalogSub.description || catalogSub.name;
      }
    } catch {}
  }

  if (!name) {
    return getSeoMetadata({
      title: "Service Not Found | TechBes Bangalore",
      description: "The requested IT or CCTV service was not found.",
      path: `/services/${slug}`,
      noIndex: true,
    });
  }

  const seoInfo = getServiceSeo(canonicalSlug, { name, description });

  return getSeoMetadata({
    title: seoInfo.title,
    description: seoInfo.description,
    keywords: seoInfo.keywords,
    path: `/services/${canonicalSlug}`,
  });
}

export default async function ServiceDetailsPage({ params }: PageProps) {
  const { slug } = await params;

  // 301 Permanent Redirects for CCTV aliases to prevent duplicate pages
  if (slug === "cctv-installation") {
    permanentRedirect("/services/install-new-cctv");
  }
  if (slug === "cctv-repair") {
    permanentRedirect("/services/repair-existing-cctv");
  }
  if (slug === "cctv-maintenance" || slug === "cctv-amc") {
    permanentRedirect("/services/maintenance-amc");
  }

  let service = getServiceBySlug(slug) as any;

  try {
    const catalogSub = await fetchSubcategoryDetail(slug);
    if (catalogSub) {
      if (!service) {
        service = managedServiceToMarketplaceService(catalogSub as any, 0);
      } else {
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
    console.error("Catalog API lookup failed for slug:", slug, err);
  }

  if (!service) {
    notFound();
  }

  const breadcrumbs = {
    items: [
      { name: "Home", url: "/" },
      { name: "Services", url: "/services" },
      { name: service.title, url: `/services/${service.slug}` },
    ],
  };

  const isBuyProducts = service.slug === "buy-cctv-products";

  return (
    <PageShell>
      <JsonLd type="breadcrumb" data={breadcrumbs} />
      <JsonLd type="service" data={service} />
      {service.faqs && service.faqs.length > 0 && <JsonLd type="faq" data={service} />}
      {isBuyProducts && <JsonLd type="product" data={service} />}
      <ServiceDetailView service={service} />
    </PageShell>
  );
}

