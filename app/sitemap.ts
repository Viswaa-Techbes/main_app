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

  // 2. Canonical Service Slugs — Restricted to Three Priority Categories (Task 1C)
  // Allowed Priority Category Slugs & Database Identifiers:
  // 1. CCTV (ID: 6a44a3d1ef917a689f762693, slug: "cctv")
  // 2. Networking (ID: 6a44a3d2ef917a689f7626a1, slug: "networking")
  // 3. Website Development / Web Designing (ID: 6a44a3daef917a689f7626ff, slug: "website-development")
  const ALLOWED_CATEGORY_SLUGS = new Set([
    "cctv",
    "networking",
    "website-development",
  ]);

  const ALLOWED_CATEGORY_IDS = new Set([
    "6a44a3d1ef917a689f762693", // CCTV
    "6a44a3d2ef917a689f7626a1", // Networking
    "6a44a3daef917a689f7626ff", // Website Development
  ]);

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

  // Verified canonical services for the 3 priority categories (37 services):
  const CANONICAL_PRIORITY_SERVICES = [
    // CCTV (6 services)
    "install-new-cctv",
    "repair-existing-cctv",
    "maintenance-amc",
    "upgrade-existing-cctv",
    "buy-cctv-products",
    "free-site-survey",

    // Networking (12 services)
    "office-network-deployment",
    "new-network-setup",
    "wifi-internet-issues",
    "router-modem",
    "office-network",
    "structured-cabling",
    "network-upgrade",
    "network-security",
    "network-amc",
    "network-accessories",
    "network-troubleshooting",
    "network-survey",

    // Website / Web Designing (19 services)
    "website-development",
    "new-website",
    "business-website",
    "ecommerce-website",
    "landing-page",
    "portfolio-website",
    "web-app",
    "web-redesign",
    "web-maintenance",
    "speed-optimization",
    "web-security",
    "domain-hosting",
    "seo-optimization",
    "web-content",
    "web-migration",
    "web-support",
    "web-amc",
    "digital-marketing",
    "web-consultation",
  ];

  const serviceSlugs = new Set<string>(CANONICAL_PRIORITY_SERVICES);

  // Add marketplace services filtered strictly to the three allowed categories
  if (Array.isArray(marketplaceServices)) {
    for (const service of marketplaceServices) {
      if (
        service?.slug &&
        service?.categoryId &&
        ALLOWED_CATEGORY_SLUGS.has(service.categoryId) &&
        !ALIAS_REDIRECTS.has(service.slug) &&
        !EXCLUDED_SERVICES.has(service.slug) &&
        !service.slug.includes("test")
      ) {
        serviceSlugs.add(service.slug);
      }
    }
  }

  // Attempt dynamic fetch from Catalog API if backend is accessible, filtering strictly to allowed categories
  try {
    const catalogSubcategories = await fetchAllSubcategories();
    if (Array.isArray(catalogSubcategories)) {
      for (const sub of catalogSubcategories) {
        const subSlug = (sub as any)?.slug;
        const catSlug = typeof (sub as any)?.categoryId === "object"
          ? (sub as any)?.categoryId?.slug
          : null;
        const catId = typeof (sub as any)?.categoryId === "object"
          ? (sub as any)?.categoryId?._id
          : (sub as any)?.categoryId;

        const isAllowedCategory =
          (catSlug && ALLOWED_CATEGORY_SLUGS.has(catSlug)) ||
          (catId && ALLOWED_CATEGORY_IDS.has(catId));

        if (
          isAllowedCategory &&
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

