import { 
  Camera, 
  Network, 
  ShieldCheck, 
  Cpu, 
  FileCheck, 
  Flame,
  Laptop,
  Monitor,
  Server,
  Home,
  Globe,
  Key,
  LucideIcon
} from "lucide-react";

export interface Category {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  services: string;
  slug: string;
}

export interface Service {
  id: number;
  title: string;
  slug: string;
  categoryId: string;
  category: string;
  rating: number;
  reviews: string;
  duration: string;
  price: string;
  priceValue: number;
  image: string;
  badge: string | null;
  description: string;
  features: string[];
  includes: string[];
}

export const categories: Category[] = [
  {
    id: "cctv",
    title: "CCTV",
    description: "HD cameras, NVR setup, remote monitoring",
    icon: Camera,
    color: "bg-blue-50 text-blue-600",
    services: "12+ services",
    slug: "cctv",
  },
  {
    id: "networking",
    title: "Networking",
    description: "LAN, WiFi, structured cabling",
    icon: Network,
    color: "bg-teal-50 text-teal-600",
    services: "8+ services",
    slug: "networking",
  },
  {
    id: "laptop",
    title: "Laptop",
    description: "Motherboard, screen, battery fixes",
    icon: Laptop,
    color: "bg-sky-50 text-sky-600",
    services: "10+ services",
    slug: "laptop",
  },
  {
    id: "desktop",
    title: "Desktop",
    description: "PC diagnostics, custom builds, upgrades",
    icon: Monitor,
    color: "bg-indigo-50 text-indigo-600",
    services: "8+ services",
    slug: "desktop",
  },
  {
    id: "server",
    title: "Server",
    description: "Server setups, active directory, virtualization",
    icon: Server,
    color: "bg-purple-50 text-purple-600",
    services: "6+ services",
    slug: "server",
  },
  {
    id: "electronic-contracts",
    title: "Electronic Contracts",
    description: "Annual maintenance, priority IT support",
    icon: FileCheck,
    color: "bg-orange-50 text-orange-600",
    services: "5+ plans",
    slug: "electronic-contracts",
  },
  {
    id: "home-automation",
    title: "Home Automation",
    description: "Smart locks, automation scene links",
    icon: Home,
    color: "bg-rose-50 text-rose-600",
    services: "7+ services",
    slug: "home-automation",
  },
  {
    id: "website-development",
    title: "Website Development",
    description: "Custom UI, React pages, API links",
    icon: Globe,
    color: "bg-blue-50 text-blue-700",
    services: "6+ services",
    slug: "website-development",
  },
  {
    id: "software-licensing",
    title: "Software Licensing",
    description: "M365, OS upgrades, database activation",
    icon: Key,
    color: "bg-amber-50 text-amber-600",
    services: "4+ services",
    slug: "software-licensing",
  },
  {
    id: "cyber-security",
    title: "Cyber Security",
    description: "Firewall, antivirus, threat mitigation",
    icon: ShieldCheck,
    color: "bg-emerald-50 text-emerald-600",
    services: "10+ services",
    slug: "cyber-security",
  },
];

