import { apiClient } from "@/core/api/api-client";
import { DashboardBooking, savedAddresses } from "@/lib/marketplace-data";

export type DashboardMetric = {
  title: string;
  value: string;
  tone: "emerald" | "blue";
};

export type DashboardData = {
  metrics: DashboardMetric[];
  bookings: DashboardBooking[];
  savedAddresses: typeof savedAddresses;
  upcomingBookings: DashboardBooking[];
  bookingHistory: DashboardBooking[];
};

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    const payload = await apiClient<{ data?: any[] }>("/api/bookings", {
      method: "GET",
    });
    const jobs = payload.data || [];

    const bookings: DashboardBooking[] = jobs.map((job: any) => {
      let status: "Upcoming" | "Completed" | "Cancelled" = "Upcoming";
      if (job.status === "completed" || job.status === "payment_done") {
        status = "Completed";
      } else if (job.status === "cancelled") {
        status = "Cancelled";
      }

      return {
        id: job._id || String(job.id),
        serviceSlug: job.serviceId || "test-service",
        serviceTitle: job.serviceName || job.title || "Service Request",
        status,
        address: job.location || "No address provided",
        date: job.bookingDate || job.scheduledTime || "ASAP",
        time: job.timeSlot || "",
        price: job.price ? `Rs. ${job.price.toLocaleString("en-IN")}` : "Rs. 0",
      };
    });

    const upcomingBookings = bookings.filter((booking) => booking.status === "Upcoming");
    const bookingHistory = bookings.filter((booking) => booking.status !== "Upcoming");

    return {
      metrics: [
        { title: "Upcoming services", value: String(upcomingBookings.length), tone: "emerald" },
        { title: "Order history", value: String(bookingHistory.length), tone: "blue" },
        { title: "Saved addresses", value: String(savedAddresses.length), tone: "emerald" },
        { title: "Coupons saved", value: "03", tone: "blue" },
      ],
      bookings,
      savedAddresses,
      upcomingBookings,
      bookingHistory,
    };
  },
};
