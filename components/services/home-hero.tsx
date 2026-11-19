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

          {/* Right Column: Clean Multi-Image Bento Photo Grid */}
          <div className="w-full lg:col-span-5 relative flex items-center justify-center min-w-0 select-none">
            {/* Ambient subtle glow backdrop */}
            <div className="absolute -inset-1 sm:inset-0 rounded-3xl bg-gradient-to-tr from-blue-50/60 via-slate-50/40 to-emerald-50/40 border border-slate-100/80 shadow-[inset_0_1px_3px_rgba(255,255,255,0.8),0_10px_35px_rgba(15,23,42,0.03)] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />

            {/* Bento Grid: 2 Columns Staggered Photo Layout */}
            <div className="relative z-10 w-full p-1.5 sm:p-2.5 grid grid-cols-2 gap-3 sm:gap-3.5">
              {/* Column 1 */}
              <div className="flex flex-col gap-3 sm:gap-3.5">
                {/* Tile 1: Primary Enterprise Hardware & Security Showcase (Tall) */}
                <Link
                  href="/services"
                  className="group relative h-[190px] sm:h-[230px] lg:h-[250px] overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-50 via-white to-blue-50/40 shadow-[0_4px_20px_rgba(15,23,42,0.06)] hover:shadow-[0_12px_32px_rgba(37,99,235,0.14)] hover:border-blue-300 transition-all duration-500 block"
                >
                  <Image
                    src="/hero-illustration.png"
                    alt="TechBes Enterprise IT & Hardware Setup"
                    fill
                    className="object-contain p-2 sm:p-3 transition-transform duration-500 ease-out group-hover:scale-105"
                    priority
                    sizes="(max-width: 1024px) 50vw, 22vw"
                  />
                  {/* Integrated bottom caption */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent p-2.5 sm:p-3 text-white">
                    <p className="text-[11px] sm:text-xs font-bold leading-tight drop-shadow-sm">Enterprise Hardware</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-200 font-medium leading-tight drop-shadow-sm">All-in-One Solutions</p>
                  </div>
                </Link>

                {/* Tile 2: Chip-Level IT & Laptop Repair */}
                <Link
                  href="/services"
                  className="group relative h-[145px] sm:h-[180px] lg:h-[200px] overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-900 shadow-[0_4px_20px_rgba(15,23,42,0.06)] hover:shadow-[0_12px_32px_rgba(16,185,129,0.14)] hover:border-emerald-300 transition-all duration-500 block"
                >
                  <Image
                    src="/images/hero/laptop-repair.jpg"
                    alt="Chip-Level IT & Laptop Repair"
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 22vw"
                  />
                  {/* Integrated bottom caption */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent p-2.5 sm:p-3 text-white">
                    <p className="text-[11px] sm:text-xs font-bold leading-tight drop-shadow-sm">Chip-Level IT Repair</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-200 font-medium leading-tight drop-shadow-sm">Diagnostics & Service</p>
                  </div>
                </Link>
              </div>

              {/* Column 2 (Staggered: Shorter Tile on Top, Tall Tile on Bottom) */}
              <div className="flex flex-col gap-3 sm:gap-3.5">
                {/* Tile 3: CCTV Surveillance Camera Photo */}
                <Link
                  href="/services?category=cctv"
                  className="group relative h-[145px] sm:h-[180px] lg:h-[200px] overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-900 shadow-[0_4px_20px_rgba(15,23,42,0.06)] hover:shadow-[0_12px_32px_rgba(37,99,235,0.14)] hover:border-blue-300 transition-all duration-500 block"
                >
                  <Image
                    src="/images/hero/cctv.jpg"
                    alt="CCTV Surveillance Camera Installation"
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 22vw"
                  />
                  {/* Integrated bottom caption */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent p-2.5 sm:p-3 text-white">
                    <p className="text-[11px] sm:text-xs font-bold leading-tight drop-shadow-sm">CCTV Surveillance</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-200 font-medium leading-tight drop-shadow-sm">HD / IP / AI Cameras</p>
                  </div>
                </Link>

                {/* Tile 4: Networking & Structured Rack Photo (Tall) */}
                <Link
                  href="/services?category=networking"
                  className="group relative h-[190px] sm:h-[230px] lg:h-[250px] overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-900 shadow-[0_4px_20px_rgba(15,23,42,0.06)] hover:shadow-[0_12px_32px_rgba(99,102,241,0.14)] hover:border-indigo-300 transition-all duration-500 block"
                >
                  <Image
                    src="/images/hero/networking.jpg"
                    alt="Enterprise Networking & Wi-Fi Rack"
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 22vw"
                  />
                  {/* Integrated bottom caption */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent p-2.5 sm:p-3 text-white">
                    <p className="text-[11px] sm:text-xs font-bold leading-tight drop-shadow-sm">Networking & Wi-Fi</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-200 font-medium leading-tight drop-shadow-sm">Switches, Rack & Mesh</p>
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

