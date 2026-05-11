"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Clock3 } from "lucide-react";
import { motion } from "framer-motion";

export function ServiceCard({ service }: { service: any }) {
  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative overflow-hidden rounded-[28px] border border-white/8 bg-white/4"
    >
      <Link href={`/services/${service.slug}`} className="block">
        <div className="relative h-52 w-full overflow-hidden">
          <Image src={service.image} alt={service.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          {service.badge && (
            <span className="absolute left-4 top-4 rounded-full badge-orange">{service.badge}</span>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">{service.title}</h3>
            <div className="text-sm font-bold text-emerald-300">{service.price}</div>
          </div>
          <p className="mt-2 text-sm text-foreground/70">{service.tagline}</p>

          <div className="mt-4 flex items-center justify-between">
            <div className="inline-flex items-center gap-3 text-sm text-foreground/80">
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 text-amber-400" />
                {service.rating}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-4 w-4 text-emerald-300" />
                {service.duration}
              </span>
            </div>

            <div className="rounded-full px-4 py-2 text-sm font-semibold glow-cta">Book</div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default ServiceCard;
