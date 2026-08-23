"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Home, Settings, ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";

function SuccessContent() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId") || "QT-PENDING";
  const fullName = searchParams.get("fullName") || "Customer";
  const serviceCategory = searchParams.get("serviceCategory") || "CCTV";
  const pincode = searchParams.get("pincode") || "Bangalore";

  return (
    <main className="mx-auto grid min-h-[70vh] max-w-xl place-items-center px-4 py-12 text-center text-slate-800 font-sans">
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-md space-y-6 flex flex-col items-center w-full">
        <div className="rounded-full bg-emerald-50 border border-emerald-100 p-5 text-emerald-600 shadow-sm animate-pulse">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        
        <div>
          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
            Request Logged
          </span>
          <h1 className="mt-4 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            Your quote request has been submitted successfully.
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-slate-500 font-bold max-w-sm">
            Thank you, {fullName}. Our team will contact you shortly to review your requirement details and prepare your quotation.
          </p>
        </div>

        {/* Reference details */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 text-xs font-semibold text-slate-600 w-full max-w-sm space-y-2.5 text-left">
          <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
            <span className="text-slate-400">Request ID:</span>
            <span className="font-extrabold text-slate-800 font-mono select-all text-sm">{requestId}</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Service Category:</span>
            <span className="font-bold text-slate-700">{serviceCategory}</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Location Pincode:</span>
            <span className="font-bold text-slate-700">{pincode}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 w-full max-w-sm pt-4">
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors duration-150"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          
          <Link
            href="/services"
            className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors duration-150"
          >
            <Settings className="h-4 w-4 text-blue-600" />
            View Services
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function QuoteSuccessPage() {
  return (
    <PageShell>
      <Suspense fallback={
        <div className="min-h-[70vh] flex items-center justify-center text-slate-400 text-sm font-bold">
          Loading success confirmation...
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </PageShell>
  );
}
