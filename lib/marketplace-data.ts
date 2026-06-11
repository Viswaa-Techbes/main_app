import {
  ArrowUpDown,
  Camera,
  Cpu,
  Flame,
  LucideIcon,
  Network,
  ShieldCheck,
  Server,
  Wrench,
} from "lucide-react";

export interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  role: string;
  date: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  servicesLabel: string;
  icon: LucideIcon;
  gradient: string;
}

export interface MarketplaceService {
  id: number;
  slug: string;
  title: string;
  categoryId: string;
  category: string;
  tagline: string;
  description: string;
  price: string;
  priceValue: number;
  rating: number;
  reviewCount: number;
  duration: string;
  durationMinutes: number;
  image: string;
  gallery: string[];
  badge?: string;
  features: string[];
  includes: string[];
  steps: string[];
  faqs: FaqItem[];
  reviews: Review[];
  recommendedFor: string[];
  timeSlots: string[];
  configurableType?: "cctv";
  overview?: string;
  excludedServices?: string[];
  supportedProducts?: string[];
  supportedAddons?: string[];
  supportedSpareParts?: string[];
  managedService?: any;
}

export interface DashboardBooking {
  id: string;
  serviceSlug: string;
  serviceTitle: string;
  status: "Upcoming" | "Completed" | "Cancelled";
  address: string;
  date: string;
  time: string;
  price: string;
}

export interface AddressBookItem {
  id: string;
  label: string;
  address: string;
  isDefault?: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  badge?: string;
}

export const categories: ServiceCategory[] = [
  {
    id: "cctv",
    title: "CCTV Installation",
    description: "Smart surveillance, remote monitoring, and office security.",
    servicesLabel: "20 services",
    icon: Camera,
    gradient: "from-cyan-500 via-sky-500 to-blue-600",
  },
  {
    id: "network",
    title: "Network Setup",
    description: "Wi-Fi, structured cabling, routers, and enterprise rollout.",
    servicesLabel: "9 services",
    icon: Network,
    gradient: "from-emerald-500 via-teal-500 to-cyan-600",
  },
  {
    id: "security",
    title: "Cyber Security",
    description: "Firewalls, audits, endpoint security, and threat hardening.",
    servicesLabel: "8 services",
    icon: ShieldCheck,
    gradient: "from-slate-700 via-blue-700 to-cyan-600",
  },
  {
    id: "hardware",
    title: "Hardware Repair",
    description: "Laptop, desktop, printer, and workplace device support.",
    servicesLabel: "15 services",
    icon: Cpu,
    gradient: "from-teal-500 via-emerald-500 to-lime-500",
  },
  {
    id: "amc",
    title: "AMC Plans",
    description: "Preventive maintenance contracts for teams and branches.",
    servicesLabel: "5 plans",
    icon: Wrench,
    gradient: "from-emerald-500 via-green-500 to-teal-600",
  },
  {
    id: "fire",
    title: "Fire Safety",
    description: "Alarm systems, extinguishers, and compliance visits.",
    servicesLabel: "7 services",
    icon: Flame,
    gradient: "from-orange-500 via-amber-500 to-rose-500",
  },
];

const defaultFaqs: FaqItem[] = [
  {
    question: "Are technicians verified before assignment?",
    answer:
      "Yes. Every partner goes through KYC verification, technical screening, and service quality checks before going live.",
  },
  {
    question: "Can I reschedule after booking?",
    answer:
      "You can reschedule from the booking flow or dashboard up to 2 hours before the slot, subject to availability.",
  },
  {
    question: "Do you provide post-service support?",
    answer:
      "All services include post-service support windows, and selected services include an extended workmanship warranty.",
  },
];

