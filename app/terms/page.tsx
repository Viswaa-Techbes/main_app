import { PageShell } from "@/components/layout/page-shell";
import { getSeoMetadata } from "@/lib/seo-helpers";
import { FileCheck, Users, HelpCircle, RefreshCw } from "lucide-react";

export const metadata = getSeoMetadata({
  title: "Terms of Use | TechBes India",
  description:
    "Read the TechBes Terms of Use. Understand booking contracts, warranties, material quotes, and user agreements in Bangalore.",
  path: "/terms",
});

export default function TermsPage() {
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">Terms of Use</h1>
              <p className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" /> Last Updated: August 2, 2026
              </p>
            </div>
            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-3 text-blue-600 w-fit shrink-0">
              <FileCheck className="h-8 w-8" />
            </div>
          </div>

          {/* Terms Info Cards */}
          <div className="grid gap-4 sm:grid-cols-3 pt-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <Users className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Bookings & Allocation</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">Technicians are KYC-verified local professionals assigned to job orders.</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <FileCheck className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Pricing Quotes</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">Advance prices are base charges. Materials are billed on actual site usage.</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Work Warranty</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">Includes standard 30-day workmanship warranty. Excludes device faults.</p>
            </div>
          </div>

          {/* Terms Text */}
          <div className="space-y-6 text-xs text-slate-600 font-semibold leading-relaxed pt-4">
            
            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">1. Agreement to Terms</h2>
              <p>
                By accessing, browsing, or booking services on TechBes, you agree to comply with and be bound by these Terms of Use and all applicable local regulations inside Bangalore jurisdiction.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">2. Booking Rules & Advance Payment</h2>
              <p>
                Advance payments are mandatory to confirm booking slots. Bookings can be rescheduled or cancelled up to 2 hours before the scheduled slot via the customer dashboard settings. 
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">3. Material Billing Policy</h2>
              <p>
                For custom CCTV installation or structured cabling jobs, the initial online estimate is a base quote. Cables, PVC conduit casings, junction boxes, and PoE switches are measured and billed based on exact meters/units consumed at the site. The final invoice must be cleared upon work completion.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">4. Workmanship & Product Warranties</h2>
              <p>
                TechBes provides a 30-day warranty on workmanship (alignment, connection troubleshooting, basic settings). Product warranties (for cameras, DVR/NVR recorders, hard disks, or adapters) are provided directly by manufacturers (e.g., Hikvision, CP Plus, Dahua) under standard brand terms.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">5. Liability Limitations</h2>
              <p>
                TechBes is a digital marketplace platform. While we screen and KYC-verify partners, we are not liable for direct, indirect, or accidental damages resulting from physical site work beyond the value of the booking service charges.
              </p>
            </section>

          </div>
        </div>
      </div>
    </PageShell>
  );
}
