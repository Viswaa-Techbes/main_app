import {
  Camera,
  Network,
  Laptop,
  Monitor,
  Server,
  Zap,
  Home,
  Globe,
  Key,
  ShieldCheck,
  LucideIcon,
} from "lucide-react";

export interface DemoSubCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  badge?: string;
  popular?: boolean;
  startingPrice?: string;
}

export interface DemoCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  accentBg: string;
  subcategories: DemoSubCategory[];
}

export const DEMO_OFFICE_PHONE = "+91 95911 44949";
export const DEMO_OFFICE_PHONE_RAW = "+919591144949";

export const DEMO_PROMO_SLIDES = [
  {
    id: 1,
    tag: "SMART SECURITY",
    title: "CCTV Installation & Surveillance",
    headline: "Smart 4K Security Cameras & Remote Mobile Access",
    description: "End-to-end installation of Dome, Bullet, and PTZ IP cameras with DVR/NVR configuration and zero-obligation on-site property survey across Bangalore.",
    ctaText: "Explore CCTV Solutions",
    targetCategory: "cctv",
    badge: "Starting from ₹499",
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1200&h=800&fit=crop",
    gradient: "from-blue-900/90 via-slate-900/90 to-black/95",
    highlight: "Free Site Survey Included",
  },
  {
    id: 2,
    tag: "ENTERPRISE NETWORKING",
    title: "Corporate Wi-Fi & Structured Cabling",
    headline: "High-Performance Office Networks & Server Racks",
    description: "Reliable Gigabit networking, Cat6/Fiber cabling, access point meshing, VLAN segregation, and firewall protection for seamless multi-floor connectivity.",
    ctaText: "Request Network Survey",
    targetCategory: "networking",
    badge: "Zero Downtime Guarantee",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&h=800&fit=crop",
    gradient: "from-emerald-950/90 via-slate-900/90 to-black/95",
    highlight: "Gigabit Certified Cabling",
  },
  {
    id: 3,
    tag: "WEB & SOFTWARE",
    title: "Website Design & Web Applications",
    headline: "Modern High-Speed Websites & Custom Web Portals",
    description: "Conversion-focused business websites, e-commerce storefronts, and custom cloud portals built with Next.js, SEO optimization, and mobile-first responsiveness.",
    ctaText: "Explore Web Services",
    targetCategory: "website-development",
    badge: "Free Consultation",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop",
    gradient: "from-indigo-950/90 via-slate-900/90 to-black/95",
    highlight: "100% Custom Architecture",
  },
  {
    id: 4,
    tag: "ZERO-COST CONSULTATION",
    title: "100% Free On-Site Inspection",
    headline: "Book a Certified Engineer for a Free Property Survey",
    description: "Our security and network engineers visit your home, office, or commercial premises in Bangalore, calculate camera sightlines, and provide a transparent quotation.",
    ctaText: "Book Free Site Visit",
    targetCategory: "cctv",
    badge: "No Obligation",
    image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1200&h=800&fit=crop",
    gradient: "from-amber-950/90 via-slate-900/90 to-black/95",
    highlight: "Available All Across Bangalore",
  },
];

