import { NextResponse } from "next/server";

import { getServerSession } from "@/core/auth/session";

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({
      authenticated: false,
      user: null,
    });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.sub,
      name: session.name,
      mobileNumber: session.mobileNumber,
      email: session.email,
      role: session.role,
    },
  });
}
