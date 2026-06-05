import { proxyUserRequest } from "@/app/api/user/_proxy";

export async function GET() {
  return proxyUserRequest("/api/v2/user/addresses");
}
