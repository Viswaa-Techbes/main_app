"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Sparkles, ShieldCheck, Users, Camera, Network, Laptop, Monitor, Globe, Crown, Megaphone, ArrowRight } from "lucide-react";
import { useState } from "react";

const CATEGORY_TILES = [
  { id: "cctv", label: "CCTV", icon: Camera, subtitle: "Smart surveillance & office security", href: "/services?category=cctv" },
  { id: "networking", label: "Networking", icon: Network, subtitle: "WiFi setup & structured cabling", href: "/services?category=networking" },
  { id: "amc", label: "AMC Plans", icon: ShieldCheck, subtitle: "Starting from ₹9,999 / year", href: "/amc", isHighlight: true, badge: "From ₹9,999" },
  { id: "website-development", label: "Web Designing", icon: Globe, subtitle: "Custom business websites & apps", href: "/services?category=website-development" },
  { id: "digital-marketing", label: "Digital Marketing", icon: Megaphone, subtitle: "SEO, Campaigns & Podcasting", href: "/services?category=digital-marketing" },
];

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { heroSuggestions } from "@/lib/marketplace-data";
import { openAiAssistant } from "@/components/ai-assistant/useAiAssistant";

export function HomeHero() {
  const [query, setQuery] = useState("");
  const suggestions = !query
    ? heroSuggestions
    : heroSuggestions.filter((item) => item.toLowerCase().includes(query.toLowerCase()));

  return (
    <section className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm">
      {/* Abstract radial grids for premium look */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.06),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.04),transparent_35%)] pointer-events-none" />

      {/* Subscribe Button - Top Right */}
      <a 
        href="https://members.techbes.co.in" 
        className="absolute top-5 right-5 lg:top-7 lg:right-7 z-20 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-1.5 text-[11px] font-bold tracking-wide text-white shadow-sm transition-all hover:scale-105 hover:shadow-md"
      >
        <Crown className="h-3 w-3 text-blue-200" />
        Subscribe
      </a>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Headings, Search & Actions */}
          <div className="w-full lg:col-span-6 flex flex-col justify-center min-w-0 z-10">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-700 w-fit">
              <Sparkles className="h-3 w-3 text-blue-600 animate-pulse" />
              Verified IT Support
            </div>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-[40px]">
              Smart IT Solutions <br />
              for <span className="text-blue-600 font-black">Every Need</span>
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-slate-500 max-w-md">
              One-stop destination for CCTV, Networking, IT Hardware, Software, Security & more.
            </p>

            {/* Actions & Search */}
            <div className="mt-6 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <Button className="h-11 w-full sm:w-auto px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center whitespace-nowrap" asChild>
                  <Link href="/services">
                    Explore Services
                  </Link>
                </Button>
                <Button variant="outline" className="h-11 w-full sm:w-auto px-5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center whitespace-nowrap" asChild>
                  <Link href="/get-a-quote">
                    Book Consultation
                  </Link>
                </Button>
                <button
                  type="button"
                  onClick={() => openAiAssistant()}
                  className="h-11 w-full sm:w-auto px-5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform" />
                  <span>Find Service with AI</span>
                </button>
              </div>

              {/* AI Quick Prompt Hint */}
              <button
                type="button"
                onClick={() => openAiAssistant({ initialPrompt: "ನನಗೆ ಮನೆಯ CCTV ಬೇಕು" })}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50/80 hover:bg-blue-100 border border-blue-200/60 text-blue-700 text-[11px] font-semibold transition text-left"
              >
                <span className="text-xs">🎤</span>
                <span>Ask in English, தமிழ் or ಕನ್ನಡ: <em>&quot;ನನಗೆ ಮನೆಯ CCTV ಬೇಕು&quot;</em></span>
                <ArrowRight className="w-3 h-3 text-blue-500 ml-1 shrink-0" />
              </button>

              {/* Search Container */}
              <div className="relative max-w-md pt-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    aria-label="Search services"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search CCTV, networking, repairs..."
                    className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-11 pr-4 text-xs focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  />
                  {query && suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 rounded-2xl border border-slate-100 bg-white p-3 shadow-xl max-h-48 overflow-y-auto">
                      <div className="flex flex-col gap-1.5">
                        {suggestions.map((item) => (
                          <button
                            key={item}
                            className="text-left rounded-lg px-3 py-1.5 text-xs text-slate-600 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors"
                            onClick={() => setQuery(item)}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Badges section at bottom of left column */}
            <div className="mt-8 border-t border-slate-100 pt-6">
              <div className="grid grid-cols-2 gap-4 max-w-xs">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-blue-50 p-1.5 text-blue-600">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">1000+</p>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Happy Customers</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-blue-50 p-1.5 text-blue-600">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Certified</p>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Technicians</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Studio Showcase (1 Main Card + 3 Bottom Cards) */}
          <div className="w-full lg:col-span-6 relative flex flex-col justify-center min-w-0 select-none">
            {/* Ambient subtle glow backdrop */}
            <div className="absolute -inset-1 sm:inset-0 rounded-3xl bg-gradient-to-tr from-blue-50/50 via-slate-50/30 to-emerald-50/30 border border-slate-100/80 shadow-[inset_0_1px_3px_rgba(255,255,255,0.8),0_10px_35px_rgba(15,23,42,0.03)] pointer-events-none" />

            <div className="relative z-10 w-full p-1 sm:p-2">
              {/* Top Main Showcase Card: Hardware & CCTV Solutions */}
              <Link
                href="/services"
                className="group relative w-full h-[220px] sm:h-[240px] lg:h-[250px] overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-blue-50/40 to-white shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 flex items-center justify-center p-3 sm:p-4 block"
              >
                <Image
                  src="/hero-illustration.png"
                  alt="TechBes Smart IT Solutions & Enterprise Hardware"
                  fill
                  className="object-contain p-2 sm:p-3 transition-transform duration-500 ease-out group-hover:scale-102"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Clean, subtle status pill */}
                <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-4 flex items-center justify-between rounded-xl bg-slate-900/80 backdrop-blur-md px-3 py-1.5 text-white border border-white/10 shadow-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-bold tracking-wide truncate">All-in-One IT & Security Solutions</span>
                  </div>
                  <span className="text-[9px] font-extrabold text-blue-300 uppercase tracking-wider shrink-0 bg-blue-900/60 px-1.5 py-0.5 rounded border border-blue-400/30">Verified</span>
                </div>
              </Link>

              {/* Bottom 3-Card Visual Strip */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mt-3 w-full">
                {/* Card 1 — CCTV & Security */}
                <Link
                  href="/services?category=cctv"
                  className="group relative h-[105px] lg:h-[115px] rounded-xl overflow-hidden border border-slate-200/80 bg-white shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-300 block"
                >
                  <Image
                    src="/images/hero/cctv.jpg"
                    alt="CCTV Systems"
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 33vw, 16vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-2 text-white">
                    <p className="text-[11px] font-bold leading-tight drop-shadow-sm truncate">CCTV Systems</p>
                  </div>
                </Link>

                {/* Card 2 — WiFi & Networking */}
                <Link
                  href="/services?category=networking"
                  className="group relative h-[105px] lg:h-[115px] rounded-xl overflow-hidden border border-slate-200/80 bg-white shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-300 block"
                >
                  <Image
                    src="/images/hero/networking.jpg"
                    alt="Networking"
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 33vw, 16vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-2 text-white">
                    <p className="text-[11px] font-bold leading-tight drop-shadow-sm truncate">Networking</p>
                  </div>
                </Link>

                {/* Card 3 — Laptop & IT Support */}
                <Link
                  href="/services"
                  className="group relative h-[105px] lg:h-[115px] rounded-xl overflow-hidden border border-slate-200/80 bg-white shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-300 block"
                >
                  <Image
                    src="/images/hero/it-hardware.jpg"
                    alt="IT Hardware"
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 33vw, 16vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-2 text-white">
                    <p className="text-[11px] font-bold leading-tight drop-shadow-sm truncate">IT Hardware</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

        </div>


        {/* ── Compact Category Tiles ── */}
        <div className="mt-10 border-t border-slate-100 pt-8">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Access</p>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
            {CATEGORY_TILES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.id}
                  href={cat.href}
                  className={`group relative flex flex-col items-center text-center p-4 rounded-[18px] border transition-all duration-300 ease-out ${
                    cat.isHighlight
                      ? "border-blue-300 bg-gradient-to-b from-blue-50/70 to-white shadow-[0_4px_16px_rgba(37,99,235,0.12)] hover:border-blue-600 hover:-translate-y-[6px]"
                      : "border-slate-200 bg-white shadow-[0_4px_12px_rgba(15,23,42,0.06)] hover:-translate-y-[6px] hover:border-blue-600 hover:shadow-[0_14px_30px_rgba(37,99,235,0.18)]"
                  }`}
                >
                  {cat.badge && (
                    <span className="absolute top-2 right-2 bg-amber-100 text-amber-800 border border-amber-300/60 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider z-20">
                      {cat.badge}
                    </span>
                  )}
                  <div className="absolute inset-0 rounded-[18px] opacity-0 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.08),transparent_60%)] pointer-events-none transition-opacity duration-300" />
                  
                  <div className={`relative z-10 rounded-full p-3.5 transition-transform duration-300 group-hover:scale-[1.08] shadow-sm ${
                    cat.isHighlight ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"
                  }`}>
                    <Icon className="relative z-10 h-6 w-6" />
                  </div>
                  <h3 className="relative z-10 mt-3 text-[13px] font-[700] text-slate-900 transition-colors truncate w-full">{cat.label}</h3>
                  <p className="relative z-10 mt-1 text-[10px] leading-relaxed text-slate-600 font-medium line-clamp-2 h-7">{cat.subtitle}</p>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

