import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { getOtps, saveOtps, getUsers, saveUsers, UserRecord } from "@/lib/db";
import { signToken } from "@/core/auth/jwt";
import { AUTH_COOKIE_KEY } from "@/core/auth/session";

type Body = {
  destination?: string;
  code?: string;
  name?: string;
  createIfMissing?: boolean;
};

export async function POST(request: Request) {
  const body = (await request.json()) as Body;
  const destination = (body.destination || "").trim();
  const code = (body.code || "").trim();
  const now = Date.now();

  if (!destination || !code) {
    return NextResponse.json({ message: "Missing destination or code" }, { status: 400 });
  }

  const otps = getOtps();
  const match = otps.find((o) => o.destination === destination && !o.used && o.code === code && o.expiresAt > now);

  if (!match) {
    return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });
  }

  // Mark OTP used
  match.used = true;
  saveOtps(otps);

  // Find or create user
  const users = getUsers();
  let user = users.find((u) => u.mobileNumber === destination || u.email === destination);

  if (!user && body.createIfMissing) {
    user = {
      id: uuidv4(),
      name: body.name || "",
      mobileNumber: destination.match(/^\d+$/) ? destination : undefined,
      email: destination.includes("@") ? destination : undefined,
      otpVerified: true,
      role: "client",
    } as UserRecord;

    users.push(user);
    saveUsers(users);
  } else if (user) {
    user.otpVerified = true;
    saveUsers(users);
  }

  if (!user) {
    return NextResponse.json({ message: "User not found. Set createIfMissing=true to auto-create." }, { status: 404 });
  }

  // Sign session token
  const expiresInSeconds = 60 * 60 * 8;
  const token = signToken({
    sub: user.id,
    name: user.name || "",
    mobileNumber: user.mobileNumber || "",
    email: user.email,
    role: (user.role as "admin" | "client") || "client",
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  });

  const response = NextResponse.json({ success: true, user: { id: user.id, name: user.name, mobileNumber: user.mobileNumber, email: user.email } });
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
