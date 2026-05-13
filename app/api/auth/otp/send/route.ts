import { NextResponse } from "next/server";
import { randomInt } from "crypto";
import { v4 as uuidv4 } from "uuid";

import { getOtps, saveOtps, OtpRecord } from "@/lib/db";

type Body = {
  destination?: string; // mobile or email
};

export async function POST(request: Request) {
  const body = (await request.json()) as Body;
  const destination = (body.destination || "").trim();

  if (!destination) {
    return NextResponse.json({ message: "Missing destination" }, { status: 400 });
  }

  // Generate 6-digit OTP
  const code = String(randomInt(100000, 999999));

  const otps = getOtps();
  const record: OtpRecord = {
    id: uuidv4(),
    destination,
    code,
    expiresAt: Date.now() + 1000 * 60 * 5,
    used: false,
  };

  otps.push(record);
  saveOtps(otps);

  // In production: send SMS or email here. For now return masked response for dev.
  return NextResponse.json({ success: true, destination, expiresIn: 300, demoCode: code });
}
