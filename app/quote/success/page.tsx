"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Phone, MessageSquare, ArrowLeft, ShieldCheck, Clock, FileText } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";

function SuccessContent() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId") || "QT-CONFIRMED";
  const fullName = searchParams.get("fullName") || "Valued Customer";
  const category = searchParams.get("category") || "IT Services";
  const service = searchParams.get("service") || searchParams.get("requirementType") || "Custom Service";
  const locality = searchParams.get("locality") || "Bangalore";

  const supportPhone = "+919164487286";
  const whatsappUrl = `https://wa.me/919164487286?text=Hi%20TechBes,%20I%20just%20submitted%20Quotation%20Request%20${encodeURIComponent(requestId)}%20for%20${encodeURIComponent(service)}.%20Please%20share%20the%20details.`;

  return (
    <main className="mx-auto grid min-h-[75vh] max-w-xl place-items-center px-4 py-12 text-center">
      <div className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-9 shadow-sm space-y-6 flex flex-col items-center w-full">
        <div className="rounded-full bg-emerald-50 border border-emerald-100 p-4 text-emerald-600 shadow-sm animate-pulse">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        
        <div>
          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
            Quotation Request Received
          </span>
          <h1 className="mt-3.5 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            Thank You, {fullName}!
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-slate-500 font-medium max-w-md">
            Your quotation request has been recorded in our system. Our technical estimation team is reviewing your requirements and will dispatch an itemized estimate to your portal and WhatsApp.
          </p>
        </div>

        {/* Details Card */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4.5 text-xs text-slate-700 w-full space-y-3 text-left">
          <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/60">
            <span className="text-slate-400 font-medium">Enquiry Reference:</span>
            <span className="font-black text-blue-600 font-mono text-sm select-all">{requestId}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Category:</span>
            <span className="font-bold text-slate-800">{category}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Service Selected:</span>
            <span className="font-bold text-slate-800 text-right max-w-[220px] truncate">{service}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Site Location:</span>
            <span className="font-bold text-slate-800 text-right max-w-[220px] truncate">{locality}</span>
          </div>
        </div>

        {/* What Happens Next Steps */}
        <div className="w-full bg-blue-50/40 border border-blue-100/60 rounded-2xl p-4 text-left space-y-2">
          <h4 className="text-[11px] font-black uppercase tracking-wider text-blue-900">What happens next?</h4>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside font-medium leading-relaxed">
            <li>Our operations team verifies your site requirements.</li>
            <li>We prepare an itemized quote with zero hidden charges.</li>
            <li>We contact you via call and WhatsApp to confirm visit schedule.</li>
          </ul>
        </div>

        {/* Action Triggers */}
        <div className="flex flex-col gap-2.5 w-full pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors duration-150"
          >
            <MessageSquare className="h-4 w-4" />
            Connect via WhatsApp
          </a>

          <a
            href={`tel:${supportPhone}`}
            className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors duration-150"
          >
            <Phone className="h-4 w-4" />
            Call TechBes Operations ({supportPhone})
          </a>
          
          <Link
            href="/services"
            className="w-full inline-flex items-center justify-center gap-1.5 h-11 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors duration-150"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Explore All Services
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function QuoteSuccessPage() {
  return (
    <PageShell>
      <Suspense
        fallback={
          <div className="min-h-[70vh] flex items-center justify-center text-slate-400 text-sm font-bold">
            Loading quotation confirmation...
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </PageShell>
  );
}
