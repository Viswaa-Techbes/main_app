import { PageShell } from "@/components/layout/page-shell";
import { getSeoMetadata } from "@/lib/seo-helpers";
import { XCircle, CheckCircle, Clock, RefreshCw } from "lucide-react";

export const metadata = getSeoMetadata({
  title: "Cancellation Policy | TechBes India",
  description:
    "Read the TechBes Cancellation Policy. Learn about rescheduling deadlines, booking cancellation charges, and technician transit rules in Bangalore.",
  path: "/cancellation-policy",
});

export default function CancellationPolicyPage() {
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">Cancellation Policy</h1>
              <p className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" /> Last Updated: August 29, 2026
              </p>
            </div>
            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-3 text-blue-600 w-fit shrink-0">
              <XCircle className="h-8 w-8" />
            </div>
          </div>

          {/* Cards */}
          <div className="grid gap-4 sm:grid-cols-3 pt-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <Clock className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Free Cancellation</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">100% free cancellation or rescheduling if completed at least 2 hours before the service slot.</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <XCircle className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Late Cancellation</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">Cancellations within 2 hours of the slot incur a nominal ₹199 technician commitment charge.</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">No Show Rule</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">If customer is unreachable or unavailable at the site for 30 minutes, booking is auto-cancelled.</p>
            </div>
          </div>

          {/* Policy Text */}
          <div className="space-y-6 text-xs text-slate-600 font-semibold leading-relaxed pt-4">
            
            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">1. Cancellation Window</h2>
              <p>
                To provide a reliable schedule for our local Bangalore technicians, cancellations and rescheduling must be performed at least 2 hours before the start of the booked time slot. This can be handled directly via the "My Bookings" page of your Customer Dashboard.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">2. Applicable Cancellation Charges</h2>
              <p>
                If you cancel a booking less than 2 hours before the slot, or after a technician has already been dispatched and is transit, a standard ₹199 cancellation charge will be deducted from your advance payment. The remaining balance will be returned to your original payment mode or credited to your TechBes wallet as per your preference.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">3. Customer No-Show Policy</h2>
              <p>
                Our assigned technician will wait at the designated service location for up to 30 minutes from arrival. They will attempt to contact you via phone and SMS. If there is no response or access is denied after 30 minutes, the booking will be marked as cancelled (Customer No-Show) and the ₹199 transit fee will apply.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">4. Partner-Initiated Cancellations</h2>
              <p>
                In rare instances where a technician cannot complete the booking due to an emergency or technical constraints, TechBes will automatically allocate another certified technician or offer a 100% instant refund with no fees.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">5. Contact Information</h2>
              <p>
                For urgent booking cancellation requests or rescheduling support, please contact the support desk at lohith@techbes.co.in or call us directly.
              </p>
            </section>

          </div>
        </div>
      </div>
    </PageShell>
  );
}
