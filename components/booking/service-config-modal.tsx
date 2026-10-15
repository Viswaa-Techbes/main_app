"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import {
  Calendar,
  Clock,
  FileText,
  Zap,
  CheckCircle2,
  Info,
  Loader2,
  MapPin,
  Plus,
  Trash2,
  Mic,
  Phone,
  User,
  Mail,
  Building,
  ShieldCheck,
  PackageCheck,
  Camera,
  Network,
  Globe,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cctvApi, CctvSubcategory } from "@/lib/cctv-api";
import { useToast } from "@/hooks/use-toast";
import dynamic from "next/dynamic";
import { AUTH_TOKEN_STORAGE_KEY } from "@/core/api/config";
import { VoiceNoteRecorder } from "@/components/quotation/VoiceNoteRecorder";
import { QUOTATION_CATEGORIES } from "@/lib/service-quotation-data";
import { ProductAutocomplete, InventoryProduct } from "@/components/quotation/ProductAutocomplete";

const LocationPicker = dynamic(() => import("./LocationPicker"), { ssr: false });

export const NETWORKING_EQUIPMENT_OPTIONS = [
  { key: "wifiAp", label: "Ceiling / Wall Mount Wi-Fi 6 Access Points", defaultQty: 2 },
  { key: "gigabitSwitch", label: "8-Port / 16-Port / 24-Port Gigabit Switches", defaultQty: 1 },
  { key: "routerGateway", label: "Enterprise Router / Firewall Gateway", defaultQty: 1 },
  { key: "serverRack", label: "6U / 9U / 12U Network Wall-Mount Rack", defaultQty: 1 },
  { key: "patchPanel", label: "Cat6 Patch Panel (24 Ports) & IO Wall Plates", defaultQty: 1 },
  { key: "nasStorage", label: "NAS Storage / Local Backup Server Unit", defaultQty: 1 },
];

export const WEB_FEATURE_OPTIONS = [
  { key: "mobileResponsive", label: "100% Mobile Responsive & Fast Loading" },
  { key: "whatsappChat", label: "WhatsApp Chat & Floating Contact Button" },
  { key: "leadForms", label: "Contact Forms & Lead Capture System" },
  { key: "paymentGateway", label: "Online Payment Gateway (Razorpay / Stripe)" },
  { key: "shoppingCart", label: "Product Catalog, Cart & Order System" },
  { key: "userPortal", label: "User Login / Client Portal Dashboard" },
  { key: "seoSetup", label: "Basic On-Page SEO & Google Analytics" },
  { key: "cmsBlog", label: "Blog / Dynamic Content Management (CMS)" },
];

interface QuotationItem {
  id: string;
  productId?: string;
  productName: string;
  brand?: string;
  sku?: string;
  variant?: string;
  quantity: number;
  basePrice?: number;
  gstRate?: number;
  isTaxInclusive?: boolean;
}

export const STANDARD_CAMERA_TYPES = [
  "Dome Camera",
  "Bullet Camera",
  "PTZ Camera",
  "WiFi Indoor Camera",
  "WiFi Outdoor Camera",
  "Analog Camera",
  "4G Camera",
] as const;

export function findMatchingCameraType(itemName: string): string | undefined {
  if (!itemName) return undefined;
  const norm = itemName.toLowerCase().trim();
  for (const cam of STANDARD_CAMERA_TYPES) {
    const camLower = cam.toLowerCase();
    if (norm === camLower) return cam;
    if (norm.includes(camLower) || camLower.includes(norm)) return cam;
    if (cam === "Dome Camera" && (norm.includes("dome") || norm.includes("4k ip dome"))) return cam;
    if (cam === "Bullet Camera" && (norm.includes("bullet") || norm.includes("weatherproof"))) return cam;
    if (cam === "PTZ Camera" && (norm.includes("ptz") || norm.includes("360"))) return cam;
    if (cam === "Analog Camera" && norm.includes("analog")) return cam;
    if (cam === "WiFi Indoor Camera" && norm.includes("wifi indoor")) return cam;
    if (cam === "WiFi Outdoor Camera" && norm.includes("wifi outdoor")) return cam;
    if (cam === "4G Camera" && (norm.includes("4g") || norm.includes("sim camera"))) return cam;
  }
  return undefined;
}

// Quick suggestions per category
const CATEGORY_ITEM_SUGGESTIONS: Record<string, string[]> = {
  CCTV: [
    "4-Port / 8-Port PoE Switch",
    "4-Channel DVR / NVR",
    "8-Channel DVR / NVR",
    "16-Channel DVR / NVR",
    "1TB Surveillance HDD",
    "2TB Surveillance HDD",
    "4TB Surveillance HDD",
    "Cat6 Cable (Bundle)",
    "SMPS Power Supply (12V)",
    "4U / 6U Network Rack",
    "BNC & DC Connectors Kit",
    "HDMI Cable (5m / 10m)",
    "CCTV Junction Box",
  ],
  Networking: [
    "Cat6 LAN Point Cabling",
    "Dual-Band Wi-Fi 6 Router",
    "8-Port Gigabit Switch",
    "16-Port / 24-Port Gigabit Switch",
    "Ceiling Mount Wi-Fi Access Point",
    "Structured Cabling (Meters)",
    "9U Server / Network Rack",
    "Patch Panel (24 Ports)",
    "PoE Injector / Switch",
    "RJ45 Wall Plates & Keystone",
  ],
  "Web Designing": [
    "Corporate Business Website",
    "E-Commerce Online Store",
    "High-Converting Landing Page",
    "Custom Web Application / Portal",
    "Payment Gateway Integration",
    "Domain & High-Speed Cloud Hosting",
    "Website UI/UX Redesign",
    "SEO & Speed Optimization",
    "Annual Maintenance Contract (AMC)",
  ],
};

function getDatePills() {
  const pills = [];
  const today = new Date();
  for (let i = 0; i < 3; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    const iso = d.toISOString().split("T")[0];
    const label =
      i === 0
        ? "Today"
        : i === 1
        ? "Tomorrow"
        : d.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
          });
    pills.push({ iso, label });
  }
  return pills;
}

