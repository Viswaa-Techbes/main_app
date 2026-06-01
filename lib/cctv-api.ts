import { API_BASE_URL, AUTH_TOKEN_STORAGE_KEY } from "@/core/api/config";

export type CctvCategory = { _id: string; name: string; slug: string; description: string };
export type CctvCameraType = { _id: string; name: string; slug: string; description: string; installationPrice: number };
export type CctvAddon = { _id: string; name: string; slug: string; price: number };
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

function authHeaders() {
  if (typeof window === "undefined") return {};
  const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}), ...authHeaders() },
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(payload.message || "Request failed");
  return payload.data;
}

export const cctvApi = {
  categories: () => api<CctvCategory[]>("/api/v2/cctv/categories"),
  subcategories: () => api<CctvSubcategory[]>("/api/v2/cctv/subcategories"),
  subcategory: (slug: string) => api<CctvSubcategory>(`/api/v2/cctv/subcategories/${slug}`),
  cameraTypes: () => api<CctvCameraType[]>("/api/v2/cctv/camera-types"),
  addons: () => api<CctvAddon[]>("/api/v2/cctv/addons"),
  calculate: (body: CctvPriceInput) =>
    api<CctvPriceResult>("/api/v2/cctv/calculate-price", { method: "POST", body: JSON.stringify(body) }),
  createBooking: (body: unknown) =>
    api<any>("/api/v2/bookings/create", { method: "POST", body: JSON.stringify(body) }),
};
