"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { floatGlow, fadeIn, stagger } from "@/components/animations/motion-presets";
import HeroWidgets from "@/components/home/hero-widgets";

export default function PremiumHero({ onSearch }:{onSearch?: (q:string)=>void}){
  return (
    <header className="relative overflow-hidden bg-gradient-accent-light">
      <div className="absolute inset-0 -z-10">
        <motion.div className="absolute -left-40 -top-28 h-[520px] w-[520px] rounded-full blur-3xl" variants={floatGlow} animate="animate" style={{ background: 'radial-gradient(circle at 20% 30%, rgba(37,99,235,0.08), transparent 30%), radial-gradient(circle at 80% 70%, rgba(255,122,0,0.06), transparent 30%)' }} />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          {/* LEFT STACK */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold shadow-sm border border-border-primary">
              <span className="text-primary">✓ Premium</span>
              <span className="text-text-secondary">•</span>
              <span className="text-text-secondary">Verified</span>
            </div>

            <motion.h1 variants={fadeIn} initial="hidden" whileInView="visible" className="text-4xl font-bold leading-tight tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
              Book a <span className="gradient-text-primary">Trusted Technician</span>
              <br />— Fast, Verified, Reliable
            </motion.h1>

            <motion.p variants={fadeIn} initial="hidden" whileInView="visible" transition={{ delay: 0.06 }} className="max-w-2xl text-lg text-text-secondary leading-relaxed">
              Enterprise-grade technicians for your home and business. Transparent pricing, rapid SLAs and verified experts — on-demand.
            </motion.p>

            <motion.div variants={stagger} initial="hidden" whileInView="visible" className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex w-full items-center rounded-lg bg-white border border-border-primary shadow-sm sm:max-w-xl">
                <Search className="absolute left-4 h-5 w-5 text-text-muted" />
                <input
                  aria-label="Search services"
                  onKeyDown={(e)=>{ if(e.key==='Enter' && onSearch) onSearch((e.target as HTMLInputElement).value);}}
                  placeholder="Search services, e.g., CCTV, networking, AC repair"
                  className="w-full rounded-lg bg-transparent py-3 pl-12 pr-4 text-sm text-text-primary placeholder:text-text-muted outline-none"
                />
              </div>

              <div className="flex gap-3">
                <Button className="btn-primary rounded-lg whitespace-nowrap">
                  Book a Technician
                </Button>
                <Button className="btn-outline rounded-lg whitespace-nowrap">Explore Services</Button>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} initial="hidden" whileInView="visible" transition={{ delay: 0.12 }} className="mt-4">
              <div className="hidden sm:grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  {label: '10K+', sub: 'Bookings'},
                  {label: '500+', sub: 'Technicians'},
                  {label: '24/7', sub: 'Support'},
                  {label: '4.9', sub: 'Rating'},
                ].map((s, i) => (
                  <div key={i} className="rounded-lg bg-white p-4 text-center border border-border-light shadow-xs hover:shadow-md transition-shadow">
                    <div className="text-lg font-bold text-primary">{s.label}</div>
                    <div className="text-sm text-text-secondary mt-1">{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Mobile swipeable stats */}
              <div className="sm:hidden mt-2 -mx-4 pl-4">
                <div className="flex gap-3 overflow-x-auto snap-scroll snap-x py-2">
                  {[
                    {label: '10K+', sub: 'Bookings'},
                    {label: '500+', sub: 'Technicians'},
                    {label: '24/7', sub: 'Support'},
                    {label: '4.9', sub: 'Rating'},
                  ].map((s, i) => (
                    <div key={i} className="snap-center min-w-[72%] sm:min-w-[40%] rounded-lg bg-white p-4 text-center border border-border-light shadow-xs">
                      <div className="text-lg font-bold text-primary">{s.label}</div>
                      <div className="text-sm text-text-secondary mt-1">{s.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT VISUAL */}
          <div className="relative flex items-center justify-center">
            <div className="relative mx-auto max-w-lg">
              <div className="rounded-2xl bg-white p-4 shadow-lg border border-border-light">
                <Image src="/images/hero-services.png" alt="hero" width={740} height={520} className="rounded-xl object-cover" priority />
              </div>

              {/* floating cluster */}
              <motion.div variants={stagger} initial="hidden" whileInView="visible" className="hidden sm:block absolute -right-6 -top-8 w-72">
                <motion.div variants={fadeIn} className="mb-4 rounded-xl bg-white p-4 shadow-lg border border-border-primary">
                  <div className="text-xs font-semibold text-text-primary">Live Bookings</div>
                  <div className="mt-2 text-sm font-bold text-primary">23 active • 4 techs nearby</div>
                </motion.div>
                <motion.div variants={fadeIn} className="rounded-xl bg-bg-secondary p-4 shadow-md border border-border-light">
                  <div className="text-xs text-text-secondary">Top Service</div>
                  <div className="mt-1 text-sm font-semibold text-primary">AC Repair — ₹499</div>
                </motion.div>
              </motion.div>
              {/* enhanced widgets stack */}
              <div className="absolute -right-6 top-6 hidden sm:block w-80">
                <HeroWidgets />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
