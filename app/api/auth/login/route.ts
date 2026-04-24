import { NextResponse } from "next/server";

import { signToken } from "@/core/auth/jwt";
import { AUTH_COOKIE_KEY } from "@/core/auth/session";
import { sanitizeEmail, sanitizeText, isValidEmail } from "@/core/utils/sanitize";

type LoginBody = {
  email?: string;
  password?: string;
  rememberMe?: boolean;
};

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBody;
  const email = sanitizeEmail(body.email ?? "");
  const password = sanitizeText(body.password ?? "");
  const rememberMe = Boolean(body.rememberMe);

  if (!isValidEmail(email)) {
    return NextResponse.json({ message: "Please provide a valid email address." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ message: "Password must be at least 6 characters long." }, { status: 400 });
  }

  const role = email.includes("admin") ? "admin" : "user";
  const expiresInSeconds = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 8;
  const token = signToken({
    sub: email,
    email,
    role,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  });

  const response = NextResponse.json({
    user: {
      email,
      role,
    },
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
