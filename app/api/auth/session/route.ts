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
      email: session.email,
      phone: session.phone,
      role: session.role,
      token: session.backendToken,
    },
  });
}
