import type { Metadata } from "next";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { CctvCheckoutView } from "@/components/checkout/cctv-checkout-view";

export const metadata: Metadata = {
  title: "Checkout | TechBes",
  description: "Securely review and pay for your IT and CCTV bookings.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CctvCheckoutView />
    </ProtectedRoute>
  );
}