export const services: Service[] = [
  {
    id: 1,
    title: "4-Channel CCTV Setup",
    slug: "4-channel-cctv-setup",
    categoryId: "cctv",
    category: "CCTV",
    rating: 4.9,
    reviews: "2.3K",
    duration: "2-3 hrs",
    price: "Starting ₹8,999",
    priceValue: 8999,
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&h=300&fit=crop",
    badge: "Most Booked",
    description: "Professional 4-channel CCTV installation with HD cameras, NVR setup, and mobile app configuration for remote monitoring.",
    features: [
      "4 HD IP cameras (2MP/4MP)",
      "4-Channel NVR with 1TB HDD",
      "Mobile app setup for remote viewing",
      "Night vision capability",
      "Motion detection alerts",
    ],
    includes: [
      "Free site survey",
      "Professional installation",
      "Cable concealing",
      "30-day warranty on service",
    ],
  },
  {
    id: 2,
    title: "8-Channel CCTV Setup",
    slug: "8-channel-cctv-setup",
    categoryId: "cctv",
    category: "CCTV",
    rating: 4.8,
    reviews: "1.5K",
    duration: "4-5 hrs",
    price: "Starting ₹15,999",
    priceValue: 15999,
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&h=300&fit=crop",
    badge: null,
    description: "Complete 8-channel surveillance system ideal for medium-sized offices and retail stores.",
    features: [
      "8 HD IP cameras (2MP/4MP)",
      "8-Channel NVR with 2TB HDD",
      "Mobile & desktop app setup",
      "Wide-angle coverage",
      "24/7 recording capability",
    ],
    includes: [
      "Free site survey",
      "Professional installation",
      "Cable management",
      "60-day warranty on service",
    ],
  },
  {
    id: 3,
    title: "Office Network Setup",
    slug: "office-network-setup",
    categoryId: "networking",
    category: "Networking",
    rating: 4.8,
    reviews: "1.8K",
    duration: "4-6 hrs",
    price: "Starting ₹5,499",
    priceValue: 5499,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",
    badge: null,
    description: "Complete office network infrastructure setup including structured cabling, switches, and wireless access points.",
    features: [
      "Structured cabling (Cat6/Cat6A)",
      "Managed network switch setup",
      "Wireless access point installation",
      "Network security configuration",
      "Speed optimization",
    ],
    includes: [
      "Network design consultation",
      "All cabling and termination",
      "Testing and certification",
      "Network diagram documentation",
    ],
  },
  {
    id: 4,
    title: "WiFi Network Installation",
    slug: "wifi-network-installation",
    categoryId: "networking",
    category: "Networking",
    rating: 4.7,
    reviews: "980",
    duration: "2-3 hrs",
    price: "Starting ₹3,499",
    priceValue: 3499,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",
    badge: "Quick Service",
    description: "Professional WiFi network setup with optimal placement for maximum coverage and speed.",
    features: [
      "Site survey for optimal placement",
      "Router/Access point configuration",
      "WiFi security setup (WPA3)",
      "Guest network configuration",
      "Speed testing & optimization",
    ],
    includes: [
      "Coverage analysis",
      "Device connection assistance",
      "Password management setup",
      "14-day support",
    ],
  },
  {
    id: 5,
    title: "Firewall Configuration",
    slug: "firewall-configuration",
    categoryId: "cyber-security",
    category: "Cyber Security",
    rating: 4.9,
    reviews: "890",
    duration: "2-4 hrs",
    price: "Starting ₹12,999",
    priceValue: 12999,
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop",
    badge: "Top Rated",
    description: "Enterprise-grade firewall setup and configuration to protect your network from cyber threats.",
    features: [
      "Hardware/Software firewall setup",
      "Intrusion detection system",
      "VPN configuration",
      "Traffic monitoring rules",
      "Threat protection policies",
    ],
    includes: [
      "Security audit",
      "Rule configuration",
      "Testing and validation",
      "Admin training session",
    ],
  },
  {
    id: 6,
    title: "Endpoint Security Setup",
    slug: "endpoint-security-setup",
    categoryId: "cyber-security",
    category: "Cyber Security",
    rating: 4.8,
    reviews: "720",
    duration: "1-2 hrs per device",
    price: "Starting ₹999/device",
    priceValue: 999,
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop",
    badge: null,
    description: "Comprehensive endpoint protection for all your devices with enterprise antivirus and malware protection.",
    features: [
      "Enterprise antivirus installation",
      "Malware protection",
      "Real-time threat monitoring",
      "Automatic updates configuration",
      "Email security setup",
    ],
    includes: [
      "Device assessment",
      "Software installation",
      "Policy configuration",
      "User training",
    ],
  },
  {
    id: 8,
    title: "Annual IT Support",
    slug: "annual-it-support",
    categoryId: "electronic-contracts",
    category: "Electronic Contracts",
    rating: 4.8,
    reviews: "3.2K",
    duration: "Yearly",
    price: "Starting ₹18,999/yr",
    priceValue: 18999,
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop",
    badge: "Best Value",
    description: "Comprehensive annual maintenance contract for all your IT infrastructure with priority support.",
    features: [
      "Unlimited remote support",
      "Quarterly on-site visits",
      "Hardware health monitoring",
      "Software updates & patches",
      "Priority response time",
    ],
    includes: [
      "24/7 helpdesk access",
      "Preventive maintenance",
      "Incident management",
      "Monthly reports",
    ],
  },
  {
    id: 10,
    title: "Laptop Repair & Service",
    slug: "laptop-repair",
    categoryId: "laptop",
    category: "Laptop",
    rating: 4.7,
    reviews: "2.1K",
    duration: "1-2 hrs",
    price: "Starting ₹499",
    priceValue: 499,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop",
    badge: "Quick Fix",
    description: "On-site troubleshooting, diagnostic testing, and hardware repair for laptops of all major brands.",
    features: [
      "Screen and keyboard repairs",
      "Battery diagnostics and swaps",
      "Motherboard component repair",
      "Software cleanup & virus scan",
    ],
    includes: [
      "Free initial analysis",
      "Transparent diagnostics",
      "Genuine spare parts",
      "30-day workmanship warranty",
    ],
  },
  {
    id: 11,
    title: "Desktop Repair & Upgrades",
    slug: "desktop-repair",
    categoryId: "desktop",
    category: "Desktop",
    rating: 4.8,
    reviews: "1.6K",
    duration: "1-3 hrs",
    price: "Starting ₹599",
    priceValue: 599,
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&h=300&fit=crop",
    badge: "PC Expert",
    description: "On-site desktop diagnosis, component replacements, SMPS/RAM/SSD upgrades, and custom PC configurations.",
    features: [
      "Diagnostic board level checks",
      "SMPS power supply replacements",
      "High-speed SSD/RAM configuration",
      "BIOS tuning and stabilization",
    ],
    includes: [
      "Detailed diagnosis review",
      "Hardware dust cleanout",
      "Performance testing",
      "90-day hardware warranty",
    ],
  },
  {
    id: 12,
    title: "Enterprise Server Setup",
    slug: "server-setup",
    categoryId: "server",
    category: "Server",
    rating: 4.9,
    reviews: "310",
    duration: "4-8 hrs",
    price: "Starting ₹8,999",
    priceValue: 8999,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",
    badge: "Enterprise",
    description: "Server hardware configuration, Active Directory setup, virtualization routing, and automated network backup rules.",
    features: [
      "Rack deployment and wiring",
      "Hypervisor (ESXi/Hyper-V) setup",
      "Active Directory & DNS configuration",
      "Cloud backup integrations",
    ],
    includes: [
      "Server system documentation",
      "Network policies review",
      "Credentials handover document",
      "14-day technical support",
    ],
  },
  {
    id: 13,
    title: "Smart Home Automation Setup",
    slug: "home-automation",
    categoryId: "home-automation",
    category: "Home Automation",
    rating: 4.8,
    reviews: "420",
    duration: "2-4 hrs",
    price: "Starting ₹2,499",
    priceValue: 2499,
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop",
    badge: "Trending",
    description: "Wired and wireless smart locks, automated smart switch wiring, and Alexa/Google Home voice linkage.",
    features: [
      "Smart switchboard controller installation",
      "Assistant dashboard scene pairing",
      "Motion detector triggers configuration",
      "Remote gateway integrations",
    ],
    includes: [
      "Home Wi-Fi analysis",
      "Custom scenes creation",
      "Family dashboard configuration",
      "User settings handover",
    ],
  },
  {
    id: 14,
    title: "Custom Website Development",
    slug: "website-development",
    categoryId: "website-development",
    category: "Website Development",
    rating: 4.9,
    reviews: "190",
    duration: "7-14 days",
    price: "Starting ₹14,999",
    priceValue: 14999,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    badge: "Web Special",
    description: "Responsive layouts, landing page assets, custom business portfolios, React frameworks, and database linkage.",
    features: [
      "Fully responsive CSS design layout",
      "Lightning page loading optimization",
      "SEO best practices configured",
      "Lead connection pipelines setup",
    ],
    includes: [
      "Domain configuration",
      "SSL certificate registration",
      "Tailored admin dashboard",
      "30-day bug support window",
    ],
  },
  {
    id: 15,
    title: "Enterprise Software Licensing",
    slug: "software-licensing",
    categoryId: "software-licensing",
    category: "Software Licensing",
    rating: 4.8,
    reviews: "380",
    duration: "1-2 hrs",
    price: "Starting ₹1,499",
    priceValue: 1499,
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=300&fit=crop",
    badge: "Certified Partner",
    description: "Microsoft 365, Windows OS license purchases, Antivirus dashboard setups, and compliance checks.",
    features: [
      "Tenant admin configurations",
      "Windows Pro license activations",
      "Domain linkages validation",
      "Commercial software audits",
    ],
    includes: [
      "Microsoft Portal setups",
      "MFA security parameters configuration",
      "License key active confirmation",
      "Admin basic training",
    ],
  },
];

export function getServicesByCategory(categorySlug: string): Service[] {
  const category = categories.find(c => c.slug === categorySlug);
  if (!category) return [];
  return services.filter(s => s.categoryId === category.id);
}

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find(s => s.slug === slug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}

export function getAllServices(): Service[] {
  return services;
}
