import { NextResponse } from "next/server";

import { getBackendApiUrl } from "@/core/api/config";
import { AUTH_COOKIE_KEY, getServerSession } from "@/core/auth/session";

export async function GET() {
  const session = await getServerSession();

  if (!session?.backendToken) {
    return NextResponse.json({ message: "User session not found. Please log in." }, { status: 401 });
  }

  const response = await fetch(getBackendApiUrl("/api/bookings"), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.backendToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const errorResponse = NextResponse.json(
      { message: payload?.message || "Failed to load your bookings from server." },
      { status: response.status },
    );

    if (response.status === 401) {
      errorResponse.cookies.set({
        name: AUTH_COOKIE_KEY,
        value: "",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
      });
    }

    return errorResponse;
  }

  return NextResponse.json(payload);
}
