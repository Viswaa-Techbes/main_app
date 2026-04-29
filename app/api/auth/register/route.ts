import { NextResponse } from "next/server";

import { getBackendUrl } from "@/core/api/backend-url";
import { signToken } from "@/core/auth/jwt";
import { AUTH_COOKIE_KEY } from "@/core/auth/session";
import { isValidEmail, isValidMobileNumber, sanitizeEmail, sanitizeMobileNumber, sanitizeText } from "@/core/utils/sanitize";

type RegisterBody = {
  name?: string;
  mobileNumber?: string;
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as RegisterBody;
  const name = sanitizeText(body.name ?? "");
  const mobileNumber = sanitizeMobileNumber(body.mobileNumber ?? "");
  const email = body.email ? sanitizeEmail(body.email) : "";
  const password = sanitizeText(body.password ?? "");

  if (name.length < 2) {
    return NextResponse.json({ message: "Please enter your full name." }, { status: 400 });
  }

  if (!isValidMobileNumber(mobileNumber)) {
    return NextResponse.json({ message: "Please provide a valid mobile number." }, { status: 400 });
  }

  if (email && !isValidEmail(email)) {
    return NextResponse.json({ message: "Please provide a valid email address." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ message: "Password must be at least 6 characters long." }, { status: 400 });
  }

  const backendResponse = await fetch(getBackendUrl("/auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      mobileNumber,
      email,
      password,
      role: "client",
      phone: mobileNumber,
    }),
    cache: "no-store",
  });
  const payload = await backendResponse.json().catch(() => null);

  if (!backendResponse.ok || !payload?.success) {
    return NextResponse.json(
      { message: payload?.message || "Unable to create your account right now." },
      { status: backendResponse.status || 400 },
    );
  }

  const backendUser = payload.data?.user || payload.user;
  const user = {
    id: backendUser?.id || backendUser?.userId,
    name: backendUser?.name || name,
    mobileNumber: backendUser?.mobileNumber || mobileNumber,
    email: backendUser?.email || email,
    role: "user" as const,
  };
  const expiresInSeconds = 60 * 60 * 24 * 30;
  const token = signToken({
    sub: user.id || user.mobileNumber,
    name: user.name,
    mobileNumber: user.mobileNumber,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  });

  const response = NextResponse.json({ user }, { status: 201 });
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
