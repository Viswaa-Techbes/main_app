import { NextResponse } from "next/server";

import { getBackendApiUrl } from "@/core/api/config";

export async function POST(request: Request) {
  const body = await request.json();
  const response = await fetch(getBackendApiUrl("/api/auth/send-otp"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => null);

  return NextResponse.json(payload, { status: response.status });
}
