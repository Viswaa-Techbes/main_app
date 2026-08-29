import { MetadataRoute } from "next";
import { fetchAllSubcategories } from "@/lib/catalog-api";
import { GEO_PAGES } from "@/lib/geo-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://techbes.co.in";

  // 1. Static Pages
  const staticPages = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/cookie-policy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/refund-policy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/cancellation-policy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/shipping-policy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/return-policy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/security-policy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/accessibility`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${baseUrl}/responsible-disclosure`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  // 2. Dynamic services from catalog API
  let subcategories: any[] = [];
  try {
    subcategories = await fetchAllSubcategories();
  } catch (err) {
    console.error("[Sitemap] Failed to fetch subcategories from catalog API:", err);
  }

  // Fallback subcategories if backend lookup fails during build
  const finalSubcategories =
    subcategories && subcategories.length > 0
      ? subcategories
      : [
          { slug: "install-new-cctv" },
          { slug: "repair-existing-cctv" },
          { slug: "maintenance-amc" },
          { slug: "upgrade-existing-cctv" },
          { slug: "buy-cctv-products" },
          { slug: "free-site-survey" },
          { slug: "office-network-deployment" },
          { slug: "managed-firewall-setup" },
          { slug: "laptop-repair" },
          { slug: "desktop-repair" },
          { slug: "server-setup" },
          { slug: "home-automation" },
          { slug: "website-development" },
          { slug: "software-licensing" },
        ];

  const servicePages = finalSubcategories.map((sub: any) => ({
    url: `${baseUrl}/services/${sub.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 3. Future Locations (Bangalore focused)
  const futureLocations = [
    "indiranagar",
    "jayanagar",
    "koramangala",
    "whitefield",
    "hsr-layout",
    "malleswaram",
    "hebbal",
    "nagarbhavi",
    "banashankari",
    "yelahanka",
  ].map((loc) => ({
    url: `${baseUrl}/locations/${loc}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // 4. Future Blogs
  const futureBlogs = [
    "cctv-installation-guide-bangalore",
    "choosing-it-amc-provider-bangalore",
    "office-network-setup-best-practices",
    "home-security-camera-placement-tips",
    "laptop-maintenance-guide-preventative",
  ].map((blog) => ({
    url: `${baseUrl}/blog/${blog}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // 5. Future Categories
  const futureCategories = [
    "cctv",
    "networking",
    "laptop",
    "desktop",
    "server",
    "electronic-contracts",
    "home-automation",
    "website-development",
    "software-licensing",
    "cyber-security",
  ].map((cat) => ({
    url: `${baseUrl}/services?category=${cat}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  // 6. Knowledge Hub Landing and Dynamic Guides
  const knowledgePages = [
    { url: `${baseUrl}/knowledge`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
    ...Object.values(GEO_PAGES).map((page) => ({
      url: `${baseUrl}/knowledge/${page.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  ];

  return [
    ...staticPages,
    ...servicePages,
    ...futureLocations,
    ...futureBlogs,
    ...futureCategories,
    ...knowledgePages,
  ] as MetadataRoute.Sitemap;
}
