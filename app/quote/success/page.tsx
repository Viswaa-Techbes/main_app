"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Phone, MessageSquare, ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";

function SuccessContent() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId") || "QT-PENDING";
  const fullName = searchParams.get("fullName") || "Customer";
  const locality = searchParams.get("locality") || "Bangalore";
  const requirementType = searchParams.get("requirementType") || "CCTV Installation";
  const cameraCount = searchParams.get("cameraCount") || "Not Sure";

  const supportPhone = "+919900012345";
  const whatsappUrl = `https://wa.me/919900012345?text=Hi%20TechBes,%20I%20just%20submitted%20CCTV%20Quote%20Request%20${requestId}.%20Please%20help%2520me%2520schedule%2520the%2520survey.`;

  return (
    <main className="mx-auto grid min-h-[70vh] max-w-xl place-items-center px-4 py-12 text-center">
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm space-y-6 flex flex-col items-center w-full">
        <div className="rounded-full bg-emerald-50 border border-emerald-100 p-5 text-emerald-600 shadow-sm animate-pulse">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        
        <div>
          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
            Request Logged
          </span>
          <h1 className="mt-4 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            Quote Request Submitted Successfully
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-slate-500 font-semibold max-w-sm">
            Thank you, {fullName}. Our security design team is reviewing your requirements. We will contact you shortly to clarify specs or set up a free site survey.
          </p>
        </div>

        {/* Details card */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-xs font-semibold text-slate-600 w-full max-w-sm space-y-2.5 text-left">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-slate-400">Request ID:</span>
            <span className="font-extrabold text-slate-800 font-mono select-all text-sm">{requestId}</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Service:</span>
            <span className="font-bold text-slate-700">{requirementType}</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Camera Count:</span>
            <span className="font-bold text-slate-700">{cameraCount} Cameras</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Locality:</span>
            <span className="font-bold text-slate-700">{locality}, Bangalore</span>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="flex flex-col gap-2 w-full max-w-sm pt-4">
          <a
            href={`tel:${supportPhone}`}
            className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors duration-150"
          >
            <Phone className="h-4 w-4" />
            Call TechBes Support
          </a>
          
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors duration-150"
          >
            <MessageSquare className="h-4 w-4" />
            WhatsApp Chat
          </a>

          <Link
            href="/services/install-new-cctv"
            className="w-full inline-flex items-center justify-center gap-1.5 h-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors duration-150"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to CCTV Services
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
          Loading success details...
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </PageShell>
  );
}
