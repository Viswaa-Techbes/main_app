import { getApiBaseUrl, AUTH_TOKEN_STORAGE_KEY } from "@/core/api/config";

export type CctvCategory = { _id: string; name: string; slug: string; description: string };
export type CctvCameraType = { _id: string; name: string; slug: string; description: string; installationPrice: number };
export type CctvAddon = { _id: string; name: string; slug: string; price: number; unit?: string; image?: string; description?: string };
export type CctvSubcategory = {
  _id: string;
  categoryId: CctvCategory | string;
  name: string;
  slug: string;
  // Legacy CCTV-specific fields (may be absent for non-CCTV services)
  shortDescription?: string;
  overview?: string;
  suitableFor?: string[];
  includedServices?: string[];
  excludedServices?: string[];
  cameraTypes?: string[];
  cableTypes?: string[];
  installationProcess?: string[];
  installationTime?: string;
  warranty?: string;
  faqs?: { question: string; answer: string }[];
  pricingStartsFrom?: number;
  image?: string;
  // New catalog API fields
  description?: string;
  packages?: { _id: string; name: string; price: number; originalPrice?: number | null; duration?: string; includes?: string[]; isPopular?: boolean }[];
  bookingQuestions?: { question: string; type: string; options?: string[]; required?: boolean }[];
};

export type CctvPriceInput = {
  categoryId?: string;
  subcategoryId?: string;
  subcategorySlug?: string;
  cameraTypeId?: string;
  cameraCount?: number;
  installationArea?: "indoor" | "outdoor";
  wireLength?: number;
  addonIds?: string[];
  couponCode?: string;

  // Custom Install CCTV fields
  propertyType?: string;
  cameraTypes?: { type: string; quantity: number }[];
  installationType?: string;
  wiringRequired?: boolean;
  cableLength?: number;
  existingCable?: boolean;
  dvrRequired?: boolean;
  dvrChannels?: number;
  networkRack?: boolean;
  monitorMounting?: boolean;
  discountPercent?: number;
};

export type CctvPriceResult = {
  category?: { id: string; name: string; slug: string };
  subcategory?: { id: string; name: string; slug: string };
  cameraType: { id: string; name: string; slug: string; unitPrice: number };
  cameraCount: number;
  installationArea: "indoor" | "outdoor";
  wireLength: number;
  addons: { id: string; name: string; slug: string; price: number; quantity: number; total: number }[];
  priceBreakdown: Record<string, number>;
};

export const fallbackCameraTypes: CctvCameraType[] = [
  { _id: "fallback-dome-camera", name: "Dome Camera", slug: "dome-camera", description: "Indoor ceiling camera", installationPrice: 650 },
  { _id: "fallback-bullet-camera", name: "Bullet Camera", slug: "bullet-camera", description: "Outdoor directional camera", installationPrice: 750 },
  { _id: "fallback-ptz-camera", name: "PTZ Camera", slug: "ptz-camera", description: "Pan tilt zoom camera", installationPrice: 1800 },
  { _id: "fallback-ip-camera", name: "IP Camera", slug: "ip-camera", description: "Network camera", installationPrice: 900 },
  { _id: "fallback-wireless-camera", name: "Wireless Camera", slug: "wireless-camera", description: "Wi-Fi camera", installationPrice: 850 },
];

export const fallbackAddons: CctvAddon[] = [
  { _id: "fallback-pvc-casing", name: "PVC Casing", slug: "pvc-casing", price: 180 },
  { _id: "fallback-junction-box", name: "Junction Box", slug: "junction-box", price: 220 },
  { _id: "fallback-power-supply", name: "Power Supply", slug: "power-supply", price: 450 },
  { _id: "fallback-smps", name: "SMPS", slug: "smps", price: 650 },
  { _id: "fallback-poe-switch", name: "PoE Switch", slug: "poe-switch", price: 2200 },
  { _id: "fallback-network-rack", name: "Network Rack", slug: "network-rack", price: 3200 },
  { _id: "fallback-hard-disk", name: "Hard Disk", slug: "hard-disk", price: 3800 },
  { _id: "fallback-connector-set", name: "Connector Set", slug: "connector-set", price: 150 },
];

