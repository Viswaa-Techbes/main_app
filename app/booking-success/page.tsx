import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default async function BookingSuccessPage({ searchParams }: { searchParams: Promise<{ bookingId?: string }> }) {
  const params = await searchParams;
  return (
    <main className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-4 py-12 text-center">
      <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <CheckCircle className="mx-auto h-12 w-12 text-emerald-600" />
        <h1 className="mt-4 text-3xl font-semibold text-slate-950">Booking Created</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Your CCTV service request has been submitted. Admin will review and assign a technician.</p>
        {params.bookingId && <p className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">Booking ID: {params.bookingId}</p>}
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/dashboard" className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">My Bookings</Link>
          <Link href="/services" className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Book Another</Link>
        </div>
      </div>
    </main>
  );
}