export function ServiceBookingConfigModal({
  open,
  onOpenChange,
  service,
  editItem,
  onRequestQuote,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  service: CctvSubcategory;
  editItem?: any | null;
  onRequestQuote?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  // Scroll target refs for validation
  const requirementsRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const customerDetailsRef = useRef<HTMLDivElement>(null);

  // Core Form States
  const [selectedPackageId, setSelectedPackageId] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00 AM - 12:00 PM");

  // Customer Contact details
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  // Address and Map location states
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // Structured address details
  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [area, setArea] = useState("");
  const [landmark, setLandmark] = useState("");
  const [district, setDistrict] = useState("");
  const [floor, setFloor] = useState("");
  const [apartmentName, setApartmentName] = useState("");
  const [formattedAddress, setFormattedAddress] = useState("");

  // Quotation Custom Items & Voice Note
  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState(1);
  const [voiceNoteData, setVoiceNoteData] = useState<{
    url: string;
    duration: number;
    filename: string;
    mimeType: string;
  } | null>(null);

  const [submittedQuote, setSubmittedQuote] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Robust Category & Subcategory detection matching TechBes services
  const {
    isNetworking,
    isWebDesigning,
    isCctv,
    isCctvInstall,
    isCctvRepair,
    isCctvAmc,
    isCctvUpgrade,
    isCctvBuy,
    isCctvSurvey,
    isNetTroubleshoot,
    isNetWifi,
    isNetCabling,
    isNetServer,
    isNetSecurity,
    isNetAmc,
    isNetSurvey,
    isNetOfficeOrCabling,
    isWebEcommerce,
    isWebRedesignOrSeo,
    isWebNewOrBusiness,
    isDigitalMarketing,
    isPodcast,
    isDigitalMarketingService,
  } = useMemo(() => {
    const slug = (service.slug || "").toLowerCase();
    const cat = String(service.categoryId || "").toLowerCase();
    const name = (service.name || "").toLowerCase();

    const isDigitalMarketingCat =
      cat === "digital-marketing" ||
      cat.includes("market") ||
      slug === "digital-marketing" ||
      slug === "podcasting" ||
      name.includes("digital marketing") ||
      name.includes("podcasting") ||
      name.includes("podcast");

    const isPodcastSub =
      isDigitalMarketingCat &&
      (slug === "podcasting" || name.includes("podcast") || slug.includes("podcast"));

    const isDigitalMarketingSub = isDigitalMarketingCat && !isPodcastSub;

    const netServices = QUOTATION_CATEGORIES.find((c) => c.id === "networking")?.services || [];
    const webServices = QUOTATION_CATEGORIES.find((c) => c.id === "website-development")?.services || [];

    const isNet =
      !isDigitalMarketingCat &&
      (cat === "networking" ||
        cat.includes("network") ||
        slug.includes("network") ||
        name.includes("network") ||
        netServices.some((s) => s.slug === slug || s.name.toLowerCase() === name));

    const isWeb =
      !isNet &&
      !isDigitalMarketingCat &&
      (cat === "website-development" ||
        cat === "web-designing" ||
        cat.includes("web") ||
        slug.includes("web") ||
        name.includes("web") ||
        webServices.some((s) => s.slug === slug || s.name.toLowerCase() === name));

    const isCctvCat = !isNet && !isWeb && !isDigitalMarketingCat;

    // Specific CCTV subcategories
    const isCctvRepairSub = isCctvCat && (slug === "repair-existing-cctv" || slug.includes("repair") || name.includes("repair"));
    const isCctvAmcSub = isCctvCat && !isCctvRepairSub && (slug === "maintenance-amc" || slug.includes("amc") || slug.includes("maintenance") || name.includes("amc") || name.includes("maintenance"));
    const isCctvUpgradeSub = isCctvCat && !isCctvRepairSub && !isCctvAmcSub && (slug === "upgrade-existing-cctv" || slug.includes("upgrade") || name.includes("upgrade"));
    const isCctvBuySub = isCctvCat && !isCctvRepairSub && !isCctvAmcSub && !isCctvUpgradeSub && (slug === "buy-cctv-products" || slug.includes("buy") || name.includes("buy"));
    const isCctvSurveySub = isCctvCat && !isCctvRepairSub && !isCctvAmcSub && !isCctvUpgradeSub && !isCctvBuySub && (slug === "free-site-survey" || slug.includes("survey") || name.includes("survey") || name.includes("site audit"));
    const isCctvInstallSub = isCctvCat && !isCctvRepairSub && !isCctvAmcSub && !isCctvUpgradeSub && !isCctvBuySub && !isCctvSurveySub;

    // Specific Networking subcategories
    const isNetTroubleshootSub = isNet && (slug === "network-troubleshooting" || slug.includes("troubleshoot") || name.includes("troubleshoot"));
    const isNetWifiSub = isNet && !isNetTroubleshootSub && (slug === "wifi-internet-issues" || slug === "router-modem" || slug.includes("wifi") || name.includes("wi-fi") || name.includes("speed"));
    const isNetCablingSub = isNet && !isNetTroubleshootSub && (slug === "structured-cabling" || slug.includes("cabling") || name.includes("cabling"));
    const isNetServerSub = isNet && !isNetTroubleshootSub && (slug === "server-storage" || slug.includes("server") || slug.includes("nas") || name.includes("server") || name.includes("storage"));
    const isNetSecuritySub = isNet && !isNetTroubleshootSub && (slug === "network-security" || slug.includes("security") || slug.includes("firewall") || name.includes("firewall"));
    const isNetAmcSub = isNet && !isNetTroubleshootSub && (slug === "network-amc" || slug.includes("amc") || name.includes("amc"));
    const isNetSurveySub = isNet && !isNetTroubleshootSub && (slug === "network-survey" || slug.includes("survey") || slug.includes("audit") || name.includes("survey") || name.includes("audit"));
    const isNetOfficeSub = isNet && !isNetTroubleshootSub && !isNetWifiSub && !isNetCablingSub && !isNetServerSub && !isNetSecuritySub && !isNetAmcSub && !isNetSurveySub;

    // Specific Web Designing subcategories
    const isWebEcomSub = isWeb && (slug === "ecommerce-website" || slug === "payment-gateway" || slug.includes("ecommerce") || slug.includes("e-commerce") || name.includes("ecommerce") || name.includes("e-commerce"));
    const isWebRedesignSub = isWeb && !isWebEcomSub && (
      slug === "web-redesign" || slug === "web-maintenance" || slug === "speed-optimization" ||
      slug === "seo-services" || slug === "web-security" ||
      slug.includes("redesign") || slug.includes("maintenance") || slug.includes("speed") ||
      slug.includes("seo") || name.includes("redesign") ||
      name.includes("maintenance") || name.includes("seo") || name.includes("speed")
    );
    const isWebNewSub = isWeb && !isWebEcomSub && !isWebRedesignSub;

    return {
      isNetworking: isNet,
      isWebDesigning: isWeb,
      isDigitalMarketing: isDigitalMarketingCat,
      isPodcast: isPodcastSub,
      isDigitalMarketingService: isDigitalMarketingSub,
      isCctv: isCctvCat,
      isCctvInstall: isCctvInstallSub,
      isCctvRepair: isCctvRepairSub,
      isCctvAmc: isCctvAmcSub,
      isCctvUpgrade: isCctvUpgradeSub,
      isCctvBuy: isCctvBuySub,
      isCctvSurvey: isCctvSurveySub,
      isNetTroubleshoot: isNetTroubleshootSub,
      isNetWifi: isNetWifiSub,
      isNetCabling: isNetCablingSub,
      isNetServer: isNetServerSub,
      isNetSecurity: isNetSecuritySub,
      isNetAmc: isNetAmcSub,
      isNetSurvey: isNetSurveySub,
      isNetOfficeOrCabling: isNetOfficeSub,
      isWebEcommerce: isWebEcomSub,
      isWebRedesignOrSeo: isWebRedesignSub,
      isWebNewOrBusiness: isWebNewSub,
    };
  }, [service]);

  const serviceCategoryLabel = useMemo(() => {
    if (isDigitalMarketing) return "Digital Marketing";
    if (isNetworking) return "Networking";
    if (isWebDesigning) return "Web Designing";
    return "CCTV";
  }, [isDigitalMarketing, isNetworking, isWebDesigning]);

  const isBuyCctvProducts = isCctvBuy;
  const isInstallNewCctv = isCctvInstall;

  // ──────── CCTV Specific States ────────
  // CCTV Repair
  const [cctvRepairCameraQty, setCctvRepairCameraQty] = useState<string>("1 - 4 Cameras");
  const [cctvRepairCameraType, setCctvRepairCameraType] = useState<string>("Analog HD (Coaxial)");
  const [cctvRepairProblem, setCctvRepairProblem] = useState<string>("Camera Not Working / No Video Display");
  const [cctvRepairBrand, setCctvRepairBrand] = useState<string>("CP Plus");
  const [cctvRepairFaultyCount, setCctvRepairFaultyCount] = useState<number>(1);

  // CCTV AMC
  const [cctvAmcCameraCount, setCctvAmcCameraCount] = useState<string>("1 - 8 Cameras");
  const [cctvAmcSystemType, setCctvAmcSystemType] = useState<string>("IP Network Cameras");
  const [cctvAmcBrand, setCctvAmcBrand] = useState<string>("Hikvision / CP Plus");
  const [cctvAmcScope, setCctvAmcScope] = useState<string>("Quarterly Preventive Visits (4 Visits/Year)");

  // CCTV Upgrade
  const [cctvUpgradeCurrentSystem, setCctvUpgradeCurrentSystem] = useState<string>("4-Channel Analog DVR System");
  const [cctvUpgradeCurrentQty, setCctvUpgradeCurrentQty] = useState<number>(4);
  const [cctvUpgradeTargetQty, setCctvUpgradeTargetQty] = useState<number>(8);
  const [cctvUpgradeObjectives, setCctvUpgradeObjectives] = useState<Record<string, boolean>>({
    convertIp: true,
    addCameras: true,
    upgradeHdd: false,
    mobileRemote: true,
    replaceDvr: false,
  });

  // CCTV Site Survey
  const [cctvSurveyPropertyType, setCctvSurveyPropertyType] = useState<string>("Home / Villa");
  const [cctvSurveyPurpose, setCctvSurveyPurpose] = useState<string>("New CCTV Security Planning & Camera Placement");
  const [cctvSurveyEstCameras, setCctvSurveyEstCameras] = useState<string>("4 - 8 Cameras (Estimated)");
  const [cctvSurveyKeyAreas, setCctvSurveyKeyAreas] = useState<string>("Main Entrance & Boundary Perimeters");

  // CCTV Buy Products
  const [cctvBuyIncludeInstallation, setCctvBuyIncludeInstallation] = useState<boolean>(false);

  // ──────── Networking Specific States ────────
  // Troubleshooting
  const [netTroubleIssue, setNetTroubleIssue] = useState<string>("Internet Frequent Disconnections / Packet Drops");
  const [netTroubleAffectedDevices, setNetTroubleAffectedDevices] = useState<string>("Whole Office / Multiple Users");
  const [netTroubleExistingEquipment, setNetTroubleExistingEquipment] = useState<string>("ISP Router + Unmanaged Switch + Wi-Fi APs");

  // Wi-Fi
  const [netWifiStandard, setNetWifiStandard] = useState<string>("Dual-Band Wi-Fi 6 (Seamless Roaming)");
  const [netWifiApCount, setNetWifiApCount] = useState<number>(2);
  const [netWifiCoverage, setNetWifiCoverage] = useState<string>("Single Floor (~2,000 sq.ft)");

  // Server / Storage
  const [netServerType, setNetServerType] = useState<string>("Synology / QNAP NAS Storage");
  const [netServerCapacity, setNetServerCapacity] = useState<string>("4TB Storage (RAID 1 Mirroring)");
  const [netServerUsers, setNetServerUsers] = useState<string>("10 - 25 Users");

  // Security & Firewall
  const [netSecurityFirewall, setNetSecurityFirewall] = useState<string>("Hardware Firewall (Fortinet / SonicWall / Sophos)");
  const [netSecurityUsers, setNetSecurityUsers] = useState<string>("25 - 50 Connected Users");

  // Network AMC
  const [netAmcFrequency, setNetAmcFrequency] = useState<string>("Monthly Health Check & Proactive Monitoring");
  const [netAmcUsers, setNetAmcUsers] = useState<string>("11 - 25 Users");
  const [netAmcDevices, setNetAmcDevices] = useState<string>("Up to 5 Network Switches & Routers");

  // Networking General Setup / Cabling
  const [networkPremisesType, setNetworkPremisesType] = useState<string>("Small Office (1-10 Pax)");
  const [networkUsers, setNetworkUsers] = useState<string>("11 - 25 Users");
  const [networkEquipmentSelected, setNetworkEquipmentSelected] = useState<Record<string, boolean>>({
    wifiAp: true,
    gigabitSwitch: true,
  });
  const [networkEquipmentQuantities, setNetworkEquipmentQuantities] = useState<Record<string, number>>({
    wifiAp: 2,
    gigabitSwitch: 1,
    routerGateway: 1,
    serverRack: 1,
    patchPanel: 1,
    nasStorage: 1,
  });
  const [networkStructuredCabling, setNetworkStructuredCabling] = useState<boolean>(true);
  const [networkCableType, setNetworkCableType] = useState<string>("Cat6 Solid Copper");
  const [networkLanPoints, setNetworkLanPoints] = useState<number>(16);
  const [networkCableLength, setNetworkCableLength] = useState<number>(100);
  const [networkWifiRequirement, setNetworkWifiRequirement] = useState<string>(
    "Dual-Band Wi-Fi 6 (Seamless Roaming)"
  );
  const [networkTroubleshootingScope, setNetworkTroubleshootingScope] = useState<string>("");

  // ──────── Web Designing Specific States ────────
  // E-Commerce
  const [webEcomProducts, setWebEcomProducts] = useState<string>("50 - 200 Products");
  const [webEcomGateways, setWebEcomGateways] = useState<string>("Razorpay / PhonePe (UPI, Cards, Netbanking)");
  const [webEcomShipping, setWebEcomShipping] = useState<string>("Shiprocket / Automated Courier Dispatch");
  const [webEcomFeatures, setWebEcomFeatures] = useState<Record<string, boolean>>({
    variants: true,
    coupons: true,
    wishlist: true,
    whatsappAlerts: true,
    customerAccounts: true,
  });

  // Redesign / SEO / Maintenance
  const [webRedesignScope, setWebRedesignScope] = useState<string>("Complete Visual Modernization & Mobile UX Revamp");
  const [webRedesignGoals, setWebRedesignGoals] = useState<string>("Improve Google PageSpeed, SEO & Conversions");
  const [webTimeline, setWebTimeline] = useState<string>("Standard (2 - 4 Weeks)");
  const [webContentReadiness, setWebContentReadiness] = useState<string>("I have ready text content & product images");

  // New / Business Website
  const [webProjectType, setWebProjectType] = useState<string>("Corporate Business Website");
  const [webPageCount, setWebPageCount] = useState<string>("5 - 10 Pages (Standard Business)");
  const [webFeatures, setWebFeatures] = useState<Record<string, boolean>>({
    mobileResponsive: true,
    whatsappChat: true,
    leadForms: true,
    paymentGateway: false,
    shoppingCart: false,
    userPortal: false,
    seoSetup: true,
    cmsBlog: false,
  });
  const [webHostingStatus, setWebHostingStatus] = useState<string>(
    "Need Domain & High-Speed Cloud Hosting"
  );
  const [webExistingUrl, setWebExistingUrl] = useState<string>("");
  const [webEcommerceRequirements, setWebEcommerceRequirements] = useState<string>("");

  // ──────── Digital Marketing & Podcasting Specific States ────────
  const [marketingChannels, setMarketingChannels] = useState<Record<string, boolean>>({
    seo: true,
    googleAds: true,
    metaAds: true,
    socialMedia: false,
    contentWriting: false,
    analytics: true,
  });
  const [marketingBudget, setMarketingBudget] = useState<string>("₹25,000 – ₹50,000 / month");
  const [marketingWebsiteUrl, setMarketingWebsiteUrl] = useState<string>("");
  const [marketingTargetAudience, setMarketingTargetAudience] = useState<string>("B2B & Corporate Leads");
  const [marketingPrimaryGoal, setMarketingPrimaryGoal] = useState<string>("Generate Qualified Inquiries & Sales");

  // Podcasting
  const [podcastServices, setPodcastServices] = useState<Record<string, boolean>>({
    audioRecording: true,
    videoRecording4k: true,
    editingMastering: true,
    distribution: true,
    socialClips: true,
  });
  const [podcastEpisodeCount, setPodcastEpisodeCount] = useState<string>("4 Episodes (Monthly Pack)");
  const [podcastHostGuestFormat, setPodcastHostGuestFormat] = useState<string>("Host + 1 In-Studio Guest");
  const [podcastRecordingLocation, setPodcastRecordingLocation] = useState<string>("TechBes Soundproof Studio (Bangalore)");
  const [podcastTopic, setPodcastTopic] = useState<string>("");

  // Subcategory Presets on mount or service change
  useEffect(() => {
    if (!service) return;
    const slug = (service.slug || "").toLowerCase();
    const name = (service.name || "").toLowerCase();

    if (isNetworking) {
      if (slug.includes("server") || slug.includes("nas") || name.includes("storage")) {
        setNetworkEquipmentSelected({ nasStorage: true, gigabitSwitch: true, serverRack: true });
        setNetworkPremisesType("Corporate / Enterprise");
      } else if (slug.includes("cabling") || name.includes("cabling")) {
        setNetworkEquipmentSelected({ patchPanel: true, serverRack: true, gigabitSwitch: true });
        setNetworkStructuredCabling(true);
      } else if (slug.includes("wifi") || slug.includes("speed") || name.includes("wi-fi")) {
        setNetworkEquipmentSelected({ wifiAp: true, routerGateway: true });
        setNetworkWifiRequirement("Dual-Band Wi-Fi 6 (Seamless Roaming)");
      } else if (slug.includes("troubleshoot") || name.includes("troubleshoot")) {
        setNetworkTroubleshootingScope("Resolve packet drops, latency & disconnections");
      }
    } else if (isWebDesigning) {
      if (slug.includes("ecommerce") || name.includes("ecommerce") || name.includes("e-commerce")) {
        setWebProjectType("E-Commerce Online Store");
        setWebFeatures((prev) => ({
          ...prev,
          paymentGateway: true,
          shoppingCart: true,
          userPortal: true,
        }));
      } else if (slug.includes("landing") || name.includes("landing")) {
        setWebProjectType("Landing Page / Sales Funnel");
        setWebPageCount("1 - 5 Pages (Starter)");
      } else if (slug.includes("app") || name.includes("application") || slug.includes("portal")) {
        setWebProjectType("Custom Web Application / Portal");
        setWebFeatures((prev) => ({ ...prev, userPortal: true, leadForms: true }));
      } else if (slug.includes("redesign") || name.includes("redesign")) {
        setWebProjectType("Website UI/UX Redesign");
      }
    }
  }, [service, isNetworking, isWebDesigning]);

  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [selectedProductsCheckboxes, setSelectedProductsCheckboxes] = useState<
    Record<string, boolean>
  >({});
  const [selectedProductQuantities, setSelectedProductQuantities] = useState<
    Record<string, number>
  >({});
  const [selectedProductVariants, setSelectedProductVariants] = useState<
    Record<string, string>
  >({});

  // CCTV Hardware Specifications
  const [cctvPropertyType, setCctvPropertyType] = useState<string>("Home");
  const [cctvSelectedCameraTypes, setCctvSelectedCameraTypes] = useState<
    Record<string, boolean>
  >({ "Dome Camera": true, "Bullet Camera": true });
  const [cctvCameraQuantities, setCctvCameraQuantities] = useState<
    Record<string, number>
  >({ "Dome Camera": 4, "Bullet Camera": 2 });

  const [cctvCameraBrands, setCctvCameraBrands] = useState<Record<string, string>>({});
  const [cctvCameraModels, setCctvCameraModels] = useState<Record<string, string>>({});
  const [cctvSdCardEnabled, setCctvSdCardEnabled] = useState<boolean>(false);
  const [cctvSdCardCapacity, setCctvSdCardCapacity] = useState<string>("");
  const [cctvSdCardQuantity, setCctvSdCardQuantity] = useState<number>(1);
  const [cctvInstallationRequired, setCctvInstallationRequired] =
    useState<boolean>(true);
  const [cctvCableType, setCctvCableType] = useState<string>("CAT6 Solid Copper");
  const [cctvCableLength, setCctvCableLength] = useState<number>(90);
  const [cctvDvrChannels, setCctvDvrChannels] = useState<string>("4 Channel");
  const [cctvDvrManualOverride, setCctvDvrManualOverride] =
    useState<boolean>(false);
  const [cctvNetworkRack, setCctvNetworkRack] = useState<boolean>(false);
  const [cctvMonitorMounting, setCctvMonitorMounting] = useState<boolean>(false);
  const [cctvHddCapacity, setCctvHddCapacity] = useState<string>("1TB");
  const [cctvRackType, setCctvRackType] = useState<string>("");

  // Dynamic CCTV metadata tables
  const [cctvBrands, setCctvBrands] = useState<any[]>([]);
  const [cctvAllModels, setCctvAllModels] = useState<any[]>([]);

  const cctvTotalCameras = useMemo(() => {
    return Object.entries(cctvSelectedCameraTypes)
      .filter(([_, checked]) => checked)
      .reduce((sum, [type]) => sum + (cctvCameraQuantities[type] || 1), 0);
  }, [cctvSelectedCameraTypes, cctvCameraQuantities]);

  const hasAnalog = useMemo(() => {
    return Object.entries(cctvSelectedCameraTypes)
      .filter(([_, checked]) => checked)
      .some(([type]) => type === "Analog Camera");
  }, [cctvSelectedCameraTypes]);

  const showSdCardSection = useMemo(() => {
    return Object.entries(cctvSelectedCameraTypes)
      .filter(([_, checked]) => checked)
      .some(([type]) =>
        ["WiFi Indoor Camera", "WiFi Outdoor Camera", "4G Camera"].includes(type)
      );
  }, [cctvSelectedCameraTypes]);

  useEffect(() => {
    if (!showSdCardSection) {
      setCctvSdCardEnabled(false);
    }
  }, [showSdCardSection]);

  useEffect(() => {
    if (isInstallNewCctv && !cctvDvrManualOverride) {
      let rec = "None";
      if (cctvTotalCameras > 0) {
        if (cctvTotalCameras <= 4) rec = "4 Channel";
        else if (cctvTotalCameras <= 8) rec = "8 Channel";
        else if (cctvTotalCameras <= 16) rec = "16 Channel";
        else rec = "32 Channel";
      }
      setCctvDvrChannels(rec);
    }
  }, [cctvTotalCameras, isInstallNewCctv, cctvDvrManualOverride]);

  // Reset state on modal close
  useEffect(() => {
    if (!open) {
      setSelectedPackageId("");
      setNotes("");
      setDate("");
      setTime("09:00 AM - 12:00 PM");
      setQuotationItems([]);
      setNewItemName("");
      setNewItemQty(1);
      setVoiceNoteData(null);
      setSubmittedQuote(null);
    }
  }, [open]);

  // Load user profile & metadata
  useEffect(() => {
    if (!open) return;
    const token =
      localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) ||
      localStorage.getItem("token") ||
      "";

    if (token) {
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => (r.ok ? r.json() : {}))
        .then((json: any) => {
          if (json.success && json.data) {
            setCustomerName(json.data.name || "");
            setCustomerPhone(json.data.mobileNumber || json.data.phone || "");
            setCustomerEmail(json.data.email || "");
          }
        })
        .catch(() => {});

      fetch("/api/v2/user/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => (r.ok ? r.json() : fetch("/api/user/addresses", { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json())))
        .then((json: any) => {
          const list = Array.isArray(json?.data)
            ? json.data
            : Array.isArray(json)
            ? json
            : [];
          setSavedAddresses(list);
          const def = list.find((a: any) => a.isDefault) || list[0];
          if (def) {
            setSelectedAddressId(def._id);
            setAddress(def.address || def.fullAddress || "");
            setArea(def.area || "");
            setLandmark(def.landmark || "");
            setCity(def.city || "");
            setStateName(def.state || "");
            setPincode(def.pincode || "");
            setLatitude(def.latitude || null);
            setLongitude(def.longitude || null);
            setFormattedAddress(def.formattedAddress || def.address || "");
          }
        })
        .catch(() => {});
    }

    // Load CCTV options
    if (isInstallNewCctv || isBuyCctvProducts) {
      Promise.all([
        fetch("/api/v2/cctv/brands")
          .then((r) => r.json())
          .catch(() => ({ data: [] })),
        fetch("/api/v2/cctv/models")
          .then((r) => r.json())
          .catch(() => ({ data: [] })),
      ]).then(([br, md]) => {
        const brandsList = br?.data || [];
        const modelsList = md?.data || [];
        setCctvBrands(brandsList);
        setCctvAllModels(modelsList);

        if (brandsList.length > 0) {
          const firstBrand = brandsList[0]._id;
          setCctvCameraBrands((prev) => {
            const updated = { ...prev };
            Object.keys(cctvSelectedCameraTypes).forEach((t) => {
              if (!updated[t]) updated[t] = firstBrand;
            });
            return updated;
          });
        }
      });
    }

    if (isBuyCctvProducts) {
      cctvApi
        .products()
        .then((json: any) => {
          const list = Array.isArray(json) ? json : json?.data || [];
          setAvailableProducts(list);
        })
        .catch(() => {});
    }
  }, [open, isInstallNewCctv, isBuyCctvProducts]);

  // Add Item / Manage Items helpers with duplicate prevention & cross-section merging
  const handleToggleCameraType = (cType: string, checked: boolean) => {
    setCctvSelectedCameraTypes((prev) => ({
      ...prev,
      [cType]: checked,
    }));

    if (checked) {
      // If customer already added an item matching this camera in additional hardware, absorb & merge it
      const cLower = cType.toLowerCase();
      const matchingCustom = quotationItems.filter(
        (it) =>
          it.productName.toLowerCase().includes(cLower) ||
          cLower.includes(it.productName.toLowerCase())
      );

      let extraQty = 0;
      if (matchingCustom.length > 0) {
        extraQty = matchingCustom.reduce((sum, it) => sum + (it.quantity || 1), 0);
        setQuotationItems((prev) =>
          prev.filter((it) => !matchingCustom.some((m) => m.id === it.id))
        );
        toast({
          title: "Merged into Camera Selection",
          description: `Merged ${extraQty} quantity from additional items into ${cType}.`,
        });
      }

      const defaultQty = cType === "Bullet Camera" ? 2 : 4;
      setCctvCameraQuantities((prev) => ({
        ...prev,
        [cType]: (prev[cType] || defaultQty) + extraQty,
      }));
    }
  };

  const handleUpdateCameraQty = (cType: string, newQty: number) => {
    if (newQty <= 0) {
      setCctvSelectedCameraTypes((prev) => ({ ...prev, [cType]: false }));
      toast({
        title: "Camera Removed",
        description: `${cType} removed from quotation.`,
      });
      return;
    }
    setCctvCameraQuantities((prev) => ({
      ...prev,
      [cType]: newQty,
    }));
  };

  const handleSelectInventoryProduct = (prod: InventoryProduct) => {
    const base = prod.basePrice ?? prod.price ?? 0;
    const rate = typeof prod.gstRate === "number" ? prod.gstRate : 18;
    const isInc = Boolean(prod.isTaxInclusive);
    const qtyToAdd = Math.max(1, newItemQty || 1);
    const prodName = prod.name || "";

    // 1. If in CCTV installation, check if this inventory product is a standard camera type
    if (isInstallNewCctv) {
      const matchedCam = findMatchingCameraType(prodName);
      if (matchedCam) {
        if (cctvSelectedCameraTypes[matchedCam]) {
          setCctvCameraQuantities((prev) => {
            const updatedQty = (prev[matchedCam] || 1) + qtyToAdd;
            return { ...prev, [matchedCam]: updatedQty };
          });
          setNewItemQty(1);
          toast({
            title: "Quantity Merged with Camera Selection",
            description: `Added ${qtyToAdd} to ${matchedCam} in Camera Types & Quantities (Total: ${(cctvCameraQuantities[matchedCam] || 1) + qtyToAdd}).`,
          });
          return;
        } else {
          setCctvSelectedCameraTypes((prev) => ({ ...prev, [matchedCam]: true }));
          setCctvCameraQuantities((prev) => ({ ...prev, [matchedCam]: qtyToAdd }));
          setNewItemQty(1);
          toast({
            title: "Camera Selected",
            description: `${matchedCam} (Qty: ${qtyToAdd}) selected in Camera Types & Quantities.`,
          });
          return;
        }
      }
    }

    // 2. Prevent duplicate additions within additional hardware / quotationItems
    const existingIndex = quotationItems.findIndex(
      (it) =>
        (it.productId && (it.productId === prod._id || it.productId === prod.id)) ||
        it.productName.toLowerCase().trim() === prodName.toLowerCase().trim()
    );

    if (existingIndex >= 0) {
      setQuotationItems((prev) => {
        const next = [...prev];
        const existing = next[existingIndex];
        const updatedQty = (existing.quantity || 1) + qtyToAdd;
        next[existingIndex] = {
          ...existing,
          quantity: updatedQty,
          basePrice: base > 0 ? base : existing.basePrice,
          gstRate: rate,
          isTaxInclusive: isInc,
        };
        return next;
      });
      setNewItemQty(1);
      toast({
        title: "Quantity Merged",
        description: `Updated quantity for ${prodName} (Total: ${(quotationItems[existingIndex].quantity || 1) + qtyToAdd}).`,
      });
      return;
    }

    // 3. New additional hardware item
    setQuotationItems((prev) => [
      ...prev,
      {
        id: "item-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
        productId: prod._id || prod.id,
        productName: prod.name,
        brand: prod.brand || "",
        sku: prod.sku || "",
        variant: prod.variant || "",
        quantity: qtyToAdd,
        basePrice: base,
        gstRate: rate,
        isTaxInclusive: isInc,
      },
    ]);
    setNewItemQty(1);
    toast({
      title: "Product Added",
      description: `${prod.name} (Qty: ${qtyToAdd}) added to quotation.`,
    });
  };

  const handleAddCustomItem = (nameToAdd?: string, qtyToAdd?: number) => {
    const name = (nameToAdd || newItemName).trim();
    const qty = Math.max(1, qtyToAdd || newItemQty || 1);
    if (!name) {
      toast({
        title: "Product / Service Required",
        description: "Please specify or choose an item name to add.",
        variant: "destructive",
      });
      return;
    }

    // 1. If in CCTV installation, check if custom text matches a standard camera
    if (isInstallNewCctv) {
      const matchedCam = findMatchingCameraType(name);
      if (matchedCam) {
        if (cctvSelectedCameraTypes[matchedCam]) {
          setCctvCameraQuantities((prev) => {
            const updatedQty = (prev[matchedCam] || 1) + qty;
            return { ...prev, [matchedCam]: updatedQty };
          });
          setNewItemName("");
          setNewItemQty(1);
          toast({
            title: "Quantity Merged with Camera Selection",
            description: `Added ${qty} to ${matchedCam} in Camera Types & Quantities (Total: ${(cctvCameraQuantities[matchedCam] || 1) + qty}).`,
          });
          return;
        } else {
          setCctvSelectedCameraTypes((prev) => ({ ...prev, [matchedCam]: true }));
          setCctvCameraQuantities((prev) => ({ ...prev, [matchedCam]: qty }));
          setNewItemName("");
          setNewItemQty(1);
          toast({
            title: "Camera Selected",
            description: `${matchedCam} (Qty: ${qty}) selected in Camera Types & Quantities.`,
          });
          return;
        }
      }
    }

    // 2. Prevent duplicate additions within additional hardware / quotationItems
    const existingIndex = quotationItems.findIndex(
      (it) => it.productName.toLowerCase().trim() === name.toLowerCase().trim()
    );

    if (existingIndex >= 0) {
      setQuotationItems((prev) => {
        const next = [...prev];
        const existing = next[existingIndex];
        next[existingIndex] = {
          ...existing,
          quantity: (existing.quantity || 1) + qty,
        };
        return next;
      });
      setNewItemName("");
      setNewItemQty(1);
      toast({
        title: "Quantity Merged",
        description: `Updated quantity for "${name}" (Total: ${(quotationItems[existingIndex].quantity || 1) + qty}).`,
      });
      return;
    }

    // 3. New additional custom item
    setQuotationItems((prev) => [
      ...prev,
      {
        id: "item-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
        productName: name,
        quantity: qty,
      },
    ]);
    setNewItemName("");
    setNewItemQty(1);
    toast({
      title: "Item Added",
      description: `"${name}" (Qty: ${qty}) added to quotation.`,
    });
  };

  const handleUpdateItemQty = (id: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setQuotationItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, quantity: qty } : it))
    );
  };

  const handleRemoveItem = (id: string) => {
    setQuotationItems((prev) => prev.filter((it) => it.id !== id));
  };

  // Live GST & Price calculation across inventory-linked items
  const priceCalculations = useMemo(() => {
    let taxableSubtotal = 0;
    let totalGst = 0;
    let totalAmount = 0;
    let hasPricedItems = false;

    quotationItems.forEach((item) => {
      if (typeof item.basePrice === "number" && item.basePrice > 0) {
        hasPricedItems = true;
        const base = item.basePrice;
        const rate = typeof item.gstRate === "number" ? item.gstRate : 18;
        const q = item.quantity || 1;

        let taxable = 0;
        let gst = 0;
        let lineTot = 0;

        if (item.isTaxInclusive) {
          lineTot = Math.round(base * q * 100) / 100;
          taxable = Math.round((lineTot / (1 + rate / 100)) * 100) / 100;
          gst = Math.round((lineTot - taxable) * 100) / 100;
        } else {
          taxable = Math.round(base * q * 100) / 100;
          gst = Math.round(((taxable * rate) / 100) * 100) / 100;
          lineTot = Math.round((taxable + gst) * 100) / 100;
        }

        taxableSubtotal += taxable;
        totalGst += gst;
        totalAmount += lineTot;
      }
    });

    return {
      hasPricedItems,
      taxableSubtotal: Math.round(taxableSubtotal * 100) / 100,
      totalGst: Math.round(totalGst * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
    };
  }, [quotationItems]);

  // Compile final quotation items list
  const finalItemsToSubmit = useMemo(() => {
    const list: {
      productId?: string;
      productName: string;
      quantity: number;
      brand?: string;
      sku?: string;
      variant?: string;
      unitPrice?: number;
      gstRate?: number;
    }[] = [];

    if (isCctvRepair) {
      list.push({
        productName: `CCTV Repair — ${cctvRepairProblem} (${cctvRepairFaultyCount} faulty device(s))`,
        quantity: cctvRepairFaultyCount || 1,
      });
      list.push({
        productName: `Existing System: ${cctvRepairCameraQty} ${cctvRepairCameraType} (${cctvRepairBrand})`,
        quantity: 1,
      });
    } else if (isCctvAmc) {
      list.push({
        productName: `CCTV AMC — ${cctvAmcScope}`,
        quantity: 1,
      });
      list.push({
        productName: `Covered Setup: ${cctvAmcCameraCount} (${cctvAmcSystemType}, ${cctvAmcBrand})`,
        quantity: 1,
      });
    } else if (isCctvUpgrade) {
      list.push({
        productName: `CCTV System Upgrade — Current: ${cctvUpgradeCurrentQty} Cameras (${cctvUpgradeCurrentSystem}) ➔ Upgrading to: ${cctvUpgradeTargetQty} Cameras`,
        quantity: 1,
      });
      const chosenObjectives = [];
      if (cctvUpgradeObjectives.convertIp) chosenObjectives.push("Convert Analog to 4K IP");
      if (cctvUpgradeObjectives.addCameras) chosenObjectives.push("Add Extra Cameras");
      if (cctvUpgradeObjectives.upgradeHdd) chosenObjectives.push("Expand Storage HDD");
      if (cctvUpgradeObjectives.mobileRemote) chosenObjectives.push("Mobile App Remote Setup");
      if (cctvUpgradeObjectives.replaceDvr) chosenObjectives.push("Replace DVR / NVR Unit");
      if (chosenObjectives.length > 0) {
        list.push({
          productName: `Upgrade Objectives: ${chosenObjectives.join("; ")}`,
          quantity: 1,
        });
      }
    } else if (isCctvSurvey) {
      list.push({
        productName: `Free CCTV Site Survey — ${cctvSurveyPurpose} (${cctvSurveyPropertyType})`,
        quantity: 1,
      });
      list.push({
        productName: `Survey Scope: ~${cctvSurveyEstCameras} (Priority: ${cctvSurveyKeyAreas})`,
        quantity: 1,
      });
    } else if (isCctvBuy) {
      // Products from store
      Object.entries(selectedProductsCheckboxes).forEach(([prodId, checked]) => {
        if (checked) {
          const p = availableProducts.find(
            (item) => item._id === prodId || item.id === prodId
          );
          if (p) {
            const v = selectedProductVariants[prodId];
            const q = selectedProductQuantities[prodId] || 1;
            list.push({
              productName: `${p.name || p.title}${v ? ` (${v})` : ""}`,
              quantity: q,
            });
          }
        }
      });
      if (cctvBuyIncludeInstallation) {
        list.push({
          productName: "Professional On-Site Fitting & Setup Service",
          quantity: 1,
        });
      }
    } else if (isCctvInstall) {
      // Camera Hardware
      Object.entries(cctvSelectedCameraTypes).forEach(([type, checked]) => {
        if (checked) {
          const qty = cctvCameraQuantities[type] || 1;
          const bId = cctvCameraBrands[type];
          const mId = cctvCameraModels[type];
          const brandObj = cctvBrands.find((b) => b._id === bId);
          const modelObj = cctvAllModels.find((m) => m._id === mId);
          const detail = modelObj
            ? `${brandObj?.name || ""} ${modelObj.resolution || ""} ${
                modelObj.name || ""
              }`.trim()
            : "";
          list.push({
            productName: detail ? `${type} (${detail})` : type,
            quantity: qty,
          });
        }
      });

      // Cabling & Installation
      if (cctvInstallationRequired) {
        if (cctvCableLength > 0) {
          list.push({
            productName: `${cctvCableType || "CAT6"} Cabling (${cctvCableLength} meters)`,
            quantity: 1,
          });
        }
        list.push({
          productName: "Camera Fitting & Alignment Service",
          quantity: cctvTotalCameras || 1,
        });
      }

      // Recorder DVR / NVR
      if (cctvDvrChannels && cctvDvrChannels !== "None") {
        list.push({
          productName: `${cctvDvrChannels} ${hasAnalog ? "DVR" : "NVR"} Recorder Unit`,
          quantity: 1,
        });
      }

      // SD Card
      if (cctvSdCardEnabled && cctvSdCardCapacity) {
        list.push({
          productName: `Surveillance SD Card (${cctvSdCardCapacity})`,
          quantity: cctvSdCardQuantity || 1,
        });
      }

      // HDD
      if (cctvHddCapacity) {
        list.push({
          productName: `Surveillance Hard Drive (${cctvHddCapacity})`,
          quantity: 1,
        });
      }

      // Rack & Accessories
      if (cctvRackType) {
        list.push({
          productName: `Wall-Mount Rack (${cctvRackType})`,
          quantity: 1,
        });
      }
      if (cctvNetworkRack) {
        list.push({
          productName: "Network Rack Installation & Dressing",
          quantity: 1,
        });
      }
      if (cctvMonitorMounting) {
        list.push({
          productName: "Display Monitor Wall Mounting",
          quantity: 1,
        });
      }
    } else if (isNetTroubleshoot) {
      list.push({
        productName: `Network Troubleshooting — ${netTroubleIssue} (${netTroubleAffectedDevices})`,
        quantity: 1,
      });
      list.push({
        productName: `Existing Equipment: ${netTroubleExistingEquipment}`,
        quantity: 1,
      });
    } else if (isNetWifi) {
      list.push({
        productName: `Wi-Fi Optimization & Setup — ${netWifiStandard} (${netWifiApCount} APs, ~${netWifiCoverage})`,
        quantity: 1,
      });
    } else if (isNetCabling) {
      list.push({
        productName: `Structured Cabling — ${networkCableType} (${networkLanPoints} Drops / ~${networkCableLength}m)`,
        quantity: 1,
      });
    } else if (isNetServer) {
      list.push({
        productName: `Server & NAS Storage — ${netServerType} (${netServerCapacity}, ${netServerUsers})`,
        quantity: 1,
      });
    } else if (isNetSecurity) {
      list.push({
        productName: `Network Security & Firewall — ${netSecurityFirewall} (${netSecurityUsers})`,
        quantity: 1,
      });
    } else if (isNetAmc) {
      list.push({
        productName: `Network AMC — ${netAmcFrequency} (${netAmcUsers}, ${netAmcDevices})`,
        quantity: 1,
      });
    } else if (isNetSurvey) {
      list.push({
        productName: `Free Network Site Audit — ${networkPremisesType} (${networkUsers})`,
        quantity: 1,
      });
    } else if (isNetworking) {
      // General office setup / deployment
      list.push({
        productName: `${service.name} (${networkPremisesType}, ${networkUsers})`,
        quantity: 1,
      });

      NETWORKING_EQUIPMENT_OPTIONS.forEach((item) => {
        if (networkEquipmentSelected[item.key]) {
          const qty = networkEquipmentQuantities[item.key] || item.defaultQty || 1;
          list.push({
            productName: item.label,
            quantity: qty,
          });
        }
      });

      if (networkStructuredCabling) {
        list.push({
          productName: `Structured Cabling — ${networkCableType} (${networkLanPoints} Drops / ~${networkCableLength}m)`,
          quantity: 1,
        });
      }

      if (networkWifiRequirement) {
        list.push({
          productName: `Wi-Fi Scope: ${networkWifiRequirement}`,
          quantity: 1,
        });
      }
    } else if (isWebEcommerce) {
      list.push({
        productName: `E-Commerce Store — Catalog: ${webEcomProducts} (${webEcomGateways})`,
        quantity: 1,
      });
      list.push({
        productName: `Shipping Integration: ${webEcomShipping}`,
        quantity: 1,
      });
      const chosenEcomFeats = Object.entries(webEcomFeatures)
        .filter(([_, checked]) => checked)
        .map(([k]) => {
          if (k === "variants") return "Product Variations";
          if (k === "coupons") return "Discount Coupons";
          if (k === "wishlist") return "Wishlist";
          if (k === "whatsappAlerts") return "WhatsApp Order Alerts";
          if (k === "customerAccounts") return "Customer Accounts / Login";
          return k;
        });
      if (chosenEcomFeats.length > 0) {
        list.push({
          productName: `Store Features: ${chosenEcomFeats.join("; ")}`,
          quantity: 1,
        });
      }
      list.push({
        productName: `Domain & Hosting: ${webHostingStatus}`,
        quantity: 1,
      });
      if (webExistingUrl.trim()) {
        list.push({
          productName: `Existing Store URL: ${webExistingUrl.trim()}`,
          quantity: 1,
        });
      }
    } else if (isWebRedesignOrSeo) {
      list.push({
        productName: `${service.name} — Target Site: ${webExistingUrl.trim() || "URL to be shared"}`,
        quantity: 1,
      });
      list.push({
        productName: `Scope & Focus: ${webRedesignScope}`,
        quantity: 1,
      });
      list.push({
        productName: `Goals: ${webRedesignGoals}`,
        quantity: 1,
      });
      list.push({
        productName: `Timeline: ${webTimeline}`,
        quantity: 1,
      });
    } else if (isWebDesigning) {
      // New / Corporate / Landing Page / Web App
      list.push({
        productName: `${webProjectType} (${webPageCount})`,
        quantity: 1,
      });
      list.push({
        productName: `Domain & Hosting: ${webHostingStatus}`,
        quantity: 1,
      });
      list.push({
        productName: `Content Readiness: ${webContentReadiness}`,
        quantity: 1,
      });
      const chosenFeatures = WEB_FEATURE_OPTIONS.filter((f) => webFeatures[f.key]).map(
        (f) => f.label
      );
      if (chosenFeatures.length > 0) {
        list.push({
          productName: `Core Features: ${chosenFeatures.join("; ")}`,
          quantity: 1,
        });
      }
      if (webExistingUrl.trim()) {
        list.push({
          productName: `Reference Website / Competitor: ${webExistingUrl.trim()}`,
          quantity: 1,
        });
      }
    } else if (isPodcast) {
      list.push({
        productName: `Podcasting Production: ${podcastEpisodeCount} (${podcastHostGuestFormat})`,
        quantity: 1,
      });
      const chosenPodcastServices = [];
      if (podcastServices.audioRecording) chosenPodcastServices.push("Multi-Mic Studio Audio");
      if (podcastServices.videoRecording4k) chosenPodcastServices.push("4K Multi-Cam Video Filming");
      if (podcastServices.editingMastering) chosenPodcastServices.push("Post-Production Editing & Color");
      if (podcastServices.distribution) chosenPodcastServices.push("Spotify & YouTube Distribution");
      if (podcastServices.socialClips) chosenPodcastServices.push("Reels / Shorts Vertical Clips");
      if (chosenPodcastServices.length > 0) {
        list.push({
          productName: `Services Included: ${chosenPodcastServices.join("; ")}`,
          quantity: 1,
        });
      }
      list.push({
        productName: `Studio / Location: ${podcastRecordingLocation}`,
        quantity: 1,
      });
      if (podcastTopic.trim()) {
        list.push({
          productName: `Podcast Topic / Name: ${podcastTopic.trim()}`,
          quantity: 1,
        });
      }
    } else if (isDigitalMarketing) {
      list.push({
        productName: `Digital Marketing Strategy & Campaigns — Budget: ${marketingBudget}`,
        quantity: 1,
      });
      const chosenMarketingChannels = [];
      if (marketingChannels.seo) chosenMarketingChannels.push("SEO Search Ranking");
      if (marketingChannels.googleAds) chosenMarketingChannels.push("Google Search & Display Ads");
      if (marketingChannels.metaAds) chosenMarketingChannels.push("Meta (Facebook & Instagram) Ads");
      if (marketingChannels.socialMedia) chosenMarketingChannels.push("Social Media Growth");
      if (marketingChannels.contentWriting) chosenMarketingChannels.push("Ad Copywriting & Creatives");
      if (marketingChannels.analytics) chosenMarketingChannels.push("GA4 & Conversion Tracking");
      if (chosenMarketingChannels.length > 0) {
        list.push({
          productName: `Target Channels: ${chosenMarketingChannels.join("; ")}`,
          quantity: 1,
        });
      }
      list.push({
        productName: `Audience & Goal: ${marketingTargetAudience} ➔ ${marketingPrimaryGoal}`,
        quantity: 1,
      });
      if (marketingWebsiteUrl.trim()) {
        list.push({
          productName: `Target Website URL: ${marketingWebsiteUrl.trim()}`,
          quantity: 1,
        });
      }
    } else {
      // General package fallback
      if (selectedPackageId) {
        const pkg = service.packages?.find((p: any) => p._id === selectedPackageId);
        if (pkg) {
          list.push({ productName: `${service.name} — ${pkg.name}`, quantity: 1 });
        }
      }
    }

    // Add extra user-specified custom items (including inventory details if linked)
    quotationItems.forEach((it) => {
      list.push({
        productId: it.productId,
        productName: it.productName,
        quantity: it.quantity,
        brand: it.brand,
        sku: it.sku,
        variant: it.variant,
        unitPrice: it.basePrice,
        gstRate: it.gstRate,
      });
    });

    // Fallback if empty
    if (list.length === 0) {
      list.push({
        productName: `${service.name} Standard Requirement`,
        quantity: 1,
      });
    }

    // Deduplicate and merge items by unique key so each item appears exactly once with merged quantity
    const mergedList: {
      productId?: string;
      productName: string;
      quantity: number;
      brand?: string;
      sku?: string;
      variant?: string;
      unitPrice?: number;
      gstRate?: number;
    }[] = [];

    const itemIndexMap = new Map<string, number>();

    for (const item of list) {
      const key = (item.productId || item.productName).trim().toLowerCase();
      if (itemIndexMap.has(key)) {
        const idx = itemIndexMap.get(key)!;
        mergedList[idx].quantity += item.quantity;
        if (!mergedList[idx].productId && item.productId) {
          mergedList[idx].productId = item.productId;
          mergedList[idx].brand = item.brand;
          mergedList[idx].sku = item.sku;
          mergedList[idx].variant = item.variant;
          mergedList[idx].unitPrice = item.unitPrice;
          mergedList[idx].gstRate = item.gstRate;
        }
      } else {
        itemIndexMap.set(key, mergedList.length);
        mergedList.push({ ...item });
      }
    }

    return mergedList;
  }, [
    isCctvRepair,
    cctvRepairProblem,
    cctvRepairFaultyCount,
    cctvRepairCameraQty,
    cctvRepairCameraType,
    cctvRepairBrand,
    isCctvAmc,
    cctvAmcScope,
    cctvAmcCameraCount,
    cctvAmcSystemType,
    cctvAmcBrand,
    isCctvUpgrade,
    cctvUpgradeCurrentQty,
    cctvUpgradeCurrentSystem,
    cctvUpgradeTargetQty,
    cctvUpgradeObjectives,
    isCctvSurvey,
    cctvSurveyPurpose,
    cctvSurveyPropertyType,
    cctvSurveyEstCameras,
    cctvSurveyKeyAreas,
    isCctvBuy,
    selectedProductsCheckboxes,
    availableProducts,
    selectedProductVariants,
    selectedProductQuantities,
    cctvBuyIncludeInstallation,
    isCctvInstall,
    cctvSelectedCameraTypes,
    cctvCameraQuantities,
    cctvCameraBrands,
    cctvCameraModels,
    cctvBrands,
    cctvAllModels,
    cctvInstallationRequired,
    cctvCableLength,
    cctvCableType,
    cctvTotalCameras,
    cctvDvrChannels,
    hasAnalog,
    cctvSdCardEnabled,
    cctvSdCardCapacity,
    cctvSdCardQuantity,
    cctvHddCapacity,
    cctvRackType,
    cctvNetworkRack,
    cctvMonitorMounting,
    isNetTroubleshoot,
    netTroubleIssue,
    netTroubleAffectedDevices,
    netTroubleExistingEquipment,
    isNetWifi,
    netWifiStandard,
    netWifiApCount,
    netWifiCoverage,
    isNetCabling,
    isNetServer,
    netServerType,
    netServerCapacity,
    netServerUsers,
    isNetSecurity,
    netSecurityFirewall,
    netSecurityUsers,
    isNetAmc,
    netAmcFrequency,
    netAmcUsers,
    netAmcDevices,
    isNetSurvey,
    isNetworking,
    networkPremisesType,
    networkUsers,
    networkEquipmentSelected,
    networkEquipmentQuantities,
    networkStructuredCabling,
    networkCableType,
    networkLanPoints,
    networkCableLength,
    networkWifiRequirement,
    isWebEcommerce,
    webEcomProducts,
    webEcomGateways,
    webEcomShipping,
    webEcomFeatures,
    webHostingStatus,
    webExistingUrl,
    isWebRedesignOrSeo,
    webRedesignScope,
    webRedesignGoals,
    webTimeline,
    isWebDesigning,
    webProjectType,
    webPageCount,
    webContentReadiness,
    webFeatures,
    isPodcast,
    podcastEpisodeCount,
    podcastHostGuestFormat,
    podcastServices,
    podcastRecordingLocation,
    podcastTopic,
    isDigitalMarketing,
    marketingBudget,
    marketingChannels,
    marketingTargetAudience,
    marketingPrimaryGoal,
    marketingWebsiteUrl,
    selectedPackageId,
    service.packages,
    service.name,
    quotationItems,
  ]);

  // Submit Quotation Request to Backend with validation and smooth scrolling
  const handleSubmitQuotation = async () => {
    // 1. Validate Items
    if (finalItemsToSubmit.length === 0) {
      toast({
        title: "Product / Service Required",
        description:
          "Please select or add at least one camera, item, or scope requirement.",
        variant: "destructive",
      });
      productsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // 1b. Validate Website URL if Redesign / SEO
    if (isWebRedesignOrSeo && !webExistingUrl.trim()) {
      toast({
        title: "Website URL Required",
        description: "Please enter your existing website URL for our technical audit & redesign quote.",
        variant: "destructive",
      });
      requirementsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // 2. Validate Preferred Date
    if (!date) {
      toast({
        title: "Preferred Date Required",
        description: (isWebDesigning || isDigitalMarketing)
          ? "Please choose your preferred discussion date."
          : "Please choose your preferred site visit date.",
        variant: "destructive",
      });
      scheduleRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // 3. Validate Service Location (Mandatory for CCTV & Networking physical visits)
    if (!isWebDesigning && !isDigitalMarketing && !address.trim() && !formattedAddress.trim()) {
      toast({
        title: "Service Location Required",
        description:
          "Please pin your installation address on the map or enter your location.",
        variant: "destructive",
      });
      locationRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // 4. Validate Customer Details
    if (!customerName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      customerDetailsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    const cleanedPhone = customerPhone.replace(/[\s+-]/g, "");
    const isPhoneValid = /^(?:\+91|0)?[6-9]\d{9}$/.test(cleanedPhone);
    if (!customerPhone.trim() || !isPhoneValid) {
      toast({
        title: "Valid Mobile Required",
        description:
          "Please enter a valid 10-digit mobile number for quotation updates.",
        variant: "destructive",
      });
      customerDetailsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    setSubmitting(true);
    try {
      const token =
        localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) ||
        localStorage.getItem("token") ||
        "";

      const payload = {
        fullName: customerName.trim(),
        mobile: customerPhone.trim(),
        email: customerEmail.trim() || undefined,
        whatsapp: customerPhone.trim(),
        serviceCategory: serviceCategoryLabel,
        subcategory: isPodcast
          ? "Podcasting"
          : isDigitalMarketing
          ? "Digital Marketing"
          : service.name,
        items: finalItemsToSubmit,
        propertyType: isNetworking
          ? networkPremisesType
          : isWebDesigning || isDigitalMarketing
          ? undefined
          : isCctvRepair
          ? `${cctvRepairCameraQty} ${cctvRepairCameraType}`
          : isCctvAmc
          ? `${cctvAmcCameraCount} (${cctvAmcSystemType})`
          : isCctvUpgrade
          ? cctvUpgradeCurrentSystem
          : isCctvSurvey
          ? cctvSurveyPropertyType
          : cctvPropertyType || undefined,
        additionalRequirements: notes.trim() || undefined,
        voiceNote: voiceNoteData
          ? {
              url: voiceNoteData.url,
              duration: voiceNoteData.duration,
              filename: voiceNoteData.filename,
              mimeType: voiceNoteData.mimeType,
            }
          : undefined,
        locality: isWebDesigning || isDigitalMarketing
          ? (city || area || "Bangalore / Remote")
          : (area || district || city || (address ? address.split(",")[0] : "Bangalore")),
        pincode: pincode || undefined,
        address: isWebDesigning || isDigitalMarketing
          ? (formattedAddress || address || (isPodcast ? "TechBes Soundproof Studio / Bangalore" : "Online / Remote Digital Marketing Delivery"))
          : (formattedAddress || address),
        latitude: latitude || 12.9716,
        longitude: longitude || 77.5946,
        preferredVisitDate: date || undefined,
        preferredVisitTime: time || undefined,
        source: "Website Quotation Modal",
      };

      const res = await fetch("/api/v2/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit quotation request.");
      }

      setSubmittedQuote(data.data);
      toast({
        title: "Quotation Request Submitted!",
        description: `Request #${data.data.requestId} has been sent to our engineering team.`,
      });
    } catch (err: any) {
      toast({
        title: "Submission Error",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const currentSuggestions = useMemo(() => {
    const baseList =
      CATEGORY_ITEM_SUGGESTIONS[serviceCategoryLabel] ||
      CATEGORY_ITEM_SUGGESTIONS["CCTV"];

    if (!isInstallNewCctv) return baseList;

    // Filter out any quick suggestions whose camera type is already selected above
    return baseList.filter((suggestion) => {
      const matchedCam = findMatchingCameraType(suggestion);
      if (matchedCam && cctvSelectedCameraTypes[matchedCam]) {
        return false;
      }
      return true;
    });
  }, [serviceCategoryLabel, isInstallNewCctv, cctvSelectedCameraTypes]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-4xl rounded-[28px] p-6 sm:p-8 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.14)] border border-slate-100">
        <DialogHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              {serviceCategoryLabel} Quotation
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              No Upfront Payment
            </span>
          </div>
          <DialogTitle className="text-2xl font-black text-slate-900 mt-2">
            Request Quotation: {service.name}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-medium">
            Fill in your requirements below. Our engineering team prepares custom
            itemized pricing with warranties and sends the quote to your customer
            portal & WhatsApp.
          </DialogDescription>
        </DialogHeader>

        {submittedQuote ? (
          /* SUCCESS CONFIRMATION VIEW (NO CHECKOUT / PAYMENT) */
          <div className="py-8 px-4 text-center space-y-6 animate-fadeIn">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-wider rounded-full">
                Request ID: {submittedQuote.requestId}
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                Quotation Request Received!
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
                Thank you,{" "}
                <span className="font-bold text-slate-800">
                  {submittedQuote.fullName}
                </span>
                ! Your requirement containing{" "}
                <span className="font-bold text-slate-800">
                  {submittedQuote.itemsCount} item(s)
                </span>{" "}
                has been submitted to TechBes engineering.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 max-w-md mx-auto text-left text-xs space-y-2.5 text-slate-600">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Service Category:</span>
                <span className="font-bold text-slate-800">
                  {submittedQuote.serviceCategory}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Service:</span>
                <span className="font-bold text-slate-800">{service.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Area / Locality:</span>
                <span className="font-bold text-slate-800">
                  {submittedQuote.locality}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Status:</span>
                <span className="font-bold text-amber-600">
                  Under Engineering Review
                </span>
              </div>
              {voiceNoteData && (
                <div className="flex justify-between border-t border-slate-200 pt-2">
                  <span className="font-semibold text-slate-500">Voice Note:</span>
                  <span className="font-bold text-emerald-600">
                    Audio Note Attached 🎙️
                  </span>
                </div>
              )}
            </div>

            <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-4 text-xs text-blue-900 max-w-md mx-auto text-left flex gap-3">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">
                <strong>Next Step:</strong> You will receive a WhatsApp message and
                portal alert as soon as our engineers finalize itemized pricing. You can
                then review rates and click <strong>Pay Now to Book</strong>.
              </span>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSubmittedQuote(null);
                  onOpenChange(false);
                }}
                className="rounded-xl font-bold text-xs h-10 px-5"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setSubmittedQuote(null);
                  onOpenChange(false);
                  router.push("/dashboard/quotes");
                }}
                className="rounded-xl font-bold text-xs h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
              >
                View in Customer Portal
              </Button>
            </div>
          </div>
        ) : (
          /* ONE SINGLE SCROLLABLE QUOTATION FORM */
          <div className="space-y-8 mt-5">
            {/* ────────── SECTION 1: SERVICE SPECIFIC REQUIREMENTS ────────── */}
            <section ref={requirementsRef} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <div className="w-2 h-4 bg-blue-600 rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
                  {service.name.toUpperCase()} SPECIFICATIONS
                </h3>
              </div>

              {/* ────── 1. WEB DESIGNING SERVICES ────── */}
              {isWebDesigning ? (
                <div className="space-y-4">
                  {isWebRedesignOrSeo ? (
                    /* Redesign / SEO / Maintenance / Marketing */
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                          <span>Target Website / Existing Domain URL <span className="text-rose-500">*</span></span>
                          <span className="text-[10px] font-bold text-blue-600 uppercase">Mandatory for Audit</span>
                        </label>
                        <input
                          type="url"
                          required
                          placeholder="https://yourwebsite.com"
                          value={webExistingUrl}
                          onChange={(e) => setWebExistingUrl(e.target.value)}
                          className="h-10 w-full rounded-xl border border-slate-200 px-3.5 bg-white text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 block">
                          Service Focus &amp; Scope <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Complete Visual Modernization & Mobile UX Revamp",
                            "Speed Optimization & Core Web Vitals Enhancement",
                            "Monthly Website Maintenance & Security Patching",
                            "On-Page SEO & Google Search Ranking Growth",
                            "Digital Marketing & Lead Generation Setup",
                            "UI/UX Design & Conversion Rate Optimization",
                          ].map((scope) => (
                            <button
                              type="button"
                              key={scope}
                              onClick={() => setWebRedesignScope(scope)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-xl border text-left transition ${
                                webRedesignScope === scope
                                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              {scope}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700 block">
                            Primary Goal <span className="text-rose-500">*</span>
                          </label>
                          <select
                            value={webRedesignGoals}
                            onChange={(e) => setWebRedesignGoals(e.target.value)}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                          >
                            <option value="Improve Google PageSpeed, SEO & Conversions">Improve Google PageSpeed, SEO & Conversions</option>
                            <option value="Modern High-End Brand Appearance">Modern High-End Brand Appearance</option>
                            <option value="Fix Bugs, Broken Links & Outdated Plugins">Fix Bugs, Broken Links & Outdated Plugins</option>
                            <option value="Increase Monthly Inbound Phone Calls & Leads">Increase Monthly Inbound Phone Calls & Leads</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700 block">
                            Preferred Delivery Timeline
                          </label>
                          <select
                            value={webTimeline}
                            onChange={(e) => setWebTimeline(e.target.value)}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                          >
                            <option value="Urgent (Within 1 - 2 Weeks)">Urgent (Within 1 - 2 Weeks)</option>
                            <option value="Standard (2 - 4 Weeks)">Standard (2 - 4 Weeks)</option>
                            <option value="Flexible / Ongoing Monthly Scope">Flexible / Ongoing Monthly Scope</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : isWebEcommerce ? (
                    /* E-Commerce Website */
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 block">
                          Product Catalog Size <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Up to 50 Products (Starter Store)",
                            "50 - 200 Products (Standard Catalog)",
                            "200 - 1000 Products (Comprehensive)",
                            "1000+ Products (Enterprise Mega Store)",
                          ].map((p) => (
                            <button
                              type="button"
                              key={p}
                              onClick={() => setWebEcomProducts(p)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition ${
                                webEcomProducts === p
                                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 block">
                            Payment Gateway Requirement <span className="text-rose-500">*</span>
                          </label>
                          <select
                            value={webEcomGateways}
                            onChange={(e) => setWebEcomGateways(e.target.value)}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                          >
                            <option value="Razorpay / PhonePe (UPI, Cards, Netbanking)">Razorpay / PhonePe (UPI, Cards, Netbanking)</option>
                            <option value="Cash on Delivery (COD) + UPI QR">Cash on Delivery (COD) + UPI QR</option>
                            <option value="Stripe (International USD + Indian INR)">Stripe (International USD + Indian INR)</option>
                            <option value="Multiple Gateways (Razorpay + PayTM + Cashfree)">Multiple Gateways (Razorpay + PayTM + Cashfree)</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 block">
                            Shipping Logistics Integration
                          </label>
                          <select
                            value={webEcomShipping}
                            onChange={(e) => setWebEcomShipping(e.target.value)}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                          >
                            <option value="Shiprocket / Automated Courier Dispatch">Shiprocket / Automated Courier Dispatch</option>
                            <option value="Delhivery Direct API">Delhivery Direct API</option>
                            <option value="Flat Rate Shipping / Free Shipping Rules">Flat Rate Shipping / Free Shipping Rules</option>
                            <option value="Hyperlocal Delivery (Dunzo / Borzo API)">Hyperlocal Delivery (Dunzo / Borzo API)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 bg-slate-50/70 rounded-2xl p-4 border border-slate-200/70">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            Domain &amp; Cloud Hosting
                          </label>
                          <select
                            value={webHostingStatus}
                            onChange={(e) => setWebHostingStatus(e.target.value)}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                          >
                            <option value="Need Domain & High-Speed Cloud Hosting">Need Domain & High-Speed Cloud Hosting</option>
                            <option value="Already Have Domain & Hosting">Already Have Domain & Hosting</option>
                            <option value="Need Cloud Hosting Migration">Need Cloud Hosting Migration</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            Existing Store URL (if migrating)
                          </label>
                          <input
                            type="url"
                            placeholder="https://currentstore.com (optional)"
                            value={webExistingUrl}
                            onChange={(e) => setWebExistingUrl(e.target.value)}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700 placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* New / Business Website / Landing Page / Web App */
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 block">
                          Website / Project Type <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Corporate Business Website",
                            "High-Converting Landing Page",
                            "Custom Web Application / Portal",
                            "Startup / Technology Platform",
                            "Services & Portfolio Showcase",
                          ].map((t) => (
                            <button
                              type="button"
                              key={t}
                              onClick={() => setWebProjectType(t)}
                              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition ${
                                webProjectType === t
                                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 block">
                          Approximate Page Count <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Single Page (Landing Page)",
                            "5 - 10 Pages (Standard Business)",
                            "10 - 25 Pages (Comprehensive)",
                            "25+ Pages / Custom SaaS Scope",
                          ].map((p) => (
                            <button
                              type="button"
                              key={p}
                              onClick={() => setWebPageCount(p)}
                              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition ${
                                webPageCount === p
                                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 bg-slate-50/70 rounded-2xl p-4 border border-slate-200/70">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            Domain &amp; Cloud Hosting Status
                          </label>
                          <select
                            value={webHostingStatus}
                            onChange={(e) => setWebHostingStatus(e.target.value)}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                          >
                            <option value="Need Domain & High-Speed Cloud Hosting">Need Domain & High-Speed Cloud Hosting</option>
                            <option value="Already Have Domain & Hosting">Already Have Domain & Hosting</option>
                            <option value="Need Domain Transfer / Cloud Setup">Need Domain Transfer / Cloud Setup</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            Content &amp; Graphics Readiness
                          </label>
                          <select
                            value={webContentReadiness}
                            onChange={(e) => setWebContentReadiness(e.target.value)}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                          >
                            <option value="I have ready text content & product images">I have ready text content & product images</option>
                            <option value="TechBes to create copywriting, content & graphics">TechBes to create copywriting, content & graphics</option>
                            <option value="Mix of ready content and custom designs">Mix of ready content and custom designs</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block">
                          Reference Websites or Example URLs (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. https://competitor.com, https://reference-site.com"
                          value={webExistingUrl}
                          onChange={(e) => setWebExistingUrl(e.target.value)}
                          className="h-10 w-full rounded-xl border border-slate-200 px-3.5 bg-white text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : isNetworking ? (
                /* ────── 2. NETWORKING SERVICES ────── */
                <div className="space-y-4">
                  {isNetTroubleshoot ? (
                    /* Troubleshooting */
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 block">
                          Primary Network Issue / Symptom <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Internet Frequent Disconnections / Packet Drops",
                            "Slow Bandwidth / High Latency Across LAN",
                            "Wi-Fi Dead Zones & Signal Dropping Between Rooms",
                            "Local Printer / Network Shared Folders Unreachable",
                            "IP Address Conflict & DHCP Allocation Failures",
                            "Firewall / VPN Blocking Office Applications",
                          ].map((iss) => (
                            <button
                              type="button"
                              key={iss}
                              onClick={() => setNetTroubleIssue(iss)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-xl border text-left transition ${
                                netTroubleIssue === iss
                                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              {iss}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 block">
                            Affected Workstations / Devices <span className="text-rose-500">*</span>
                          </label>
                          <select
                            value={netTroubleAffectedDevices}
                            onChange={(e) => setNetTroubleAffectedDevices(e.target.value)}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                          >
                            <option value="1 - 5 Workstations / Isolated">1 - 5 Workstations / Isolated</option>
                            <option value="6 - 15 Devices in Specific Department">6 - 15 Devices in Specific Department</option>
                            <option value="Whole Office / Multiple Users">Whole Office / Multiple Users</option>
                            <option value="Entire Building / Multi-Floor Down">Entire Building / Multi-Floor Down</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 block">
                            Existing Network Hardware In Use
                          </label>
                          <select
                            value={netTroubleExistingEquipment}
                            onChange={(e) => setNetTroubleExistingEquipment(e.target.value)}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                          >
                            <option value="ISP Router + Unmanaged Switch + Wi-Fi APs">ISP Router + Unmanaged Switch + Wi-Fi APs</option>
                            <option value="Managed PoE Switch + Enterprise Router + APs">Managed PoE Switch + Enterprise Router + APs</option>
                            <option value="Mesh Wi-Fi System Only">Mesh Wi-Fi System Only</option>
                            <option value="Custom Server Rack & Hardware Firewall">Custom Server Rack & Hardware Firewall</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : isNetWifi ? (
                    /* Wi-Fi & Optimization */
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 block">
                          Wi-Fi Architecture &amp; Standard <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Dual-Band Wi-Fi 6 (Seamless Roaming)",
                            "High-Density Office APs (50+ devices)",
                            "Multi-SSID with Guest Network Isolation",
                            "Mesh Wi-Fi System for Multi-Floor Villa",
                            "Long-Range Outdoor Directional APs",
                          ].map((std) => (
                            <button
                              type="button"
                              key={std}
                              onClick={() => setNetWifiStandard(std)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition ${
                                netWifiStandard === std
                                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              {std}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 block">
                            Access Points Required <span className="text-rose-500">*</span>
                          </label>
                          <div className="flex items-center border border-slate-200 rounded-xl bg-white h-9 px-2 shadow-xs">
                            <button
                              type="button"
                              onClick={() => setNetWifiApCount((c) => Math.max(1, c - 1))}
                              className="h-7 w-7 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded"
                            >
                              -
                            </button>
                            <span className="flex-1 text-center text-xs font-bold text-slate-800">
                              {netWifiApCount} AP Unit(s)
                            </span>
                            <button
                              type="button"
                              onClick={() => setNetWifiApCount((c) => c + 1)}
                              className="h-7 w-7 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 block">
                            Premises Coverage Area
                          </label>
                          <select
                            value={netWifiCoverage}
                            onChange={(e) => setNetWifiCoverage(e.target.value)}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                          >
                            <option value="Single Floor (~1,500 - 2,500 sq.ft)">Single Floor (~1,500 - 2,500 sq.ft)</option>
                            <option value="Duplex / 2-Floor Facility (~3,500 sq.ft)">Duplex / 2-Floor Facility (~3,500 sq.ft)</option>
                            <option value="Multi-Floor Commercial Building (3+ Floors)">Multi-Floor Commercial Building (3+ Floors)</option>
                            <option value="Warehouse / Open Industrial Floor">Warehouse / Open Industrial Floor</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : isNetServer ? (
                    /* Server & NAS Storage */
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 block">
                          Server / Storage Architecture <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Synology / QNAP NAS Storage Unit",
                            "Local Windows / Linux Shared File Server",
                            "Network Automated Backup & Snapshot Server",
                            "High-Speed 10G Video Editing Local Storage",
                          ].map((t) => (
                            <button
                              type="button"
                              key={t}
                              onClick={() => setNetServerType(t)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition ${
                                netServerType === t
                                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 block">
                            Storage Usable Capacity <span className="text-rose-500">*</span>
                          </label>
                          <select
                            value={netServerCapacity}
                            onChange={(e) => setNetServerCapacity(e.target.value)}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                          >
                            <option value="2TB Storage (RAID 1 Mirroring)">2TB Storage (RAID 1 Mirroring)</option>
                            <option value="4TB Storage (RAID 1 Mirroring)">4TB Storage (RAID 1 Mirroring)</option>
                            <option value="8TB Storage (RAID 5 Parity)">8TB Storage (RAID 5 Parity)</option>
                            <option value="16TB Storage (RAID 5/6 High Availability)">16TB Storage (RAID 5/6 High Availability)</option>
                            <option value="32TB+ Enterprise Array">32TB+ Enterprise Array</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 block">
                            Connected Users
                          </label>
                          <select
                            value={netServerUsers}
                            onChange={(e) => setNetServerUsers(e.target.value)}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                          >
                            <option value="1 - 10 Users">1 - 10 Users</option>
                            <option value="10 - 25 Users">10 - 25 Users</option>
                            <option value="26 - 50 Users">26 - 50 Users</option>
                            <option value="50+ Users">50+ Users</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : isNetSecurity ? (
                    /* Network Security */
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 block">
                          Security &amp; Firewall Scope <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Hardware Firewall (Fortinet / SonicWall / Sophos)",
                            "Guest Wi-Fi Isolation & Captive Portal",
                            "Secure IPSec / SSL VPN for Remote Staff",
                            "Dual-WAN Failover (Auto Broadband Backup)",
                            "Content Filtering & URL Category Blocking",
                          ].map((sec) => (
                            <button
                              type="button"
                              key={sec}
                              onClick={() => setNetSecurityFirewall(sec)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition ${
                                netSecurityFirewall === sec
                                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              {sec}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block">
                          Protected Workstation &amp; User Capacity <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={netSecurityUsers}
                          onChange={(e) => setNetSecurityUsers(e.target.value)}
                          className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                        >
                          <option value="10 - 25 Connected Users">10 - 25 Connected Users</option>
                          <option value="25 - 50 Connected Users">25 - 50 Connected Users</option>
                          <option value="51 - 100 Connected Users">51 - 100 Connected Users</option>
                          <option value="100+ Enterprise Capacity">100+ Enterprise Capacity</option>
                        </select>
                      </div>
                    </div>
                  ) : isNetAmc ? (
                    /* Network AMC */
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 block">
                          AMC Maintenance Scope &amp; Frequency <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Monthly Health Check & Proactive Monitoring",
                            "Bi-Monthly Preventive Audit (6 Visits/Year)",
                            "Quarterly Scheduled Maintenance (4 Visits/Year)",
                            "Comprehensive On-Call Support with 4hr SLA",
                          ].map((freq) => (
                            <button
                              type="button"
                              key={freq}
                              onClick={() => setNetAmcFrequency(freq)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition ${
                                netAmcFrequency === freq
                                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              {freq}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 block">
                            Covered Office Users
                          </label>
                          <select
                            value={netAmcUsers}
                            onChange={(e) => setNetAmcUsers(e.target.value)}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                          >
                            <option value="1 - 10 Users">1 - 10 Users</option>
                            <option value="11 - 25 Users">11 - 25 Users</option>
                            <option value="26 - 50 Users">26 - 50 Users</option>
                            <option value="50+ Enterprise Users">50+ Enterprise Users</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 block">
                            Active Network Hardware Devices
                          </label>
                          <select
                            value={netAmcDevices}
                            onChange={(e) => setNetAmcDevices(e.target.value)}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                          >
                            <option value="Up to 5 Network Switches & Routers">Up to 5 Network Switches & Routers</option>
                            <option value="6 - 15 Switches, Routers & APs">6 - 15 Switches, Routers & APs</option>
                            <option value="16+ Multi-Rack Enterprise Infrastructure">16+ Multi-Rack Enterprise Infrastructure</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* General Office Setup / Structured Cabling / Network Upgrade */
                    <div className="space-y-4">
                      <div className="space-y-2.5">
                        <label className="text-xs font-bold text-slate-700 block">
                          Premises / Facility Type <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Small Office (1-10 Pax)",
                            "Corporate / Enterprise",
                            "Multi-Floor Building",
                            "Warehouse / Factory",
                            "Co-Working Space",
                            "Home Office / Villa",
                            "Retail Store / Branch",
                          ].map((t) => (
                            <button
                              type="button"
                              key={t}
                              onClick={() => setNetworkPremisesType(t)}
                              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition ${
                                networkPremisesType === t
                                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <label className="text-xs font-bold text-slate-700 block">
                          Active Users / Workstations <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "1 - 10 Users",
                            "11 - 25 Users",
                            "26 - 50 Users",
                            "51 - 100 Users",
                            "100+ Enterprise",
                          ].map((u) => (
                            <button
                              type="button"
                              key={u}
                              onClick={() => setNetworkUsers(u)}
                              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition ${
                                networkUsers === u
                                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              {u}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* ────── 3. CCTV SERVICES ────── */
                <div className="space-y-4">
                  {isCctvRepair ? (
                    /* CCTV Repair Form */
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 block">
                          Primary CCTV Issue / Problem <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Camera Not Working / No Video Display",
                            "Black Screen / Video Signal Loss",
                            "Recording / Hard Drive Playback Error",
                            "DVR / NVR Continuous Beeping or Rebooting",
                            "Cable / Power Adapter (SMPS) Burnt",
                            "Mobile Remote Viewing Offline",
                            "Blurry Lens / Night Vision IR Failure",
                          ].map((prob) => (
                            <button
                              type="button"
                              key={prob}
                              onClick={() => setCctvRepairProblem(prob)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-xl border text-left transition ${
                                cctvRepairProblem === prob
                                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              {prob}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 block">
                            Existing System Type <span className="text-rose-500">*</span>
                          </label>
                          <select
                            value={cctvRepairCameraType}
                            onChange={(e) => setCctvRepairCameraType(e.target.value)}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                          >
                            <option value="Analog HD (Coaxial)">Analog HD (Coaxial)</option>
                            <option value="IP Network Camera (PoE / Cat6)">IP Network Camera (PoE / Cat6)</option>
                            <option value="Wireless / WiFi Smart Camera">Wireless / WiFi Smart Camera</option>
                            <option value="Mixed / Don't Know">Mixed / Don&apos;t Know</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 block">
                            Existing Brand (if known)
                          </label>
                          <select
                            value={cctvRepairBrand}
                            onChange={(e) => setCctvRepairBrand(e.target.value)}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                          >
                            <option value="CP Plus">CP Plus</option>
                            <option value="Hikvision">Hikvision</option>
                            <option value="Dahua / IMOU">Dahua / IMOU</option>
                            <option value="HiFocus / Prama">HiFocus / Prama</option>
                            <option value="Other / Unknown">Other / Unknown</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 block">
                            Number of Faulty Devices
                          </label>
                          <div className="flex items-center border border-slate-200 rounded-xl bg-white h-9 px-2 shadow-xs">
                            <button
                              type="button"
                              onClick={() => setCctvRepairFaultyCount((c) => Math.max(1, c - 1))}
                              className="h-7 w-7 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded"
                            >
                              -
                            </button>
                            <span className="flex-1 text-center text-xs font-bold text-slate-800">
                              {cctvRepairFaultyCount} Device(s)
                            </span>
                            <button
                              type="button"
                              onClick={() => setCctvRepairFaultyCount((c) => c + 1)}
                              className="h-7 w-7 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : isCctvAmc ? (
                    /* CCTV Maintenance AMC */
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 block">
                          Inspection Frequency &amp; AMC Scope <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Quarterly Preventive Visits (4 Visits/Year)",
                            "Bi-Monthly Preventive Visits (6 Visits/Year)",
                            "Monthly Comprehensive Maintenance (12 Visits/Year)",
                            "Comprehensive AMC (Includes Repair Labour & Priority Visits)",
                          ].map((scope) => (
                            <button
                              type="button"
                              key={scope}
                              onClick={() => setCctvAmcScope(scope)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-xl border text-left transition ${
                                cctvAmcScope === scope
                                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              {scope}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 block">
                            Camera Quantity Installed <span className="text-rose-500">*</span>
                          </label>
                          <select
                            value={cctvAmcCameraCount}
                            onChange={(e) => setCctvAmcCameraCount(e.target.value)}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                          >
                            <option value="1 - 8 Cameras">1 - 8 Cameras</option>
                            <option value="9 - 16 Cameras">9 - 16 Cameras</option>
                            <option value="17 - 32 Cameras">17 - 32 Cameras</option>
                            <option value="32+ Enterprise Scale">32+ Enterprise Scale</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 block">
                            System Architecture
                          </label>
                          <select
                            value={cctvAmcSystemType}
                            onChange={(e) => setCctvAmcSystemType(e.target.value)}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                          >
                            <option value="IP Network Cameras">IP Network Cameras</option>
                            <option value="Analog HD Cameras">Analog HD Cameras</option>
                            <option value="Mixed Setup">Mixed Setup</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 block">
                            Installed Brand
                          </label>
                          <select
                            value={cctvAmcBrand}
                            onChange={(e) => setCctvAmcBrand(e.target.value)}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                          >
                            <option value="Hikvision / CP Plus">Hikvision / CP Plus</option>
                            <option value="Dahua">Dahua</option>
                            <option value="Honeywell / Bosch">Honeywell / Bosch</option>
                            <option value="Mixed / Other">Mixed / Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : isCctvUpgrade ? (
                    /* CCTV Upgrade */
                    <div className="space-y-4">
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 block">
                            Existing Setup <span className="text-rose-500">*</span>
                          </label>
                          <select
                            value={cctvUpgradeCurrentSystem}
                            onChange={(e) => setCctvUpgradeCurrentSystem(e.target.value)}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                          >
                            <option value="4-Channel Analog DVR System">4-Channel Analog DVR System</option>
                            <option value="8-Channel Analog DVR System">8-Channel Analog DVR System</option>
                            <option value="16-Channel DVR System">16-Channel DVR System</option>
                            <option value="Older IP NVR System">Older IP NVR System</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 block">
                            Current Camera Count
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={cctvUpgradeCurrentQty}
                            onChange={(e) => setCctvUpgradeCurrentQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 block">
                            Target Upgraded Camera Count
                          </label>
                          <input
                            type="number"
                            min={cctvUpgradeCurrentQty}
                            value={cctvUpgradeTargetQty}
                            onChange={(e) => setCctvUpgradeTargetQty(Math.max(cctvUpgradeCurrentQty, parseInt(e.target.value, 10) || cctvUpgradeCurrentQty))}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 block">
                          Upgrade Goals &amp; Deliverables <span className="text-rose-500">*</span>
                        </label>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {[
                            { key: "convertIp", label: "Convert Analog Cameras to 4K IP PoE" },
                            { key: "addCameras", label: "Add Extra Surveillance Cameras" },
                            { key: "upgradeHdd", label: "Upgrade Surveillance Storage Capacity (HDD)" },
                            { key: "mobileRemote", label: "Setup Mobile App Remote Viewing" },
                            { key: "replaceDvr", label: "Replace Faulty / Outdated DVR Unit" },
                          ].map((obj) => (
                            <label
                              key={obj.key}
                              className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                                cctvUpgradeObjectives[obj.key]
                                  ? "border-blue-500 bg-blue-50/20"
                                  : "border-slate-200 bg-white"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={!!cctvUpgradeObjectives[obj.key]}
                                onChange={(e) =>
                                  setCctvUpgradeObjectives((prev) => ({
                                    ...prev,
                                    [obj.key]: e.target.checked,
                                  }))
                                }
                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-xs font-bold text-slate-800">{obj.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : isCctvSurvey ? (
                    /* Free Site Survey */
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 block">
                          Property / Premises Type <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Home / Villa",
                            "Apartment Complex",
                            "Commercial Office",
                            "Retail Shop / Showroom",
                            "Warehouse / Factory",
                            "Industrial Plant",
                          ].map((t) => (
                            <button
                              type="button"
                              key={t}
                              onClick={() => setCctvSurveyPropertyType(t)}
                              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition ${
                                cctvSurveyPropertyType === t
                                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 block">
                            Survey Purpose <span className="text-rose-500">*</span>
                          </label>
                          <select
                            value={cctvSurveyPurpose}
                            onChange={(e) => setCctvSurveyPurpose(e.target.value)}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                          >
                            <option value="New CCTV Security Planning & Camera Placement">New CCTV Security Planning & Camera Placement</option>
                            <option value="Upgrade & Blind-Spot Security Audit">Upgrade & Blind-Spot Security Audit</option>
                            <option value="Commercial Facility Annual Maintenance Assessment">Commercial Facility Annual Maintenance Assessment</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 block">
                            Estimated Camera Requirement (Optional)
                          </label>
                          <select
                            value={cctvSurveyEstCameras}
                            onChange={(e) => setCctvSurveyEstCameras(e.target.value)}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                          >
                            <option value="1 - 4 Cameras">1 - 4 Cameras (Small Site)</option>
                            <option value="4 - 8 Cameras (Estimated)">4 - 8 Cameras (Medium Site)</option>
                            <option value="9 - 16 Cameras">9 - 16 Cameras (Large Site)</option>
                            <option value="16+ Enterprise Cameras">16+ Enterprise Cameras</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : isCctvBuy ? (
                    /* Buy CCTV Products Overview */
                    <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-200/60 space-y-3">
                      <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                        <PackageCheck className="w-4 h-4 text-blue-600" />
                        <span>Genuine Manufacturer Warranties (CP Plus, Hikvision, Dahua)</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                        Select hardware products below. We provide sealed box delivery across Bangalore with optional on-site fitting &amp; testing service.
                      </p>
                      <label className="flex items-center gap-2 pt-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cctvBuyIncludeInstallation}
                          onChange={(e) => setCctvBuyIncludeInstallation(e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-xs font-bold text-slate-800">
                          Include Professional On-Site Fitting &amp; Alignment Service (Optional)
                        </span>
                      </label>
                    </div>
                  ) : (
                    /* Install New CCTV */
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-slate-700 block">
                        Property Type <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Home",
                          "Apartment",
                          "Office",
                          "Shop",
                          "Warehouse",
                          "Factory",
                          "Other",
                        ].map((t) => (
                          <button
                            type="button"
                            key={t}
                            onClick={() => setCctvPropertyType(t)}
                            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition ${
                              cctvPropertyType === t
                                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* ────────── SECTION 2: HARDWARE & TECHNICAL SCOPE ────────── */}
            <section ref={productsRef} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <div className="w-2 h-4 bg-blue-600 rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
                  {isCctvRepair
                    ? "REPAIR & SPARE PARTS SCOPE"
                    : isCctvAmc
                    ? "ANNUAL MAINTENANCE COVERAGE"
                    : isCctvSurvey
                    ? "SURVEY FOCUS & REQUIREMENTS"
                    : isNetworking
                    ? "NETWORKING HARDWARE & CABLING"
                    : isWebDesigning
                    ? "WEBSITE FEATURES & SCOPE"
                    : "PRODUCTS & QUANTITIES"}
                </h3>
              </div>

              {/* Install New CCTV Technical Specifications */}
              {isInstallNewCctv && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-2">
                      Camera Types &amp; Quantities <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        "Dome Camera",
                        "Bullet Camera",
                        "PTZ Camera",
                        "WiFi Indoor Camera",
                        "WiFi Outdoor Camera",
                        "Analog Camera",
                        "4G Camera",
                      ].map((cType) => {
                        const isChecked = !!cctvSelectedCameraTypes[cType];
                        const qty = cctvCameraQuantities[cType] || 1;
                        return (
                          <div
                            key={cType}
                            className={`p-3 rounded-2xl border transition-all ${
                              isChecked
                                ? "border-blue-500 bg-blue-50/20 shadow-xs"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-800">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => handleToggleCameraType(cType, e.target.checked)}
                                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span>{cType}</span>
                              </label>

                              {isChecked && (
                                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white h-8 shadow-xs">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateCameraQty(cType, Math.max(qty - 1, 1))}
                                    className="h-full px-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100"
                                  >
                                    -
                                  </button>
                                  <span className="px-2 text-xs font-black text-slate-800">
                                    {qty}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateCameraQty(cType, qty + 1)}
                                    className="h-full px-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100"
                                  >
                                    +
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cabling & Installation */}
                  <div className="space-y-3 bg-slate-50/70 rounded-2xl p-4 border border-slate-200/70">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                      <input
                        type="checkbox"
                        checked={cctvInstallationRequired}
                        onChange={(e) =>
                          setCctvInstallationRequired(e.target.checked)
                        }
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Professional On-Site Installation &amp; Cabling Required</span>
                    </label>

                    {cctvInstallationRequired && (
                      <div className="grid gap-3 sm:grid-cols-2 pt-1">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            Cable Type
                          </label>
                          <select
                            value={cctvCableType}
                            onChange={(e) => setCctvCableType(e.target.value)}
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                          >
                            <option value="CAT6 Solid Copper">
                              CAT6 Solid Copper (Recommended for IP/PoE)
                            </option>
                            <option value="CAT6 CCA Standard">
                              CAT6 CCA Standard
                            </option>
                            <option value="3+1 Coaxial CCTV Cable">
                              3+1 Coaxial (For Analog Cameras)
                            </option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            Estimated Cable Length (meters)
                          </label>
                          <input
                            type="number"
                            min={0}
                            step={10}
                            value={cctvCableLength}
                            onChange={(e) =>
                              setCctvCableLength(Number(e.target.value))
                            }
                            className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* DVR / NVR & Storage HDD */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Recorder Channel Tier
                      </label>
                      <select
                        value={cctvDvrChannels}
                        onChange={(e) => {
                          setCctvDvrChannels(e.target.value);
                          setCctvDvrManualOverride(true);
                        }}
                        className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                      >
                        <option value="None">None / Not Required</option>
                        <option value="4 Channel">4 Channel Recorder</option>
                        <option value="8 Channel">8 Channel Recorder</option>
                        <option value="16 Channel">16 Channel Recorder</option>
                        <option value="32 Channel">32 Channel Recorder</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Surveillance Storage HDD
                      </label>
                      <select
                        value={cctvHddCapacity}
                        onChange={(e) => setCctvHddCapacity(e.target.value)}
                        className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                      >
                        <option value="">None / Existing Storage</option>
                        <option value="1TB">1TB Surveillance HDD</option>
                        <option value="2TB">2TB Surveillance HDD</option>
                        <option value="4TB">4TB Surveillance HDD</option>
                        <option value="6TB">6TB Surveillance HDD</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Buy CCTV Products Store List (NO CUSTOMER PRICES) */}
              {isBuyCctvProducts && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 block">
                    Select Products from Catalog <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid gap-2.5 sm:grid-cols-2 max-h-[220px] overflow-y-auto pr-1">
                    {availableProducts.map((p) => {
                      const pId = p._id || p.id;
                      const isChecked = !!selectedProductsCheckboxes[pId];
                      const qty = selectedProductQuantities[pId] || 1;
                      return (
                        <div
                          key={pId}
                          className={`p-3 rounded-2xl border transition-all ${
                            isChecked
                              ? "border-blue-500 bg-blue-50/20 shadow-xs"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  setSelectedProductsCheckboxes((prev) => ({
                                    ...prev,
                                    [pId]: e.target.checked,
                                  }));
                                  if (
                                    e.target.checked &&
                                    !selectedProductQuantities[pId]
                                  ) {
                                    setSelectedProductQuantities((prev) => ({
                                      ...prev,
                                      [pId]: 1,
                                    }));
                                  }
                                }}
                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="truncate max-w-[170px]">
                                {p.name || p.title}
                              </span>
                            </label>

                            {isChecked && (
                              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white h-7">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedProductQuantities((prev) => ({
                                      ...prev,
                                      [pId]: Math.max(
                                        (prev[pId] || 1) - 1,
                                        1
                                      ),
                                    }))
                                  }
                                  className="h-full px-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
                                >
                                  -
                                </button>
                                <span className="px-2 text-xs font-black text-slate-800">
                                  {qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedProductQuantities((prev) => ({
                                      ...prev,
                                      [pId]: (prev[pId] || 1) + 1,
                                    }))
                                  }
                                  className="h-full px-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Structured Cabling Section for Networking */}
              {isNetworking && (isNetCabling || isNetOfficeOrCabling) && (
                <div className="space-y-3 bg-slate-50/70 rounded-2xl p-4 border border-slate-200/70">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={networkStructuredCabling}
                      onChange={(e) => setNetworkStructuredCabling(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Structured Cat6 / Fiber Ethernet Cabling Required</span>
                  </label>

                  {networkStructuredCabling && (
                    <div className="grid gap-3 sm:grid-cols-3 pt-1">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Cable Specification
                        </label>
                        <select
                          value={networkCableType}
                          onChange={(e) => setNetworkCableType(e.target.value)}
                          className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                        >
                          <option value="Cat6 Solid Copper">Cat6 Solid Copper (1 Gbps standard)</option>
                          <option value="Cat6A Shielded (10G)">Cat6A Shielded (10 Gbps Enterprise)</option>
                          <option value="Cat6 CCA Standard">Cat6 CCA Standard (Budget)</option>
                          <option value="Fiber Optic (Multi-Mode)">Fiber Optic (Multi-Mode Backbone)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          LAN Drops Count
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={networkLanPoints}
                          onChange={(e) => setNetworkLanPoints(Math.max(1, Number(e.target.value)))}
                          className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Estimated Cable Run (meters)
                        </label>
                        <input
                          type="number"
                          min={10}
                          step={10}
                          value={networkCableLength}
                          onChange={(e) => setNetworkCableLength(Math.max(10, Number(e.target.value)))}
                          className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Web Designing Features Checklist */}
              {isWebDesigning && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">
                    Required Website Features &amp; Integrations <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {WEB_FEATURE_OPTIONS.map((feat) => {
                      const isChecked = !!webFeatures[feat.key];
                      return (
                        <div
                          key={feat.key}
                          className={`p-3 rounded-2xl border transition-all ${
                            isChecked
                              ? "border-blue-500 bg-blue-50/20 shadow-xs"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-800">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) =>
                                setWebFeatures((prev) => ({
                                  ...prev,
                                  [feat.key]: e.target.checked,
                                }))
                              }
                              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span>{feat.label}</span>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Digital Marketing Strategy & Channels */}
              {isDigitalMarketingService && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">
                      Target Marketing Channels &amp; Services <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {[
                        { key: "seo", label: "Search Engine Optimization (SEO & Local Maps)" },
                        { key: "googleAds", label: "Google Ads (Search, Display & YouTube PPC)" },
                        { key: "metaAds", label: "Meta Ads (Instagram & Facebook Lead Generation)" },
                        { key: "socialMedia", label: "Social Media Page Management & Creatives" },
                        { key: "contentWriting", label: "High-Converting Ad Copy & Content Writing" },
                        { key: "analytics", label: "Google Analytics 4 & Conversion Tracking" },
                      ].map((item) => (
                        <div
                          key={item.key}
                          className={`p-3 rounded-2xl border transition-all ${
                            marketingChannels[item.key]
                              ? "border-blue-500 bg-blue-50/20 shadow-xs"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-800">
                            <input
                              type="checkbox"
                              checked={!!marketingChannels[item.key]}
                              onChange={(e) =>
                                setMarketingChannels((prev) => ({
                                  ...prev,
                                  [item.key]: e.target.checked,
                                }))
                              }
                              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span>{item.label}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">
                        Estimated Monthly Ad Spend / Budget
                      </label>
                      <select
                        value={marketingBudget}
                        onChange={(e) => setMarketingBudget(e.target.value)}
                        className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                      >
                        <option value="Under ₹25,000 / month">Under ₹25,000 / month</option>
                        <option value="₹25,000 – ₹50,000 / month">₹25,000 – ₹50,000 / month</option>
                        <option value="₹50,000 – ₹1,00,000 / month">₹50,000 – ₹1,00,000 / month</option>
                        <option value="₹1,00,000+ Enterprise Scale">₹1,00,000+ Enterprise Scale</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">
                        Primary Business Goal
                      </label>
                      <select
                        value={marketingPrimaryGoal}
                        onChange={(e) => setMarketingPrimaryGoal(e.target.value)}
                        className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                      >
                        <option value="Generate Qualified Inquiries & Sales">Generate Qualified Inquiries &amp; Sales</option>
                        <option value="Brand Awareness & Local Reach">Brand Awareness &amp; Local Reach</option>
                        <option value="E-Commerce Store Orders">E-Commerce Store Orders</option>
                        <option value="App Installs / Event Registrations">App Installs / Event Registrations</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">
                        Target Audience / Industry
                      </label>
                      <input
                        type="text"
                        value={marketingTargetAudience}
                        onChange={(e) => setMarketingTargetAudience(e.target.value)}
                        placeholder="e.g. B2B Companies, Homeowners in Bangalore"
                        className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">
                        Existing Website / Social Media Link
                      </label>
                      <input
                        type="url"
                        value={marketingWebsiteUrl}
                        onChange={(e) => setMarketingWebsiteUrl(e.target.value)}
                        placeholder="https://yourwebsite.com"
                        className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Podcasting Production & Studio */}
              {isPodcast && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">
                      Podcasting Services Required <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {[
                        { key: "audioRecording", label: "Broadcast-Grade Audio Studio (Multi-Mic Setup)" },
                        { key: "videoRecording4k", label: "Multi-Camera 4K Cinematic Video Filming" },
                        { key: "editingMastering", label: "Audio & Video Post-Production & Color Grading" },
                        { key: "distribution", label: "YouTube & Spotify Uploads & Thumbnail Design" },
                        { key: "socialClips", label: "Viral Shorts / Reels Vertical Clipping (Subtitled)" },
                      ].map((item) => (
                        <div
                          key={item.key}
                          className={`p-3 rounded-2xl border transition-all ${
                            podcastServices[item.key]
                              ? "border-blue-500 bg-blue-50/20 shadow-xs"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-800">
                            <input
                              type="checkbox"
                              checked={!!podcastServices[item.key]}
                              onChange={(e) =>
                                setPodcastServices((prev) => ({
                                  ...prev,
                                  [item.key]: e.target.checked,
                                }))
                              }
                              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span>{item.label}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">
                        Planned Episode Count
                      </label>
                      <select
                        value={podcastEpisodeCount}
                        onChange={(e) => setPodcastEpisodeCount(e.target.value)}
                        className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                      >
                        <option value="1 Pilot Episode">1 Pilot Episode</option>
                        <option value="4 Episodes (Monthly Pack)">4 Episodes (Monthly Pack)</option>
                        <option value="8 Episodes (Bi-Monthly)">8 Episodes (Bi-Monthly)</option>
                        <option value="12+ Episodes (Full Season)">12+ Episodes (Full Season)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">
                        Host &amp; Guest Setup
                      </label>
                      <select
                        value={podcastHostGuestFormat}
                        onChange={(e) => setPodcastHostGuestFormat(e.target.value)}
                        className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                      >
                        <option value="Solo Host (Solo monologue)">Solo Host (Solo monologue)</option>
                        <option value="Host + 1 In-Studio Guest">Host + 1 In-Studio Guest</option>
                        <option value="Host + 2-3 Panel Guests">Host + 2-3 Panel Guests</option>
                        <option value="Host + Remote Online Guest">Host + Remote Online Guest</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">
                        Studio / Recording Preference
                      </label>
                      <select
                        value={podcastRecordingLocation}
                        onChange={(e) => setPodcastRecordingLocation(e.target.value)}
                        className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                      >
                        <option value="TechBes Soundproof Studio (Bangalore)">TechBes Soundproof Studio (Bangalore)</option>
                        <option value="Client Corporate Office Setup (Mobile Rig)">Client Corporate Office Setup (Mobile Rig)</option>
                        <option value="Remote Digital Studio Setup">Remote Digital Studio Setup</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">
                        Podcast Show Name / Topic
                      </label>
                      <input
                        type="text"
                        value={podcastTopic}
                        onChange={(e) => setPodcastTopic(e.target.value)}
                        placeholder="e.g. The Tech Talk Podcast, Business Growth"
                        className="h-9 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-700"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Real-Time Hardware & Custom Scope Autocomplete (NO PRICES ON CUSTOMER SIDE) */}
              <div className="p-4 sm:p-5 rounded-2xl border border-blue-200 bg-blue-50/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>Additional Hardware / Equipment Requirements (Optional)</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Search or enter extra accessories, specific models, or scope items you need quoted.
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold bg-white px-2.5 py-1 rounded-full border border-slate-200">
                    {quotationItems.length} item(s) added
                  </span>
                </div>

                {/* Autocomplete with showPrice={false} */}
                <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                  <div className="flex-1">
                    <ProductAutocomplete
                      category={serviceCategoryLabel}
                      showPrice={false}
                      placeholder={
                        isNetworking
                          ? "Search networking hardware (e.g. Cisco, Gigabit Switch, Cat6, AP)..."
                          : isWebDesigning
                          ? "Search web components (e.g. Payment Gateway, SSL, Cloud Backup)..."
                          : "Search CCTV cameras & accessories (e.g. 'CP Plus', 'Hikvision', '4MP')..."
                      }
                      onSelectProduct={handleSelectInventoryProduct}
                    />
                  </div>

                  {/* Quantity selector */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-white h-11 px-2 shadow-xs shrink-0">
                    <span className="text-[10px] font-bold uppercase text-slate-400 px-1">
                      Qty
                    </span>
                    <button
                      type="button"
                      onClick={() => setNewItemQty((q) => Math.max(q - 1, 1))}
                      className="h-8 w-7 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-extrabold text-slate-900">
                      {newItemQty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setNewItemQty((q) => q + 1)}
                      className="h-8 w-7 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Quick suggestions pills */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Quick suggestions
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentSuggestions.slice(0, 6).map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleAddCustomItem(tag, 1)}
                        className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-white border border-slate-200 hover:bg-blue-50 hover:text-blue-700 text-slate-600 transition"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom text fallback input */}
                <div className="flex gap-2 pt-1 border-t border-blue-100/60">
                  <input
                    type="text"
                    placeholder="Or enter custom equipment / deliverable..."
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomItem();
                      }
                    }}
                    className="flex-1 h-9 rounded-xl border border-slate-200 px-3 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <Button
                    type="button"
                    onClick={() => handleAddCustomItem()}
                    className="h-9 px-3.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl"
                  >
                    + Add Custom
                  </Button>
                </div>

                {/* Selected Quotation Items List (NO PRICES SHOWN) */}
                {quotationItems.length > 0 && (
                  <div className="space-y-2 mt-3 pt-3 border-t border-blue-200/80">
                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Selected Items for Official Quotation
                    </div>
                    {quotationItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white shadow-xs gap-2"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {item.brand && (
                              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-blue-600 text-white tracking-wider">
                                {item.brand}
                              </span>
                            )}
                            <span className="font-bold text-xs text-slate-900 truncate">
                              {item.productName}
                            </span>
                            {item.variant && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                {item.variant}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5 font-medium">
                            <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-bold">Qty {item.quantity}</span>
                            <span>• Included in quotation request</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white h-7">
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateItemQty(item.id, item.quantity - 1)
                              }
                              className="h-full px-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-black text-slate-800">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateItemQty(item.id, item.quantity + 1)
                              }
                              className="h-full px-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-slate-400 hover:text-rose-600 transition p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="p-3 rounded-xl border border-blue-200/80 bg-blue-50/50 flex items-center justify-between text-xs mt-2">
                      <div className="flex items-center gap-2 text-slate-700">
                        <span className="text-sm">📋</span>
                        <div>
                          <span className="font-bold text-slate-900 block">{quotationItems.length} Custom Item(s) Selected</span>
                          <span className="text-[11px] text-slate-500">TechBes engineering will review requirements and prepare official quotation.</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                        Free Quotation
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* ────────── SECTION 3: ADDITIONAL REQUIREMENTS ────────── */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <div className="w-2 h-4 bg-blue-600 rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
                  ADDITIONAL REQUIREMENTS
                </h3>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Describe Your Requirements in Detail
                </label>
                <textarea
                  rows={4}
                  placeholder={
                    isNetworking
                      ? "e.g. Need LAN connection for 20 systems and Wi-Fi coverage for 3 floors."
                      : isWebDesigning
                      ? "e.g. Need responsive corporate website with service booking, customer login, and WhatsApp integration."
                      : "e.g. Need CCTV cameras covering front gate, backyard, and corridor. Prefer night colour vision."
                  }
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 p-3.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 leading-relaxed"
                />
              </div>
            </section>

            {/* ────────── SECTION 4: VOICE NOTE ────────── */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <div className="w-2 h-4 bg-blue-600 rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
                  VOICE NOTE
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                  Optional
                </span>
              </div>

              <p className="text-xs text-slate-400 font-medium">
                Record an audio note explaining your requirement directly to our engineers.
              </p>
              <div className="pt-1">
                <VoiceNoteRecorder
                  onVoiceNoteRecorded={(vn) => setVoiceNoteData(vn)}
                />
              </div>
            </section>

            {/* ────────── SECTION 5: PREFERRED SCHEDULE ────────── */}
            <section ref={scheduleRef} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <div className="w-2 h-4 bg-blue-600 rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
                  PREFERRED SCHEDULE
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Preferred Visit / Delivery Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <div className="flex gap-1.5 mt-2">
                    {getDatePills().map((p) => (
                      <button
                        key={p.iso}
                        type="button"
                        onClick={() => setDate(p.iso)}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition ${
                          date === p.iso
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Preferred Time Slot
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      "09:00 AM - 12:00 PM",
                      "12:00 PM - 03:00 PM",
                      "03:00 PM - 06:00 PM",
                      "06:00 PM - 08:00 PM",
                    ].map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setTime(slot)}
                        className={`py-2 px-2 text-[11px] font-bold rounded-xl border text-center transition ${
                          time === slot
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ────────── SECTION 6: SERVICE LOCATION / MAP ────────── */}
            <section ref={locationRef} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <div className="w-2 h-4 bg-blue-600 rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
                  SERVICE LOCATION
                </h3>
              </div>

              {/* Saved Addresses quick selection */}
              {savedAddresses.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Pick a Saved Address:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {savedAddresses.map((addr) => (
                      <button
                        type="button"
                        key={addr._id}
                        onClick={() => {
                          setSelectedAddressId(addr._id);
                          setAddress(addr.address || addr.fullAddress || "");
                          setFormattedAddress(
                            addr.formattedAddress || addr.address || ""
                          );
                          setArea(addr.area || "");
                          setCity(addr.city || "");
                          setStateName(addr.state || "");
                          setPincode(addr.pincode || "");
                          setLatitude(addr.latitude || null);
                          setLongitude(addr.longitude || null);
                          setLandmark(addr.landmark || "");
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                          selectedAddressId === addr._id
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        📍 {addr.label || addr.addressType || addr.title || "Address"} (
                        {addr.area || addr.city || "Bangalore"})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing Map Location Picker Component */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
                <LocationPicker
                  initialCoords={
                    latitude && longitude
                      ? { lat: latitude, lng: longitude }
                      : null
                  }
                  initialAddressData={{
                    address,
                    formattedAddress,
                    houseNumber,
                    street,
                    area,
                    landmark,
                    city,
                    district,
                    state: stateName,
                    pincode,
                  }}
                  onLocationSelected={(data: any) => {
                    setAddress(data.address || "");
                    setFormattedAddress(
                      data.formattedAddress || data.address || ""
                    );
                    setLatitude(data.latitude);
                    setLongitude(data.longitude);
                    if (data.city) setCity(data.city);
                    if (data.state) setStateName(data.state);
                    if (data.pincode) setPincode(data.pincode);
                    if (data.area) setArea(data.area);
                    if (data.district) setDistrict(data.district);
                    if (data.houseNumber) setHouseNumber(data.houseNumber);
                    if (data.street) setStreet(data.street);
                    if (data.landmark) setLandmark(data.landmark);
                  }}
                />
              </div>
            </section>

            {/* ────────── SECTION 7: CUSTOMER DETAILS ────────── */}
            <section ref={customerDetailsRef} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <div className="w-2 h-4 bg-blue-600 rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
                  CUSTOMER DETAILS
                </h3>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/70">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rajesh Kumar"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. rajesh@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </section>

            {/* ────────── SECTION 8: REVIEW REQUEST (SUMMARY) ────────── */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <div className="w-2 h-4 bg-blue-600 rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
                  REVIEW REQUEST
                </h3>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Quotation Request Summary
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Review your requested items and information.
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                    Custom Rate Preparation
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-500">Service:</span>
                    <span className="font-bold text-slate-800">
                      {serviceCategoryLabel} — {service.name}
                    </span>
                  </div>

                  {isInstallNewCctv && cctvPropertyType && (
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-500">
                        Property Type:
                      </span>
                      <span className="font-bold text-slate-800">
                        {cctvPropertyType}
                      </span>
                    </div>
                  )}

                  {/* Configured Items */}
                  <div className="border-t border-slate-200 pt-2 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Requested Items & Scope ({finalItemsToSubmit.length}):
                    </span>
                    {finalItemsToSubmit.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic">
                        No items configured yet
                      </p>
                    ) : (
                      <div className="grid gap-1.5 sm:grid-cols-2">
                        {finalItemsToSubmit.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center bg-white border border-slate-200/70 rounded-xl px-3 py-2 shadow-xs"
                          >
                            <span className="font-medium text-slate-800 truncate max-w-[200px]">
                              {item.productName}
                            </span>
                            <span className="font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                              Qty {item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Location & Schedule */}
                  <div className="grid gap-2 sm:grid-cols-2 border-t border-slate-200 pt-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Preferred Schedule:
                      </span>
                      <span className="font-bold text-slate-800">
                        {date ? `📅 ${date}` : "Date not chosen"} {time ? `• ${time}` : ""}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Service Location:
                      </span>
                      <span className="font-medium text-slate-800 truncate block">
                        📍 {formattedAddress || address || "Location not pinned"}
                      </span>
                    </div>
                  </div>

                  {/* Additional Requirement & Voice Note */}
                  {(notes.trim() || voiceNoteData) && (
                    <div className="border-t border-slate-200 pt-2 space-y-1">
                      {notes.trim() && (
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Additional Requirement:
                          </span>
                          <p className="text-slate-700 italic">"{notes.trim()}"</p>
                        </div>
                      )}
                      {voiceNoteData && (
                        <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px] pt-1">
                          <Mic className="w-3.5 h-3.5" /> Voice Note Attached (
                          {voiceNoteData.duration}s audio)
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pricing explanation */}
                  <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 text-[11px] text-amber-800 flex gap-2">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Admin Pricing Notice:</strong> Unit prices, rates, GST,
                      and total amounts are calculated by TechBes engineers and
                      sent to your portal & WhatsApp for your approval.
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* ────────── SECTION 9: SUBMIT QUOTATION REQUEST ────────── */}
            <div className="pt-2 pb-4">
              <Button
                type="button"
                disabled={submitting}
                onClick={handleSubmitQuotation}
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.005]"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting Quotation Request...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Submit Quotation Request
                  </>
                )}
              </Button>
              <p className="text-center text-[11px] text-slate-400 mt-2 font-medium">
                Your quotation request will be directly dispatched to the TechBes Admin
                Dashboard.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ServiceBookingConfigModal;
