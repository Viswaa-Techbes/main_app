import { PageShell } from "@/components/layout/page-shell";
import { getSeoMetadata } from "@/lib/seo-helpers";
import { Truck, MapPin, Calendar, RefreshCw } from "lucide-react";

export const metadata = getSeoMetadata({
  title: "Shipping & Delivery Policy | TechBes India",
  description:
    "Read the TechBes Shipping and Delivery Policy. Learn about delivery areas, timelines, and product delivery charges in Bangalore.",
  path: "/shipping-policy",
});

export default function ShippingPolicyPage() {
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">Shipping & Delivery Policy</h1>
              <p className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" /> Last Updated: August 29, 2026
              </p>
            </div>
            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-3 text-blue-600 w-fit shrink-0">
              <Truck className="h-8 w-8" />
            </div>
          </div>

          {/* Cards */}
          <div className="grid gap-4 sm:grid-cols-3 pt-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <MapPin className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Bangalore Delivery</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">Primary service and delivery coverage for all active postal codes inside Bangalore urban zones.</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <Calendar className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Fast Timelines</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">Standard shipment delivery within 24 to 48 hours for local in-stock inventory items.</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <Truck className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Free With Install</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">Delivery charges are fully waived if you book a technician installation service together with products.</p>
            </div>
          </div>

          {/* Policy Text */}
          <div className="space-y-6 text-xs text-slate-600 font-semibold leading-relaxed pt-4">
            
            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">1. Delivery Scope</h2>
              <p>
                This shipping policy applies exclusively to physical products (including CCTV cameras, recorders, coaxial/CAT6 cabling, network racks, power adapters, and monitors) purchased directly through the TechBes catalog.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">2. Delivery Locations & Service Area</h2>
              <p>
                We deliver to all active pin codes within Bangalore metropolitan limits. We do not support outstation or interstate shipping at this time, as our local installation technicians verify and carry products directly to ensure quality control.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">3. Timeline & Tracking</h2>
              <p>
                Once an order is created and paid, our dispatch coordinator allocates the inventory. Standard delivery takes 24 to 48 hours. If the order is bundled with an installation service, the technician will carry the equipment directly to your site during your scheduled service window.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">4. Delivery Charges</h2>
              <p>
                A standard delivery charge of ₹99 is applicable for orders below ₹5,000. Orders above ₹5,000 or any orders bundled with a professional installation service are eligible for 100% free delivery.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">5. Damaged Shipments</h2>
              <p>
                Please verify and inspect the packages upon delivery. If you observe structural damages or seal tempering on physical CCTV cameras or boxes, reject the delivery and inform our support coordinator at lohith@techbes.co.in immediately.
              </p>
            </section>

          </div>
        </div>
      </div>
    </PageShell>
  );
}
