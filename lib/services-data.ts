import { 
  Camera, 
  Network, 
  ShieldCheck, 
  Server, 
  Cpu, 
  FileCheck, 
  Flame,
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
    title: "CCTV Installation",
    description: "HD cameras, NVR setup, remote monitoring",
    icon: Camera,
    color: "bg-blue-50 text-blue-600",
    services: "12+ services",
    slug: "cctv-installation",
  },
  {
    id: "network",
    title: "Network Setup",
    description: "LAN, WiFi, structured cabling",
    icon: Network,
    color: "bg-teal-50 text-teal-600",
    services: "8+ services",
    slug: "network-setup",
  },
  {
    id: "security",
    title: "Cyber Security",
    description: "Firewall, antivirus, data protection",
    icon: ShieldCheck,
    color: "bg-emerald-50 text-emerald-600",
    services: "10+ services",
    slug: "cyber-security",
  },
  {
    id: "datacenter",
    title: "Data Center",
    description: "Server room setup, cooling, UPS",
    icon: Server,
    color: "bg-cyan-50 text-cyan-600",
    services: "6+ services",
    slug: "data-center",
  },
  {
    id: "hardware",
    title: "Hardware & Systems",
    description: "PC repair, laptop service, upgrades",
    icon: Cpu,
    color: "bg-sky-50 text-sky-600",
    services: "15+ services",
    slug: "hardware-systems",
  },
  {
    id: "amc",
    title: "AMC Services",
    description: "Annual maintenance, on-site support",
    icon: FileCheck,
    color: "bg-indigo-50 text-indigo-600",
    services: "5+ services",
    slug: "amc-services",
  },
  {
    id: "fire",
    title: "Fire Safety",
    description: "Alarms, extinguishers, compliance",
    icon: Flame,
    color: "bg-orange-50 text-orange-600",
    services: "7+ services",
    slug: "fire-safety",
  },
];

export const services: Service[] = [
  {
    id: 1,
    title: "4-Channel CCTV Setup",
    slug: "4-channel-cctv-setup",
    categoryId: "cctv",
    category: "CCTV Installation",
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
    category: "CCTV Installation",
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
    categoryId: "network",
    category: "Network Setup",
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
    categoryId: "network",
    category: "Network Setup",
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
    categoryId: "security",
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
    categoryId: "security",
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
    id: 7,
    title: "Server Room Setup",
    slug: "server-room-setup",
    categoryId: "datacenter",
    category: "Data Center",
    rating: 4.7,
    reviews: "650",
    duration: "1-2 days",
    price: "Starting ₹25,999",
    priceValue: 25999,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop",
    badge: null,
    description: "Complete server room infrastructure setup including racks, cooling, UPS, and power distribution.",
    features: [
      "Server rack installation",
      "Cooling system setup",
      "UPS & power distribution",
      "Cable management",
      "Environmental monitoring",
    ],
    includes: [
      "Site assessment",
      "Design consultation",
      "Equipment installation",
      "Testing and commissioning",
    ],
  },
  {
    id: 8,
    title: "Annual IT Support",
    slug: "annual-it-support",
    categoryId: "amc",
    category: "AMC Services",
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
    id: 9,
    title: "Fire Alarm Installation",
    slug: "fire-alarm-installation",
    categoryId: "fire",
    category: "Fire Safety",
    rating: 4.9,
    reviews: "1.1K",
    duration: "3-5 hrs",
    price: "Starting ₹7,499",
    priceValue: 7499,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    badge: null,
    description: "Professional fire alarm system installation compliant with safety regulations.",
    features: [
      "Smoke detector installation",
      "Heat detector setup",
      "Control panel configuration",
      "Manual call points",
      "Alarm sounder installation",
    ],
    includes: [
      "Site survey",
      "System design",
      "Installation & testing",
      "Compliance documentation",
    ],
  },
  {
    id: 10,
    title: "Desktop/Laptop Repair",
    slug: "desktop-laptop-repair",
    categoryId: "hardware",
    category: "Hardware & Systems",
    rating: 4.6,
    reviews: "4.5K",
    duration: "1-3 hrs",
    price: "Starting ₹499",
    priceValue: 499,
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop",
    badge: "Most Booked",
    description: "Expert diagnosis and repair services for desktops and laptops of all brands.",
    features: [
      "Hardware diagnostics",
      "Component replacement",
      "OS reinstallation",
      "Data backup & recovery",
      "Performance optimization",
    ],
    includes: [
      "Free diagnosis",
      "Transparent pricing",
      "Genuine parts",
      "90-day warranty",
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
