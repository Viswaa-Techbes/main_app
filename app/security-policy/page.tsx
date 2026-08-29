import { PageShell } from "@/components/layout/page-shell";
import { getSeoMetadata } from "@/lib/seo-helpers";
import { ShieldAlert, ShieldCheck, Lock, RefreshCw } from "lucide-react";

export const metadata = getSeoMetadata({
  title: "Security Policy | TechBes India",
  description:
    "Read the TechBes Security Policy. Learn about our data protection rules, secure payment handling, and system integrity in Bangalore.",
  path: "/security-policy",
});

export default function SecurityPolicyPage() {
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">Security Policy</h1>
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
              <Lock className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Secure Transport</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">All data payloads are transmitted using TLS/SSL protocols with strong cipher suites.</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Payment Safety</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">PCI-DSS Level 1 compliant transactions integrated natively via Razorpay gateway.</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <ShieldAlert className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Access Control</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">Technician roles are isolated via cryptographically signed JWT tokens.</p>
            </div>
          </div>

          {/* Policy Text */}
          <div className="space-y-6 text-xs text-slate-600 font-semibold leading-relaxed pt-4">
            
            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">1. Data Security & Encryption</h2>
              <p>
                All network interactions with the TechBes API are protected using HTTPS (Secure Hypertext Transfer Protocol). Customer details, phone verification numbers, address logs, and technician locations are encrypted at rest and in transit.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">2. Financial Integrity & Payments</h2>
              <p>
                TechBes does not store raw credit/debit card numbers, UPI PINs, or net banking passwords. Payment checkouts are tokenized and processed through Razorpay's secure SDK. Payment verification employs cryptographic signatures generated server-side.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">3. User Authentication Security</h2>
              <p>
                User accounts utilize JSON Web Tokens (JWT) for secure session persistence. Mobile phone verification uses one-time passwords (OTP) generated server-side with a strict 5-minute expiration period. Debugging variables or raw OTPs are never rendered in client application logs.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">4. Infrastructure Security</h2>
              <p>
                Database connection strings, Twilio authentication tokens, SMTP server credentials, and API private keys are stored securely using environment variables on isolated production servers. Git repositories contain only `.env.example` configurations with mock placeholders.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">5. Contact Information</h2>
              <p>
                To learn more about our security practices, or to report an issue, please contact our security team at lohith@techbes.co.in.
              </p>
            </section>

          </div>
        </div>
      </div>
    </PageShell>
  );
}
