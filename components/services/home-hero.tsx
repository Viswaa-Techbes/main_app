"use client";

import Link from "@/components/ui/link";
import { Search, ShieldCheck, Sparkles, Star, Users } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

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
    <section className="relative overflow-hidden brand-hero-accent">
      <div className="absolute inset-0 -z-10 opacity-20" />
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
          <div className="relative z-10 w-full lg:w-1/2">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge className="rounded-full px-4 py-1.5 text-foreground bg-background border border-border">Premium IT marketplace for homes and businesses</Badge>
              <h1 className="mt-6 max-w-3xl ds-hero text-bal font-extrabold leading-tight">Book Verified IT Experts at Your Doorstep</h1>
              <p className="mt-4 max-w-2xl ds-body text-foreground-muted">From CCTV installations to enterprise networking and annual maintenance contracts — expert technicians, transparent pricing, and seamless booking, now in a premium experience.</p>

              <div className="mt-8 grid gap-4 sm:grid-cols-[1fr,auto]">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-muted" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    placeholder="What service do you need today?"
                    className="h-14 rounded-full border-transparent bg-white pl-12 pr-4 text-foreground shadow-none"
                  />
                  {isFocused && query && suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-50 rounded-3xl border border-border bg-background p-3 shadow-2xl backdrop-blur animate-in fade-in zoom-in-95 duration-200">
                      <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground-muted">Suggestions</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {suggestions.map((item) => (
                          <button
                            key={item}
                            className="rounded-full bg-background px-3 py-2 text-sm font-medium text-foreground transition hover:scale-[1.02] border border-border"
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
                <Button asChild size="lg" className="h-14 rounded-full px-8 text-base shadow-lg btn-primary">
                  <Link href="/services"><span>Find Services</span></Link>
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                {popularServiceChips.map((chip) => (
                  <Link
                    key={chip}
                    href="/services"
                    className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:scale-[1.02]"
                  >
                    <span>{chip}</span>
                  </Link>
                ))}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <TrustStat icon={Star} value="4.9 / 5" label="Average service rating" />
                <TrustStat icon={Users} value="2,500+" label="Verified field technicians" />
                <TrustStat icon={ShieldCheck} value="30 min" label="Average booking confirmation" />
              </div>
            </motion.div>
          </div>

          <div className="relative z-10 w-full lg:w-1/2">
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <Card variant="glass" className="mx-auto w-full max-w-2xl overflow-hidden glass-card">
                <CardContent className="p-0">
                  <div className="border-b border-border p-6">
                    <div className="flex items-center justify-between">
                      <Badge className="rounded-full px-3 py-1 text-foreground bg-background border border-border">Live booking pulse</Badge>
                      <Sparkles className="h-5 w-5 text-foreground-muted" />
                    </div>
                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                      <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-foreground-muted">Today</p>
                        <motion.p className="mt-2 text-4xl font-semibold text-foreground" initial={{ scale: 0.98 }} animate={{ scale: 1 }} transition={{ duration: 0.6 }}>128</motion.p>
                        <p className="mt-2 text-sm text-foreground-muted">Confirmed technician visits across top categories.</p>
                      </div>
                      <div className="rounded-3xl bg-background p-5 border border-border">
                        <p className="text-sm text-foreground-muted">Fastest slot</p>
                        <p className="mt-2 text-2xl font-semibold text-foreground">11:30 AM</p>
                        <p className="mt-3 text-sm text-foreground-muted">Available for networking, CCTV, and hardware repair.</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-4 p-6 sm:grid-cols-2">
                    <MetricCard title="Corporate AMC renewals" value="42" detail="High-intent plan renewals this week" />
                    <MetricCard title="Same-day dispatch" value="91%" detail="Across Bengaluru and Chennai zones" />
                    <MetricCard title="Repeat customers" value="67%" detail="Driven by AMC and branch expansion jobs" />
                    <MetricCard title="NPS sentiment" value="Excellent" detail="Service quality trending upward in Q2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustStat({ icon: Icon, value, label }: { icon: typeof Star; value: string; label: string }) {
  return (
    <div className="glass-card p-4 flex items-center gap-3">
      <div className="rounded-2xl bg-background p-2 text-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-lg font-semibold text-foreground">{value}</p>
        <p className="text-sm text-foreground-muted">{label}</p>
      </div>
    </div>
  );
}

function MetricCard({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 glass-card">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-3 text-2xl font-semibold text-foreground">{value}</p>
      <p className="mt-2 text-sm leading-6 text-foreground-muted">{detail}</p>
    </div>
  );
}
