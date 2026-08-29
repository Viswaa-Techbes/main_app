import { PageShell } from "@/components/layout/page-shell";
import { getSeoMetadata } from "@/lib/seo-helpers";
import { AlertCircle, FileText, HelpCircle, RefreshCw } from "lucide-react";

export const metadata = getSeoMetadata({
  title: "Disclaimer | TechBes India",
  description:
    "Read the TechBes Service Disclaimer. Understand limitations of services, pricing estimates, and manufacturer brand warranties in Bangalore.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">Disclaimer</h1>
              <p className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" /> Last Updated: August 29, 2026
              </p>
            </div>
            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-3 text-blue-600 w-fit shrink-0">
              <AlertCircle className="h-8 w-8" />
            </div>
          </div>

          {/* Cards */}
          <div className="grid gap-4 sm:grid-cols-3 pt-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Pricing Estimates</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">Online CCTV system configurations provide standard estimates. Cable length billing is based on actual site consumption.</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Third-Party Hardware</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">Hardware warranties are managed directly by equipment brands. TechBes is not liable for structural component failures.</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Service Scope</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">Technicians are KYC-screened independent partners. Standard workmanship warranties are limited to 30 days.</p>
            </div>
          </div>

          {/* Policy Text */}
          <div className="space-y-6 text-xs text-slate-600 font-semibold leading-relaxed pt-4">
            
            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">1. General Information Disclaimer</h2>
              <p>
                All materials, descriptions, pricing guides, and specifications listed on TechBes are provided strictly for general informational purposes. While we strive to maintain catalog accuracy, we do not make absolute guarantees regarding pricing updates or hardware modifications made by manufacturers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">2. CCTV Material Usage</h2>
              <p>
                Initial automated CCTV configuration estimates (e.g. coaxial cabling, CAT6, conduits) are based on average standard properties. If your property layout requires complex routing, double ceilings, or external ducting, additional cable run charges will apply and will be documented in the final worksheet.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">3. Technical Interferences & Exclusions</h2>
              <p>
                TechBes and its technicians are not responsible for CCTV service drops caused by local internet connectivity issues, power grid anomalies, network router restarts, or physical tampering with cameras or storage drives post-installation.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">4. Limitation of Liability</h2>
              <p>
                In no event shall TechBes or its parent entities be liable for any direct, indirect, special, or consequential damages resulting from site construction or technician installation work, beyond the direct value of the service booking fee.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">5. Contact Information</h2>
              <p>
                If you have legal or general compliance queries regarding this disclaimer, please contact us at lohith@techbes.co.in.
              </p>
            </section>

          </div>
        </div>
      </div>
    </PageShell>
  );
}
