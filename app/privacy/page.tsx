import { PageShell } from "@/components/layout/page-shell";
import { getSeoMetadata } from "@/lib/seo-helpers";
import { ShieldCheck, Eye, Lock, RefreshCw } from "lucide-react";

export const metadata = getSeoMetadata({
  title: "Privacy Policy | TechBes India",
  description:
    "Read the TechBes Privacy Policy. Learn how we collect, store, and safeguard your personal information and booking details in Bangalore.",
  path: "/privacy",
});

export default function PrivacyPage() {
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">Privacy Policy</h1>
              <p className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" /> Last Updated: August 2, 2026
              </p>
            </div>
            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-3 text-blue-600 w-fit shrink-0">
              <ShieldCheck className="h-8 w-8" />
            </div>
          </div>

          {/* Privacy Cards */}
          <div className="grid gap-4 sm:grid-cols-3 pt-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <Eye className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Data We Collect</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">Name, email, phone number, installation address, and billing logs.</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <Lock className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Strict Security</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">Encrypted data transmission and Razorpay secure payment gateway.</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Your Control</h3>
              <p className="text-[10px] leading-relaxed text-slate-500 font-semibold">Request access, corrections, or complete erasure of your profile details.</p>
            </div>
          </div>

          {/* Policy Text */}
          <div className="space-y-6 text-xs text-slate-600 font-semibold leading-relaxed pt-4">
            
            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">1. Information Collection</h2>
              <p>
                We collect personal information directly when you register an account, book an IT/CCTV technician, request a free site survey, or submit a corporate AMC audit query. This information includes your name, email address, mobile number, pincode, and physical address in Bangalore for service delivery.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">2. How We Use Your Information</h2>
              <p>
                The collected information is used strictly to verify and process service bookings, assign verified local technicians to your location, calculate customized material charges, process secure advance payments, and send booking confirmation notifications.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">3. Payment Safety & Processing</h2>
              <p>
                All financial transactions on TechBes are processed through Razorpay's secure, PCI-DSS compliant payment gateway. We do not store your credit card, debit card, UPI credentials, or net banking credentials on our local servers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">4. Third-Party Sharing</h2>
              <p>
                We do not sell, rent, or trade your personal data with third-party advertisers. Your information is shared only with allocated, verified service technicians or partners specifically to complete your scheduled booking sheet in Bangalore.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider">5. Contact Information</h2>
              <p>
                If you have questions regarding this Privacy Policy, your saved profile data, or wish to request data deletion, please contact our privacy compliance team at lohith@techbes.co.in.
              </p>
            </section>

          </div>
        </div>
      </div>
    </PageShell>
  );
}
