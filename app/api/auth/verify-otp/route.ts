import { NextResponse } from "next/server";

import { backendUnavailableResponse, proxyBackendPost } from "@/core/api/backend-fetch";

export async function POST(request: Request) {
  const body = await request.json();
  const { response, payload } = await proxyBackendPost("/api/auth/verify-otp", body);

  if (!response) {
    return backendUnavailableResponse(payload);
  }

  return NextResponse.json(payload, { status: response.status });
}