export const DEMO_CATEGORIES: DemoCategory[] = [
  {
    id: "cctv",
    name: "CCTV Surveillance",
    slug: "cctv",
    description: "Smart HD/4K surveillance, night-vision cameras, remote mobile monitoring, and recorder setups.",
    icon: Camera,
    color: "#0EA5E9",
    gradient: "from-cyan-500 via-sky-500 to-blue-600",
    accentBg: "bg-sky-500/10 border-sky-500/30 text-sky-400",
    subcategories: [
      { id: "cctv-1", name: "Install New CCTV System", slug: "install-new-cctv", description: "Fresh camera installation for homes, apartments, retail shops, and commercial offices.", popular: true, badge: "Most Popular", startingPrice: "₹499" },
      { id: "cctv-2", name: "Repair Existing CCTV", slug: "repair-existing-cctv", description: "Diagnosis and repair for video loss, blurred cameras, power failures, or cable damage.", startingPrice: "₹349" },
      { id: "cctv-3", name: "Maintenance & Annual AMC", slug: "maintenance-amc", description: "Scheduled quarterly preventive checkups, lens cleaning, DVR health checks, and priority support.", badge: "AMC Plan", startingPrice: "₹1,499/yr" },
      { id: "cctv-4", name: "Upgrade Existing CCTV", slug: "upgrade-existing-cctv", description: "Migrate old analog cameras to high-definition IP or expand storage capacity.", startingPrice: "₹699" },
      { id: "cctv-5", name: "Buy CCTV Products & Accessories", slug: "buy-cctv-products", description: "Hard disks, SMPS power supplies, connectors, junction boxes, and waterproof casings." },
      { id: "cctv-6", name: "Free On-Site Security Survey", slug: "free-site-survey", description: "On-premise camera angle planning, cable path mapping, and itemized quotation drafting.", popular: true, badge: "100% Free" },
      { id: "cctv-7", name: "Wired Camera Installation", slug: "wired-camera-installation", description: "Heavy-duty coaxial/Cat6 wired installation for reliable 24/7 video recording." },
      { id: "cctv-8", name: "Wireless Wi-Fi Camera Setup", slug: "wireless-camera-installation", description: "Quick setup of PTZ 360° WiFi smart cameras with phone app linking." },
      { id: "cctv-9", name: "IP PoE Camera Enterprise Setup", slug: "ip-camera-installation", description: "High-resolution IP surveillance with PoE switches and Network Video Recorders." },
      { id: "cctv-10", name: "DVR / NVR Recorder Setup & Online View", slug: "dvr-setup", description: "Remote mobile viewing setup, DDNS/P2P cloud pairing, and hard drive formatting." },
    ],
  },
  {
    id: "networking",
    name: "Enterprise Networking",
    slug: "networking",
    description: "Office Wi-Fi, structured cabling, Gigabit switches, router configuration, and network security.",
    icon: Network,
    color: "#10B981",
    gradient: "from-emerald-500 via-teal-500 to-cyan-600",
    accentBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    subcategories: [
      { id: "net-1", name: "New Office Network Setup", slug: "new-network-setup", description: "Complete network blueprint design, router mounting, switch configuration, and wireless APs.", popular: true, badge: "Recommended" },
      { id: "net-2", name: "Wi-Fi & Internet Speed Optimization", slug: "wifi-internet-issues", description: "Eliminate Wi-Fi dead zones, fix intermittent disconnects, and optimize bandwidth." },
      { id: "net-3", name: "Router, Switch & Access Point Setup", slug: "router-modem", description: "Configure commercial grade routers, managed switches, and indoor/outdoor access points." },
      { id: "net-4", name: "Structured Cat6 / Fiber Cabling", slug: "structured-cabling", description: "Neat cable routing, crimping, patch panel punching, and wall faceplate terminations.", popular: true },
      { id: "net-5", name: "Network Security & Firewall Rules", slug: "network-security", description: "Corporate firewall deployment, guest network isolation, and content filtering." },
      { id: "net-6", name: "Server & NAS Storage Integration", slug: "server-storage", description: "Centralized file sharing servers, Network Attached Storage (NAS), and local backup." },
      { id: "net-7", name: "Network AMC & IT Support Contract", slug: "network-amc", description: "Dedicated IT engineers on call, routine maintenance, and guaranteed SLA response times.", badge: "Contract" },
      { id: "net-8", name: "Free Network Site Audit", slug: "network-survey", description: "On-site assessment of current infrastructure, cabling bottlenecks, and quote estimate.", badge: "100% Free" },
    ],
  },
  {
    id: "laptop",
    name: "Laptop Services",
    slug: "laptop",
    description: "Laptop screen replacement, motherboard repairs, SSD speed upgrades, and deep cleaning.",
    icon: Laptop,
    color: "#8B5CF6",
    gradient: "from-violet-500 via-purple-500 to-indigo-600",
    accentBg: "bg-violet-500/10 border-violet-500/30 text-violet-400",
    subcategories: [
      { id: "lap-1", name: "Laptop Hardware & Screen Repair", slug: "laptop-repair", description: "Cracked screen replacement, keyboard repair, hinge fixing, and charging port issues.", popular: true },
      { id: "lap-2", name: "RAM & NVMe SSD Speed Upgrade", slug: "laptop-upgrade", description: "Make sluggish laptops 5x faster with original high-speed SSDs and dual-channel RAM.", badge: "Fast" },
      { id: "lap-3", name: "Deep Thermal Cleaning & Service", slug: "laptop-service", description: "Internal blower cleaning, cooling fan servicing, and premium thermal paste application." },
      { id: "lap-4", name: "OS Installation & Driver Fixes", slug: "laptop-software", description: "Clean Windows/macOS installations, driver updates, and blue-screen crash resolutions." },
      { id: "lap-5", name: "Secure Data Recovery", slug: "laptop-data-recovery", description: "Recover lost, corrupted, or formatted photos and documents from damaged laptops." },
      { id: "lap-6", name: "Corporate Laptop Rentals", slug: "laptop-rental", description: "Rent commercial laptops (Intel i5/i7) for staff or temporary enterprise projects." },
      { id: "lap-7", name: "Free Issue Diagnosis", slug: "laptop-diagnosis", description: "Zero-cost hardware checkup and honest repair estimation.", badge: "Free" },
    ],
  },
  {
    id: "desktop",
    name: "Desktop & Workstations",
    slug: "desktop",
    description: "Custom PC assembly, SMPS repair, workstation tuning, and enterprise desktop rollouts.",
    icon: Monitor,
    color: "#F59E0B",
    gradient: "from-amber-500 via-orange-500 to-red-500",
    accentBg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
    subcategories: [
      { id: "desk-1", name: "Desktop Hardware & SMPS Repair", slug: "desktop-repair", description: "Fix no-display issues, power supply failures, motherboard shorts, and audio ports.", popular: true },
      { id: "desk-2", name: "Custom PC Builds & Gaming Rigs", slug: "custom-pc", description: "Custom component matching, liquid cooling setups, cable management, and stress testing.", badge: "Custom" },
      { id: "desk-3", name: "Hardware Upgrades (RAM, GPU, SSD)", slug: "desktop-upgrade", description: "Add dedicated graphics cards, PCIe SSDs, and power supplies." },
      { id: "desk-4", name: "Desktop Deep Cleaning & Service", slug: "desktop-service", description: "Compressed air de-dusting, fan lubrication, and heatsink re-pasting." },
      { id: "desk-5", name: "Office Desktop Rollout & Domain Join", slug: "business-support", description: "Bulk desktop setup, operating system imaging, and Active Directory domain mapping." },
      { id: "desk-6", name: "Desktop Annual AMC", slug: "desktop-amc", description: "Preventive maintenance and rapid on-site repair contracts for offices." },
    ],
  },
  {
    id: "server",
    name: "Server Infrastructure",
    slug: "server",
    description: "Enterprise rack deployment, VMware / Hyper-V virtualization, AD/DNS, and bare-metal backups.",
    icon: Server,
    color: "#6366F1",
    gradient: "from-indigo-500 via-blue-600 to-violet-600",
    accentBg: "bg-indigo-500/10 border-indigo-500/30 text-indigo-400",
    subcategories: [
      { id: "srv-1", name: "Server Hardware Mount & Setup", slug: "server-installation", description: "1U/2U/4U rack mounting, PDU power hookups, IPMI remote management, and cable routing.", popular: true },
      { id: "srv-2", name: "Active Directory, DNS & Group Policies", slug: "server-config", description: "Windows Server Domain Controller setup, file share permissions, and user policies." },
      { id: "srv-3", name: "VMware ESXi & Proxmox Virtualization", slug: "virtualization", description: "Hypervisor deployment, VM clustering, virtual switches, and resource provisioning.", badge: "Enterprise" },
      { id: "srv-4", name: "Automated Backup & Disaster Recovery", slug: "server-backup", description: "Bare-metal automated backups, scheduled cloud sync, and periodic restore testing." },
      { id: "srv-5", name: "Server Hardware Repair & RAID Rebuild", slug: "server-repair", description: "Replace failed SAS drives, rebuild RAID arrays, and swap hot-plug power supplies." },
      { id: "srv-6", name: "Server Maintenance Contract (AMC)", slug: "server-amc", description: "24/7 server health monitoring, security patching, and uptime assurance." },
    ],
  },
  {
    id: "electronic-contracts",
    name: "Electrical & Power Contracts",
    slug: "electronic-contracts",
    description: "Commercial DB panels, cabling, inverter/UPS power backups, and earthing contracts.",
    icon: Zap,
    color: "#F97316",
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    accentBg: "bg-orange-500/10 border-orange-500/30 text-orange-400",
    subcategories: [
      { id: "elec-1", name: "Commercial DB & Distribution Panels", slug: "db-setup", description: "MCB/ELCB breaker panel installation, phase balancing, and circuit labeling.", popular: true },
      { id: "elec-2", name: "Power Backup, Inverters & Online UPS", slug: "power-backup", description: "UPS installation, battery bank calculation, and seamless generator changeover systems." },
      { id: "elec-3", name: "Copper & Chemical Earthing Setup", slug: "earthing-setup", description: "Electrical grounding pits for IT equipment protection and lightning protection." },
      { id: "elec-4", name: "Office Cabling & Conduit Routing", slug: "commercial-wiring", description: "Concealed or PVC casing wiring for workstations, server rooms, and conference rooms." },
      { id: "elec-5", name: "Electrical AMC for Commercial Spaces", slug: "electrical-amc", description: "Routine thermal scans, loose connection checks, and safety certifications.", badge: "AMC" },
    ],
  },
  {
    id: "home-automation",
    name: "Smart Home Automation",
    slug: "home-automation",
    description: "Biometric digital door locks, smart lighting, motorized curtains, and video door phones.",
    icon: Home,
    color: "#14B8A6",
    gradient: "from-teal-500 via-cyan-500 to-sky-600",
    accentBg: "bg-teal-500/10 border-teal-500/30 text-teal-400",
    subcategories: [
      { id: "home-1", name: "Smart Fingerprint & Digital Door Locks", slug: "smart-locks", description: "Install keyless entry locks with fingerprint, passcode, RFID card, and mobile app access.", popular: true, badge: "Popular" },
      { id: "home-2", name: "Video Door Phones (VDP) & Intercoms", slug: "video-door-phone", description: "Color HD outdoor camera units with indoor touchscreen displays and smartphone alerts." },
      { id: "home-3", name: "Smart Lighting & Scene Control", slug: "smart-lighting", description: "Automate room lights, dimming scenes, and scheduled on/off via app or voice commands." },
      { id: "home-4", name: "Motorized Curtains & Blinds Automation", slug: "smart-curtains", description: "Silent motorized curtain tracks controlled by sunrise/sunset schedules or remotes." },
      { id: "home-5", name: "Smart IR Hubs for AC & TV Automation", slug: "smart-climate", description: "Control legacy air conditioners and entertainment systems from your smartphone." },
    ],
  },
  {
    id: "website-development",
    name: "Website Development",
    slug: "website-development",
    description: "Modern fast business websites, e-commerce stores, custom web apps, and SEO optimization.",
    icon: Globe,
    color: "#EC4899",
    gradient: "from-pink-500 via-rose-500 to-red-500",
    accentBg: "bg-pink-500/10 border-pink-500/30 text-pink-400",
    subcategories: [
      { id: "web-1", name: "Corporate Business Website", slug: "business-website", description: "Professional responsive website representing your company brand, services, and trust signals.", popular: true, badge: "Featured" },
      { id: "web-2", name: "High-Conversion Landing Page", slug: "landing-page", description: "Single-page lead generation site with clear call-to-actions, contact forms, and WhatsApp links." },
      { id: "web-3", name: "E-Commerce Online Store", slug: "ecommerce-website", description: "Product catalog, shopping cart, Razorpay payment gateway, and customer order management.", badge: "E-Commerce" },
      { id: "web-4", name: "Custom Web Application & Portals", slug: "web-app", description: "Tailored Next.js / Node.js web portals, client dashboards, and custom business logic." },
      { id: "web-5", name: "Website Speed & SEO Optimization", slug: "speed-optimization", description: "Optimize Core Web Vitals, Google indexing, structured schema, and page load times." },
      { id: "web-6", name: "Annual Website Maintenance (AMC)", slug: "web-amc", description: "Security updates, monthly content updates, SSL renewals, and regular cloud backups." },
    ],
  },
  {
    id: "software-licensing",
    name: "Software & Cloud Licensing",
    slug: "software-licensing",
    description: "Microsoft 365, Windows Pro, SQL Server, and centralized enterprise antivirus suites.",
    icon: Key,
    color: "#D97706",
    gradient: "from-amber-500 via-orange-500 to-yellow-600",
    accentBg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
    subcategories: [
      { id: "lic-1", name: "Microsoft 365 Business Cloud Setup", slug: "m365-setup", description: "Business email setup with your custom domain, OneDrive cloud storage, and Teams collaboration.", popular: true },
      { id: "lic-2", name: "Genuine Windows Pro OS Licenses", slug: "windows-upgrade", description: "Authorized OEM/Retail Windows 10 & 11 Pro activation keys with lifetime validation." },
      { id: "lic-3", name: "Centralized Enterprise Antivirus Console", slug: "antivirus-activation", description: "Cloud-managed endpoint security with central dashboard, threat alerts, and automated updates." },
      { id: "lic-4", name: "Tally Prime Accounting Licensing", slug: "tally-licensing", description: "Single-user Silver or multi-user Gold licenses with Tally.NET cloud sync and data backup." },
    ],
  },
  {
    id: "cyber-security",
    name: "Cyber Security & Audits",
    slug: "cyber-security",
    description: "Managed hardware firewalls, endpoint protection, vulnerability scanning, and threat audits.",
    icon: ShieldCheck,
    color: "#10B981",
    gradient: "from-slate-700 via-blue-700 to-cyan-600",
    accentBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    subcategories: [
      { id: "sec-1", name: "Managed Firewall Deployment", slug: "managed-firewall-setup", description: "Install Fortinet / Sophos hardware firewalls, configure IPsec VPN, and set traffic rules.", popular: true, badge: "Essential" },
      { id: "sec-2", name: "Endpoint Detection & Threat Protection", slug: "endpoint-protection", description: "Deploy automated anti-ransomware agents across all staff laptops and servers." },
      { id: "sec-3", name: "IT Security Compliance & Risk Audit", slug: "security-audit", description: "Comprehensive audit of passwords, open ports, backup validity, and data vulnerability risks." },
      { id: "sec-4", name: "Remote Office VPN & Secure Access", slug: "threat-hardening", description: "Allow work-from-home team members to access office servers through encrypted private tunnels." },
    ],
  },
];

export const DEMO_TESTIMONIALS = [
  {
    id: 1,
    quote: "TechBes deployed 16 IP cameras and structured Cat6 cabling for our 3-floor office in Koramangala. The Free Site Survey gave us an exact, transparent quote with zero surprise costs on completion.",
    author: "Rajesh Varma",
    role: "Operations Director",
    company: "Nexa Logistics Ltd, Bangalore",
    rating: 5,
    service: "CCTV Installation & Networking",
    verified: true,
  },
  {
    id: 2,
    quote: "Our retail showroom in Indiranagar needed both surveillance and reliable staff Wi-Fi. TechBes sent certified engineers on the same day. Mobile viewing app setup was completely seamless.",
    author: "Ananya Murthy",
    role: "Managing Partner",
    company: "Bloom Retail Group, Bangalore",
    rating: 5,
    service: "CCTV Surveillance & Wi-Fi",
    verified: true,
  },
];
