"use client";

import { motion } from "framer-motion";
import { fadeIn, stagger } from "@/components/animations/motion-presets";

const stats = [
  {label: 'Technicians', value: '12k+'},
  {label: 'Bookings/year', value: '450k+'},
  {label: 'Avg rating', value: '4.8★'},
];

export default function TrustSection(){
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <motion.div variants={fadeIn} initial="hidden" whileInView="visible" className="rounded-2xl border border-border bg-card p-8 text-center">
        <h3 className="text-lg font-semibold text-foreground">Trusted by thousands — built for speed</h3>
        <p className="mt-2 text-muted-foreground">Enterprise reliability with consumer simplicity.</p>
        <motion.div variants={stagger} className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-3">
          {stats.map(s=> (
            <motion.div key={s.label} variants={fadeIn} className="rounded-xl bg-muted p-6">
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
