import { ProtectedRoute } from "@/components/auth/protected-route";
import { CctvCartView } from "@/components/cart/cctv-cart-view";

export default function CartPage() {
  return (
    <ProtectedRoute>
      <CctvCartView />
    </ProtectedRoute>
  );
}
