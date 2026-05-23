"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Briefcase, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CareersStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-[var(--radius-xl)] px-8 py-16 text-center"
          style={{ background: 'var(--gradient-accent)' }}
      >
        {/* Abstract Background shapes */}
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-orange-600/20 blur-3xl" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/8">
            <Briefcase className="h-8 w-8 text-orange-400" />
          </div>
          
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Join the <span className="text-blue-400">Techbes</span> Expert Network
          </h2>
          
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Are you a certified IT technician or security specialist? Join India's fastest growing marketplace for verified IT services.
          </p>
          
          <div className="mt-10 flex flex-col items-center gap-6 sm:flex-row">
            <Button size="lg" variant="secondary" className="rounded-full h-14 px-10 font-bold text-lg" asChild>
              <Link href="/careers">
                  <span className="inline-flex items-center">Apply as Expert <ArrowRight className="ml-2 h-5 w-5" /></span>
                </Link>
            </Button>
            <Link href="/partners" className="text-sm font-semibold text-white hover:text-orange-400 transition-colors">
              <span>Become a Business Partner →</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
