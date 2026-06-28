"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Sparkles, Star, Users, ShieldCheck, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";

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
                <Button className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 shadow-md hover:shadow-lg transition-all" asChild>
                  <Link href="/services">
                    Explore Services
                  </Link>
                </Button>
                <Button variant="outline" className="h-11 rounded-xl border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 px-6" asChild>
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

        {/* Extended Stats strip below the Hero layout */}
        <div className="mt-10 border-t border-slate-100 pt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <BadgeStrip icon={Users} value="1000+" label="Happy Customers" />
          <BadgeStrip icon={ShieldCheck} value="Certified" label="Technicians" />
          <BadgeStrip icon={CheckCircle} value="Genuine" label="Products" />
          <BadgeStrip icon={Clock} value="Quick Support" label="On-time Service" />
        </div>

      </div>
    </section>
  );
}

function BadgeStrip({
  icon: Icon,
  value,
  label,
}: {
  icon: any;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50/50 border border-slate-100/50 text-slate-700">
      <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-900">{value}</p>
        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}
