import type { Metadata } from "next";

const SITE_URL = "https://techbes.co.in";

interface SeoOptions {
  title: string;
  description: string;
  keywords?: string | string[];
  path: string;
  image?: string;
  noIndex?: boolean;
}

/**
 * Generates dynamic Next.js Metadata objects with complete SEO optimization
 */
export function getSeoMetadata({
  title,
  description,
  keywords = [],
  path,
  image = "/hero-illustration.png",
  noIndex = false,
}: SeoOptions): Metadata {
  const canonicalUrl = `${SITE_URL}${path.replace(/\/$/, "")}`;
  const absoluteImageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  const defaultKeywords = [
    "CCTV Installation Bangalore",
    "IT Services Bangalore",
    "TechBes Bangalore",
    "Networking Solutions Bangalore",
    "CCTV AMC Bangalore"
  ];

  const processedKeywords = Array.isArray(keywords)
    ? [...keywords, ...defaultKeywords]
    : [keywords, ...defaultKeywords];

  return {
    title,
    description,
    keywords: Array.from(new Set(processedKeywords)).join(", "),
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: "TechBes",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteImageUrl],
    },
  };
}

/**
 * Service-specific dynamic keywords and SEO configs
 */
export const SERVICES_SEO_CONFIG: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  // CCTV Services
  "install-new-cctv": {
    title: "CCTV Installation in Bangalore | TechBes",
    description:
      "Professional CCTV installation in Bangalore. CP Plus, Hikvision, Secureye, Dahua installation with expert technicians and same-day booking.",
    keywords: [
      "CCTV Installation Bangalore",
      "Home CCTV Installation Bangalore",
      "Office CCTV Installation Bangalore",
      "CP Plus Installation Bangalore",
      "Hikvision Installation Bangalore",
      "Secureye Installation Bangalore",
      "IP Camera Installation Bangalore",
      "Camera Installation Near Me",
    ],
  },
  "cctv-installation": {
    title: "CCTV Installation in Bangalore | TechBes",
    description:
      "Professional CCTV installation in Bangalore. CP Plus, Hikvision, Secureye, Dahua installation with expert technicians and same-day booking.",
    keywords: [
      "CCTV Installation Bangalore",
      "Home CCTV Installation Bangalore",
      "Office CCTV Installation Bangalore",
      "CP Plus Installation Bangalore",
      "Hikvision Installation Bangalore",
      "Secureye Installation Bangalore",
      "IP Camera Installation Bangalore",
      "Camera Installation Near Me",
    ],
  },
  "repair-existing-cctv": {
    title: "CCTV Repair Services in Bangalore | TechBes",
    description:
      "Get same-day CCTV repair services in Bangalore. Expert troubleshooting for video loss, DVR/NVR errors, cable issues, and camera power faults.",
    keywords: [
      "CCTV Repair Bangalore",
      "DVR Repair Bangalore",
      "NVR Repair Bangalore",
      "Camera Service Bangalore",
      "CCTV Camera Repair Bangalore",
      "No Video Loss CCTV Bangalore",
    ],
  },
  "cctv-repair": {
    title: "CCTV Repair Services in Bangalore | TechBes",
    description:
      "Get same-day CCTV repair services in Bangalore. Expert troubleshooting for video loss, DVR/NVR errors, cable issues, and camera power faults.",
    keywords: [
      "CCTV Repair Bangalore",
      "DVR Repair Bangalore",
      "NVR Repair Bangalore",
      "Camera Service Bangalore",
      "CCTV Camera Repair Bangalore",
      "No Video Loss CCTV Bangalore",
    ],
  },
  "maintenance-amc": {
    title: "CCTV AMC Services Bangalore | TechBes",
    description:
      "Secure your premises with annual maintenance contracts (AMC) for CCTV in Bangalore. Includes quarterly preventative maintenance, unlimited breakdown calls, and lens cleanups.",
    keywords: [
      "CCTV AMC Bangalore",
      "CCTV Maintenance Bangalore",
      "Annual Maintenance Contract CCTV Bangalore",
      "Camera AMC Bangalore",
      "Office CCTV AMC Bangalore",
    ],
  },
  "cctv-maintenance": {
    title: "CCTV AMC Services Bangalore | TechBes",
    description:
      "Secure your premises with annual maintenance contracts (AMC) for CCTV in Bangalore. Includes quarterly preventative maintenance, unlimited breakdown calls, and lens cleanups.",
    keywords: [
      "CCTV AMC Bangalore",
      "CCTV Maintenance Bangalore",
      "Annual Maintenance Contract CCTV Bangalore",
      "Camera AMC Bangalore",
      "Office CCTV AMC Bangalore",
    ],
  },
  "upgrade-existing-cctv": {
    title: "CCTV Upgrade Services Bangalore | TechBes",
    description:
      "Upgrade your security cameras to high-definition IP cameras, increase NVR storage capacity, or extend wire coverage with certified technicians in Bangalore.",
    keywords: [
      "CCTV Upgrade Bangalore",
      "Upgrade CCTV Cameras Bangalore",
      "Analog to IP Camera Upgrade Bangalore",
      "CCTV Storage Upgrade Bangalore",
      "CCTV System Modernization Bangalore",
    ],
  },
  "buy-cctv-products": {
    title: "Buy CCTV Cameras in Bangalore | TechBes",
    description:
      "Purchase high-quality CCTV cameras, recorders (DVR/NVR), hard disks, power supplies, and installation accessories in Bangalore with doorstep delivery and demo.",
    keywords: [
      "Buy CCTV Cameras Bangalore",
      "CCTV Camera Shop Bangalore",
      "Purchase Security Cameras Bangalore",
      "Recorders and NVR Bangalore",
      "CCTV Equipment Bangalore",
    ],
  },
  "free-site-survey": {
    title: "Free CCTV Site Survey Bangalore | TechBes",
    description:
      "Book a free on-site CCTV survey in Bangalore. Certified TechBes engineers will inspect your site, design optimal camera placements, and provide custom quotes.",
    keywords: [
      "Free CCTV Survey Bangalore",
      "Free Camera Inspection Bangalore",
      "CCTV Quote Bangalore",
      "Onsite Security Check Bangalore",
      "Free CCTV Inspection Bangalore",
    ],
  },
  // Networking Services
  "office-network-deployment": {
    title: "Office Network Deployment in Bangalore | TechBes",
    description:
      "Secure LAN, Wi-Fi planning, structured cabling, router/switch configurations, and enterprise network deployment in Bangalore.",
    keywords: [
      "Office Network Deployment Bangalore",
      "Structured Cabling Bangalore",
      "WiFi Setup Bangalore",
      "Office WiFi Installation Bangalore",
      "Ethernet Cabling Bangalore",
    ],
  },
  "wifi-setup": {
    title: "Wi-Fi Network Setup in Bangalore | TechBes",
    description:
      "Get high-speed Wi-Fi router installation, mesh network configuration, and internet range extender setup in Bangalore.",
    keywords: [
      "WiFi Setup Bangalore",
      "WiFi Router Installation Bangalore",
      "Mesh WiFi Bangalore",
      "Internet Range Extender Bangalore",
    ],
  },
  "structured-cabling": {
    title: "Structured Network Cabling Bangalore | TechBes",
    description:
      "Cat5e, Cat6, Cat6A, and Cat8 structured cabling, patch panel punch-downs, and network rack cable routing services in Bangalore.",
    keywords: [
      "Structured Cabling Bangalore",
      "Network Cabling Bangalore",
      "Cat6 Cabling Bangalore",
      "Office Lan Wiring Bangalore",
    ],
  },
  "network-troubleshooting": {
    title: "Network Troubleshooting & Wi-Fi Repair Bangalore | TechBes",
    description:
      "Fix slow internet speeds, wireless dead zones, network packet drops, and switch connection issues in Bangalore.",
    keywords: [
      "Network Troubleshooting Bangalore",
      "Slow Internet Fix Bangalore",
      "WiFi Repair Bangalore",
      "No Internet Troubleshooting Bangalore",
    ],
  },
  // Other Services
  "managed-firewall-setup": {
    title: "Managed Firewall Setup & Cybersecurity Bangalore | TechBes",
    description:
      "Protect your enterprise network in Bangalore with secure firewall configuration, user policies, VPN, and cybersecurity hardening.",
    keywords: [
      "Managed Firewall Setup Bangalore",
      "Cybersecurity Bangalore",
      "Fortinet Firewall Bangalore",
      "Office VPN Setup Bangalore",
    ],
  },
  "laptop-repair": {
    title: "Laptop Repair & Service in Bangalore | TechBes",
    description:
      "Certified laptop hardware repair, screen changes, battery replacements, and OS tune-ups at your doorstep in Bangalore.",
    keywords: [
      "Laptop Repair Bangalore",
      "Laptop Battery Replacement Bangalore",
      "Laptop Screen Replacement Bangalore",
      "MacBook Repair Bangalore",
    ],
  },
  "desktop-repair": {
    title: "Desktop Repair & Hardware Upgrades Bangalore | TechBes",
    description:
      "Professional desktop repair, SMPS fixing, SSD/RAM upgrades, and custom CPU building at home or office in Bangalore.",
    keywords: [
      "Desktop Repair Bangalore",
      "PC Repair Bangalore",
      "SSD Upgrade Bangalore",
      "RAM Upgrade Bangalore",
    ],
  },
  "server-setup": {
    title: "Enterprise Server Setup & AD/DNS Bangalore | TechBes",
    description:
      "Server rack node mounting, Active Directory domain setup, virtual hypervisors (ESXi/Hyper-V), and server data backup in Bangalore.",
    keywords: [
      "Server Setup Bangalore",
      "Domain Controller Setup Bangalore",
      "Active Directory Bangalore",
      "Server AMC Bangalore",
    ],
  },
  "home-automation": {
    title: "Smart Home Automation Setup in Bangalore | TechBes",
    description:
      "Deploy smart door locks, touch panel lighting control, Google Home/Alexa voice pairing, and automation scenes in Bangalore.",
    keywords: [
      "Smart Home Automation Bangalore",
      "Smart Lock Installation Bangalore",
      "Alexa Home Automation Bangalore",
      "Smart Switches Bangalore",
    ],
  },
  "website-development": {
    title: "Custom Website Development Bangalore | TechBes",
    description:
      "Launch fast, responsive business websites, custom React/NextJS apps, and CMS setups with SEO standards in Bangalore.",
    keywords: [
      "Website Development Bangalore",
      "Web Design Bangalore",
      "NextJS Developer Bangalore",
      "E-commerce Website Bangalore",
    ],
  },
  "software-licensing": {
    title: "Enterprise Software Licensing & Cloud Bangalore | TechBes",
    description:
      "Legitimate commercial licenses for Microsoft 365, Windows OS, commercial Antivirus, and cloud tenant configurations in Bangalore.",
    keywords: [
      "Software Licensing Bangalore",
      "Microsoft 365 Subscription Bangalore",
      "Windows 11 Pro License Bangalore",
      "Office 365 Setup Bangalore",
    ],
  },
};

/**
 * Returns dynamic title, description, and keywords based on service slug
 */
export function getServiceSeo(slug: string, dynamicData?: { name?: string; description?: string }): {
  title: string;
  description: string;
  keywords: string[];
} {
  const config = SERVICES_SEO_CONFIG[slug];
  if (config) return config;

  // Fallback generation for categories or other dynamic services
  const name = dynamicData?.name || slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const desc = dynamicData?.description || `Professional ${name} services in Bangalore. Verified technicians, transparent pricing, and same-day booking.`;

  return {
    title: `${name} Services in Bangalore | TechBes`,
    description: desc,
    keywords: [
      `${name} Bangalore`,
      `${name} Service Bangalore`,
      `Verified ${name} Bangalore`,
      `TechBes ${name}`,
    ],
  };
}
