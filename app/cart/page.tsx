import type { Metadata } from "next";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { CctvCartView } from "@/components/cart/cctv-cart-view";

export const metadata: Metadata = {
  title: "Shopping Cart | TechBes",
  description: "Review and configure your CCTV and IT services cart.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage() {
  return (
    <ProtectedRoute>
      <CctvCartView />
    </ProtectedRoute>
  );
}
