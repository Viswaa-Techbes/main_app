import { dashboardBookings, savedAddresses } from "@/lib/marketplace-data";

export type DashboardMetric = {
  title: string;
  value: string;
  tone: "emerald" | "blue";
};

export type DashboardData = {
  metrics: DashboardMetric[];
  bookings: typeof dashboardBookings;
  savedAddresses: typeof savedAddresses;
  upcomingBookings: typeof dashboardBookings;
  bookingHistory: typeof dashboardBookings;
};

export const dashboardService = {
  async getDashboardData() {
    await new Promise((resolve) => setTimeout(resolve, 150));

    const upcomingBookings = dashboardBookings.filter((booking) => booking.status === "Upcoming");
    const bookingHistory = dashboardBookings.filter((booking) => booking.status !== "Upcoming");

    return {
      metrics: [
        { title: "Upcoming services", value: String(upcomingBookings.length), tone: "emerald" },
        { title: "Order history", value: String(bookingHistory.length), tone: "blue" },
        { title: "Saved addresses", value: String(savedAddresses.length), tone: "emerald" },
        { title: "Coupons saved", value: "03", tone: "blue" },
      ],
      bookings: dashboardBookings,
      savedAddresses,
      upcomingBookings,
      bookingHistory,
    } satisfies DashboardData;
  },
};
