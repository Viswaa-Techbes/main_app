import { apiClient } from "@/core/api/api-client";

export type DashboardMetric = {
  title: string;
  value: string;
  tone: "emerald" | "blue";
};

export type DashboardData = {
  metrics: DashboardMetric[];
  bookings: any[];
  savedAddresses: any[];
  upcomingBookings: any[];
  bookingHistory: any[];
};

export const dashboardService = {
  async getDashboardData() {
    // 1. Fetch real bookings from backend
    const res = await apiClient.get<any>("/api/v2/bookings");
    const bookings = res.data?.data || res.data || [];

    // 2. Map to local structure
    const mappedBookings = bookings.map((b: any) => ({
      id: b.id || b._id,
      serviceTitle: b.serviceName || b.title || "Field Service",
      status: b.status,
      address: b.address || b.location || "N/A",
      date: b.bookingDate || b.date || "TBD",
      time: b.timeSlot || b.time || "",
      price: b.amount ? `Rs. ${b.amount}` : "TBD",
      paymentStatus: b.paymentStatus,
      orderId: b.orderId,
      assignedTechnician: b.assignedTechnician,
    }));

    const upcoming = mappedBookings.filter((b: any) => 
      ["pending", "assigned", "started", "in_progress", "payment_pending"].includes(b.status)
    );
    const history = mappedBookings.filter((b: any) => b.status === "completed" || b.status === "cancelled");

    return {
      metrics: [
        { title: "Active bookings", value: String(upcoming.length), tone: "emerald" },
        { title: "Completed", value: String(history.length), tone: "blue" },
        { title: "Saved addresses", value: "02", tone: "emerald" }, // Mocked for now
        { title: "Points earned", value: "150", tone: "blue" },
      ],
      bookings: mappedBookings,
      savedAddresses: [], // Mocked for now
      upcomingBookings: upcoming,
      bookingHistory: history,
    } satisfies DashboardData;
  },
};
