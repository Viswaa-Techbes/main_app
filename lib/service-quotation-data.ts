/**
 * TechBes Unified Service Catalog & Quotation Mapping
 * Customer-Facing Priority Categories:
 * 1. CCTV (6 services)
 * 2. Networking (12 services)
 * 3. Website / Web Designing (19 services)
 */

export interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  badge?: string;
}

export interface QuotationCategory {
  id: string;
  name: string;
  slug: string;
  title: string;
  shortDesc: string;
  description: string;
  iconName: "Camera" | "Network" | "Globe";
  gradient: string;
  services: ServiceItem[];
}

export const QUOTATION_CATEGORIES: QuotationCategory[] = [
  {
    id: "cctv",
    name: "CCTV",
    slug: "cctv",
    title: "CCTV",
    shortDesc: "Surveillance, Cameras & Storage",
    description: "Smart surveillance, security cameras, DVR/NVR recorders, and maintenance.",
    iconName: "Camera",
    gradient: "from-cyan-500 via-sky-500 to-blue-600",
    services: [
      {
        id: "install-new-cctv",
        name: "Install New CCTV",
        slug: "install-new-cctv",
        description: "Fresh CCTV camera installation for homes, apartments, retail, and offices.",
        badge: "Popular",
      },
      {
        id: "repair-existing-cctv",
        name: "Repair Existing CCTV",
        slug: "repair-existing-cctv",
        description: "Diagnose and repair video loss, DVR/NVR errors, and power faults.",
      },
      {
        id: "maintenance-amc",
        name: "Maintenance / AMC",
        slug: "maintenance-amc",
        description: "Annual Maintenance Contracts for continuous, uninterrupted security coverage.",
      },
      {
        id: "upgrade-existing-cctv",
        name: "Upgrade Existing CCTV",
        slug: "upgrade-existing-cctv",
        description: "Expand camera coverage, upgrade analog to IP, or increase storage capacities.",
      },
      {
        id: "buy-cctv-products",
        name: "Buy CCTV Products",
        slug: "buy-cctv-products",
        description: "Purchase individual security cameras, recorders, hard drives, and cables.",
      },
      {
        id: "free-site-survey",
        name: "Free Site Survey",
        slug: "free-site-survey",
        description: "Schedule a free on-site survey for custom security planning and estimation.",
        badge: "Free",
      },
    ],
  },
  {
    id: "networking",
    name: "Networking",
    slug: "networking",
    title: "Networking",
    shortDesc: "Wi-Fi, Switches & Structured Cabling",
    description: "Office LAN setup, Wi-Fi speed optimization, routers, firewalls, and enterprise cabling.",
    iconName: "Network",
    gradient: "from-emerald-500 via-teal-500 to-cyan-600",
    services: [
      {
        id: "new-network-setup",
        name: "New Office Network Setup",
        slug: "new-network-setup",
        description: "Complete network rollout with routers, managed switches, and access points.",
        badge: "Popular",
      },
      {
        id: "wifi-internet-issues",
        name: "Wi-Fi & Internet Speed Optimization",
        slug: "wifi-internet-issues",
        description: "Eliminate dead zones, resolve latency issues, and maximize bandwidth.",
      },
      {
        id: "router-modem",
        name: "Router, Switch & Access Point Setup",
        slug: "router-modem",
        description: "Configuration of enterprise routers, Layer-2/3 switches, and ceiling APs.",
      },
      {
        id: "office-network-deployment",
        name: "Office Network Deployment",
        slug: "office-network-deployment",
        description: "Full office LAN deployment, VLAN segmentation, and device connectivity.",
      },
      {
        id: "structured-cabling",
        name: "Structured Cat6 / Fiber Cabling",
        slug: "structured-cabling",
        description: "Conduit routing, Cat6 Ethernet patching, IO wall jacks, and server rack dressing.",
      },
      {
        id: "network-upgrade",
        name: "Network Hardware Upgrade",
        slug: "network-upgrade",
        description: "Upgrade legacy routers and unmanaged switches to Gigabit/10G infrastructure.",
      },
      {
        id: "network-security",
        name: "Network Security & Firewall",
        slug: "network-security",
        description: "Hardware firewall policies, guest isolation, intrusion prevention, and secure VPN.",
      },
      {
        id: "server-storage",
        name: "Server & NAS Storage Integration",
        slug: "server-storage",
        description: "NAS local backup storage, Synology/QNAP servers, and centralized file sharing.",
      },
      {
        id: "network-amc",
        name: "Network AMC",
        slug: "network-amc",
        description: "Annual maintenance contracts for proactive business network uptime and health.",
      },
      {
        id: "network-accessories",
        name: "Network Accessories",
        slug: "network-accessories",
        description: "Server racks, patch panels, patch cords, keystone jacks, and PoE injectors.",
      },
      {
        id: "network-troubleshooting",
        name: "Network Troubleshooting",
        slug: "network-troubleshooting",
        description: "Rapid on-site troubleshooting for packet drops, DNS loops, and disconnects.",
      },
      {
        id: "network-survey",
        name: "Free Network Site Audit",
        slug: "network-survey",
        description: "Complimentary on-site audit of existing infrastructure and custom quote roadmap.",
        badge: "Free",
      },
    ],
  },
  {
    id: "website-development",
    name: "Web Designing",
    slug: "website-development",
    title: "Website / Web Designing",
    shortDesc: "Custom Websites & Digital Solutions",
    description: "Professional website design, modern web applications, e-commerce, and digital marketing.",
    iconName: "Globe",
    gradient: "from-blue-600 via-indigo-600 to-violet-700",
    services: [
      {
        id: "business-website",
        name: "Business Website",
        slug: "business-website",
        description: "Custom responsive corporate website presenting your brand, services, and trust.",
        badge: "Popular",
      },
      {
        id: "landing-page",
        name: "Landing Page",
        slug: "landing-page",
        description: "Single high-conversion landing page optimized for PPC ads and lead capture.",
      },
      {
        id: "ecommerce-website",
        name: "Ecommerce Website",
        slug: "ecommerce-website",
        description: "Online store with product catalog, cart, checkout, and payment gateway.",
      },
      {
        id: "web-app",
        name: "Custom Web Application",
        slug: "web-app",
        description: "Tailored full-stack web application with databases, APIs, and client portals.",
      },
      {
        id: "web-redesign",
        name: "Website Redesign",
        slug: "web-redesign",
        description: "Visual modernization, mobile responsiveness, and UX revamp of existing sites.",
      },
      {
        id: "web-maintenance",
        name: "Website Maintenance",
        slug: "web-maintenance",
        description: "Monthly content updates, security patches, plugin renewals, and backups.",
      },
      {
        id: "speed-optimization",
        name: "Speed Optimization",
        slug: "speed-optimization",
        description: "Core Web Vitals enhancement, asset caching, image compression, and CDN setup.",
      },
      {
        id: "web-security",
        name: "Website Security & SSL",
        slug: "web-security",
        description: "SSL installation, malware cleanup, firewall rules, and vulnerability hardening.",
      },
      {
        id: "domain-hosting",
        name: "Domain & Hosting Setup",
        slug: "domain-hosting",
        description: "Domain DNS records, high-speed cloud hosting setup, and business email routing.",
      },
      {
        id: "seo-optimization",
        name: "SEO Optimization",
        slug: "seo-optimization",
        description: "On-page search engine optimization, meta tags, schema markup, and sitemaps.",
      },
      {
        id: "web-content",
        name: "Website Content & Copywriting",
        slug: "web-content",
        description: "Professional copywriting, persuasive headlines, and engaging value propositions.",
      },
      {
        id: "web-migration",
        name: "Website Migration",
        slug: "web-migration",
        description: "Seamless hosting, server, or domain migration with zero downtime.",
      },
      {
        id: "web-support",
        name: "Website Technical Support",
        slug: "web-support",
        description: "On-demand troubleshooting, bug fixes, layout corrections, and code patches.",
      },
      {
        id: "web-amc",
        name: "Website AMC",
        slug: "web-amc",
        description: "Annual maintenance contract for ongoing technical support, backups, and audits.",
      },
      {
        id: "digital-marketing",
        name: "Digital Marketing & Growth",
        slug: "digital-marketing",
        description: "Google Analytics 4, Tag Manager, pixel tracking, and conversion optimization.",
      },
      {
        id: "web-consultation",
        name: "Web Consultation",
        slug: "web-consultation",
        description: "Architecture roadmap, technology stack advisory, and project planning.",
      },
      {
        id: "new-website",
        name: "New Website Setup",
        slug: "new-website",
        description: "Turnkey website launch from domain registration to first page publish.",
      },
      {
        id: "portfolio-website",
        name: "Portfolio Website",
        slug: "portfolio-website",
        description: "Sleek portfolio showcase for professionals, architects, and creative agencies.",
      },
      {
        id: "website-development",
        name: "Website Development",
        slug: "website-development",
        description: "Full-stack custom web engineering built to your exact specifications.",
      },
    ],
  },
];

/**
 * Helpers to find category or service by ID, slug or name
 */
export function findCategoryBySlug(slugOrName: string): QuotationCategory | undefined {
  if (!slugOrName) return undefined;
  const s = slugOrName.toLowerCase().trim();
  return QUOTATION_CATEGORIES.find(
    (c) =>
      c.slug.toLowerCase() === s ||
      c.id.toLowerCase() === s ||
      c.name.toLowerCase() === s ||
      (s.includes("cctv") && c.id === "cctv") ||
      (s.includes("net") && c.id === "networking") ||
      ((s.includes("web") || s.includes("design")) && c.id === "website-development")
  );
}

export function findServiceBySlug(
  categorySlug: string,
  serviceSlugOrName: string
): ServiceItem | undefined {
  const cat = findCategoryBySlug(categorySlug);
  if (!cat || !serviceSlugOrName) return undefined;
  const s = serviceSlugOrName.toLowerCase().trim();

  return cat.services.find(
    (svc) =>
      svc.slug.toLowerCase() === s ||
      svc.id.toLowerCase() === s ||
      svc.name.toLowerCase() === s
  );
}
