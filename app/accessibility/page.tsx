import { PageShell } from "@/components/layout/page-shell";
import { getSeoMetadata } from "@/lib/seo-helpers";
import { Eye, ShieldCheck, HelpCircle, RefreshCw } from "lucide-react";

export const metadata = getSeoMetadata({
  title: "Accessibility Statement | TechBes India",
  description:
    "Read the TechBes Accessibility Statement. Learn about our commitment to web accessibility guidelines and how to report issues in Bangalore.",
  path: "/accessibility",
});

export default function AccessibilityPage() {
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">Accessibility Statement</h1>
              <p className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" /> Last Updated: August 29, 2026
              </p>
            </div>
            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-3 text-blue-600 w-fit shrink-0">
              <Eye className="h-8 w-8" />
            </div>
          </div>

          {/* Cards */}
          <div className="grid gap-4 sm:grid-cols-3 pt-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <Eye className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Web Standards</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">Striving to comply with the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Interface Adaptability</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">Supporting key contrast levels, responsive typography scaling, and clean semantic elements.</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Feedback Channel</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">Dedicated channel for accessibility concerns or suggestions from the community.</p>
            </div>
          </div>

          {/* Policy Text */}
          <div className="space-y-6 text-xs text-slate-600 font-semibold leading-relaxed pt-4">
            
            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">1. Our Commitment</h2>
              <p>
                TechBes is committed to digital inclusion and accessibility. We believe that everyone should have access to our IT and CCTV service booking marketplace, and we continually optimize our web application features to support screen readers, keyboard navigation, and custom contrast adjustments.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">2. Technical Specifications</h2>
              <p>
                Accessibility on TechBes relies on standard Next.js layouts and semantic HTML markup elements:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Logical heading hierarchies (`h1` through `h6`) for screen reader indexation.</li>
                <li>Strategic ARIA labels for interactive elements (such as camera selection counters, modal triggers, and form input controls).</li>
                <li>Consistent focus indicators for keyboard-only navigation.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">3. Ongoing Improvements</h2>
              <p>
                While we strive to align all components to WCAG 2.1 AA standards, some dynamic components (like interactive maps for technician tracking or location pinpointing) may have limitations. We are actively working on text-based alternatives for geographical layouts.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">4. Contact Information</h2>
              <p>
                If you encounter accessibility issues or require assistance with booking a technician, please email us at lohith@techbes.co.in.
              </p>
            </section>

          </div>
        </div>
      </div>
    </PageShell>
  );
}
