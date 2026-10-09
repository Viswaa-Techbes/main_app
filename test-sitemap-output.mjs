import sitemap from "./app/sitemap.ts";

async function verify() {
  const result = await sitemap();
  console.log("TOTAL_URLS:", result.length);
  
  const urls = result.map(r => r.url);
  const locationUrls = urls.filter(u => u.includes("/locations/"));
  const blogUrls = urls.filter(u => u.includes("/blog/"));
  const queryUrls = urls.filter(u => u.includes("?"));
  const aliasUrls = urls.filter(u => 
    u.endsWith("/cctv-installation") || 
    u.endsWith("/cctv-repair") || 
    u.endsWith("/cctv-maintenance") || 
    u.endsWith("/cctv-amc")
  );
  const testUrls = urls.filter(u => u.includes("test") || u.includes("demo"));
  const adminUrls = urls.filter(u => u.includes("/admin") || u.includes("/dashboard"));

  console.log("LOCATION_URLS_FOUND:", locationUrls.length);
  console.log("BLOG_URLS_FOUND:", blogUrls.length);
  console.log("QUERY_URLS_FOUND:", queryUrls.length);
  console.log("ALIAS_URLS_FOUND:", aliasUrls.length);
  console.log("TEST_DEMO_URLS_FOUND:", testUrls.length);
  console.log("ADMIN_DASHBOARD_URLS_FOUND:", adminUrls.length);

  const staticUrls = urls.filter(u => 
    !u.includes("/services/") && !u.includes("/knowledge/")
  );
  const serviceUrls = urls.filter(u => u.includes("/services/"));
  const knowledgeUrls = urls.filter(u => u.includes("/knowledge/"));

  console.log("STATIC_PAGES_COUNT:", staticUrls.length);
  console.log("SERVICE_PAGES_COUNT:", serviceUrls.length);
  console.log("KNOWLEDGE_PAGES_COUNT:", knowledgeUrls.length);

  console.log("\n--- ALL URLS ---");
  urls.forEach((u, i) => console.log(`${i + 1}. ${u}`));
}

verify().catch(console.error);
