import { NextResponse } from "next/server";

import { getBackendApiUrl } from "@/core/api/config";

export async function proxyBackendPost(path: string, body: unknown) {
  const url = getBackendApiUrl(path);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = await response.json().catch(() => null);

    return { response, payload };
  } catch (error) {
    console.error("[techbes] Backend API unavailable", { url, error });
    return {
      response: null,
      payload: {
        success: false,
        message: `Backend API is not reachable at ${url}. Start the BE server or update BACKEND_API_URL/NEXT_PUBLIC_API_URL.`,
      },
    };
  }
}

export function backendUnavailableResponse(payload: unknown) {
  return NextResponse.json(payload, { status: 503 });
}
