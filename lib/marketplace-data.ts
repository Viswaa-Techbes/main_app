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
  Laptop,
  Monitor,
  FileCheck,
  Home,
  Globe,
  Key,
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
    title: "CCTV",
    description: "Smart surveillance, remote monitoring, and office security.",
    servicesLabel: "20 services",
    icon: Camera,
    gradient: "from-cyan-500 via-sky-500 to-blue-600",
  },
  {
    id: "networking",
    title: "Networking",
    description: "Wi-Fi, structured cabling, routers, and enterprise rollout.",
    servicesLabel: "9 services",
    icon: Network,
    gradient: "from-emerald-500 via-teal-500 to-cyan-600",
  },
  {
    id: "laptop",
    title: "Laptop",
    description: "Laptop screen, keyboard, battery, motherboard, and OS fixes.",
    servicesLabel: "10 services",
    icon: Laptop,
    gradient: "from-teal-500 via-emerald-500 to-lime-500",
  },
  {
    id: "desktop",
    title: "Desktop",
    description: "Desktop repairs, custom builds, upgrades, and diagnosis.",
    servicesLabel: "8 services",
    icon: Monitor,
    gradient: "from-sky-500 via-blue-500 to-indigo-600",
  },
  {
    id: "server",
    title: "Server",
    description: "Enterprise rack deployment, AD/DNS, virtualization, and backups.",
    servicesLabel: "6 services",
    icon: Server,
    gradient: "from-indigo-500 via-purple-500 to-pink-600",
  },
  {
    id: "electronic-contracts",
    title: "Electronic Contracts",
    description: "Annual preventive maintenance contracts for business IT.",
    servicesLabel: "5 plans",
    icon: FileCheck,
    gradient: "from-orange-500 via-amber-500 to-rose-500",
  },
  {
    id: "home-automation",
    title: "Home Automation",
    description: "Smart door locks, lighting control, sensors, and voice assist.",
    servicesLabel: "7 services",
    icon: Home,
    gradient: "from-rose-500 via-pink-500 to-red-600",
  },
  {
    id: "website-development",
    title: "Website Development",
    description: "Custom web applications, landing pages, and API integrations.",
    servicesLabel: "6 services",
    icon: Globe,
    gradient: "from-blue-600 via-indigo-600 to-violet-700",
  },
  {
    id: "software-licensing",
    title: "Software Licensing",
    description: "Enterprise OS, productivity suites, databases, and Antivirus activation.",
    servicesLabel: "4 services",
    icon: Key,
    gradient: "from-amber-500 via-orange-500 to-yellow-600",
  },
  {
    id: "cyber-security",
    title: "Cyber Security",
    description: "Firewalls, audits, endpoint security, and threat hardening.",
    servicesLabel: "8 services",
    icon: ShieldCheck,
    gradient: "from-slate-700 via-blue-700 to-cyan-600",
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
    category: "CCTV",
    tagline: "Configurable CCTV service with step-by-step booking and material selection.",
    description:
      "CCTV Installation includes site review, camera placement, installation, cabling, recorder setup, and handover testing. Configure camera type, materials, and schedule in the booking flow.",
    price: "From Rs. 499",
    priceValue: 499,
    rating: 4.8,
    reviewCount: 2400,
    duration: "2-6 hrs",
    durationMinutes: 360,
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1200&h=900&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1528319725582-ddc096101511?w=1200&h=900&fit=crop",
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
    categoryId: "networking",
    category: "Networking",
    tagline: "Secure LAN, Wi-Fi planning, switching, and structured cabling.",
    description:
      "A full network deployment for growing teams with router configuration, switch setup, Wi-Fi planning, VLAN design, and performance checks for stable office connectivity.",
    price: "From Rs. 5,499",
    priceValue: 5499,
    rating: 4.8,
    reviewCount: 1820,
    duration: "4-6 hrs",
    durationMinutes: 360,
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&h=900&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=900&fit=crop",
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
    categoryId: "cyber-security",
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
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=900&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1200&h=900&fit=crop",
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
    categoryId: "electronic-contracts",
    category: "Electronic Contracts",
    tagline: "Annual preventive maintenance with priority IT support.",
    description:
      "Keep your business IT healthy year-round with preventive visits, device audits, remote support, and incident response coverage designed for small and mid-sized teams.",
    price: "From Rs. 18,999 / year",
    priceValue: 18999,
    rating: 4.8,
    reviewCount: 3210,
    duration: "Yearly plan",
    durationMinutes: 0,
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=900&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=900&fit=crop",
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
    slug: "laptop-repair",
    title: "Laptop Repair & Service",
    categoryId: "laptop",
    category: "Laptop",
    tagline: "Laptop diagnosis, hardware fix, screen change, and tune-ups.",
    description:
      "Expert on-site troubleshooting and component repair for all major laptop brands. Covers screen replacement, keyboard repair, battery installation, and motherboard diagnostics.",
    price: "From Rs. 499",
    priceValue: 499,
    rating: 4.7,
    reviewCount: 2150,
    duration: "1-2 hrs",
    durationMinutes: 120,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1200&h=900&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=900&fit=crop",
    ],
    badge: "Quick Service",
    features: [
      "Screen, battery, and keyboard replacements",
      "Motherboard level chip diagnostics",
      "OS formatting, tune-ups, and malware removal",
      "Full clean-up and thermal paste replacement",
    ],
    includes: [
      "Basic diagnostic testing",
      "Transparent spare parts pricing",
      "Clean execution on-site",
      "30-day post-repair support",
    ],
    steps: [
      "Describe laptop issues and book your technician slot.",
      "Technician diagnoses device issues on-site.",
      "Confirm spare part estimates and service execution.",
      "Verify laptop health and complete payment.",
    ],
    faqs: defaultFaqs,
    reviews: reviewSet("Laptop Repair"),
    recommendedFor: ["Professionals", "Students", "Remote Teams"],
    timeSlots: ["09:30 AM", "11:30 AM", "02:30 PM", "05:00 PM"],
    configurableType: "cctv",
  },
  {
    id: 61,
    slug: "desktop-repair",
    title: "Desktop Repair & Upgrades",
    categoryId: "desktop",
    category: "Desktop",
    tagline: "Desktop PC diagnosis, SMPS/RAM/SSD upgrades, and custom builds.",
    description:
      "Comprehensive desktop computer diagnostics, processor cooling fixes, hardware replacements, and custom PC builds tailored for offices or gaming setup.",
    price: "From Rs. 599",
    priceValue: 599,
    rating: 4.8,
    reviewCount: 1640,
    duration: "1-3 hrs",
    durationMinutes: 180,
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=1200&h=900&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=1200&h=900&fit=crop",
    ],
    badge: "Hardware Expert",
    features: [
      "Diagnostic checks on power supply (SMPS) and board",
      "High-speed SSD and RAM installation",
      "Custom PC part assembly and cable management",
      "System stabilization and BIOS configuration",
    ],
    includes: [
      "Detailed diagnosis report",
      "Dust cleanout and fan check",
      "Performance benchmarking",
      "Warranty on replaced parts",
    ],
    steps: [
      "Detail your computer issue or upgrade requirements.",
      "Technician inspects connections, PSU, and RAM stability.",
      "Required parts are upgraded or repaired.",
      "Benchmarking tests ensure peak system operation.",
    ],
    faqs: defaultFaqs,
    reviews: reviewSet("Desktop Repair"),
    recommendedFor: ["Gamers", "Designers", "Developer Workstations"],
    timeSlots: ["10:00 AM", "01:00 PM", "03:30 PM", "06:00 PM"],
    configurableType: "cctv",
  },
  {
    id: 62,
    slug: "server-setup",
    title: "Enterprise Server Setup",
    categoryId: "server",
    category: "Server",
    tagline: "Server rack deployment, AD/DNS, virtualization, and backups.",
    description:
      "Enterprise-grade server hardware installation, operating system setups (Windows Server, Linux), active directory installation, virtualization configurations, and secure backup systems.",
    price: "From Rs. 8,999",
    priceValue: 8999,
    rating: 4.9,
    reviewCount: 310,
    duration: "4-8 hrs",
    durationMinutes: 480,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=900&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=900&fit=crop",
    ],
    badge: "Enterprise",
    features: [
      "Rack mounting and server node installation",
      "Hypervisor (VMware ESXi, Hyper-V) configuration",
      "Domain controller (AD/DNS) domain controller setups",
      "Automated offsite backup policies",
    ],
    includes: [
      "Server system documentation",
      "Network credentials configuration",
      "Security access profiles setup",
      "14 days post-install engineering support",
    ],
    steps: [
      "Submit server specifications and environment requirements.",
      "We design network integration and software policies.",
      "Technician mounts servers and initiates configuration.",
      "Validation checks confirm backup and security protocols.",
    ],
    faqs: defaultFaqs,
    reviews: reviewSet("Server Setup"),
    recommendedFor: ["Offices", "Clinics", "Retail Databases"],
    timeSlots: ["09:00 AM", "02:00 PM"],
    configurableType: "cctv",
  },
  {
    id: 63,
    slug: "home-automation",
    title: "Smart Home Automation Setup",
    categoryId: "home-automation",
    category: "Home Automation",
    tagline: "Smart locks, automated lighting, voice integration, and sensors.",
    description:
      "Complete smart home automation configuration. Setup Wi-Fi door locks, smart switches, voice assistants (Alexa, Google Home), motion sensors, and remote hub triggers.",
    price: "From Rs. 2,499",
    priceValue: 2499,
    rating: 4.8,
    reviewCount: 420,
    duration: "2-4 hrs",
    durationMinutes: 240,
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=1200&h=900&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=1200&h=900&fit=crop",
    ],
    badge: "Trending",
    features: [
      "Smart switch controller board wiring",
      "Alexa and Google Assistant voice pairing",
      "App dashboard and automation scene programming",
      "Remote lock and security camera linkage",
    ],
    includes: [
      "Home Wi-Fi range analysis",
      "Device control settings setup",
      "Scene automation scheduling",
      "Family access credentials handover",
    ],
    steps: [
      "Choose automation services and preferred schedule.",
      "We test Wi-Fi strength and smart device compatibility.",
      "Devices are mounted, wired, and connected to the network.",
      "Complete assistant integration and testing.",
    ],
    faqs: defaultFaqs,
    reviews: reviewSet("Home Automation"),
    recommendedFor: ["Apartments", "Villas", "Modern Offices"],
    timeSlots: ["10:30 AM", "01:30 PM", "04:30 PM"],
    configurableType: "cctv",
  },
  {
    id: 64,
    slug: "website-development",
    title: "Custom Website Development",
    categoryId: "website-development",
    category: "Website Development",
    tagline: "Responsive sites, landing pages, custom portfolios, and APIs.",
    description:
      "Get a fast, secure, modern website built to your exact business specifications. Includes search engine optimization, content integration, and contact forms.",
    price: "From Rs. 14,999",
    priceValue: 14999,
    rating: 4.9,
    reviewCount: 190,
    duration: "7-14 days",
    durationMinutes: 7200,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=900&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=900&fit=crop",
    ],
    badge: "Web Special",
    features: [
      "Responsive layout for mobile and desktop screens",
      "Next.js / React lightning fast page loading",
      "SEO semantic structures and clean navigation",
      "Database schema and contact lead pipelines",
    ],
    includes: [
      "Domain and server mapping support",
      "Admin login panel for site management",
      "SSL secure connection setup",
      "30-day post-launch optimization window",
    ],
    steps: [
      "Align on wireframe layouts and content needs.",
      "Deploy frontend code and setup backend functions.",
      "Integrate databases and perform QA check.",
      "Go live with domain connection and SSL configuration.",
    ],
    faqs: defaultFaqs,
    reviews: reviewSet("Website Development"),
    recommendedFor: ["Startups", "Local Businesses", "Portfolios"],
    timeSlots: ["11:00 AM", "04:00 PM"],
    configurableType: "cctv",
  },
  {
    id: 65,
    slug: "software-licensing",
    title: "Enterprise Software Licensing",
    categoryId: "software-licensing",
    category: "Software Licensing",
    tagline: "Microsoft 365, Windows OS, Antivirus, and cloud account setup.",
    description:
      "Procurement, installation, and deployment of valid commercial software license packs. Includes configuration of tenant policies, domain links, and user logins.",
    price: "From Rs. 1,499",
    priceValue: 1499,
    rating: 4.8,
    reviewCount: 380,
    duration: "1-2 hrs",
    durationMinutes: 120,
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1200&h=900&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1200&h=900&fit=crop",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=900&fit=crop",
    ],
    badge: "Certified Partner",
    features: [
      "Microsoft 365 Business Basic / Standard setups",
      "Windows 11 Pro operating system upgrades",
      "Endpoint antivirus central dashboard deployments",
      "Software audits and compliance checking",
    ],
    includes: [
      "Microsoft portal configuration",
      "Multi-factor authentication (MFA) setup",
      "License key activation documentation",
      "Basic admin training",
    ],
    steps: [
      "Select license type and define required user count.",
      "Provide domain address for tenant mapping.",
      "Complete credential creation and policy hardening.",
      "Verification testing of product activation key.",
    ],
    faqs: defaultFaqs,
    reviews: reviewSet("Software Licensing"),
    recommendedFor: ["Corporates", "Small Offices", "Design Agencies"],
    timeSlots: ["09:00 AM", "12:00 PM", "03:00 PM", "05:00 PM"],
    configurableType: "cctv",
  },
  {
    id: 7,
    slug: "rupee-one-test-service",
    title: "₹1 Payment Test Service",
    categoryId: "laptop",
    category: "Laptop",
    tagline: "Test Razorpay integration with exactly ₹1 advance payment.",
    description:
      "This is a dummy service designed to test the end-to-end booking and Razorpay payment flow. The total price is ₹2, which results in a 50% advance payment of exactly ₹1.",
    price: "Rs. 2 (₹1 Advance)",
    priceValue: 2,
    rating: 5.0,
    reviewCount: 1,
    duration: "10 mins",
    durationMinutes: 10,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1200&h=900&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1200&h=900&fit=crop",
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
  "Office Network Deployment",
  "Laptop Repair",
  "Desktop Repair",
  "Managed Firewall Setup",
];

export const popularServiceChips = [
  "CCTV",
  "Networking",
  "Laptop",
  "Desktop",
  "Cyber Security",
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
