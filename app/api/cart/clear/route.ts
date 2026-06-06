import { proxyUserRequest } from "@/app/api/user/_proxy";

export async function DELETE() {
  return proxyUserRequest("/api/v2/cart/clear", { method: "DELETE" });
}
