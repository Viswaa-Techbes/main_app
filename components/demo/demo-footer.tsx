"use client";

import React from "react";
import { Phone, MapPin, ShieldCheck, CheckCircle2 } from "lucide-react";
import { DEMO_OFFICE_PHONE, DEMO_OFFICE_PHONE_RAW } from "./demo-data";

export function DemoFooter() {
  const localities = [
    "Indiranagar",
    "Koramangala",
    "Nagarbhavi",
    "HSR Layout",
    "Whitefield",
    "Jayanagar",
    "Electronic City",
    "Hebbal",
    "Rajajinagar",
    "JP Nagar",
    "BTM Layout",
    "Marathahalli",
  ];

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & Overview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-extrabold text-sm">
                TB
              </div>
              <span className="text-lg font-black text-white">TechBes</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Bangalore's trusted platform for commercial CCTV surveillance, enterprise networking, and managed IT services with certified on-site engineering dispatch.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified On-Site Technicians</span>
            </div>
          </div>

          {/* Official Contact Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Official Corporate Contact
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-400 text-[11px]">Official Office Phone:</div>
                  <a
                    href={`tel:${DEMO_OFFICE_PHONE_RAW}`}
                    className="text-sm font-bold text-white hover:text-blue-400 transition"
                  >
                    {DEMO_OFFICE_PHONE}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-400 text-[11px]">Headquarters & Dispatch Hub:</div>
                  <div className="text-white font-medium">Bangalore, Karnataka, India</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bangalore Coverage Areas */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Service Coverage Across Bangalore
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {localities.map((loc) => (
                <span
                  key={loc}
                  className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300"
                >
                  {loc}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Investor Demo Notice */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} TechBes. All rights reserved. Professional IT & Security Infrastructure.
          </div>
          <div className="flex items-center gap-2 text-blue-400/80 font-medium">
            <span>Investor Presentation Demonstration Environment</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