export function calculateFallbackCctvPrice(input: CctvPriceInput, cameraTypes = fallbackCameraTypes, addons = fallbackAddons): CctvPriceResult | null {
  const cameraType = cameraTypes.find((item) => item._id === input.cameraTypeId) || cameraTypes[0];
  if (!cameraType) return null;
  const cameraCount = Math.max(Number(input.cameraCount) || 1, 1);
  const wireLength = Math.max(Number(input.wireLength) || 0, 0);
  const selectedAddons = addons
    .filter((addon) => input.addonIds.includes(addon._id))
    .map((addon) => ({ id: addon._id, name: addon.name, slug: addon.slug, price: addon.price, quantity: 1, total: addon.price }));
  const baseCharge = 499;
  const cameraTotal = cameraCount * cameraType.installationPrice;
  const indoorCharge = 0;
  const outdoorCharge = 350;
  const areaCharge = input.installationArea === "outdoor" ? outdoorCharge : indoorCharge;
  const wirePricePerMeter = 35;
  const wireTotal = wireLength * wirePricePerMeter;
  const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.total, 0);
  const taxableAmount = baseCharge + cameraTotal + areaCharge + wireTotal + addonsTotal;
  const taxTotal = Math.round(taxableAmount * 0.18);
  return {
    cameraType: { id: cameraType._id, name: cameraType.name, slug: cameraType.slug, unitPrice: cameraType.installationPrice },
    cameraCount,
    installationArea: input.installationArea,
    wireLength,
    addons: selectedAddons,
    priceBreakdown: {
      baseCharge,
      cameraUnitPrice: cameraType.installationPrice,
      cameraCount,
      cameraTotal,
      indoorCharge,
      outdoorCharge,
      areaCharge,
      wireLength,
      wirePricePerMeter,
      wireTotal,
      addonsTotal,
      discountTotal: 0,
      couponTotal: 0,
      offerAdjustment: 0,
      taxableAmount,
      taxTotal,
      grandTotal: taxableAmount + taxTotal,
    },
  };
}

export function normalizeCategoryName(name: string): string {
  const n = name.trim().toLowerCase();
  if (n.includes("cctv")) return "CCTV";
  if (n.includes("network")) return "Networking";
  if (n.includes("laptop")) return "Laptop";
  if (n.includes("desktop")) return "Desktop";
  if (n.includes("server")) return "Server";
  if (n.includes("amc") || n.includes("contract") || n.includes("electronic")) return "Electronic Contracts";
  if (n.includes("automation") || n.includes("home")) return "Home Automation";
  if (n.includes("website") || n.includes("web")) return "Website Development";
  if (n.includes("license") || n.includes("licensing")) return "Software Licensing";
  if (n.includes("security") || n.includes("cyber")) return "Cyber Security";
  return name;
}

export function normalizeCategoryId(idOrSlug: string): string {
  const s = idOrSlug.trim().toLowerCase();
  if (s.includes("cctv")) return "cctv";
  if (s.includes("network")) return "networking";
  if (s.includes("laptop")) return "laptop";
  if (s.includes("desktop")) return "desktop";
  if (s.includes("server")) return "server";
  if (s.includes("amc") || s.includes("contract") || s.includes("electronic")) return "electronic-contracts";
  if (s.includes("automation") || s.includes("home")) return "home-automation";
  if (s.includes("website") || s.includes("web")) return "website-development";
  if (s.includes("license") || s.includes("licensing")) return "software-licensing";
  if (s.includes("security") || s.includes("cyber")) return "cyber-security";
  return idOrSlug;
}

export function getCctvServiceImage(slugOrName: string, fallback?: string): string {
  const term = slugOrName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  
  if (term.includes("ip-camera") || term.includes("ip-installation")) {
    return "https://images.unsplash.com/photo-1528319725582-ddc096101511?w=1200&h=900&fit=crop";
  }
  if (term.includes("analog")) {
    return "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&h=900&fit=crop";
  }
  if (term.includes("dvr")) {
    return "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&h=900&fit=crop";
  }
  if (term.includes("nvr")) {
    return "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=900&fit=crop";
  }
  if (term.includes("cctv-amc") || term.includes("amc")) {
    return "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=900&fit=crop";
  }
  if (term.includes("dome")) {
    return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=900&fit=crop";
  }
  if (term.includes("bullet")) {
    return "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1200&h=900&fit=crop";
  }
  if (term.includes("ptz")) {
    return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=900&fit=crop";
  }
  if (term.includes("wireless-cctv") || term.includes("wireless")) {
    return "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1200&h=900&fit=crop";
  }
  if (term.includes("outdoor")) {
    return "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=1200&h=900&fit=crop";
  }
  if (term.includes("indoor")) {
    return "https://images.unsplash.com/photo-1558002038-1055907df827?w=1200&h=900&fit=crop";
  }
  if (term.includes("access-control")) {
    return "https://images.unsplash.com/photo-1558002038-1055907df827?w=1200&h=900&fit=crop";
  }
  if (term.includes("biometric") || term.includes("fingerprint")) {
    return "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=900&fit=crop";
  }
  if (term.includes("door-phone") || term.includes("video-door")) {
    return "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=1200&h=900&fit=crop";
  }
  if (term.includes("upgrade")) {
    return "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=900&fit=crop";
  }
  if (term.includes("repair")) {
    return "https://images.unsplash.com/photo-1597484211625-2ef315222da1?w=1200&h=900&fit=crop";
  }
  if (term.includes("maintenance")) {
    return "https://images.unsplash.com/photo-1620283085439-39620a1e21c4?w=1200&h=900&fit=crop";
  }
  if (term.includes("installation") || term.includes("cctv")) {
    return "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1200&h=900&fit=crop";
  }

  // Fallbacks
  if (fallback && fallback !== "/placeholder.jpg" && fallback.startsWith("http")) {
    return fallback;
  }
  return "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=900&fit=crop";
}

