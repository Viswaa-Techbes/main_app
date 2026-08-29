import { PageShell } from "@/components/layout/page-shell";
import { getSeoMetadata } from "@/lib/seo-helpers";
import { IndianRupee, ShieldCheck, HelpCircle, RefreshCw } from "lucide-react";

export const metadata = getSeoMetadata({
  title: "Refund Policy | TechBes India",
  description:
    "Read the TechBes Refund Policy. Learn about failed payments, cancelled bookings, and hardware refund conditions in Bangalore.",
  path: "/refund-policy",
});

export default function RefundPolicyPage() {
  return (
    <PageShell>
      <div className="bg-slate-50/30 min-h-screen py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8 bg-white border border-slate-100 p-8 sm:p-12 rounded-3xl shadow-sm">
          
          {/* Header */}
          <div className="border-b border-slate-100 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-blue-700">
                Legal Center
              </span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">Refund Policy</h1>
              <p className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" /> Last Updated: August 29, 2026
              </p>
            </div>
            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-3 text-blue-600 w-fit shrink-0">
              <IndianRupee className="h-8 w-8" />
            </div>
          </div>

          {/* Cards */}
          <div className="grid gap-4 sm:grid-cols-3 pt-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Failed Transactions</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">Automatically reconciled. Sums are auto-refunded to the original payment source within 5-7 business days.</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <IndianRupee className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Booking Cancellations</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">100% refund eligible if cancelled at least 2 hours before the technician's scheduled arrival window.</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Hardware Returns</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">Eligible for return within 7 days of delivery if in sealed, original brand packaging.</p>
            </div>
          </div>

          {/* Policy Text */}
          <div className="space-y-6 text-xs text-slate-600 font-semibold leading-relaxed pt-4">
            
            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">1. Scope of Policy</h2>
              <p>
                This policy outlines the rules governing refunds for advance service booking charges, wallet top-ups, and physical CCTV product purchases made through the TechBes marketplace platform.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">2. Booking Cancellations & Rescheduling</h2>
              <p>
                To qualify for a full refund of your booking advance, you must cancel or reschedule the service booking at least 2 hours prior to the start of the scheduled window. Bookings cancelled within 2 hours of the scheduled slot are subject to a ₹199 cancellation and technician allocation fee.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">3. Failed Payments & Bank Reversals</h2>
              <p>
                If money is debited from your account but the booking status fails to update, our backend initiates auto-reconciliation through Razorpay. Reversals are processed instantly and should reflect in your banking channel/source wallet within 5 to 7 operational days.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">4. Physical Product Returns</h2>
              <p>
                Unused CCTV cameras, DVR/NVR recorders, hard disks, cabling reels, and racks purchased through the catalog can be returned within 7 days of delivery. Returns are accepted only if the manufacturer seal remains intact. A quality assessment check will be completed before issuing a refund.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">5. Contact Information</h2>
              <p>
                For refund processing queries, please email our billing department at lohith@techbes.co.in with your Booking ID/Payment transaction code.
              </p>
            </section>

          </div>
        </div>
      </div>
    </PageShell>
  );
}
