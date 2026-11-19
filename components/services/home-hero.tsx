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
          <div className="w-full lg:col-span-7 flex flex-col justify-center min-w-0 z-10">
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

          {/* Right Column: Multi-Image Floating Showcase */}
          <div className="w-full lg:col-span-5 relative flex items-center justify-center min-w-0 h-[460px] sm:h-[500px] lg:h-[540px] select-none py-4">
            {/* Ambient tech backdrop & soft mesh glow */}
            <div className="absolute inset-2 sm:inset-0 rounded-3xl bg-gradient-to-tr from-blue-50/70 via-slate-50/50 to-emerald-50/50 border border-slate-100 shadow-[inset_0_1px_3px_rgba(255,255,255,0.9),0_10px_35px_rgba(15,23,42,0.04)] pointer-events-none" />
            
            {/* Decorative orbit and ambient blur glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[380px] h-[320px] sm:h-[380px] rounded-full border border-blue-200/40 border-dashed pointer-events-none animate-[spin_80s_linear_infinite]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />

            {/* Satellite Card 1: Top-Left (CCTV Surveillance) */}
            <div className="absolute -top-1 left-0 sm:top-3 sm:left-2 z-20 animate-float-slow">
              <div className="flex items-center gap-2.5 rounded-2xl bg-white/95 px-3 py-2 sm:px-3.5 sm:py-2.5 shadow-[0_10px_25px_rgba(15,23,42,0.08)] border border-blue-100 backdrop-blur-md hover:scale-105 transition-transform duration-300">
                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 p-2 text-white shadow-sm">
                  <Camera className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[11px] font-extrabold text-slate-900">CCTV Surveillance</p>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-[9px] font-semibold text-slate-500">4K ColorVu & AI Dome</p>
                </div>
              </div>
            </div>

            {/* Satellite Card 2: Top-Right (Enterprise Networking) */}
            <div className="absolute top-3 -right-1 sm:top-5 sm:right-1 z-20 animate-float-medium">
              <div className="flex items-center gap-2.5 rounded-2xl bg-white/95 px-3 py-2 sm:px-3.5 sm:py-2.5 shadow-[0_10px_25px_rgba(15,23,42,0.08)] border border-indigo-100 backdrop-blur-md hover:scale-105 transition-transform duration-300">
                <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-2 text-white shadow-sm">
                  <Network className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-extrabold text-slate-900">WiFi 6 & Mesh Setup</p>
                  <p className="text-[9px] font-semibold text-indigo-600">Gigabit Structured Rack</p>
                </div>
              </div>
            </div>

            {/* Main Center Hardware Showcase Visual */}
            <div className="relative z-10 w-[84%] sm:w-[78%] lg:w-[86%] aspect-[4/3] rounded-2xl overflow-hidden bg-white/95 border border-slate-200/90 shadow-[0_16px_40px_rgba(15,23,42,0.09)] backdrop-blur-sm transition-all duration-500 hover:shadow-[0_20px_50px_rgba(37,99,235,0.15)] group">
              <Image
                src="/hero-illustration.png"
                alt="TechBes Smart IT & Hardware Solutions"
                fill
                className="object-contain p-3 sm:p-4 transition-transform duration-700 group-hover:scale-105"
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              {/* Bottom glass status tag */}
              <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 rounded-xl bg-slate-900/85 backdrop-blur-md px-3 py-1.5 flex items-center justify-between text-white border border-white/10 shadow-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-wide truncate">Enterprise Hardware & CCTV</span>
                </div>
                <span className="text-[9px] font-extrabold text-blue-300 uppercase tracking-wider shrink-0 bg-blue-900/60 px-1.5 py-0.5 rounded border border-blue-400/30">Verified</span>
              </div>
            </div>

            {/* Satellite Card 3: Bottom-Left (Chip-Level IT & Laptop Repair) */}
            <div className="absolute bottom-3 left-0 sm:bottom-5 sm:left-2 z-20 animate-float-reverse">
              <div className="flex items-center gap-2.5 rounded-2xl bg-white/95 px-3 py-2 sm:px-3.5 sm:py-2.5 shadow-[0_10px_25px_rgba(15,23,42,0.08)] border border-emerald-100 backdrop-blur-md hover:scale-105 transition-transform duration-300">
                <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-2 text-white shadow-sm">
                  <Laptop className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-extrabold text-slate-900">Chip-Level IT Repair</p>
                  <p className="text-[9px] font-semibold text-emerald-600">Same-Day Diagnostic</p>
                </div>
              </div>
            </div>

            {/* Satellite Card 4: Bottom-Right (24/7 Verified Dispatch) */}
            <div className="absolute -bottom-1 right-0 sm:bottom-3 sm:right-1 z-20 animate-float-slow [animation-delay:2s]">
              <div className="flex items-center gap-2.5 rounded-2xl bg-white/95 px-3 py-2 sm:px-3.5 sm:py-2.5 shadow-[0_10px_25px_rgba(15,23,42,0.08)] border border-amber-100 backdrop-blur-md hover:scale-105 transition-transform duration-300">
                <div className="rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-2 text-white shadow-sm">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    <p className="text-[11px] font-extrabold text-slate-900">Bengaluru On-Site</p>
                    <span className="text-[8px] font-black text-amber-700 bg-amber-100 px-1 rounded">24/7</span>
                  </div>
                  <p className="text-[9px] font-semibold text-slate-500">Certified Tech Dispatch</p>
                </div>
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

