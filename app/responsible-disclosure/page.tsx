import { PageShell } from "@/components/layout/page-shell";
import { getSeoMetadata } from "@/lib/seo-helpers";
import { ShieldCheck, Mail, Send, RefreshCw } from "lucide-react";

export const metadata = getSeoMetadata({
  title: "Responsible Disclosure | TechBes India",
  description:
    "Read the TechBes Responsible Disclosure guidelines. Report system vulnerabilities or security concerns to our team in Bangalore.",
  path: "/responsible-disclosure",
});

export default function ResponsibleDisclosurePage() {
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">Responsible Disclosure</h1>
              <p className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" /> Last Updated: August 29, 2026
              </p>
            </div>
            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-3 text-blue-600 w-fit shrink-0">
              <ShieldCheck className="h-8 w-8" />
            </div>
          </div>

          {/* Cards */}
          <div className="grid gap-4 sm:grid-cols-3 pt-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Report Security Issues</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">Guidelines for ethical security researchers to report system flaws or data exposure vulnerabilities.</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <Send className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">No Disruption</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">Perform security testing without disrupting customer service, booking flows, or API databases.</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <Mail className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Direct Verification</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">Vulnerabilities are evaluated and addressed by our local engineering lead directly.</p>
            </div>
          </div>

          {/* Policy Text */}
          <div className="space-y-6 text-xs text-slate-600 font-semibold leading-relaxed pt-4">
            
            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">1. Our Commitment</h2>
              <p>
                At TechBes, customer data security is our top priority. We appreciate the work of independent security researchers and encourage responsible reporting of any security vulnerabilities found in our mobile apps, web dashboard, or backend servers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">2. Safe Harbor Rules</h2>
              <p>
                We ask that researchers follow these ethical guidelines when auditing TechBes:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Notify us immediately upon discovering a potential security issue.</li>
                <li>Avoid accessing customer profile details, modifying database states, or disrupting the technician booking flow.</li>
                <li>Give us a reasonable timeframe (at least 30 days) to address and patch the issue before making it public.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">3. Out of Scope Testing</h2>
              <p>
                The following testing methodologies are strictly prohibited and outside the scope of our responsible disclosure policy:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>DDoS (Distributed Denial of Service) attacks or load testing that causes system downtime.</li>
                <li>Social engineering or phishing targeting TechBes customers, technicians, or administrators.</li>
                <li>Physical intrusion attempts at our office or supplier warehouses in Bangalore.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">4. How to Submit a Report</h2>
              <p>
                If you believe you have discovered a vulnerability, please email our engineering team at lohith@techbes.co.in. Include a clear description of the issue, step-by-step instructions to reproduce it, and any proof-of-concept screenshots or scripts. We will review and acknowledge your submission within 3 business days.
              </p>
            </section>

          </div>
        </div>
      </div>
    </PageShell>
  );
}
