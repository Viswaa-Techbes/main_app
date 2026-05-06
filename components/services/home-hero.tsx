"use client";

import Link from "next/link";
import { Search, ShieldCheck, Sparkles, Star, Users } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { heroSuggestions, popularServiceChips } from "@/lib/marketplace-data";

export function HomeHero() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const suggestions = !query
    ? heroSuggestions
    : heroSuggestions.filter((item) => item.toLowerCase().includes(query.toLowerCase()));

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(59,130,246,0.2),transparent_28%),linear-gradient(180deg,#f8fffd_0%,#eef9ff_45%,#ffffff_100%)]" />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
        <div className="relative z-10 w-full lg:w-1/2 animate-fade-up">
          <Badge className="rounded-full bg-emerald-100 px-4 py-1.5 text-emerald-700 shadow-sm">
            Premium IT marketplace for homes and businesses
          </Badge>
          <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Book Verified IT Experts at Your Doorstep
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            From CCTV installations to enterprise networking and annual maintenance contracts, get trusted technicians, transparent pricing, and fast booking in one flow.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-[1fr,auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                placeholder="What service do you need today?"
                className="h-14 rounded-full border-white bg-white pl-12 pr-4 text-base shadow-[0_25px_60px_-30px_rgba(15,23,42,0.45)]"
              />
              {isFocused && query && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-50 rounded-3xl border border-slate-200 bg-white/95 p-3 shadow-2xl backdrop-blur animate-in fade-in zoom-in-95 duration-200">
                  <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Suggestions</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {suggestions.map((item) => (
                      <button
                        key={item}
                        className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                        onClick={() => {
                          setQuery(item);
                          setIsFocused(false);
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Button asChild size="lg" className="h-14 rounded-full px-8 text-base shadow-lg">
              <Link href="/services">
                Find Services
              </Link>
            </Button>
          </div>

          <div className="mt-20 flex flex-wrap gap-3">
            {popularServiceChips.map((chip) => (
              <Link
                key={chip}
                href="/services"
                className="rounded-full border border-emerald-100 bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
              >
                {chip}
              </Link>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <TrustStat icon={Star} value="4.9 / 5" label="Average service rating" />
            <TrustStat icon={Users} value="2,500+" label="Verified field technicians" />
            <TrustStat icon={ShieldCheck} value="30 min" label="Average booking confirmation" />
          </div>
        </div>

        <div className="relative z-10 w-full lg:w-1/2 animate-fade-up-delayed">
          <Card className="mx-auto w-full max-w-2xl overflow-hidden border-white/70 bg-white/85 shadow-[0_30px_90px_-35px_rgba(15,23,42,0.5)] backdrop-blur">
            <CardContent className="p-0">
              <div className="border-b border-slate-100 bg-[linear-gradient(135deg,#0f172a_0%,#0f766e_48%,#2563eb_100%)] p-8 text-white">
                <div className="flex items-center justify-between">
                  <Badge className="rounded-full bg-white/15 px-3 py-1 text-white">Live booking pulse</Badge>
                  <Sparkles className="h-5 w-5 text-emerald-200" />
                </div>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-white/70">Today</p>
                    <p className="mt-2 text-4xl font-semibold">128</p>
                    <p className="mt-2 text-sm text-white/75">Confirmed technician visits across top categories.</p>
                  </div>
                  <div className="rounded-3xl bg-white/10 p-5">
                    <p className="text-sm text-white/70">Fastest slot</p>
                    <p className="mt-2 text-2xl font-semibold">11:30 AM</p>
                    <p className="mt-3 text-sm text-white/80">Available for networking, CCTV, and hardware repair.</p>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 p-6 sm:grid-cols-2">
                <MetricCard
                  title="Corporate AMC renewals"
                  value="42"
                  detail="High-intent plan renewals this week"
                />
                <MetricCard
                  title="Same-day dispatch"
                  value="91%"
                  detail="Across Bengaluru and Chennai zones"
                />
                <MetricCard
                  title="Repeat customers"
                  value="67%"
                  detail="Driven by AMC and branch expansion jobs"
                />
                <MetricCard
                  title="NPS sentiment"
                  value="Excellent"
                  detail="Service quality trending upward in Q2"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </section>
  );
}

function TrustStat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Star;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-emerald-100 p-2 text-emerald-700">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-950">{value}</p>
          <p className="text-sm text-slate-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  detail,
}: {
  title: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-3 text-2xl font-semibold text-slate-950">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{detail}</p>
    </div>
  );
}
