import { ProtectedRoute } from "@/components/auth/protected-route";
import { CctvCheckoutView } from "@/components/checkout/cctv-checkout-view";

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CctvCheckoutView />
    </ProtectedRoute>
  );
}
