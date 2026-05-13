"use client";

import { motion } from "framer-motion";
import ServiceCard from "../services/service-card";
import { stagger, fadeIn } from "@/components/animations/motion-presets";

export default function FeaturedServices({services}:{services:any[]}){
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">Featured services</h2>
          <p className="text-sm text-muted-foreground">Hand-picked for you</p>
        </div>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0,6).map((s)=> (
            <motion.div key={s.slug} variants={fadeIn} className="transition">
              <ServiceCard service={s} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
