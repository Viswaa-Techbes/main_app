import { NextResponse } from "next/server";

import { getBackendApiUrl } from "@/core/api/config";
import { signToken } from "@/core/auth/jwt";
import { AUTH_COOKIE_KEY } from "@/core/auth/session";

export async function POST(request: Request) {
  const body = await request.json();
  const response = await fetch(getBackendApiUrl("/api/auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    return NextResponse.json(payload || { message: "Registration failed" }, { status: response.status });
  }

  const backendUser = payload?.data?.user || payload?.user;
  const backendToken = payload?.data?.token || payload?.token;
  const expiresInSeconds = 60 * 60 * 24 * 30;
  const sessionToken = signToken({
    sub: backendUser?.id || backendUser?.userId || backendUser?.email,
    name: backendUser?.name,
    email: backendUser?.email,
    phone: backendUser?.phone || backendUser?.mobileNumber,
    role: backendUser?.role === "admin" ? "admin" : "user",
    backendToken,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  });

  const nextResponse = NextResponse.json({
    user: {
      id: backendUser?.id || backendUser?.userId,
      name: backendUser?.name,
      email: backendUser?.email,
      phone: backendUser?.phone || backendUser?.mobileNumber,
      role: backendUser?.role,
    },
    token: backendToken,
  });

  nextResponse.cookies.set({
    name: AUTH_COOKIE_KEY,
    value: sessionToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: expiresInSeconds,
  });

  return nextResponse;
}
