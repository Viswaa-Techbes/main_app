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
        className="relative overflow-hidden rounded-[48px] bg-slate-900 px-8 py-16 text-center shadow-2xl"
      >
        {/* Abstract Background shapes */}
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-orange-600/20 blur-3xl" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-md">
            <Briefcase className="h-8 w-8 text-orange-400" />
          </div>
          
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Join the <span className="text-blue-400">Techbes</span> Expert Network
          </h2>
          
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Are you a certified IT technician or security specialist? Join India's fastest growing marketplace for verified IT services.
          </p>
          
          <div className="mt-10 flex flex-col items-center gap-6 sm:flex-row">
            <Button size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700 h-14 px-10 font-bold text-lg shadow-xl shadow-blue-600/20" asChild>
              <Link href="/careers">
                Apply as Expert
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Link href="/partners" className="text-sm font-semibold text-white hover:text-orange-400 transition-colors">
              Become a Business Partner →
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
