import { MetadataRoute } from "next";
import { fetchAllSubcategories } from "@/lib/catalog-api";
import { services as marketplaceServices } from "@/lib/marketplace-data";
import { GEO_PAGES } from "@/lib/geo-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://techbes.co.in";
  const now = new Date();

  // 1. Static Core & Legal Pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/knowledge`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/quote`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/cookie-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/refund-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/cancellation-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/shipping-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/return-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/security-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/accessibility`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/responsible-disclosure`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // 2. Canonical Service Slugs
  // Non-canonical alias redirects that must NEVER be in sitemap:
  const ALIAS_REDIRECTS = new Set([
    "cctv-installation",
    "cctv-repair",
    "cctv-maintenance",
    "cctv-amc",
  ]);

  // Test/internal services that must NEVER be in sitemap:
  const EXCLUDED_SERVICES = new Set([
    "rupee-one-test-service",
  ]);

  // Core canonical CCTV services:
  const CANONICAL_CORE_SERVICES = [
    "install-new-cctv",
    "repair-existing-cctv",
    "maintenance-amc",
    "upgrade-existing-cctv",
    "buy-cctv-products",
    "free-site-survey",
  ];

  const serviceSlugs = new Set<string>(CANONICAL_CORE_SERVICES);

  // Add marketplace services (skipping aliases and test items)
  if (Array.isArray(marketplaceServices)) {
    for (const service of marketplaceServices) {
      if (
        service?.slug &&
        !ALIAS_REDIRECTS.has(service.slug) &&
        !EXCLUDED_SERVICES.has(service.slug) &&
        !service.slug.includes("test")
      ) {
        serviceSlugs.add(service.slug);
      }
    }
  }

  // Attempt dynamic fetch from Catalog API if backend is accessible
  try {
    const catalogSubcategories = await fetchAllSubcategories();
    if (Array.isArray(catalogSubcategories)) {
      for (const sub of catalogSubcategories) {
        const subSlug = (sub as any)?.slug;
        if (
          subSlug &&
          !ALIAS_REDIRECTS.has(subSlug) &&
          !EXCLUDED_SERVICES.has(subSlug) &&
          !subSlug.includes("test")
        ) {
          serviceSlugs.add(subSlug);
        }
      }
    }
  } catch (err) {
    console.warn("[Sitemap] Catalog API unreachable during sitemap build, using canonical configuration:", err);
  }

  const servicePages: MetadataRoute.Sitemap = Array.from(serviceSlugs).map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 3. Knowledge Hub Articles (Pillars, Brands, Comparisons, Service Guides, Locations)
  const knowledgePages: MetadataRoute.Sitemap = Object.values(GEO_PAGES).map((page) => ({
    url: `${baseUrl}/knowledge/${page.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Deduplicate all URLs defensively
  const urlMap = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const page of [...staticPages, ...servicePages, ...knowledgePages]) {
    urlMap.set(page.url, page);
  }

  return Array.from(urlMap.values());
}

