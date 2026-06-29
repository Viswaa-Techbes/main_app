import Link from "next/link";
import { CheckCircle2, ChevronRight, LayoutDashboard, Search } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";

export const metadata = {
  title: "Booking Confirmed | Techbes",
  description: "Your IT service slot has been confirmed successfully.",
};

export default async function BookingSuccessPage({ searchParams }: { searchParams: Promise<{ bookingId?: string }> }) {
  const params = await searchParams;
  return (
    <PageShell>
      <main className="mx-auto grid min-h-[70vh] max-w-xl place-items-center px-4 py-12 text-center">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm space-y-6 flex flex-col items-center w-full">
          <div className="rounded-full bg-blue-50 border border-blue-100 p-5 text-blue-600 shadow-sm">
            <CheckCircle2 className="h-10 w-10 animate-bounce" />
          </div>
          
          <div>
            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-blue-700">
              Verified Order
            </span>
            <h1 className="mt-4 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">IT Booking Confirmed</h1>
            <p className="mt-2 text-xs leading-relaxed text-slate-500 font-semibold max-w-sm">
              Your service request is verified. A certified Techbes specialist is being auto-allocated to your job sheet.
            </p>
          </div>

          {params.bookingId && (
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600 flex justify-between items-center w-full max-w-xs">
              <span className="text-slate-400">Order ID:</span>
              <span className="font-extrabold text-slate-800 font-mono select-all">{params.bookingId}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-xs pt-4">
            <Link 
              href="/dashboard" 
              className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors duration-150"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              My Dashboard
            </Link>
            <Link 
              href="/services" 
              className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors duration-150"
            >
              <Search className="h-3.5 w-3.5" />
              Book Another
            </Link>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
