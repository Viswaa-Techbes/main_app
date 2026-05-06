import { NextResponse } from "next/server";

import { signToken } from "@/core/auth/jwt";
import { AUTH_COOKIE_KEY } from "@/core/auth/session";
import { getBackendUrl } from "@/core/api/backend-url";
import { sanitizeMobileNumber, sanitizeText, isValidMobileNumber } from "@/core/utils/sanitize";

type LoginBody = {
  mobileNumber?: string;
  password?: string;
  rememberMe?: boolean;
};

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBody;
  const mobileNumber = sanitizeMobileNumber(body.mobileNumber ?? "");
  const password = sanitizeText(body.password ?? "");
  const rememberMe = Boolean(body.rememberMe);

  if (!isValidMobileNumber(mobileNumber)) {
    return NextResponse.json({ message: "Please provide a valid mobile number." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ message: "Password must be at least 6 characters long." }, { status: 400 });
  }

  const backendResponse = await fetch(getBackendUrl("/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobileNumber, password }),
    cache: "no-store",
  });
  const payload = await backendResponse.json().catch(() => null);

  if (!backendResponse.ok || !payload?.success) {
    return NextResponse.json(
      { message: payload?.message || "Invalid mobile number or password." },
      { status: backendResponse.status || 401 },
    );
  }

  const backendUser = payload.data?.user || payload.user;
  const backendToken = payload.data?.token || payload.token;
  const role = backendUser?.role === "admin" ? "admin" : "client";
  const expiresInSeconds = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 8;
  const user = {
    id: backendUser?.id || backendUser?.userId,
    name: backendUser?.name || "",
    mobileNumber: backendUser?.mobileNumber || mobileNumber,
    email: backendUser?.email || "",
    role,
  };

  if (!user.id) {
    return NextResponse.json({ message: "Login failed: Missing user ID from backend." }, { status: 500 });
  }

  const token = signToken({
    sub: user.id,
    name: user.name,
    mobileNumber: user.mobileNumber,
    email: user.email,
    role: role as "admin" | "client",
    backendToken,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  });

  const response = NextResponse.json({
    user,
  });

  response.cookies.set({
    name: AUTH_COOKIE_KEY,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: expiresInSeconds,
  });

  return response;
}
