import { PageShell } from "@/components/layout/page-shell";
import { getSeoMetadata } from "@/lib/seo-helpers";
import { Cookie, Settings, ShieldCheck, RefreshCw } from "lucide-react";

export const metadata = getSeoMetadata({
  title: "Cookie Policy | TechBes India",
  description:
    "Read the TechBes Cookie Policy. Learn about the cookies we use, why we use them, and how to manage your preferences in Bangalore.",
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">Cookie Policy</h1>
              <p className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" /> Last Updated: August 29, 2026
              </p>
            </div>
            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-3 text-blue-600 w-fit shrink-0">
              <Cookie className="h-8 w-8" />
            </div>
          </div>

          {/* Cards */}
          <div className="grid gap-4 sm:grid-cols-3 pt-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Essential Cookies</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">Strictly necessary for login authentication, shopping cart contents, and session security.</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <Settings className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Preference Settings</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">Remembers configured CCTV models, pricing selections, and location settings.</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <Cookie className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Consent Choices</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">Configure and update your specific analytics and marketing cookie preferences anytime.</p>
            </div>
          </div>

          {/* Policy Text */}
          <div className="space-y-6 text-xs text-slate-600 font-semibold leading-relaxed pt-4">
            
            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">1. What are Cookies?</h2>
              <p>
                Cookies are small text files stored in your web browser directory or device memory when you visit a website. They help the website recognise your device, maintain active sessions, remember user preferences, and compile overall user traffic analytics.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">2. Types of Cookies We Use</h2>
              <p>
                We use both first-party and third-party cookies on TechBes:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>Essential Cookies:</strong> Critical for account security, session stability, and the CCTV selection builder checkout. The site cannot function without these.</li>
                <li><strong>Performance & Analytics:</strong> Track aggregated customer page visits, interaction patterns, and referral sources in Bangalore to optimize service delivery.</li>
                <li><strong>Preference Cookies:</strong> Store UI values (such as dark mode preferences and active search filter selections).</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">3. Third-Party Integrations</h2>
              <p>
                Certain essential partners mount cookies to complete transactions:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>Razorpay:</strong> PCI-DSS compliant cookies to securely process payments and detect fraudulent operations.</li>
                <li><strong>Firebase:</strong> Used for notification dispatch status updates.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">4. How to Manage Cookies</h2>
              <p>
                You can configure your browser to decline or block cookies entirely, or utilize our built-in Cookie Consent Banner at the bottom of the page to customize your preferences. Please note that blocking essential cookies will make booking checkout and login authentication unavailable.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">5. Contact Information</h2>
              <p>
                For questions regarding our Cookie Policy, please contact our web administration team at lohith@techbes.co.in.
              </p>
            </section>

          </div>
        </div>
      </div>
    </PageShell>
  );
}
