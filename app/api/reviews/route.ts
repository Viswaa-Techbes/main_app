import { NextRequest } from "next/server";
import { proxyUserRequest } from "@/app/api/user/_proxy";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return proxyUserRequest("/reviews", { method: "POST", body });
  } catch (err: any) {
    return Response.json({ message: err.message || "Invalid payload" }, { status: 400 });
  }
}
