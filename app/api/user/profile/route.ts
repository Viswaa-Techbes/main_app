import { proxyUserRequest } from "@/app/api/user/_proxy";

export async function GET() {
  return proxyUserRequest("/api/v2/user/profile");
}

export async function PUT(request: Request) {
  const body = await request.json().catch(() => ({}));
  return proxyUserRequest("/api/v2/user/profile", { method: "PUT", body });
}