export function managedServiceToMarketplaceService(service: CctvSubcategory, index = 0) {
  const category = typeof service.categoryId === "string" ? undefined : service.categoryId;
  const rawCatSlug = category?.slug || (typeof service.categoryId === "string" ? service.categoryId : "cctv");
  const rawCatName = category?.name || "CCTV";
  
  const normCatId = normalizeCategoryId(rawCatSlug);
  const normCatName = normalizeCategoryName(rawCatName);
  
  const resolvedImg = getCctvServiceImage(service.slug || service.name, service.image);

  // Support both legacy CCTV fields and new catalog API fields
  const pricingStartsFrom =
    service.pricingStartsFrom ||
    (service.packages && service.packages.length > 0 ? service.packages[0].price : 0) ||
    499;

  const tagline = service.shortDescription || service.description || service.overview || "";
  const description = service.overview || service.description || service.shortDescription || "";
  const features = service.suitableFor || [];
  const includes = service.includedServices || 
    (service.packages && service.packages.length > 0 ? service.packages[0].includes || [] : []);
  const steps = service.installationProcess || [];
  const faqs = service.faqs || [];
  const duration = service.installationTime || 
    (service.packages && service.packages.length > 0 ? service.packages[0].duration || "" : "") ||
    "On-site visit";

  return {
    id: 10000 + index,
    slug: service.slug,
    title: service.name,
    categoryId: normCatId,
    category: normCatName,
    tagline,
    description,
    price: `From Rs. ${pricingStartsFrom.toLocaleString("en-IN")}`,
    priceValue: pricingStartsFrom,
    rating: 4.8,
    reviewCount: 0,
    duration,
    durationMinutes: 180,
    image: resolvedImg,
    gallery: [resolvedImg],
    badge: "Configurable",
    features,
    includes,
    steps,
    faqs,
    reviews: [],
    recommendedFor: features,
    timeSlots: ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"],
    managedService: service,
    configurableType: "cctv",
  };
}

function authHeaders() {
  if (typeof window === "undefined") return {};
  const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const method = init?.method || "GET";
  const headers = { "Content-Type": "application/json", ...(init?.headers as any || {}), ...authHeaders() };
  const apiBaseUrl = getApiBaseUrl();

  let res: Response;
  try {
    res = await fetch(`${apiBaseUrl}${path}`, {
      ...init,
      headers: headers as any,
    });
  } catch (networkErr: any) {
    // Network-level failure: backend is unreachable (not running, CORS preflight blocked, DNS fail, etc.)
    console.warn(`[API] ${method} ${path} — network error (is the backend running at ${apiBaseUrl}?):`, networkErr.message);
    const err = new Error("Backend server is unreachable. Please ensure the server is running.") as any;
    err.url = `${apiBaseUrl}${path}`;
    err.status = 0;
    err.body = {};
    err.isNetworkError = true;
    throw err;
  }

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error(`[API] ${method} ${path} failed`, { status: res.status, payload });
    const err = new Error(payload.message || "Request failed") as any;
    err.url = `${apiBaseUrl}${path}`;
    err.status = res.status;
    err.body = payload;
    throw err;
  }
  return payload.data;
}

export const cctvApi = {
  getConfig: (serviceId: string) => api<any>(`/api/v2/services/${serviceId}/config`),
  categories: () => api<CctvCategory[]>("/api/v2/catalog/categories"),

  // ─── Catalog API (replaces legacy /api/v2/cctv/* endpoints) ─────────────────
  // These now fetch from the dynamic catalog, so all categories work correctly.
  subcategories: () => api<CctvSubcategory[]>("/api/v2/catalog/categories"),
  subcategory: (slug: string) => api<CctvSubcategory>(`/api/v2/catalog/subcategories/${slug}`),
  cameraTypes: () => api<CctvCameraType[]>("/api/v2/cctv/camera-types"),
  addons: () => api<CctvAddon[]>("/api/v2/cctv/addons"),
  materials: () => api<CctvAddon[]>("/api/v2/materials"),
  calculate: (body: CctvPriceInput) =>
    api<CctvPriceResult>("/api/v2/cctv/calculate-price", { method: "POST", body: JSON.stringify(body) }),
  createBooking: (body: unknown) =>
    api<any>("/api/v2/bookings/create", { method: "POST", body: JSON.stringify(body) }),
  createLead: (body: unknown) =>
    api<any>("/leads", { method: "POST", body: JSON.stringify(body) }),
  createOrder: (body: unknown) =>
    api<any>("/api/v2/payments/create-order", { method: "POST", body: JSON.stringify(body) }),
  verifyPayment: (body: unknown) =>
    api<any>("/api/v2/payments/verify-payment", { method: "POST", body: JSON.stringify(body) }),
  myPayments: () => api<any>("/api/v2/payment/my"),
};