// Single unified CCTV service — individual sub-service names removed.

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function reviewSet(serviceName: string): Review[] {
  return [
    {
      id: 1,
      user: "Rahul S.",
      role: "Office Admin",
      rating: 5,
      comment: `${serviceName} was handled smoothly. The technician arrived on time, explained each step clearly, and cleaned up after the job.`,
      date: "12 Mar 2026",
    },
    {
      id: 2,
      user: "Aisha K.",
      role: "Store Owner",
      rating: 5,
      comment: "Fast booking, transparent pricing, and no surprises during installation. I would book again for our next branch.",
      date: "02 Mar 2026",
    },
    {
      id: 3,
      user: "Vikram P.",
      role: "Facility Manager",
      rating: 4,
      comment: "Good technician and excellent communication from the operations team. The service summary was especially helpful.",
      date: "24 Feb 2026",
    },
  ];
}

export const services: MarketplaceService[] = [
  // Single unified CCTV Installation service (all configurations happen inside this page)
  {
    id: 1000,
    slug: "cctv-installation",
    title: "CCTV Installation",
    categoryId: "cctv",
    category: "CCTV Installation",
    tagline: "Configurable CCTV service with step-by-step booking and material selection.",
    description:
      "CCTV Installation includes site review, camera placement, installation, cabling, recorder setup, and handover testing. Configure camera type, materials, and schedule in the booking flow.",
    price: "From Rs. 499",
    priceValue: 499,
    rating: 4.8,
    reviewCount: 2400,
    duration: "2-6 hrs",
    durationMinutes: 360,
    image: "https://images.unsplash.com/photo-1505691723518-36a9a0b5f6b5?w=1200&h=900&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1505691723518-36a9a0b5f6b5?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200&h=900&fit=crop",
    ],
    badge: "Configurable",
    features: [
      "Single unified booking flow for all CCTV types",
      "Material selection with per-meter pricing",
      "Live price calculation",
      "Add to cart or continue to checkout",
    ],
    includes: [
      "Site inspection and placement guidance",
      "Camera mounting and alignment",
      "Basic DVR/NVR or mobile viewing setup",
      "Workmanship warranty",
    ],
    overview:
      "Unified CCTV Installation service. Use the booking flow to pick the service type, required materials, location, schedule, and add notes. All pricing is computed live.",
    excludedServices: ["Third-party device warranty", "Structural modifications"],
    supportedProducts: ["Dome Camera", "Bullet Camera", "PTZ Camera", "DVR", "NVR", "Hard Disk", "SMPS"],
    supportedAddons: ["Connector Set", "PVC Casing", "Junction Box", "PoE Switch"],
    supportedSpareParts: ["Connector Kit", "Power Adapter", "SMPS", "Hard Disk"],
    steps: [
      "Select service type and camera model",
      "Choose required materials and quantities",
      "Provide location",
      "Pick preferred date and time",
      "Add any special notes",
    ],
    faqs: defaultFaqs,
    reviews: reviewSet("CCTV Installation"),
    recommendedFor: ["Homes", "Offices", "Retail shops", "Apartments", "Warehouses"],
    timeSlots: ["09:00", "11:30", "14:00", "16:30"],
    configurableType: "cctv",
  },
  {
    id: 2,
    slug: "office-network-deployment",
    title: "Office Network Deployment",
    categoryId: "network",
    category: "Network Setup",
    tagline: "Secure LAN, Wi-Fi planning, switching, and structured cabling.",
    description:
      "A full network deployment for growing teams with router configuration, switch setup, Wi-Fi planning, VLAN design, and performance checks for stable office connectivity.",
    price: "From Rs. 5,499",
    priceValue: 5499,
    rating: 4.8,
    reviewCount: 1820,
    duration: "4-6 hrs",
    durationMinutes: 360,
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&h=900&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=900&fit=crop",
    ],
    badge: "Business Favorite",
    features: [
      "Structured cabling audit and deployment plan",
      "Router, firewall, and switch configuration",
      "Access point placement and guest Wi-Fi setup",
      "Speed and stability validation after install",
    ],
    includes: [
      "Coverage assessment",
      "Basic network documentation",
      "Secure password handover",
      "14-day support window",
    ],
    steps: [
      "Choose your office size and preferred service date.",
      "Technician audits the current setup and scope.",
      "Network hardware and cabling are configured on-site.",
      "Team receives credentials and connection walkthrough.",
    ],
    faqs: defaultFaqs,
    reviews: reviewSet("Office Network Deployment"),
    recommendedFor: ["Coworking spaces", "Studios", "Branch offices"],
    timeSlots: ["10:00 AM", "12:30 PM", "03:00 PM", "05:00 PM"],
    configurableType: "cctv",
  },
  {
    id: 3,
    slug: "managed-firewall-setup",
    title: "Managed Firewall Setup",
    categoryId: "security",
    category: "Cyber Security",
    tagline: "Threat prevention, access rules, VPN, and policy hardening.",
    description:
      "Protect your business network with a professionally configured firewall, segmented access policies, VPN setup, and baseline security hardening.",
    price: "From Rs. 12,999",
    priceValue: 12999,
    rating: 4.9,
    reviewCount: 894,
    duration: "3-5 hrs",
    durationMinutes: 300,
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=900&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=900&fit=crop",
    ],
    badge: "Top Rated",
    features: [
      "Access control rules and segmentation",
      "VPN and secure remote access setup",
      "Threat prevention baseline hardening",
      "Traffic and alert policy configuration",
    ],
    includes: [
      "Security checklist review",
      "Rule set documentation",
      "Validation testing",
      "Admin handover session",
    ],
    steps: [
      "Tell us your network size and current firewall brand.",
      "We validate scope and recommend configuration approach.",
      "Firewall rules, VPN, and segmentation are implemented.",
      "You receive a hardened baseline and support guidance.",
    ],
    faqs: defaultFaqs,
    reviews: reviewSet("Managed Firewall Setup"),
    recommendedFor: ["SMBs", "Warehouses", "Multi-branch teams"],
    timeSlots: ["09:30 AM", "01:00 PM", "03:30 PM"],
    configurableType: "cctv",
  },
  {
    id: 5,
    slug: "business-amc-plan",
    title: "Business AMC Plan",
    categoryId: "amc",
    category: "AMC Plans",
    tagline: "Annual preventive maintenance with priority IT support.",
    description:
      "Keep your business IT healthy year-round with preventive visits, device audits, remote support, and incident response coverage designed for small and mid-sized teams.",
    price: "From Rs. 18,999 / year",
    priceValue: 18999,
    rating: 4.8,
    reviewCount: 3210,
    duration: "Yearly plan",
    durationMinutes: 0,
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=900&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&h=900&fit=crop",
    ],
    badge: "Best Value",
    features: [
      "Quarterly preventive maintenance visits",
      "Unlimited remote support tickets",
      "Device health and performance checks",
      "Priority escalation for downtime events",
    ],
    includes: [
      "Monthly health report",
      "Preventive maintenance checklist",
      "Asset tagging guidance",
      "SLA-oriented support workflow",
    ],
    steps: [
      "Tell us how many devices and sites you manage.",
      "Select the contract type and billing preference.",
      "We onboard your assets and support contacts.",
      "Quarterly visits and remote support begin immediately.",
    ],
    faqs: defaultFaqs,
    reviews: reviewSet("Business AMC Plan"),
    recommendedFor: ["SMBs", "Schools", "Clinics"],
    timeSlots: ["10:00 AM", "01:30 PM", "04:00 PM"],
    configurableType: "cctv",
  },
  {
    id: 6,
    slug: "laptop-desktop-repair",
    title: "Laptop & Desktop Repair",
    categoryId: "hardware",
    category: "Hardware Repair",
    tagline: "Diagnosis, part replacement, OS fixes, and tune-ups.",
    description:
      "On-site repair and maintenance for workstations, laptops, printers, and office devices with clear diagnosis, service estimates, and performance optimization.",
    price: "From Rs. 499",
    priceValue: 499,
    rating: 4.6,
    reviewCount: 4510,
    duration: "1-3 hrs",
    durationMinutes: 180,
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=900&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&h=900&fit=crop",
    ],
    badge: "Quick Fix",
    features: [
      "Issue diagnosis and resolution guidance",
      "RAM, SSD, and peripheral replacement support",
      "OS repair, software cleanup, and tune-up",
      "Device health report after completion",
    ],
    includes: [
      "Basic troubleshooting",
      "Transparent estimates",
      "Device optimization",
      "Service summary note",
    ],
    steps: [
      "Describe the issue and choose your visit slot.",
      "Technician diagnoses the device and confirms scope.",
      "Repair or optimization is performed on-site.",
      "You receive a quick summary with next-step guidance.",
    ],
    faqs: defaultFaqs,
    reviews: reviewSet("Laptop & Desktop Repair"),
    recommendedFor: ["Remote teams", "Students", "Small offices"],
    timeSlots: ["09:30 AM", "11:00 AM", "02:30 PM", "06:00 PM"],
    configurableType: "cctv",
  },
  {
    id: 7,
    slug: "rupee-one-test-service",
    title: "₹1 Payment Test Service",
    categoryId: "hardware",
    category: "Hardware Repair",
    tagline: "Test Razorpay integration with exactly ₹1 advance payment.",
    description:
      "This is a dummy service designed to test the end-to-end booking and Razorpay payment flow. The total price is ₹2, which results in a 50% advance payment of exactly ₹1.",
    price: "Rs. 2 (₹1 Advance)",
    priceValue: 2,
    rating: 5.0,
    reviewCount: 1,
    duration: "10 mins",
    durationMinutes: 10,
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=900&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=900&fit=crop",
    ],
    badge: "Testing Only",
    features: [
      "End-to-end integration test",
      "Razorpay payment of exactly ₹1",
      "Real-time database recording",
      "Technician notification simulation",
    ],
    includes: [
      "Full test flow verification",
      "Zero impact on real operations",
    ],
    steps: [
      "Select this service.",
      "Proceed to book and select address & time.",
      "Complete the payment of ₹1 through Razorpay.",
      "Check the Booking in Dashboard.",
    ],
    faqs: defaultFaqs,
    reviews: reviewSet("₹1 Payment Test Service"),
    recommendedFor: ["Developers", "Admins", "QA Team"],
    timeSlots: ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"],
    configurableType: "cctv",
  },
];

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "starter",
    name: "Starter AMC",
    price: "Rs. 14,999 / year",
    description: "For teams up to 15 devices that need preventive care and quick help.",
    features: [
      "2 preventive visits",
      "Remote support on weekdays",
      "Basic inventory tracking",
      "Email service summaries",
    ],
  },
  {
    id: "growth",
    name: "Growth AMC",
    price: "Rs. 29,999 / year",
    description: "Best for growing offices with mixed hardware, networking, and support needs.",
    badge: "Recommended",
    features: [
      "4 preventive visits",
      "Priority support and escalations",
      "Network health checks",
      "Dedicated account coordinator",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise AMC",
    price: "Custom Quote",
    description: "Built for larger teams, branches, and critical operations requiring SLAs.",
    features: [
      "Multi-site onboarding",
      "Custom SLA support plan",
      "Asset lifecycle reporting",
      "Quarterly review meetings",
    ],
  },
];

export const dashboardBookings: DashboardBooking[] = [];

export const savedAddresses: AddressBookItem[] = [
  {
    id: "addr-1",
    label: "Head Office",
    address: "14th Floor, Tech Park, Indiranagar, Bengaluru",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Warehouse",
    address: "Plot 22, Outer Ring Road, Hosur",
  },
];

export const heroSuggestions = [
  "CCTV Installation",
  "Firewall Setup",
  "AMC for Office IT",
  "Wi-Fi Optimization",
  "Laptop Repair",
];

export const popularServiceChips = [
  "CCTV Installation",
  "Network Setup",
  "AMC Plans",
  "Firewall Setup",
  "Laptop Repair",
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}

export function getServicesByCategory(categoryId: string) {
  return services.filter((service) => service.categoryId === categoryId);
}

export function getRecommendedServices(serviceId?: number) {
  return services.filter((service) => service.id !== serviceId).slice(0, 3);
}
