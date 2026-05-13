"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { floatGlow, fadeIn, stagger } from "@/components/animations/motion-presets";
import HeroWidgets from "@/components/home/hero-widgets";

export default function PremiumHero({ onSearch }:{onSearch?: (q:string)=>void}){
  return (
    <header className="relative overflow-hidden bg-[linear-gradient(180deg,#0B1120,#071025)]">
      <div className="absolute inset-0 -z-10">
        <motion.div className="absolute -left-40 -top-28 h-[520px] w-[520px] rounded-full blur-3xl" variants={floatGlow} animate="animate" style={{ background: 'radial-gradient(circle at 20% 30%, rgba(37,99,235,0.16), transparent 30%), radial-gradient(circle at 80% 70%, rgba(249,115,22,0.08), transparent 30%)' }} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent)] pointer-events-none" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          {/* LEFT STACK */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full bg-[rgba(255,255,255,0.03)] px-3 py-1 text-sm font-semibold text-[#F97316]">Premium • Verified</div>

            <motion.h1 variants={fadeIn} initial="hidden" whileInView="visible" className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Book a <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2563EB] to-[#F97316]">Trusted Technician</span>
              <br />— Fast, Verified, Reliable
            </motion.h1>

            <motion.p variants={fadeIn} initial="hidden" whileInView="visible" transition={{ delay: 0.06 }} className="max-w-2xl text-lg text-[rgba(255,255,255,0.84)]">
              Enterprise-grade technicians for your home and business. Transparent pricing, rapid SLAs and verified experts — on-demand.
            </motion.p>

            <motion.div variants={stagger} initial="hidden" whileInView="visible" className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex w-full items-center rounded-full bg-[rgba(255,255,255,0.03)] p-1 sm:max-w-xl">
                <Search className="absolute left-4 h-5 w-5 text-[rgba(255,255,255,0.6)]" />
                <input
                  aria-label="Search services"
                  onKeyDown={(e)=>{ if(e.key==='Enter' && onSearch) onSearch((e.target as HTMLInputElement).value);}}
                  placeholder="Search services, e.g., CCTV, networking, AC repair"
                  className="w-full rounded-full bg-transparent py-3 pl-12 pr-4 text-sm text-white placeholder:text-[rgba(255,255,255,0.6)] outline-none"
                />
              </div>

              <div className="flex gap-3">
                <Button className="rounded-full bg-gradient-to-r from-[#F97316] to-[#2563EB] text-white shadow-2xl btn-magnetic glow-pulse" data-magnetic-btn>
                  Book a Technician
                </Button>
                <Button variant="outline" className="rounded-full text-white border-white/10 btn-magnetic" data-magnetic-btn>Explore Services</Button>
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
                  <div key={i} className="rounded-xl bg-[rgba(255,255,255,0.02)] p-3 text-center backdrop-blur-sm border border-white/6">
                    <div className="text-lg font-bold text-white">{s.label}</div>
                    <div className="text-xs text-[rgba(255,255,255,0.6)]">{s.sub}</div>
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
                    <div key={i} className="snap-center min-w-[72%] sm:min-w-[40%] rounded-xl bg-[rgba(255,255,255,0.02)] p-3 text-center backdrop-blur-sm border border-white/6">
                      <div className="text-lg font-bold text-white">{s.label}</div>
                      <div className="text-xs text-[rgba(255,255,255,0.6)]">{s.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT VISUAL */}
          <div className="relative flex items-center justify-center">
            <div className="relative mx-auto max-w-lg">
              <div className="rounded-3xl bg-gradient-to-br from-[rgba(255,255,255,0.02)] to-[rgba(255,255,255,0.01)] p-4 shadow-2xl backdrop-blur-sm">
                <Image src="/images/hero-services.png" alt="hero" width={740} height={520} className="rounded-2xl object-cover" priority />
              </div>

              {/* floating cluster */}
              <motion.div variants={stagger} initial="hidden" whileInView="visible" className="hidden sm:block absolute -right-6 -top-8 w-72">
                <motion.div variants={fadeIn} className="mb-4 rounded-2xl bg-gradient-to-br from-[#2563EB]/20 to-[#F97316]/10 p-3 shadow-xl border border-white/6">
                  <div className="text-xs font-semibold text-white">Live Bookings</div>
                  <div className="mt-2 text-sm font-bold text-white">23 active • 4 techs nearby</div>
                </motion.div>
                <motion.div variants={fadeIn} className="rounded-2xl bg-[rgba(255,255,255,0.02)] p-3 shadow-lg border border-white/6">
                  <div className="text-xs text-white/80">Top Service</div>
                  <div className="mt-1 text-sm font-semibold text-white">AC Repair — ₹499</div>
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
