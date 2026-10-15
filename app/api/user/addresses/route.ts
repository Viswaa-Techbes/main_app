import { proxyUserRequest } from "@/app/api/user/_proxy";

export async function GET(request: Request) {
  return proxyUserRequest("/api/v2/user/addresses", {}, request);
}
