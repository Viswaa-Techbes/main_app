"use client";

import React from "react";
import { Star, ShieldCheck, Quote, Sparkles } from "lucide-react";
import { DEMO_TESTIMONIALS } from "./demo-data";

export function DemoTestimonials() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Client Feedback & Demonstrations
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Trusted by Bangalore Businesses & Homeowners
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            See how TechBes delivers commercial grade surveillance and enterprise IT cabling with transparent pricing and on-schedule dispatch.
          </p>
        </div>
        <div className="text-xs text-slate-500 font-medium italic">
          * Representative investor demonstration profiles
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DEMO_TESTIMONIALS.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-xl flex flex-col justify-between space-y-4 relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 text-slate-800/80 pointer-events-none">
              <Quote className="w-12 h-12" />
            </div>

            <div className="space-y-3 relative z-10">
              {/* Star Rating & Verified Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Installation
                </span>
              </div>

              {/* Quote */}
              <p className="text-sm text-slate-200 leading-relaxed italic">
                "{t.quote}"
              </p>
            </div>

            {/* Author Info */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white text-sm">{t.author}</div>
                <div className="text-slate-400">{t.role} • {t.company}</div>
              </div>
              <span className="text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg">
                {t.service}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
