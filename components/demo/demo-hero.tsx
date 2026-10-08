"use client";

import React from "react";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  CheckCircle2,
  Calendar,
  Building,
  Phone,
} from "lucide-react";
import { DEMO_OFFICE_PHONE, DEMO_OFFICE_PHONE_RAW } from "./demo-data";

interface DemoHeroProps {
  onExploreCategories: () => void;
  onBookFreeVisit: () => void;
}

export function DemoHero({ onExploreCategories, onBookFreeVisit }: DemoHeroProps) {
  return (
    <div className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 text-center lg:text-left">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
        {/* Left Column: Headlines & CTAs */}
        <div className="space-y-6 max-w-2xl">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-bold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Bangalore's Leading IT & Security Solutions</span>
          </div>

          {/* Primary Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Enterprise CCTV & Smart IT Infrastructure{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">
              Delivered at Your Doorstep.
            </span>
          </h1>

          {/* Supporting Description */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Certified on-site engineering dispatch for CCTV installation, corporate Wi-Fi networking, server racks, and business IT maintenance with transparent digital quotations and zero-cost on-site surveys across Bangalore.
          </p>

          {/* Key Value Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-300 pt-1">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Verified On-Site Engineers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Free Site Survey</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Transparent Itemized Pricing</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
            <button
              onClick={onExploreCategories}
              className="w-full sm:w-auto py-3.5 px-7 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore 10 Service Categories</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onBookFreeVisit}
              className="w-full sm:w-auto py-3.5 px-7 rounded-xl font-bold text-sm bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Schedule Free Site Visit</span>
            </button>
          </div>
        </div>

        {/* Right Column: Hero Metrics & Visual Highlight Card */}
        <div className="w-full max-w-md lg:max-w-md shrink-0">
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Bangalore Operations
                </div>
                <div className="text-xl font-bold text-white mt-0.5">Rapid Engineering Hub</div>
              </div>
              <div className="flex items-center gap-1 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-full text-amber-300 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>4.9 / 5.0</span>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-2xl font-black text-white">2,400+</div>
                <div className="text-xs text-slate-400 mt-0.5">Installations Completed</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-2xl font-black text-emerald-400">15 Mins</div>
                <div className="text-xs text-slate-400 mt-0.5">Average Engineer Dispatch</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-2xl font-black text-blue-400">100%</div>
                <div className="text-xs text-slate-400 mt-0.5">Certified On-Site Staff</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-2xl font-black text-amber-400">₹0</div>
                <div className="text-xs text-slate-400 mt-0.5">Property Site Survey Fee</div>
              </div>
            </div>

            {/* Official Support Ribbon */}
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between text-xs">
              <span className="text-slate-300">Official Helpline:</span>
              <a href={`tel:${DEMO_OFFICE_PHONE_RAW}`} className="font-bold text-white flex items-center gap-1.5 hover:text-blue-300 transition">
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>{DEMO_OFFICE_PHONE}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
