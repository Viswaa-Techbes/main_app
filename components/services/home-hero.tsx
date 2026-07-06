"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Sparkles, ShieldCheck, Users, Camera, Network, Laptop, Monitor, Globe, Crown } from "lucide-react";
import { useState } from "react";

const CATEGORY_TILES = [
  { id: "cctv", label: "CCTV", icon: Camera, subtitle: "Smart surveillance & office security" },
  { id: "networking", label: "Networking", icon: Network, subtitle: "WiFi setup & structured cabling" },
  { id: "laptop", label: "Laptop", icon: Laptop, subtitle: "Screen, battery & OS repair" },
  { id: "desktop", label: "Desktop", icon: Monitor, subtitle: "PC assembly, repairs & upgrades" },
  { id: "website-development", label: "Website Development", icon: Globe, subtitle: "Custom business websites & SEO" },
];

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { heroSuggestions } from "@/lib/marketplace-data";

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

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          
          {/* Left Column: Headings, Search & Actions */}
          <div className="w-full lg:w-[50%] shrink-0">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-700">
              <Sparkles className="h-3 w-3 text-blue-600 animate-pulse" />
              Verified IT Support
            </div>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-[42px]">
              Smart IT Solutions <br />
              for <span className="text-blue-600 font-black">Every Need</span>
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-slate-500 max-w-md">
              One-stop destination for CCTV, Networking, IT Hardware, Software, Security & more.
            </p>

            {/* Actions & Search */}
            <div className="mt-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="h-11 w-full sm:w-56 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 shadow-md hover:shadow-lg transition-all flex items-center justify-center" asChild>
                  <Link href="/services">
                    Explore Services
                  </Link>
                </Button>
                <Button variant="outline" className="h-11 w-full sm:w-56 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 px-6 flex items-center justify-center" asChild>
                  <Link href="/services">
                    Book a Free Consultation
                  </Link>
                </Button>
              </div>

              {/* Search Container */}
              <div className="relative max-w-md pt-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
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
            <div className="mt-8 border-t border-slate-100 pt-6 grid grid-cols-2 gap-4">
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

          {/* Right Column: Premium Illustration Image */}
          <div className="w-full lg:w-[46%] flex items-center justify-center">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm max-w-md lg:max-w-none">
              <Image
                src="/hero-illustration.png"
                alt="IT Hardware Solutions"
                fill
                className="object-cover transition-transform duration-700 hover:scale-103"
                priority
              />
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
                  href={`/services?category=${cat.id}`}
                  className="group relative flex flex-col items-center text-center p-4 rounded-[18px] border border-slate-200 bg-white shadow-[0_4px_12px_rgba(15,23,42,0.06)] hover:-translate-y-[6px] hover:border-blue-600 hover:shadow-[0_14px_30px_rgba(37,99,235,0.18)] transition-all duration-300 ease-out"
                >
                  <div className="absolute inset-0 rounded-[18px] opacity-0 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.08),transparent_60%)] pointer-events-none transition-opacity duration-300" />
                  
                  <div className="relative z-10 rounded-full bg-blue-50 text-blue-600 p-3.5 transition-transform duration-300 group-hover:scale-[1.08] shadow-sm">
                    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-blue-400/20 blur-md transition-opacity duration-300" />
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

