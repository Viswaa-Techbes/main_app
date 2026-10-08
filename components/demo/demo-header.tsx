"use client";

import React from "react";
import Link from "next/link";
import { Phone, Sparkles, ShieldCheck, ArrowRight, Layers } from "lucide-react";
import { DEMO_OFFICE_PHONE, DEMO_OFFICE_PHONE_RAW } from "./demo-data";

interface DemoHeaderProps {
  onBookFreeVisit: () => void;
  onScrollToCategories: () => void;
}

export function DemoHeader({ onBookFreeVisit, onScrollToCategories }: DemoHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80 transition-all">
      {/* Top Investor Demo Notice Bar */}
      <div className="bg-gradient-to-r from-blue-900/90 via-indigo-950/90 to-blue-900/90 text-white text-[11px] font-semibold py-1.5 px-4 border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="tracking-wider uppercase font-bold text-blue-200">INVESTOR PRESENTATION DEMO</span>
            <span className="hidden sm:inline text-blue-300/80">• Interactive Customer Onboarding & Quotation Flow</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-300 hidden md:inline">Official Office:</span>
            <a
              href={`tel:${DEMO_OFFICE_PHONE_RAW}`}
              className="font-bold text-white hover:text-blue-300 transition flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>{DEMO_OFFICE_PHONE}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/demo" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-extrabold text-base shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              TB
            </div>
            <div>
              <div className="text-lg font-black tracking-tight text-white flex items-center gap-1">
                TechBes
                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 tracking-widest uppercase">
                  Demo
                </span>
              </div>
              <div className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
                IT & Security Infrastructure
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Demo Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <button
            onClick={onScrollToCategories}
            className="hover:text-white transition flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>10 Service Categories</span>
          </button>
          <a href="#quotation-flow-section" className="hover:text-white transition cursor-pointer">
            Quotation Workflow
          </a>
          <a href="#free-site-visit-section" className="hover:text-white transition cursor-pointer text-emerald-400 font-bold">
            Free Site Visit
          </a>
          <a href="#testimonials-section" className="hover:text-white transition cursor-pointer">
            Client Reviews
          </a>
        </nav>

        {/* Right Action Call & CTA */}
        <div className="flex items-center gap-3">
          <a
            href={`tel:${DEMO_OFFICE_PHONE_RAW}`}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 text-xs font-bold text-white transition"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>{DEMO_OFFICE_PHONE}</span>
          </a>

          <button
            onClick={onBookFreeVisit}
            className="py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>Book Free Visit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
