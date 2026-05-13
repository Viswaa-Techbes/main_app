import { NextResponse } from "next/server";
import { getServerSession } from "@/core/auth/session";
import { getBookings } from "@/lib/db";

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const all = getBookings();
  const userBookings = all.filter((b) => b.userId === session.sub);

  return NextResponse.json({ success: true, bookings: userBookings });
}
