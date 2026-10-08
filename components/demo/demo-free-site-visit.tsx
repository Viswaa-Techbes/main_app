"use client";

import React from "react";
import {
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Phone,
  Sparkles,
  Clock,
  Building,
} from "lucide-react";
import { DEMO_OFFICE_PHONE, DEMO_OFFICE_PHONE_RAW } from "./demo-data";

interface DemoFreeSiteVisitProps {
  onBookFreeVisit: () => void;
}

export function DemoFreeSiteVisit({ onBookFreeVisit }: DemoFreeSiteVisitProps) {
  return (
    <div
      id="free-site-visit-section"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-emerald-500/40 p-6 sm:p-10 lg:p-12 shadow-2xl"
    >
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            100% Free • Zero Commitment • All Bangalore Localities
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Book a Free On-Site Inspection & Security Consultation
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Planning a new CCTV surveillance layout, office Wi-Fi upgrade, or server rack cabling? Our certified engineers will inspect your premises in Bangalore at zero charge, calculate exact angles and wiring lengths, and provide a transparent itemized quotation.
          </p>

          {/* 4 Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full premises camera placement layout plan</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Cabling distance & conduit path measurement</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Itemized quote with no hidden charges</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Same-day or next-day scheduled engineering slot</span>
            </div>
          </div>
        </div>

        {/* CTA Card Box */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl lg:w-80 shrink-0 space-y-4 text-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-md">
            <Calendar className="w-6 h-6" />
          </div>

          <div>
            <div className="text-base font-bold text-white">Zero Obligation</div>
            <div className="text-xs text-slate-400 mt-0.5">Free for Homes, Offices, Retail & Warehouses</div>
          </div>

          <button
            onClick={onBookFreeVisit}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
          >
            <span>Book Free Site Visit Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Phone className="w-3.5 h-3.5 text-blue-400" />
            <span>
              Official Office: <strong className="text-white">{DEMO_OFFICE_PHONE}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
