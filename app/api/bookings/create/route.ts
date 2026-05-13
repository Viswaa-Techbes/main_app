import { NextResponse } from "next/server";
import { getServerSession } from "@/core/auth/session";
import { v4 as uuidv4 } from "uuid";
import { getBookings, saveBookings } from "@/lib/db";

type Body = {
  serviceSlug?: string;
  scheduledAt?: string;
};

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Body;
  if (!body.serviceSlug) {
    return NextResponse.json({ message: "Missing serviceSlug" }, { status: 400 });
  }

  const bookings = getBookings();
  const booking = {
    id: uuidv4(),
    userId: session.sub,
    serviceSlug: body.serviceSlug,
    status: "Pending",
    createdAt: new Date().toISOString(),
    scheduledAt: body.scheduledAt,
  } as any;

  bookings.push(booking);
  saveBookings(bookings);

  return NextResponse.json({ success: true, booking });
}
