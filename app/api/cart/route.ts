import { proxyUserRequest } from "@/app/api/user/_proxy";

export async function GET() {
  return proxyUserRequest("/api/v2/cart");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return proxyUserRequest("/api/v2/cart/add", { method: "POST", body });
}
