import { PageShell } from "@/components/layout/page-shell";
import { getSeoMetadata } from "@/lib/seo-helpers";
import { RefreshCw, CheckCircle, HelpCircle } from "lucide-react";

export const metadata = getSeoMetadata({
  title: "Return & Exchange Policy | TechBes India",
  description:
    "Read the TechBes Return and Exchange Policy. Learn about returning physical CCTV cameras, cable reels, and other hardware accessories in Bangalore.",
  path: "/return-policy",
});

export default function ReturnPolicyPage() {
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">Return & Exchange Policy</h1>
              <p className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" /> Last Updated: August 29, 2026
              </p>
            </div>
            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-3 text-blue-600 w-fit shrink-0">
              <RefreshCw className="h-8 w-8" />
            </div>
          </div>

          {/* Cards */}
          <div className="grid gap-4 sm:grid-cols-3 pt-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <RefreshCw className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">7-Day Window</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">Unopened CCTV cameras and equipment boxes can be returned or exchanged within 7 days of delivery.</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Sealed Packets</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">Products must have the original box, brand holographic tags, serial numbers, and invoice copy.</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Brand Warranties</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">Post-installation hardware issues are covered directly under brand manufacturer warranties.</p>
            </div>
          </div>

          {/* Policy Text */}
          <div className="space-y-6 text-xs text-slate-600 font-semibold leading-relaxed pt-4">
            
            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">1. Return Eligibility</h2>
              <p>
                Unopened, uninstalled physical items purchased from TechBes (such as cameras, NVRs/DVRs, and networking accessories) are eligible for return or exchange within 7 days of the delivery timestamp.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">2. Exclusions & Ineligible Items</h2>
              <p>
                We cannot accept returns or exchanges for:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Cabling or conduits that have already been measured, cut, and laid at the site.</li>
                <li>Equipment where the box has been opened, seals are broken, or serial tags are defaced.</li>
                <li>Customized server rack mounts that were ordered to specific client custom sizing specifications.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">3. Brand Warranty Procedures</h2>
              <p>
                Once an item is installed and verified by our technician, any future hardware failures or functional defects are subject to standard brand warranty terms. Major brands (Hikvision, CP Plus, Dahua, Secureye) offer 1 to 2 years of warranty. We will support you in raising RMA requests with local Bangalore service centers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">4. Return Fees & Logistics</h2>
              <p>
                If you request a return, we will coordinate a reverse pick-up from your address. A standard verification and pickup charge of ₹149 is applicable unless the return is due to a wrong/incorrect item sent from our end.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">5. Contact Information</h2>
              <p>
                For returns processing or exchange queries, please contact our support desk at lohith@techbes.co.in.
              </p>
            </section>

          </div>
        </div>
      </div>
    </PageShell>
  );
}
