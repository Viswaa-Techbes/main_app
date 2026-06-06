import { API_BASE_URL, AUTH_TOKEN_STORAGE_KEY } from "@/core/api/config";

export type CctvCategory = { _id: string; name: string; slug: string; description: string };
export type CctvCameraType = { _id: string; name: string; slug: string; description: string; installationPrice: number };
export type CctvAddon = { _id: string; name: string; slug: string; price: number; unit?: string; image?: string; description?: string };
export type CctvSubcategory = {
  _id: string;
  categoryId: CctvCategory | string;
  name: string;
  slug: string;
  shortDescription: string;
  overview: string;
  suitableFor: string[];
  includedServices: string[];
  excludedServices: string[];
  cameraTypes: string[];
  cableTypes: string[];
  installationProcess: string[];
  installationTime: string;
  warranty: string;
  faqs: { question: string; answer: string }[];
  pricingStartsFrom: number;
  image: string;
};

export type CctvPriceInput = {
  categoryId?: string;
  subcategoryId?: string;
  cameraTypeId: string;
  cameraCount: number;
  installationArea: "indoor" | "outdoor";
  wireLength: number;
  addonIds: string[];
  couponCode?: string;
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

export function managedServiceToMarketplaceService(service: CctvSubcategory, index = 0) {
  const category = typeof service.categoryId === "string" ? undefined : service.categoryId;
  return {
    id: 10000 + index,
    slug: service.slug,
    title: service.name,
    categoryId: category?.slug === "cctv-installation" ? "cctv" : category?.slug || "cctv",
    category: category?.name || "CCTV Installation",
    tagline: service.shortDescription || service.overview,
    description: service.overview || service.shortDescription,
    price: `From Rs. ${(service.pricingStartsFrom || 499).toLocaleString("en-IN")}`,
    priceValue: service.pricingStartsFrom || 499,
    rating: 4.8,
    reviewCount: 0,
    duration: service.installationTime || "On-site visit",
    durationMinutes: 180,
    image: service.image || "/placeholder.jpg",
    gallery: [service.image || "/placeholder.jpg"],
    badge: "Configurable",
    features: service.suitableFor || [],
    includes: service.includedServices || [],
    steps: service.installationProcess || [],
    faqs: service.faqs || [],
    reviews: [],
    recommendedFor: service.suitableFor || [],
    timeSlots: ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"],
    managedService: service,
  };
}

function authHeaders() {
  if (typeof window === "undefined") return {};
  const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const method = init?.method || "GET";
  
  // STEP 1
  console.log("API_BASE_URL =", API_BASE_URL);
  console.log("PATH =", path);
  console.log("FINAL URL =", `${API_BASE_URL}${path}`);

  // STEP 3
  console.log("NEXT_PUBLIC_API_URL =", process.env.NEXT_PUBLIC_API_URL);

  // STEP 4
  const token = typeof window !== "undefined" ? window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) : null;
  const headers = { "Content-Type": "application/json", ...(init?.headers as any || {}), ...authHeaders() };
  console.log("token =", token);
  console.log("headers =", headers);
  console.log("request body =", init?.body);

  // STEP 5
  if (typeof window !== "undefined") {
    fetch('https://technician-app.onrender.com/api/health')
      .then(r => r.json())
      .then(data => console.log("TEST HEALTH SUCCESS:", data))
      .catch(err => console.error("TEST HEALTH FAILURE:", err));
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: headers as any,
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error(`[API] ${method} ${path} failed`, { status: res.status, payload });
    throw new Error(payload.message || "Request failed");
  }
  console.log(`[API] ${method} ${path} succeeded`, payload.data);
  return payload.data;
}

export const cctvApi = {
  categories: () => api<CctvCategory[]>("/api/v2/cctv/categories"),
  subcategories: () => api<CctvSubcategory[]>("/api/v2/cctv/subcategories"),
  subcategory: (slug: string) => api<CctvSubcategory>(`/api/v2/cctv/subcategories/${slug}`),
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
