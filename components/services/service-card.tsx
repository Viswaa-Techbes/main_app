"use client";

import Image from "next/image";
import ImageWithFade from "@/components/ui/image-fade";
import Link from "next/link";
import { Star, Clock3 } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn, hoverLift } from "@/components/animations/motion-presets";
import { Button } from "@/components/ui/button";

export function ServiceCard({ service }: { service: any }) {
  return (
    <motion.article
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      whileHover={hoverLift.hover}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="group relative overflow-hidden rounded-3xl border bg-card shadow-[0_18px_40px_-18px_rgba(11,76,255,0.12)] tilt glow-border"
    >
      <Link href={`/services/${service.slug}`} className="block">
        <div className="relative h-48 sm:h-52 w-full overflow-hidden">
          <ImageWithFade src={service.image} alt={service.title} fill className="object-cover transition-transform duration-600 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent mix-blend-multiply" />
          {service.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-[var(--primary)]/95 px-3 py-1 text-sm font-semibold text-white shadow-md">{service.badge}</span>
          )}
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">{service.title}</h3>
            <div className="text-sm font-bold text-foreground/85">{service.price}</div>
          </div>
          <p className="mt-2 text-sm text-foreground/70 line-clamp-2">{service.tagline}</p>

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

            <Button size="sm" variant="premium" className="rounded-full px-4 py-2">Book</Button>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default ServiceCard;
