import { API_BASE_URL, AUTH_TOKEN_STORAGE_KEY } from "@/core/api/config";

export type DashboardMetric = {
  title: string;
  value: string;
  tone: "emerald" | "blue";
};

export type UserProfile = {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  mobileNumber?: string;
  profilePhoto?: string;
  createdAt?: string;
};

export type UserAddress = {
  _id: string;
  label: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city?: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
};

export type UserBooking = {
  _id: string;
  serviceName?: string;
  title?: string;
  amount?: number;
  price?: number;
  status: string;
  bookingDate?: string;
  timeSlot?: string;
  location?: string;
  assignedTechnician?: { name?: string };
};

export type UserPayment = {
  _id: string;
  razorpayPaymentId?: string;
  amount: number;
  status: string;
  createdAt: string;
};

export type ServiceReport = {
  jobId: string;
  technician: string;
  completionDate: string;
  pdfReport?: string;
};

export type DashboardData = {
  metrics: DashboardMetric[];
  profile: UserProfile | null;
  addresses: UserAddress[];
  bookings: UserBooking[];
  upcomingBookings: UserBooking[];
  payments: UserPayment[];
  serviceReports: ServiceReport[];
};

function token() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || "";
}

async function backend<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
      ...(init?.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || "Request failed");
  return payload.data;
}

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    const data = await backend<any>("/api/v2/user/dashboard");
    return {
      metrics: [
        { title: "Upcoming services", value: String(data.metrics?.upcomingServices ?? 0), tone: "emerald" },
        { title: "Order history", value: String(data.metrics?.orderHistory ?? 0), tone: "blue" },
        { title: "Saved addresses", value: String(data.metrics?.savedAddresses ?? 0), tone: "emerald" },
        { title: "Payments", value: String(data.metrics?.payments ?? 0), tone: "blue" },
      ],
      profile: data.profile || null,
      addresses: data.addresses || [],
      bookings: data.bookings || [],
      upcomingBookings: data.upcomingBookings || [],
      payments: data.payments || [],
      serviceReports: data.serviceReports || [],
    };
  },
  createAddress: (body: Partial<UserAddress>) => backend<UserAddress>("/api/v2/user/address", { method: "POST", body: JSON.stringify(body) }),
  updateAddress: (id: string, body: Partial<UserAddress>) => backend<UserAddress>(`/api/v2/user/address/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteAddress: (id: string) => backend<void>(`/api/v2/user/address/${id}`, { method: "DELETE" }),
};
