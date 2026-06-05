import { proxyUserRequest } from "@/app/api/user/_proxy";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return proxyUserRequest("/api/v2/user/address", { method: "POST", body });
}
